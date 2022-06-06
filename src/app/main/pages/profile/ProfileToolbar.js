import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";

import { submitForgotWithFireBase } from "app/auth/store/forgotSlice";
import { openEditProfileDialog } from "./store/profileSlice";
import { Box } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  avatar: {
    border: `4px solid ${theme.palette.background.default}`,
  },
}));

function ProfileToolbar(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const profile = useSelector(({ profilePage }) => profilePage.profile.data);

  return (
    <>
      <div className="flex flex-col flex-0 lg:flex-row items-center w-full mx-auto px-32 lg:h-72 mt-80">
        {/* <div className="w-full">
        <Box
          className="relative overflow-hidden flex shrink-0 items-center justify-center px-16 py-32 md:p-64"
          sx={{
            backgroundColor: "primary.main",
            color: (theme) =>
              theme.palette.getContrastText(theme.palette.primary.main),
          }}
        >
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 960 540"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              className="text-gray-700 opacity-25"
              fill="none"
              stroke="currentColor"
              strokeWidth="100"
            >
              <circle r="234" cx="196" cy="23" />
              <circle r="234" cx="790" cy="491" />
            </g>
          </svg>
        </Box>
      </div> */}
        <div className="rounded-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.1 } }}
          >
            {profile.picture ? (
              <Avatar
                className={clsx(classes.avatar, "-mt-64  w-128 h-128")}
                alt={profile.display}
                src={profile.picture}
              />
            ) : (
              <Avatar className={clsx(classes.avatar, "-mt-64  w-128 h-128")} />
            )}
          </motion.div>
        </div>
        <div className="flex flex-col md:flex-row flex-1 items-center justify-between p-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            <Typography
              className="md:px-16 text-24 md:text-32 font-semibold tracking-tight"
              variant="h4"
              color="inherit"
            >
              {profile ? (
                <>
                  {profile.firstname} {profile.lastname}
                </>
              ) : (
                <></>
              )}
            </Typography>
          </motion.div>

          <div className="flex items-center justify-end -mx-4 mt-24 md:mt-0">
            <Button
              className="mx-8"
              variant="contained"
              color="secondary"
              aria-label="Edit Profile"
              onClick={() => {
                dispatch(openEditProfileDialog());
              }}
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              color="primary"
              aria-label="Reset Password"
              onClick={() => {
                dispatch(submitForgotWithFireBase({ email: profile.email }));
              }}
            >
              Send email reset password
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileToolbar;
