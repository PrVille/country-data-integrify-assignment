import { createSlice } from "@reduxjs/toolkit"
import countriesService from "../services/countries"

const countrySlice = createSlice({
  name: "countries",
  initialState: [],
  reducers: {
    setCountries(state, action) {
      return action.payload
    },
  },
})

const { setCountries } = countrySlice.actions

// ACTIONS

export const initializeCountries = () => {
  return async (dispatch) => {
    const countries = await countriesService.getAll()
    dispatch(setCountries(countries))
  }
}

// SELECTORS

export const selectCountries = (state) => state.countries

export default countrySlice.reducer
