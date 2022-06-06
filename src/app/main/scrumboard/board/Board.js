import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Hidden from "@mui/material/Hidden";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import withReducer from "app/store/withReducer";
import clsx from "clsx";
import { useRef, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useDeepCompareEffect } from "@fuse/hooks";
import GlobalStyles from "@mui/material/GlobalStyles";
import reducer from "../store";
import {
  reorderCard,
  /* reorderList, resetBoard, getBoard8 */
  resetBoard,
  getBoard,
  reorderList,
} from "../store/boardSlice";

import BoardAddList from "./BoardAddList";
import BoardList from "./BoardList";
import BoardTitle from "./BoardTitle";
import BoardCardDialog from "./dialogs/card/BoardCardDialog";
import BoardSettingsSidebar from "./sidebars/settings/BoardSettingsSidebar";

function Board(props) {
  const dispatch = useDispatch();
  const board = useSelector(({ scrumboardApp }) => scrumboardApp.board);
  const userRole = useSelector(({ auth }) => auth.user.role);

  const routeParams = useParams();
  const containerRef = useRef(null);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);

  useDeepCompareEffect(() => {
    dispatch(getBoard(routeParams));
    return () => {
      dispatch(resetBoard());
    };
  }, [dispatch, routeParams]);

  function onBeforeDragStart(initial) {}

  function onDragEnd(result) {
    const { source, destination } = result;

    if (!userRole.includes("admin") && !userRole.includes("manager")) {
      return;
    }

    // dropped nowhere
    if (!destination) {
      return;
    }

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering list
    if (result.type === "list") {
      dispatch(reorderList(result));
    }

    // reordering card
    if (result.type === "card") {
      dispatch(reorderCard(result));
    }
  }

  function toggleSettingsDrawer(state) {
    setSettingsDrawerOpen(state === undefined ? !settingsDrawerOpen : state);
  }

  if (!board) {
    return null;
  }

  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          "#fuse-main": {
            height: "100vh",
          },
        })}
      />
      <div
        className="flex flex-1 flex-col w-full h-full relative"
        ref={containerRef}
      >
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar className="flex items-center justify-between px-4 sm:px-24 h-48 sm:h-96 container">
            <Hidden smDown>
              <Button
                to="/apps/scrumboard/boards"
                component={Link}
                variant="contained"
                color="secondary"
              >
                <Icon>assessment</Icon>
                <span className="px-8">Boards</span>
              </Button>
            </Hidden>

            <Hidden smUp>
              <IconButton
                color="inherit"
                to="/apps/scrumboard/boards/"
                component={Link}
                size="large"
              >
                <Icon>assessment</Icon>
              </IconButton>
            </Hidden>

            <div className="flex flex-1 justify-center items-center">
              <BoardTitle />
            </div>

            <IconButton
              color="inherit"
              onClick={() => toggleSettingsDrawer(true)}
              size="large"
            >
              <Icon>settings</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>

        <div className={clsx("flex flex-1 overflow-x-auto overflow-y-hidden")}>
          <DragDropContext
            onBeforeDragStart={onBeforeDragStart}
            onDragEnd={onDragEnd}
          >
            <Droppable droppableId="list" type="list" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className="flex container py-16 md:py-24 px-8 md:px-12"
                >
                  {board.lists.map((list, index) => (
                    <BoardList
                      key={list.id}
                      boardId={board.id}
                      listId={list.id}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}

                  <BoardAddList />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <SwipeableDrawer
          anchor="right"
          className="absolute overflow-hidden"
          classes={{
            paper: "absolute w-320",
          }}
          BackdropProps={{
            classes: {
              root: "absolute",
            },
          }}
          container={containerRef.current}
          ModalProps={{
            keepMounted: true,
            style: { position: "absolute" },
          }}
          open={settingsDrawerOpen}
          onOpen={(ev) => {}}
          onClose={() => toggleSettingsDrawer(false)}
          disableSwipeToOpen
        >
          <BoardSettingsSidebar />
        </SwipeableDrawer>

        <BoardCardDialog />
      </div>
    </>
  );
}

export default withReducer("scrumboardApp", reducer)(Board);
