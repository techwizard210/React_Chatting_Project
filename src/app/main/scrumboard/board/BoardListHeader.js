import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import firebase from 'firebase/compat/app';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { Autocomplete, Button, Chip, Select } from '@mui/material';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { removeList, renameList } from '../store/boardSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required('You must enter a title'),
});

function BoardListHeader(props) {
  const dispatch = useDispatch();
  const board = useSelector(({ scrumboardApp }) => scrumboardApp.board);
  let list = _.find(board.lists, { id: props.listId });
  useEffect(() => {
    list = _.find(board.lists, { id: props.listId });
  }, [board]);

  const [listTitle, setListTitle] = useState(list.name);

  const [anchorEl, setAnchorEl] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: listTitle,
    },
    resolver: yupResolver(schema),
  });

  const [filterList, setFilterList] = useState([]);
  const [chatType, setChatType] = useState(list.chatType);

  const [labelOption, setLabelOption] = useState([]);
  const [labelSelect, setLabelSelect] = useState(list.chatLabels.split(','));

  async function handleLabelChange(_, value) {
    setLabelSelect(value);
  }

  const handleChatListChange = async (e) => {
    // dispatch(setListType(e.target.value));
    // dispatch(getChats(e.target.value));
    setChatType(e.target.value);
  };
  // const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
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
    if (!formOpen) {
      reset({
        title: listTitle,
      });
    }
  }, [formOpen, listTitle, reset]); // [formOpen, reset, props.list.name]);

  useEffect(() => {
    if (formOpen && anchorEl) {
      setAnchorEl(null);
    }
  }, [anchorEl, formOpen]);

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
    const _list = await response.data;
    const mapList = _list.map((element) => element.label);
    setLabelOption(mapList);
  };

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleOpenForm(ev) {
    ev.stopPropagation();
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
  }

  function onSubmit(data) {
    let _lblStr = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < labelSelect.length; i++) {
      if (_lblStr === '') {
        _lblStr = labelSelect[i];
      } else {
        _lblStr = `${_lblStr},${labelSelect[i]}`;
      }
    }
    dispatch(renameList({ boardId: board.id, listId: list.id, listTitle: data.title, chatType, chatLabels: _lblStr }));
    setListTitle(data.title);
    handleCloseForm();
  }

  return (
    <div {...props.handleProps}>
      {/* <div className="flex items-center justify-between h-48 sm:h-64 px-8"> */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between w-full">
          {formOpen ? (
            // <div className="w-full mx-8 sm:mx-12 my-5">
            <FuseScrollbars className="flex flex-1 flex-col overflow-y-auto max-h-360 pl-16 pr-24 pb-24">
              <form className="w-full m-5" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  className="w-full px-8"
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} variant="outlined" margin="none" className="w-full" autoFocus />
                  )}
                />
                <Typography className="font-medium text-8 px-8 py-4 mt-14" color="primary">
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
                  className="w-full px-8"
                  multiple
                  options={labelOption}
                  getOptionLabel={(option) => option}
                  value={labelSelect}
                  onChange={handleLabelChange}
                  filterSelectedOptions
                  renderInput={(params) => <TextField {...params} variant="outlined" placeholder="" multiline />}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <>{option.length > 0 && <Chip label={option} {...getTagProps({ index })} />}</>
                    ))
                  }
                />
                <div className="flex justify-between mt-16 items-center">
                  <Button variant="contained" color="secondary" type="submit">
                    Update
                  </Button>
                  <Button variant="contained" color="error" onClick={handleCloseForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </FuseScrollbars>
          ) : (
            // </div>
            <>
              <Typography className="text-16 font-medium cursor-pointer ml-16 mt-16" onClick={handleOpenForm}>
                {listTitle}
              </Typography>
              <div className="float-right mt-16">
                <IconButton
                  aria-owns={anchorEl ? 'actions-menu' : null}
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                  variant="outlined"
                  size="small"
                >
                  <Icon className="text-20">more_vert</Icon>
                </IconButton>
                <Menu id="actions-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleOpenForm}>
                    <ListItemIcon className="min-w-40">
                      <Icon>edit</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Edit List" />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      dispatch(removeList({ boardId: board.id, listId: list.id }));
                    }}
                  >
                    <ListItemIcon className="min-w-40">
                      <Icon>delete</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Remove List" />
                  </MenuItem>
                </Menu>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BoardListHeader;
