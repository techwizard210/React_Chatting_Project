import Avatar from '@mui/material/Avatar';
import { styled, useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import { useMemo, useState } from 'react';
import SocialIcon from '../../SocialIcon';

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  ...(active && {
    backgroundColor: theme.palette.background.paper,
  }),
}));

function HistoryListItem(props) {
  const theme = useTheme();
  const selected = useSelector(({ chatApp }) => chatApp.current.selected);
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [channelName, setChannelName] = useState('');
  useMemo(() => {
    if (props.history && props.history.channel) {
      if (props.history.channel.channel === 'line') setChannelName(props.history.channel.line.name);
      if (props.history.channel.channel === 'facebook') setChannelName(props.history.channel.facebook.name);
    }
  }, [props]);

  return (
    <StyledListItem
      button
      className="px-16 py-12 min-h-92"
      active={selected && selected.id === props.history.id ? 1 : 0}
      onClick={() => props.onHistoryClick(props.history.id)}
    >
      <div className="relative">
        <div className="absolute right-0 bottom-0 -m-4 z-10">
          {props.history && props.history.channel && <SocialIcon status={props.history.channel.channel} />}
        </div>

        <Avatar src={props.history.pictureURL} alt={props.history.display} />
      </div>

      <ListItemText
        classes={{
          root: 'min-w-px px-16',
          primary: 'font-medium text-14',
          secondary: 'truncate',
        }}
        primary={
          props.history.firstname || props.history.lastname
            ? `${props.history.firstname} ${props.history.lastname}`
            : `${props.history.display}`
        }
        secondary={channelName}
      />

      {props.history.id && (
        <div className="flex flex-col justify-center items-end">
          {props.history.createdAt && (
            <Typography className="whitespace-nowrap mb-8 font-medium text-12" color="textSecondary">
              {format(new Date(props.history.createdAt), 'PP')}
            </Typography>
          )}
          {props.history.chat && props.history.chat.length > 0 && (
            // <Box
            //   sx={{
            //     backgroundColor: 'primary.main',
            //     color: 'primary.contrastText',
            //   }}
            //   className="flex items-center justify-center min-w-24 h-24 rounded-full font-medium text-12 text-center"
            // >
            //   {props.history.chat.length}
            // </Box>
            <Typography className="whitespace-nowrap mb-8 font-medium text-12" color="textSecondary">
              {`${props.history.chat.length} chat`}
            </Typography>
          )}
        </div>
      )}
    </StyledListItem>
  );
}

export default HistoryListItem;
