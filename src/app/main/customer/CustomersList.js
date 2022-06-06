import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
import history from '@history';
import CustomersTable from './CustomersTable';

import { selectCustomers } from './store/customersSlice';

function CustomersList(props) {
  const dispatch = useDispatch();
  const customers = useSelector(selectCustomers);
  const searchText = useSelector(({ customersApp }) => customersApp.customers.searchText);

  const [filteredData, setFilteredData] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: 'Avatar',
        accessor: 'avatar',
        Cell: ({ row }) => {
          return <Avatar className="mx-8" alt={row.original.name} src={row.original.display} />;
        },
        className: 'justify-center',
        width: 64,
        sortable: false,
      },
      {
        Header: 'First Name',
        accessor: 'firstname',
        className: 'font-medium',
        sortable: true,
      },
      {
        Header: 'Last Name',
        accessor: 'lastname',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Display Name',
        accessor: 'display',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Email',
        accessor: 'email',
        sortable: true,
      },

      {
        Header: 'Mobile',
        accessor: 'tel',
        sortable: true,
      },

      {
        Header: 'Channel',
        accessor: 'channel.channel',
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

      {
        Header: 'Updated At',
        accessor: 'updatedAt',
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
        return customers;
      }
      return FuseUtils.filterArrayByString(customers, _searchText);
    }

    if (customers) {
      setFilteredData(getFilteredArray(customers, searchText));
    }
  }, [customers, searchText]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no customers!
        </Typography>
      </div>
    );
  }

  if (!customers) {
    return <FuseLoading />;
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      <CustomersTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            history.push({
              pathname: `/customers/${row.original.id}`,
            });
          }
        }}
      />
    </motion.div>
  );
}

export default CustomersList;
