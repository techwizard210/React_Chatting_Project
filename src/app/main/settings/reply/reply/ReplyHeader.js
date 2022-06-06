import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateReply } from "../store/replySlice";
import { getReplies } from "../store/repliesSlice";
// import ConfirmRemoveReplyDialog from '../components/ConfirmRemoveReplyDialog';
// import { openConfirmRemoveReplyDialog } from '../store/repliesSlice';

function ReplyHeader(props) {
  const dispatch = useDispatch();
  const reply = useSelector(({ replyApp }) => replyApp.reply.data);
  const theme = useTheme();
  const navigate = useNavigate();

  function handleSaveReply() {
    dispatch(updateReply());
    dispatch(getReplies);
  }

  // function handleRemoveReply(ev) {
  //   // ev.stopPropagation();
  //   // props.handleConfirmOpen(n);
  //   dispatch(openConfirmRemoveReplyDialog(reply)).then(() => {
  //     history.push('/settings/reply');
  //   });
  // }

  return (
    <div className="flex flex-1 w-full items-center justify-between">
      {/* <ConfirmRemoveReplyDialog /> */}
      <div className="flex flex-col items-start max-w-full min-w-0">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
          <Typography
            className="flex items-center sm:mb-12"
            component={Link}
            role="button"
            to="/settings/reply"
            color="inherit"
          >
            <Icon className="text-20">
              {theme.direction === "ltr" ? "arrow_back" : "arrow_forward"}
            </Icon>
            <span className="hidden sm:flex mx-4 font-medium">Replies</span>
          </Typography>
        </motion.div>
        <div className="flex items-center max-w-full">
          <div className="flex flex-col min-w-0 mx-8 sm:mc-16">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {reply && reply.name ? reply.name : "New Reply"}
              </Typography>
              <Typography variant="caption" className="font-medium">
                {reply && reply.type === "auto" && "Auto Reply"}
                {reply && reply.type === "quick" && "Quick Reply"}
              </Typography>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          // disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleSaveReply}
          startIcon={<Icon className="hidden sm:flex">save</Icon>}
        >
          Save
        </Button>
        {/* <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="error"
          onClick={handleRemoveReply}
          startIcon={<Icon className="hidden sm:flex">delete</Icon>}
        >
          Remove
        </Button> */}
      </motion.div>
    </div>
  );
}

export default ReplyHeader;
