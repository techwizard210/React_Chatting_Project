import _ from '@lodash';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import getUnixTime from 'date-fns/getUnixTime';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessage } from '../store/boardChatSlice';
import { setChatSelected } from '../store/boardCurrentSlice';
import { openCardDialog } from '../store/cardSlice';
import BoardChatItem from './BoardChatItem';

const StyledCard = styled(Card)(({ theme }) => ({
  transitionProperty: 'box-shadow',
  transitionDuration: theme.transitions.duration.short,
  transitionTimingFunction: theme.transitions.easing.easeInOut,
}));

function BoardCard(props) {
  const dispatch = useDispatch();
  const board = useSelector(({ scrumboardApp }) => scrumboardApp.board);
  const { cardId, index, list } = props;
  const card = _.find(board.cards, { id: cardId });
  if (!card) {
    return null;
  }
  const checkItemsChecked = getCheckItemsChecked(card);
  const checkItems = getCheckItems(card);
  const commentsCount = getCommentsCount(card);

  const { chats } = board;
  const { chatId } = card;

  function handleCardClick(ev, _card) {
    ev.preventDefault();
    if (chatId) {
      dispatch(getChatMessage({ chatId: card.chatId, pNum: 0 }))
        .unwrap()
        .then((payload) => {
          setChatSelected(payload);
          dispatch(openCardDialog({ ..._card, listId: list.id, boardId: board.id }));
        });
    } else {
      dispatch(openCardDialog({ ..._card, listId: list.id, boardId: board.id }));
    }
  }

  function getCheckItemsChecked(_card) {
    if (_card && _card.checklists.length > 0) {
      return _.sum(_card.checklists.map((_list) => _.sum(_list.checkItems.map((x) => (x.checked ? 1 : 0)))));
    }
    return null;
  }

  function getCheckItems(_card) {
    if (_card && _card.checklists.length > 0) {
      return _.sum(_card.checklists.map((x) => x.checkItems.length));
    }
    return 0;
  }

  function getCommentsCount(_card) {
    if (_card && _card.activities.length > 0) {
      return _card.activities.length;
    }
    return 0;
  }
  return (
    <Draggable draggableId={card.id} index={index} type="card">
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <StyledCard
            className={clsx(
              snapshot.isDragging ? 'shadow-lg' : 'shadow-0',
              'w-full mb-16 rounded-16 cursor-pointer border-1'
            )}
            onClick={(ev) => handleCardClick(ev, card)}
          >
            <div className="p-16 pb-0">
              {chatId && (
                <div className="flex flex-wrap mb-8 -mx-4">
                  <BoardChatItem chat={_.find(chats, { id: chatId })} />
                </div>
              )}
              {card.idLabels && card.idLabels.length > 0 && (
                <div className="flex flex-wrap mb-8 -mx-4">
                  {card.idLabels.map((id) => {
                    const label = _.find(board.labels, { id });
                    return (
                      <Tooltip title={label.title} key={id}>
                        <div
                          className={clsx(label.class, 'w-32  h-6 rounded-6 mx-4 mb-6')}
                          style={{ backgroundColor: label.color }}
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              )}
              <Typography className="font-medium mb-12">{card.name}</Typography>

              {(card.due || checkItems > 0) && (
                <div className="flex items-center mb-12 -mx-4">
                  {card.due && (
                    <div
                      className={clsx(
                        'flex items-center px-8 py-4 mx-4 rounded-16',
                        getUnixTime(new Date()) > card.due ? 'bg-red text-white' : 'bg-green text-white'
                      )}
                    >
                      <Icon className="text-16">access_time</Icon>
                      <span className="mx-4">{format(fromUnixTime(card.due), 'MMM do yy')}</span>
                    </div>
                  )}
                  {checkItems > 0 && (
                    <div
                      className={clsx(
                        'flex items-center px-8 py-4 mx-4 rounded-16',
                        checkItemsChecked === checkItems ? 'bg-green text-white' : 'bg-grey-700 text-white'
                      )}
                    >
                      <Icon className="text-16">check_circle</Icon>
                      <span className="mx-4">{`${checkItemsChecked}/${checkItems}`}</span>
                    </div>
                  )}
                </div>
              )}
              {card.idMembers && card.idMembers.length > 0 && (
                <div className="flex flex-wrap mb-12 -mx-4">
                  {card.idMembers.map((id) => {
                    const member = _.find(board.members, { id });
                    return (
                      <Tooltip title={member.display} key={id}>
                        <Avatar className="mx-4 w-32 h-32" src={member.picture} />
                      </Tooltip>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex justify-between h-48 px-16 border-t-1">
              <div className="flex items-center -mx-6">
                {card.subscribed && (
                  <Icon className="text-18 mx-6" color="action">
                    remove_red_eye
                  </Icon>
                )}
                {card.description !== '' && (
                  <Icon className="text-18 mx-6" color="action">
                    description
                  </Icon>
                )}
              </div>
              <div className="flex items-center justify-end -mx-6">
                {card.attachments && (
                  <span className="flex items-center mx-6">
                    <Icon className="text-18" color="action">
                      attachment
                    </Icon>
                    <Typography className="mx-8" color="textSecondary">
                      {card.attachments.length}
                    </Typography>
                  </span>
                )}
                {commentsCount > 0 && (
                  <span className="flex items-center mx-6">
                    <Icon className="text-18" color="action">
                      comment
                    </Icon>
                    <Typography className="mx-8" color="textSecondary">
                      {commentsCount}
                    </Typography>
                  </span>
                )}
              </div>
            </div>
          </StyledCard>
        </div>
      )}
    </Draggable>
  );
}

export default BoardCard;
