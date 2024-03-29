'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import Link from 'next/link';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import {NETWORK, OBJECT_ADDRESS, PACKAGE_ID, TREASURE_ADDRESS, TREASURE_OBJECT_ADDRESS} from '../chain/config';
import { Obelisk, loadMetadata, Types } from '@0xobelisk/aptos-client';
import { Button } from '@repo/ui/components/ui/button';
import React, { useState, useEffect } from 'react';

import {
	DateTimePicker,
} from '../components/datetime-picker';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from 'sonner';

function Proposal() {
	// const router = useRouter();
	const [open, setOpen] = useState(false);
	const { account, connected, network, wallet, signAndSubmitTransaction } =
		useWallet();
	const [proposalTitle, setProposalTitle] = React.useState('');
	const [proposalDescription, setProposalDescription] = React.useState('');
	const [data, setData] = React.useState('200');
	const [startTimestamp, setStartTimestamp] = React.useState<{
		date: Date;
		hasTime: boolean;
	}>({
		date: new Date(),
		hasTime: true,
	});
	const [endTimestamp, setEndTimestamp] = React.useState<{
		date: Date;
		hasTime: boolean;
	}>({
		date: new Date(),
		hasTime: true,
	});
	const [proposals, setProposals] = React.useState([]);
	const [treasuryBalance, setTreasuryBalance] = React.useState('0');
	const [treasuryObjectBalance, setTreasuryObjectBalance] =
		React.useState('0');

	const timeZone = new Date().getTimezoneOffset() / -60;

	useEffect(() => {
		if (!connected) return;
		console.log('connected wallet name: ', wallet?.name);
		console.log('account address: ', account?.address);
		console.log('account publicKey: ', account?.publicKey);
	}, [connected]);

	useEffect(() => {
		const query_proposals = async () => {
			const metadata = await loadMetadata(NETWORK, PACKAGE_ID);

			const obelisk = new Obelisk({
				networkType: NETWORK,
				packageId: PACKAGE_ID,
				metadata: metadata,
			});
			const proposals: any[] =
				await obelisk.query.gov.get_all_proposals();
			console.log(proposals);
			setProposals(proposals[0]);
		};
		query_proposals();
	}, [proposals]);

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

	const handlePropose = async () => {
		console.log('propose');
		console.log(proposalTitle);
		console.log(proposalDescription);
		console.log(endTimestamp);
		console.log(endTimestamp.date);
		console.log(endTimestamp.date.getTime());

		const metadata = await loadMetadata(NETWORK, PACKAGE_ID);

		const obelisk = new Obelisk({
			networkType: NETWORK,
			packageId: PACKAGE_ID,
			metadata: metadata,
		});
		const f_payload = (await obelisk.tx.gov.propose(
			[
				[
					OBJECT_ADDRESS,
				],
				proposalTitle,
				proposalDescription,
				startTimestamp.date.getTime(),
				endTimestamp.date.getTime(),
			], // params
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
		console.log('-------- 1'); // TODO: add transaction hash alert
		console.log(txDetail.hash);
		console.log('-------- 2');

		setTimeout(async () => {}, 1000);
		setOpen(false);
	};

	const handleTitle = (event: any) => {
		setProposalTitle(event.target.value);
	};

	const handleDescription = (event: any) => {
		setProposalDescription(event.target.value);
	};

	const handleEndTime = (event: any) => {
		setEndTimestamp(event);
	};
	const handleOpen = () => {
		setOpen(true);
	};
	const handleStatusByVotingTime = (start_time: number, end_time: number) => {
		const startTime = new Date(start_time);
		const now = new Date();

		const endTime = new Date(end_time);
		if (startTime < now && now < endTime) {
			return 'Ongoing';
		}
		if (now > endTime) {
			return 'Closed';
		}
		return 'Pending';
	};

	const handleResult = (
		start_time: number,
		end_time: number,
		yes: number,
		no: number
	) => {
		const votingPeriod = handleStatusByVotingTime(start_time, end_time);

		if (votingPeriod === 'Closed') {
			if (yes > no) {
				return 'PASSED';
			} else {
				return 'REJECTED';
			}
		}
		return 'PROCESSING';
	};

	return (
		<>
			<main className="flex flex-col min-h-screen min-w-full mt-12">
				<div className="flex items-center justify-center">
					<div className="w-1/2 h-auto">
						<h4 className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-400 mb-2">
							Governance
						</h4>
						<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
							Objects DAO
						</h1>
						<p className="leading-7 [&:not(:first-child)]:mt-6 mb-2">
							Objects govern <strong>Objects DAO</strong>. Objects
							can vote on proposals or delegate their vote to a
							third party. A minimum of <strong>2 Objects</strong>{' '}
							is required to submit proposals.
						</p>
						<Card className="mb-12">
							<CardHeader>
								<CardTitle className="text-gray-400">
									Treasury
								</CardTitle>
								<CardDescription>
									This treasury exists for Objects DAO
									participants to allocate resources for the
									long-term growth and prosperity of the
									Objects project.
								</CardDescription>
							</CardHeader>
							<CardContent className="flex">
								<div className="text-2xl">
									Ξ{' '}
									{`${convertBalanceToCurrency(Number(treasuryObjectBalance))} OBJ + ${convertBalanceToCurrency(Number(treasuryBalance))} APT`}
								</div>{' '}
							</CardContent>
						</Card>

						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									className="mb-2"
									onClick={handleOpen}
								>
									Propose Proposal
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>
										Propose your proposal
									</DialogTitle>
									<DialogDescription>
										Make changes to your profile here. Click
										save when you're done.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									{/* <div className="grid grid-cols-4 items-center gap-4">
										<Label
											htmlFor="name"
											className="text-right"
										>
											Name
										</Label>
										<Input
											id="name"
											value="Pedro Duarte"
											className="col-span-3"
										/>
									</div> */}
									<div className="grid grid-cols-4 items-center gap-4">
										<Label
											htmlFor="username"
											className="text-right"
										>
											Title
										</Label>
										<Input
											id="title"
											className="col-span-3"
											value={proposalTitle}
											onChange={e => handleTitle(e)}
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label
											htmlFor="username"
											className="text-right"
										>
											Description
										</Label>
										<Input
											id="title"
											className="col-span-3"
											value={proposalDescription}
											onChange={e => handleDescription(e)}
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label
											htmlFor="username"
											className="text-right"
										>
											End Time
										</Label>
										<div className="space-y-3">
											<DateTimePicker
												value={endTimestamp}
												onChange={handleEndTime}
											/>
										</div>
									</div>
								</div>
								<DialogFooter>
									<Button
										type="submit"
										onClick={handlePropose}
									>
										Propose
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						{proposals.map((proposal, index) => {
							return (
								<Link href={`/proposal/${index}`}>
									<Card className="mb-4">
										<div className="flex p-4 justify-between bg-gray-100 hover:bg-white">
											<div className="justify-center items-center flex">
												<div className="text-gray-400 text-xl font-londrina-solid font-bold mr-2">
													{index}
												</div>
												<div className="text-xl font-londrina-solid font-bold">
													{proposal.name}
												</div>
												<div className="text-gray-400 text-2 font-londrina-solid font-bold mr-2 ml-2">
													{' ('}
													{
														proposal.approve_num
													} / {proposal.deny_num}
													{')'}
												</div>
											</div>
											<div className="flex justify-end">
												<div
													className={
														handleStatusByVotingTime(
															Number(
																proposal.start_timestamp
															),
															Number(
																proposal.end_timestamp
															)
														) == 'Ongoing'
															? 'text-blue-100 bg-green-400 text-white px-4 py-2 mr-2 rounded'
															: handleStatusByVotingTime(
																		Number(
																			proposal.start_timestamp
																		),
																		Number(
																			proposal.end_timestamp
																		)
																  ) == 'Pending'
																? 'bg-gray-300 text-gray-400 text-white px-4 py-2 mr-2 rounded'
																: 'bg-gray-300 text-gray-400 text-white px-4 py-2 mr-2 rounded'
													}
												>
													{handleStatusByVotingTime(
														Number(
															proposal.start_timestamp
														),
														Number(
															proposal.end_timestamp
														)
													)}
												</div>
												{handleResult(
													Number(
														proposal.start_timestamp
													),
													Number(
														proposal.end_timestamp
													),
													Number(
														proposal.approve_num
													),
													Number(proposal.deny_num)
												) === 'PASSED' ? (
													<div className="bg-green-500 text-white px-4 py-2 rounded">
														PASSED
													</div>
												) : handleResult(
														Number(
															proposal.start_timestamp
														),
														Number(
															proposal.end_timestamp
														),
														Number(
															proposal.approve_num
														),
														Number(
															proposal.deny_num
														)
												  ) === 'REJECTED' ? (
													<div className="bg-red-500 text-white px-4 py-2 rounded">
														REJECTED
													</div>
												) : (
													<div className="bg-blue-500 text-white px-4 py-2 rounded">
														PROCESSING
													</div>
												)}
											</div>
										</div>
									</Card>
								</Link>
							);
						})}
					</div>
				</div>
			</main>
		</>
	);
}

export default Proposal;
