import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import RewardDialog from './RewardDialog';
import RewardsHeader from './RewardsHeader';
import RewardsList from './RewardsList';
import reducer from '../store';
import { getRewards, removeReward } from '../store/rewardsSlice';

function Rewards(props) {
  const dispatch = useDispatch();
  const organization = useSelector(({ auth }) => auth.organization.organization);

  // const pageLayout = useRef(null);
  useDeepCompareEffect(() => {
    if (organization) dispatch(getRewards());
  }, [dispatch, organization]);

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
    dispatch(removeReward(removeConfirm.data.id));
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
          contentWrapper: 'p-0 sm:p-24 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
          wrapper: 'min-h-0',
        }}
        header={<RewardsHeader />}
        content={<RewardsList handleConfirmOpen={handleConfirmOpen} />}

        // innerScroll
      />
      <ConfirmDialog />
      <RewardDialog />
    </>
  );
}

export default withReducer('loyaltyApp', reducer)(Rewards);
