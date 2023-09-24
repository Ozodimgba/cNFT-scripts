/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Keypair,
  PublicKey,
  Connection,
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstruction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  createAccount,
  createMint,
  mintTo,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  createAllocTreeIx,
  ValidDepthSizePair,
  SPL_NOOP_PROGRAM_ID,
} from '@solana/spl-account-compression';
import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard,
  computeCreatorHash,
  computeDataHash,
  createCreateTreeInstruction,
  createMintToCollectionV1Instruction,
} from '@metaplex-foundation/mpl-bubblegum';
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  CreateMetadataAccountArgsV3,
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
  createSetCollectionSizeInstruction,
} from '@metaplex-foundation/mpl-token-metadata';
// local import of the connection wrapper, to help with using the ReadApi
import { WrapperConnection } from "./mynt/src/ReadApi/WrapperConnection";
import { loadWalletKey } from "./utils";

// import local helper functions
import { explorerURL, extractSignatureFromFailedTransaction, numberFormatter } from './mynt/src/lib/helpers';

import { createCollection, mintCompressedNFT } from './mynt/src/lib/compression';


// generate a new Keypair for testing, named `wallet`
const payer = loadWalletKey("my-keypair.json");
const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl("devnet");

  // create a new rpc connection, using the ReadApi wrapper
const connection = new WrapperConnection(CLUSTER_URL, "confirmed");

let initBalance: number, balance: number;
/**
 * Mint a single compressed NFT on-chain, using the regular Metaplex standards
 * with the `payer` as the authority
 * @param Payer - Keypair that pays
 * @param Metadata - Follows the Metaplex NFT standard
 */



export async function createNFTCollection() {

  const treeKeypair =  loadWalletKey('TRERRpwR59za9tqDM7KGoSmPvaYz4DnhmRbk5DDJRUZ.json');
  // define the metadata to be used for creating the NFT collection
  // load the env variables and store the cluster RPC url
  const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl('devnet');

  // create a new rpc connection, using the ReadApi wrapper
  const connection = new WrapperConnection(CLUSTER_URL, 'confirmed');

  const filePath = 'my-keypair.json';
  // generate a new keypair for use in this demo (or load it locally from the filesystem when available)
  const payer = loadWalletKey(filePath);

  const wallet = new PublicKey("Ehg4iYiJv7uoC6nxnX58p4FoN5HPNoyqKhCMJ65eSePk")

  const collectionMetadataV3: CreateMetadataAccountArgsV3 = {
    data: {
      name: 'Super Sweet NFT Collection',
      symbol: 'SSNC',
      // specific JSON metadata for the collection
      uri: 'https://arweave.net/euAlBrhc3NQJ5Q-oJnP10vsQFjTV7E9CgHZcVm8cogo',
      sellerFeeBasisPoints: 100,
      creators: [
        {
          address: payer.publicKey,
          verified: false,
          share: 100,
        },
      ],
      collection: null,
      uses: null,
    },
    isMutable: false,
    collectionDetails: null,
  };

  // create a full token mint and initialize the collection (with the `payer` as the authority)
  const collection = await createCollection(
    connection,
    payer,
    collectionMetadataV3,
  );

  const compressedNFTMetadata: MetadataArgs = {
    name: "NFT Name",
    symbol: collectionMetadataV3.data.symbol,
    // specific json metadata for each NFT
    uri: "https://supersweetcollection.notarealurl/token.json",
    creators: [
      {
        address: payer.publicKey,
        verified: false,
        share: 100,
      },
      {
        address: payer.publicKey,
        verified: false,
        share: 0,
      },
    ],
    editionNonce: 0,
    uses: null,
    collection: null,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    isMutable: false,
    // these values are taken from the Bubblegum package
    tokenProgramVersion: TokenProgramVersion.Original,
    tokenStandard: TokenStandard.NonFungible,
  };

  // fully mint a single compressed NFT to the payer
  console.log(`Minting a single compressed NFT to ${payer.publicKey.toBase58()}...`);

  await mintCompressedNFT(
    connection,
    payer,
    treeKeypair.publicKey,
    collection.mint,
    collection.metadataAccount,
    collection.masterEditionAccount,
    compressedNFTMetadata,
    // mint to this specific wallet (in this case, the tree owner aka `payer`)
    wallet,
  );

  return collection;
}

// Usage:
createNFTCollection();