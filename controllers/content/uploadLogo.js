const Content = require('../../models/content');
const Admin = require('../../models/admins');


const uploadLogo = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.adminAuth.id,
      code: req.adminAuth.code,
    });

    if (!admin) {
      return res.status(400).json({ message: 'مستخدم غير موثوق' });
    }

    if (!req.file.filename.endsWith('.png')) {
      return res.status(400).json({ message: 'هذا الملف غير صالح' });
    }

    const content = await Content.findOne({});
    if (content) {
      content.logoImg = req.file?.filename || content?.logoImg;
      await content.save();
    } else {
      await new Content({
        logoImg: req.file?.filename,
        title: '',
        desc: '',
        descImg: '',
      }).save();
    }

    res.status(201).json({ message: 'تم رفع الملف بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadDescImg = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.adminAuth.id,
      code: req.adminAuth.code,
    });

    if (!admin) {
      return res.status(400).json({ message: 'مستخدم غير موثوق' });
    }

    if (req.file?.filename) {
      if (!req.file?.filename.endsWith('.jpg')) {
        return res.status(400).json({ message: 'هذا الملف غير صالح' });
      }
    }

    const content = await Content.findOne({});
    if (content) {
      content.descImg = req.file?.filename || content?.descImg;
      content.title = req.body?.title || content?.title;
      content.desc = req.body?.desc || content?.desc;
      await content.save();
    } else {
      await new Content({
        logoImg: '',
        title: '',
        desc: '',
        descImg: req.file.filename,
      }).save();
    }

    res.status(201).json({ message: 'تم رفع الملف بنجاح' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const contentData = async (req, res) => {
  try {
    const content = await Content.findOne({});
    if (!content) {
      return res.status(404).json({ message: 'لا يوجد محتوى تم اضافتة' });
    }

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadLogo,
  uploadDescImg,
  contentData,
};
