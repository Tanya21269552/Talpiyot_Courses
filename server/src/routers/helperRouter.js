const express = require("express");
const Course = require("../models/courseModel");
const Attendant = require("../models/attendantsModel");

const router = express.Router();
async function createAttendances(courses) {
  if (courses.length === 0) {
    // Base case: if there are no more courses to process, return
    return;
  }

  const course = courses[0];
  const students = course.students;
  const schedule = course.schedule;

  if (students.length === 0 && schedule.length === 0) {
    return;
  }

  for (let student of students) {
    student = student.toString();

    for (const scheduledClass of schedule) {
      // Create a new attendance record for the current student and schedule
      const attendance = new Attendant({
        courseId: course._id,
        student: student,
        class: scheduledClass._id,
        date: scheduledClass.date,
      });

      if (!attendance) continue;
      // Save the attendance record to the database
      await attendance.save();
    }
  }

  // Recursively process the remaining courses

  await createAttendances(courses.slice(1));
}

router.post("/helpers/createAttendanceForCourse", async function (req, res) {
  const courses = await Course.find().populate({
    path: "schedule",
    select: "id date",
  });

  createAttendances(courses);

  res.send(courses);
});

module.exports = router;
