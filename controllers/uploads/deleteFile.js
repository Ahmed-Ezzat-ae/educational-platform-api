const Group = require('../../models/groups');

const deleteUploadFile = async (req, res) => {
  const { groupId, fileName, lessonName } = req.query;

  try {
    const group = await Group.findOne({
      _id: groupId,
      teacherOwner: req.teacherId,
    });

    const lessonIndex = group.studentStudy.findIndex(
      (l) => l.lessonName === lessonName
    );

    if (fileName.endsWith('.mp4')) {
      group.studentStudy[lessonIndex].videos = group.studentStudy[
        lessonIndex
      ].videos.filter((v) => v !== fileName);
    } else {
      group.studentStudy[lessonIndex].pdfs = group.studentStudy[
        lessonIndex
      ].pdfs.filter((f) => f !== fileName);
    }

    await group.save();

    res.json({ message: 'تم حذف هذا الملف بنجاح', group: group.studentStudy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUploadLesson = async (req, res) => {
  const { groupId, lessonName } = req.query;

  try {
    const group = await Group.findOne({
      _id: groupId,
      teacherOwner: req.teacherId,
    });

    group.studentStudy = group.studentStudy.filter(
      (l) => l.lessonName !== lessonName
    );

    await group.save();

    res.json({ message: 'تم حذف هذا الدرس بنجاح', group: group.studentStudy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  deleteUploadFile,
  deleteUploadLesson,
};
