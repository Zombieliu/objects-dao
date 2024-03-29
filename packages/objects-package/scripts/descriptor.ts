import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { bgcolors, palette, images } from '../files/image-data.json';


import {chunkArray} from "./utils";
// const { execSync } = require('child_process');

const main =  async () =>{

  const {bodies, mouths, decoration, masks} = images;

  // console.log(chunkArray(mouths, 10).map(chunk =>
  //   chunk.map(({ data }) => data),
  // ))
  const package_address = '0x5681df2356f48c1c29bc28151d83cc179a600de2fc63524f5ec8f6a5a4b864ee'

  const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
  const keypair = Ed25519Keypair.fromSecretKey(Buffer.from("0bc2bd8d2135c9c0ea18d56cb0b021788e79c7fdf3435c455a049ee92c532a57", 'hex'))
  const txb = new TransactionBlock();
  // 1sui
  txb.setGasBudget(1000000000)


  const descriptor = txb.pure('0xe8432e43ab5f226c4ef66730c79312935f79b1afa1e87640af7df175624122d9')


  txb.moveCall(
    {
      target:`${package_address}::descriptor::addColorsToPalette`,
      arguments: [txb.pure(0),txb.pure(palette),descriptor],
    }
  )

  txb.moveCall(
    {
      target:`${package_address}::descriptor::addManyBackgrounds`,
      arguments: [txb.pure(bgcolors),descriptor],
    }
  )

  txb.moveCall(
    {
      target:`${package_address}::descriptor::addManyBodies`,
      arguments: [txb.pure(bodies.map(({ data }) => data)),descriptor],
    }
  )


  txb.moveCall(
    {
      target:`${package_address}::descriptor::addManyMouths`,
      arguments: [txb.pure(mouths.map(({ data }) => data)),descriptor],
    }
  )

  // chunkArray(mouths, 10).map(chunk =>
  //   txb.moveCall(
  //     {
  //       target:`${package_address}::descriptor::addManyAccessories`,
  //       arguments: [txb.pure(chunk.map(({ data }) => data)),descriptor],
  //     }
  //   ),
  // )


  txb.moveCall(
    {
      target:`${package_address}::descriptor::addManyDecorations`,
      arguments: [txb.pure(decoration.map(({ data }) => data)),descriptor],
    }
  )


  // chunkArray(decoration, 10).map(chunk =>
  //   txb.moveCall(
  //     {
  //       target:`${package_address}::descriptor::addManyHeads`,
  //       arguments: [txb.pure(chunk.map(({ data }) => data)),descriptor],
  //     }
  //   )
  // )

  txb.moveCall(
    {
      target:`${package_address}::descriptor::addManyMasks`,
      arguments: [txb.pure(masks.map(({ data }) => data)),descriptor],
    }
  )

  const result = await suiClient.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    signer: keypair,
    requestType: 'WaitForLocalExecution',
    options: {
      showEffects: true,
    },
  });
  console.log(result)

}

main();
