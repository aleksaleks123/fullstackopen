const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, curr) => acc + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.length ? blogs.reduce((acc, curr) => curr.likes > acc.likes ? curr : acc) : null
}

const mostBlogs = (blogs) => {
    const authBlogs = Object.entries(_.groupBy(blogs, 'author')).map(([auth, vals]) => { return { author: auth, blogs: vals.length } })
    return authBlogs.length ? authBlogs.reduce((acc, curr) => curr.blogs > acc.blogs ? curr : acc) : null
}

const mostLikes = (blogs) => {
    const authBlogs = Object.entries(_.groupBy(blogs, 'author')).map(([auth, vals]) => { return { author: auth, likes: totalLikes(vals) } })
    return authBlogs.length ? authBlogs.reduce((acc, curr) => curr.likes > acc.likes ? curr : acc) : null
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}