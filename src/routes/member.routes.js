const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
} = require('../controllers/member.controller');
const {
  createMemberValidator,
  updateMemberValidator,
  getMemberByIdValidator,
  queryMemberValidator,
} = require('../validators/member.validator');

/**
 * @openapi
 * /members:
 *   post:
 *     summary: Register a new library member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMemberInput'
 *     responses:
 *       201:
 *         description: Member registered successfully
 *       400:
 *         description: Validation error or duplicate email
 *   get:
 *     summary: Get all library members with pagination and search
 *     tags: [Members]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name, email, or phone
 *       - in: query
 *         name: membershipType
 *         schema: { type: string, enum: [standard, premium, student] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, inactive, suspended] }
 *     responses:
 *       200:
 *         description: List of members retrieved successfully
 */
router
  .route('/')
  .post(createMemberValidator, validate, createMember)
  .get(queryMemberValidator, validate, getAllMembers);

/**
 * @openapi
 * /members/{id}:
 *   get:
 *     summary: Get member by ID
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Member details
 *       404:
 *         description: Member not found
 *   put:
 *     summary: Update member by ID
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMemberInput'
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       404:
 *         description: Member not found
 *   delete:
 *     summary: Delete member by ID
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *       404:
 *         description: Member not found
 */
router
  .route('/:id')
  .get(getMemberByIdValidator, validate, getMemberById)
  .put(updateMemberValidator, validate, updateMember)
  .delete(getMemberByIdValidator, validate, deleteMember);

module.exports = router;
