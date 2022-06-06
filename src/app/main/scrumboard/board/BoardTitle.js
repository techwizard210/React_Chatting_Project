import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import _ from '@lodash';
import { renameBoard } from '../store/boardSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required('You must enter a title'),
});

function BoardTitle(props) {
  const dispatch = useDispatch();
  const board = useSelector(({ scrumboardApp }) => scrumboardApp.board);

  const [formOpen, setFormOpen] = useState(false);

  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: board.name,
    },
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (!formOpen) {
      reset({
        title: board.name,
      });
    }
  }, [formOpen, reset, board.name]);

  function handleOpenForm(ev) {
    ev.stopPropagation();
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
  }

  function onSubmit(data) {
    dispatch(renameBoard({ boardId: board.id, boardTitle: data.title }));
    handleCloseForm();
  }

  return (
    <div className="flex items-center min-w-0">
      {formOpen ? (
        <ClickAwayListener onClickAway={handleCloseForm}>
          <Paper>
            <form className="flex w-full" onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="filled"
                    margin="none"
                    autoFocus
                    hiddenLabel
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="submit"
                            disabled={_.isEmpty(dirtyFields) || !isValid}
                            size="large"
                          >
                            <Icon>check</Icon>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </form>
          </Paper>
        </ClickAwayListener>
      ) : (
        <div className="flex items-center justify-center">
          {board.settings.subscribed && <Icon className="text-16">remove_red_eye</Icon>}
          <Typography
            className="text-14 sm:text-18 font-medium cursor-pointer mx-8"
            onClick={handleOpenForm}
            color="inherit"
          >
            {board.name}
          </Typography>
        </div>
      )}
    </div>
  );
}

export default BoardTitle;
