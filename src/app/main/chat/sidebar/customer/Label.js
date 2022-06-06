import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';

// import { makeStyles } from '@mui/material/styles';

import React, { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';

import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
import { updateCustomer } from '../../store/customerSlice';
// import { getChat } from './store/chatSlice';

function Label(props) {
  const dispatch = useDispatch();

  const [labelOption, setLabelOption] = useState([]);
  const [labelSelect, setLabelSelect] = useState([]);

  const org = useSelector(({ auth }) => auth.organization.organization);
  const selectType = useSelector(({ chatApp }) => chatApp.current.selectType);
  const customerSidebarOpen = useSelector(({ chatApp }) => chatApp.sidebars.customerSidebarOpen);
  const selected = useSelector(({ chatApp }) => chatApp.current.selected);
  const [customer, setCustomer] = React.useState();

  useEffect(() => {
    // console.log('labelOption ', labelOption);
  }, [labelOption]);

  useEffect(() => {
    if (selected) {
      setCustomer(selected.customer);
    }
    return () => {
      setCustomer(null);
    };
  }, [selected]);

  useEffect(() => {
    if (customer) {
      getCustomerLabelList();
      getCustomerLabel(customer.id);
    }
  }, [customer]);

  useEffect(() => {
    if (labelSelect.length > 10) {
      labelSelect.splice(10, labelSelect.length - 10);
      dispatch(
        showMessage({
          message: 'Maximum 10 labels per customer.',
          variant: 'warning',
        })
      );
    }
  }, [dispatch, labelSelect]);

  const getCustomerLabel = async (customerId) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return;
    const response = await axios.get(`/api/${org.id}/customer`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: customerId,
      },
    });
    const customerResult = await response.data;

    const select = [];
    customerResult.customerLabel.forEach((element, index) => {
      select.push({
        ...element,
        key: index,
      });
    });
    setLabelSelect(select);
  };
  const getCustomerLabelList = async () => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return;
    const response = await axios.get(`/api/${org.id}/customer/label/list`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const list = await response.data;
    // const filterList = await list.filter((item) => item.status === 'active');
    // console.log('getCustomerLabelList ', filterList);
    setLabelOption(list);
  };
  const updateCustomerLabel = async (newCustomer) => {
    if (customer) {
      // console.log('Update CS >>  ', newCustomer);
      dispatch(updateCustomer(newCustomer));
    }
  };

  const createCustomerLabelList = async (labelList) => {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const response = await axios.post(
      `/api/${org.id}/customer/label`,
      { label: labelList },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.data;
    setLabelOption([...labelOption, ...result]);
    return result;
  };

  const insertNewStringLabelList = async (stringLabelList) => {
    // Create new label
    const newCustomerLabelList = await createCustomerLabelList(stringLabelList);

    if (newCustomerLabelList && newCustomerLabelList.length) {
      if (newCustomerLabelList.length + labelSelect.length > 10) {
        dispatch(
          showMessage({
            message: 'Maximum 10 labels per customer.', // text or html
            autoHideDuration: 6000, // ms
            anchorOrigin: {
              vertical: 'top', // top bottom
              horizontal: 'right', // left center right
            },
            variant: 'error', // success error info warning null
          })
        );
      } else {
        const newSelectList = await [...labelSelect, ...newCustomerLabelList];
        updateCustomerLabel({ ...customer, customerLabel: newSelectList });
        // setLabelSelect(newSelectList);
      }
    }
  };

  const handleLabelChange = async (_, value) => {
    // console.log('@@@ handleLabelChange value ', value);
    // console.log('@@@ handleLabelChange labelSelect ', labelSelect);
    if (value.length < labelSelect.length) {
      // Delete Label
      updateCustomerLabel({ ...customer, customerLabel: value });
    } else {
      // Add Label
      const newSelect = await value.filter((x) => !labelSelect.includes(x));
      // console.log('filter New Select only ', newSelect);
      newSelect.forEach(async (element) => {
        if (element && element.id) {
          // Select Label from Option
          const newSelectList = await [...labelSelect, element];
          updateCustomerLabel({ ...customer, customerLabel: newSelectList });

          // setLabelSelect(newSelectList);
        } else {
          // Add String Label
          const newSelectSplit = await element.split(' ');
          const newSelectList = await newSelectSplit.filter((x) => x.length <= 15);
          // Show Error Maximum 15 characters per 1 label
          if (newSelectSplit.length !== newSelectList.length) {
            // Show Error message Some Label is length more then 15 Char
            dispatch(
              showMessage({
                message: 'Maximum 15 characters per 1 label.',
                variant: 'warning',
              })
            );
          }

          // Label Convert LowerCase and find option with string
          const newSelectListLowerCaseAndFindOption = await newSelectList.map((labelItem) => {
            const labelLowerCase = labelItem.toLowerCase();
            const findOptionResult = labelOption.find((option) => option.label === labelLowerCase);
            if (findOptionResult) {
              return findOptionResult;
            }
            return { label: labelLowerCase };
          });
          // console.log(
          //   'newSelectListConvert ',
          //   newSelectListLowerCaseAndFindOption
          // );
          // Verify Maximum 10 labels per customer.
          if (newSelectList.length + newSelectListLowerCaseAndFindOption.length > 10) {
            dispatch(
              showMessage({
                message: 'Maximum 10 labels per customer.',
                variant: 'warning',
              })
            );
            return; // End process with no change
          }

          const newObjectLabel = await newSelectListLowerCaseAndFindOption.filter((x) => typeof x !== 'string');
          if (newObjectLabel && newObjectLabel.length > 0) {
            const newLabel = [...labelSelect, ...newObjectLabel];
            // setLabelSelect(newLabel);
            updateCustomerLabel({ ...customer, customerLabel: newLabel });
          }
          const newStringLabel = await newSelectListLowerCaseAndFindOption.filter(
            (x) => typeof x === 'string' && x !== ''
          );
          // console.log('newStringLabel ', newStringLabel);
          // console.log('newObjectLabel ', newObjectLabel);
          if (newStringLabel && newStringLabel.length > 0) insertNewStringLabelList(newStringLabel);
        }
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Autocomplete
        multiple
        freeSolo
        id="tags-outlined"
        options={labelOption}
        getOptionLabel={(option) => option.label}
        value={labelSelect}
        onChange={handleLabelChange}
        filterSelectedOptions
        renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Customer Label" multiline />}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => <Chip label={option.label} {...getTagProps({ index })} />)
        }
      />
    </div>
  );
}

export default Label;
