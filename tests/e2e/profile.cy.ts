/// <reference types="cypress" />
describe('个人中心页面', () => {
  it('应该显示钱包地址', () => {
    cy.mockWallet({ address: '0xFF9631A8cE372406bB9EdD5E72cE65Df5A437624', chainId: 11155111 });
    cy.visit('/profile');                  // baseUrl 已在 cypress.config.ts 里设为 http://localhost:3000
    cy.contains('个人中心');
    cy.contains('地址');
    cy.contains(/^0xFF96/i);               // 前缀断言更稳
  });
});
