// 声明类型（可选）
declare global {
  namespace Cypress {
    interface Chainable {
      mockWallet(opts?: { address?: string; chainId?: number }): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockWallet', (opts?: { address?: string; chainId?: number }) => {
  const address = opts?.address ?? '0xFF9631A8cE372406bB9EdD5E72cE65Df5A437624';
  const chainId = opts?.chainId ?? 11155111;            // Sepolia
  const chainIdHex = '0x' + chainId.toString(16);

  // 在应用加载前把 provider 注入到 window
  cy.on('window:before:load', (win) => {
    (win as any).ethereum = {
      isMetaMask: true,
      request: async ({ method }: { method: string; params?: unknown[] }) => {
        switch (method) {
          case 'eth_requestAccounts':
          case 'eth_accounts':
            return [address];
          case 'eth_chainId':
            return chainIdHex;
          default:
            // 其他 RPC 方法你用不到就返回空；需要的话再按需扩展
            return null;
        }
      },
      on() {},
      removeListener() {},
    };
  });
});
