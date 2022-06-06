// import FuseUtils from '@fuse/utils/FuseUtils';
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
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// import Select from 'react-select';

import _ from '@lodash';
import * as yup from 'yup';

import {
  removeOrganizations,
  addOrganization,
  updateOrganization,
  closeEditOrganizationDialog,
  closeNewOrganizationDialog,
} from './store/organizationsSlice';

const defaultValues = {
  id: null,
  name: '',
  description: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a Organization name'),
});

function OrganizationDialog(props) {
  const dispatch = useDispatch();
  const organizationDialog = useSelector(
    ({ organizationsApp }) => organizationsApp.organizations.organizationDialog
  );

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: 'onChange',
      defaultValues,
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  const name = watch('name');
  const avatar = watch('avatar');

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (
      organizationDialog.type === 'edit' &&
      organizationDialog.data &&
      organizationDialog.data.organization
    ) {
      reset({ ...organizationDialog.data.organization });
    }

    /**
     * Dialog type: 'new'
     */
    if (organizationDialog.type === 'new') {
      reset({
        ...defaultValues,
        // id: FuseUtils.generateGUID(),
      });
    }
  }, [organizationDialog.data, organizationDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (organizationDialog.props.open) {
      initDialog();
    }
  }, [organizationDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return organizationDialog.type === 'edit'
      ? dispatch(closeEditOrganizationDialog())
      : dispatch(closeNewOrganizationDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (organizationDialog.type === 'new') {
      dispatch(addOrganization(data));
    } else {
      dispatch(
        updateOrganization({ ...organizationDialog.data.organization, ...data })
      );
    }
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    // dispatch(removeOrganization(id));
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...organizationDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {organizationDialog.type === 'new'
              ? 'New Organization'
              : 'Edit Organization'}
          </Typography>
        </Toolbar>
      </AppBar>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:overflow-hidden"
      >
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">account_circle</Icon>
            </div>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Organization Name"
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
            <div className="min-w-48 pt-20" />

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Description"
                  id="description"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        </DialogContent>

        {organizationDialog.type === 'new' ? (
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
            {/* <IconButton onClick={handleRemove}>
              <Icon>delete</Icon>
            </IconButton> */}
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default OrganizationDialog;
