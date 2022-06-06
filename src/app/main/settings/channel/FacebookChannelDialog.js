import FuseLoading from '@fuse/core/FuseLoading';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import firebase from 'firebase/compat/app';

// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import FacebookPageList from './FacebookPageList';

import {
  addFacebookUserTokenChannel,
  removeFacebookUserTokenChannel,
  closeNewFacebookChannelDialog,
  closeEditFacebookChannelDialog,
} from './store/channelsSlice';

export default function FacebookChannelDialog(props) {
  const dispatch = useDispatch();
  const org = useSelector(({ auth }) => auth.organization.organization);
  const foxUser = useSelector(({ auth }) => auth.user.foxData);
  const [facebookUser, setFacebookUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageListLoading, setPageListLoading] = useState(true);
  const [pageList, setPageList] = useState([]);

  const channelDialog = useSelector(({ channels }) => channels.channelDialog);
  const getFacebookUser = (facebookAccessToken) => {
    const getProfileURL = `https://graph.facebook.com/v12.0/me?fields=picture{url},name,email&access_token=${facebookAccessToken}`;
    axios
      .get(getProfileURL)
      .then((result) => {
        const profile = result.data;
        console.log('[profile] ', profile);
        setFacebookUser({
          ...profile,
          userID: profile.id,
          accessToken: facebookAccessToken,
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setFacebookUser(null);
      });
  };

  // Dialog open
  useEffect(() => {
    if (channelDialog.facebook.props.open) {
      if (foxUser && foxUser.facebookToken) {
        getFacebookUser(foxUser.facebookToken);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(true);
      setFacebookUser(null);
    }
  }, [channelDialog.facebook.props]);

  useEffect(() => {
    if (facebookUser) {
      // Get Page List with user token
      getPageList(facebookUser.userID, facebookUser.accessToken).then((result) => {
        setPageList(result);
        setPageListLoading(false);
      });
    }

    // return () => {
    //   cleanup
    // }
  }, [facebookUser]);

  // const facebookAppId = '1365602510476429'; // Prod
  // const facebookAppId = '384755666401341'; // Dev
  // const facebookAppId = '3374045009402564'; // Localhost
  const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

  const logout = () => {
    setFacebookUser(null);
    dispatch(removeFacebookUserTokenChannel());
  };

  const responseFacebook = async (response) => {
    console.log('Facebook Login Response ', response);
    if (response.accessToken && !response.error) {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return;
      setLoading(true);
      const exchange = await axios.get(`/api/${org.id}/channel/exchangeToken`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          accessToken: response.accessToken,
        },
      });
      const exchangeResponse = await exchange.data;
      console.log('exchangeResponse ', exchangeResponse);
      // Add token to fox User profile
      dispatch(addFacebookUserTokenChannel(exchangeResponse.access_token));
      getFacebookUser(exchangeResponse.access_token);
      // setFacebookUser(response);
    } else {
      setFacebookUser(null);
      setLoading(false);
    }
  };

  const getPageList = (userID, accessToken) => {
    const URL = `https://graph.facebook.com/v12.0/${userID}/accounts?access_token=${accessToken}`;
    const ret = axios
      .get(URL)
      .then(async (response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.error('Send Text to Facebook API: ', error);
        return false;
      });
    return ret;
  };
  function closeComposeDialog() {
    return channelDialog.type === 'edit'
      ? dispatch(closeEditFacebookChannelDialog())
      : dispatch(closeNewFacebookChannelDialog());
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...channelDialog.facebook.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="sm"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {channelDialog.type === 'new' ? 'New Facebook Channel' : 'Edit Facebook Channel'}
          </Typography>
        </Toolbar>
      </AppBar>
      <>
        <DialogContent classes="flex flex-row p-24 justify-items-center">
          {loading ? (
            <FuseLoading />
          ) : (
            <>
              {facebookUser ? (
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row space-x-8 p-24 items-center">
                      <Avatar
                        src={facebookUser.picture.data.url}
                        // alt={customer.name}
                        alt={facebookUser.name}
                        className="w-64 h-64"
                      />
                      <div className="flex flex-col space-y-6">
                        <Typography variant="h6">{`${facebookUser.name}`}</Typography>
                        <Typography variant="subtitle2">{facebookUser.email}</Typography>
                        {/* <Typography variant="subtitle2">{customer.channelName}</Typography> */}
                        {/* <Typography variant="caption">UUID: {customer.uid}</Typography> */}
                      </div>
                    </div>

                    <div className="flex flex-row space-x-8 p-24 items-center">
                      <FacebookLogin
                        appId={facebookAppId}
                        fields="name,email,picture"
                        scope="public_profile,pages_show_list,pages_manage_metadata,pages_messaging,email,pages_read_engagement"
                        callback={responseFacebook}
                        icon="fa-facebook"
                        render={(renderProps) => (
                          <Button onClick={renderProps.onClick} variant="outlined" color="primary">
                            Edit
                          </Button>
                        )}
                      />

                      <Button variant="outlined" color="primary" onClick={logout}>
                        Logout
                      </Button>
                    </div>
                  </div>

                  {pageListLoading ? (
                    <FuseLoading />
                  ) : (
                    <>
                      <Alert className="mx-16" variant="outlined" severity="info">
                        If invisible page in this list click Edit and edit settings.
                      </Alert>
                      {pageList && pageList.length > 0 ? (
                        <FacebookPageList pageList={pageList} />
                      ) : (
                        <div className="flex flex-col flex-1">
                          <Typography className="px-16 pb-24 text-center" color="textSecondary">
                            No Page List.
                          </Typography>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex w-full items-center">
                  <FacebookLogin
                    appId={facebookAppId}
                    fields="name,email,picture"
                    scope="public_profile,pages_show_list,pages_manage_metadata,pages_messaging,email,pages_read_engagement"
                    callback={responseFacebook}
                    icon="fa-facebook"
                    render={(renderProps) => (
                      <Button
                        onClick={renderProps.onClick}
                        variant="outlined"
                        color="primary"
                        className="bg-blue-500 px-4 py-2 text-white inline-flex items-center space-x-2 rounded"
                      >
                        <svg
                          className="w-24 h-24 p-4 fill-current"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Login with Facebook
                      </Button>
                    )}
                  />
                </div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions className="justify-end p-4 pb-16">
          <div className="px-16">
            <Button variant="contained" color="primary" onClick={closeComposeDialog}>
              Close
            </Button>
          </div>
        </DialogActions>
      </>
    </Dialog>
  );
}
