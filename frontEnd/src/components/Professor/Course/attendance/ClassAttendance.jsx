import React, { useContext, useEffect } from "react";
import { getCourseAttendance } from "server/attendance";
import { CourseContext } from "Context/courseContext";
import { isStartDateBeforeEndDate } from "utils/dates";
import SecondLevelCollapse from "components/Professor/attendance/secondLevelList";
import { useNavigate } from "react-router-dom";

export default function ClassAttendance() {
  const navigate = useNavigate();
  const { courseData } = useContext(CourseContext);
  const [classAttendance, setClassAttendance] = React.useState([]);

  const passedClasses = [];
  const futureClasses = [];

  for (const classData of courseData.schedule) {
    if (isStartDateBeforeEndDate(classData.date, new Date()))
      passedClasses.push(classData);
    else futureClasses.push(classData);
  }

  useEffect(() => {
    let rendered = true;
    if (rendered) {
      getCourseAttendance(courseData.id)
        .then((data) => {
          let classAttendances = [];
          if (data.length > 0) {
            classAttendances = data.map((classAttendanceData) => {
              const attendanceData = classAttendanceData.data;
              const attendees = [];
              const absentees = [];
              for (const attendanceObject of attendanceData) {
                if (attendanceObject.attended)
                  attendees.push({
                    student: attendanceObject.student,
                    attendedAt: attendanceObject.attendedAt,
                  });
                else
                  absentees.push({
                    student: attendanceObject.student,
                    reasonUpdatedAt: attendanceObject.attendedAt
                      ? attendanceObject.attendedAt
                      : "",
                    reason: attendanceObject.reason
                      ? attendanceObject.reason
                      : "",
                  });
              }

              ////
              ///
              ///
              const classId = classAttendanceData.classId;

              const classData = passedClasses.find(
                (item) => item._id === classId
              );
              return {
                class: {
                  date: classData.dateAndTime.date,
                  time: classData.dateAndTime.time,
                },
                attendees,
                absentees,
                passed: true,
              };
            });
          }
          const futureClassesCustomize = futureClasses.map((item) => {
            return {
              class: {
                date: item.dateAndTime.date,
                time: item.dateAndTime.time,
              },

              passed: false,
            };
          });

          setClassAttendance([...classAttendances, ...futureClassesCustomize]);
        })
        .catch((err) => {
          navigate(`/error/${err.message}`);
        });
    }

    return () => {
      rendered = false;
    };
  }, []);

  return (
    <div>
      <h4 style={{ textDecoration: "underline", textAlign: "center" }}>
        Class attendance
      </h4>

      {classAttendance.length > 0 ? (
        <div>
          <SecondLevelCollapse classesData={classAttendance} />
        </div>
      ) : (
        "to view attendance add students and classes"
      )}
    </div>
  );
}
