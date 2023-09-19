import {
  getConcurrentMerkleTreeAccountSize,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import WrappedConnection from "@mintee/wrapped-connection"
import {
  createCreateTreeInstruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";


const keypair = new Keypair()
const connectionWrapper = WrappedConnection.getConnectionWrapper("https://api.mainnet-beta.solana.com", keypair);

// Creates a new merkle tree for compression.
export async function mintTree() {
  const payer = connectionWrapper.payer.publicKey;
  const treeKeypair = new Keypair();


  const maxDepth = 14
  const maxBufferSize = 64


  const space = getConcurrentMerkleTreeAccountSize(maxDepth, maxBufferSize);
  const [treeAuthority, _bump] = await PublicKey.findProgramAddressSync(
    [treeKeypair.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );
  const allocTreeIx = SystemProgram.createAccount({
    fromPubkey: payer,
    newAccountPubkey: treeKeypair.publicKey,
    lamports: await connectionWrapper.getMinimumBalanceForRentExemption(space),
    space: space,
    programId: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  });


  const createTreeIx = createCreateTreeInstruction(
    {
      merkleTree: treeKeypair.publicKey,
      treeAuthority,
      treeCreator: payer,
      payer,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    },
    {
      maxBufferSize,
      maxDepth,
      public: false,
    },
    BUBBLEGUM_PROGRAM_ID
  );


  let tx = new Transaction().add(allocTreeIx).add(createTreeIx);
  tx.feePayer = payer;
  try {
    await sendAndConfirmTransaction(
      connectionWrapper,
      tx,
      [treeKeypair, connectionWrapper.payer],
      {
        commitment: "confirmed",
        skipPreflight: true,
      }
    );
    
    console.log(
      "Successfull created merkle tree for account: " + treeKeypair.publicKey
    );

    return treeKeypair.publicKey;


  } catch (e) {
    console.error("Failed to create merkle tree: ", e);
    throw e;
  }
}
