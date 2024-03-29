'use client';

import React from 'react';
import { Content } from './components/content';
import { AuctionActivity } from './components/auctionactivity';
import {Introduction} from "./components/introduction";

export default function Page() {
	return (
		<main className="flex flex-col min-h-screen min-w-full">
			<AuctionActivity />
			<Introduction/>
			<div className="bg-slate-100 ">
				<Content/>
			</div>

		</main>
	);
}
