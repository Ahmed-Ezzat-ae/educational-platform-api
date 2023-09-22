const Group = require('../../models/groups');

const deleteStudentFromGroup = async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.query.groupId,
      teacherOwner: req.teacherId,
    }).populate('students', 'name phone gender profile');

    if (!group) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    const updatedStudents = group.students.filter(
      (student) => student._id.toString() !== req.query.studentId
    );

    // Remove the corresponding entry from the "absentStudents" array
    group.absentStudents = group.absentStudents.filter(
      (absentStudent) => absentStudent._id.toString() !== req.query.studentId
    );

    // Update the "students" and "absentStudents" arrays in the document
    group.students = updatedStudents;

    await group.save();
    res.status(200).json({ message: 'تم حذف الطالب بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deleteStudentFromGroup,
};
