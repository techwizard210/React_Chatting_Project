import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import Typography from '@mui/material/Typography';

import ConfirmDeleteDialog from '../shared-components/ConfirmDeleteDialog';
import AddUserDialog from './components/AddUserDialog';
import UserDialog from './components/UserDialog';
import UsersHeader from './UsersHeader';
import UsersList from './UsersList';
import reducer from './store';

import { getUsers, getTeam, removeUser } from './store/usersSlice';

function UsersApp(props) {
  const dispatch = useDispatch();
  const organization = useSelector(({ auth }) => auth.organization.organization);

  const [loading, setLoading] = useState(true);

  // const pageLayout = useRef(null);
  useDeepCompareEffect(() => {
    if (organization) {
      dispatch(getUsers()).then(() => setLoading(false));
      dispatch(getTeam());
    }
  }, [dispatch, organization]);

  const [removeConfirm, setRemoveConfirm] = useState({
    open: false,
    data: {},
    content: '',
  });

  const handleConfirmOpen = (data) => {
    const content = data.user && data.user.email ? `Email: ${data.user.email}` : '';
    setRemoveConfirm({
      open: true,
      data,
      content,
    });
  };

  const handleConfirmClose = () => {
    setRemoveConfirm({
      open: false,
      data: {},
      content: '',
    });
  };

  const handleConfirm = (data) => {
    dispatch(removeUser(data));
    handleConfirmClose();
  };

  const ConfirmDialogContent = () => {
    return (
      <div className="flex flex-col p-8">
        <Typography sx={{ display: 'inline' }} component="span" variant="h6" color="text.primary">
          {removeConfirm.data.user ? `${removeConfirm.data.user.firstname} ${removeConfirm.data.user.lastname}` : ''}
        </Typography>

        <Typography sx={{ display: 'inline' }} component="span" variant="subtitle2" color="text.primary">
          {removeConfirm.data.user && removeConfirm.data.user.email}
        </Typography>
      </div>
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
        // }}
        header={<UsersHeader />}
        content={<UsersList handleConfirmOpen={handleConfirmOpen} loading={loading} />}

        // innerScroll
      />
      <UserDialog handleConfirmOpen={handleConfirmOpen} />
      <AddUserDialog />
      <ConfirmDeleteDialog
        open={removeConfirm.open}
        data={removeConfirm.data}
        title="Are you sure you want to delete this user?"
        content={<ConfirmDialogContent />}
        handleClose={handleConfirmClose}
        handleConfirm={handleConfirm}
      />
    </>
  );
}

export default withReducer('usersApp', reducer)(UsersApp);
