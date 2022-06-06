import FuseLoading from "@fuse/core/FuseLoading";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import TextareaAutosize from '@mui/material/TextareaAutosize';

import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";

import {
  editResponse,
  changeResponseOrder,
  removeResponse,
  removeResponseOrder,
} from "../../store/responseSlice";
import TextEditor from "./editor/TextEditor";
import ImageEditor from "./editor/ImageEditor";
import ButtonsEditor from "./editor/ButtonsEditor";
import CarouselEditor from "./editor/CarouselEditor";
import ConfirmEditor from "./editor/ConfirmEditor";
import FlexEditor from "./editor/FlexEditor";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ResponseEditor(props) {
  const dispatch = useDispatch();
  const { responseIndex } = props;
  const [tabPosition, setTabPosition] = useState(0);

  const responses = useSelector(({ replyApp }) => replyApp.response.data);
  const currentResponses = useSelector(
    ({ replyApp }) => replyApp.response.current
  );

  useEffect(() => {
    if (responses && responses[responseIndex]) {
      setTabPosition(
        tabMenu.find((menu) => menu.type === responses[responseIndex].type).key
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responses, responseIndex]);

  const handleSelectChange = (event) => {
    const newTabPosition = event.target.value;
    const { type } = tabMenu[newTabPosition];
    if (
      responses[responseIndex] &&
      responses[responseIndex].type &&
      responses[responseIndex].type === type
    ) {
      dispatch(
        editResponse({
          index: responseIndex,
          response: { ...responses[responseIndex] },
        })
      );
    } else {
      dispatch(
        editResponse({
          index: responseIndex,
          response: { ...responses[responseIndex], type, data: null },
        })
      );
    }
    setTabPosition(newTabPosition);
  };

  const tabMenu = [
    { key: 0, label: "Text", type: "text" },
    { key: 1, label: "Image", type: "image" },
    { key: 2, label: "Buttons", type: "buttons" },
    { key: 3, label: "Confirm", type: "confirm" },
    { key: 4, label: "Carousel", type: "carousel" },
    { key: 5, label: "Flex Message", type: "flex" },
  ];

  if (!responses) return <FuseLoading />;

  return (
    <Paper variant="outlined" elevation={3} className="w-full mb-12 p-12">
      <Box sx={{ width: "100%" }}>
        <div className="flex flex-row justify-between w-full space-x-1">
          <div className="flex flex-col min-w-200 pl-16">
            <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }}>
              <InputLabel id="demo-simple-select-label">
                Response Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tabPosition}
                label="Response Type"
                onChange={handleSelectChange}
              >
                {tabMenu.map((element) => (
                  <MenuItem value={element.key} key={element.key}>
                    {element.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col sm:flex-row">
              <IconButton
                aria-label="Up"
                // onClick={() => {
                //   onOrderChange(responseIndex, -1);
                // }}
                onClick={() => {
                  dispatch(
                    changeResponseOrder({ index: responseIndex, change: -1 })
                  );
                }}
                size="large"
              >
                <KeyboardArrowUpIcon />
              </IconButton>
              <IconButton
                aria-label="Down"
                // onClick={() => {
                //   onOrderChange(responseIndex, 1);
                // }}
                onClick={() => {
                  dispatch(
                    changeResponseOrder({ index: responseIndex, change: 1 })
                  );
                }}
                size="large"
              >
                <KeyboardArrowDownIcon />
              </IconButton>
            </div>
            <IconButton
              aria-label="Down"
              // onClick={() => {
              //   onResponseRemove(responses[responseIndex]);
              // }}
              onClick={() => {
                if (responses[responseIndex].id) {
                  dispatch(removeResponse(responses[responseIndex].id));
                } else {
                  dispatch(removeResponseOrder(responses[responseIndex].order));
                }
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </Box>
      <TabPanel value={tabPosition} index={0}>
        <TextEditor
          responseIndex={responseIndex}
          response={responses[responseIndex]}
          // current={current[responseIndex]}
        />
      </TabPanel>
      <TabPanel value={tabPosition} index={1}>
        <ImageEditor
          responseIndex={responseIndex}
          response={responses[responseIndex]}
          // current={current[responseIndex]}
        />
      </TabPanel>
      <TabPanel value={tabPosition} index={2}>
        <ButtonsEditor
          responseIndex={responseIndex}
          response={responses[responseIndex]}
          // current={current[responseIndex]}
        />
      </TabPanel>
      <TabPanel value={tabPosition} index={3}>
        <ConfirmEditor
          responseIndex={responseIndex}
          response={responses[responseIndex]}
          // current={current[responseIndex]}
        />
      </TabPanel>
      <TabPanel value={tabPosition} index={4}>
        <CarouselEditor
          responseIndex={responseIndex}
          response={responses[responseIndex]}
          // current={current[responseIndex]}
        />
      </TabPanel>
      <TabPanel value={tabPosition} index={5}>
        <FlexEditor
          responseIndex={responseIndex}
          response={responses[responseIndex]}
          // current={current[responseIndex]}
        />
      </TabPanel>
    </Paper>
  );
}

export default ResponseEditor;
