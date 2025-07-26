const catchAsync = require('../../utils/catchAsync');
const PasswordService = require('../../services/Admin/invitation');

exports.generateInvitationLink = catchAsync(async (req, res) => {
  const { body } = req;
  const link = await PasswordService.generateLink(body);
  res.status(201).json({
    data: link,
  });
});
