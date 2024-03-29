"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";

const summary = [
  // {
  //   content:
  //     "Objects Network is in the [public domain](https://creativecommons.org/publicdomain/zero/1.0/)",
  // },
  {
    content: "One Object is trustlessly auctioned every 15 mins, forever",
  },
  {
    content:
      "100% of Object auction proceeds are trustlessly sent to the treasury",
  },
  {
    content: "Settlement of one auction kicks off the next.",
  },
  {
    content: "All Objects are members of Objects DAO.",
  },
  {
    content: "Objects Dao uses Obelisk Engine As Development and commercialization framework",
  },
  {
    content: "One Object is equal to one vote.",
  },
  {
    content:
      "The treasury is controlled exclusively by Objects via governance.",
  },
  {
    content:
      "Artwork is generative and stored directly  100% on-chain  (not IPFS).",
  },
  {
    content:
      "No explicit rules exist for attribute scarcity; all Objects are equally rare.",
  },
  {
    content:
      "Objectors receive rewards in Objects (10% of supply for the first 5 years).",
  },
];

const daily_auctions = [
  {
    content:"he Objects Auction Contract will act as a self-sufficient Object\n" +
        "            generation and distribution mechanism, auctioning one Object every 1\n" +
        "            hour, forever. 100% of auction proceeds (Object &&APT) are\n" +
        "            automatically deposited in the Objects DAO treasury, where they are\n" +
        "            governed by Object owners."

  },
  {
    content:
        "No explicit rules exist for attribute scarcity; all Objects are equally rare.",
  },
  {
    content:
        " While settlement is most heavily incentivized for the winning\n" +
        "            bidder, it can be triggered by anyone, allowing the system to\n" +
        "            trustlessly auction Objects as long as Sui is operational and there\n" +
        "            are interested bidders",
  },
]

