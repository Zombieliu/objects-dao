import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import {OBJECT} from "./package";


const main =  async () =>{


  const package_address = '0x5681df2356f48c1c29bc28151d83cc179a600de2fc63524f5ec8f6a5a4b864ee'

  const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
  const keypair = Ed25519Keypair.fromSecretKey(Buffer.from("0bc2bd8d2135c9c0ea18d56cb0b021788e79c7fdf3435c455a049ee92c532a57", 'hex'))
  const txb = new TransactionBlock();
  // 5sui
  txb.setGasBudget(5000000000)


  const descriptor = txb.pure('0xe8432e43ab5f226c4ef66730c79312935f79b1afa1e87640af7df175624122d9')


  txb.moveCall(
    {
      target:`${package_address}::objects_seeder::mint`,
      arguments: [
        txb.pure('0xb87c85983394eaa66572e8d0b4d51374d74cab6a04c26edc73b10df3f290a183'),
        txb.pure(0),
        txb.pure("0x6"),
        descriptor],
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
