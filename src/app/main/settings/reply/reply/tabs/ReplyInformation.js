import FuseLoading from "@fuse/core/FuseLoading";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { updateData } from "../../store/replySlice";

function ReplyInformation(props) {
  const dispatch = useDispatch();
  const reply = useSelector(({ replyApp }) => replyApp.reply.data);
  const currentReply = useSelector(({ replyApp }) => replyApp.reply.current);

  const [information, setInformation] = useState();
  const [type, setType] = useState("quick");
  const [event, setEvent] = useState("response");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (currentReply) {
      setInformation(currentReply.name);
      setType(currentReply.type);
      setEvent(currentReply.event);
      setStatus(currentReply.status);
    }
  }, [currentReply]);

  function updateReply(key, value) {
    const newReply = { ...reply };
    newReply[key] = value;
    dispatch(updateData(newReply));
  }

  if (!currentReply) return <FuseLoading />;

  return (
    <div className="flex flex-col w-full space-y-24 px-20 ">
      <TextField
        // value={replyInformation && replyInformation.name}
        value={information}
        className="mt-8"
        required
        label="Name"
        autoFocus
        id="name"
        variant="outlined"
        fullWidth
        onChange={(ev) => {
          updateReply("name", ev.target.value);
          setInformation(ev.target.value);
        }}
      />

      <FormControl variant="outlined" className="w-full m-0">
        <InputLabel>Type</InputLabel>
        <Select
          // value={replyInformation && replyInformation.type}
          value={type}
          label="Type"
          id="type"
          fullWidth
          onChange={(ev) => {
            updateReply("type", ev.target.value);
            setType(ev.target.value);
          }}
        >
          <MenuItem value="quick">Quick Reply</MenuItem>
          <MenuItem value="auto">Auto Reply</MenuItem>
        </Select>
      </FormControl>

      {type && type === "auto" && event && (
        // {replyInformation && replyInformation.type && replyInformation.type === 'auto' && replyInformation.event && (
        <FormControl variant="outlined" className="w-full">
          <InputLabel>Event</InputLabel>
          <Select
            // value={replyInformation.event || 'response'}
            value={event}
            defaultValue="response"
            label="Event"
            id="event"
            fullWidth
            onChange={(ev) => {
              updateReply("event", ev.target.value);
              setEvent(ev.target.value);
            }}
          >
            {/* <MenuItem value="welcome">Welcome</MenuItem> */}
            <MenuItem value="response">Response</MenuItem>
          </Select>
        </FormControl>
      )}

      <FormControl variant="outlined" className="w-full">
        <InputLabel>Status</InputLabel>
        <Select
          // value={replyInformation && replyInformation.status}
          value={status}
          label="Status"
          id="status"
          fullWidth
          onChange={(ev) => {
            updateReply("status", ev.target.value);
            setStatus(ev.target.value);
          }}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          {/* <MenuItem value="delete">Delete</MenuItem> */}
        </Select>
      </FormControl>
    </div>
  );
}

export default ReplyInformation;
