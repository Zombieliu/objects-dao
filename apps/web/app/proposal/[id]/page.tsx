'use client';

import { Button } from '@repo/ui/components/ui/button';
import React, { useState, useEffect } from 'react';
import { NETWORK, OBJECT_ADDRESS, PACKAGE_ID } from '../../chain/config';
import { Obelisk, loadMetadata, Types } from '@0xobelisk/aptos-client';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from 'sonner';

export default function Page({ params }: { params: { id: string } }) {
	const [voteOpen, setVoteOpen] = useState(false);
	const [executeOpen, setExecuteOpen] = useState(false);
	const [executedHash, setExecutedHash] = useState('');
	const [proposal, setProposal] = React.useState({
		name: '',
		description: '',
		start_timestamp: '',
		end_timestamp: '',
		approve_num: '',
		deny_num: '',
		creater: '',
		excuted_hash: '',
	});

	const { account, connected, network, wallet, signAndSubmitTransaction } =
		useWallet();
	useEffect(() => {
		const query_proposal = async (proposal_id: string) => {
			const metadata = await loadMetadata(NETWORK, PACKAGE_ID);

			const obelisk = new Obelisk({
				networkType: NETWORK,
				packageId: PACKAGE_ID,
				metadata: metadata,
			});
			const proposal: any[] = await obelisk.query.gov.get_proposal([
				proposal_id,
			]);
			console.log(proposal);
			setProposal(proposal[0]);
		};
		query_proposal(params.id);
	}, [proposal]);

	const handleVote = async voteChoise => {
		console.log('vote');
		const metadata = await loadMetadata(NETWORK, PACKAGE_ID);

		const obelisk = new Obelisk({
			networkType: NETWORK,
			packageId: PACKAGE_ID,
			metadata: metadata,
		});
		const f_payload = (await obelisk.tx.gov.vote(
			[OBJECT_ADDRESS, params.id, voteChoise], // params
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
		console.log(txDetail);
		console.log('-------- 2');

		setTimeout(async () => {}, 1000);
		setVoteOpen(false);
	};

	const handleExecute = async () => {
		console.log('vote');
		const metadata = await loadMetadata(NETWORK, PACKAGE_ID);

		const obelisk = new Obelisk({
			networkType: NETWORK,
			packageId: PACKAGE_ID,
			metadata: metadata,
		});
		const f_payload = (await obelisk.tx.gov.excuted_confirm(
			[params.id, executedHash], // params
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
		console.log(txDetail);
		console.log('-------- 2');

		setTimeout(async () => {}, 1000);
		setExecuteOpen(false);
	};
	const handleVoteOpen = () => {
		setVoteOpen(true);
	};

	const handleExecuteOpen = () => {
		setExecuteOpen(true);
	};

	const handleExecutedHash = (event: any) => {
		setExecutedHash(event.target.value);
	};

	const handleApprove = async () => {
		await handleVote(true);
	};

	const handleDeny = async () => {
		await handleVote(false);
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
	// return <h1>My Page {params.id}</h1>;
	// let a= proposal.start_timestamp
	// const start_time = new Date(a)
	console.log(proposal.start_timestamp);
	return (
		<>
			<main className="flex flex-col min-h-screen min-w-full mt-12">
				<div className="flex items-center justify-center">
					<div className="w-1/2 h-auto">
						<h4 className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-400 mb-2">
							# {params.id}
						</h4>
						<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
							{proposal.name}
						</h1>
						<p className="leading-7 [&:not(:first-child)]:mt-6 mb-2">
							created by {proposal.creater}
						</p>
						<p className="leading-7 [&:not(:first-child)]:mt-6 mb-2">
							yes {proposal.approve_num} / no {proposal.deny_num}
						</p>
						<p className="leading-7 [&:not(:first-child)]:mt-6 mb-2">
							Description: {proposal.description}
						</p>
						<p className="leading-7 [&:not(:first-child)]:mt-6 mb-2">
							Start Time:{' '}
							{new Date(
								Number(proposal.start_timestamp)
							).toUTCString()}
						</p>
						<p className="leading-7 [&:not(:first-child)]:mt-6 mb-2">
							End time:{' '}
							{new Date(
								Number(proposal.end_timestamp)
							).toUTCString()}
						</p>
						{proposal.excuted_hash !== '' ? (
							<p className="leading-7 [&:not(:first-child)]:mt-6 mb-2">
								Excuted Hash: {proposal.excuted_hash}
							</p>
						) : (
							<></>
						)}
					</div>
					{handleResult(
						Number(proposal.start_timestamp),
						Number(proposal.end_timestamp),
						Number(proposal.approve_num),
						Number(proposal.deny_num)
					) === 'PASSED' ? (
						<Dialog
							open={executeOpen}
							onOpenChange={setExecuteOpen}
						>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									className="mb-2"
									onClick={handleExecuteOpen}
								>
									Upload hash
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>
										Upload executed hash
									</DialogTitle>
									<DialogDescription>
										Please upload executed hash after this
										proposal is passed.
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label
											htmlFor="username"
											className="text-right"
										>
											Hash
										</Label>
										<Input
											id="title"
											className="col-span-3"
											value={executedHash}
											onChange={e =>
												handleExecutedHash(e)
											}
										/>
									</div>

									<DialogFooter>
										<Button
											type="submit"
											onClick={handleExecute}
										>
											Submit
										</Button>
									</DialogFooter>
								</div>
							</DialogContent>
						</Dialog>
					) : handleResult(
							Number(proposal.start_timestamp),
							Number(proposal.end_timestamp),
							Number(proposal.approve_num),
							Number(proposal.deny_num)
					  ) === 'PROCESSING' ? (
						<Dialog open={voteOpen} onOpenChange={setVoteOpen}>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									className="mb-2"
									onClick={handleVoteOpen}
								>
									Vote
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Vote proposal</DialogTitle>
									<DialogDescription>
										Choise yes/no to this proposal
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
										<Button
											className="bg-green-500"
											type="submit"
											onClick={handleApprove}
										>
											Approve
										</Button>

										<Button
											className="bg-red-500"
											type="submit"
											onClick={handleDeny}
										>
											Deny
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					) : (
						<></>
					)}
				</div>
			</main>
		</>
	);
}
