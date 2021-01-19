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
      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <BlogForm blogs={blogs} setBlogs={setBlogs} setMessage={setMessage} toggleBlogForm={toggleBlogForm} />
      </Togglable>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} setBlogs={setBlogs} blogs={blogs} setMessage={setMessage} user={user} />
      )}
    </div>
  )

}

export default App