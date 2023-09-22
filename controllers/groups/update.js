const Group = require('../../models/groups');

const updateGroupData = async (req, res) => {
  const { name, time, day, level, gender, maxStudent } = req.body;

  const { groupId } = req.query;
  try {
    const groupIsExist = await Group.find({
      day,
      time,
      _id: {
        $ne: groupId,
      },
    });

    if (groupIsExist.length > 0) {
      return res.status(400).json({ message: 'يوجد مجموعة فى نفس الميعاد' });
    }

    const group = await Group.findOne({
      _id: groupId,
      teacherOwner: req.teacherId,
    });

    if (!group) {
      return res.json(401).json({ message: 'مستخدم غير موثوق' });
    }

    if (group.studentsNumber > maxStudent) {
      return res.status(400).json({
        message:
          'الحد الاقصى لعدد الطلاب غير مناسب مع عدد الطلاب فى هذه المجموعة',
      });
    }

    group.name = name || group.name;
    group.time = time || group.time;
    group.day = day || group.day;
    group.level = level || group.level;
    group.gender = gender || group.gender;
    group.maxStudent = maxStudent || group.maxStudent;

    await group.save();

    res.status(200).json({ message: 'تم تحديث بيانات المجموعة بنجاح', group });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  updateGroupData,
};
