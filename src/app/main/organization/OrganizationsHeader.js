import Hidden from '@mui/material/Hidden';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';

// import { logoutUser } from 'app/auth/store/userSlice';
import {
  setOrganizationsSearchText,
  openNewOrganizationDialog,
} from './store/organizationsSlice';

function OrganizationsHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(
    ({ organizationsApp }) => organizationsApp.organizations.searchText
  );
  const mainTheme = useSelector(selectMainTheme);

  function handleNewClick(ev) {
    dispatch(openNewOrganizationDialog());
  }

  return (
    <div className="flex flex-1 items-center justify-between p-4 sm:p-24">
      <div className="flex flex-shrink items-center sm:w-224">
        <Hidden lgUp>
          <IconButton
            onClick={(ev) => {
              props.pageLayout.current.toggleLeftSidebar();
            }}
            aria-label="open left sidebar"
            size="large"
          >
            <Icon>menu</Icon>
          </IconButton>
        </Hidden>

        <div className="flex items-center">
          <Icon
            component={motion.span}
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.2 } }}
            className="text-24 md:text-32"
          >
            contacts
          </Icon>
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
          >
            Organizations
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
                placeholder="Search for Organization"
                className="flex flex-1 px-16"
                disableUnderline
                fullWidth
                value={searchText}
                inputProps={{
                  'aria-label': 'Search',
                }}
                onChange={(ev) => dispatch(setOrganizationsSearchText(ev))}
              />
            </Paper>
          </ThemeProvider>
        </StyledEngineProvider>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
      >
        <Button
          className="whitespace-nowrap"
          variant="contained"
          color="secondary"
          onClick={handleNewClick}
        >
          <span className="hidden sm:flex">Add New Organization</span>
          <span className="flex sm:hidden">New</span>
        </Button>

        {/* <Button
          className="whitespace-nowrap ml-12"
          variant="contained"
          color="secondary"
          onClick={() => {
            dispatch(logoutUser());
          }}
        >
          <span className="hidden sm:flex">Logout</span>
          <span className="flex sm:hidden">Logout</span>
        </Button> */}
      </motion.div>
    </div>
  );
}

export default OrganizationsHeader;
