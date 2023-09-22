const Student = require('../models/students');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/generateToken');

const createStudent = async (req, res) => {
  const { name, phone, code, password, profile, level, gender } = req.body;
  try {
    const isExist = await Student.findOne({ code });
    if (isExist) {
      return res.status(400).json({ message: 'تم التسجيل بهذا الكود من قبل' });
    }

    await new Student({
      name,
      phone,
      code,
      profile,
      level,
      gender,
      password: bcrypt.hashSync(password, 10),
    }).save();

    return res.status(201).json({ message: 'تم انشاء حسابك بنجاح' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginStudent = async (req, res) => {
  const { code, password } = req.body;
  try {
    const student = await Student.findOne({
      code,
    });
    if (!student) {
      return res.status(404).json({
        message: 'هذا الكود غير صحيح',
      });
    }

    const correctPassword = bcrypt.compareSync(password, student.password);

    if (!correctPassword) {
      return res.status(400).json({ message: 'كلمة المرور خاطئة' });
    }

    const token = generateToken(student);

    res.status(200).json({
      message: 'تم تسجيل دخولك بنجاح',
      data: {
        name: student.name,
        profile: student.profile,
        level: student.level,
        gender: student.gender,
        _id: student._id,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const studentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.studentId,
    }).select('name profile phone code');

    if (!student) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const {  oldPassword, newPassword } = req.body;

  try {
    const student = await Student.findById(req.studentId);
    if (!student) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    const checkPassword = await bcrypt.compare(oldPassword, student.password);
    if (!checkPassword) {
      return res.status(400).json({ message: 'كلمة المرور خاطئة' });
    }

    const hashNewPassword = newPassword.length
      ? await bcrypt.hash(newPassword, 10)
      : student.password;

    const updatedProfile = await Student.findByIdAndUpdate(
      req.studentId,
      {
        ...req.body,
        password: hashNewPassword,
      },
      { new: true }
    ).select('name profile code phone');


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
    const student = await Student.findOne({
      code: resetData.code,
    });

    if (!student) {
      return res.status(400).json({ message: 'هذا الكود خاطئ ' });
    }

    const hashNewPassword = await bcrypt.hash(resetData.password, 10);

    student.password = hashNewPassword;

    await student.save();

    res.status(200).json({
      message: 'تم تحديث كلمة المرور',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  loginStudent,
  resetPassword,
  updateProfile,
  studentProfile,
};
