const Admin = require('../../models/admins');
const bcrypt = require('bcryptjs');

const updateAdmin = async (req, res) => {
  const { adminId } = req.query;

  try {
    const admin = await Admin.findOne({
      _id: req.adminAuth.id,
      code: req.adminAuth.code,
    });

    if (!admin) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    if (!admin.mainAdmin) {
      return res.status(400).json({ message: 'انت لست المسئول الرئيسى' });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      {
        ...req.body,
      },
      { new: true }
    );

    res.status(200).json({ message: 'تم تحديث البيانات بنجاح', updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { password, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({
      _id: req.adminAuth.id,
      code: req.adminAuth.code,
    });

    if (!admin) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    const checkPassword = await bcrypt.compare(password, admin.password);
    if (!checkPassword) {
      return res.status(400).json({ message: 'كلمة المرور خاطئة' });
    }

    const hashedPassword = newPassword
      ? await bcrypt.hash(newPassword, 10)
      : admin.password;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      admin._id,
      {
        ...req.body,
        password: hashedPassword,
      },
      { new: true }
    ).select('name profile code phone');

    res.status(200).json({ message: 'تم تحديث البيانات بنجاح', updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateAdmin,
  updateProfile,
};
