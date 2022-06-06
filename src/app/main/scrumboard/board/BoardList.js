import Card from '@mui/material/Card';
import { styled, darken } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import BoardCard from './BoardCard';
import BoardListHeader from './BoardListHeader';
import BoardAddCard from './BoardAddCard';
import { getBoard } from '../store/boardSlice';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: darken(theme.palette.background.paper, theme.palette.mode === 'light' ? 0.02 : 0.25),
  transitionProperty: 'box-shadow',
  transitionDuration: theme.transitions.duration.short,
  transitionTimingFunction: theme.transitions.easing.easeInOut,
}));

function BoardList(props) {
  const contentScrollEl = useRef(null);
  const dispatch = useDispatch();
  const board = useSelector(({ scrumboardApp }) => scrumboardApp.board);
  let list = _.find(board.lists, { id: props.listId });
  const [seemoreFlg, setSeemoreFlg] = useState(false);

  function handleCardAdded() {
    contentScrollEl.current.scrollTop = 0;
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    list = _.find(board.lists, { id: props.listId });
  }, [board, props.listId]);

  function seeMoreAction() {
    setSeemoreFlg(true);
    dispatch(getBoard({ boardId: props.boardId, pageNumber: list.pageNumber + 1, chagenListId: list.id })).then(
      (payload) => {
        setSeemoreFlg(false);
      }
    );
  }

  if (!list) return null;
  return (
    <Draggable draggableId={list.id} index={props.index} type="list">
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <StyledCard
            className={clsx(
              snapshot.isDragging ? 'shadow-lg' : 'shadow',
              'w-256 sm:w-384 mx-8 sm:mx-12 max-h-full flex flex-col rounded-20'
            )}
            square
          >
            <BoardListHeader listId={list.id} className="" handleProps={provided.dragHandleProps} />
            <CardContent
              className="flex flex-col flex-auto h-full min-h-0 w-full p-0 mt-3 overflow-auto"
              ref={contentScrollEl}
            >
              <Droppable droppableId={list.id} type="card" direction="vertical">
                {(_provided) => (
                  <div ref={_provided.innerRef} className="flex flex-col w-full h-full px-16 pt-16">
                    {list.idCards
                      ? list.idCards.map((card, index) => (
                          <BoardCard key={card.id} cardId={card.id} index={index} list={list} />
                        ))
                      : ''}
                    {_provided.placeholder}
                  </div>
                )}
              </Droppable>
              {list.remainCount > 0 && (
                <div className="-mt-16 mb-10">
                  {!seemoreFlg ? (
                    <div className="text-center mt-10 cursor-pointer text-blue" onClick={seeMoreAction}>
                      See more
                    </div>
                  ) : (
                    <div className="text-center mt-10">
                      <CircularProgress color="inherit" size={20} />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardActions className="p-0 flex-shrink-0">
              <BoardAddCard listId={list.id} onCardAdded={handleCardAdded} />
            </CardActions>
          </StyledCard>
        </div>
      )}
    </Draggable>
  );
}

export default BoardList;
