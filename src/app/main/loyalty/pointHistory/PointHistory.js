import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import CustomerDialog from './CustomerDialog';
import PointHistoryHeader from './PointHistoryHeader';
import PointHistoryList from './PointHistoryList';
import reducer from '../store';
import { getPointHistory } from '../store/pointHistorySlice';

function PointHistory(props) {
  const dispatch = useDispatch();

  // const token = useSelector(({ auth }) => auth.user.token);
  // const org = useSelector(({ auth }) => auth.organization.current);
  // const [pointLogList, setPointLogList] = useState([]);
  // const [searchLogText, setSearchLogText] = useState('');

  useEffect(() => {
    dispatch(getPointHistory());
  }, []);

  // const getPointLogList = () => {
  //   try {
  //     axios
  //       .get(`/api/${org.id}/point/log/list`, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((result) => {
  //         const pointLogResult = result.data;
  //         setPointLogList(pointLogResult);
  //         console.log('[pointLogResult] ', pointLogResult);
  //       });
  //   } catch (error) {
  //     console.error('[getPointLogList] ', error);
  //   }
  // };

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
        header={<PointHistoryHeader />}
        content={<PointHistoryList />}

        // innerScroll
      />
    </>
  );
}

export default withReducer('loyaltyApp', reducer)(PointHistory);
