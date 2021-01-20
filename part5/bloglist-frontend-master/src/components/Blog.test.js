import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent  } from '@testing-library/react'
import Blog from './Blog'


describe('<Blog />', () => {
  let component
  let addLikeMock
  let removeBlogMock
  const user = {
    username:'username',
    name:'name'
  }
  const blog = {
    author: 'author',
    title: 'title',
    url: 'url',
    likes: 2,
    user
  }

  beforeEach(() => {
    addLikeMock = jest.fn()
    removeBlogMock = jest.fn()
    component = render(
      <Blog blog={blog} user={user}  addLikeHandler={addLikeMock} removeBlogHandler={removeBlogMock} />
    )
  })

  test('shows title and author', () => {
    expect(component.container).toHaveTextContent(
      blog.title
    )
    expect(component.container).toHaveTextContent(
      blog.author
    )
  })

  test('shows details when "view" button is pressed', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    expect(component.container).toHaveTextContent(
      blog.title
    )
    expect(component.container).toHaveTextContent(
      blog.author
    )
    expect(component.container).toHaveTextContent(
      `likes ${blog.likes}`
    )
    expect(component.container).toHaveTextContent(
      blog.user.name
    )
  })

  test('like button press works', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(addLikeMock.mock.calls.length).toBe(2)
  })
})