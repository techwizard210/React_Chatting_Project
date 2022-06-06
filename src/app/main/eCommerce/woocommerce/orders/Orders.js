import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import OrdersHeader from './OrdersHeader';
import OrdersList from './OrdersList';

function Orders() {
  return (
    <FusePageCarded
      classes={{
        content: 'flex flex-col h-full',
        contentCard: 'overflow-hidden',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={<OrdersHeader />}
      content={<OrdersList />}
      innerScroll
    />
  );
}

export default withReducer('woocommerceApp', reducer)(Orders);
