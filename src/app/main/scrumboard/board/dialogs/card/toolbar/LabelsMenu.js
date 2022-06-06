import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import ToolbarMenu from './ToolbarMenu';

function LabelsMenu(props) {
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
        <Icon>label</Icon>
      </IconButton>
      <ToolbarMenu state={anchorEl} onClose={handleMenuClose}>
        {props.labels && (
          <div className="">
            {props.labels.map((label) => {
              return (
                <MenuItem
                  className="px-8"
                  key={label.id}
                  onClick={(ev) => {
                    props.onToggleLabel(label.id);
                  }}
                >
                  <Checkbox checked={props.idLabels.includes(label.id)} />
                  <ListItemText className="mx-8">{label.title}</ListItemText>
                  <ListItemIcon className="min-w-24">
                    <Icon>label</Icon>
                  </ListItemIcon>
                </MenuItem>
              );
            })}
          </div>
        )}
      </ToolbarMenu>
    </div>
  );
}

export default LabelsMenu;
