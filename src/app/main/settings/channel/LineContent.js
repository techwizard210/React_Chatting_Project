import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Paper from "@mui/material/Paper";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import format from "date-fns/format";

import { useMemo, useState } from "react";

import {
  openEditLineChannelDialog,
  removeLineChannel,
} from "./store/channelsSlice";

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  table: {
    minWidth: 650,
  },
});

function LineContent(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const line = useSelector(({ channels }) => channels.line);

  const [removeConfirm, setRemoveConfirm] = useState({
    open: false,
    data: {},
  });

  const handleConfirmOpen = (data) => {
    setRemoveConfirm({
      open: true,
      data,
    });
  };

  const handleConfirmClose = () => {
    setRemoveConfirm({
      open: false,
      data: {},
    });
  };

  const handleConfirm = () => {
    dispatch(removeLineChannel(removeConfirm.data));
    setRemoveConfirm({
      open: false,
      data: {},
    });
  };

  const ConfirmDialog = () => {
    return (
      <Dialog
        open={removeConfirm.open}
        onClose={handleConfirmClose}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this Channel?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {removeConfirm.data.name}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div className="w-full flex flex-col space-y-14">
      {useMemo(() => {
        return (
          line &&
          (line.length > 0 ? (
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Channel Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Updated Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {line.map((row) => (
                    <TableRow
                      key={row.id}
                      onClick={() => {
                        if (row) {
                          // console.log(row);
                          dispatch(openEditLineChannelDialog(row));
                        }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.line.name}
                      </TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>
                        {format(new Date(row.createdAt), "PP")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(row.updatedAt), "PP")}
                      </TableCell>
                      <TableCell>
                        {/* <Switch
                        checked={row.status === 'active'}
                        // onChange={handleChange}
                        color="primary"
                        name="checkedB"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      /> */}
                        <IconButton
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleConfirmOpen(row);
                            // dispatch(removeLineChannel(row));
                          }}
                          size="large"
                        >
                          <Icon>delete</Icon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <Typography color="textSecondary" className="text-24 my-24">
                No LINE channel found!
              </Typography>
            </div>
          ))
        );
      }, [line])}

      <ConfirmDialog />
    </div>
  );
}

export default LineContent;
