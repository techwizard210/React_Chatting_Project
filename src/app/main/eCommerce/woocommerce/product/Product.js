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
import { resetProduct, newProduct, getProduct } from '../store/productSlice';
import reducer from '../store';
import ProductHeader from './ProductHeader';
import ProductInfoTab from './tabs/ProductInfoTab';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a product name').min(5, 'The product name must be at least 5 characters'),
  slug: yup.string().required('You must enter a product slug'),
  sku: yup.string().required('You must enter a product sku'),
  regular_price: yup.string().required('You must enter a product regular price'),
});

function Product(props) {
  const dispatch = useDispatch();
  const product = useSelector(({ woocommerceApp }) => woocommerceApp.product);

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noProduct, setNoProduct] = useState(false);
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  useDeepCompareEffect(() => {
    function updateProductState() {
      const { productId } = routeParams;

      if (productId === 'new') {
        /**
         * Create New Product data
         */
        dispatch(newProduct());
      } else {
        /**
         * Get Product data
         */
        dispatch(getProduct(routeParams)).then((action) => {
          /**
           * If the requested product is not exist show message
           */
          if (!action.payload) {
            setNoProduct(true);
          }
        });
      }
    }

    updateProductState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!product) {
      return;
    }
    /**
     * Reset the form on product state changes
     */
    reset(product);
  }, [product, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset Product on component unload
       */
      dispatch(resetProduct());
      setNoProduct(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  /**
   * Show Message if the requested products is not exists
   */
  if (noProduct) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such product!
        </Typography>
        <Button className="mt-24" component={Link} variant="outlined" to="/woocommerce/products" color="inherit">
          Go to Products Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while product data is loading and form is setted
   */
  if (_.isEmpty(form) || (product && routeParams.productId !== String(product.id) && routeParams.productId !== 'new')) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        classes={{
          toolbar: 'p-0',
          header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
        }}
        header={<ProductHeader />}
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
            <Tab className="h-64" label="Product Info" />
          </Tabs>
        }
        content={
          <div className="p-32 sm:p-48">
            <div className={tabValue !== 0 ? 'hidden' : ''}>
              <ProductInfoTab />
            </div>
          </div>
        }
        innerScroll
      />
    </FormProvider>
  );
}

export default withReducer('woocommerceApp', reducer)(Product);
