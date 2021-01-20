import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlogHandler }) => {
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
    setTitle('')
    setAuthor('')
    setUrl('')
    addBlogHandler(blogObject)
  }

  return (
    <form onSubmit={addBlog}>
      <div>title: <input value={title} onChange={({ target }) => setTitle(target.value)} id='title'/></div>
      <div>author: <input value={author} onChange={({ target }) => setAuthor(target.value)} id='author' /></div>
      <div>url: <input value={url} onChange={({ target }) => setUrl(target.value)} id='url' /></div>
      <button type="submit">create</button>
    </form>
  )}

BlogForm.propTypes = {
  addBlogHandler: PropTypes.func.isRequired
}

export default BlogForm
