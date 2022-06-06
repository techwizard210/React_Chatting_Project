import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { styled, alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Hidden from '@mui/material/Hidden';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import GlobalStyles from '@mui/material/GlobalStyles';
import Popover from '@mui/material/Popover';
import { useMemo, useState, useEffect } from 'react';
import * as qs from 'qs';
import firebase from 'firebase/compat/app';
import { getBoards } from 'app/main/scrumboard/store/boardsSlice';
import ChatsSidebar from './sidebar/chats/ChatsSidebar';
import CustomerSidebar from './sidebar/customer/CustomerSidebar';
// import ContactSidebar from './ContactSidebar';
import reducer from './store';
import SocialIcon from './SocialIcon';
import Chat from './Chat';
import History from './History';
// import { getUserData } from './store/userSlice';
import { getChats, getChat } from './store/chatSlice';
// import { selectContactById, getContacts } from './store/contactsSlice';
import {
  openMobileChatsSidebar,
  closeMobileChatsSidebar,
  openCustomerSidebar,
  closeCustomerSidebar,
} from './store/sidebarsSlice';

import {
  ChatOwnerSetting,
  ChatStatusSetting,
  TicketDetailSetting,
  ChatFollowupSetting,
  OpenHistoryButton,
} from './components/ChatSetting';

import { clearSelect, updateCurrent } from './store/currentSlice';

const drawerWidth = 400;
const headerHeight = 200;

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100%',
  position: 'relative',
  flex: '1 1 auto',
  height: 'auto',
  backgroundColor: theme.palette.background.default,

  '& .ChatApp-topBg': {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: headerHeight,
    backgroundImage: 'url("../../assets/images/backgrounds/header-bg.png")',
    backgroundColor: theme.palette.primary.dark,
    backgroundSize: 'cover',
    pointerEvents: 'none',
  },

  '& .ChatApp-contentCardWrapper': {
    position: 'relative',
    padding: 24,
    maxWidth: 1400,
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 auto',
    width: '100%',
    minWidth: '0',
    maxHeight: '100%',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      padding: 16,
    },
    [theme.breakpoints.down('sm')]: {
      padding: 12,
    },
  },

  '& .ChatApp-contentCard': {
    display: 'flex',
    position: 'relative',
    flex: '1 1 100%',
    flexDirection: 'row',
    // backgroundImage: 'url("/assets/images/patterns/rain-grey.png")',
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: 'rgba(198,198,198,255)',
    minHeight: 0,
    overflow: 'hidden',
  },

  '& .ChatApp-contentWrapper': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    zIndex: 10,
    background: `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.8)} 0,${alpha(
      theme.palette.background.paper,
      0.6
    )} 20%,${alpha(theme.palette.background.paper, 0.8)})`,
  },

  '& .ChatApp-content': {
    display: 'flex',
    flex: '1 1 100%',
    minHeight: 0,
  },
}));

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    maxWidth: '100%',
    overflow: 'hidden',
    // height: '100%',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
}));

