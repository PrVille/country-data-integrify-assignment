import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { selectCountries } from "../reducers/countryReducer"
import { useDebounce } from 'use-debounce'

import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  InputBase,
} from "@mui/material"

import MenuIcon from "@mui/icons-material/Menu"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import SearchIcon from "@mui/icons-material/Search"

import { styled, alpha } from "@mui/material/styles"

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}))

const TableAppBar = ({ onChangeSearch }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Countries
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" onChange={onChangeSearch} />
        </Search>
      </Toolbar>
    </AppBar>
  )
}

const TableHeader = ({ toggleOrder, order }) => {
  const headCells = [
    {
      id: "flag",
      label: "Flag",
    },
    {
      id: "name",
      label: "Name",
    },
    {
      id: "region",
      label: "Region",
    },
    {
      id: "population",
      label: "Population",
    },
    {
      id: "languages",
      label: "Languages",
    },
    {
      id: "chevron",
      label: "",
    },
  ]

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id}>
            {headCell.id === "name" ? (
              <TableSortLabel
                active={true}
                direction={order}
                onClick={() => toggleOrder()}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const Countries = () => {
  const countries = useSelector(selectCountries)
  const navigate = useNavigate()
  const location = useLocation()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchQueryDebounced] = useDebounce(searchQuery, 500)
  const [order, setOrder] = useState("asc")

  const onChangeSearch = (event) => {
    setPage(0)
    setSearchQuery(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const toggleOrder = () => {
    setOrder(order === "asc" ? "desc" : "asc")
  }

  const filteredCountries = useMemo(
    () =>
      countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchQueryDebounced.toLowerCase())
      ),
    [countries, searchQueryDebounced]
  )

  const sortedCountries = useMemo(
    () =>
      order === "asc"
        ? filteredCountries.sort((a, b) =>
            a.name.common > b.name.common ? 1 : -1
          )
        : filteredCountries.sort((a, b) =>
            a.name.common < b.name.common ? 1 : -1
          ),
    [order, filteredCountries]
  )

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        <TableAppBar onChangeSearch={onChangeSearch} />
        <TableContainer sx={{ height: 650 }}>
          <Table stickyHeader>
            <TableHeader order={order} toggleOrder={toggleOrder} />
            <TableBody>
              {sortedCountries
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((country, i) => {
                  return (
                    <TableRow
                      hover
                      onClick={() =>
                        navigate(`/${country.name.common}`, {
                          state: { background: location },
                        })
                      }
                      key={i}
                    >
                      <TableCell style={{ width: 200 }}>
                        <img
                          src={country.flags.png}
                          alt={country.flags.alt}
                          width={"auto"}
                          height={"75"}
                        />
                      </TableCell>
                      <TableCell>{country.name.common}</TableCell>
                      <TableCell>{country.region}</TableCell>
                      <TableCell>{country.population}</TableCell>
                      <TableCell>
                        {country.languages && (
                          <ul>
                            {Object.values(country.languages).map((lang) => (
                              <li key={lang}>{lang}</li>
                            ))}
                          </ul>
                        )}
                      </TableCell>
                      <TableCell>
                        <ChevronRightIcon />
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCountries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}

export default Countries
