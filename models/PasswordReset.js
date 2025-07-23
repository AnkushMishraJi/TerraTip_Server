const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
    used: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
