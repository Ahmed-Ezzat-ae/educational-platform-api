const Teacher = require('../../models/teachers');
const Admin = require('../../models/admins');
const bcrypt = require('bcryptjs');
const Group = require('../../models/groups');
const { deleteFolder } = require('../../utils/deleteFolder');
const path = require('path');

const getTeachers = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.adminAuth.id,
      code: req.adminAuth.code,
    });

    if (!admin) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    const teachers = await Teacher.find({}, 'name profile phone material').sort(
      { name: 1 }
    );
    if (teachers.length === 0) {
      return res.status(400).json({ message: 'لا يوجد معلمين حتى الان' });
    }

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTeacher = async (req, res) => {
  const { name, phone, code, password, profile, material } = req.body;
  try {
    const admin = await Admin.findOne({
      _id: req.adminAuth.id,
      code: req.adminAuth.code,
    });

    if (!admin) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    const isExist = await Teacher.findOne({ code });
    if (isExist) {
      return res.status(400).json({ message: 'تم التسجيل بهذا الكود من قبل' });
    }

    await new Teacher({
      name,
      phone,
      code,
      profile,
      material,
      password: await bcrypt.hash(password, 10),
    }).save();

    return res.status(201).json({ message: 'تم اضافة معلم جديد' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteTeacher = async (req, res) => {
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

    deleteFolder(
      path.resolve(__dirname, '../', '../', 'public', req.query.teacherId)
    );
    await Group.deleteMany({ teacherOwner: req.query.teacherId });
    const teacher = await Teacher.findByIdAndDelete(req.query.teacherId);

    if (teacher) {
      res
        .status(200)
        .json({ message: 'تم حذف المعلم بنجاح', teacherId: teacher._id });
    } else {
      res.status(400).json({ message: 'هناك خطا فى الحذف' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeachers,
  createTeacher,
  deleteTeacher,
};
