import { formatWalletAddress } from '@/utils/index';
describe('formatWalletAddress 函数测试', () => {
  // 测试数据
  const validAddress = '0x742d35Cc6634C0532925a3b8D45c7c8f8b9b8c5e';

  describe('基本功能测试', () => {
    test('应该正确格式化标准的以太坊地址（带0x前缀）', () => {
      const result = formatWalletAddress(validAddress);
      expect(result).toBe('0x742d35...8c5e');
    });
  });

  describe('前缀处理测试', () => {
    test('应该保留原有的0x前缀', () => {
      const withPrefix = '0x742d35Cc6634C0532925a3b8D45c7c8f8b9b8c5e';
      const result = formatWalletAddress(withPrefix);
      expect(result).toContain('0x');
      expect(result.startsWith('0x')).toBe(true);
    });
  });
});

