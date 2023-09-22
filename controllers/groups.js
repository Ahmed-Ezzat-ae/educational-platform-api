const Group = require('../models/groups');
const Teacher = require('../models/teachers');
const Student = require('../models/students');

const createGroupe = async (req, res) => {

  const { name, time, day, gender, level, maxStudent } = req.body;
  try {
    const group = await Group.findOne({
      teacherOwner: req.teacherId,
      time,
      day,
    });

    if (group) {
      return res.status(400).json({ message: 'تم انشاء هذه المجموعة من قبل' });
    }

    const teacher = await Teacher.findOne({
      _id: req.teacherId,
      code: req.teacherCode,
    });

    if (!teacher) {
      res.status(401).json({ message: 'مستخدم غير موثوق' });
    }
    await new Group({
      name,
      time,
      day,
      level,
      gender,
      maxStudent,
      teacherOwner: req.teacherId,
      absentStudents: [],
    }).save();

    return res.status(201).json({ message: 'تم انشاء المجموعة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const properStudentGroups = async (req, res) => {
  const { teacherId, level, gender } = req.query;
  try {
    const student = await Student.findOne({
      _id: req.studentId,
      code: req.studentCode,
    });

    if (!student) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    const groups = await Group.find({
      teacherOwner: teacherId,
      level,
      gender,
    }).select("name time day studentsNumber maxStudent students studentStudy teacherOwner").collation({ locale: 'ar', strength: 1 });

    if (groups.length === 0) {
      return res
        .status(404)
        .json({ message: 'لم يتم انشاء اى مجموعة حتى الان' });
    }

    return res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

/* join student to a group */
const joinToGroup = async (req, res) => {
  const { id } = req.params;
  const { teacherOwner } = req.query;
  try {
    let student = await Student.findOne({
      _id: req.studentId,
      code: req.studentCode,
    });

    if (!student) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    const groups = await Group.find({
      level: student.level,
      gender: student.gender,
      teacherOwner,
    });

    const isStudentExist = groups.some((group) => {
      return group.students.some(
        (student) => student.toString() === req.studentId
      );
    });

    if (isStudentExist) {
      return res.status(401).json({ message: 'انت منضم الى مجموعة اخري' });
    }

    const group = await Group.findById(
      id
    ); /* if exist return {} if not exist return error */

    // Check if the studentId already exists in the students array
    if (
      !group.students.includes(req.studentId) &&
      group.studentsNumber < group.maxStudent
    ) {
      // Add the studentId to the students array
      group.students.push(req.studentId);
      // Save the updated group document
      await group.save();
      return res.status(200).json({ message: 'تم الانضمام بنجاح' });
    } else {
      return res
        .status(400)
        .json({ message: 'أنت باالفعل منضم الى هذه المجموعة' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* Get group level one */
const getGroupeLevelOne = async (req, res) => {
  try {
    const levels = await Group.find({
      level: {
        $in: ['المستوى الاول', 'المستوى الأول'],
      },
      teacherOwner: req.teacherId,
    }).select("name day level gender maxStudent").collation({ locale: 'ar', strength: 1 });

    if (levels.length === 0) {
      return res
        .status(404)
        .json({ message:  'لم يتم انشاء المجوعات حتى الان للمستوى الاول' });
    }

    return res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get group level two */
const getGroupeLevelTwo = async (req, res) => {
  try {
    const levels = await Group.find({
      level: {
        $in: ['المستوى الثاني', 'المستوى الثانى'],
      },
      teacherOwner: req.teacherId,
    }).select("name day level gender maxStudent").collation({ locale: 'ar', strength: 1 });
    if (levels.length === 0) {
      return res
        .status(404)
        .json({ message: 'لم يتم انشاء المجوعات حتى الان للمستوى الثانى' });
    }

    return res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get group level three */
const getGroupeLevelThree = async (req, res) => {
  try {
    const levels = await Group.find({
      level: 'المستوى الثالث',
      teacherOwner: req.teacherId,
    }).select("name day level gender maxStudent").collation({ locale: 'ar', strength: 1 });
    if (levels.length === 0) {
      return res
        .status(404)
        .json({ message: 'لم يتم انشاء المجوعات حتى الان للمستوى الثالث' });
    }

    return res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteGroupLevelOne = async (req, res) => {
  const { groupId } = req.query;

  try {
    /* findOneAndDelete return the found document, if not found return null */
    /*
    ![] ,  !{}  => false 
    !null, !NaN, !undefined => true
    */
    const deletedGroup = await Group.findOneAndDelete({
      _id: groupId,
      teacherOwner: req.teacherId,
      level: { $in: ['المستوى الأول', 'المستوى الاول'] },
    });

    if (!deletedGroup) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    return res
      .status(200)
      .json({ message: 'تم حذف المجموعة بنجاح', deletedGroup });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteGroupLevelTwo = async (req, res) => {
  const { groupId } = req.query;

  try {
    const deletedGroup = await Group.findOneAndDelete({
      _id: groupId,
      teacherOwner: req.teacherId,
      level: { $in: ['المستوى الثانى', 'المستوى الثاني'] },
    });

    if (!deletedGroup) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    return res
      .status(200)
      .json({ message: 'تم حذف المجموعة بنجاح', deletedGroup });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteGroupLevelThree = async (req, res) => {
  const { groupId } = req.query;

  try {
    const deletedGroup = await Group.findOneAndDelete({
      _id: groupId,
      teacherOwner: req.teacherId,
      level: 'المستوى الثالث',
    });

    if (!deletedGroup) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    return res
      .status(200)
      .json({ message: 'تم حذف المجموعة بنجاح', deletedGroup });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const groupDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findOne(
      {
        _id: id,
        teacherOwner: req.teacherId,
      },
      'name time day studentsNumber absentStudents maxStudent'
    ).populate('students', 'name phone gender profile level');

    if (!group) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    res.status(200).json(group);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGroupe,
  properStudentGroups,
  joinToGroup,
  getGroupeLevelOne,
  getGroupeLevelTwo,
  getGroupeLevelThree,
  deleteGroupLevelOne,
  deleteGroupLevelTwo,
  deleteGroupLevelThree,
  groupDetails,
};
