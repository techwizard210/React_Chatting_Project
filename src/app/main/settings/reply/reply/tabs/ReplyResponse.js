import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';

import ResponseEditor from '../components/ResponseEditor';

import { addNewResponse } from '../../store/responseSlice';

function ReplyResponse(props) {
  const responseLimit = 2;

  const dispatch = useDispatch();
  const responses = useSelector(({ replyApp }) => replyApp.response.data);

  const [replyResponseList, setReplyResponseList] = useState([]);

  useEffect(() => {
    if (responses) {
      const newResponses = [...responses];
      setReplyResponseList(newResponses);
    }
  }, [responses]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col">
        {replyResponseList && replyResponseList.length > 0 ? (
          <>
            {replyResponseList.map((el, index) => {
              return <ResponseEditor responseIndex={index} key={index} />;
            })}
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              disabled={replyResponseList.length > responseLimit - 1}
              onClick={() => {
                dispatch(addNewResponse());
              }}
            >
              Add
            </Button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="flex flex-col flex-1 items-center justify-center h-full"
          >
            <Typography color="textSecondary" variant="h5">
              There is no Response!
            </Typography>
            <Button
              className="m-12"
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              disabled={replyResponseList.length > responseLimit - 1}
              onClick={() => {
                dispatch(addNewResponse());
              }}
            >
              Add new Response
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ReplyResponse;
