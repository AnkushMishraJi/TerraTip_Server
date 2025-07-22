const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const { invitationLink } = require("../../validation/Admin/invitation");
const invitationController = require("../../controllers/Admin/Invitation");

router.post('/generate-link', validate(invitationLink), invitationController.generateInvitationLink);

module.exports = router;