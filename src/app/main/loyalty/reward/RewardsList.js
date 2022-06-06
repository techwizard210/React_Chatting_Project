import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Typography from '@mui/material/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
// import TeamsMultiSelectMenu from './TeamsMultiSelectMenu';
import RewardsTable from './RewardsTable';

import {
  openEditRewardDialog,
  // removeTeam,
  // toggleStarredContact,
  // selectTeams,
  selectRewards,
} from '../store/rewardsSlice';

function TeamsList(props) {
  const dispatch = useDispatch();
  const rewards = useSelector(selectRewards);
  const searchText = useSelector(({ loyaltyApp }) => loyaltyApp.rewards.searchText);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        // Header: 'Image',
        accessor: 'imageURL',
        Cell: ({ row }) => {
          if (row.original.imageURL) {
            return <Avatar alt={row.original.name} src={row.original.imageURL} />;
          }
          return (
            <Avatar>
              <ShoppingCartIcon />
            </Avatar>
          );
        },
        className: 'justify-center',
        width: 64,
        sortable: false,
      },
      {
        Header: 'Name',
        accessor: 'name',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Point',
        accessor: 'point',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Stock',
        accessor: 'stock',
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
        Header: 'Status',
        accessor: 'status',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Updated At',
        accessor: 'updatedAt',
        sortable: true,
        Cell: (columnProps) => {
          return <span>{format(new Date(columnProps.value), 'PP')}</span>;
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

      {
        id: 'action',
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                // dispatch(removeTeam(row.original.id));
                props.handleConfirmOpen(row.original);
              }}
              size="large"
            >
              <Icon>delete</Icon>
            </IconButton>
          </div>
        ),
      },
    ],
    [dispatch]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return rewards;
      }
      return FuseUtils.filterArrayByString(rewards, _searchText);
    }

    if (rewards) {
      setFilteredData(getFilteredArray(rewards, searchText));
    }
  }, [rewards, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no rewards!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      <RewardsTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            dispatch(openEditRewardDialog(row.original));
          }
        }}
      />
    </motion.div>
  );
}

export default TeamsList;
