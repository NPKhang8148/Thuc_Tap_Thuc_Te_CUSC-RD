import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  TableChart as TableChartIcon,
} from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";

/**
 * Reusable DataTable component
 * @param {Object[]} data - Mảng dữ liệu
 * @param {Object[]} columns - Danh sách cột ({ field, label, enableSort, numeric })
 * @param {Array} actions - Danh sách hành động ({ label, handler })
 * @param {String} keyField - Tên trường định danh (unique)
 * @param {Function} onSort - Hàm xử lý khi sắp xếp
 */
const DataTable = ({ data, columns, onSort, actions, keyField }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.field || "");
  const [selected, setSelected] = useState([]);
  const [menuAnchorEls, setMenuAnchorEls] = useState({});

  // ====== HANDLE SORT ======
  const handleRequestSort = (event, property) => {
    if (!columns.find((col) => col.field === property)?.enableSort) return;
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    onSort?.(property, isAsc ? "desc" : "asc");
  };

  // ====== HANDLE SELECT ======
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data.map((n) => n[keyField]));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) newSelected = selected.concat(id);
    else
      newSelected = selected.filter((selectedId) => selectedId !== id);

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // ====== HANDLE MENU ======
  const handleMenuClick = (event, rowId) => {
    setMenuAnchorEls((prev) => ({ ...prev, [rowId]: event.currentTarget }));
  };

  const handleMenuClose = (rowId) => {
    setMenuAnchorEls((prev) => ({ ...prev, [rowId]: null }));
  };

  // ====== RENDER ROW ======
  const renderTableRow = (row) => (
    <TableRow
      hover
      key={row[keyField]}
      selected={isSelected(row[keyField])}
      sx={{
        "&.Mui-selected": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
      }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isSelected(row[keyField])}
          onChange={(event) => handleClick(event, row[keyField])}
        />
      </TableCell>

      {columns.map((col) => (
        <TableCell
          key={col.field}
          align={col.numeric ? "right" : "left"}
          sx={{
            wordWrap: "break-word",
            maxWidth: 180,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {row[col.field] ?? "-"}
        </TableCell>
      ))}

      <TableCell align="right">
        <IconButton
          onClick={(event) => handleMenuClick(event, row[keyField])}
          aria-controls={`menu-${row[keyField]}`}
          aria-haspopup="true"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={`menu-${row[keyField]}`}
          anchorEl={menuAnchorEls[row[keyField]]}
          open={Boolean(menuAnchorEls[row[keyField]])}
          onClose={() => handleMenuClose(row[keyField])}
        >
          {actions.map((action) => (
            <MenuItem
              key={action.label}
              onClick={() => {
                action.handler(row);
                handleMenuClose(row[keyField]);
              }}
            >
              {action.label}
            </MenuItem>
          ))}
        </Menu>
      </TableCell>
    </TableRow>
  );

  // ====== RENDER TABLE ======
  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750, fontFamily: "Inter, sans-serif" }}
            size="small"
          >
            {/* Header */}
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < data.length
                    }
                    checked={
                      data.length > 0 && selected.length === data.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    align={col.numeric ? "right" : "left"}
                    sortDirection={orderBy === col.field ? order : false}
                    sx={{ fontWeight: "bold", fontFamily: "Inter, sans-serif" }}
                  >
                    {col.enableSort ? (
                      <TableSortLabel
                        active={orderBy === col.field}
                        direction={orderBy === col.field ? order : "asc"}
                        onClick={(event) =>
                          handleRequestSort(event, col.field)
                        }
                      >
                        {col.label}
                        {orderBy === col.field ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      <Typography variant="body2">{col.label}</Typography>
                    )}
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Tooltip title="Cột tùy chọn">
                    <IconButton>
                      <TableChartIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {data.length > 0 ? (
                data.map((row) => renderTableRow(row))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onSort: PropTypes.func,
  actions: PropTypes.array,
  keyField: PropTypes.string.isRequired,
};

DataTable.defaultProps = {
  onSort: () => {},
  actions: [],
};

export default DataTable;
