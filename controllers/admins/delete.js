const Admin = require('../../models/admins');

const deleteAdmin = async (req, res) => {
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

    const deletedAdmin = await Admin.findByIdAndDelete(req.query.adminId);
    if (deletedAdmin) {
      res
        .status(200)
        .json({ message: 'تم حذف المسئول بنجاح', adminId: deletedAdmin._id });
    } else {
      res.status(400).json({ message: 'هناك خطا فى الحذف' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deleteAdmin,
};
