import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
import TeamsTable from './TeamsTable';

import { openEditTeamDialog, selectTeams } from './store/teamsSlice';

function TeamsList(props) {
  const dispatch = useDispatch();
  const teams = useSelector(selectTeams);
  const searchText = useSelector(({ teamsApp }) => teamsApp.teams.searchText);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: 'Team',
        accessor: 'name',
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
        Header: 'Action',
        width: 32,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
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
        return teams;
      }
      return FuseUtils.filterArrayByString(teams, _searchText);
    }

    if (teams) {
      setFilteredData(getFilteredArray(teams, searchText));
    }
  }, [teams, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no teams!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      <TeamsTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            dispatch(openEditTeamDialog(row.original));
          }
        }}
      />
    </motion.div>
  );
}

export default TeamsList;
