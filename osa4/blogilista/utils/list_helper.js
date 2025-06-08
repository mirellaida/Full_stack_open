const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}

  return blogs.reduce((prev, curr) => (curr.likes > prev.likes ? curr : prev))
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,

}