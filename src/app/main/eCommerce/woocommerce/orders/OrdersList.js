import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import Typography from '@mui/material/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
import OrderTable from './OrdersTable';

import { getOrders, selectOrders } from '../store/ordersSlice';

// import {
//   openEditRewardDialog,
//   // removeTeam,
//   // toggleStarredContact,
//   // selectTeams,
//   selectRewards,
// } from './store/rewardsSlice';

function OrdersList(props) {
  const dispatch = useDispatch();
  // const rewards = useSelector(selectRewards);
  const orders = useSelector(selectOrders);
  const searchText = useSelector(({ woocommerceApp }) => woocommerceApp.orders.searchText);
  const organization = useSelector(({ auth }) => auth.organization.organization);

  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organization) dispatch(getOrders()).then(() => setLoading(false));
  }, [dispatch, organization]);

  const columns = useMemo(
    () => [
      {
        Header: 'Order Id',
        accessor: 'id',
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
        Header: 'Total',
        accessor: 'total',
        className: 'font-medium',
        sortable: true,
        Cell: ({ row }) => (
          <>
            <span>{row.original.currency_symbol}</span>
            {row.original.total}
          </>
        ),
      },

      {
        Header: 'Updated At',
        accessor: 'date_modified',
        sortable: true,
        Cell: (columnProps) => {
          return <span>{format(new Date(columnProps.value), 'PP')}</span>;
        },
      },

      {
        Header: 'Created At',
        accessor: 'date_created',
        sortable: true,
        Cell: (columnProps) => {
          return <span>{format(new Date(columnProps.value), 'PP')}</span>;
        },
      },

      // {
      //   id: 'action',
      //   width: 128,
      //   sortable: false,
      //   Cell: ({ row }) => (
      //     <div className="flex items-center">
      //       <IconButton
      //         onClick={(ev) => {
      //           ev.stopPropagation();
      //           // dispatch(removeTeam(row.original.id));
      //           props.handleConfirmOpen(row.original);
      //         }}
      //       >
      //         <Icon>delete</Icon>
      //       </IconButton>
      //     </div>
      //   ),
      // },
    ],
    [dispatch]
  );

  useEffect(() => {
    function getFilteredArray(entities, _searchText) {
      if (_searchText.length === 0) {
        return orders;
      }
      return FuseUtils.filterArrayByString(orders, _searchText);
    }

    if (orders) {
      setFilteredData(getFilteredArray(orders, searchText));
    }
  }, [orders, searchText]);

  if (!filteredData) {
    return null;
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no orders!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      <OrderTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            // dispatch(openEditRewardDialog(row.original));
          }
        }}
      />
    </motion.div>
  );
}

export default OrdersList;
