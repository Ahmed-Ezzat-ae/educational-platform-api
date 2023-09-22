const Admin = require('../../models/admins');
const bcrypt = require('bcryptjs');

const createAdmin = async (req, res) => {
  const { name, profile, code, password, mainAdmin, phone } = req.body;
  try {
    if (!req.adminAuth.mainAdmin) {
      return res.status(400).json({ message: 'انت لست المسئول الرئيسى' });
    }

    const isExist = await Admin.findOne({
      code
    });

    if (isExist) {
      return res.status(400).json({
        message: 'هذا الكود غير صالح',
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await new Admin({
      name,
      code,
      password: hashPassword,
      profile,
      mainAdmin,
      phone
    }).save();

    res.status(201).json({
      message: 'تم انشاء مسئول جديد بنجاح',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAdmin,
};
