import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/notification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggedUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    blogService.setToken(user.token)
  }
}, [])

useEffect(() => {
  if (user) {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }
}, [user])

const showNotification = (message, type = 'success') => {
  setNotification(message)
  setNotificationType(type)
  setTimeout(() => {
    setNotification(null)
  }, 5000)
}

  const addBlog = (blogObject) => {
    blogService.create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        showNotification(`A new blog '${returnedBlog.title}' by ${returnedBlog.author} added`, 'success')
      })
      .catch(() => {
        showNotification('Failed to add blog', 'error')
      })
  }

  const deleteBlog = async id => {
    await blogService.remove(id)
    setRefreshBlog(!refreshBlog)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong name or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
  window.localStorage.removeItem('loggedUser')
  setUser(null)
  blogService.setToken(null)
}

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification} type={notificationType} />
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      {!user && loginForm()}

      {user && (
        <div>
          <p>{user.username} logged in
            <button onClick={handleLogout} data-testid="logoutBtn">logout</button>
          </p>

          <BlogForm createBlog={addBlog} />

          <ul>
             {blogs
              .slice() 
              .sort((a, b) => b.likes - a.likes) 
              .map(blog =>
      <Blog key={blog.id} blog={blog} user={user} deleteBlog={deleteBlog} />
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
export default App