export const Content = () => {
  return (
    // <div className='flex justify-center'>
    <Accordion type="single" collapsible className="px-48">
      <AccordionItem value="item-1">
        <AccordionTrigger>Summary?</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc">
            {summary.map((summary) => {
              return (
                <li key={summary.content} className="text-sm font-medium px-4">
                  {summary.content}
                </li>
              );
            })}
            {/*<li className="text-sm font-medium px-4">*/}
            {/*  "No explicit rules exist for attribute scarcity; all Objects are equally rare.",*/}
            {/*</li>*/}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Daily Auctions?</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc">
            {daily_auctions.map((daily_auctions) => {
              return (
                  <li key={daily_auctions.content} className="text-sm font-medium px-4">
                    {daily_auctions.content}
                  </li>
              );
            })}
            {/*<li className="text-sm font-medium px-4">*/}
            {/*  "No explicit rules exist for attribute scarcity; all Objects are equally rare.",*/}
            {/*</li>*/}
          </ul>
          {/*<p>*/}
          {/*  The Objects Auction Contract will act as a self-sufficient Object*/}
          {/*  generation and distribution mechanism, auctioning one Object every 1*/}
          {/*  hour, forever. 100% of auction proceeds (Object &&APT) are*/}
          {/*  automatically deposited in the Objects DAO treasury, where they are*/}
          {/*  governed by Object owners.*/}
          {/*</p>*/}
          {/*<p>*/}
          {/*  Each time an auction is settled, the settlement transaction will*/}
          {/*  also cause a new Object to be minted and a new 1 hour auction to*/}
          {/*  begin*/}
          {/*</p>*/}
          {/*<p>*/}
          {/*  While settlement is most heavily incentivized for the winning*/}
          {/*  bidder, it can be triggered by anyone, allowing the system to*/}
          {/*  trustlessly auction Objects as long as Sui is operational and there*/}
          {/*  are interested bidders*/}
          {/*</p>*/}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Objects DAO?</AccordionTrigger>
        <AccordionContent>
          Objects DAO utilizes a fork of Compound Governance and is the main
          governing body of the Objects ecosystem. The Objects DAO treasury
          receives 100% of OBJ proceeds from daily Object auctions. Each Object
          is an irrevocable member of Objects DAO and entitled to one vote in
          all governance matters. Object votes are non-transferable (if you sell
          your Object the vote goes with it) but delegatable, which means you
          can assign your vote to someone else as long as you own your Object.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Governance ‘Slow Start’</AccordionTrigger>
        <AccordionContent>
          **The proposal veto right was initially envisioned as a temporary
          solution to the problem of ‘51% attacks’ on the Objects DAO treasury.
          While Objecters initially believed that a healthy distribution of
          Objects would be sufficient protection for the DAO, a more complete
          understanding of the incentives and risks has led to consensus within
          the Objecters, the Objects Foundation, and the wider community that a
          more robust game-theoretic solution should be implemented before the
          right is removed.** **The Objects community has undertaken a
          preliminary exploration of proposal veto alternatives (‘rage quit’
          etc.), but it is now clear that this is a difficult problem that will
          require significantly more research, development and testing before a
          satisfactory solution can be implemented.** **Consequently, the
          Objects Foundation anticipates being the steward of the veto power
          until Objects DAO is ready to implement an alternative, and therefore
          wishes to clarify the conditions under which it would exercise this
          power.** **The Objects Foundation considers the veto an emergency
          power that should not be exercised in the normal course of business.
          The Objects Foundation will veto proposals that introduce non-trivial
          legal or existential risks to the Objects DAO or the Objects
          Foundation, including (but not necessarily limited to) proposals
          that:** **unequally withdraw the treasury for personal gain voters to
          facilitate withdraws of the treasury for personal gain attempt to
          alter Object auction cadence to maintain or acquire a voting majority
          make upgrades to critical smart contracts without undergoing an
          audit** **There are unfortunately no algorithmic solutions for making
          these determinations in advance (if there were, the veto would not be
          required), and proposals must be considered on a case-by-case basis.**
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>Object Traits</AccordionTrigger>
        <AccordionContent>
          **Objects are generated randomly based on Aptos randomness. There are
          no 'if' statements or other rules governing Object trait scarcity,
          which makes all Objects equally rare. As of this writing, Objects are
          made up of:** **backgrounds (2)bodies (30)accessories (140)heads
          (242)glasses (23)** **You can experiment with off-chain Object
          generation at the** **[Playground](http://localhost:3000/playground)**
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger>On-Chain Artwork</AccordionTrigger>
        <AccordionContent>
          **Objects are stored directly on Aptos and do not utilize pointers to
          other networks such as IPFS. This is possible because Object parts are
          compressed and stored on-chain using a custom run-length encoding
          (RLE), which is a form of lossless compression.** **The compressed
          parts are efficiently converted into a single base64 encoded SVG image
          on-chain. To accomplish this, each part is decoded into an
          intermediate format before being converted into a series of SVG
          reactions using batched, on-chain string concatenation. Once the
          entire SVG has been generated, it is base64 encoded.**
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-7">
        <AccordionTrigger>Object Seeder Contract</AccordionTrigger>
        <AccordionContent>
          **The Object Seeder contract is used to determine Object traits during
          the minting process. The seeder contract can be replaced to allow for
          future trait generation algorithm upgrades. Additionally, it can be
          locked by the Objects DAO to prevent any future updates. Currently,
          Object traits are determined using pseudo-random number generation:**
          ``` keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))
          ``` **Trait generation is not truly random. Traits can be predicted
          when minting a Object on the pending block.**
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-8">
        <AccordionTrigger>Objecter's Reward</AccordionTrigger>
        <AccordionContent>
          **'Objecters' are the group of ten builders that initiated Object.
          Here are the Objecters:**
          **[@](https://twitter.com/cryptoseneca)web3henry** **Because 100% of
          Object auction proceeds are sent to Objects DAO, Objecters have chosen
          to compensate themselves with Objects. Every 10th Object for the first
          5 years of the project (Object ids #0, #10, #20, #30, and so on) will
          be automatically sent to the Objecter's multisig to be vested and
          shared among the founding members of the project.** **Objecter
          distributions don't interfere with the cadence of 1-hour auctions.
          Objects are sent directly to the Objecter's Multisig, and auctions
          continue on schedule with the next available Object ID.**
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    // </div>
  );
};
