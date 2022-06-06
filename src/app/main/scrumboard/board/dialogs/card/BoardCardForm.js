import { useDebounce } from '@fuse/hooks';
import _ from '@lodash';
import { DateTimePicker } from '@mui/lab';
import clsx from 'clsx';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import fromUnixTime from 'date-fns/fromUnixTime';
import getUnixTime from 'date-fns/getUnixTime';
import format from 'date-fns/format';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import SocialIcon from 'app/main/chat/SocialIcon';

import Chat from './CardChat';
import { closeCardDialog, updateCard, sendFileAttachment } from '../../../store/cardSlice';
import { clearSelect } from '../../../store/boardCurrentSlice';
import CardActivity from './activity/CardActivity';
import CardAttachment from './attachment/CardAttachment';
import CardChecklist from './checklist/CardChecklist';
import CardComment from './comment/CardComment';
import DueMenu from './toolbar/DueMenu';
import MembersMenu from './toolbar/MembersMenu';
import OptionsMenu from './toolbar/OptionsMenu';
import CheckListMenu from './toolbar/CheckListMenu';
import LabelsMenu from './toolbar/LabelsMenu';
import CustomerSidebar from '../../sidebars/CustomerSidebar';

// import { getChatMessage } from '../../../store/boardChatSlice';

import { openMobileChatsSidebar, openCustomerSidebar, closeCustomerSidebar } from '../../../store/sidebarsSlice';

