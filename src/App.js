import { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { initializeCountries } from "./reducers/countryReducer"
import Countries from "./components/Countries"
import Country from "./components/Country"
import Loading from "./components/Loading"

const App = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const background = location.state && location.state.background

  useEffect(() => {
    dispatch(initializeCountries())
  }, [dispatch])

  const loading = useSelector((state) => state.countries).length === 0

  if (loading) return <Loading />

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Countries />}>
          <Route path=":name" element={<Country />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="/:name" element={<Country />} />
        </Routes>
      )}
    </>
  )
}

export default App
