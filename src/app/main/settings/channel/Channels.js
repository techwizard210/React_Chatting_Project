import FusePageCarded from "@fuse/core/FusePageCarded";
import makeStyles from "@mui/styles/makeStyles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import withReducer from "app/store/withReducer";
import reducer from "./store";
import { getChannels } from "./store/channelsSlice";
import ChannelHeader from "./ChannelsHeader";
import FacebookContent from "./FacebookContent";
import LineContent from "./LineContent";
import LineChannelDialog from "./LineChannelDialog";
import FacebookChannelDialog from "./FacebookChannelDialog";

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

function Channels() {
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
    if (organization) dispatch(getChannels());
  }, [dispatch, organization]);

  return (
    <>
      <Root
        header={<ChannelHeader selectedTab={selectedTab} />}
        content={
          <>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons={false}
              className="w-full h-64"
            >
              <Tab className="h-64" label="LINE" />
              <Tab className="h-64" label="Facebook" />
            </Tabs>
            <div className="p-24">
              {selectedTab === 0 && (
                <div>
                  <LineContent />
                </div>
              )}
              {selectedTab === 1 && (
                <div>
                  <FacebookContent />
                </div>
              )}
            </div>
          </>
        }
      />
      <LineChannelDialog />
      <FacebookChannelDialog />
    </>
  );
}

export default withReducer("channels", reducer)(Channels);
