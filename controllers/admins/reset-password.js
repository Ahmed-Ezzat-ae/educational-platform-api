const Admin = require('../../models/admins');
const bcrypt = require('bcryptjs');

const resetPassword = async (req, res) => {
  const resetData = req.body;
  try {
    const admin = await Admin.findOne({
      code: resetData.code,
    });

    if (!admin) {
      return res.status(400).json({ message: 'هذا الكود خاطئ ' });
    }

    const hashNewPassword = await bcrypt.hash(resetData.password, 10);

    admin.password = hashNewPassword;

    await admin.save();

    res.status(200).json({
      message: 'تم تحديث كلمة المرور',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.resetPassword = resetPassword;
