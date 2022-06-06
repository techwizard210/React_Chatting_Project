import FuseLoading from '@fuse/core/FuseLoading';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MessageIcon from '@mui/icons-material/Message';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
// import { showMessage } from 'app/store/fuse/messageSlice';

import { useEffect, useState } from 'react';

import { removeKeyword, updateData } from '../../store/replySlice';
// import { removeKeyword, addKeyword } from '../../store/replySlice';

function ReplyKeyword(props) {
  const dispatch = useDispatch();
  const reply = useSelector(({ replyApp }) => replyApp.reply.data);
  const organizationId = useSelector(({ auth }) => auth.organization.organizationId);
  const userId = useSelector(({ auth }) => auth.user.foxData);

  const [replyKeyword, setReplyKeyword] = useState([]);
  const [inputKeyword, setInputKeyword] = useState('');

  useEffect(() => {
    if (reply && reply.keyword) {
      setReplyKeyword(reply.keyword);
    }
  }, [reply]);

  function onInputChange(ev) {
    setInputKeyword(ev.target.value);
  }
  function onKeywordSubmit(ev) {
    ev.preventDefault();
    if (inputKeyword.trim() === '') {
      return;
    }

    // split string with space or comma
    const newKeywords = inputKeyword.split(/[, ]+/).filter((element) => element);
    console.log('New Keyword ', newKeywords);

    const newReply = { ...reply };
    const newReplyKeyword = [...reply.keyword];

    newKeywords.forEach((newKeyword) => {
      // filter duplicate keyword
      const duplicate = newReplyKeyword.find((element) => element.keyword.toLowerCase() === newKeyword.toLowerCase());
      if (!duplicate) {
        newReplyKeyword.push({
          keyword: newKeyword.toLowerCase(),
          organization: { id: organizationId },
          createdBy: { id: userId },
        });
      }
    });

    newReply.keyword = newReplyKeyword;
    dispatch(updateData(newReply));
    setInputKeyword('');
  }

  function onKeywordRemove(keyword) {
    if (keyword) {
      if (keyword.id) {
        dispatch(removeKeyword(keyword.id));
      } else {
        const newReply = { ...reply };
        const newReplyKeyword = reply.keyword.filter((element) => element.keyword !== keyword.keyword);
        newReply.keyword = newReplyKeyword;
        dispatch(updateData(newReply));
      }
    }
  }

  if (!reply) return <FuseLoading />;

  return (
    <div className="flex w-full flex-col px-20 ">
      <form onSubmit={onKeywordSubmit} className=" items-center w-full">
        <TextField
          color="primary"
          placeholder="Add Keyword"
          id="message-input"
          onChange={onInputChange}
          value={inputKeyword}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MessageIcon />
              </InputAdornment>
            ),
          }}
        />
      </form>

      <List className="p-12 items-center w-full">
        {replyKeyword && replyKeyword.length > 0 ? (
          replyKeyword.map((keyword, index) => {
            return (
              <ListItem button className="p-20" key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <MessageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText className="capitalize" primary={keyword.keyword} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    // onClick={() => {
                    //   dispatch(removeKeyword(keyword.id));
                    // }}
                    onClick={() => {
                      onKeywordRemove(keyword);
                    }}
                    size="large"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="flex flex-col flex-1 items-center justify-center h-full"
          >
            <Typography color="textSecondary" variant="h5">
              There is no Keyword!
            </Typography>
          </motion.div>
        )}
      </List>
    </div>
  );
}

export default ReplyKeyword;
