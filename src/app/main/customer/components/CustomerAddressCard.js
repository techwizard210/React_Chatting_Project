import FuseLoading from '@fuse/core/FuseLoading';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import ConfirmDeleteDialog from 'app/main/shared-components/ConfirmDeleteDialog';
import AddressDialog from './AddressDialog';

import { openNewAddressDialog, openEditAddressDialog, removeAddress } from '../store/addressSlice';

function CustomerAddressCard() {
  const dispatch = useDispatch();
  const customer = useSelector(({ customersApp }) => customersApp.customers.customer);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const [addressList, setAddressList] = useState([]);

  useEffect(() => {
    if (customer && customer.address && customer.address.length > 0) {
      setAddressList(customer.address);
    }
    return () => {
      setAddressList([]);
    };
  }, [customer]);

  const [removeConfirm, setRemoveConfirm] = useState({
    open: false,
    data: {},
  });

  const handleConfirmOpen = (data) => {
    setRemoveConfirm({
      open: true,
      data,
    });
  };

  const handleConfirmClose = () => {
    setRemoveConfirm({
      open: false,
      data: {},
    });
  };

  const handleConfirm = () => {
    dispatch(removeAddress(removeConfirm.data));
    setRemoveConfirm({
      open: false,
      data: {},
    });
  };

  const ConfirmDialogContent = () => {
    return (
      <div className="flex flex-col p-8">
        <Typography sx={{ display: 'inline' }} component="span" variant="subtitle1" color="text.primary">
          {`${removeConfirm.data.name} ( ${removeConfirm.data.tel} )`}
        </Typography>

        <>
          <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
            {removeConfirm.data.address1}
          </Typography>{' '}
          <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
            {removeConfirm.data.address2}
          </Typography>{' '}
          <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
            {`${removeConfirm.data.subDistrict}, ${removeConfirm.data.district}, ${removeConfirm.data.province}, ${removeConfirm.data.zipCode}`}
          </Typography>
        </>
      </div>
    );
  };

  return (
    <>
      <Card component={motion.div} variants={item} className="w-full rounded-16 shadow">
        <AppBar position="static" elevation={0}>
          <Toolbar className="px-8">
            <div className="flex flex-row justify-between w-full px-8">
              <Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
                <span className="hidden sm:flex">Customer Address</span>
                <span className="flex sm:hidden">Address</span>
              </Typography>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddCircleIcon />}
                  onClick={() => {
                    dispatch(openNewAddressDialog());
                  }}
                >
                  <span className="hidden sm:flex">New Address</span>
                  <span className="flex sm:hidden">New</span>
                </Button>
              </motion.div>
            </div>
          </Toolbar>
        </AppBar>

        <CardContent>
          {!customer && <FuseLoading />}
          {addressList.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              className="flex flex-col flex-1 items-center justify-center h-full"
            >
              <Typography color="textSecondary" variant="h6">
                No Address!
              </Typography>
            </motion.div>
          )}
          {addressList.length > 0 && (
            <>
              <List className="w-full">
                <motion.div
                  className="flex flex-col flex-shrink-0 w-full"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {addressList.map((address, index) => {
                    const fullAddress = `${address.subDistrict}, ${address.district}, ${address.province}, ${address.zipCode}`;

                    return (
                      <motion.div variants={item} key={index}>
                        <ListItem className="px-16 py-12 min-h-92">
                          <ListItemText
                            classes={{
                              root: 'min-w-px px-16',
                              primary: 'font-medium text-14',
                              secondary: 'truncate',
                            }}
                            primary={`${address.name} ( ${address.tel} )`}
                            secondary={
                              <>
                                <Typography
                                  sx={{ display: 'inline' }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {address.address1}
                                </Typography>{' '}
                                <Typography
                                  sx={{ display: 'inline' }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {address.address2}
                                </Typography>{' '}
                                <Typography
                                  sx={{ display: 'inline' }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {fullAddress}
                                </Typography>
                              </>
                            }
                          />
                          <div className="flex flex-col sm:flex-row ">
                            <IconButton
                              color="primary"
                              className="flex sm:hidden"
                              onClick={() => {
                                dispatch(openEditAddressDialog(address));
                              }}
                              size="large"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton color="primary" className="flex sm:hidden" size="large">
                              <DeleteIcon />
                            </IconButton>
                            <Button
                              className="hidden sm:flex m-4"
                              variant="outlined"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                dispatch(openEditAddressDialog(address));
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              className="hidden sm:flex m-4"
                              variant="outlined"
                              color="primary"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                // dispatch(removeAddress(address));
                                handleConfirmOpen(address);
                              }}
                            >
                              <span className="hidden sm:flex">Delete</span>
                            </Button>
                          </div>
                        </ListItem>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </List>
            </>
          )}
        </CardContent>
      </Card>
      <AddressDialog />

      <ConfirmDeleteDialog
        open={removeConfirm.open}
        data={removeConfirm.data}
        title="Are you sure you want to delete this user?"
        content={<ConfirmDialogContent />}
        handleClose={handleConfirmClose}
        handleConfirm={handleConfirm}
      />
    </>
  );
}

export default CustomerAddressCard;
