import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// import Select from 'react-select';

import _ from '@lodash';
import * as yup from 'yup';

import { updateUser, closeEditUserDialog } from '../store/usersSlice';

const defaultValues = {
  id: '',
  email: '',
  firstname: '',
  lastname: '',
  display: '',
  picture: '',
  gender: '',
  mobile: '',
  address: '',
  status: 'active',
  role: '',
  team: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  firstname: yup.string().required('You must enter a firstname'),
  lastname: yup.string().required('You must enter a lastname'),
  email: yup.string().required('You must enter a Email'),
});

function UserDialog(props) {
  const dispatch = useDispatch();
  const userDialog = useSelector(({ usersApp }) => usersApp.users.userDialog);
  const userRoleOption = useSelector(({ usersApp }) => usersApp.users.role);
  const userTeamOption = useSelector(({ usersApp }) => usersApp.users.team);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  const name = watch('name');
  const avatar = watch('avatar');

  // Initialize Dialog with Data
  const initDialog = useCallback(() => {
    reset({
      ...defaultValues,
      ...userDialog.data.user,
      role: userDialog.data.role,
      team: userDialog.data.team,
    });
  }, [userDialog.data, reset]);

  // On Dialog Open
  useEffect(() => {
    if (userDialog.props.open) {
      initDialog();
    }
  }, [userDialog.props.open, initDialog]);

  // Close Dialog
  function closeComposeDialog() {
    return dispatch(closeEditUserDialog());
  }

  // Form Submit
  function onSubmit(data) {
    const { role, team } = data;
    delete data.role;
    delete data.team;
    dispatch(
      updateUser({
        user: { ...data },
        role,
        team,
      })
    );
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...userDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            Edit User
          </Typography>
        </Toolbar>
      </AppBar>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
        <DialogContent classes={{ root: 'p-24' }}>
          {/* Firstname */}
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">account_circle</Icon>
            </div>
            <Controller
              control={control}
              name="firstname"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Firstname"
                  id="firstname"
                  error={!!errors.firstname}
                  helperText={errors?.firstname?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
          {/* Lastname */}
          <div className="flex">
            <div className="min-w-48 pt-20" />

            <Controller
              control={control}
              name="lastname"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Lastname"
                  id="lastname"
                  variant="outlined"
                  error={!!errors.lastname}
                  helperText={errors?.lastname?.message}
                  required
                  fullWidth
                />
              )}
            />
          </div>
          {/* Display */}
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">portrait</Icon>
            </div>

            <Controller
              control={control}
              name="display"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Display Name"
                  id="display"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          {/* Picture */}
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">panorama</Icon>
            </div>

            <Controller
              control={control}
              name="picture"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Display Image"
                  id="picture"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
          {/* Email */}
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">email</Icon>
            </div>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  id="email"
                  variant="outlined"
                  fullWidth
                  disabled
                />
              )}
            />
          </div>
          {/* Mobile */}
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">phone</Icon>
            </div>
            <Controller
              control={control}
              name="mobile"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Mobile" id="mobile" variant="outlined" fullWidth />
              )}
            />
          </div>
          {/* Gender */}
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">wc</Icon>
            </div>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <FormControl variant="outlined" className="w-full">
                  <InputLabel>Gender</InputLabel>
                  <Select {...field} className="mb-24" label="Gender" id="gender" fullWidth>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="undisclosed">Undisclosed</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {/* Role */}
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">assignment_ind</Icon>
            </div>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <FormControl variant="outlined" className="w-full">
                  <InputLabel>Role</InputLabel>
                  <Select {...field} className="mb-24" label="Role" id="role" fullWidth>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="agent">Agent</MenuItem>
                    {/* <MenuItem value="user">User</MenuItem> */}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {/* Team */}
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">groups</Icon>
            </div>
            <Controller
              control={control}
              name="team"
              render={({ field }) => (
                <FormControl variant="outlined" className="w-full">
                  <InputLabel>Team</InputLabel>
                  <Select
                    {...field}
                    value={JSON.stringify(field.value)}
                    className="mb-24"
                    label="Team"
                    id="team"
                    fullWidth
                    onChange={(val) => field.onChange(JSON.parse(val.target.value))}
                    renderValue={(selected) => {
                      console.log('Selected ', selected);
                      return <>{selected && JSON.parse(selected) ? JSON.parse(selected).name : ''}</>;
                    }}
                  >
                    {userTeamOption.map((option, index) => {
                      console.log('option ', option);
                      return (
                        <MenuItem key={index} value={JSON.stringify(option)}>
                          {option.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {/* Address */}
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">home</Icon>
            </div>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Address"
                  id="address"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  maxRows={4}
                />
              )}
            />
          </div>
        </DialogContent>

        <DialogActions className="justify-between  p-4 pb-16">
          <div className="px-16">
            <Button variant="contained" color="secondary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
              Save
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UserDialog;
