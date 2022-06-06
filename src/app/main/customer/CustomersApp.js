import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import CustomersHeader from './CustomersHeader';
import CustomersList from './CustomersList';
import reducer from './store';
import { getCustomers } from './store/customersSlice';

function CustomersApp(props) {
  const dispatch = useDispatch();

  const organization = useSelector(({ auth }) => auth.organization.organization);

  useDeepCompareEffect(() => {
    if (organization) dispatch(getCustomers());
  }, [dispatch, organization]);

  return (
    <>
      <FusePageCarded
        classes={{
          contentWrapper: 'p-0 sm:p-24 h-full',
          content: 'flex flex-col h-full',
          leftSidebar: 'w-256 border-0',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
          wrapper: 'min-h-0',
        }}
        header={<CustomersHeader />}
        content={<CustomersList />}
        innerScroll
      />
    </>
  );
}

export default withReducer('customersApp', reducer)(CustomersApp);
