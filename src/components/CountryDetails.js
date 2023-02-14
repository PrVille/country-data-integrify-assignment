import useCountry from "../hooks/useCountry"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"

import {
  Modal,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
} from "@mui/material"

import { styled } from "@mui/material/styles"
import { red } from "@mui/material/colors"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import LocationOnIcon from "@mui/icons-material/LocationOn"

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}))

const HighlightedText = ({ content }) => {
  return (
    <Box component="span" fontWeight="bold" color="#1565c0">
      {content}
    </Box>
  )
}

const CountryDetails = () => {
  const { name } = useParams()
  const country = useCountry(name)
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 20,
  }

  if (!country) return null

  return (
    <Modal open={true} onClose={() => navigate(-1)}>
      <Card sx={style}>
        <CardHeader
          sx={{}}
          avatar={
            <Avatar sx={{ bgcolor: red[500] }}>{country.name.common[0]}</Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={<Box>{country.name.common.toUpperCase()}</Box>}
          subheader={
            country.capital.length > 1
              ? country.capital.join(", ")
              : country.capital[0]
          }
        />
        <Box
          sx={{ display: "flex", justifyContent: "center", p: 2, height: 150 }}
        >
          <img src={country.flags.png} alt={country.flags.alt} />
        </Box>

        <CardContent>
          <Typography variant="body2">
            The country belongs to <HighlightedText content={country.region} />{" "}
            region and <HighlightedText content={country.subregion} />{" "}
            sub-region. Located at the{" "}
            <HighlightedText content={country.latlng[0]} /> {"\u00b0N"} and{" "}
            <HighlightedText content={country.latlng[1]} /> {"\u00b0W"}, this
            country has population of{" "}
            <HighlightedText content={country.population} /> and it has{" "}
            {!country.independent && "not"} gained independency, according to
            the CIA World Factbook.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={() => navigate(-1)}>
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={() =>
              window.open(country.maps.googleMaps)
            }
          >
            <LocationOnIcon />
          </IconButton>
          <ExpandMore expand={expanded} onClick={handleExpandClick}>
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent style={{ maxHeight: 200, overflow: "auto" }}>
            <Typography paragraph>Languages:</Typography>
            {country.languages && (
              <ul>
                {Object.values(country.languages).map((lang) => (
                  <li key={lang}>{lang}</li>
                ))}
              </ul>
            )}
            <Typography paragraph>Currencies:</Typography>
            {country.currencies && (
              <ul>
                {Object.values(country.currencies).map((currency) => {
                  return (
                    <li key={currency.name}>
                      {currency.name} ({currency.symbol})
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Collapse>
      </Card>
    </Modal>
  )
}

export default CountryDetails
