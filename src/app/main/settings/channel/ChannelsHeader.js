import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectMainTheme } from 'app/store/fuse/settingsSlice';

// import { openNewLineChannelDialog, openNewFacebookChannelDialog } from './store/channelsSlice';
import ChannelMenu from './ChannelMenu';

function ChannelsHeader(props) {
  // const dispatch = useDispatch();
  // const mainTheme = useSelector(selectMainTheme);

  // function handleNewClick(ev) {
  //   if (props.selectedTab === 0) {
  //     dispatch(openNewLineChannelDialog());
  //   } else if (props.selectedTab === 1) {
  //     dispatch(openNewFacebookChannelDialog());
  //   }
  // }

  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex items-center">
        {/* <Icon
          component={motion.span}
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { delay: 0.2 } }}
          className="text-24 md:text-32"
        >
          shopping_basket
        </Icon> */}
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
        >
          Channels
        </Typography>
      </div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
        {/* <Button
          // component={Link}
          // to="/settings/channel/new"
          className="whitespace-nowrap"
          variant="contained"
          color="secondary"
          onClick={handleNewClick}
        >
          <span className="hidden sm:flex">Add New Channel</span>
          <span className="flex sm:hidden">New</span>
        </Button> */}
        <ChannelMenu />
      </motion.div>
    </div>
  );
}

export default ChannelsHeader;
