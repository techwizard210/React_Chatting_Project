import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeCard } from 'app/main/scrumboard/store/boardSlice';
import ToolbarMenu from './ToolbarMenu';

function OptionsMenu(props) {
  const { boardId, cardId } = props;
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <IconButton color="inherit" onClick={handleMenuOpen} size="large">
        <Icon>more_horiz</Icon>
      </IconButton>
      <ToolbarMenu state={anchorEl} onClose={handleMenuClose}>
        {/* <MenuItem onClick={props.onRemoveCard}>Remove Card</MenuItem> */}
        <MenuItem
          onClick={() => {
            dispatch(removeCard({ boardId, cardId }));
          }}
        >
          Remove Card
        </MenuItem>
      </ToolbarMenu>
    </div>
  );
}

export default OptionsMenu;
