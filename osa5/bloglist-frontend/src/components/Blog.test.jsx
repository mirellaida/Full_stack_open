import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('blogs title', () => {
  const blog = {
     title: 'Kakkublogi',
    author: 'Minä vain',
    url: 'http://example.com',
    likes: 4,
    user: {
      id: '123',
      username: 'root'
    }
  }
   const user = { id: '123' }

    const { container } = render(<Blog blog={blog} user={user} />)
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Kakkublogi'
  )
})