import FusePageCarded from "@fuse/core/FusePageCarded";
import makeStyles from "@mui/styles/makeStyles";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import withReducer from "app/store/withReducer";

import reducer from "./store";
import { getChannels, getOrganization } from "./store/generalSlice";
import GeneralPageHeader from "./GeneralPageHeader";
import GeneralPageContent from "./GeneralPageContent";
// import LineContent from './LineContent';
// import LineChannelDialog from './LineChannelDialog';
// import FacebookChannelDialog from './FacebookChannelDialog';

const useStyles = makeStyles({
  layoutRoot: {},
});

import { styled } from "@mui/material/styles";
const Root = styled(FusePageCarded)(({ theme }) => ({
  "& .FusePageCarded-header": {
    minHeight: 72,
    height: 72,
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      minHeight: 136,
      height: 136,
    },
  },
}));

function GeneralPage() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const organization = useSelector(
    ({ auth }) => auth.organization.organization
  );

  const handleTabChange = (event, value) => {
    setSelectedTab(value);
  };
  useEffect(() => {
    if (organization) {
      dispatch(getChannels());
      dispatch(getOrganization());
    }
  }, [dispatch, organization]);

  return (
    <>
      <Root
        header={<GeneralPageHeader />}
        content={
          <div className="p-8">
            <GeneralPageContent />
          </div>
        }
      />
      {/* <LineChannelDialog />
      <FacebookChannelDialog /> */}
    </>
  );
}

// export default GeneralPage;
export default withReducer("general", reducer)(GeneralPage);
