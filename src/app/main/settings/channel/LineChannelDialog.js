import { yupResolver } from "@hookform/resolvers/yup";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FileCopy from "@mui/icons-material/FileCopy";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";

const Buffer = require("buffer").Buffer;

import _ from "@lodash";
import * as yup from "yup";

import { Divider } from "@mui/material";
import {
  addLineChannel,
  updateLineChannel,
  removeLineChannel,
  closeNewLineChannelDialog,
  closeEditLineChannelDialog,
} from "./store/channelsSlice";

const defaultValues = {
  id: "",
  name: "",
  channelSecret: "",
  accessToken: "",
};
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required("You must enter a channel name"),
  channelSecret: yup.string().required("You must enter a channel secret"),
  accessToken: yup.string().required("You must enter a access token"),
});

export default function LineChannelDialog(props) {
  const dispatch = useDispatch();
  const channelDialog = useSelector(({ channels }) => channels.channelDialog);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  const id = watch("id");
  const name = watch("name");
  const avatar = watch("avatar");

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (channelDialog.type === "edit" && channelDialog.data) {
      reset({ ...channelDialog.data.line });
    }

    /**
     * Dialog type: 'new'
     */
    if (channelDialog.type === "new") {
      reset({
        ...defaultValues,
      });
    }
  }, [channelDialog.data, channelDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (channelDialog.line.props.open) {
      initDialog();
    }
  }, [channelDialog.line.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return channelDialog.type === "edit"
      ? dispatch(closeEditLineChannelDialog())
      : dispatch(closeNewLineChannelDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (channelDialog.type === "new") {
      dispatch(addLineChannel(data));
      dispatch(getChannels());
    } else {
      dispatch(
        updateLineChannel({
          ...channelDialog.data,
          line: {
            ...channelDialog.data.line,
            ...data,
          },
        })
      );
      closeComposeDialog();
    }
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeLineChannel(channelDialog.data));
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: "m-24",
      }}
      {...channelDialog.line.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="md"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {channelDialog.type === "new"
              ? "New LINE Channel"
              : "Edit LINE Channel"}
          </Typography>
        </Toolbar>
      </AppBar>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:overflow-hidden"
      >
        <DialogContent classes={{ root: "p-24" }}>
          <div className="mx-16">
            <Typography variant="h6" gutterBottom component="div">
              Get necessary values from your channel settings
            </Typography>

            {/* <Typography variant="subtitle1" gutterBottom component="div">
              1. Channel Name
            </Typography> */}
            <Typography variant="body1" gutterBottom component="div">
              - Click on the channel you created to access your channel settings
            </Typography>
            <Typography variant="body1" gutterBottom component="div">
              - Find the Channel name from Basic settings {">"} Channel name.
            </Typography>
            <Typography variant="body1" gutterBottom component="div">
              - Find the Channel secret from Basic settings {">"} Channel
              secret.
            </Typography>
            <Typography variant="body1" gutterBottom component="div">
              - Find the LINE ID from Messaging API {">"} Bot basic ID.
            </Typography>
            <Typography variant="body1" gutterBottom component="div">
              - Then, scroll farther to Messaging API settings. There, you will
              see a Channel access token field, with an issue button. Click that
              button to get your access token
            </Typography>

            {/* <ul>
              <li>- If you don't have a LINE@ account, create a LINE@ account with the Messaging API enabled.</li>
              <li>- In the LINE@ Manager, go to Settings Bot Settings from the left side menu.</li>
              <li>- On the Bot Settings page, in the Request Settings section, set Allow for Use webhooks.</li>
              <li>- Go to your LINE@ account page in the LINE Business Center.</li>
              <li>- In the Messaging API section, click LINE Developers to go to the Channel Console.</li>
              <li>- Copy LINE ID, Channel name and Channel Secret and paste into the respective fields below.</li>
              <li>
                - Click ISSUE for the Channel access token item and paste its value to the respective field below.
              </li>
              <li>- Click the Add button below.</li>
            </ul> */}
            <a href="https://fox-doumentation.gitbook.io/fox-connect-documentation/add-messaging-channel/line-channel">
              More in documentation.
            </a>
          </div>
          {/* <Divider /> */}
          <Divider className="m-16" />
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">public</Icon>
            </div>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Channel Name"
                  id="name"
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
              name="channelSecret"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Channel Secret"
                  id="channelSecret"
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
              <Icon color="action">fingerprint</Icon>
            </div>
            <Controller
              control={control}
              name="accessToken"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Access Token"
                  id="accessToken"
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
              <Icon color="action">alternate_email</Icon>
            </div>
            <Controller
              control={control}
              name="lineId"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="LINE ID"
                  id="lineId"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
          {channelDialog.type === "edit" &&
            channelDialog.data &&
            channelDialog.data.id && (
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
                  }/api/webhook/line/${Buffer.from(
                    channelDialog.data.id,
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
                              }/api/webhook/line/${Buffer.from(
                                channelDialog.data.id,
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
                        {/* <FileCopy/> */}
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            )}
        </DialogContent>

        {channelDialog.type === "new" ? (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Add
              </Button>
            </div>
          </DialogActions>
        ) : (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Save
              </Button>
            </div>
            <IconButton onClick={handleRemove} size="large">
              <Icon>delete</Icon>
            </IconButton>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}
