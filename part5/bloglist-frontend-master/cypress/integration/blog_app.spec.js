describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Peter',
      username: 'peter',
      password: '1234'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Log in to application')
  })

  it('user can log in', function() {
    cy.contains('login').click()
    cy.get('#username').type('peter')
    cy.get('#password').type('1234')
    cy.get('#login-button').click()

    cy.contains('Peter logged in')
  })

  it('login fails with wrong password', function() {
    cy.get('#username').type('peter')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')
    cy.get('html').should('not.contain', 'Peter logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'peter', password: '1234' })
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('title')
      cy.get('#author').type('author')
      cy.get('#url').type('url')

      cy.contains('create').click()
      cy.contains('a new blog title by author added')

      cy.contains('view').click()
      cy.contains('url')
      cy.contains('likes 0')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'title1', author: 'author1', url: 'url1' })
        cy.createBlog({ title: 'title2', author: 'author2', url: 'url2' })
        cy.createBlog({ title: 'title3', author: 'author3', url: 'url3' })
      })

      it('it can be liked', function () {
        cy.contains('title2 author2').parent().find('button').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })
      it('it can be deleted', function () {
        cy.contains('title2 author2').parent().find('button').click()
        cy.contains('likes 0')
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'title2 author2')
      })
      it('blogs are sorted by likes', function () {
        cy.get('.blog').then( blogs => {
          blogs
            .each((_i, el) => {
              let wrapped = cy.wrap(el)
              wrapped.find('button').click()
              for(let i = 0; i <= _i; i++){
                wrapped = cy.wrap(el)
                wrapped.find('.likeButton').click()
              }
            })
        })

        const likesArray = []
        cy.get('.likes').each($el =>
          likesArray.push(Number($el.text())))
        expect(likesArray.every((v,i,a) => !i || a[i-1] >= v)).to.be.true
      })
    })
  })
})