import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import _ from "@lodash";
import { saveProduct, removeProduct } from "../store/productSlice";

function ProductHeader(props) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const featuredImageId = watch("featuredImageId");
  const images = watch("images");
  const name = watch("name");
  const theme = useTheme();
  const navigate = useNavigate();

  function handleSaveProduct() {
    console.log("[Product] save product ", getValues());
    dispatch(saveProduct(getValues()));
  }

  function handleRemoveProduct() {
    console.log("[Product] remove product");

    dispatch(removeProduct()).then(() => {
      navigate("/woocommerce/products");
    });
  }

  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex flex-col items-start max-w-full min-w-0">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
          <Typography
            className="flex items-center sm:mb-12"
            component={Link}
            role="button"
            to="/woocommerce/products"
            color="inherit"
          >
            <Icon className="text-20">
              {theme.direction === "ltr" ? "arrow_back" : "arrow_forward"}
            </Icon>
            <span className="hidden sm:flex mx-4 font-medium">Products</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="hidden sm:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
            {images && images.length > 0 ? (
              <img
                className="w-32 sm:w-48 rounded"
                src={images[0].src}
                alt={images[0].alt}
              />
            ) : (
              <img
                className="w-32 sm:w-48 rounded"
                src={`${process.env.PUBLIC_URL}/assets/images/ecommerce/product-image-placeholder.png`}
                alt={name}
              />
            )}
          </motion.div>
          <div className="flex flex-col min-w-0 mx-8 sm:mc-16">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {name || "New Product"}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Product Detail
              </Typography>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        className="flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          onClick={handleRemoveProduct}
          startIcon={<Icon className="hidden sm:flex">delete</Icon>}
        >
          Remove
        </Button>
        <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          disabled={_.isEmpty(dirtyFields) || !isValid}
          onClick={handleSaveProduct}
        >
          Save
        </Button>
      </motion.div>
    </div>
  );
}

export default ProductHeader;
