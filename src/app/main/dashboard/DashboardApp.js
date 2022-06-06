// import Typography from '@mui/material/Typography';
import withReducer from "app/store/withReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "@lodash";
import { motion } from "framer-motion";
import reducer from "./store";
import { selectWidgetsEntities, getSummary } from "./store/widgetsSlice";
import WidgetNow from "./widgets/WidgetNow";
import WidgetOpenChat from "./widgets/WidgetOpenChat";
import WidgetAllChat from "./widgets/WidgetAllChat";
import WidgetAllMessage from "./widgets/WidgetAllMessage";
import WidgetAllUser from "./widgets/WidgetAllUser";
import WidgetIncomingMessage from "./widgets/WidgetIncomingMessage";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import { Icon, Typography } from "@mui/material";
const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    minHeight: 72,
    height: 72,
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      minHeight: 136,
      height: 136,
    },
  },
}));
function AnalyticsDashboardApp() {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgetsEntities);

  const organization = useSelector(
    ({ auth }) => auth.organization.organization
  );

  useEffect(() => {
    if (organization) dispatch(getSummary());
  }, [dispatch, organization]);

  if (_.isEmpty(widgets)) {
    return null;
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Root
      header={
        <div className="flex flex-1 items-center justify-between p-4 sm:p-24">
          <div className="flex flex-shrink items-center sm:w-224">
            <div className="flex items-center">
              <Icon
                component={motion.span}
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.2 } }}
                className="text-24 md:text-32"
              >
                dashboard
              </Icon>
              <Typography
                component={motion.span}
                initial={{ x: -20 }}
                animate={{ x: 0, transition: { delay: 0.2 } }}
                delay={300}
                className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
              >
                Dashboard
              </Typography>
            </div>
          </div>
        </div>
      }
      content={
        <div className="w-full">
          {/* <Widget1 data={widgets.widget1} /> */}
          <motion.div
            className="flex flex-col md:flex-row sm:p-8 container"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <div className="flex flex-col w-full">
              <div className="flex flex-1 flex-col min-w-0">
                {/* <Typography
            component={motion.div}
            variants={item}
            className="px-16 pb-8 text-18 font-medium"
            color="textSecondary"
          >
            How are your active users trending over time?
          </Typography> */}
                <div className="flex flex-col sm:flex sm:flex-row pb-32">
                  <motion.div
                    variants={item}
                    className="widget flex w-full sm:w-1/2 p-16"
                  >
                    <WidgetAllMessage data={widgets.allMessage} />
                  </motion.div>

                  <motion.div
                    variants={item}
                    className="widget w-full sm:w-1/2 p-16"
                  >
                    <WidgetIncomingMessage data={widgets.messageToday} />
                  </motion.div>
                </div>
              </div>

              <div className="flex flex-1 flex-col min-w-0">
                {/* <Typography
            component={motion.div}
            variants={item}
            className="px-16 pb-8 text-18 font-medium"
            color="textSecondary"
          >
            How are your active users trending over time?
          </Typography> */}

                <div className="flex flex-col sm:flex sm:flex-row pb-32">
                  <motion.div
                    variants={item}
                    className="widget flex w-full sm:w-1/3 p-16"
                  >
                    <WidgetAllChat data={widgets.allChat} />
                  </motion.div>

                  <motion.div
                    variants={item}
                    className="widget flex w-full sm:w-1/3 p-16"
                  >
                    <WidgetOpenChat data={widgets.openChat} />
                  </motion.div>

                  <motion.div
                    variants={item}
                    className="widget flex w-full sm:w-1/3 p-16"
                  >
                    <WidgetAllUser data={widgets.allUser} />
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap w-full md:w-320">
              <div className="mb-32 w-full sm:w-1/2 md:w-full">
                {/* <Typography
              component={motion.div}
              variants={item}
              className="px-16 pb-8 text-18 font-medium"
              color="textSecondary"
            >
              What are your top devices?
            </Typography>

            <motion.div variants={item} className="widget w-full p-16">
              <Widget7 data={widgets.widget7} />
            </motion.div> */}
                <motion.div variants={item} className="widget flex w-full p-12">
                  <WidgetNow />
                </motion.div>
              </div>

              {/* <div className="mb-32 w-full sm:w-1/2 md:w-full">
            <Typography
              component={motion.div}
              variants={item}
              className="px-16 pb-8 text-18 font-medium"
              color="textSecondary"
            >
              How are your sales?
            </Typography>

            <motion.div variants={item} className="widget w-full p-16">
              <Widget8 data={widgets.widget8} />
            </motion.div>
          </div>

          <div className="mb-32 w-full sm:w-1/2 md:w-full">
            <Typography
              component={motion.div}
              variants={item}
              className="px-16 pb-8 text-18 font-medium lg:pt-0"
              color="textSecondary"
            >
              What are your top campaigns?
            </Typography>
            <motion.div variants={item} className="widget w-full p-16">
              <Widget9 data={widgets.widget9} />
            </motion.div>
          </div> */}
            </div>
          </motion.div>
        </div>
      }
    />
  );
}

export default withReducer("DashboardApp", reducer)(AnalyticsDashboardApp);
