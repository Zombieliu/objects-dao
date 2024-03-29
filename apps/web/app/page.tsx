'use client';
import { Content } from './components/content';
import { AuctionActivity } from './components/auctionactivity';

import React from 'react';

export default function Page() {
	return (
		<main className="flex flex-col min-h-screen min-w-full">
			<AuctionActivity />
			<div className="bg-slate-100 ">
				<Content/>
			</div>

		</main>
	);
}
