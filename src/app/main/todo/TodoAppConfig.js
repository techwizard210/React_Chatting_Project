import { lazy } from "react";
import { Navigate } from "react-router-dom";

const TodoApp = lazy(() => import("./TodoApp"));

const TodoAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    // {
    //   path: "/apps/todo/:filter/:label/:todoId",
    //   // '/apps/todo/:folder/:todoId?',
    //   element: <TodoApp></TodoApp>,
    // },
    // {
    //   path: "/apps/todo/:filter/:todoId",
    //   element: <TodoApp></TodoApp>,
    // },
    {
      path: "/apps/todo",
      children: [
        {
          path: "",
          element: <Navigate to="all"></Navigate>,
        },
        {
          path: ":filter",
          element: <TodoApp></TodoApp>,
        },
        {
          path: "label/:todoId",
          element: <TodoApp></TodoApp>,
        },
      ],
    },
  ],
};

export default TodoAppConfig;
