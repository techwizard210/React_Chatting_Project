import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { closeConfirmRemoveReplyDialog } from "../store/repliesSlice";
import { removeReply } from "../store/replySlice";
import { getReplies } from "../store/repliesSlice";

function ConfirmRemoveReplyDialog(props) {
  //   const { open, data, handleConfirmClose } = props;
  const dispatch = useDispatch();
  const dialogParams = useSelector(
    ({ replyApp }) => replyApp.replies.confirmRemoveReplyDialog
  );

  const handleRemoveConfirm = () => {
    dispatch(removeReply(dialogParams.data.id));
    dispatch(closeConfirmRemoveReplyDialog());
    // dispatch(getReplies());
  };

  return (
    <Dialog
      {...dialogParams.props}
      onClose={() => {
        dispatch(closeConfirmRemoveReplyDialog());
      }}
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Do you want to delete this reply?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogParams.data && dialogParams.data.name}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            dispatch(closeConfirmRemoveReplyDialog());
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button onClick={handleRemoveConfirm} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmRemoveReplyDialog;
