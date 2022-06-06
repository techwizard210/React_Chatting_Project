import FuseScrollbars from '@fuse/core/FuseScrollbars';
// import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';
import AppBar from '@mui/material/AppBar';
import Input from '@mui/material/Input';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
// import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';

import { useTheme } from '@mui/material/styles';

import Select from '@mui/material/Select';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import Chip from '@mui/material/Chip';
// import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatListItem from './ChatListItem';
// import StatusIcon from './StatusIcon';
import { setListType, setFilterLabel } from '../../store/currentSlice';
// import { selectContacts } from './store/contactsSlice';
import { getChats, getChat, selectChats, setChatsSearchText, clearChat } from '../../store/chatSlice';

function TabChatList(props) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const chats = useSelector(selectChats);
  const organization = useSelector(({ auth }) => auth.organization.organization);
  const role = useSelector(({ auth }) => auth.user.role);

  const searchText = useSelector(({ chatApp }) => chatApp.chats.searchText);
  // const contacts = [];
  // const user = false;
  // const searchText = useSelector(({ foxChatApp }) => foxChatApp.current.searchText);

  // const chatType = useSelector(({ chatApp }) => chatApp.current.listType);
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const org = useSelector(({ auth }) => auth.organization.organization);

  // const [chatType, setChatType] = useState(useSelector(({ chatApp }) => chatApp.current.listType));
  const chatType = useSelector(({ chatApp }) => chatApp.current.listType);

  const [filterList, setFilterList] = useState([]);

  // Customer Label option
  const [labelOption, setLabelOption] = useState([]);
  // const [labelSelect, setLabelSelect] = useState([]);
  const labelSelect = useSelector(({ chatApp }) => chatApp.current.filterLabel);

  // Filter More option popover
  const [filterMenu, setFilterMenu] = useState(null);
  const filterMenuClick = (event) => {
    setFilterMenu(event.currentTarget);
  };
  const filterMenuClose = () => {
    setFilterMenu(null);
  };

  useEffect(() => {
    if (organization && role && role.length) {
      getCustomerLabelList();
      if (role[0] === 'agent') {
        dispatch(setListType('assignee'));
        dispatch(getChats('assignee'));
        setFilterList([
          { key: 'assignee', label: 'My Assignee' },
          { key: 'mention', label: 'Mention to Me' },
        ]);
      } else {
        dispatch(setListType('active'));
        dispatch(getChats('active'));
        setFilterList([
          { key: 'all', label: 'All Chat' },
          { key: 'unassign', label: 'All Unassign' },
          { key: 'active', label: 'All Active' },
          { key: 'resolve', label: 'All Resolve' },
          { key: 'followup', label: 'All Follow Up' },
          { key: 'assignee', label: 'My Assignee' },
          { key: 'mention', label: 'Mention to Me' },
          { key: 'line', label: 'LINE Channel' },
          { key: 'facebook', label: 'Facebook Channel' },
        ]);
      }
    }
  }, [dispatch, organization, role]);

  useEffect(() => {
    return () => {
      dispatch(clearChat());
    };
  }, []);

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
    // const filterList = await list.filter((item) => item.status === 'active');
    // console.log('getCustomerLabelList ', filterList);
    console.log('getCustomerLabelList ', mapList);
    setLabelOption(mapList);
  };
  const handleLabelChange = async (_, value) => {
    // console.log('@@@ handleLabelChange value ', value);
    // console.log('@@@ handleLabelChange labelSelect ', labelSelect);
    await dispatch(setFilterLabel(value));
    dispatch(getChats());
  };

  const handleChatListChange = async (e) => {
    // dispatch(setListType(e.target.value));
    // setChatType(e.target.value);
    dispatch(setListType(e.target.value));
    dispatch(getChats(e.target.value));
  };

  if (!chats) {
    // return <FuseLoading />;
  }

  return (
    <div className="flex flex-col flex-auto bg-white">
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar className="flex flex-col">
          <Paper className="flex my-16 items-center w-full px-8 py-4 shadow">
            <Icon color="action">search</Icon>

            <Input
              placeholder="Search chat"
              className="flex flex-1 px-8"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(event) => {
                dispatch(setChatsSearchText(event));
              }}
            />
          </Paper>
          <div className=" mb-16 pl-16 p flex flex-row w-full">
            <div className="flex items-center">
              <Icon color="action">sort</Icon>
              <Typography className="font-medium text-16 px-8" color="primary">
                Filter
              </Typography>
            </div>

            <Select className="w-full px-8 mx-16" value={chatType} onChange={handleChatListChange} variant="standard">
              {filterList.map((element, index) => (
                <MenuItem key={index} value={element.key}>
                  {element.label}
                </MenuItem>
              ))}
            </Select>
            <IconButton aria-label="more" color="primary" className="flex items-center" onClick={filterMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <FuseScrollbars className="overflow-y-auto flex-1 mb-32">
        <List className="w-full">
          {useMemo(() => {
            function getFilteredArray(arr, _searchText) {
              if (_searchText.length === 0) {
                return arr;
              }
              return FuseUtils.filterArrayByString(arr, _searchText);
            }
            const filteredChatList = getFilteredArray([...chats], searchText);
            const container = {
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            };
            const item = {
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            };

            return (
              <motion.div
                className="flex flex-col flex-shrink-0 w-full"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredChatList.map((chat, index) => (
                  <motion.div variants={item} key={index}>
                    <ChatListItem
                      chat={chat}
                      onChatClick={(chatId) => {
                        dispatch(getChat({ chatId, isMobile }));
                        setTimeout(() => {
                          dispatch(getChats());
                        }, 500);
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            );
          }, [chats, dispatch, isMobile, searchText])}
        </List>
      </FuseScrollbars>

      <Popover
        open={Boolean(filterMenu)}
        anchorEl={filterMenu}
        onClose={filterMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        <div className="flex min-w-200 max-w-xl p-12">
          <div className="flex flex-col px-8 items-start w-full">
            <Typography className="font-medium text-8 px-8 py-4" color="primary">
              Label
            </Typography>
            <Autocomplete
              label="Label"
              className="w-full px-8 w-200"
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
          </div>
        </div>
      </Popover>
    </div>
  );
}

export default TabChatList;
