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

// import { getFoxUser } from 'app/auth/store/foxSlice';
import { getTeam, updateProfile, closeEditProfileDialog } from './store/profileSlice';

const defaultValues = {
  id: null,
  firstname: '',
  lastname: '',
  email: '',
  mobile: '',
  gender: '',
  role: null,
  team: null,
  address: '',
  remark: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  firstname: yup.string().required('You must enter a firstname'),
  lastname: yup.string().required('You must enter a lastname'),
  email: yup.string().required('You must enter a Email'),
});

function ProfileDialog(props) {
  const dispatch = useDispatch();
  const organization = useSelector(({ auth }) => auth.organization.organization);
  const profileDialog = useSelector(({ profilePage }) => profilePage.profile.profileDialog);
  const profile = useSelector(({ profilePage }) => profilePage.profile.data);
  const profileRoleOption = useSelector(({ profilePage }) => profilePage.profile.role);
  const profileTeamOption = useSelector(({ profilePage }) => profilePage.profile.team);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');

  // useEffect(() => {
  //   console.log('on did mount');
  // }, []);
  useEffect(() => {
    // dispatch(getRole());
    if (organization) dispatch(getTeam());
  }, [dispatch, organization]);

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (profile) {
      reset({ ...profile });
    }
  }, [profile, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (profileDialog.props.open) {
      initDialog();
    }
  }, [profileDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return dispatch(closeEditProfileDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    dispatch(updateProfile({ ...profile, ...data }));
    // dispatch(getFoxUser());
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  // function handleRemove() {
  //   dispatch(removeUser(id));
  //   closeComposeDialog();
  // }

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...profileDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            Edit Profile
          </Typography>
        </Toolbar>
      </AppBar>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
        <DialogContent classes={{ root: 'p-24' }}>
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
            <div className="min-w-48 pt-20" />

            <Controller
              control={control}
              name="lastname"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Lastname" id="lastname" variant="outlined" fullWidth />
              )}
            />
          </div>

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

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">home</Icon>
            </div>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Address" id="address" variant="outlined" fullWidth />
              )}
            />
          </div>

          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">Remark</Icon>
            </div>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Remark"
                  id="remark"
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                />
              )}
            />
          </div>
        </DialogContent>

        <DialogActions className="justify-between p-4 pb-16">
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

export default ProfileDialog;
