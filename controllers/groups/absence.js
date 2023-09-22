const Group = require('../../models/groups');

const updateAbsence = async (req, res) => {
  try {
    const { groupId } = req.query;
    const absenceData = req.body;


    let group = await Group.findOne({
      _id: groupId,
      teacherOwner: req.teacherId,
    }).populate('students', 'name phone gender profile');

    absenceData.forEach((sId) => {
      let isExist = group.absentStudents.find((s) => s._id === sId);

      if (!isExist) {
        group.absentStudents.push({ _id: sId, absence: 1 });
      } else {
        group.absentStudents = group.absentStudents.map((el) =>
          el._id === isExist._id
            ? { ...isExist, absence: isExist.absence + 1 }
            : el
        );
      }
    });

    await group.save();
    res.status(200).json({ message: 'تم حفظ الغياب بنجاح', group });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateAbsence,
};
