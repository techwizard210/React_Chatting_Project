import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { openNewFacebookChannelDialog, openNewLineChannelDialog } from './store/channelsSlice';

function ChannelMenu(props) {
  const dispatch = useDispatch();
  const [menuState, setMenuState] = useState(null);

  const handleMenuClick = (event) => {
    setMenuState(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuState(null);
  };

  return (
    <>
      <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={handleMenuClick}>
        <span className="hidden sm:flex">Add New Channel</span>
        <span className="flex sm:hidden">New</span>
      </Button>

      <Popover
        open={Boolean(menuState)}
        anchorEl={menuState}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        <MenuItem
          role="button"
          onClick={() => {
            dispatch(openNewLineChannelDialog());
            handleMenuClose();
          }}
        >
          <ListItemText primary="Add LINE Channel" />
        </MenuItem>
        <MenuItem
          role="button"
          onClick={() => {
            dispatch(openNewFacebookChannelDialog());
            handleMenuClose();
          }}
        >
          <ListItemText primary="Add Facebook Channel" />
        </MenuItem>
      </Popover>
    </>
  );
}

export default ChannelMenu;
