import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const logoutHandle = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setMessage(null)
    setUser(null)
  }
  const toggleBlogForm = () => {
    blogFormRef.current.toggleVisibility()
  }

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    toggleBlogForm()
  }
  const addLike = async(id, blogObject) => {
    const returnedBlog = await blogService.update(id, blogObject)
    setMessage(`blog ${returnedBlog.title} by ${returnedBlog.author} liked`)
    setBlogs(blogs.map(bl => bl.id !== id ? bl : returnedBlog))
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const removeBlog = async(blog) => {
    await blogService.remove(blog.id)
    setMessage(`blog ${blog.title} by ${blog.author} removed`)
    setBlogs(blogs.filter(bl => bl.id !== blog.id))
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} error={true}/>
        <LoginForm setErrorMessage={setMessage} setUser={setUser} />
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in <button onClick={logoutHandle}>logout</button></p>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm addBlogHandler={addBlog} />
      </Togglable>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} addLikeHandler={addLike} removeBlogHandler={removeBlog} />
      )}
    </div>
  )

}

export default App