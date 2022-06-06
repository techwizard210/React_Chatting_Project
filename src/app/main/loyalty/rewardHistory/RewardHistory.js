import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import CustomerDialog from './CustomerDialog';
import RewardHistoryHeader from './RewardHistoryHeader';
import RewardHistoryList from './RewardHistoryList';
import reducer from '../store';
import { getRewardHistory } from '../store/rewardHistorySlice';

function RewardHistory(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRewardHistory());
  }, []);

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
        header={<RewardHistoryHeader />}
        content={<RewardHistoryList />}

        // innerScroll
      />
    </>
  );
}

export default withReducer('loyaltyApp', reducer)(RewardHistory);
