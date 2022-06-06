import Dialog from '@mui/material/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { closeCardDialog } from '../../../store/cardSlice';
import { clearSelect } from '../../../store/boardCurrentSlice';
import BoardCardForm from './BoardCardForm';

function BoardCardDialog(props) {
  const dispatch = useDispatch();
  const cardDialogOpen = useSelector(({ scrumboardApp }) => scrumboardApp.card.dialogOpen);

  return (
    <Dialog
      classes={{
        paper: 'max-w-lg w-full m-24',
      }}
      onClose={(ev) => {
        dispatch(closeCardDialog());
        dispatch(clearSelect());
      }}
      open={cardDialogOpen}
    >
      <BoardCardForm />
    </Dialog>
  );
}

export default BoardCardDialog;
