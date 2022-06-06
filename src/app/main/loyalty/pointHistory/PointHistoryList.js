import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
// import TeamsMultiSelectMenu from './TeamsMultiSelectMenu';
import PointLogTable from './PointLogTable';

import { selectPointHistory } from '../store/pointHistorySlice';

function PointHistoryList(props) {
  const dispatch = useDispatch();
  const pointHistory = useSelector(selectPointHistory);
  const searchText = useSelector(({ loyaltyApp }) => loyaltyApp.pointHistory.searchText);

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
        return pointHistory;
      }
      return FuseUtils.filterArrayByString(pointHistory, _searchText);
    }

    if (pointHistory) {
      setFilteredData(getFilteredArray(pointHistory, searchText));
    }
  }, [pointHistory, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no point history!
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

export default PointHistoryList;
