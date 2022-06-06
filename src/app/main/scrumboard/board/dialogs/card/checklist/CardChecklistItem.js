import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch } from 'react-redux';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import _ from '@lodash';
import { changelistItemStatus } from 'app/main/scrumboard/store/cardSlice';

function CardChecklistItem(props) {
  const dispatch = useDispatch();
  const { item, onListItemChange, index } = props;
  const { control, watch } = useForm({ mode: 'onChange', defaultValues: item });
  const form = watch();

  useEffect(() => {
    if (!_.isEqual(item, form)) {
      onListItemChange(form, index);
    }
  }, [form, index, onListItemChange, item]);

  return (
    <ListItem className="px-0" key={item.id} dense>
      <Controller
        name="checked"
        control={control}
        defaultValue={false}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            tabIndex={-1}
            checked={value}
            onChange={(ev) => {
              onChange(ev.target.checked);
              dispatch(changelistItemStatus({ itemId: item.id, checkeStatus: ev.target.checked }))
                .unwrap()
                .then((payload) => {});
            }}
            disableRipple
          />
        )}
      />

      <Controller
        name="name"
        control={control}
        render={({ field }) => <TextField {...field} className="flex flex-1 mx-8" variant="outlined" />}
      />

      <IconButton aria-label="Delete" onClick={props.onListItemRemove} size="large">
        <Icon>delete</Icon>
      </IconButton>
    </ListItem>
  );
}

export default CardChecklistItem;
