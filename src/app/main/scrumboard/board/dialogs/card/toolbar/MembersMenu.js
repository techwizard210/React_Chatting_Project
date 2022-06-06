import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import ToolbarMenu from './ToolbarMenu';

function MembersMenu(props) {
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
        <Icon>account_circle</Icon>
      </IconButton>
      <ToolbarMenu state={anchorEl} onClose={handleMenuClose}>
        {props.members && (
          <div className="">
            {props.members.map((member) => {
              return (
                <MenuItem
                  className="px-8"
                  key={member.id}
                  onClick={(ev) => {
                    props.onToggleMember(member.id);
                  }}
                >
                  <Checkbox checked={props.idMembers.includes(member.id)} />
                  <Avatar className="w-32 h-32" src={member.picture} />
                  <ListItemText className="mx-8">{member.display}</ListItemText>
                </MenuItem>
              );
            })}
          </div>
        )}
      </ToolbarMenu>
    </div>
  );
}

export default MembersMenu;
