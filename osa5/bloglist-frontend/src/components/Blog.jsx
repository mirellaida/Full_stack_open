import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
   paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    try {
      const updatedBlog = {
      likes: likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

  const returnedBlog = await blogService.update(blog.id || blog._id, updatedBlog)
    setLikes(returnedBlog.likes)
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const handleDelete = () => {
    if(window.confirm(`Remove this blog ${blog.title} by ${blog.author}`)){
      deleteBlog(blog.id)
    }
  }

  const showDelete = user && blog.user && (blog.user.id === user.id || blog.user._id === user.id)

   return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.username || 'Ei tiedossa'}</div>

          {showDelete && (
            <button
              style={{ backgroundColor: 'red', color: 'white' }}
              onClick={handleDelete}
              id="remove-button"
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string
    })
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string
  }),
  deleteBlog: PropTypes.func.isRequired
}



export default Blog