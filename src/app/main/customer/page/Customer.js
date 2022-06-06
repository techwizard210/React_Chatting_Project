import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CustomerHeader from './CustomerHeader';
import CustomerContent from './CustomerContent';
import reducer from '../store';
import { getCustomer, resetCustomer } from '../store/customersSlice';

function Customer(props) {
  const dispatch = useDispatch();

  const customer = useSelector(({ customersApp }) => customersApp.customers.customer);

  const routeParams = useParams();
  const [noCustomer, setNoCustomer] = useState(false);

  useDeepCompareEffect(() => {
    const { customerId } = routeParams;
    // Get Customer data
    dispatch(getCustomer({ customerId })).then((action) => {
      // If the requested Customer is not exist show message
      if (!action.payload) {
        setNoCustomer(true);
      }
    });
  }, [dispatch, routeParams]);

  useEffect(() => {
    return () => {
      // Reset Customer on component unload
      dispatch(resetCustomer());
      setNoCustomer(false);
    };
  }, [dispatch]);

  // Show Message if the requested customer is not exists
  if (noCustomer) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such customer!
        </Typography>
        <Button className="mt-24" component={Link} variant="outlined" to="/settings/customers/" color="inherit">
          Go to Customers Page
        </Button>
      </motion.div>
    );
  }

  // Wait while Customer data is loading and form is setted
  if (customer && routeParams.customerId !== String(customer.id)) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      classes={{
        contentWrapper: 'p-0 sm:p-24 h-full',
        content: 'flex flex-col h-full',
        leftSidebar: 'w-256 border-0',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
        wrapper: 'min-h-0',
      }}
      header={<CustomerHeader />}
      content={
        <div className="p-16 sm:p-24">
          <CustomerContent />
        </div>
      }
    />
  );
}

export default withReducer('customersApp', reducer)(Customer);
