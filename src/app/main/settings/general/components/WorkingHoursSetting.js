// import Typography from '@mui/material/Typography';
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

import { updateOrganization } from "../store/generalSlice";
import TimeRange from "./TimeRange";

const container = {
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

function WorkingHoursSetting() {
  const dispatch = useDispatch();
  const organization = useSelector(({ general }) => general.organization);

  const label = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const [value, setValue] = useState();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (organization && organization.organization) {
      setValue([
        organization.organization.sunday,
        organization.organization.monday,
        organization.organization.tuesday,
        organization.organization.wednesday,
        organization.organization.thursday,
        organization.organization.friday,
        organization.organization.saturday,
      ]);
      // console.log('### organization ', organization.organization);
      setMessage(organization.organization.workingHoursMessage);
    }
  }, [organization]);

  useEffect(() => {
    if (value) {
      console.log("value ", value);
    }
  }, [value]);
  /**
   * Form Submit
   */
  function onSubmit() {
    console.log("submit value ", value);
    if (value && value.length === 7) {
      const newOrganization = {
        ...organization.organization,
        sunday: value[0],
        monday: value[1],
        tuesday: value[2],
        wednesday: value[3],
        thursday: value[4],
        friday: value[5],
        saturday: value[6],
        workingHoursMessage: message,
      };
      dispatch(updateOrganization({ ...newOrganization }));
      // console.log('submit ', {
      //   ...organization,
      //   organization: {
      //     ...organization.organization,
      //     sunday: value[0],
      //     monday: value[1],
      //     tuesday: value[2],
      //     wednesday: value[3],
      //     thursday: value[4],
      //     friday: value[5],
      //     saturday: value[6],
      //   },
      // });
    }
  }

  function onTimeRangeChange(data, index) {
    console.log("Change data: ", data);
    console.log("Change index: ", index);
    const newValue = [...value];
    newValue[index] = data;
    setValue(newValue);
    // console.log('submit ', { ...organization, organization: { ...data } });
    // dispatch(updateOrganization({ ...organization, organization: { ...data } }));
    // dispatch(updateOrganization({ ...data }));
  }

  if (!organization || !value) {
    return <FuseLoading />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="md:flex m-1 md:m-24">
        <div className="flex flex-col flex-1">
          <Card
            component={motion.div}
            variants={item}
            className="w-full mb-12 rounded-16 shadow"
          >
            <AppBar position="static" elevation={0}>
              <Toolbar className="px-8">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex-1 px-12 font-medium"
                >
                  Working Hours
                </Typography>
                <Button
                  className="whitespace-nowrap mr-12"
                  variant="contained"
                  color="secondary"
                  onClick={onSubmit}
                >
                  <span className="hidden sm:flex">Save</span>
                  <span className="flex sm:hidden">Save</span>
                </Button>
              </Toolbar>
            </AppBar>

            <CardContent>
              {value.map((element, index) => {
                return (
                  <div key={index}>
                    <TimeRange
                      className="mb-24"
                      onChange={onTimeRangeChange}
                      label={label[index]}
                      id={index}
                      key={index}
                      value={element}
                    />
                    {/* {index < value.length - 1 && <Divider />} */}
                    <Divider />
                  </div>
                );
              })}

              <TextField
                id="whMessage"
                label="Working Hour Message"
                variant="outlined"
                value={message}
                multiline
                rows={3}
                onChange={(ev) => {
                  setMessage(ev.target.value);
                }}
                className="w-full mt-12"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default WorkingHoursSetting;
