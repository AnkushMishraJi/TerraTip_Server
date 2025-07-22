const catchAsync = require('../../utils/catchAsync');
const PasswordService = require('../../services/Admin/Invitation');

exports.generateInvitationLink = catchAsync(async (req, res, next) => {
    const body = req.body;
    const token = await PasswordService.generateToken(body);

    if (!token) {
        return res.status(500).json({
        status: 'error',
        message: 'Failed to generate invitation token',
        });
    }

    const resetLink = `${process.env.WEB_LINK}/client/user/validate?token=${token}`;
    

    res.status(201).json({
        status: 'success',
        data: resetLink,
    });
});