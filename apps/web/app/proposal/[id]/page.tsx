'use client';

import { Button } from '@repo/ui/components/ui/button';
import React, { useState, useEffect } from 'react';
import { NETWORK, OBJECT_ADDRESS, PACKAGE_ID } from '../../chain/config';
import { Obelisk, loadMetadata, Types } from '@0xobelisk/aptos-client';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from 'sonner';

export default function Page({ params }: { params: { id: string } }) {
	const [open, setOpen] = useState(false);
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
			[
				OBJECT_ADDRESS,
				params.id,
				voteChoise,
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
		console.log(txDetail);
		console.log('-------- 2');

		setTimeout(async () => {}, 1000);
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleApprove = async () => {
		await handleVote(true);
	};

	const handleDeny = async () => {
		await handleVote(false);
	};
	// return <h1>My Page {params.id}</h1>;
	// let a= proposal.start_timestamp
	// const start_time = new Date(a)
	console.log(proposal.start_timestamp)
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
							{proposal.description}
						</p>
						<p className="leading-7 [&:not(:first-child)]:mt-6 mb-2">
							{new Date(Number(proposal.start_timestamp)).toUTCString()}
						</p>
						<p className="leading-7 [&:not(:first-child)]:mt-6 mb-2">
							{new Date(Number(proposal.end_timestamp)).toUTCString()}
						</p>
					</div>

					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button
								variant="outline"
								className="mb-2"
								onClick={handleOpen}
							>
								Vote
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Propose your proposal</DialogTitle>
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
				</div>
			</main>
		</>
	);
}
