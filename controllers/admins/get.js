const Admin = require('../../models/admins');

const getAdmins = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.adminAuth.id,
      code: req.adminAuth.code,
    });

    if (!admin) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    const admins = await Admin.find({}).select("name profile mainAdmin phone").sort({name: 1});
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const adminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.adminAuth.id,
      code: req.adminAuth.code,
    });

    if (!admin) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    const selectedAdmin = await Admin.findOne({_id: req.adminAuth.id}).select("name profile mainAdmin phone code");
    res.status(200).json(selectedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdmins,
  adminProfile
};
