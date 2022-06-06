import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeAttachmentFile } from 'app/main/scrumboard/store/cardSlice';

function CardAttachment(props) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { item } = props;
  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  switch (props.item.type) {
    case 'image': {
      return (
        <div className="flex w-full sm:w-1/2 mb-16 px-16" key={props.item.id}>
          <div className="flex items-center justify-center min-w-128 w-128 h-128">
            <Paper className="overflow-hidden shadow">
              <img className="block max-h-full" src={props.item.src} alt="attachment" />
            </Paper>
          </div>
          <div className="flex flex-auto flex-col justify-center items-start min-w-0 px-16">
            <div className="flex items-center w-full">
              <Typography className="text-16 font-semibold truncate flex-shrink">{props.item.name}</Typography>
              {props.card.idAttachmentCover === props.item.id && (
                <Icon className="text-orange-300 text-20 mx-4">star</Icon>
              )}
            </div>
            <Typography className="truncate w-full mb-12" color="textSecondary">
              {format(fromUnixTime(props.item.time), 'Pp')}
            </Typography>
            <Button
              aria-owns={anchorEl ? 'actions-menu' : null}
              aria-haspopup="true"
              onClick={handleMenuOpen}
              variant="outlined"
              size="small"
            >
              Actions
              <Icon className="text-20">arrow_drop_down</Icon>
            </Button>
            <Menu id="actions-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  dispatch(
                    removeAttachmentFile({
                      item,
                    })
                  )
                    .unwrap()
                    .then((payload) => {
                      handleMenuClose();
                      props.removeAttachment();
                    });
                }}
              >
                Remove Attachment
              </MenuItem>
            </Menu>
          </div>
        </div>
      );
    }
    case 'link': {
      return (
        <div className="flex w-full sm:w-1/2 mb-16 px-16" key={props.item.id}>
          <Paper className="min-w-128 w-128 h-128 flex items-center justify-center rounded-4 overflow-hidden shadow">
            <Typography className="font-semibold">LINK</Typography>
          </Paper>
          <div className="flex flex-auto flex-col justify-center items-start min-w-0 px-16">
            <Typography className="text-16 font-semibold truncate w-full">{props.item.url}</Typography>
            <Typography className="truncate w-full mb-12" color="textSecondary">
              {props.item.time}
            </Typography>
            <Button
              aria-owns={anchorEl ? 'actions-menu' : null}
              aria-haspopup="true"
              onClick={handleMenuOpen}
              variant="outlined"
              size="small"
            >
              Actions
              <Icon className="text-20">arrow_drop_down</Icon>
            </Button>
            <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  dispatch(
                    removeAttachmentFile({
                      item,
                    })
                  )
                    .unwrap()
                    .then((payload) => {
                      handleMenuClose();
                      props.removeAttachment(props.item);
                    });
                }}
              >
                Remove Attachment
              </MenuItem>
            </Menu>
          </div>
        </div>
      );
    }
    default: {
      return null;
    }
  }
}

export default CardAttachment;
