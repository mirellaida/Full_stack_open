import axios from 'axios'
const baseUrl = 'http://localhost:3004/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const create = (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  return axios.post(baseUrl, newBlog).then(response => response.data)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}


const update = (id, updatedBlog) => {
  return axios.put(`${baseUrl}/${id}`, updatedBlog).then(response => response.data)
}

export default {
  getAll: getAll,
  create: create,
  setToken: setToken,
  update: update

}