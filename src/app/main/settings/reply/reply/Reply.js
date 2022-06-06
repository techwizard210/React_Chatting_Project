import FusePageCarded from "@fuse/core/FusePageCarded";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import withReducer from "app/store/withReducer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { getReply, addNewReply } from "../store/replySlice";
import { setNewResponse } from "../store/responseSlice";
import reducer from "../store";
import ReplyHeader from "./ReplyHeader";
import ReplyInformation from "./tabs/ReplyInformation";
import ReplyKeyword from "./tabs/ReplyKeyword";
import ReplyResponse from "./tabs/ReplyResponse";

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

function Reply(props) {
  const dispatch = useDispatch();
  const reply = useSelector(({ replyApp }) => replyApp.reply.data);

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noReply, setNoReply] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { replyId } = routeParams;

    if (replyId === "new") {
      /**
       * Create New Product data
       */
      dispatch(addNewReply());
      dispatch(setNewResponse());
    } else if (routeParams && routeParams.replyId) {
      /**
       * Get Product data
       */
      if (routeParams && routeParams.replyId) {
        dispatch(getReply(routeParams.replyId)).then((action) => {
          if (!action.payload) {
            setNoReply(true);
          }
        });
      }
    }
  }, [dispatch, routeParams]);

  /**
   * Tab Change
   */
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  /**
   * Show Message if the requested products is not exists
   */
  if (noReply) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such reply!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/settings/reply"
          color="inherit"
        >
          Go to Reply Page
        </Button>
      </motion.div>
    );
  }

  return (
    <Root
      header={<ReplyHeader />}
      content={
        <>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: "w-full h-64" }}
          >
            <Tab className="h-64" label="Information" />
            <Tab
              className="h-64"
              label="Keyword"
              disabled={
                reply &&
                (reply.type === "quick" ||
                  (reply.type === "auto" && reply.event === "welcome"))
              }
            />
            <Tab className="h-64" label="Response" />
          </Tabs>
          <div className="p-16 sm:p-24">
            <div className={tabValue !== 0 ? "hidden" : ""}>
              <ReplyInformation />
            </div>

            <div className={tabValue !== 1 ? "hidden" : ""}>
              <ReplyKeyword />
            </div>

            <div className={tabValue !== 2 ? "hidden" : ""}>
              <ReplyResponse />
            </div>
          </div>
        </>
      }
      // innerScroll
    />
  );
}

export default withReducer("replyApp", reducer)(Reply);
