import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
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

import {
  addReward,
  updateReward,
  removeReward,
  closeNewRewardDialog,
  closeEditRewardDialog,
} from '../store/rewardsSlice';

const defaultValues = {
  id: null,
  name: '',
  point: 0,
  stock: 0,
  description: '',
  status: 'active',
  imageURL: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a Reward name'),
  point: yup.string().required('You must enter a Reward point'),
  stock: yup.string().required('You must enter a Stock'),
});

function TeamDialog(props) {
  const dispatch = useDispatch();
  const rewardDialog = useSelector(({ loyaltyApp }) => loyaltyApp.rewards.rewardDialog);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (rewardDialog.type === 'edit' && rewardDialog.data) {
      reset({ ...rewardDialog.data });
    }

    /**
     * Dialog type: 'new'
     */
    if (rewardDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...rewardDialog.data,
        // id: FuseUtils.generateGUID(),
      });
    }
  }, [rewardDialog.data, rewardDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (rewardDialog.props.open) {
      initDialog();
    }
  }, [rewardDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return rewardDialog.type === 'edit' ? dispatch(closeEditRewardDialog()) : dispatch(closeNewRewardDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (rewardDialog.type === 'new') {
      dispatch(addReward(data));
    } else {
      dispatch(updateReward({ ...rewardDialog.data, ...data }));
    }
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeReward(id));
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...rewardDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {rewardDialog.type === 'new' ? 'New reward' : 'Edit reward'}
          </Typography>
        </Toolbar>
      </AppBar>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Name"
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
            <Controller
              control={control}
              name="point"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Point"
                  id="point"
                  error={!!errors.point}
                  helperText={errors?.point?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="flex">
            <Controller
              control={control}
              name="stock"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Stock"
                  id="stock"
                  error={!!errors.stock}
                  helperText={errors?.stock?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>
          <div className="flex">
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
          <div className="flex">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <FormControl variant="outlined" className="w-full">
                  <InputLabel>Status</InputLabel>
                  <Select {...field} className="mb-24" label="Status" id="status" fullWidth>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    {/* <MenuItem value="delete">Delete</MenuItem> */}
                  </Select>
                </FormControl>
              )}
            />
          </div>

          <div className="flex">
            <Controller
              control={control}
              name="imageURL"
              render={({ field }) => (
                <TextField {...field} className="mb-24" label="Image URL" id="imageURL" variant="outlined" fullWidth />
              )}
            />
          </div>
        </DialogContent>

        {rewardDialog.type === 'new' ? (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button variant="contained" color="secondary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
                Add
              </Button>
            </div>
          </DialogActions>
        ) : (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button variant="contained" color="secondary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
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

export default TeamDialog;
