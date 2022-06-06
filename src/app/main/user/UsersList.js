import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitForgotWithFireBase } from 'app/auth/store/forgotSlice';
import UsersTable from './UsersTable';

import { openEditUserDialog, selectUsers } from './store/usersSlice';

function UsersList(props) {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const searchText = useSelector(({ usersApp }) => usersApp.users.searchText);
  const user = useSelector(({ auth }) => auth.user.data);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        // Header: 'Display Image',
        accessor: 'user.picture',
        Cell: ({ row }) => {
          return <Avatar className="mx-8" alt={row.original.user.display} src={row.original.user.picture} />;
        },
        className: 'justify-center',
        width: 64,
        sortable: false,
      },
      {
        Header: 'First Name',
        accessor: 'user.firstname',
        className: 'font-medium',
        sortable: true,
      },
      {
        Header: 'Last Name',
        accessor: 'user.lastname',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Display Name',
        accessor: 'user.display',
        sortable: true,
      },

      {
        Header: 'Email',
        accessor: 'user.email',
        sortable: true,
      },

      // {
      //   Header: 'Mobile',
      //   accessor: 'user.mobile',
      //   sortable: true,
      // },

      // {
      //   Header: 'Gender',
      //   accessor: 'user.gender',
      //   sortable: true,
      // },

      {
        Header: 'Role',
        accessor: 'role',
        sortable: true,
      },

      {
        Header: 'Team',
        accessor: 'team.name',
        sortable: true,
      },
      {
        id: 'action',
        Header: 'Action',
        width: 32,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center flex-row">
            {row.original.user.email ? (
              <>
                <IconButton
                  onClick={(ev) => {
                    ev.stopPropagation();
                    dispatch(
                      submitForgotWithFireBase({
                        email: row.original.user.email,
                      })
                    );
                  }}
                  size="large"
                >
                  <Icon color="action">forward_to_inbox</Icon>
                </IconButton>

                {row.original.user.email !== user.email ? (
                  <IconButton
                    onClick={(ev) => {
                      ev.stopPropagation();
                      props.handleConfirmOpen(row.original);
                    }}
                    size="large"
                  >
                    <Icon color="action">delete</Icon>
                  </IconButton>
                ) : null}
              </>
            ) : null}
          </div>
        ),
      },
    ],
    [dispatch]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return users;
      }
      return FuseUtils.filterArrayByString(users, _searchText);
    }

    if (users) {
      setFilteredData(getFilteredArray(users, searchText));
    }
  }, [users, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no users!
        </Typography>
      </div>
    );
  }

  if (props.loading) {
    return <FuseLoading />;
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      <UsersTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            dispatch(openEditUserDialog(row.original));
          }
        }}
      />
    </motion.div>
  );
}

export default UsersList;
