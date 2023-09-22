const Group = require('../../models/groups');

const deleteAllStudents = async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.query.groupId,
      teacherOwner: req.teacherId,
    });

    if (!group) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    group.students = [];
    await group.save();
    res.status(200).json({ message: 'تم حذف جميع الطلاب بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deleteAllStudents,
};
