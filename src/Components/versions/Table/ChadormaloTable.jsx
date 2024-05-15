import {
  Table as MuiTable,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
  MenuItem,
  Button,
  Card,
  Pagination,
  PaginationItem,
  TextField,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { enToFaNumber } from "Utility/utils";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLayoutEffect, useState } from "react";

const sortIconsStyle = { ml: 1 };

export default function ChadormaloTable(props) {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const {
    children,
    headCells,
    filters = {},
    setFilters = () => {},
    from,
    to,
    total,
    per_page,
    current_page,
    next_page_url,
    prev_page_url,
    loading,
  } = props;

  const handleChangePageLength = (event) => {
    setSearchParamsFilter({
      ...searchParamsFilter,
      pageLength: event.target.value,
    });
  };
  const handleChangePage = (page) => {
    setSearchParamsFilter({ ...searchParamsFilter, page: page });
  };
  const handleSort = (id) => {
    const currentDirection = filters?.[`sort[dir]`];
    const newDirection = currentDirection === "asc" ? "desc" : "asc";

    setSearchParamsFilter({
      ...searchParamsFilter,
      [`sort[column]`]: id,
      [`sort[dir]`]: newDirection,
    });
  };
  return (
    <>
      <FilterSection
        {...props}
        handleChangePageLength={handleChangePageLength}
        handleChangePage={handleChangePage}
      />

      <Box position="relative">
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ maxHeight: "calc(100vh - 132px)" }}
        >
          <MuiTable sx={{ minWidth: 650 }} stickyHeader>
            <TableHead>
              <TableRow>
                {headCells?.map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      sx={{
                        fontWeight: "bold",
                        bgcolor: "background.paper",
                        textAlign: cell.label === "عملیات" ? "start" : "center",
                        whiteSpace: "nowrap",
                        color: "primary.600",
                      }}
                    >
                      {cell.sortable ? (
                        <Button
                          color="primary"
                          sx={{ fontWeight: "bold", color: "primary.600" }}
                          onClick={() => cell.sortable && handleSort(cell.id)}
                        >
                          {cell.label}
                          {cell.sortable && (
                            <>
                              {filters?.[`sort[column]`] === cell.id ? (
                                <>
                                  {filters?.[`sort[dir]`] === "asc" ? (
                                    <SvgSPrite
                                      icon={"arrow-up-short-wide"}
                                      sxStyles={sortIconsStyle}
                                      size={16}
                                    />
                                  ) : (
                                    <SvgSPrite
                                      icon={"arrow-down-short-wide"}
                                      sxStyles={sortIconsStyle}
                                      size={16}
                                    />
                                  )}
                                </>
                              ) : (
                                <SvgSPrite
                                  icon={"bars-sort"}
                                  sxStyles={sortIconsStyle}
                                  size={16}
                                />
                              )}
                            </>
                          )}
                        </Button>
                      ) : (
                        cell.label
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            {children}
          </MuiTable>
        </TableContainer>

        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 100,
              bgcolor: (theme) => `${theme.palette.primary.extraLight}20`,
              backdropFilter: "blur(2px)",
            }}
          >
            <LoadingSpinner />
          </Box>
        )}
      </Box>

      <FilterSection
        {...props}
        isTop={true}
        handleChangePageLength={handleChangePageLength}
        handleChangePage={handleChangePage}
      />

      {total === 0 && (
        <Typography sx={{ pl: 2, py: 2, color: "text.primary" }}>
          داده ای برای نمایش وجود ندارد
        </Typography>
      )}
    </>
  );
}

const FilterSection = (props) => {
  const {
    filters,
    from,
    to,
    total,
    per_page,
    current_page,
    next_page_url,
    prev_page_url,
    isTop,
    handleChangePageLength,
    handleChangePage,
    last_page,
  } = props;
  const [page, setPage] = useState(current_page || 1);
  const handleChange = (event, value) => {
    handleChangePage(value);
    setPage(value);
  };

  useLayoutEffect(() => {
    setPage(current_page);
  }, [current_page]);

  return (
    <Card sx={{ mb: isTop ? 0 : 0.5, p: 2, mt: isTop ? 0.5 : 0 }}>
      <Stack
        direction={{ sm: "row", xs: "column" }}
        flexWrap="wrap"
        alignItems="center"
        gap={2}
      >
        <Pagination
          count={last_page}
          color="primary"
          variant="outlined"
          shape="rounded"
          siblingCount={0}
          page={page}
          onChange={handleChange}
          renderItem={(item) => {
            return (
              <PaginationItem
                {...item}
                page={enToFaNumber(item?.page)}
                sx={{
                  my: 0.5,
                  "&.Mui-selected": {
                    color: "primary.300",
                  },
                }}
              />
            );
          }}
        />
        <Stack
          direction="row"
          sx={{ flexGrow: 1, mx: 3, display: { sm: "flex", xs: "none" } }}
          alignItems="center"
          spacing={2}
        >
          <Divider
            sx={{
              flexGrow: 1,
              borderBottomStyle: "dashed",
              borderBottomWidth: 2,
            }}
          />
          <SvgSPrite
            icon={"circle"}
            MUIColor="primary.600"
            hoverColor="primary.600"
            size="small"
          />
          <Divider
            sx={{
              flexGrow: 1,
              borderBottomStyle: "dashed",
              borderBottomWidth: 2,
            }}
          />
        </Stack>
        <TextField
          id="standard-select-currency"
          select
          defaultValue={filters?.pageLength ?? 10}
          helperText="سطر در صفحه"
          variant="standard"
          value={per_page}
          onChange={handleChangePageLength}
        >
          <MenuItem value={10}>{enToFaNumber(10)}</MenuItem>
          <MenuItem value={50}>{enToFaNumber(50)}</MenuItem>
          <MenuItem value={100}>{enToFaNumber(100)}</MenuItem>
        </TextField>
      </Stack>
    </Card>
  );
};
