import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import './wdyr.tsx';
import './style.css';
import App from '@/pages/App';
import { WagmiProvider } from 'wagmi'
import { config } from '@/config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// 创建查询客户端
const queryClient = new QueryClient()
// useEffect
// useCallback
// useMemo
// useTransition
// use
//状态撕裂

const container = document.getElementById('app');
if (!container) {
  throw new Error('Failed to find the root element');
}
const root = createRoot(container);

root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </WagmiProvider>
);
