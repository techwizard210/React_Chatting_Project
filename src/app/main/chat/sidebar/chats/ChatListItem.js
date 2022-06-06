import Avatar from '@mui/material/Avatar';

import Hidden from '@mui/material/Hidden';
import { styled, useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import Chip from '@mui/material/Chip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import { Box } from '@mui/system';
import { useMemo, useState } from 'react';
import SocialIcon from '../../SocialIcon';

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  ...(active && {
    backgroundColor: theme.palette.background.paper,
  }),
}));

function ChatListItem(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const selected = useSelector(({ chatApp }) => chatApp.current.selected);
  const [lastMessageText, setLastMessageText] = useState(0);

  const [channelName, setChannelName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [label, setLabel] = useState([]);

  // Convert lastMessage to Text
  useMemo(() => {
    if (props && props.chat) {
      const { lastMessage } = props.chat;
      const lastMsgObj = JSON.parse(lastMessage.data);
      if (lastMessage.type === 'text') {
        const { text } = lastMsgObj;
        if (text.length > 20) {
          setLastMessageText(`${text.substring(0, 20)}...`);
        } else {
          setLastMessageText(text.substring(0, 20));
        }
      } else if (lastMessage.type === 'sticker') {
        setLastMessageText('Sticker');
      } else if (lastMessage.type === 'image') {
        setLastMessageText('Image');
      } else {
        setLastMessageText('Unknown type');
      }

      if (props.chat.channel) {
        if (props.chat.channel.channel === 'line' && props.chat.channel.line)
          setChannelName(props.chat.channel.line.name);
        if (props.chat.channel.channel === 'facebook' && props.chat.channel.facebook)
          setChannelName(props.chat.channel.facebook.name);
      }
      if (props.chat.customer.firstname || props.chat.customer.lastname) {
        setCustomerName(`${props.chat.customer.firstname} ${props.chat.customer.lastname}`);
      } else {
        setCustomerName(`${props.chat.customer.display}`);
      }

      if (props.chat.customer && props.chat.customer.customerLabel && props.chat.customer.customerLabel.length > 0) {
        setLabel(props.chat.customer.customerLabel.slice(0, 3));
      }
    }
  }, [props]);

  return (
    <StyledListItem
      button
      className="px-16 py-12 min-h-92"
      active={selected && selected.id === props.chat.id ? 1 : 0}
      onClick={() => props.onChatClick(props.chat.id)}
    >
      <div className="relative">
        <div className="absolute right-0 bottom-0 -m-4 z-10">
          {props.chat && props.chat.channel && <SocialIcon status={props.chat.channel.channel} />}
        </div>

        <Avatar src={props.chat.customer.pictureURL} alt={props.chat.customer.display} />
      </div>

      <ListItemText
        alignItems="flex-start"
        classes={{
          root: 'min-w-px px-16',
          primary: 'font-medium text-14',
          secondary: 'truncate',
        }}
        primary={
          <>
            {customerName}
            {label.map((element, index) => {
              if (index === 0) return <Chip size="small" color="info" className="w-min m-2" label={element.label} />;
              if (index === 1) return <Chip size="small" color="success" className="w-min m-2" label={element.label} />;
              return <Chip size="small" color="primary" className="w-min m-2" label={element.label} />;
            })}

            {props &&
              props.chat &&
              props.chat.customer &&
              props.chat.customer.customerLabel &&
              props.chat.customer.customerLabel.length > 3 && <Chip size="small" className="w-min m-2" label="..." />}
          </>
        }
        secondary={
          <>
            <Hidden mdDown>
              <Chip
                size="small"
                variant="outlined"
                color="secondary"
                className="w-min my-1"
                label={channelName.length > 20 ? `${channelName.substring(0, 20)}...` : `${channelName}`}
              />
            </Hidden>
            <Hidden mdUp>
              <Chip
                size="small"
                variant="outlined"
                color="secondary"
                className="w-min my-1"
                label={channelName.length > 10 ? `${channelName.substring(0, 10)}...` : `${channelName}`}
              />
            </Hidden>

            <Typography variant="body2" color="text.primary">
              {lastMessageText}
            </Typography>
          </>
        }
      />

      {props.chat.id && (
        <div className="flex flex-col justify-center items-end">
          {props.chat.lastMessage.createdAt && (
            <Typography className="whitespace-nowrap mb-8 font-medium text-12" color="textSecondary">
              {format(new Date(props.chat.lastMessage.createdAt), 'PP')}
            </Typography>
          )}
          <div className="flex flex-row space-x-8">
            {props.chat.newMention && (
              <Box
                sx={{
                  backgroundColor: 'red',
                  color: 'white',
                }}
                className="flex items-center justify-center min-w-24 h-24 rounded-full font-medium text-12 text-center"
              >
                M
              </Box>
            )}
            {props.chat.unread && (
              <Box
                sx={{
                  backgroundColor: 'secondary.main',
                  color: 'secondary.contrastText',
                }}
                className="flex items-center justify-center min-w-24 h-24 rounded-full font-medium text-12 text-center"
              >
                {props.chat.unread}
              </Box>
            )}
          </div>
        </div>
      )}
    </StyledListItem>
  );
}

export default ChatListItem;
