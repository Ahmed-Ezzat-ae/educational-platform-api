const Admin = require('../../models/admins');
const bcrypt = require('bcryptjs');
const { generateAdminToken } = require('../../utils/generateAdminToken');

const loginAdmin = async (req, res) => {
  const { code, password } = req.body;
  try {
    const admin = await Admin.findOne({
      code,
    });

    if (!admin) {
      return res.status(404).json({ message: 'هذا الكود غير صالح' });
    }

    const passIsCorrect = await bcrypt.compare(password, admin.password);
    if (!passIsCorrect) {
      return res.status(400).json({ message: 'كلمة المرور خاطئة' });
    }

    const token = generateAdminToken(admin)

    res.status(200).json({ message: 'تم تسجيل دخولك بنجاح', admin: {
      name: admin.name,
      profile: admin.profile
    }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
};
