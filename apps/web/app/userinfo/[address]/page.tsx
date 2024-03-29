'use client';

import { useQuery } from 'graphql-hooks';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Skeleton } from '@ui/components/ui/skeleton';

import { NETWORK, PACKAGE_ID } from '../../chain/config';
import { Obelisk, loadMetadata, Types } from '@0xobelisk/aptos-client';

const files = [
	{
		title: 'IMG_4985.HEIC',
		size: '3.9 MB',
		source: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
	},
];

export default function Page({ params }: { params: { address: string } }) {
	const router = useRouter();
	const [objectAddresses, setObjectAddresses] = useState([]);
	const [objectNFTs, setObjectNFTs] = useState([]);

	const { account, connected, network, wallet, signAndSubmitTransaction } =
		useWallet();
	const proposalInfo = {
		title: 'hello',
		description: 'hello world',
		period: 'voting',
		vote_start_time: '',
		submit_timestamp: '',
		vote_end_time: '',
	};

	const CURRENT_OBJECTS_QUERY = `query ObjectQuery {
            current_objects (where: {
              owner_address: {
                _eq: "${params.address}"
              }
            }) {
                allow_ungated_transfer
                is_deleted
                last_guid_creation_num
                last_transaction_version
                object_address
                owner_address
                state_key_hash
            }
          }
          `;
	const {
		loading: objectLoading,
		error: objectError,
		data: objectData,
	} = useQuery(CURRENT_OBJECTS_QUERY);
	// setObjectAddresses(objectData?.current_objects);

	const check_object = name => {
		console.log(name);
		// window.open()
	};

	useEffect(() => {
		if (objectData === undefined) return;

		const handleQueryNFT = async (current_objects: any[]) => {
			const metadata = await loadMetadata(NETWORK, PACKAGE_ID);

			const obelisk = new Obelisk({
				networkType: NETWORK,
				packageId: PACKAGE_ID,
				metadata: metadata,
			});

			// const nftPromises = current_objects.map(async current_object => {
			// 	const nft_res = {
			// 		name: '',
			// 		uri: '',
			// 		isNft: false,
			// 	};
			// 	try {
			// 		const nft_svg: any[] =
			// 			await obelisk.query.token.view_token_svg([
			// 				current_object.object_address,
			// 			]);
			// 		console.log(nft_svg);
			// 		nft_res.name = nft_svg[0].name;
			// 		nft_res.uri = nft_svg[0].uri;
			// 		nft_res.isNft = true;
			// 	} catch {}
			// 	return nft_res;
			// });
			let nftLists = [];
			for (let i = 0; i < current_objects.length; i++) {
				const current_object = current_objects[i];
				let nft_res = {
					name: '',
					uri: '',
				};
				try {
					const nft_svg: any[] =
						await obelisk.query.token.view_token_svg([
							current_object.object_address,
						]);
					console.log(nft_svg);
					nft_res.name = nft_svg[0].name;
					nft_res.uri = nft_svg[0].uri;
					nftLists.push(nft_res);
				} catch (error) {
					// 处理异常情况，例如记录错误日志
					console.error('Error fetching NFT:', error);
				}
			}

			setObjectNFTs(nftLists);
		};

		// handleQueryNFT(objectData.current_objects);

		handleQueryNFT(objectData.current_objects);
	}, [objectData]);

	// {
	// 	objectData.current_objects.map(async current_object => {
	// 		const res = await handleQueryNFT(current_object.object_address);
	// 		if (res.isNft === true) {
	// 			return (
	// 				<div key={current_object.object_address}>
	// 					<p>Name: {res.name}</p>
	// 					<p>URI: {res.uri}</p>
	// 					{/* 如果您需要显示 SVG 图像，可以在这里添加相应的代码 */}
	// 				</div>
	// 			);
	// 		} else {
	// 			return null; // 如果不是 NFT，返回 null 或者其他相应的内容
	// 		}
	// 	});
	// }

	console.log(objectData);
	// return <h1>My Page {params.id}</h1>;
	if (!objectLoading && !connected) {
		return (
			<>
				<main className="flex flex-col min-h-screen min-w-full mt-12">
					<div className="flex items-center justify-center">
						<div className="w-1/2 h-auto ">
							<div className="flex flex-col space-y-3">
								<Skeleton className="h-[94px] w-[134px] rounded-xl" />
								<div className="space-y-2">
									<Skeleton className="h-[20px] w-[134px]" />
								</div>
							</div>
						</div>
					</div>
				</main>
			</>
		);
	} else {
		if (objectData === undefined) {
			return (
				<>
					<main className="flex flex-col min-h-screen min-w-full mt-12">
						<div className="flex items-center justify-center">
							<div className="w-1/2 h-auto ">
								<div className="flex flex-col space-y-3">
									<Skeleton className="h-[94px] w-[134px] rounded-xl" />
									<div className="space-y-2">
										<Skeleton className="h-[20px] w-[134px]" />
									</div>
								</div>
							</div>
						</div>
					</main>
				</>
			);
		} else {
			return (
				<>
					<main className="flex flex-col min-h-screen min-w-full mt-12">
						<div className="flex items-center justify-center">
							<div className="w-1/2 h-auto ">
								<ul
									role="list"
									className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
								>
									{objectNFTs.map(objectNFT => (
										<li
											key={objectNFT.name}
											className="relative"
										>
											<div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
												<img
													src={`data:image/svg+xml;base64,${objectNFT.uri}`}
													alt="Base64 Image"
													// className="h-[320px] w-[320px] rounded-xl"

													className="pointer-events-none object-cover group-hover:opacity-75"
												/>
												<button
													type="button"
													onClick={() =>
														check_object(
															objectNFT.name
														)
													}
													className="absolute inset-0 focus:outline-none"
												>
													<span className="sr-only">
														View details for{' '}
														{objectNFT.name}
													</span>
												</button>
											</div>
											<p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
												{objectNFT.name}
											</p>
										</li>
									))}
								</ul>
							</div>
						</div>
					</main>
				</>
			);
		}
	}
}