function BoardCardForm(props) {
  const dispatch = useDispatch();
  const card = useSelector(({ scrumboardApp }) => scrumboardApp.card.data);
  const board = useSelector(({ scrumboardApp }) => scrumboardApp.board);
  const { register, watch, control, setValue } = useForm({ mode: 'onChange', defaultValues: card });
  const cardForm = watch();
  const { listId } = cardForm;

  const [attachments, setAttachments] = useState();

  const selectType = useSelector(({ scrumboardApp }) => scrumboardApp.boardCurrent.selectType);
  const selected = useSelector(({ scrumboardApp }) => scrumboardApp.boardCurrent.selected);
  const [channelName, setChannelName] = useState('');

  useMemo(() => {
    if (selected && selected.channel) {
      if (selected.channel.channel === 'line' && selected.channel.line) setChannelName(selected.channel.line.name);
      if (selected.channel.channel === 'facebook' && selected.channel.facebook)
        setChannelName(selected.channel.facebook.name);
    }
  }, [selected]);

  const { id: userId } = useSelector(({ auth }) => auth.user.foxData);

  const customerSidebarOpen = useSelector(({ scrumboardApp }) => scrumboardApp.sidebars.customerSidebarOpen);

  // Mask Follow Up and spam
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    setAttachments(cardForm.attachments);
  }, [cardForm.attachments]);

  const [fileLoading, setFileLoading] = useState(false);

  const updateCardData = useDebounce((boardId, newCard) => {
    if (!fileLoading) {
      dispatch(updateCard({ boardId, listId, card: { ...newCard } }));
    }
  }, 600);

  const list = _.find(board.lists, { id: listId });

  useEffect(() => {
    if (!card) {
      return;
    }
    updateCardData(board.id, cardForm);
  }, [
    board.id,
    cardForm.name,
    cardForm.description,
    cardForm.due,
    cardForm.activities,
    cardForm.attachments,
    cardForm.checklists,
    cardForm.idMembers,
    cardForm.idLabels,
  ]); // [board.id, card, cardForm, updateCardData]);

  const handlerFileInput = (event) => {
    setFileLoading(true);
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    dispatch(
      sendFileAttachment({
        formData,
        card,
      })
    )
      .unwrap()
      .then((payload) => {
        setTimeout(() => {
          setFileLoading(false);
          setAttachments(payload);
        }, 5000);
      });
  };

  const drawerWidth = 400;

  const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      maxWidth: '100%',
      overflow: 'hidden',
      // height: '100%',
      [theme.breakpoints.up('md')]: {
        position: 'relative',
      },
    },
  }));

  if (!card) {
    return null;
  }

  return (
    <>
      <DialogTitle component="div" className="p-0">
        <AppBar position="static" elevation={0}>
          <Toolbar className="flex w-full overflow-x-auto px-8 sm:px-16">
            <div className="flex flex-1">
              <Controller
                name="due"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <DueMenu onDueChange={onChange} onRemoveDue={() => onChange(null)} due={value} />
                )}
              />

              <Controller
                name="idLabels"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <LabelsMenu
                    onToggleLabel={(labelId) => onChange(_.xor(value, [labelId]))}
                    labels={board.labels}
                    idLabels={value}
                  />
                )}
              />

              <Controller
                name="idMembers"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <MembersMenu
                    onToggleMember={(memberId) => onChange(_.xor(value, [memberId]))}
                    members={board.members}
                    idMembers={value}
                  />
                )}
              />

              <input
                accept="image/gif, image/png, image/jpeg, video/mp4"
                onChange={handlerFileInput}
                className="hidden"
                id="icon-button-file"
                type="file"
              />
              <label htmlFor="icon-button-file">
                <IconButton color="inherit" component="span" size="large">
                  {fileLoading ? <CircularProgress color="inherit" size={20} /> : <Icon>attachment</Icon>}
                </IconButton>
              </label>

              <Controller
                name="checklists"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                  <CheckListMenu onAddCheckList={(newList) => onChange([...cardForm.checklists, newList])} />
                )}
              />

              <OptionsMenu boardId={board.id} cardId={cardForm.id} />
            </div>
            <IconButton
              color="inherit"
              onClick={(ev) => {
                dispatch(closeCardDialog());
                dispatch(clearSelect());
              }}
              size="large"
            >
              <Icon>close</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
      </DialogTitle>

      <DialogContent className="p-16 px-0">
        {selected && (
          <>
            {/* Chat message Header */}
            <AppBar className="w-full" elevation={0} position="static">
              <Toolbar className="px-16 m-8">
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={() => dispatch(openMobileChatsSidebar())}
                  className="flex md:hidden"
                  size="large"
                >
                  <Icon>chat</Icon>
                </IconButton>
                <div className="flex flex-row justify-between w-full">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => dispatch(openCustomerSidebar())}
                    onKeyDown={() => dispatch(openCustomerSidebar())}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="relative mx-8">
                      <div className="absolute right-0 bottom-0 -m-4 z-10">
                        <SocialIcon status={selected.channel.channel} />
                      </div>

                      {selectType === 'chat' && (
                        <Avatar
                          sx={{ width: 60, height: 60 }}
                          src={selected.customer.pictureURL}
                          alt={selected.customer.display}
                        />
                      )}
                      {selectType === 'history' && (
                        <Avatar sx={{ width: 60, height: 60 }} src={selected.pictureURL} alt={selected.display} />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Typography color="white" className="text-18 font-semibold px-4">
                        {selectType === 'chat' && (
                          <>
                            <Hidden mdDown>
                              <>
                                {selected.customer.firstname
                                  ? `${selected.customer.firstname.substring(0, 15)}`
                                  : `${selected.customer.display.substring(0, 15)}`}
                              </>
                            </Hidden>
                            <Hidden mdUp>
                              <>
                                {selected.customer.firstname || selected.customer.lastname
                                  ? `${selected.customer.firstname} ${selected.customer.lastname}`
                                  : `${selected.customer.display}`}
                              </>
                            </Hidden>
                          </>
                        )}
                        {selectType === 'history' && (
                          <>
                            <Hidden mdDown>
                              <>
                                {selected.firstname
                                  ? `${selected.firstname.substring(0, 15)}`
                                  : `${selected.display.substring(0, 15)}`}
                              </>
                            </Hidden>
                            <Hidden mdUp>
                              <>
                                {selected.firstname || selected.lastname
                                  ? `${selected.firstname} ${selected.lastname}`
                                  : `${selected.display}`}
                              </>
                            </Hidden>
                          </>
                        )}
                      </Typography>
                      <div className="flex flex-row space-x-8">
                        <Hidden mdDown>
                          <Chip
                            size="small"
                            variant="outlined"
                            color="secondary"
                            className="w-min m-8"
                            label={channelName}
                          />
                          {selectType === 'chat' &&
                            selected.mention.filter((el) => !el.isRead && el.user.id === userId).length > 0 && (
                              <Chip
                                size="small"
                                variant="outlined"
                                color="error"
                                className="w-min m-8"
                                label={`TeamChat mention: ${
                                  selected.mention.filter((el) => !el.isRead && el.user.id === userId).length
                                }`}
                              />
                            )}
                        </Hidden>
                        <Hidden mdUp>
                          <Chip
                            size="small"
                            variant="outlined"
                            color="secondary"
                            className="w-min m-8"
                            label={`${channelName.substring(0, 15)}...`}
                          />
                          {selectType === 'chat' &&
                            selected.mention.filter((el) => !el.isRead && el.user.id === userId).length > 0 && (
                              <Chip
                                size="small"
                                variant="outlined"
                                color="error"
                                className="w-min m-8"
                                label={`Mention: ${
                                  selected.mention.filter((el) => !el.isRead && el.user.id === userId).length
                                }`}
                              />
                            )}
                        </Hidden>
                      </div>
                    </div>
                  </div>
                </div>
              </Toolbar>
            </AppBar>
            <div className="ChatApp-content">
              {/* Message List */}
              <Chat className="flex flex-1 z-100 max-h-288" />
            </div>
          </>
        )}
        <div className="px-24">
          <div className="flex flex-col sm:flex-row sm:justify-between justify-center items-center my-24">
            <div className="mb-16 sm:mb-0 flex items-center">
              <Typography>{board.name}</Typography>

              <Icon className="text-20" color="inherit">
                chevron_right
              </Icon>

              <Typography>{list && list.name}</Typography>
            </div>
            {cardForm.due && (
              <DateTimePicker
                value={format(fromUnixTime(cardForm.due), 'Pp')}
                inputFormat="Pp"
                onChange={(val) => setValue('due', getUnixTime(val))}
                renderInput={(_props) => (
                  <TextField
                    label="Due date"
                    placeholder="Choose a due date"
                    className="w-full sm:w-auto"
                    {..._props}
                  />
                )}
              />
            )}
          </div>

          <div className="flex items-center mb-24">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  type="text"
                  variant="outlined"
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {card.subscribed && (
                          <Icon className="text-20" color="action">
                            remove_red_eye
                          </Icon>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>

          <div className="w-full mb-24">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Description" multiline rows="4" variant="outlined" fullWidth />
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row -mx-8">
            {cardForm.idLabels && cardForm.idLabels.length > 0 && (
              <div className="flex-1 mb-24 mx-8">
                <div className="flex items-center mt-16 mb-12">
                  <Icon className="text-20" color="inherit">
                    label
                  </Icon>
                  <Typography className="font-semibold text-16 mx-8">Labels</Typography>
                </div>

                <Autocomplete
                  className="mt-8 mb-16"
                  multiple
                  // freeSolo
                  options={board.labels}
                  getOptionLabel={(label) => {
                    return label.title;
                  }}
                  value={cardForm.idLabels.map((_id) => _.find(board.labels, { id: _id }))}
                  onChange={(event, newValue) => {
                    setValue(
                      'idLabels',
                      newValue.map((item) => item.id)
                    );
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      return (
                        <Chip
                          label={option.title}
                          {...getTagProps({ index })}
                          className={clsx('m-3', option.class)}
                          style={{ backgroundColor: option.color }}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select multiple Labels"
                      label="Labels"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                        readOnly: true,
                      }}
                    />
                  )}
                />
              </div>
            )}
            {cardForm.idMembers && cardForm.idMembers.length > 0 && (
              <div className="flex-1 mb-24 mx-8">
                <div className="flex items-center mt-16 mb-12">
                  <Icon className="text-20" color="inherit">
                    supervisor_account
                  </Icon>
                  <Typography className="font-semibold text-16 mx-8">Members</Typography>
                </div>

                <Autocomplete
                  className="mt-8 mb-16"
                  multiple
                  // freeSolo
                  options={board.members}
                  getOptionLabel={(member) => {
                    return member.display;
                  }}
                  value={cardForm.idMembers.map((_id) => _.find(board.members, { id: _id }))}
                  onChange={(event, newValue) => {
                    setValue(
                      'idMembers',
                      newValue.map((item) => item.id)
                    );
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      return (
                        <Chip
                          label={option.display}
                          {...getTagProps({ index })}
                          className={clsx('m-3', option.class)}
                          avatar={
                            <Tooltip title={option.display}>
                              <Avatar src={option.picture} />
                            </Tooltip>
                          }
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select multiple Members"
                      label="Members"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </div>
            )}
          </div>

          {attachments && attachments.length > 0 && (
            <div className="mb-24">
              <div className="flex items-center mt-16 mb-12">
                <Icon className="text-20" color="inherit">
                  attachment
                </Icon>
                <Typography className="font-semibold text-16 mx-8">Attachments</Typography>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap -mx-16">
                {attachments.map((item, index) => (
                  <CardAttachment
                    item={item}
                    card={card}
                    removeAttachment={() => {
                      attachments.splice(index, 1);
                    }}
                    key={item.id}
                  />
                ))}
              </div>
            </div>
          )}

          {cardForm.checklists &&
            cardForm.checklists.map((checklist, index) => (
              <CardChecklist
                key={checklist.id}
                checklist={checklist}
                index={index}
                onCheckListChange={(item, itemIndex) => {
                  setValue('checklists', _.setIn(cardForm.checklists, `[${itemIndex}]`, item));
                }}
                onRemoveCheckList={() => {
                  setValue('checklists', _.reject(cardForm.checklists, { id: checklist.id }));
                }}
              />
            ))}

          <div className="mb-24">
            <div className="flex items-center mt-16 mb-12">
              <Icon className="text-20" color="inherit">
                comment
              </Icon>
              <Typography className="font-semibold text-16 mx-8">Comment</Typography>
            </div>
            <div>
              <CardComment
                members={board.members}
                boardId={board.id}
                listId={listId}
                card={card}
                onCommentAdd={(comment) => setValue('activities', [comment, ...cardForm.activities])}
              />
            </div>
          </div>

          <Controller
            name="activities"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => (
              <div>
                {value.length > 0 && (
                  <div className="mb-24">
                    <div className="flex items-center mt-16">
                      <Icon className="text-20" color="inherit">
                        list
                      </Icon>
                      <Typography className="font-semibold text-16 mx-8">Activity</Typography>
                    </div>
                    <List className="">
                      {value.map((item) => (
                        <CardActivity item={item} key={item.id} members={board.members} />
                      ))}
                    </List>
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </DialogContent>

      <div>
        <StyledSwipeableDrawer
          className="h-full absolute z-30"
          variant="temporary"
          anchor="right"
          open={customerSidebarOpen}
          onOpen={(ev) => {}}
          onClose={() => dispatch(closeCustomerSidebar())}
          classes={{
            paper: 'absolute ltr:right-0 rtl:left-0',
          }}
          sx={{ '& .MuiDrawer-paper': { position: 'absolute' } }}
          ModalProps={{
            keepMounted: true,
            disablePortal: true,
            BackdropProps: {
              classes: {
                root: 'absolute',
              },
            },
          }}
        >
          <CustomerSidebar />
        </StyledSwipeableDrawer>
      </div>
    </>
  );
}

export default BoardCardForm;
