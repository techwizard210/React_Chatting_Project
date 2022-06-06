import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import format from 'date-fns/format';

import clsx from 'clsx';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getReply } from './store/replySlice';

const StyledMessageRow = styled('div')(({ theme }) => ({
  '&.contact': {
    '& .bubble': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.getContrastText(theme.palette.background.paper),
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      '& .time': {
        marginLeft: 12,
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopLeftRadius: 20,
      },
    },
    '&.last-of-group': {
      '& .bubble': {
        borderBottomLeftRadius: 20,
      },
    },
  },
  '&.me': {
    paddingLeft: 40,

    '& .avatar': {
      order: 2,
      margin: '0 0 0 16px',
    },
    '& .bubble': {
      marginLeft: 'auto',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      '& .time': {
        justifyContent: 'flex-end',
        right: 0,
        marginRight: 12,
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopRightRadius: 20,
      },
    },

    '&.last-of-group': {
      '& .bubble': {
        borderBottomRightRadius: 20,
      },
    },
  },
  '&.contact + .me, &.me + .contact': {
    paddingTop: 20,
    marginTop: 20,
  },
  '&.first-of-group': {
    '& .bubble': {
      borderTopLeftRadius: 20,
      paddingTop: 13,
    },
  },
  '&.last-of-group': {
    '& .bubble': {
      borderBottomLeftRadius: 20,
      paddingBottom: 13,
      '& .time': {
        display: 'flex',
      },
    },
  },
}));

function History(props) {
  const dispatch = useDispatch();
  const chatRef = useRef(null);

  const [chat, setChat] = useState();
  const selected = useSelector(({ chatApp }) => chatApp.current.selected);

  useEffect(() => {
    if (selected.chat && selected.chat.length > 0) {
      setChat(selected.chat[selected.chat.length - 1]);
    }
  }, [selected]);
  useEffect(() => {
    if (chat) {
      scrollToBottom();
    }
  }, [chat]);

  const onImgLoaded = () => {
    scrollToBottom();
  };
  function scrollToBottom() {
    if (chatRef && chatRef.current && chatRef.current.scrollHeight)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
  function shouldShowContactAvatar(item, i) {
    return (
      item.direction === 'inbound' &&
      ((chat.message[i + 1] && chat.message[i + 1].direction !== 'inbound') || !chat.message[i + 1])
    );
  }

  function isFirstMessageOfGroup(item, i) {
    return i === 0 || (chat.message[i - 1] && chat.message[i - 1].direction !== item.direction);
  }

  function isLastMessageOfGroup(item, i) {
    return i === chat.message.length - 1 || (chat.message[i + 1] && chat.message[i + 1].direction !== item.direction);
  }

  const handleSelectChatChange = (event) => {
    setChat(event.target.value);
  };

  return (
    <div className={clsx('flex flex-col relative', props.className)}>
      {/* Select Chat menu */}
      {chat && (
        <FormControl variant="filled" className="w-full">
          <InputLabel id="demo-simple-select-filled-label">Ticket</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={chat}
            onChange={handleSelectChatChange}
            // renderValue={(selected) => <Typography>ID: {selected.id}</Typography>}
          >
            {selected.chat &&
              selected.chat.length &&
              selected.chat.map((item, index) => {
                const optionText = `${index + 1} : ${item.description ? item.description : ''} - ${format(
                  new Date(item.createdAt),
                  'PP'
                )}`;
                return (
                  <MenuItem value={item} key={index}>
                    {optionText}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      )}

      <FuseScrollbars ref={chatRef} className="flex flex-1 flex-col overflow-y-auto">
        {chat && chat.message.length > 0 ? (
          <div className="flex flex-col pt-16 px-16 ltr:pl-56 rtl:pr-56 pb-40">
            {chat.message.map((item, i) => {
              const messageObj = JSON.parse(item.data);
              return (
                <StyledMessageRow
                  key={item.id}
                  className={clsx(
                    'flex flex-col flex-grow-0 flex-shrink-0 items-start justify-end relative px-16 pb-4',
                    { me: item.direction === 'outbound' },
                    { contact: item.direction === 'inbound' },
                    { 'first-of-group': isFirstMessageOfGroup(item, i) },
                    { 'last-of-group': isLastMessageOfGroup(item, i) },
                    i + 1 === chat.message.length && 'pb-8'
                  )}
                >
                  {shouldShowContactAvatar(item, i) && (
                    <Avatar
                      className="avatar absolute ltr:left-0 rtl:right-0 m-0 -mx-32"
                      src={selected.pictureURL}
                      alt={selected.display}
                    />
                  )}
                  <div className="bubble flex relative items-center justify-center p-12 max-w-screen-sm shadow">
                    {item.type && item.type === 'image' && (
                      <img src={messageObj.url} alt={messageObj.id} className="w-full h-auto" onLoad={onImgLoaded} />
                    )}
                    {item.type && item.type === 'sticker' && (
                      <img src={messageObj.url} alt="Sticker" className="w-full h-auto" onLoad={onImgLoaded} />
                    )}
                    {item.type && item.type === 'text' && <div className=" break-all">{messageObj.text}</div>}

                    <Typography
                      className="time absolute hidden w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
                      color="textSecondary"
                    >
                      {item.direction === 'outbound' &&
                        item.createdBy &&
                        `By: ${item.createdBy.firstname} ${item.createdBy.lastname} @ `}
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </Typography>
                  </div>
                </StyledMessageRow>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 items-center justify-center">
              <Icon className="text-128" color="disabled">
                chat
              </Icon>
            </div>
            <Typography className="px-16 pb-24 text-center" color="textSecondary">
              No Chat history conversation.
            </Typography>
          </div>
        )}
      </FuseScrollbars>
    </div>
  );
}

export default History;
