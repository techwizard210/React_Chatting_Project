import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

function ConfirmDeleteDialog(props) {
  /**
   * props @args
   * open: open state of dialog
   * data: data for delete
   * handleClose: handle close callback function
   * handleConfirm: handle confirm callback function
   * content: body text that show on dialog
   */

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {props.title ? props.title : 'Are you sure you want to delete this item?'}
      </DialogTitle>
      <DialogContent>{props.content}</DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.handleConfirm(props.data);
          }}
          color="primary"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteDialog;
