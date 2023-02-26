import {
  Button,
  FormControl,
  TextField,
  TextareaAutosize,
  createTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUnattendedClasses, submitUnAttendanceReason } from "server/student";
import { getSimpleTime } from "utils/dates";
import { getSimpleDate } from "../../../utils/dates";

export default function UnattendedPage() {
  const [unAttendedClasses, setUnattendedClasses] = useState([]);

  useEffect(() => {
    let render = true;
    if (render)
      getUnattendedClasses().then((data) => {
        if (Array.isArray(data)) {
          setUnattendedClasses(data);
        }
      });
    return () => {
      render = false;
    };
  }, []);

  function onSubmitUpdateReason(attendanceId, reason, i) {
    submitUnAttendanceReason(attendanceId, reason).then((data) => {
      if (!data) return;
      let copy = [...unAttendedClasses];
      copy.splice(i, 1);
      setUnattendedClasses([...copy]);
    });
  }

  const theme = createTheme();

  return (
    <div>
      <h2>
        Unattended classes{" "}
        <span style={{ color: "red" }}>{unAttendedClasses.length}</span>
      </h2>

      {unAttendedClasses.length > 0 &&
        unAttendedClasses.map((classExpectingReason, i) => (
          <div key={i} style={{ borderBottom: "1px solid black" }}>
            <h3>{classExpectingReason.class.name}</h3>
            <div
              style={{
                display: "flex",
                gap: "2rem",
              }}
            >
              <p>Date: {getSimpleDate(classExpectingReason.class.date)}</p>
              <p>
                Time:
                {getSimpleTime(classExpectingReason.class.startTime)} -{" "}
                {getSimpleTime(classExpectingReason.class.endTime)}
              </p>
            </div>

            {!classExpectingReason.reasonUpdated && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const thisForm = e.target;
                  const reason = thisForm.elements[0].value.trim();
                  if (reason !== "")
                    onSubmitUpdateReason(classExpectingReason._id, reason, i);
                  thisForm.elements[0].value = "";
                }}
              >
                <FormControl
                  sx={{
                    flexDirection: "row",
                    display: "flex",
                    gap: "1rem",
                    [theme.breakpoints.down("sm")]: {
                      flexDirection: "column",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    label="Write the reason you didn't attend to class"
                    InputProps={{
                      inputComponent: TextareaAutosize,
                      rows: 3,
                    }}
                  />
                  <Button variant="contained" color="primary" type="submit">
                    Submit Reason
                  </Button>
                </FormControl>
              </form>
            )}
            <br />
            <br />
          </div>
        ))}
    </div>
  );
}
