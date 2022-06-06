import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  deleteChecklistItem,
  updateChecklistItem,
  updateChecklist,
  removeChecklist,
} from 'app/main/scrumboard/store/cardSlice';
import CardAddChecklistItem from './CardAddChecklistItem';
import CardChecklistItem from './CardChecklistItem';
import CardChecklistName from './CardChecklistName';

function CardChecklist(props) {
  const dispatch = useDispatch();
  const { onCheckListChange, checklist, index } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const checkListNameRef = useRef();
  const { watch, control } = useForm({ mode: 'onChange', defaultValues: checklist });
  const form = watch();

  useEffect(() => {
    if (!_.isEqual(form, checklist)) {
      onCheckListChange(form, index);
    }
  }, [form, index, onCheckListChange, checklist]);

  function handleOpenNameForm(ev) {
    handleMenuClose();
    checkListNameRef.current.openForm(ev);
  }

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function checkItemsChecked() {
    return _.sum(form.checkItems.map((x) => (x.checked ? 1 : 0)));
  }

  if (!form) {
    return null;
  }
  return (
    <div className="mb-24">
      <div className="flex items-center justify-between mt-16 mb-12">
        <div className="flex items-center">
          <Icon className="text-20">check_box</Icon>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <CardChecklistName
                name={value}
                onNameChange={(val) => {
                  onChange(val);
                  dispatch(updateChecklist({ checklist, listName: val }))
                    .unwrap()
                    .then((payload) => {});
                }}
                ref={checkListNameRef}
              />
            )}
          />
        </div>
        <div className="">
          <IconButton
            aria-owns={anchorEl ? 'actions-menu' : null}
            aria-haspopup="true"
            onClick={handleMenuOpen}
            variant="outlined"
            size="small"
          >
            <Icon className="text-20">more_vert</Icon>
          </IconButton>
          <Menu id="actions-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {/* <MenuItem onClick={props.onRemoveCheckList}> */}
            <MenuItem
              onClick={() =>
                dispatch(removeChecklist({ checklistId: checklist.id }))
                  .unwrap()
                  .then((payload) => {
                    props.onRemoveCheckList();
                  })
              }
            >
              <ListItemIcon className="min-w-40">
                <Icon>delete</Icon>
              </ListItemIcon>
              <ListItemText primary="Remove Checklist" />
            </MenuItem>
            <MenuItem onClick={handleOpenNameForm}>
              <ListItemIcon className="min-w-40">
                <Icon>edit</Icon>
              </ListItemIcon>
              <ListItemText primary="Rename Checklist" />
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div className="">
        <div className="flex items-center -mx-6">
          <Typography className="flex font-semibold mx-6">
            {`${checkItemsChecked()} / ${form.checkItems.length}`}
          </Typography>
          <LinearProgress
            className="flex flex-1 mx-6"
            variant="determinate"
            color="secondary"
            value={(100 * checkItemsChecked()) / form.checkItems.length}
          />
        </div>
        <Controller
          name="checkItems"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <List className="">
              {value.map((checkItem, _index) => (
                <CardChecklistItem
                  item={checkItem}
                  key={checkItem.id}
                  index={_index}
                  onListItemChange={(item, itemIndex) => {
                    onChange(_.setIn(value, `[${itemIndex}]`, item));
                    dispatch(updateChecklistItem({ item, checklistId: checklist.id }))
                      .unwrap()
                      .then((payload) => {});
                  }}
                  onListItemRemove={() => {
                    onChange(_.reject(value, { id: checkItem.id }));
                    dispatch(deleteChecklistItem({ itemId: checkItem.id }))
                      .unwrap()
                      .then((payload) => {});
                  }}
                />
              ))}
              <CardAddChecklistItem checklistId={checklist.id} onListItemAdd={(item) => onChange([...value, item])} />
            </List>
          )}
        />
      </div>
    </div>
  );
}

export default CardChecklist;
