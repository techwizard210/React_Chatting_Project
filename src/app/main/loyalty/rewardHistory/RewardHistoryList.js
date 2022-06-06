import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
// import TeamsMultiSelectMenu from './TeamsMultiSelectMenu';
import PointLogTable from './RewardHistoryTable';

import { selectRewardHistory } from '../store/rewardHistorySlice';

function RewardHistoryList(props) {
  const dispatch = useDispatch();
  const rewardHistory = useSelector(selectRewardHistory);
  const searchText = useSelector(({ loyaltyApp }) => loyaltyApp.rewardHistory.searchText);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: 'Customer',
        accessor: 'customer',
        className: 'font-medium',
        sortable: true,
        Cell: (columnProps) => {
          if (columnProps.value) {
            return (
              <div className="flex flex space-x-14 items-center">
                <Avatar alt={columnProps.value.email} src={columnProps.value.picture} />
                <span>{columnProps.value.firstname}</span>
                <span>{columnProps.value.lastname}</span>
              </div>
            );
          }
          return <></>;
        },
      },

      {
        Header: 'Point',
        accessor: 'point',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Description',
        accessor: 'description',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Reward',
        accessor: 'reward',
        className: 'font-medium',
        sortable: true,
        Cell: (columnProps) => {
          if (columnProps.value) {
            return (
              <div className="flex flex space-x-14 items-center">
                {columnProps.value.imageURL ? (
                  <Avatar alt={columnProps.value.name} src={columnProps.value.imageURL} />
                ) : (
                  <Avatar className="md:mx-4">
                    <ShoppingCartIcon />
                  </Avatar>
                )}
                <span>{columnProps.value.name}</span>
              </div>
            );
          }
          return <></>;
        },
      },

      {
        Header: 'Created At',
        accessor: 'createdAt',
        sortable: true,
        Cell: (columnProps) => {
          return <span>{format(new Date(columnProps.value), 'PP')}</span>;
        },
      },
    ],
    [dispatch]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return rewardHistory;
      }
      return FuseUtils.filterArrayByString(rewardHistory, _searchText);
    }

    if (rewardHistory) {
      setFilteredData(getFilteredArray(rewardHistory, searchText));
    }
  }, [rewardHistory, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no reward history!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      <PointLogTable columns={columns} data={filteredData} />
    </motion.div>
  );
}

export default RewardHistoryList;
