import FusePageCarded from '@fuse/core/FusePageCarded';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import withReducer from 'app/store/withReducer';
import reducer from '../store';
import CategoriesHeader from './CategoriesHeader';
import CategoriesList from './CategoriesList';

import { removeCategory } from '../store/categorySlice';

function Categories() {
  const dispatch = useDispatch();
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
    dispatch(removeCategory(removeConfirm.data.id));
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
        <DialogTitle id="alert-dialog-title">Are you sure you want to delete this item?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{removeConfirm.data.name}</DialogContentText>
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
    <>
      <FusePageCarded
        classes={{
          content: 'flex flex-col h-full',
          contentCard: 'overflow-hidden',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
        }}
        header={<CategoriesHeader />}
        content={<CategoriesList handleConfirmOpen={handleConfirmOpen} />}
        innerScroll
      />
      <ConfirmDialog />
    </>
  );
}

export default withReducer('woocommerceApp', reducer)(Categories);
