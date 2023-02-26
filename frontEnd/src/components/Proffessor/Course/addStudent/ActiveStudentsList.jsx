import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { CourseContext } from "Context/courseContext";
import { IconButton, ListItem } from "@mui/material";
import { editCourseStudentList } from "server/db";
import { updateStudentsInCourse } from "Reducers/Actions/CourseAction";

export default function NestedList() {
  const { courseData, courseDispatch } = React.useContext(CourseContext);

  //
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  function onClickDeleteItem(id) {
    editCourseStudentList(courseData._id, id, "removeStudent").then((res) => {
      courseDispatch(updateStudentsInCourse({ ...res }));
    });
  }

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Students on this course:{" "}
          <span style={{ color: "red", fontSize: "bigger" }}>
            {" "}
            {courseData.students.length}
          </span>
        </ListSubheader>
      }
    >
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Students" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {courseData.students !== undefined
            ? courseData.students.map((listItem, i) => {
                return (
                  <ListItem
                    key={i}
                    className="on-hover flex-half"
                    style={{ width: "100%" }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => {
                          onClickDeleteItem(listItem._id);
                        }}
                      >
                        <PersonRemoveIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={listItem.firstName + " " + listItem.lastName}
                      secondary={listItem.email}
                    />
                  </ListItem>
                );
              })
            : "no participants"}
        </List>
      </Collapse>
    </List>
  );
}