function ChatApp(props) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const chat = useSelector(({ chatApp }) => chatApp.chat);
  const mobileChatsSidebarOpen = useSelector(({ chatApp }) => chatApp.sidebars.mobileChatsSidebarOpen);
  const customerSidebarOpen = useSelector(({ chatApp }) => chatApp.sidebars.customerSidebarOpen);

  const selected = useSelector(({ chatApp }) => chatApp.current.selected);
  const selectType = useSelector(({ chatApp }) => chatApp.current.selectType);
  const { organization } = useSelector(({ auth }) => auth.organization);
  const { id: userId } = useSelector(({ auth }) => auth.user.foxData);

  const [processId, setProcessId] = useState();

  const [searchParams, setSearchParams] = useState(qs.parse(props.location.search, { ignoreQueryPrefix: true }));
  // console.log('@@ searchParams: ', searchParams);
  // searchParams.get("__firebase_request_key")

  useEffect(() => {
    dispatch(getBoards());
    console.info('[useEffect] Start component organization: ', organization);
    // Init Event connection
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((idToken) => {
        if (organization && organization.id) {
          console.info('[SSE] Start Connecting');
          const events = new EventSource(
            `${process.env.REACT_APP_BACKEND_URL}/api/sse/events?authorization=${idToken}&organizationId=${organization.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`,
              },
            }
          );
          events.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            switch (parsedData.type) {
              case 'init-connection':
                console.info('[SSE] Init Connection Id: ', parsedData.processId);
                // setProcessId(parsedData.processId);
                break;
              default:
                console.log('[SSE] onMessage ', event.data);
                dispatch(getChats());
                dispatch(updateCurrent());
            }
          };
        }
      });
    return () => {
      if (organization && organization.id) {
        console.info('[SSE] close Connection ', userId);
        if (userId) {
          axios.delete(`/api/sse/closes/${userId}`);
          // .then(() => {
          // setProcessId();
          // });
        }
      }
    };
  }, [dispatch, organization, userId]);

  useEffect(() => {
    dispatch(clearSelect());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams && searchParams.chatId) {
      const chatId = searchParams.chatId ? searchParams.chatId : '';
      dispatch(getChat({ chatId, isMobile }));
    }
  }, [dispatch, isMobile, searchParams]);

  const [channelName, setChannelName] = useState('');
  useMemo(() => {
    if (selected && selected.channel) {
      if (selected.channel.channel === 'line' && selected.channel.line) setChannelName(selected.channel.line.name);
      if (selected.channel.channel === 'facebook' && selected.channel.facebook)
        setChannelName(selected.channel.facebook.name);
    }
  }, [selected]);

  // Mask Follow Up and spam
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <GlobalStyles
        styles={() => ({
          '#fuse-main': {
            height: '100vh',
          },
        })}
      />
      <Root>
        <div className="ChatApp-topBg" />

        <div className={clsx('ChatApp-contentCardWrapper', 'container')}>
          <div className={clsx('ChatApp-contentCard', 'shadow rounded-20')}>
            <Hidden mdUp>
              <StyledSwipeableDrawer
                className="h-full absolute z-20"
                variant="temporary"
                anchor="left"
                open={mobileChatsSidebarOpen}
                onOpen={(ev) => {}}
                onClose={() => dispatch(closeMobileChatsSidebar())}
                disableSwipeToOpen
                classes={{
                  paper: 'absolute ltr:left-0 rtl:right-0',
                }}
                style={{ position: 'absolute' }}
                ModalProps={{
                  keepMounted: true,
                  disablePortal: true,
                  BackdropProps: {
                    classes: {
                      root: 'absolute',
                    },
                  },
                }}
              >
                <ChatsSidebar />
              </StyledSwipeableDrawer>
            </Hidden>
            <Hidden mdDown>
              <StyledSwipeableDrawer
                className="h-full z-20"
                variant="permanent"
                open
                onOpen={(ev) => {}}
                onClose={(ev) => {}}
              >
                <ChatsSidebar />
              </StyledSwipeableDrawer>
            </Hidden>

            <main className={clsx('ChatApp-contentWrapper', 'z-10', 'w-full')}>
              {!selected ? (
                <div className="flex flex-col flex-1 items-center justify-center p-24">
                  <Paper className="rounded-full p-48 md:p-64 shadow-xl">
                    <Icon className="block text-48 md:text-64" color="secondary">
                      chat
                    </Icon>
                  </Paper>
                  <Typography variant="h6" className="mt-24 mb-12 text-32 font-700">
                    Chat App
                  </Typography>
                  <Typography className="hidden md:flex px-16 pb-24 text-16 text-center" color="textSecondary">
                    Select a customer to start a conversation!..
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="flex md:hidden"
                    onClick={() => dispatch(openMobileChatsSidebar())}
                  >
                    Select a customer to start a conversation!..
                  </Button>
                </div>
              ) : (
                <>
                  {/* Chat message Header */}
                  <AppBar className="w-full" elevation={0} position="static">
                    <Toolbar className="px-16 m-8">
                      <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={() => dispatch(openMobileChatsSidebar())}
                        className="flex md:hidden"
                        size="large"
                      >
                        <Icon>chat</Icon>
                      </IconButton>
                      <div className="flex flex-row justify-between w-full">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => dispatch(openCustomerSidebar())}
                          onKeyDown={() => dispatch(openCustomerSidebar())}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="relative mx-8">
                            <div className="absolute right-0 bottom-0 -m-4 z-10">
                              <SocialIcon status={selected.channel.channel} />
                            </div>

                            {selectType === 'chat' && (
                              <Avatar
                                sx={{ width: 60, height: 60 }}
                                src={selected.customer.pictureURL}
                                alt={selected.customer.display}
                              />
                            )}
                            {selectType === 'history' && (
                              <Avatar sx={{ width: 60, height: 60 }} src={selected.pictureURL} alt={selected.display} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <Typography color="white" className="text-18 font-semibold px-4">
                              {selectType === 'chat' && (
                                <>
                                  <Hidden mdDown>
                                    <>
                                      {selected.customer.firstname
                                        ? `${selected.customer.firstname.substring(0, 15)}`
                                        : `${selected.customer.display.substring(0, 15)}`}
                                    </>
                                  </Hidden>
                                  <Hidden mdUp>
                                    <>
                                      {selected.customer.firstname || selected.customer.lastname
                                        ? `${selected.customer.firstname} ${selected.customer.lastname}`
                                        : `${selected.customer.display}`}
                                    </>
                                  </Hidden>
                                </>
                              )}
                              {selectType === 'history' && (
                                <>
                                  <Hidden mdDown>
                                    <>
                                      {selected.firstname
                                        ? `${selected.firstname.substring(0, 15)}`
                                        : `${selected.display.substring(0, 15)}`}
                                    </>
                                  </Hidden>
                                  <Hidden mdUp>
                                    <>
                                      {selected.firstname || selected.lastname
                                        ? `${selected.firstname} ${selected.lastname}`
                                        : `${selected.display}`}
                                    </>
                                  </Hidden>
                                </>
                              )}
                            </Typography>
                            <div className="flex flex-col md:flex-row space-x-8">
                              <Hidden mdDown>
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                  className="w-min m-8"
                                  label={channelName}
                                />
                                {selectType === 'chat' &&
                                  selected.mention.filter((el) => !el.isRead && el.user.id === userId).length > 0 && (
                                    <Chip
                                      size="small"
                                      variant="outlined"
                                      color="error"
                                      className="w-min m-8"
                                      label={`TeamChat mention: ${
                                        selected.mention.filter((el) => !el.isRead && el.user.id === userId).length
                                      }`}
                                    />
                                  )}
                              </Hidden>
                              <Hidden mdUp>
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  color="secondary"
                                  className="w-min m-8"
                                  label={`${channelName.substring(0, 15)}...`}
                                />
                                {selectType === 'chat' &&
                                  selected.mention.filter((el) => !el.isRead && el.user.id === userId).length > 0 && (
                                    <Chip
                                      size="small"
                                      variant="outlined"
                                      color="error"
                                      className="w-min m-8"
                                      label={`Mention: ${
                                        selected.mention.filter((el) => !el.isRead && el.user.id === userId).length
                                      }`}
                                    />
                                  )}
                              </Hidden>
                            </div>
                          </div>
                        </div>
                      </div>
                      {selectType === 'chat' && (
                        <div className="flex flex-row w-full justify-end">
                          <Hidden mdDown>
                            <ChatOwnerSetting isMobile={false} />
                            <ChatStatusSetting isMobile={false} />
                          </Hidden>

                          {/* More setting mask spam followup */}
                          <IconButton color="inherit" aria-label="settings" onClick={handleClick} size="large">
                            <MoreVertIcon />
                          </IconButton>

                          <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'center',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'center',
                            }}
                            maxWidth="md"
                          >
                            <div className="flex flex-col space-y-8">
                              <Hidden lgUp>
                                <ChatOwnerSetting isMobile />
                                <ChatStatusSetting isMobile />
                              </Hidden>

                              <div className="flex flex-col" style={{ margin: '10px' }}>
                                {selectType === 'chat' && <ChatFollowupSetting />}
                                {selectType === 'chat' && <TicketDetailSetting />}
                                {selectType === 'chat' && <OpenHistoryButton handleClose={handleClose} />}
                              </div>
                            </div>
                          </Popover>
                        </div>
                      )}
                    </Toolbar>
                  </AppBar>

                  <div className="ChatApp-content">
                    {/* Message List */}
                    {selectType && selectType === 'chat' && <Chat className="flex flex-1 z-10" />}

                    {selectType && selectType === 'history' && <History className="flex flex-1 z-0" />}
                  </div>
                </>
              )}
            </main>

            <StyledSwipeableDrawer
              className="h-full absolute z-30"
              variant="temporary"
              anchor="right"
              open={customerSidebarOpen}
              onOpen={(ev) => {}}
              onClose={() => dispatch(closeCustomerSidebar())}
              classes={{
                paper: 'absolute ltr:right-0 rtl:left-0',
              }}
              sx={{ '& .MuiDrawer-paper': { position: 'absolute' } }}
              ModalProps={{
                keepMounted: true,
                disablePortal: true,
                BackdropProps: {
                  classes: {
                    root: 'absolute',
                  },
                },
              }}
            >
              <CustomerSidebar />
            </StyledSwipeableDrawer>
          </div>
        </div>
      </Root>
    </>
  );
}

export default withReducer('chatApp', reducer)(ChatApp);
