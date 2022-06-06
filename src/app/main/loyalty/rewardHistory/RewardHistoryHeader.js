import Icon from '@mui/material/Icon';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setRewardHistorySearchText } from '../store/rewardHistorySlice';

function RewardHistoryHeader(props) {
  const dispatch = useDispatch();
  const mainTheme = useSelector(selectMainTheme);
  const searchText = useSelector(({ loyaltyApp }) => loyaltyApp.pointHistory.searchText);

  return (
    <div className="flex flex-1 items-center justify-between p-4 sm:p-24">
      <div className="flex flex-shrink items-center sm:w-224">
        <div className="flex items-center">
          <Icon
            component={motion.span}
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.2 } }}
            className="text-24 md:text-32"
          >
            assignment
          </Icon>
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className="hidden sm:flex text-16 md:text-20 mx-12 font-semibold"
          >
            Reward History
          </Typography>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-8 sm:px-12">
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={mainTheme}>
            <Paper
              component={motion.div}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              className="flex p-4 items-center w-full max-w-512 h-48 px-16 py-4 shadow"
            >
              <Icon color="action">search</Icon>

              <Input
                placeholder="Search for Point History"
                className="flex flex-1 px-16"
                disableUnderline
                fullWidth
                value={searchText}
                inputProps={{
                  'aria-label': 'Search',
                }}
                onChange={(ev) => dispatch(setRewardHistorySearchText(ev))}
              />
            </Paper>
          </ThemeProvider>
        </StyledEngineProvider>
      </div>
    </div>
  );
}

export default RewardHistoryHeader;
