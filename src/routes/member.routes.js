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

router
  .route('/')
  .post(createMemberValidator, validate, createMember)
  .get(queryMemberValidator, validate, getAllMembers);

router
  .route('/:id')
  .get(getMemberByIdValidator, validate, getMemberById)
  .put(updateMemberValidator, validate, updateMember)
  .delete(getMemberByIdValidator, validate, deleteMember);

module.exports = router;
