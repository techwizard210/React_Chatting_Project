import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import PersonIcon from '@mui/icons-material/Person';

import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// import Select from 'react-select';

import _ from '@lodash';
import * as yup from 'yup';

import { removeTeam, addTeam, updateTeam, closeNewTeamDialog, closeEditTeamDialog } from './store/teamsSlice';

const defaultValues = {
  id: null,
  name: '',
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter a Team name'),
});

function TeamDialog(props) {
  const dispatch = useDispatch();
  const teamDialog = useSelector(({ teamsApp }) => teamsApp.teams.teamDialog);

  const [members, setMembers] = useState(null);

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const id = watch('id');
  const name = watch('name');
  const avatar = watch('avatar');

  /**
   * Initialize Dialog with Data
   */
  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (teamDialog.type === 'edit' && teamDialog.data) {
      reset({ ...teamDialog.data });
      setMembers(teamDialog.data.organizationUser);
    }

    /**
     * Dialog type: 'new'
     */
    if (teamDialog.type === 'new') {
      reset({
        ...defaultValues,
        ...teamDialog.data,
        // id: FuseUtils.generateGUID(),
      });
    }
  }, [teamDialog.data, teamDialog.type, reset]);

  /**
   * On Dialog Open
   */
  useEffect(() => {
    if (teamDialog.props.open) {
      initDialog();
    }
  }, [teamDialog.props.open, initDialog]);

  /**
   * Close Dialog
   */
  function closeComposeDialog() {
    return teamDialog.type === 'edit' ? dispatch(closeEditTeamDialog()) : dispatch(closeNewTeamDialog());
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (teamDialog.type === 'new') {
      dispatch(addTeam(data));
    } else {
      dispatch(updateTeam({ ...teamDialog.data, ...data }));
    }
    closeComposeDialog();
  }

  /**
   * Remove Event
   */
  function handleRemove() {
    dispatch(removeTeam(id));
    closeComposeDialog();
  }

  return (
    <Dialog
      classes={{
        paper: 'm-24',
      }}
      {...teamDialog.props}
      onClose={closeComposeDialog}
      fullWidth
      maxWidth="xs"
    >
      <AppBar position="static" elevation={0}>
        <Toolbar className="flex w-full">
          <Typography variant="subtitle1" color="inherit">
            {teamDialog.type === 'new' ? 'New team' : 'Edit team'}
          </Typography>
        </Toolbar>
      </AppBar>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
        <DialogContent classes={{ root: 'p-24' }}>
          <div className="flex">
            <div className="min-w-48 pt-20">
              <Icon color="action">account_circle</Icon>
            </div>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Team name"
                  id="name"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
          </div>

          {members && members.length > 0 && (
            <>
              <Divider />
              <div className="flex flex-col p-8">
                <Typography variant="subtitle1">Members</Typography>

                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {members.map((member) => (
                    <ListItem>
                      <ListItemAvatar>
                        {member.user.picture ? (
                          <Avatar className="md:mx-4" alt={member.user.display} src={member.user.picture} />
                        ) : (
                          <Avatar className="md:mx-4">
                            <PersonIcon />
                          </Avatar>
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${member.user.firstname} ${member.user.lastname}`}
                        secondary={
                          <Typography className="capitalize" color="textSecondary">
                            {member.role.toString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            </>
          )}
        </DialogContent>

        {teamDialog.type === 'new' ? (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button variant="contained" color="secondary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
                Add
              </Button>
            </div>
          </DialogActions>
        ) : (
          <DialogActions className="justify-between p-4 pb-16">
            <div className="px-16">
              <Button variant="contained" color="secondary" type="submit" disabled={_.isEmpty(dirtyFields) || !isValid}>
                Save
              </Button>
            </div>
            {/* <IconButton onClick={handleRemove}>
              <Icon>delete</Icon>
            </IconButton> */}
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}

export default TeamDialog;
