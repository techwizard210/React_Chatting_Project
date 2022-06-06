import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import AppBar from '@mui/material/AppBar';
import Icon from '@mui/material/Icon';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
// import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';

import { useTheme } from '@mui/material/styles';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import FacebookPageListItem from './FacebookPageListItem';

function FacebookPageList(props) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { pageList } = props;

  const [searchText, setSearchText] = useState('');

  return (
    <div className="flex flex-col flex-auto h-full">
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar className="pl-16 p flex flex-row">
          <Paper className="flex p-4 items-center w-full px-8 py-4 shadow">
            <Icon color="action">search</Icon>

            <Input
              placeholder="Search Page"
              className="flex flex-1 px-8"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => setSearchText(ev.target.value)}
            />
          </Paper>
        </Toolbar>
      </AppBar>

      <FuseScrollbars className="overflow-y-auto flex-1">
        <List className="w-full">
          {useMemo(() => {
            function getFilteredArray(arr, _searchText) {
              if (_searchText.length === 0) {
                return arr;
              }
              return FuseUtils.filterArrayByString(arr, _searchText);
            }
            const filteredPageList = getFilteredArray(pageList, searchText);
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
                {filteredPageList.map((page, index) => (
                  <motion.div variants={item} key={index}>
                    <FacebookPageListItem page={page} />
                  </motion.div>
                ))}
              </motion.div>
            );
          }, [pageList, searchText])}
        </List>
      </FuseScrollbars>
    </div>
  );
}

export default FacebookPageList;
