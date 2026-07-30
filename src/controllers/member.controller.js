const Member = require('../models/member.model');
const ApiError = require('../utils/ApiError');

// Create a new library member
const createMember = async (req, res, next) => {
  try {
    const { name, email, phone, membershipType } = req.body;

    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      throw new ApiError(400, 'Member with this email already exists');
    }

    const member = await Member.create({
      name,
      email,
      phone,
      membershipType,
    });

    res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// Get all members with pagination, filtering, and search
const getAllMembers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, membershipType, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (membershipType) {
      filter.membershipType = membershipType;
    }

    if (status) {
      filter.status = status;
    }

    const [members, total] = await Promise.all([
      Member.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Member.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get member details by ID
const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      throw new ApiError(404, 'Member not found');
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// Update member by ID
const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      throw new ApiError(404, 'Member not found');
    }

    const { email } = req.body;
    if (email && email !== member.email) {
      const existingEmail = await Member.findOne({ email });
      if (existingEmail) {
        throw new ApiError(400, 'Member with this email already exists');
      }
    }

    Object.assign(member, req.body);
    await member.save();

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// Delete member by ID
const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      throw new ApiError(404, 'Member not found');
    }

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
