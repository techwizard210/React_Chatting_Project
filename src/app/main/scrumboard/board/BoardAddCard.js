import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import _ from '@lodash';
import { newCard } from '../store/boardSlice';

const defaultValues = {
  title: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title: yup.string().required('You must enter a title'),
});

function BoardAddCard(props) {
  const dispatch = useDispatch();
  const board = useSelector(({ scrumboardApp }) => scrumboardApp.board);

  const [formOpen, setFormOpen] = useState(false);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (!formOpen) {
      reset(defaultValues);
    }
  }, [formOpen, reset]);

  function handleOpenForm(ev) {
    ev.stopPropagation();
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
  }

  function onSubmit(data) {
    dispatch(newCard({ boardId: board.id, listId: props.listId, cardTitle: data.title })).then(
      () => {
        props.onCardAdded();
      }
    );
    handleCloseForm();
  }

  return (
    <div className="w-full border-t-1">
      {formOpen ? (
        <ClickAwayListener onClickAway={handleCloseForm}>
          <form className="p-16" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  className="mb-16"
                  required
                  fullWidth
                  variant="filled"
                  label="Card title"
                  autoFocus
                  InputProps={{
                    ...field,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCloseForm} size="large">
                          <Icon className="text-18">close</Icon>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <div className="flex justify-between items-center">
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Add
              </Button>
            </div>
          </form>
        </ClickAwayListener>
      ) : (
        <Button
          onClick={handleOpenForm}
          classes={{
            root: 'font-medium w-full px-16 rounded-none h-48 justify-start',
          }}
        >
          <Icon className="text-20">add</Icon>
          <span className="mx-8">Add a card</span>
        </Button>
      )}
    </div>
  );
}

export default BoardAddCard;
