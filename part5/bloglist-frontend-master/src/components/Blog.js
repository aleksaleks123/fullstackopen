import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, blogs, setMessage, user }) => {
  const [detailed, setDetailed] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const addLike = async(event) => {
    event.preventDefault()
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title:blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blog.id, blogObject)
    setMessage(`blog ${returnedBlog.title} by ${returnedBlog.author} liked`)
    setBlogs(blogs.map(bl => bl.id !== blog.id ? bl : returnedBlog))
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const removeBlog = async(event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      setMessage(`blog ${blog.title} by ${blog.author} removed`)
      setBlogs(blogs.filter(bl => bl.id !== blog.id))
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  if(detailed)
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={() => setDetailed(false)}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button onClick={addLike}>like</button></div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username && <button onClick={removeBlog}>remove</button>}
      </div>
    )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={() => setDetailed(true)}>view</button>
      </div>
    </div>
  )}

export default Blog
