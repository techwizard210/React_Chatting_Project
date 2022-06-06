// import Typography from '@mui/material/Typography';
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";

import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FileCopy from "@mui/icons-material/FileCopy";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { showMessage } from "app/store/fuse/messageSlice";
// import _ from '@lodash';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { updateOrganization } from "../store/generalSlice";
const Buffer = require("buffer").Buffer;

const defaultValues = {
  id: "",
  motopressUrl: "",
  motopressConsumerKey: "",
  motopressConsumerSecret: "",
  lineNotify: "",
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({});

function MotopressSetting() {
  const dispatch = useDispatch();
  const organization = useSelector(({ general }) => general.organization);
  const lineChannelList = useSelector(({ general }) => general.line);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  const [expanded, setExpanded] = useState("");
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

  useEffect(() => {
    if (organization) {
      reset(organization.organization);
    }
  }, [organization, lineChannelList]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    dispatch(updateOrganization({ ...data }));
  }

  if (!organization || !lineChannelList) {
    return <FuseLoading />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="md:flex m-1 md:m-24">
        <div className="flex flex-col flex-1">
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Card
              component={motion.div}
              variants={item}
              className="w-full mb-12 rounded-16 shadow"
            >
              <AppBar position="static" elevation={0}>
                <Toolbar className="px-8">
                  <Typography
                    variant="subtitle1"
                    color="inherit"
                    className="flex-1 px-12 font-medium"
                  >
                    Motopress
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    className="whitespace-nowrap mr-12"
                    // disabled={_.isEmpty(dirtyFields) || !isValid}
                  >
                    Save
                  </Button>
                </Toolbar>
              </AppBar>

              <CardContent>
                <div className="flex flex-col md:overflow-hidden">
                  <div className="flex mt-4">
                    <div className="min-w-48 pt-20">
                      <Icon color="action">public</Icon>
                    </div>
                    <Controller
                      control={control}
                      name="motopressUrl"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mb-24"
                          label="Motopress URL"
                          id="motopressUrl"
                          error={!!errors.name}
                          helperText={errors?.name?.message}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </div>

                  <div className="flex">
                    <div className="min-w-48 pt-20">
                      <Icon color="action">verified_user</Icon>
                    </div>
                    <Controller
                      control={control}
                      name="motopressConsumerKey"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mb-24"
                          label="Consumer Key"
                          id="motopressConsumerKey"
                          // error={!!errors.name}
                          // helperText={errors?.name?.message}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </div>

                  <div className="flex">
                    <div className="min-w-48 pt-20">
                      <Icon color="action">fingerprint</Icon>
                    </div>
                    <Controller
                      control={control}
                      name="motopressConsumerSecret"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mb-24"
                          label="Consumer Secret"
                          id="motopressConsumerSecret"
                          // error={!!errors.name}
                          // helperText={errors?.name?.message}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </div>

                  <div className="flex">
                    <div className="min-w-48 pt-20">
                      <Icon color="action">alternate_email</Icon>
                    </div>
                    <Controller
                      control={control}
                      name="lineNotify"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mb-24"
                          label="LINE Notify Token"
                          id="lineNotify"
                          // error={!!errors.name}
                          // helperText={errors?.name?.message}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </div>

                  <div className="flex">
                    <TextField
                      // inputProps={{ readOnly: true }}
                      className="mb-24"
                      label="Webhook URL"
                      id="webhook"
                      variant="outlined"
                      fullWidth
                      value={`${
                        process.env.REACT_APP_BACKEND_URL
                      }/api/webhook/woocommerce/${Buffer.from(
                        organization && organization.organization
                          ? organization.organization.id
                          : "",
                        "binary"
                      ).toString("base64")}`}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${
                                    process.env.REACT_APP_BACKEND_URL
                                  }/api/webhook/woocommerce/${Buffer.from(
                                    organization && organization.organization
                                      ? organization.organization.id
                                      : "",
                                    "binary"
                                  ).toString("base64")}`
                                );
                                dispatch(
                                  showMessage({
                                    message: "Copied to clipboard!",
                                    autoHideDuration: 1000,
                                    variant: "info",
                                  })
                                );
                              }}
                              size="large"
                            >
                              <FileCopy />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>

                  {/* <div className="flex justify-end px-16">
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      disabled={_.isEmpty(dirtyFields) || !isValid}
                    >
                      Save
                    </Button>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default MotopressSetting;
