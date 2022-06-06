import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormHelperText from "@mui/material/FormHelperText";
import jwtService from "app/auth/services/jwtService";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { registerWithFirebase } from "app/auth/store/registerSlice";
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  firstname: yup.string().required("You must enter your firstname"),
  lastname: yup.string().required("You must enter your lastname"),
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  acceptTermsConditions: yup
    .boolean()
    .oneOf([true], "The terms and conditions must be accepted."),
  acceptPrivacyPolicy: yup
    .boolean()
    .oneOf([true], "The privacy policy must be accepted."),
});

const defaultValues = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  displayName: "",
  passwordConfirm: "",
  inviteCode: "",
  acceptTermsConditions: false,
  acceptPrivacyPolicy: false,
};

function SignUpPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authRegister = useSelector(({ auth }) => auth.register);

  const [openTermsConditions, setOpenTermsConditions] = useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [code, setCode] = useState(null);

  const { control, formState, handleSubmit, reset, setError } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    authRegister.errors.forEach((error) => {
      setError(error.type, {
        type: "manual",
        message: error.message,
      });
    });
  }, [authRegister.errors, setError]);

  useEffect(() => {
    // const { search } = props.location; // could be '?foo=bar'
    const params = new URLSearchParams("");
    const inviteCode = params.get("code"); // bar

    setCode(inviteCode);
    if (inviteCode) {
      reset({
        inviteCode,
      });
    }
  }, []);

  const handleClickOpenPrivacyPolicy = () => {
    setOpenPrivacyPolicy(true);
    setOpenTermsConditions(false);
  };
  const handleClickOpenTermsConditions = () => {
    setOpenTermsConditions(true);
    setOpenPrivacyPolicy(false);
  };

  const handleClose = () => {
    setOpenPrivacyPolicy(false);
    setOpenTermsConditions(false);
  };

  function onSubmit(model) {
    dispatch(registerWithFirebase(model, navigate));
    reset(defaultValues);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img className="w-48" src="assets/images/logo/logo.svg" alt="logo" />

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Sign up
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Already have an account?</Typography>
            <Link className="ml-4" to="/sign-in">
              Sign in
            </Link>
          </div>

          <form
            name="registerForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="firstname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  label="Firstname"
                  autoFocus
                  type="firstname"
                  error={!!errors.firstname}
                  helperText={errors?.firstname?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="lastname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  label="Lastname"
                  error={!!errors.lastname}
                  helperText={errors?.lastname?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="displayName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Display name"
                  type="name"
                  error={!!errors.displayName}
                  helperText={errors?.displayName?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
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
                  className="mb-24"
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

            <Controller
              name="passwordConfirm"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Password (Confirm)"
                  type="password"
                  error={!!errors.passwordConfirm}
                  helperText={errors?.passwordConfirm?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="inviteCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-16"
                  label="Invite Code"
                  variant="outlined"
                  disabled={code !== null}
                  fullWidth
                />
              )}
            />

            <div className="flex flex-col justify-start w-full">
              <Controller
                name="acceptTermsConditions"
                control={control}
                render={({ field }) => (
                  <FormControl
                    className="items-center"
                    error={!!errors.acceptTermsConditions}
                  >
                    <div className="flex flex-row w-full justify-items-start  items-center">
                      <Checkbox {...field} />
                      <Typography variant="caption" className="mr-8">
                        I read and accept
                      </Typography>

                      <a
                        href="/register"
                        onClick={(e) => {
                          e.preventDefault();
                          handleClickOpenTermsConditions();
                        }}
                      >
                        terms and conditions
                      </a>
                    </div>

                    <FormHelperText>
                      {errors?.acceptTermsConditions?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <Controller
                name="acceptPrivacyPolicy"
                control={control}
                render={({ field }) => (
                  <FormControl
                    className="items-center"
                    error={!!errors.acceptPrivacyPolicy}
                  >
                    <div className="flex flex-row w-full justify-items-start items-center">
                      <Checkbox {...field} />
                      <Typography variant="caption" className="mr-8">
                        I read and accept
                      </Typography>

                      <a
                        href="/register"
                        onClick={(e) => {
                          e.preventDefault();
                          handleClickOpenPrivacyPolicy();
                        }}
                      >
                        privacy policy
                      </a>
                    </div>

                    <FormHelperText>
                      {errors?.acceptPrivacyPolicy?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </div>

            <Button
              variant="contained"
              color="secondary"
              className="w-full mt-24"
              aria-label="Register"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Create an account
            </Button>
          </form>
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: "primary.main" }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: "primary.light" }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: "primary.light" }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width="220"
            height="192"
            fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          />
        </Box>

        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-8xl font-bold leading-none text-gray-100">
            <div>Welcome</div>
            <div>to the FoxConnect</div>
          </div>

          <div className="flex items-center mt-32">
            <AvatarGroup
              sx={{
                "& .MuiAvatar-root": {
                  borderColor: "primary.main",
                },
              }}
            >
              <Avatar src="assets/images/avatars/female-18.jpg" />
              <Avatar src="assets/images/avatars/female-11.jpg" />
              <Avatar src="assets/images/avatars/male-09.jpg" />
              <Avatar src="assets/images/avatars/male-16.jpg" />
            </AvatarGroup>

            <div className="ml-16 font-medium tracking-tight text-gray-400">
              More than 17k people joined us, it's your turn
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignUpPage;
