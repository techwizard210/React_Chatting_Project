import AppBar from '@mui/material/AppBar';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBoard, changeBoardSettings } from '../../../store/boardSlice';

function BoardSettingsSidebar(props) {
  const dispatch = useDispatch();
  const board = useSelector(({ scrumboardApp }) => scrumboardApp.board);

  return (
    <div>
      <AppBar position="static">
        <Toolbar className="flex w-full justify-center">Settings</Toolbar>
      </AppBar>

      <List className="py-16" dense>
        <ListItem button onClick={() => dispatch(changeBoardSettings({ subscribed: !board.settings.subscribed }))}>
          <ListItemIcon className="min-w-40">
            <Icon>remove_red_eye</Icon>
          </ListItemIcon>
          <ListItemText primary="Subscribe" />
          <ListItemSecondaryAction>
            <Switch
              onChange={() => dispatch(changeBoardSettings({ subscribed: !board.settings.subscribed }))}
              checked={board.settings.subscribed}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button onClick={() => dispatch(deleteBoard(board.id))}>
          <ListItemIcon className="min-w-40">
            <Icon>delete</Icon>
          </ListItemIcon>
          <ListItemText primary="Delete Board" />
        </ListItem>
      </List>
    </div>
  );
}

export default BoardSettingsSidebar;
