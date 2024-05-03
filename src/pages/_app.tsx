import type { AppProps } from 'next/app';
import createLocalFont from 'next/font/local';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Head from 'next/head';

import { GlobalStyle } from '@/styles';
import { Layout } from '@/components';
import { ClientMapProvider, NaverMapProvider } from '@/states';

const localFont = createLocalFont({ src: '../styles/omyu pretty.ttf' });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>대똥여지도</title>
        <meta name="description" content="급하게 화장실이 필요할 때 화장실 찾아주는 도우미" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="대똥여지도" />
        <meta
          property="og:description"
          content="급하게 화장실이 필요할 때 화장실 찾아주는 도우미 "
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://daeddong-admin-front.store" />
        <meta property="og:image" content="http://daeddong-admin-front.store/thumbnail.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <main className={localFont.className}>
          <Layout>
            <NaverMapProvider>
              <ClientMapProvider>
                <Component {...pageProps} />
              </ClientMapProvider>
            </NaverMapProvider>
          </Layout>
        </main>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}
