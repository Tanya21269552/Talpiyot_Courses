import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { CourseContext } from "Context/courseContext";
import { editCourseStudentList, getList } from "server/db";
import { updateStudentsInCourse } from "Reducers/Actions/CourseAction";

export default function AddStudentsForm() {
  const { courseData, courseDispatch } = useContext(CourseContext);

  const [studentData, setStudentData] = React.useState([]);
  const [nonParticipantStudents, setNonParticipantStudents] = React.useState(
    []
  );
  console.log("DDD");
  useEffect(() => {
    let render = true;
    if (render) {
      getList("students").then((dataList) => {
        setStudentData([...dataList]);
        console.log(studentData);
        const newList = mapList([...dataList]);
        setNonParticipantStudents(newList);
      });
    }
    return () => {
      render = false;
    };
  }, []);

  //
  function mapList(allStudents, id = "") {
    const assignedIDs = [...courseData.students].map((student) => student._id);

    console.log(assignedIDs);
    //FIXME: why courseData is noy updated?
    if (id !== "") assignedIDs.push(id);
    let unassigned = allStudents.filter((student) => {
      return !assignedIDs.includes(student._id);
    });
    //

    return unassigned;
  }

  function onClickAddStudent(_id) {
    editCourseStudentList(courseData._id, _id, "addStudent").then((res) => {
      courseDispatch(updateStudentsInCourse({ ...res }));
      console.log(studentData);
      const newList = mapList([...studentData], _id);
      setNonParticipantStudents(newList);
    });
  }

  return (
    <div>
      <form>
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Add Students
          </Typography>

          <TextField id="name" label="student Name" fullWidth />

          {/* <Button variant="contained" type="submit">
            add student
          </Button> */}
          <Box sx={{ height: 300, overflow: "auto" }}>
            <List dense={true}>
              {nonParticipantStudents.length > 0 ? (
                nonParticipantStudents.map((student, i) => {
                  const studentId = student._id;
                  return (
                    <ListItem
                      key={i}
                      className="on-hover"
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="add"
                          onClick={() => onClickAddStudent(studentId)}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={student.firstName + " " + student.lastName}
                        secondary={student.email}
                      />
                    </ListItem>
                  );
                })
              ) : (
                <Typography style={{ textAlign: "center" }}>
                  ...not found
                </Typography>
              )}
            </List>
          </Box>
        </Stack>
      </form>
    </div>
  );
}
