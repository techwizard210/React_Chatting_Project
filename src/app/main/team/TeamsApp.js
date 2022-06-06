import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';

import ConfirmDeleteDialog from '../shared-components/ConfirmDeleteDialog';
import TeamDialog from './TeamDialog';
import TeamsHeader from './TeamsHeader';
import TeamsList from './TeamsList';
import reducer from './store';
import { getTeams, removeTeam } from './store/teamsSlice';

function TeamsApp(props) {
  const dispatch = useDispatch();
  const organization = useSelector(({ auth }) => auth.organization.organization);

  const [removeConfirm, setRemoveConfirm] = useState({
    open: false,
    data: {},
    content: '',
  });

  const handleConfirmOpen = (data) => {
    const content = data && data.name ? `Team: ${data.name}` : '';
    console.log('handleConfirmOpen ', data);
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
    dispatch(removeTeam(data.id));
    handleConfirmClose();
  };

  useDeepCompareEffect(() => {
    if (organization) dispatch(getTeams());
  }, [dispatch, organization]);

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
        header={<TeamsHeader />}
        content={<TeamsList handleConfirmOpen={handleConfirmOpen} />}
      />
      <TeamDialog />
      <ConfirmDeleteDialog
        open={removeConfirm.open}
        data={removeConfirm.data}
        title="Are you sure you want to delete this user?"
        content={removeConfirm.content}
        handleClose={handleConfirmClose}
        handleConfirm={handleConfirm}
      />
    </>
  );
}

export default withReducer('teamsApp', reducer)(TeamsApp);
