/* eslint-disable @typescript-eslint/no-unused-vars */
import { Keypair, clusterApiUrl } from '@solana/web3.js';

// import custom helpers for demos
import { loadOrGenerateKeypair } from './mynt/src/lib/helpers';
import { ValidDepthSizePair } from '@solana/spl-account-compression';

// import custom helpers to mint compressed NFTs
import { createTree } from './mynt/src/lib/compression';
import * as fs from 'fs';

// local import of the connection wrapper, to help with using the ReadApi
import { WrapperConnection } from './mynt/src/ReadApi/WrapperConnection';
import { loadWalletKey } from './utils';
import bs58 from 'bs58';

// define some reusable balance values for tracking
let initBalance: number, balance: number;

export async function create_tree() {
  try {
    // Define your base58 encoded public key
    const base58PublicKey = '4YJqg2HjqcTykEqiH9Bk6aFfJqM9VrtfqN9gY7edMTRVM';

    const filePath = 'my-keypair.json';
    // generate a new keypair for use in this demo (or load it locally from the filesystem when available)
    const payer = loadWalletKey(filePath);

    console.log('Payer address:', payer.publicKey.toBase58());

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    // load the env variables and store the cluster RPC url
    const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl('devnet');

    // create a new rpc connection, using the ReadApi wrapper
    const connection = new WrapperConnection(CLUSTER_URL, 'confirmed');

    // get the payer's starting balance (only used for demonstration purposes)
    initBalance = await connection.getBalance(payer.publicKey);

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    /*
        Define our tree size parameters
    */
    const maxDepthSizePair: ValidDepthSizePair = {
      // max=16,384 nodes
      maxDepth: 14,
      maxBufferSize: 64,
    };
    const canopyDepth = maxDepthSizePair.maxDepth - 5;

    /*
        Actually allocate the tree on chain
      */

    // define the address the tree will live at
    const treeKeypair = Keypair.generate();

    // create and send the transaction to create the tree on chain
    const tree = await createTree(
      connection,
      payer,
      treeKeypair,
      maxDepthSizePair,
      canopyDepth,
    );

    console.log(tree);

    return tree;
  } catch (error) {
    console.error('Error creating the tree:', error);
    // You can handle the error here or rethrow it if needed
    throw error;
  }
}

// Call the async function
create_tree();