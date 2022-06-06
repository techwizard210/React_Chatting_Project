import { motion } from 'framer-motion';
import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Typography from '@mui/material/Typography';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
import history from '@history';
import ProductsTable from './ProductsTable';

import { getProducts, selectProducts } from '../store/productsSlice';

// import {
//   openEditRewardDialog,
//   // removeTeam,
//   // toggleStarredContact,
//   // selectTeams,
//   selectRewards,
// } from './store/rewardsSlice';

function ProductsList(props) {
  const dispatch = useDispatch();
  // const rewards = useSelector(selectRewards);
  const products = useSelector(selectProducts);
  const searchText = useSelector(({ woocommerceApp }) => woocommerceApp.products.searchText);
  const organization = useSelector(({ auth }) => auth.organization.organization);

  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organization) dispatch(getProducts()).then(() => setLoading(false));
  }, [dispatch, organization]);

  const columns = useMemo(
    () => [
      {
        Header: 'Image',
        accessor: 'images',
        Cell: ({ row }) => {
          if (row.original.images && row.original.images.length > 0) {
            return <Avatar alt={row.original.images[0].alt} src={row.original.images[0].src} />;
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
        Header: 'Id',
        accessor: 'id',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Name',
        accessor: 'name',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'SKU',
        accessor: 'sku',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Stock',
        accessor: 'stock_status',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Price',
        accessor: 'price',
        className: 'font-medium',
        sortable: true,
        Cell: ({ row }) => (
          <>
            <span>฿</span>
            {row.original.price}
          </>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        className: 'font-medium',
        sortable: true,
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

      {
        id: 'action',
        width: 128,
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
        return products;
      }
      return FuseUtils.filterArrayByString(products, _searchText);
    }

    if (products) {
      setFilteredData(getFilteredArray(products, searchText));
    }
  }, [products, searchText]);

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
          There are no products!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      <ProductsTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            history.push({
              pathname: `/woocommerce/products/${row.original.id}`,
            });
          }
        }}
      />
    </motion.div>
  );
}

export default ProductsList;
