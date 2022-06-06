import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import CheckIcon from '@mui/icons-material/Check';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
// import StatusIcon from './StatusIcon';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getChannels } from './store/channelsSlice';

const useStyles = makeStyles((theme) => ({
  contactListItem: {
    '&.active': {
      backgroundColor: theme.palette.background.paper,
    },
  },
  unreadBadge: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

function FacebookPageListItem(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const org = useSelector(({ auth }) => auth.organization.organization);

  const facebookChannels = useSelector(({ channels }) => channels.facebook);

  const [connectError, setConnectError] = useState(false);

  const [connected, setConnected] = useState(false);
  const [facebookPage, setFacebookPage] = useState(null);
  const [foxPage, setFoxPage] = useState();
  const { page } = props;

  const getFoxPageSetting = () => {
    if (facebookChannels) {
      const foxFacebookPageFilter = facebookChannels.filter((element) => {
        console.log('element ', element);

        return element.facebook && element.facebook.pageId === page.id;
      });
      if (foxFacebookPageFilter.length > 0) {
        console.log('foxFacebookPageFilter ', foxFacebookPageFilter);
        setFoxPage(foxFacebookPageFilter[0]);
      }
    }
  };
  const getFacebookPageInformation = () => {
    const ret = axios
      .get(`https://graph.facebook.com/v10.0/${page.id}`, {
        headers: {
          Authorization: `Bearer ${page.access_token}`,
        },
        params: {
          fields: 'name,picture{url},category',
        },
      })
      .then((response) => {
        // console.log('facebook page ', response.data);
        setFacebookPage(response.data);
        return response.data;
      })
      .catch((error) => {
        console.error('[getFacebookPageInformation] ', error);
        return error;
      });

    // console.log('facebook page ', ret);
    return ret;
  };

  const connectPage = () => {
    // console.log('connectPage start ', page);
    const subscribeResult = axios
      .post(
        `https://graph.facebook.com/v10.0/${page.id}/subscribed_apps`,
        {},
        {
          headers: {
            Authorization: `Bearer ${page.access_token}`,
          },
          params: {
            subscribed_fields: 'messages',
          },
        }
      )
      .then(async (response) => {
        // console.log('connectPage response ', response);
        // console.log('connectPage subscribeResult ', response.data);
        const { token } = await firebase.auth().currentUser.getIdTokenResult();
        if (!token) return;
        // Save to Fox Backend
        const body = {
          channel: {
            channel: 'facebook',
            facebook: {
              accessToken: page.access_token,
              pageId: page.id,
              name: page.name,
            },
          },
        };
        const foxResult = await axios.post(`/api/${org.id}/channel`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFoxPage(foxResult.data);
        setConnected(true);
        dispatch(getChannels());
        dispatch(showMessage({ message: `${page.name} channel: Connected`, variant: 'success' }));

        const newPageResult = await foxResult.data;
        // return newPageResult;
      })
      .catch((error) => {
        console.error('[getFacebookPageInformation] ', error);
        return error;
      });

    // console.log('connectPage', subscribeResult);
    return subscribeResult;
  };

  useMemo(() => {
    // get page channel setting
    getFoxPageSetting();
    getFacebookPageInformation();
  }, [page]);

  return (
    <ListItem
      button
      disabled={foxPage && foxPage.organization && foxPage.organization.id !== org.id}
      className="px-16 py-12 min-h-92"
    >
      <div className="relative pl-16">
        {facebookPage && (
          <Avatar src={facebookPage.picture.data.url} alt={facebookPage.name}>
            {!facebookPage.picture.data.url || facebookPage.picture.data.url === '' ? facebookPage.name : ''}
          </Avatar>
        )}
      </div>

      <ListItemText
        classes={{
          root: 'min-w-px px-16',
          primary: 'font-medium text-14',
          secondary: 'truncate',
        }}
        primary={`${page.name}`}
        secondary={page.category}
      />
      {(!foxPage || foxPage.status === 'delete') && (
        <Button variant="outlined" color="primary" onClick={connectPage}>
          Connect
        </Button>
      )}
      {connected && (
        <Button variant="outlined" color="primary" startIcon={<CheckIcon />}>
          Connected
        </Button>
      )}
    </ListItem>
  );
}

export default FacebookPageListItem;
