import FuseLoading from '@fuse/core/FuseLoading';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
import { useCallback, useEffect } from 'react';

import TextField from '@mui/material/TextField';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import * as yup from 'yup';

import { updateCustomer } from '../store/customersSlice';

const defaultValues = {
  id: null,
  firstname: '',
  lastname: '',
  display: '',
  email: '',
  tel: '',
  remarks: '',
};

function CustomerInformationCard() {
  const dispatch = useDispatch();
  const customer = useSelector(({ customersApp }) => customersApp.customers.customer);

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const schema = yup.object().shape({
    firstname: yup.string().required('You must enter a firstname'),
    lastname: yup.string().required('You must enter a lastname'),
    email: yup.string().required('You must enter a Email'),
  });

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    if (customer) {
      reset({ ...defaultValues, ...customer });
    }
  }, [customer, reset]);

  useEffect(() => {
    if (customer) {
      initDialog();
    }
  }, [customer, initDialog]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    dispatch(updateCustomer({ ...customer, ...data }));
  }

  return (
    <Card component={motion.div} variants={item} className="w-full rounded-16 shadow">
      <AppBar position="static" elevation={0}>
        <Toolbar className="px-8">
          <Typography variant="subtitle1" color="inherit" className="flex-1 px-12 font-medium">
            <span className="hidden sm:flex">Customer Information</span>
            <span className="flex sm:hidden">Information</span>
          </Typography>
        </Toolbar>
      </AppBar>

      <CardContent>
        {customer ? (
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden px-24 pt-24">
            <div className="flex w-full flex-col sm:flex-row sm:space-x-40 ">
              <div className="flex w-full">
                <Controller
                  control={control}
                  name="firstname"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="Firstname"
                      id="firstName"
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className="flex w-full">
                <Controller
                  control={control}
                  name="lastname"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mb-24"
                      label="Lastname"
                      id="lastName"
                      required
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex w-full flex-col sm:flex-row sm:space-x-40 ">
              <div className="flex w-full">
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
                      required
                      fullWidth
                    />
                  )}
                />
              </div>

              <div className="flex w-full">
                <Controller
                  control={control}
                  name="tel"
                  render={({ field }) => (
                    <TextField {...field} className="mb-24" label="Mobile" id="tel" variant="outlined" fullWidth />
                  )}
                />
              </div>

              <div className="flex w-full">
                <Controller
                  control={control}
                  name="display"
                  render={({ field }) => (
                    <TextField {...field} className="mb-24" label="Display" id="display" variant="outlined" fullWidth />
                  )}
                />
              </div>
            </div>

            <div className="flex">
              <Controller
                control={control}
                name="remarks"
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Remark"
                    id="remarks"
                    variant="outlined"
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex w-full flex-col sm:flex-row sm:space-x-40 ">
              <div className="flex sm:w-1/4">
                <TextField
                  className="mb-24"
                  value={customer.channel.channel}
                  label="Channel"
                  id="channel"
                  variant="standard"
                  fullWidth
                  disabled
                />
              </div>

              <div className="flex sm:w-3/4">
                <TextField
                  className="mb-24"
                  value={customer.uid}
                  label="UID"
                  id="uid"
                  variant="standard"
                  fullWidth
                  disabled
                  inputProps={{ readOnly: true }}
                />
              </div>
            </div>

            <div className="flex w-full flex-col sm:flex-row sm:space-x-40 ">
              <div className="flex w-full">
                <TextField
                  value={format(new Date(customer.createdAt), 'PP')}
                  className="mb-24"
                  label="	Created At"
                  id="createdAt"
                  variant="standard"
                  fullWidth
                  inputProps={{ readOnly: true }}
                  disabled
                />
              </div>
              <div className="flex w-full">
                <TextField
                  value={format(new Date(customer.updatedAt), 'PP')}
                  className="mb-24"
                  label="Updated At"
                  id="updatedAt"
                  variant="standard"
                  fullWidth
                  inputProps={{ readOnly: true }}
                  disabled
                />
              </div>
            </div>

            <CardActions className="justify-end pt-16">
              <div className="px-16">
                <Button variant="contained" color="primary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
                  Save
                </Button>
              </div>
              {/* <IconButton onClick={handleRemove}>
              <Icon>delete</Icon>
            </IconButton> */}
            </CardActions>
          </form>
        ) : (
          <FuseLoading />
        )}
      </CardContent>
    </Card>
  );
}

export default CustomerInformationCard;
