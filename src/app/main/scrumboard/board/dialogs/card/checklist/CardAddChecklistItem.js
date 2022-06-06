import { yupResolver } from '@hookform/resolvers/yup';
import Fab from '@mui/material/Fab';
import Icon from '@mui/material/Icon';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { useDispatch } from 'react-redux';
import ChecklistItemModel from 'app/main/scrumboard/model/ChecklistItemModel';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { newChecklistItem } from 'app/main/scrumboard/store/cardSlice';

import _ from '@lodash';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a title'),
});

function CardAddChecklistItem(props) {
  const { checklistId } = props;
  const dispatch = useDispatch();
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: props.name,
    },
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(data) {
    dispatch(
      newChecklistItem({
        checklistId,
        itemName: data.name,
      })
    )
      .unwrap()
      .then((payload) => {
        const checkListItem = new ChecklistItemModel();
        checkListItem.name = payload.name;
        props.onListItemAdd(checkListItem);
      });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ListItem className="px-0" dense>
        <span className="w-40" />
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="flex flex-1 mx-8"
              name="name"
              variant="outlined"
              placeholder="Add an item"
            />
          )}
        />
        <Fab
          className="mx-4"
          aria-label="Add"
          size="small"
          color="secondary"
          type="submit"
          disabled={_.isEmpty(dirtyFields) || !isValid}
        >
          <Icon>add</Icon>
        </Fab>
      </ListItem>
    </form>
  );
}

export default CardAddChecklistItem;
