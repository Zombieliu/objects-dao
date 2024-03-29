import { WalletConnector } from '@aptos-labs/wallet-adapter-mui-design';
import { Button } from '@repo/ui/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React, { useEffect } from 'react';

import {NETWORK, PACKAGE_ID, TREASURE_ADDRESS, TREASURE_OBJECT_ADDRESS} from '../chain/config';
import { Obelisk, loadMetadata, Types } from '@0xobelisk/aptos-client';

export const Header = () => {
	const [treasuryBalance, setTreasuryBalance] = React.useState('0');
	const [treasuryObjectBalance, setTreasuryObjectBalance] =
		React.useState('0');
	const { account, connected, network, wallet, signAndSubmitTransaction } =
		useWallet();

	useEffect(() => {
		if (!connected) return;
		console.log('connected wallet name: ', wallet?.name);
		console.log('account address: ', account?.address);
		console.log('account publicKey: ', account?.publicKey);
	}, [connected]);

	useEffect(() => {
		const query_treasury_balance = async () => {
			const metadata = await loadMetadata(NETWORK, PACKAGE_ID);
			const obelisk = new Obelisk({
				networkType: NETWORK,
				packageId: PACKAGE_ID,
				metadata: metadata,
			});
			const balance = await obelisk.getBalance(
				TREASURE_ADDRESS
			);

			const objectBalance = await obelisk.getBalance(
				TREASURE_ADDRESS,
				TREASURE_OBJECT_ADDRESS
			);
			console.log(balance);
			console.log(objectBalance);
			setTreasuryBalance(balance.toString());
			setTreasuryObjectBalance(objectBalance.toString());
		};
		query_treasury_balance();
	}, [treasuryBalance]);

	function convertBalanceToCurrency(balance: number): string {
		const amount = balance / Math.pow(10, 8);
		const formattedAmount = amount.toFixed(2);
		return formattedAmount;
	}

	const address =
		'https://explorer.aptoslabs.com/account/0x50f3d59119e56d5a9496759dd86fa58dc8629c4ade3bb6dc3841085f5cc12ba4/coins?network=devnet';

	return (
		<div className="flex items-center justify-around bg-zinc-300 py-6">
			<div className="flex items-center">
				<div>
					<Link href="/">
						<Image
							src="/noggles.svg"
							width={80}
							height={80}
							alt="Picture of the author"
						/>
					</Link>
				</div>
				<div className="ml-5">
					<Link href={address} target="_blank">
						<Button
							variant="outline"
							className="font-bold bg-zinc-300 "
						>
							Treasury Ξ{' '}
							{`${convertBalanceToCurrency(Number(treasuryObjectBalance))} OBJ`}
						</Button>
					</Link>
				</div>

				<div className="ml-5">
					<Link href="/proposal">
						<Button
							variant="outline"
							className="font-bold bg-zinc-300 "
						>
							DAO
						</Button>
					</Link>
				</div>
				<div className="ml-5">
					<Link href={`/userinfo/${account?.address}`}>
						<Button
							variant="outline"
							className="font-bold bg-zinc-300 "
						>
							Space
						</Button>
					</Link>
				</div>
			</div>
			<div>
				{/* <ConnectButton /> */}
				<WalletConnector />
			</div>
		</div>
	);
};
