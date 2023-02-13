import axios from "axios"

const baseUrl = "https://restcountries.com"

const getAll = async () => {
  const response = await axios.get(`${baseUrl}/v3.1/all`)
  return response.data
}

const getByName = async (name) => {
  const response = await axios.get(`${baseUrl}/v3.1/name/${name}`)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, getByName }
