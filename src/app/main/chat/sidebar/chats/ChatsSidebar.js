import AppBar from '@mui/material/AppBar';
// import Icon from '@mui/material/Icon';
// import Input from '@mui/material/Input';
// import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
// import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import TabChatList from './TabChatList';
import TabHistoryList from './TabHistoryList';
// import { selectContacts } from './store/contactsSlice';
// import { openUserSidebar } from './store/sidebarsSlice';
// import { updateUserData } from './store/userSlice';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function ChatsSidebar(props) {
  const dispatch = useDispatch();

  const searchText = useSelector(({ chatApp }) => chatApp.chats.searchText);
  // const contacts = useSelector(selectContacts);
  const [tabPosition, setTabPosition] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabPosition(newValue);
  };
  const theme = useTheme();

  return (
    <div className="flex flex-col flex-auto h-full bg-white">
      <AppBar position="static" color="default" elevation={0}>
        <Tabs
          value={tabPosition}
          onChange={handleTabChange}
          aria-label="simple tabs example"
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<ChatIcon />} {...a11yProps(0)} />
          <Tab icon={<HistoryIcon />} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <div className="p-16 sm:p-0 max-w-2xl h-full">
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabPosition}
          onChangeIndex={handleTabChange}
          className="bg-white h-full"
        >
          <div value={tabPosition} index={0} className="bg-white h-full">
            <TabChatList />
          </div>
          <div value={tabPosition} index={1} className="bg-white h-full">
            <TabHistoryList />
          </div>

          {/* <TabPanel value={value} index={0} dir={theme.direction}>
          <TabChatList />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <TabHistoryList />
        </TabPanel> */}
        </SwipeableViews>
      </div>
    </div>
  );
}

export default ChatsSidebar;
