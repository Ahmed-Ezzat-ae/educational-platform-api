// const Group = require('../../models/groups');
// const Student = require('../../models/students');

// const leaveGroup = async (req, res) => {
//   const { groupId } = req.query;

//   try {
//     const student = await Student.findOne({
//       _id: req.studentId,
//       code: req.studentCode,
//     });

//     if (!student) {
//       return res.status(401).json({ message: 'مستخدم غير موثوق' });
//     }

//     const group = await Group.findOne({
//       _id: groupId,
//     });

//     group.students = group.students.filter(
//       (s) => s._id.toString() !== req.studentId
//     );

//     await group.save();

//     res.status(200).json({ message: 'تمت مغاده المجموعة بنجاح', group });
//   } catch (error) {
//     res.status(500).json({ message: error });
//   }
// };

// module.exports = {
//   leaveGroup,
// };
