const Group = require('../../models/groups');

const uploadFiles = async (req, res) => {
  const { groupId } = req.query;
  const { lessonName } = req.body;
  try {
    const group = await Group.findOne({
      _id: groupId,
      teacherOwner: req.teacherId,
    });

    if (!group) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    if (
      req.file.mimetype === 'video/mp4' ||
      req.file.mimetype === 'application/pdf'
    ) {
      const uploadIsExist = group.studentStudy.find(
        (upload) => upload.lessonName === lessonName
      );

      if (uploadIsExist) {
        const videoIsExist = uploadIsExist.videos.includes(req.file.filename);
        const pdfIsExist = uploadIsExist.pdfs.includes(req.file.filename);
        if (videoIsExist || pdfIsExist) {
          return res.status(400).json({ message: 'هذا الملف تم رفعة من قبل' });
        } else {
          if (req.file.mimetype === 'video/mp4') {
            uploadIsExist.videos = [...uploadIsExist.videos, req.file.filename];
          } else {
            uploadIsExist.pdfs = [...uploadIsExist.pdfs, req.file.filename];
          }
        }
      } else {
        group.studentStudy.push({
          lessonName,
          videos: req.file.mimetype === 'video/mp4' ? [req.file.filename] : [],
          pdfs:
            req.file.mimetype === 'application/pdf' ? [req.file.filename] : [],
          groupId,
          teacherOwner: req.teacherId,
         
        });
      }

      await group.save();
      res.status(200).json({ message: 'تم رفع الملف بنجاح' });
    } else {
      return res.status(400).json({ message: ' هذا الملف غير صالح' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  uploadFiles,
};

