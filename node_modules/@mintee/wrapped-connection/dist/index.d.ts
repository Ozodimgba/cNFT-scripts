import { AnchorProvider } from "@project-serum/anchor";
import { Connection, Keypair, Commitment } from "@solana/web3.js";
declare class WrappedConnection extends Connection {
    provider: AnchorProvider;
    payer: Keypair;
    rpcUrl: string;
    constructor(payer: Keypair, connectionString: string, rpcUrl?: string, commitment?: Commitment);
    static getConnectionWrapper(rpcUrl: string, keypair: Keypair): WrappedConnection;
    getAsset(assetId: any): Promise<any>;
    getAssetProof(assetId: any): Promise<any>;
    getAssetsByOwner(assetId: string, sortBy: any, limit: number, page: number, before: string, after: string): Promise<any>;
}
export default WrappedConnection;
