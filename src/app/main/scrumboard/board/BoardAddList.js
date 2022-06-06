import { Controller, useForm } from 'react-hook-form';

import { darken } from '@mui/material/styles';

import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Icon from '@mui/material/Icon';
import firebase from 'firebase/compat/app';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import _ from '@lodash';
import { newList } from '../store/boardSlice';

const defaultValues = {
  title: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required('You must enter a title'),
});

function BoardAddList(props) {
  const dispatch = useDispatch();
  const board = useSelector(({ scrumboardApp }) => scrumboardApp.board);
  const [formOpen, setFormOpen] = useState(false);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const [filterList, setFilterList] = useState([]);
  const [chatType, setChatType] = useState([]);

  const handleChatListChange = async (e) => {
    setChatType(e.target.value);
  };

  const [labelOption, setLabelOption] = useState([]);
  const [labelSelect, setLabelSelect] = useState([]);

  async function handleLabelChange(_, value) {
    setLabelSelect(value);
  }

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (!formOpen) {
      setChatType();
      setLabelSelect();
      reset(defaultValues);
    }
    getCustomerLabelList();
    setFilterList([
      { key: 'all', label: 'All Chat' },
      { key: 'unassign', label: 'All Unassign' },
      { key: 'active', label: 'All Active' },
      { key: 'resolve', label: 'All Resolve' },
      { key: 'followup', label: 'All Follow Up' },
      { key: 'assignee', label: 'My Assignee' },
      // { key: 'mention', label: 'Mention to Me' },
      { key: 'line', label: 'LINE Channel' },
      { key: 'facebook', label: 'Facebook Channel' },
    ]);
  }, [formOpen, reset]);

  const org = useSelector(({ auth }) => auth.organization.organization);

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
    const mapList = list.map((element) => element.label);
    setLabelOption(mapList);
  };

  function handleOpenForm(ev) {
    ev.stopPropagation();
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
  }

  function onSubmit(data) {
    let _labels = '';
    if (labelSelect) {
      // eslint-disable-next-line array-callback-return
      labelSelect.map((element) => {
        if (_labels === '') {
          _labels = element;
        } else {
          _labels = `${_labels},${element}`;
        }
      });
    }

    dispatch(newList({ board, listTitle: data.title, chatType, labelSelect: _labels }))
      .unwrap()
      .then((payload) => {
        handleCloseForm();
      });
  }

  return (
    <div>
      <Card
        className="w-320 mx-8 sm:mx-12 rounded-20 shadow"
        square
        sx={{
          backgroundColor: (theme) =>
            darken(theme.palette.background.paper, theme.palette.mode === 'light' ? 0.02 : 0.25),
        }}
      >
        {formOpen ? (
          <form className="p-16" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  required
                  fullWidth
                  variant="filled"
                  label="List title"
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCloseForm} size="large">
                          <Icon className="text-18">close</Icon>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Typography className="font-medium text-8 px-8 py-4" color="primary">
              Status
            </Typography>
            <Select className="w-full px-8" value={chatType} onChange={handleChatListChange} variant="standard">
              {filterList.map((element, index) => (
                <MenuItem key={index} value={element.key}>
                  {element.label}
                </MenuItem>
              ))}
            </Select>
            <Typography className="font-medium text-8 px-8 py-4 mt-14" color="primary">
              Label
            </Typography>
            <Autocomplete
              label="Label"
              className="w-full px-8"
              multiple
              freeSolo
              id="tags-outlined"
              options={labelOption}
              getOptionLabel={(option) => option}
              value={labelSelect}
              onChange={handleLabelChange}
              filterSelectedOptions
              renderInput={(params) => <TextField {...params} variant="outlined" placeholder="" multiline />}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => <Chip label={option} {...getTagProps({ index })} />)
              }
            />
            <div className="flex justify-between mt-16 items-center">
              <Button variant="contained" color="secondary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
                Add
              </Button>
              <Button variant="contained" color="error" onClick={handleCloseForm}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            onClick={handleOpenForm}
            classes={{
              root: 'font-medium w-full rounded-none h-64 px-16 justify-start',
            }}
          >
            <Icon className="text-32 text-red">add_circle</Icon>
            <span className="mx-8">Add a list</span>
          </Button>
        )}
      </Card>
    </div>
  );
}

export default BoardAddList;
