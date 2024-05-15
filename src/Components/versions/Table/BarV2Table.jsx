import {
  Table as MuiTable,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Button,
  Card,
  Box,
  Divider,
} from "@mui/material";

import { enToFaNumber } from "Utility/utils";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { SvgSPrite } from "Components/SvgSPrite";
import LoadingSpinner from "../LoadingSpinner";

const sortIconsStyle = { ml: 1, fontSize: "12px" };

export default function BarV2Table(props) {
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
  const handleChangePage = (goNext) => {
    const newPage = goNext ? current_page + 1 : current_page - 1;

    setSearchParamsFilter({ ...searchParamsFilter, page: newPage });
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
    <Card>
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
                      }}
                    >
                      {cell.sortable ? (
                        <Button
                          color="secondary"
                          sx={{ fontWeight: "bold" }}
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
    </Card>
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
  } = props;

  return (
    filters && (
      <>
        {isTop && <Divider />}
        <Stack
          p={2}
          direction="row"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack
            direction="row"
            justifyContent={{ sm: "start", xs: "space-between" }}
            alignItems="center"
            spacing={1}
          >
            <Typography color="text.primary">سطر در صفحه</Typography>
            <Select
              size="small"
              defaultValue={filters?.pageLength ?? 10}
              value={per_page}
              onChange={handleChangePageLength}
            >
              <MenuItem value={10}>{enToFaNumber(10)}</MenuItem>
              <MenuItem value={50}>{enToFaNumber(50)}</MenuItem>
              <MenuItem value={100}>{enToFaNumber(100)}</MenuItem>
            </Select>
          </Stack>

          <Stack
            direction="row"
            justifyContent={{ sm: "end", xs: "space-between" }}
            alignItems="center"
            spacing={3}
          >
            <Typography color="text.primary">
              {enToFaNumber(from) || "-"} تا {enToFaNumber(to) || "-"} از مجموع{" "}
              {enToFaNumber(total) || "-"}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={() => handleChangePage(false)}
                disabled={!prev_page_url}
              >
                <SvgSPrite icon="chevron-right" color="inherit" size="small" />
              </IconButton>
              <Typography color="text.primary">
                {enToFaNumber(current_page)}
              </Typography>
              <IconButton
                onClick={() => handleChangePage(true)}
                disabled={!next_page_url}
              >
                <SvgSPrite icon="chevron-left" color="inherit" size="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
        {!isTop && <Divider />}
      </>
    )
  );
};
