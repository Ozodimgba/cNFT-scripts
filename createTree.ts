import { createCreateTreeInstruction, PROGRAM_ID as BUBBLEGUM_PROGRAM_ID   } from "@metaplex-foundation/mpl-bubblegum";  
import { loadWalletKey, sendVersionedTx } from "./utils";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { SPL_ACCOUNT_COMPRESSION_PROGRAM_ID, SPL_NOOP_PROGRAM_ID, ValidDepthSizePair, getConcurrentMerkleTreeAccountSize } from "@solana/spl-account-compression";
import { SYSTEM_PROGRAM_ID } from "@raydium-io/raydium-sdk";


async function createTree() {
    const keypair = loadWalletKey("my-keypair.json");
    const connection = new Connection("https://api.devnet.solana.com ");
    const merkleTree = loadWalletKey("TRERRpwR59za9tqDM7KGoSmPvaYz4DnhmRbk5DDJRUZ.json");

    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
        [merkleTree.publicKey.toBuffer()],
        BUBBLEGUM_PROGRAM_ID,
      );  

    const depthSizePair : ValidDepthSizePair = {
        maxDepth: 14,
        maxBufferSize: 256 
    }

    const space = getConcurrentMerkleTreeAccountSize(depthSizePair.maxDepth, depthSizePair.maxBufferSize);

    const createAccountIx = await SystemProgram.createAccount({
        newAccountPubkey: merkleTree.publicKey,
        fromPubkey: keypair.publicKey,
        space: space,
        lamports: await connection.getMinimumBalanceForRentExemption(space),
        programId: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID
    });

   const createTreeIx = await createCreateTreeInstruction({
        merkleTree: merkleTree.publicKey,
        treeAuthority: treeAuthority,
        payer: keypair.publicKey,
        treeCreator: keypair.publicKey,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID, 
        logWrapper: SPL_NOOP_PROGRAM_ID, 
        systemProgram: SYSTEM_PROGRAM_ID
    }, {
          maxDepth: depthSizePair.maxDepth,
        maxBufferSize: depthSizePair.maxBufferSize,
        public: false 
    }) 

    const sx = await sendVersionedTx(connection, [createAccountIx, createTreeIx], keypair.publicKey, [keypair, merkleTree])
    console.log(sx);

}


createTree();