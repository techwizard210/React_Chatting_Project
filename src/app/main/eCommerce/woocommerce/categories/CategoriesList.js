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
import history from '@history';
import CategoriesTable from './CategoriesTable';

import { getCategories, selectCategories } from '../store/categoriesSlice';

// import {
//   openEditRewardDialog,
//   // removeTeam,
//   // toggleStarredContact,
//   // selectTeams,
//   selectRewards,
// } from './store/rewardsSlice';

function CategoriesList(props) {
  const dispatch = useDispatch();
  // const rewards = useSelector(selectRewards);
  const categories = useSelector(selectCategories);
  const searchText = useSelector(({ woocommerceApp }) => woocommerceApp.categories.searchText);
  const organization = useSelector(({ auth }) => auth.organization.organization);

  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organization) dispatch(getCategories()).then(() => setLoading(false));
  }, [dispatch, organization]);

  const columns = useMemo(
    () => [
      {
        Header: 'Image',
        accessor: 'images',
        Cell: ({ row }) => {
          if (row.original.image) {
            return <Avatar alt={row.original.image.alt} src={row.original.image.src} />;
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

      // {
      //   Header: 'Description',
      //   accessor: 'description',
      //   className: 'font-medium',
      //   sortable: true,
      // },

      {
        Header: 'Slug',
        accessor: 'slug',
        className: 'font-medium',
        sortable: true,
      },

      {
        Header: 'Count',
        accessor: 'count',
        className: 'font-medium',
        sortable: true,
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
        return categories;
      }
      return FuseUtils.filterArrayByString(categories, _searchText);
    }

    if (categories) {
      setFilteredData(getFilteredArray(categories, searchText));
    }
  }, [categories, searchText]);

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
          There are no categories!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}>
      <CategoriesTable
        columns={columns}
        data={filteredData}
        onRowClick={(ev, row) => {
          if (row) {
            history.push({
              pathname: `/woocommerce/categories/${row.original.id}`,
            });
          }
        }}
      />
    </motion.div>
  );
}

export default CategoriesList;
