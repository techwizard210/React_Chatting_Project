import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import format from "date-fns/format";

import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import {
  getReplies,
  selectReplies,
  openConfirmRemoveReplyDialog,
} from "../store/repliesSlice";
import ProductsTableHead from "./RepliesTableHead";
import ConfirmRemoveReplyDialog from "../components/ConfirmRemoveReplyDialog";
import { useNavigate } from "react-router-dom";

function RepliesTable(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const replies = useSelector(selectReplies);
  const searchText = useSelector(({ replyApp }) => replyApp.replies.searchText);
  const organization = useSelector(
    ({ auth }) => auth.organization.organization
  );

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(replies);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  useEffect(() => {
    if (organization) dispatch(getReplies()).then(() => setLoading(false));
  }, [dispatch, organization]);

  useEffect(() => {
    console.log("@@@ Replies ", replies);
    if (searchText.length !== 0) {
      setData(
        _.filter(replies, (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setPage(0);
    } else {
      setData(replies);
    }
  }, [replies, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleClick(item) {
    navigate(`/settings/reply/${item.id}`);
  }

  function handleCheck(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There are no replies!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <ConfirmRemoveReplyDialog />
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <ProductsTableHead
            selectedProductIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {_.orderBy(
              data,
              [
                (o) => {
                  switch (order.id) {
                    case "categories": {
                      return o.categories[0];
                    }
                    default: {
                      return o[order.id];
                    }
                  }
                },
              ],
              [order.direction]
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n) => {
                const isSelected = selected.indexOf(n.id) !== -1;
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                    onClick={(event) => handleClick(n)}
                  >
                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {n.name}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {n.status === "active" && (
                        <Chip
                          color="primary"
                          style={{ backgroundColor: "green" }}
                          label="Active"
                        />
                      )}
                      {n.status === "inactive" && (
                        <Chip
                          color="primary"
                          style={{ backgroundColor: "red" }}
                          label="Inactive"
                        />
                      )}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      <Typography className="capitalize">{n.type}</Typography>
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      <Typography className="capitalize">{n.event}</Typography>
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {n.updatedAt && format(new Date(n.updatedAt), "PP")}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      {n.createdAt && format(new Date(n.createdAt), "PP")}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="left"
                    >
                      <div className="flex items-center">
                        <IconButton
                          onClick={(ev) => {
                            ev.stopPropagation();
                            // props.handleConfirmOpen(n);
                            dispatch(openConfirmRemoveReplyDialog(n));
                          }}
                          size="large"
                        >
                          <Icon>delete</Icon>
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="flex-shrink-0 border-t-1"
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default RepliesTable;
