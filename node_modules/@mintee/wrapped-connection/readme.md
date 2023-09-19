# wrapped-connection

A simple wrapper around the Solana's `Connection` class that adds a few useful features, especially for compressed NFTs.

I got this code form Metaplex: [Compression-example](https://github.com/helius-labs/compression-examples/blob/56d309543b3a74acb0c3981e375d980174d6fa34/wrappedConnection.ts)

## install

```bash
npm install @mintee/wrapped-connection
```

## Usage

```typescript
import { WrappedConnection } from "@mintee/wrapped-connection";

const keypair = new Keypair();
const connectionWrapper = WrappedConnection.getConnectionWrapper(
  "https://api.mainnet-beta.solana.com",
  keypair
);

const assetInfo = await connectionWrapper.getAsset(assetId);
```
