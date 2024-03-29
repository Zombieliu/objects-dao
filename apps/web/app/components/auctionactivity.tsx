import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { loadMetadata, Obelisk, Types } from '@0xobelisk/aptos-client';
import { NETWORK, PACKAGE_ID } from '../chain/config';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { ScrollArea } from '@ui/components/ui/scroll-area';
import {toast} from "sonner";

type BidListType = {
	bid_address: string;
	bid_price: string;
	bid_time: string;
};

type AuctionType = {
	amount: string;
	bid_list: BidListType[];
	end_time: string;
	object_address: string;
	payable_bidder: string;
	start_time: string;
};

export const AuctionActivity = () => {
	const [price, setPrice] = useState(0);
	const [bidding, setBidding] = useState();
	const [auction, setAuction] = useState<AuctionType>({
		amount: '',
		bid_list: [
			{
				bid_address: '',
				bid_price: '',
				bid_time: '',
			},
		],
		end_time: '',
		object_address: '',
		payable_bidder: '',
		start_time: '',
	});
	const [auctions, setAuctions] = useState<AuctionType[] | undefined>();
	const [NFTBase64, setNFTBase64] = useState({
		name: 'Object 0',
		uri: '',
	});
	const { account, connected, network, wallet, signAndSubmitTransaction } =
		useWallet();
	// const { mutate: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();

	useEffect(() => {
		const query_latest_auction = async () => {
			const metadata = await loadMetadata(NETWORK, PACKAGE_ID);

			const obelisk = new Obelisk({
				networkType: NETWORK,
				packageId: PACKAGE_ID,
				metadata: metadata,
			});
			const auctionData: any[] =
				await obelisk.query.objects_auctio.get_last_auction();
			console.log(auctionData);
			let nft_res = {
				name: 'Object 0',
				uri: '',
			};
			const nft_svg: any[] = await obelisk.query.token.view_token_svg([
				auctionData[0].object_address,
			]);
			console.log(nft_svg);
			nft_res.name = nft_svg[0].name;
			nft_res.uri = nft_svg[0].uri;
			setNFTBase64(nft_res);
			setAuction(auctionData[0]);

			// setBidding(
			// 	Number(
			// 		convertBalanceToCurrency(
			// 			Number(auctionData[0].amount) + 10000000
			// 		)
			// 	)
			// );
		};
		query_latest_auction();
	}, [auction]);

	// useEffect(() => {
	// 	const query_auctions = async () => {
	// 		const metadata = await loadMetadata(NETWORK, PACKAGE_ID);

	// 		const obelisk = new Obelisk({
	// 			networkType: NETWORK,
	// 			packageId: PACKAGE_ID,
	// 			metadata: metadata,
	// 		});
	// 		const auctionsData: any[] =
	// 			await obelisk.query.objects_auctio.get_all_auctions();
	// 		console.log(auctionsData);
	// 		setAuctions(auctionsData[0]);
	// 	};
	// 	query_auctions();
	// }, [auctions]);

	const handleAuction = async () => {
		const metadata = await loadMetadata(NETWORK, PACKAGE_ID);

		const obelisk = new Obelisk({
			networkType: NETWORK,
			packageId: PACKAGE_ID,
			metadata: metadata,
		});

		const f_payload = (await obelisk.tx.objects_auctio.create_bid(
			[Number(bidding) * 100000000], // params
			undefined, // typeArguments
			true
		)) as Types.EntryFunctionPayload;

		const payload: Types.TransactionPayload = {
			type: 'entry_function_payload',
			function: f_payload.function,
			type_arguments: f_payload.type_arguments,
			arguments: f_payload.arguments,
		};

		const txDetail = await signAndSubmitTransaction(payload);

		console.log("txDetail")
		console.log(txDetail)

		if (txDetail != undefined){
			toast('Translation Successful', {
				description: new Date().toUTCString(),
				action: {
					label: 'Check in Explorer ',
					onClick: () => {
						const hash = txDetail.hash;
						window.open(
							`https://explorer.aptoslabs.com/txn/${hash}?network=testnet`,
							'_blank'
						); // 在新页面中打开链接
						// router.push(`https://explorer.aptoslabs.com/txn/${tx}?network=devnet`)
					},
				},
			});
		}
	};

	const handleClaim = async () => {
		const metadata = await loadMetadata(NETWORK, PACKAGE_ID);

		const obelisk = new Obelisk({
			networkType: NETWORK,
			packageId: PACKAGE_ID,
			metadata: metadata,
		});

		const f_payload = (await obelisk.tx.objects_auctio.claim(
			[], // params
			undefined, // typeArguments
			true
		)) as Types.EntryFunctionPayload;

		const payload: Types.TransactionPayload = {
			type: 'entry_function_payload',
			function: f_payload.function,
			type_arguments: f_payload.type_arguments,
			arguments: f_payload.arguments,
		};

		const txDetail = await signAndSubmitTransaction(payload);

		if (txDetail != undefined){
			toast('Translation Successful', {
				description: new Date().toUTCString(),
				action: {
					label: 'Check in Explorer ',
					onClick: () => {
						const hash = txDetail.hash;
						window.open(
							`https://explorer.aptoslabs.com/txn/${hash}?network=testnet`,
							'_blank'
						); // 在新页面中打开链接
						// router.push(`https://explorer.aptoslabs.com/txn/${tx}?network=devnet`)
					},
				},
			});
		}

	};

	const handleClaimButton = (auction: AuctionType) => {
		const now = new Date();
		const endTime = new Date(Number(auction.end_time) * 1000);
		if (now > endTime) {
			return true; // should be claim
		}
		return false;
	};

	function convertBalanceToCurrency(balance: number): string {
		const amount = balance / Math.pow(10, 8);
		const formattedAmount = amount.toFixed(2);
		return formattedAmount;
	}

	function getTimeDifference(timestamp: number): string {
		const currentTime = Math.floor(Date.now() / 1000);

		if (currentTime >= timestamp) {
			const endDate = new Date(timestamp * 1000);
			const formattedEndDate = `${endDate.getMonth() + 1}/${endDate.getDate()} ${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
			return formattedEndDate;
		}

		const timeDifference = timestamp - currentTime;
		const days = Math.floor(timeDifference / (24 * 3600));
		const hours = Math.floor((timeDifference % (24 * 3600)) / 3600);
		const minutes = Math.floor((timeDifference % 3600) / 60);
		const seconds = timeDifference % 60;

		const formattedTime = `${days} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		return formattedTime;
	}

	function shortenHex(
		hexString: string,
		prefixLength: number = 6,
		suffixLength: number = 4
	): string {
		if (hexString.length <= prefixLength + suffixLength) {
			return hexString;
		}

		const prefix = hexString.substr(0, prefixLength);
		const suffix = hexString.substr(-suffixLength);
		return prefix + '...' + suffix;
	}

	const handleBidding = (event: any) => {
		setBidding(event.target.value);
	};

	return (
		<div className="flex items-center justify-center bg-zinc-300">
			<div>
				{NFTBase64.uri === '' ? (
					<Image
						src="/loading-skull-noun.gif"
						width={546}
						height={546}
						alt="Picture of the author"
					/>
				) : (
					<Image
						src={`data:image/svg+xml;base64,${NFTBase64.uri}`}
						width={546}
						height={546}
						alt="Picture of the author"
					/>
				)}
			</div>
			<div className="w-1/5 h-auto">
				<div className="">
					<div className="flex flex-col w-full">
						<div className="mb-20 text-5xl font-medium">
							{NFTBase64.name}
						</div>
						<div className="flex items-center justify-between">
							<div>
								<div>Current bid</div>
								<div className="text-3xl font-medium">
									Ξ{' '}
									{convertBalanceToCurrency(
										Number(auction.amount)
									)}
								</div>
							</div>
							<div>
								<div>Auction ends in</div>
								<div className="text-2xl font-medium">
									{getTimeDifference(
										Number(auction.end_time)
									)}
								</div>
							</div>
						</div>
					</div>
					{handleClaimButton(auction) === true ? (
						<div className="flex w-full max-w-sm items-center mt-20 space-x-2 ">
							<Button
								className="h-14 w-28 bg-green-500"
								onClick={handleClaim}
								type="submit"
							>
								Claim
							</Button>
						</div>
					) : (
						<div className="flex w-full max-w-sm items-center mt-20 space-x-2 ">
							<Input
								className="h-14"
								type="bidding"
								value={bidding}
								onChange={handleBidding}
								placeholder="Ξ 0.001 or more"
							/>
							<Button
								className="h-14 w-28"
								onClick={handleAuction}
								type="submit"
							>
								Place Bid
							</Button>
						</div>
					)}
					<div className="flex w-full max-w-sm items-center mt-2 space-x-2 ">
						<ScrollArea className="rounded-md border">
							<div className="p-4 bg-white">
								<h4 className="mb-4 text-sm font-medium leading-none">
									Bidding list
								</h4>
								{auction.bid_list.map(bidding_body => (
									<>
										<div
											key={bidding_body.bid_address}
											className="text-sm"
										>
											{shortenHex(
												bidding_body.bid_address
											)}{' '}
											Ξ{' '}
											{convertBalanceToCurrency(
												Number(bidding_body.bid_price)
											)}{' '}
											OBJ
										</div>
									</>
								))}
							</div>
						</ScrollArea>
					</div>
				</div>
			</div>
		</div>
	);
};
