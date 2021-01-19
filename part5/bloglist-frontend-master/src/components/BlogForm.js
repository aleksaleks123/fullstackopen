import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({ blogs, setBlogs, setMessage, toggleBlogForm }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url
    }

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
    setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    toggleBlogForm()
  }

  return (
    <form onSubmit={addBlog}>
      <div>title: <input value={title} onChange={({ target }) => setTitle(target.value)} /></div>
      <div>author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
      <div>url: <input value={url} onChange={({ target }) => setUrl(target.value)} /></div>
      <button type="submit">create</button>
    </form>
  )}

BlogForm.propTypes = {
  blogs: PropTypes.array.isRequired,
  setBlogs: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  toggleBlogForm: PropTypes.func.isRequired
}

export default BlogForm
