import React, { useState } from 'react'

const Blog = ({ addLikeHandler, removeBlogHandler, blog, user }) => {
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
      likes: blog.likes + 1,
      author: blog.author,
      title:blog.title,
      url: blog.url
    }
    addLikeHandler(blog.id, blogObject)
  }

  const removeBlog = async(event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogHandler(blog)
    }
  }

  if(detailed)
    return (
      <div className="blog" style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={() => setDetailed(false)}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>likes <span className="likes">{blog.likes}</span><button onClick={addLike} className="likeButton">like</button></div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username && <button onClick={removeBlog}>remove</button>}
      </div>
    )

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={() => setDetailed(true)}>view</button>
      </div>
    </div>
  )}

export default Blog
