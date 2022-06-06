import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Toolbar from "@mui/material/Toolbar";
import Hidden from "@mui/material/Hidden";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import format from "date-fns/format";

import makeStyles from "@mui/styles/makeStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { useEffect, useState } from "react";
import firebaseService from "app/services/firebaseService";

import { Controller, useForm } from "react-hook-form";

import _ from "@lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function ProfileContent() {
  const classes = useStyles();
  const profile = useSelector(({ profilePage }) => profilePage.profile.data);
  const organizations = useSelector(
    ({ profilePage }) => profilePage.profile.organizations
  );

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [emailUser, setEmailUser] = useState(null);
  const [facebookUser, setFacebookUser] = useState(null);

  const schema = yup.object().shape({
    email: yup.string().required("You must enter a Email"),
    password: yup.string().required("You must enter a Password"),
  });

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: "onChange",
      resolver: yupResolver(schema),
    }
  );
  const { isValid, dirtyFields, errors } = formState;

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const { currentUser } = firebaseService.auth;
    if (currentUser) setFirebaseUser(currentUser);
    if (currentUser.providerData) {
      currentUser.providerData.forEach((element) => {
        if (element.providerId === "facebook.com") {
          console.log("[Facebook User] ", element);
          setFacebookUser(element);
        } else if (element.providerId === "password") {
          console.log("[Email User] ", element);
          setEmailUser(element);
        }
      });
    }
  }, []);

  function linkFacebook() {
    const { currentUser } = firebaseService.auth;
    console.log("[ProfileContent] linkFacebook ", currentUser);
    const provider = firebaseService.Providers.facebook;
    currentUser
      .linkWithPopup(provider)
      .then((result) => {
        // Accounts successfully linked.
        const { credential } = result;
        const { user } = result;
        console.log("[linkWithPopup] user ", user);
        setFacebookUser(
          user.providerData.find(
            (element) => element.providerId === "facebook.com"
          )
        );
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // ...
        console.log("[linkWithPopup] error ", error);
      });
  }
  function unlinkFacebook() {
    const { currentUser } = firebaseService.auth;
    console.log("[ProfileContent] unlinkFacebook ", currentUser);
    // const provider = firebaseService.Providers.facebook;
    currentUser
      .unlink(facebookUser.providerId)
      .then((result) => {
        console.log("[unlink] facebook user");
        setFacebookUser(null);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // ...
        console.log("[unlinkFAcebook] error ", error);
      });
  }
  function linkEmail(data) {
    const { currentUser } = firebaseService.auth;
    currentUser.reauthenticateWithPopup(firebaseService.Providers.facebook);
    const credential = firebaseService.Providers.email.credential(
      data.email,
      data.password
    );
    currentUser
      .linkWithCredential(credential)
      .then((usercred) => {
        const result = usercred.user;
        console.log("Account linking success", result);
        setEmailUser(
          result.providerData.find(
            (element) => element.providerId === "password"
          )
        );
        setEmailDialogOpen(false);
      })
      .catch((error) => {
        console.log("Account linking error", error);
      });
  }
  function unlinkEmail() {
    const { currentUser } = firebaseService.auth;
    console.log("[ProfileContent] unlink Email ", currentUser);
    currentUser
      .unlink(emailUser.providerId)
      .then((result) => {
        console.log("[unlink] Email user");
        setEmailUser(null);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        // ...
      });
  }

  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const EmailDialog = () => {
    return (
      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="sm"
      >
        <AppBar position="static" elevation={0}>
          <Toolbar className="flex w-full">
            <Typography variant="subtitle1" color="inherit">
              Email and Password
            </Typography>
          </Toolbar>
        </AppBar>
        <form
          noValidate
          onSubmit={handleSubmit(linkEmail)}
          className="flex flex-col md:overflow-hidden"
        >
          <DialogContent classes={{ root: "p-24" }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  label="Email"
                  autoFocus
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </DialogContent>
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Link
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

  return (
    <motion.div initial="hidden" animate="show">
      <div className="md:flex mx-32">
        <div className="flex flex-col flex-1">
          <Card
            component={motion.div}
            variants={item}
            className="w-full mb-32 rounded-16 shadow md:mt-0 mt-48"
          >
            <AppBar position="static" elevation={0}>
              <Toolbar className="px-8">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex-1 px-12 font-medium"
                >
                  General Information
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent>
              {profile ? (
                <div className="grid grid-flow-row-dense md:grid-cols-4 grid-cols-1">
                  {profile.email ? (
                    <div className="mb-24">
                      <Typography className="font-semibold mb-4 text-15">
                        Email
                      </Typography>
                      <Typography>{profile.email}</Typography>
                    </div>
                  ) : (
                    <></>
                  )}

                  {profile.gender ? (
                    <div className="mb-24">
                      <Typography className="font-semibold mb-4 text-15">
                        Gender
                      </Typography>
                      <Typography>
                        {profile.gender.slice(0, 1).toUpperCase() +
                          profile.gender.slice(1, profile.gender.length)}
                      </Typography>
                    </div>
                  ) : (
                    <></>
                  )}

                  {profile.mobile ? (
                    <div className="mb-24">
                      <Typography className="font-semibold mb-4 text-15">
                        Mobile
                      </Typography>
                      <Typography>{profile.mobile}</Typography>
                    </div>
                  ) : (
                    <></>
                  )}

                  {profile.address ? (
                    <div className="mb-24">
                      <Typography className="font-semibold mb-4 text-15">
                        Address
                      </Typography>
                      <Typography>{profile.address}</Typography>
                    </div>
                  ) : (
                    <></>
                  )}

                  {profile.role ? (
                    <div className="mb-24">
                      <Typography className="font-semibold mb-4 text-15">
                        Role
                      </Typography>
                      <Typography>{profile.role.role}</Typography>
                    </div>
                  ) : (
                    <></>
                  )}

                  {profile.team ? (
                    <div className="mb-24">
                      <Typography className="font-semibold mb-4 text-15">
                        Team
                      </Typography>
                      <Typography>{profile.team.name}</Typography>
                    </div>
                  ) : (
                    <></>
                  )}

                  {profile.createdAt ? (
                    <div className="mb-24">
                      <Typography className="font-semibold mb-4 text-15">
                        Created Date
                      </Typography>
                      <Typography>
                        {format(new Date(profile.createdAt), "PP")}
                      </Typography>
                    </div>
                  ) : (
                    <></>
                  )}
                  {profile.updatedAt ? (
                    <div className="mb-24">
                      <Typography className="font-semibold mb-4 text-15">
                        Updated Date
                      </Typography>
                      <Typography>
                        {format(new Date(profile.updatedAt), "PP")}
                      </Typography>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center h-full p-24">
                  <Typography color="textSecondary" variant="h5">
                    There are no information!
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            component={motion.div}
            variants={item}
            className="w-full mb-32 rounded-16 shadow"
          >
            <AppBar position="static" elevation={0}>
              <Toolbar className="px-8">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex-1 px-12 font-medium"
                >
                  Organization
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent>
              {organizations && organizations.length > 0 ? (
                <>
                  <TableContainer component={Paper}>
                    <Table
                      className={classes.table}
                      aria-label="organization table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Organization Name</TableCell>
                          <TableCell>Description</TableCell>
                          {/* <TableCell>Created Date</TableCell>
                          <TableCell>Updated Date</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {organizations.map((row) => (
                          <TableRow key={row.organization.name}>
                            <TableCell component="th" scope="row">
                              {row.organization.name}
                            </TableCell>
                            <TableCell>
                              {row.organization.description}
                            </TableCell>
                            {/* <TableCell>{format(new Date(row.createdAt), 'PP')}</TableCell>
                            <TableCell>{format(new Date(row.updatedAt), 'PP')}</TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center h-full p-24">
                  <Typography color="textSecondary" variant="h5">
                    There are no organization!
                  </Typography>
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            component={motion.div}
            variants={item}
            className="w-full mb-32 rounded-16 shadow"
          >
            <AppBar position="static" elevation={0}>
              <Toolbar className="px-8">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex-1 px-12 font-medium"
                >
                  Link User Account
                </Typography>
              </Toolbar>
            </AppBar>

            <CardContent>
              <div className="flex md:flex-row flex-col p-8 w-full">
                <div className="md:px-16 py-16 w-full">
                  {emailUser !== null ? (
                    <>
                      <div className="flex md:flex-row flex-col justify-between w-full">
                        <div className="flex flex-row space-x-12 md:p-24 p-4 items-center">
                          <Hidden mdDown>
                            <Avatar
                              // src={facebookUser.photoURL}
                              // alt={customer.name}
                              alt={emailUser.displayName}
                              className="w-64 h-64"
                            />
                          </Hidden>
                          <div className="flex flex-col space-y-6">
                            <Typography variant="h6">{`${emailUser.email}`}</Typography>
                            <Typography variant="subtitle2">
                              {emailUser.email}
                            </Typography>
                            {/* <Typography variant="subtitle2">{customer.channelName}</Typography> */}
                            {/* <Typography variant="caption">UUID: {customer.uid}</Typography> */}
                          </div>
                        </div>

                        <div className="flex flex-row space-x-12 md:p-24 p-4 items-center">
                          <Button
                            variant="outlined"
                            color="primary"
                            disabled={!facebookUser}
                            // onClick={handleConfirmOpen('email')}

                            onClick={unlinkEmail}
                          >
                            Unlink
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center h-full">
                      <Button
                        variant="contained"
                        color="primary"
                        className="w-full md:px-16 py-16"
                        onClick={() => setEmailDialogOpen(true)}
                      >
                        Link Email
                      </Button>
                    </div>
                  )}
                </div>

                <div className="px-16 w-full">
                  {facebookUser !== null ? (
                    <>
                      <div className="flex flex-row justify-between w-full">
                        <div className="flex flex-row space-x-12 p-24 items-center">
                          <Hidden mdDown>
                            <Avatar
                              src={facebookUser.photoURL}
                              // alt={customer.name}
                              alt={facebookUser.displayName}
                              className="w-64 h-64"
                            />
                          </Hidden>
                          <div className="flex flex-col space-y-6">
                            <Typography variant="h6">{`${facebookUser.displayName}`}</Typography>
                            <Typography variant="subtitle2">
                              {facebookUser.email}
                            </Typography>
                            {/* <Typography variant="subtitle2">{customer.channelName}</Typography> */}
                            {/* <Typography variant="caption">UUID: {customer.uid}</Typography> */}
                          </div>
                        </div>

                        <div className="flex flex-row space-x-12 p-24 items-center">
                          <Button
                            variant="outlined"
                            color="primary"
                            disabled={!emailUser}
                            // onClick={handleConfirmOpen('facebook')}

                            onClick={unlinkFacebook}
                          >
                            Unlink
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center h-full">
                      <Button
                        variant="contained"
                        color="primary"
                        className="w-full md:mx-16 my-16"
                        onClick={linkFacebook}
                      >
                        Link Facebook
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <EmailDialog />
    </motion.div>
  );
}

export default ProfileContent;
