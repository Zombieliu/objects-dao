import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
const { execSync } = require('child_process');
//
//
// const provider = new JsonRpcProvider();
//
const main =  async () =>{
  const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
  const keypair = Ed25519Keypair.fromSecretKey(Buffer.from("0bc2bd8d2135c9c0ea18d56cb0b021788e79c7fdf3435c455a049ee92c532a57", 'hex'))
  const { modules, dependencies } = JSON.parse(
    execSync(
      `sui move build --dump-bytecode-as-base64`,
      { encoding: "utf8" }
    )
  )
  const txb = new TransactionBlock();
  // 1sui
  txb.setGasBudget(1000000000)
  const publishTxn = await txb.publish({
    modules: modules,
    dependencies: dependencies
  });
  txb.transferObjects([publishTxn], txb.pure(keypair.toSuiAddress()));
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
