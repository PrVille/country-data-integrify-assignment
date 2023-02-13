import { useState, useEffect } from "react"
import countriesService from "../services/countries"

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (name) {
      countriesService
        .getByName(name)
        .then((response) => setCountry(response[0]))
    }
  }, [name])

  return country
}

export default useCountry
