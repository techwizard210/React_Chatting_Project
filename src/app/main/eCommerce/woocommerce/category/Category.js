import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { resetCategory, newCategory, getCategory } from '../store/categorySlice';
import reducer from '../store';
import CategoryHeader from './CategoryHeader';
import CategoryInfoTab from './tabs/CategoryInfoTab';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a category name')
    .min(5, 'The category name must be at least 5 characters'),
  slug: yup.string().required('You must enter a category slug'),
});

function Category(props) {
  const dispatch = useDispatch();
  const category = useSelector(({ woocommerceApp }) => woocommerceApp.category);

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noCategory, setNoCategory] = useState(false);
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  useDeepCompareEffect(() => {
    function updateCategoryState() {
      const { categoryId } = routeParams;

      if (categoryId === 'new') {
        /**
         * Create New Product data
         */
        dispatch(newCategory());
      } else {
        /**
         * Get Category data
         */
        dispatch(getCategory(routeParams)).then((action) => {
          /**
           * If the requested category is not exist show message
           */
          if (!action.payload) {
            setNoCategory(true);
          }
        });
      }
    }

    updateCategoryState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!category) {
      return;
    }
    /**
     * Reset the form on category state changes
     */
    reset(category);
  }, [category, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset category on component unload
       */
      dispatch(resetCategory());
      setNoCategory(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  /**
   * Show Message if the requested categories is not exists
   */
  if (noCategory) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such category!
        </Typography>
        <Button className="mt-24" component={Link} variant="outlined" to="/woocommerce/categories" color="inherit">
          Go to Categories Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while product data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (category && routeParams.categoryId !== String(category.id) && routeParams.categoryId !== 'new')
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        classes={{
          toolbar: 'p-0',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
        }}
        header={<CategoryHeader />}
        contentToolbar={
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: 'w-full h-64' }}
          >
            <Tab className="h-64" label="Category Info" />
          </Tabs>
        }
        content={
          <div className="p-32 sm:p-48">
            <div className={tabValue !== 0 ? 'hidden' : ''}>
              <CategoryInfoTab />
            </div>
          </div>
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default withReducer('woocommerceApp', reducer)(Category);
