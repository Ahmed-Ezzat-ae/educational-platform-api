const mongoose = require('mongoose');


const studySchema = new mongoose.Schema({
  lessonName: String,
  videos: [String],
  pdfs: [String],
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  },
  teacherOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
  },
});

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    day: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    studentsNumber: {
      type: Number,
      default: 0,
    },

    teacherOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },

    absentStudents: [],

    maxStudent: {
      type: Number,
      default: 1,
    },

    studentStudy: [studySchema],

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware to update studentsNumber when adding a new student
schema.pre('save', function (next) {
  // Calculate the studentsNumber based on the length of the students array
  this.studentsNumber = this.students.length;
  next(); // Continue with the save operation
});

const Group = mongoose.model('Group', schema);
module.exports = Group;
