import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import { motion } from "framer-motion";
import format from "date-fns/format";

import history from "@history";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import { OrganizationContext } from "app/FoxOrganization/OrganizationProvider";
import { setOrganization } from "app/auth/store/organizationSlice";
import { updateUserRoleFoxConnect } from "app/auth/store/userSlice";
import { openEditOrganizationDialog } from "./store/organizationsSlice";

function OrganizationListItem(props) {
  const dispatch = useDispatch();
  const organizationContext = useContext(OrganizationContext);

  const { state } = useLocation();
  const redirectUrl =
    state && state.redirectUrl && state.redirectUrl !== "/organization"
      ? state.redirectUrl
      : "/";

  function onSelect() {
    if (props.organization) {
      organizationContext.setCurrentOrganization(props.organization);
      dispatch(updateUserRoleFoxConnect(props.organization));
      dispatch(setOrganization(props.organization));
      if (redirectUrl)
        history.push({
          pathname: redirectUrl,
        });
    }
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
    >
      <Card className={clsx("cursor-pointer", props.className)}>
        <CardHeader
          action={
            <IconButton
              aria-label="settings"
              onClick={() => {
                dispatch(openEditOrganizationDialog(props.organization));
              }}
              size="large"
            >
              <Icon>settings</Icon>
            </IconButton>
          }
          title={props.organization.organization.name}
          subheader={format(new Date(props.organization.createdAt), "PP")}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.organization.organization.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            size="small"
            color="primary"
            className="w-full h-48 text-xl"
            onClick={onSelect}
          >
            Select
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
}

export default OrganizationListItem;
