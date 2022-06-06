import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
// ContentCopy
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// import Select from 'react-select';

import _ from '@lodash';
import * as yup from 'yup';

import { closeAddUserDialog, addUser } from '../store/usersSlice';

const defaultValues = {
  email: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().required('You must enter a Email'),
});

function AddUserDialog(props) {
  const dispatch = useDispatch();
  const addUserDialog = useSelector(({ usersApp }) => usersApp.users.addUserDialog);

  // const organizationId = useSelector(({ auth }) => auth.organization.organization.id);

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  // On Dialog Open
  useEffect(() => {
    if (addUserDialog.props.open) {
      reset({
        ...defaultValues,
      });
    }
  }, [addUserDialog.props.open]);

  // Close Dialog
  function closeComposeDialog() {
    return dispatch(closeAddUserDialog());
  }

  // Form Submit
  function onSubmit(data) {
    dispatch(addUser(data.email));
    closeComposeDialog();
    reset({
      ...defaultValues,
    });
  }

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...addUserDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            Add User
          </Typography>
        </Toolbar>
      </AppBar>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">email</Icon>
            </div>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Email" id="email" variant="outlined" fullWidth />
              )}
            />
          </div>
        </DialogContent>

        <DialogActions className="justify-between p-4 pb-16">
          <div className="px-16">
            <Button variant="contained" color="secondary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
              Add
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddUserDialog;
