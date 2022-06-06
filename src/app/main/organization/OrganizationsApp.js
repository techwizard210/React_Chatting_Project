import FusePageCarded from '@fuse/core/FusePageCarded';
// import FuseLoading from '@fuse/core/FuseLoading';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import OrganizationList from './OrganizationList';
import OrganizationsHeader from './OrganizationsHeader';
import OrganizationDialog from './OrganizationDialog';
import { getOrganizations, selectOrganizations } from './store/organizationsSlice';

function OrganizationsApp() {
  const dispatch = useDispatch();

  // const organizations = useSelector(selectOrganizations);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (organizations && organizations.length) {
  //     setLoading(false);
  //   }
  // }, [organizations]);

  useEffect(() => {
    dispatch(getOrganizations());
  }, [dispatch]);

  // if (loading) return <FuseLoading />;

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
        header={<OrganizationsHeader />}
        content={
          <div className="p-24 h-full">
            <OrganizationList />
          </div>
        }
      />
      <OrganizationDialog />
    </>
  );
}

export default withReducer('organizationsApp', reducer)(OrganizationsApp);
