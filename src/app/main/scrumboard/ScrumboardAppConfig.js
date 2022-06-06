import { lazy } from "react";

const Board = lazy(() => import("./board/Board"));
const Boards = lazy(() => import("./boards/Boards"));

const ScrumboardAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/apps/boarddetail/:boardId/:boardUri",
      element: <Board></Board>,
    },
    {
      path: "/apps/scrumboard/boards",
      element: <Boards></Boards>,
    },
    // {
    //   path: '/apps/scrumboard',
    //   component: () => <Redirect to="/apps/scrumboard/boards" />,
    // },
  ],
};

export default ScrumboardAppConfig;
