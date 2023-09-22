const Group = require('../../models/groups');
const path = require('path');

const getGroupEContent = async (req, res) => {
  const { groupId } = req.query;

  try {

    const group = await Group.findOne({
      _id: groupId,
      students: {
        $in: [req.studentId],
      },
    });

    if (!group) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    res.status(200).json(group.studentStudy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadGroupEContent = async (req, res) => {
  const { groupId } = req.query;
  try {
    const group = await Group.findOne({
      _id: groupId,
    });

    /* when i use protect in routing, an authentication message appears when download pdf  */ 
    // const group = await Group.findOne({
    //   _id: groupId,
    //   students: {
    //     $in: [req.studentId],
    //   },
    // });

    if (!group) {
      return res.status(401).json({ message: 'مستخدم غير موثوق' });
    }

    res.download(
      path.resolve(
        __dirname,
        '../',
        '../',
        'public',
        req.query.teacherId,
        'pdfs',
        req.query.filename
      )
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGroupEContent,
  downloadGroupEContent,
};
