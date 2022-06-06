import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseLoading from "@fuse/core/FuseLoading";
import makeStyles from "@mui/styles/makeStyles";
import { useEffect, useState } from "react";

import withReducer from "app/store/withReducer";
import { useDispatch, useSelector } from "react-redux";
import reducer from "./store";

import { motion } from "framer-motion";
import { getOrganizations, getProfile } from "./store/profileSlice";
import ProfileToolbar from "./ProfileToolbar";
import ProfileContent from "./ProfileContent";
import ProfileDialog from "./ProfileDialog";
import { styled } from "@mui/material/styles";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
}));

const useStyles = makeStyles((theme) => ({
  topBg: {
    background: 'url("assets/images/profile/morain-lake.jpg")!important',
    backgroundSize: "cover!important",
    backgroundPosition: "center center!important",
  },
  layoutHeader: {
    background: "none",
    height: 320,
    minHeight: 320,
    [theme.breakpoints.down("lg")]: {
      height: 240,
      minHeight: 240,
    },
  },
}));

function ProfilePage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const organization = useSelector(
    ({ auth }) => auth.organization.organization
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organization)
      dispatch(getProfile()).then(() => {
        setLoading(false);
      });
    dispatch(getOrganizations());
  }, [dispatch, organization]);

  // const profile = useSelector(({ profilePage }) => profilePage.profile.data);

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <>
      <Root
        header={<ProfileToolbar />}
        content={
          <div className="flex flex justify-center w-full mx-auto p-24 sm:p-32">
            <div style={{ width: "100%" }}>
              <ProfileContent />
            </div>
          </div>
        }
      />
      <ProfileDialog />
    </>
  );
}

export default withReducer("profilePage", reducer)(ProfilePage);
