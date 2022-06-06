import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';

import { useMemo, useEffect, useState, useCallback } from 'react';
import * as yup from 'yup';
import _ from '@lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { closeCustomerSidebar } from '../../store/sidebarsSlice';
import { updateCustomer } from '../../store/customerSlice';

const defaultValues = {
  id: null,
  firstname: '',
  lastname: '',
  display: '',
  email: '',
  tel: '',
  remarks: '',
  channel: '',
  uid: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const schema = yup.object().shape({
  display: yup.string().required('You must enter a display name'),
  // firstname: yup.string().required('You must enter a firstname'),
  // lastname: yup.string().required('You must enter a lastname'),
  // email: yup.string().required('You must enter a Email'),
});

function Information() {
  const dispatch = useDispatch();
  const selected = useSelector(({ chatApp }) => chatApp.current.selected);
  const customer = useSelector(({ chatApp }) => chatApp.customer.customer);
  const selectType = useSelector(({ chatApp }) => chatApp.current.selectType);
  const customerSidebarOpen = useSelector(({ chatApp }) => chatApp.sidebars.customerSidebarOpen);
  const [expanded, setExpanded] = useState(false);

  const [channelName, setChannelName] = useState('');
  useMemo(() => {
    if (selected && selected.channel) {
      if (selected.channel.channel === 'line' && selected.channel.line) setChannelName(selected.channel.line.name);
      if (selected.channel.channel === 'facebook' && selected.channel.facebook)
        setChannelName(selected.channel.facebook.name);
    }
  }, [selected]);

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
    if (selected && customer) {
      reset({ ...customer });
    }
  }, [selected, customer, reset]);

  useEffect(() => {
    if (customerSidebarOpen && selected) {
      initDialog();
    } else {
      reset({ ...defaultValues });
    }
  }, [customerSidebarOpen, initDialog, selected]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (customer) {
      dispatch(updateCustomer({ ...customer, ...data }));
    }
    dispatch(closeCustomerSidebar());
  }

  return (
    <div className="flex flex-col relative w-full p-24">
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="flex">
          <Controller
            control={control}
            name="firstname"
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Firstname"
                id="firstName"
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
            name="lastname"
            render={({ field }) => (
              <TextField {...field} className="mb-24" label="Lastname" id="lastName" variant="outlined" fullWidth />
            )}
          />
        </div>

        <div className="flex">
          <Controller
            control={control}
            name="display"
            render={({ field }) => (
              <TextField {...field} className="mb-24" label="Display Name" id="display" variant="outlined" fullWidth />
            )}
          />
        </div>

        <div className="flex">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField {...field} className="mb-24" label="Email" id="email" variant="outlined" fullWidth />
            )}
          />
        </div>

        <div className="flex">
          <Controller
            control={control}
            name="tel"
            render={({ field }) => (
              <TextField {...field} className="mb-24" label="Mobile" id="tel" variant="outlined" fullWidth />
            )}
          />
        </div>

        <div className="flex">
          <Controller
            control={control}
            name="textAddress"
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Address"
                id="textAddress"
                variant="outlined"
                multiline
                rows={3}
                fullWidth
              />
            )}
          />
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
        <div className="px-16 w-full">
          <Button
            className="w-full"
            variant="contained"
            color="primary"
            type="submit"
            disabled={_.isEmpty(dirtyFields) || !isValid}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Information;
