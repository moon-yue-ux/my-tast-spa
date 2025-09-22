/// <reference types="cypress" />
describe('个人中心页面', () => {
  it('应该显示钱包地址', () => {
    cy.visit('http://localhost:3000/profile')
    cy.contains('个人中心')
    cy.contains('地址')
  })
})

