const Group = require('../../models/groups');

const getAvailableGroups = async (req, res) => {
  const { level, gender, _id } = req.query;
  try {
    let groups = await Group.find({
      level,
      gender,
      teacherOwner: req.teacherId,
      students: {
        $nin: [_id],
      },
    });

    
    groups = groups.filter(group => group.studentsNumber < group.maxStudent)


    if (!groups) {
      return res.status(404).json({ message: 'لا يوجد مجموعات مناسبة للنقل' });
    }

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const moveStudentToGroup = async (req, res) => {
  const { studentId, oldGroupId, newGroupId } = req.body;

  try {
    let currentGroup = await Group.findOne({
      _id: oldGroupId,
      teacherOwner: req.teacherId,
    });

    let newGroup = await Group.findOne({
      _id: newGroupId,
      teacherOwner: req.teacherId,
    });

    newGroup.students.push(studentId);
    currentGroup.students = currentGroup.students.filter(
      (sId) => sId.toString() !== studentId
    );

    /* if not found return undefined  */
    let studentAbsence = currentGroup.absentStudents.find(
      (s) => s._id === studentId
    );

    if (studentAbsence) {
      newGroup.absentStudents.push(studentAbsence);
      currentGroup.absentStudents = currentGroup.absentStudents.filter(
        (s) => s._id !== studentId
      );
    }

    await currentGroup.save();
    await newGroup.save();
    res
      .status(200)
      .json({ message: 'تم نقل الطالب بنجاح', group: currentGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  moveStudentToGroup,
  getAvailableGroups,
};
