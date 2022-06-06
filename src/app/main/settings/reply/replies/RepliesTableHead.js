// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import TableHead from '@mui/material/TableHead';
// import { removeProducts } from '../store/productsSlice';

const rows = [
  {
    id: 'name',
    align: 'center',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
  {
    id: 'type',
    align: 'center',
    disablePadding: false,
    label: 'Type',
    sort: true,
  },
  {
    id: 'event',
    align: 'center',
    disablePadding: false,
    label: 'Event',
    sort: true,
  },
  {
    id: 'updatedAt',
    align: 'center',
    disablePadding: false,
    label: 'Updated At',
    sort: true,
  },
  {
    id: 'createdAt',
    align: 'center',
    disablePadding: false,
    label: 'Created At',
    sort: true,
  },
];

function ProductsTableHead(props) {
  const { selectedProductIds } = props;
  const numSelected = selectedProductIds.length;

  const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedProductsMenu(event) {
    setSelectedProductsMenu(event.currentTarget);
  }

  function closeSelectedProductsMenu() {
    setSelectedProductsMenu(null);
  }

  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map((row) => {
          return (
            <TableCell
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.order.id === row.id ? props.order.direction : false}
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
        <TableCell align="left">Action</TableCell>
      </TableRow>
    </TableHead>
  );
}

export default ProductsTableHead;
