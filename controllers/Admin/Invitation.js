const catchAsync = require('../../utils/catchAsync');
const PasswordService = require('../../services/Admin/Invitation');

exports.generateInvitationLink = catchAsync(async (req, res) => {
    const body = req.body;
    const link = await PasswordService.generateLink(body);
    res.status(201).json({
        data: link,
    });
});