'use client';

import '@repo/ui/globals.css';
import { Inter } from 'next/font/google';
import React, { FC, ReactNode } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

import { Footer } from './components/footer';
import { Header } from './components/header';
import { GraphQLClient, ClientContext } from 'graphql-hooks';
import '@mysten/dapp-kit/dist/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from "@repo/ui/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();

const client = new GraphQLClient({
	url: 'https://api.testnet.aptoslabs.com/v1/graphql',
});

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const wallets = [new PetraWallet()];
	const autoConnect = true;
	return (
		<ClientContext.Provider value={client}>
			<AptosWalletAdapterProvider
				plugins={wallets}
				autoConnect={autoConnect}
				onError={error => {
					console.log('Custom error handling', error);
				}}
			>
				{children}
			</AptosWalletAdapterProvider>
		</ClientContext.Provider>
	);
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<html lang="en">
			<body className={inter.className}>
				<QueryClientProvider client={queryClient}>
					<WalletContextProvider>
						<Header />
						<Toaster />
						{children}
						<div className="bg-slate-100">
							<Footer />
						</div>
					</WalletContextProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}
