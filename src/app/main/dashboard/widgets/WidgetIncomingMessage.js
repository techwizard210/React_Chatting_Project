// import Icon from '@mui/material/Icon';
// import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

function Widget4(props) {
  return (
    <Paper className="w-full rounded-20 shadow flex flex-col justify-between">
      <div className="flex items-center justify-between px-4 pt-8">
        <Typography className="text-16 px-16 font-medium" color="textSecondary">
          {props.data.title}
        </Typography>
        {/* <IconButton aria-label="more" size="large">
          <Icon>more_vert</Icon>
        </IconButton> */}
      </div>
      <div className="text-center py-12">
        <Typography className="text-72 font-semibold leading-none text-green tracking-tighter">
          {props.data.data.count}
        </Typography>
        <Typography className="text-18 font-normal text-green-800">{props.data.data.name}</Typography>
      </div>
      {/* <Typography className="p-20 pt-0 h-56 flex justify-center items-end text-13 font-medium" color="textSecondary">
        <span className="truncate">{props.data.data.extra.name}</span>:
        <b className="px-8">{props.data.data.extra.count}</b>
      </Typography> */}
    </Paper>
  );
}

export default memo(Widget4);
