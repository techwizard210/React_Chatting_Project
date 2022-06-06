import FuseScrollbars from '@fuse/core/FuseScrollbars';
// import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';
import AppBar from '@mui/material/AppBar';
import Input from '@mui/material/Input';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
// import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useTheme } from '@mui/material/styles';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HistoryListItem from './HistoryListItem';
// import StatusIcon from './StatusIcon';
// import { setListType } from './store/currentSlice';
// import { selectContacts } from './store/contactsSlice';
import {
  getHistories,
  getHistory,
  selectHistories,
  setHistorySearchText,
  clearHistory,
} from '../../store/historySlice';

function TabHistoryList(props) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const histories = useSelector(selectHistories);
  const searchText = useSelector(({ chatApp }) => chatApp.history.searchText);
  const organization = useSelector(({ auth }) => auth.organization.organization);
  // const contacts = [];
  // const user = false;
  // const searchText = useSelector(({ foxChatApp }) => foxChatApp.current.searchText);

  // const chatType = useSelector(({ foxChatApp }) => foxChatApp.current.listType);
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // const [chatType, setChatType] = useState('active');
  const [statusMenuEl, setStatusMenuEl] = useState(null);
  const [moreMenuEl, setMoreMenuEl] = useState(null);

  useEffect(() => {
    if (organization) dispatch(getHistories());
  }, [dispatch, organization]);

  useEffect(() => {
    return () => {
      dispatch(clearHistory());
    };
  }, []);

  if (!histories) {
    // return <FuseLoading />;
  }

  return (
    <div className="flex flex-col flex-auto h-full bg-white">
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar className="flex flex-col">
          <Paper className="flex my-16 items-center w-full px-8 py-4 shadow">
            <Icon color="action">search</Icon>

            <Input
              placeholder="Search history"
              className="flex flex-1 px-8"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(event) => {
                dispatch(setHistorySearchText(event));
              }}
            />
          </Paper>
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
            const filteredHistoryList = getFilteredArray([...histories], searchText);
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
                {filteredHistoryList.map((history, index) => (
                  <motion.div variants={item} key={index}>
                    <HistoryListItem
                      history={history}
                      onHistoryClick={(historyId) => {
                        dispatch(getHistory({ historyId, isMobile }));
                        setTimeout(() => {
                          dispatch(getHistories());
                        }, 500);
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            );
          }, [histories, searchText, dispatch, isMobile])}
        </List>
      </FuseScrollbars>
    </div>
  );
}

export default TabHistoryList;
