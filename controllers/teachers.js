const Group = require('../models/groups');
const Teacher = require('../models/teachers');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/generateToken');

const createTeacher = async (req, res) => {
  const { name, phone, code, password, profile, material } = req.body;
  try {
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
      password: bcrypt.hashSync(password, 10),
    }).save();

    return res.status(201).json({ message: 'تم انشاء حسابك بنجاح' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginTeacher = async (req, res) => {
  const { code, password } = req.body;
  try {
    const teacher = await Teacher.findOne({
      code,
    }); /* if not found return null => !null === true */
    if (!teacher) {
      return res.status(404).json({
        message: 'هذا الكود غير صحيح',
      });
    }

    const correctPassword = bcrypt.compareSync(password, teacher.password);

    if (!correctPassword) {
      return res.status(400).json({ message: 'كلمة المرور خاطئة' });
    }

    const token = generateToken(teacher);

    res.status(200).json({
      message: 'تم تسجيل دخولك بنجاح',
      data: {
        name: teacher.name,
        profile: teacher.profile,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({}).select(
      '_id name phone profile material'
    );
    if (teachers.length > 0) {
      return res.status(200).json(teachers);
    } else {
      return res.status(404).json({ message: 'لا يوجد معلمين حتى الان' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

const groupUploads = async (req, res) => {
  const { groupId } = req.query;

  try {
    const group = await Group.findOne({
      _id: groupId,
      teacherOwner: req.teacherId,
    });

    if (!group) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    res.status(200).json(group.studentStudy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const teacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      _id: req.teacherId,
    }).select('name profile material phone code');

    if (!teacher) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const teacher = await Teacher.findById(req.teacherId);
    if (!teacher) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    const checkPassword = await bcrypt.compare(oldPassword, teacher.password);
    if (!checkPassword) {
      return res.status(400).json({ message: 'كلمة المرور خاطئة' });
    }

    const hashNewPassword = newPassword.length
      ? await bcrypt.hash(newPassword, 10)
      : teacher.password;

    const updatedProfile = await Teacher.findByIdAndUpdate(
      req.teacherId,
      {
        ...req.body,
        password: hashNewPassword,
      },
      { new: true }
    ).select('name profile code phone material');

    res.status(200).json({
      message: 'تم تحديث البيانات بنجاح',
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const resetData = req.body;
  try {
    const teacher = await Teacher.findOne({
      code: resetData.code,
    });

    if (!teacher) {
      return res.status(400).json({ message: 'هذا الكود خاطئ ' });
    }

    const hashNewPassword = await bcrypt.hash(resetData.password, 10);

    teacher.password = hashNewPassword;

    await teacher.save();

    res.status(200).json({
      message: 'تم تحديث كلمة المرور',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  loginTeacher,
  groupUploads,
  teacherProfile,
  updateProfile,
  resetPassword,
};
