import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
// import history from '@history';
import withReducer from "app/store/withReducer";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import reducer from "../store";
import {
  selectBoards,
  getBoards,
  resetBoards,
  newBoard,
} from "../store/boardsSlice";

const Root = styled("div")(({ theme }) => ({
  "& .board": {
    transitionProperty: "box-shadow border-color",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
}));

function Boards(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector(selectBoards);

  useEffect(() => {
    dispatch(getBoards());
    return () => {
      dispatch(resetBoards());
    };
  }, [dispatch]);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Root className="flex flex-grow flex-shrink-0 flex-col items-center">
      <div className="flex flex-grow flex-shrink-0 flex-col items-center container px-16 md:px-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
        >
          <Typography
            className="mt-44 sm:mt-88 sm:py-24 text-32 sm:text-40 font-bold"
            color="inherit"
          >
            Scrumboard App
          </Typography>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap w-full justify-center py-32 px-16"
        >
          {boards.map((board) => (
            <motion.div
              variants={item}
              className="w-224 h-224 p-16"
              key={board.id}
            >
              <Paper
                to={`/apps/boarddetail/${board.id}/${board.uri}`}
                className="board flex flex-col items-center justify-center w-full h-full rounded-16 py-24 shadow hover:shadow-lg cursor-pointer"
                role="button"
                component={Link}
              >
                <Icon className="text-56" color="action">
                  assessment
                </Icon>
                <Typography
                  className="text-16 font-medium text-center pt-16 px-32"
                  color="inherit"
                >
                  {board.name}
                </Typography>
              </Paper>
            </motion.div>
          ))}
          <motion.div variants={item} className="w-224 h-224 p-16">
            <Paper
              className="flex flex-col items-center justify-center w-full h-full rounded-16 py-24 shadow hover:shadow-lg outline-none cursor-pointer"
              onClick={() => {
                dispatch(newBoard()).then((res) => {
                  navigate(
                    `/apps/boarddetail/${res.payload.id}/${res.payload.uri}`
                  );
                });
              }}
              // onKeyDown={() => dispatch(newBoard())}
              role="button"
              tabIndex={0}
            >
              <Icon className="text-56" color="secondary">
                add_circle
              </Icon>
              <Typography
                className="text-16 font-medium text-center pt-16 px-32"
                color="inherit"
              >
                Add new board
              </Typography>
            </Paper>
          </motion.div>
        </motion.div>
      </div>
    </Root>
  );
}

export default withReducer("scrumboardApp", reducer)(Boards);
