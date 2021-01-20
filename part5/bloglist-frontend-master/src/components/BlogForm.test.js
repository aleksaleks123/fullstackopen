import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const addBlogMock = jest.fn()

  const component = render(
    <BlogForm addBlogHandler={addBlogMock} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  const form = component.container.querySelector('form')

  fireEvent.change(title, { target: { value: 'title' } })
  fireEvent.change(author, { target: { value: 'author' } })
  fireEvent.change(url, { target: { value: 'url' } })

  fireEvent.submit(form)

  expect(addBlogMock.mock.calls.length).toBe(1)
  expect(addBlogMock.mock.calls[0][0]).toEqual({ title: 'title', author: 'author', url: 'url' } )
})