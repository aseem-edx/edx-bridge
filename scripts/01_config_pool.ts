import { ethers } from "hardhat";

const { POOL_ADDRESS, REMOTE_CHAIN_ID, REMOTE_POOL } = process.env;

async function configPool() {
  const edexaCCPool = await ethers.getContractAt("EdexaCCPool", POOL_ADDRESS!);

  const setTrustedRemotes = await edexaCCPool.setTrustedRemotes(
    [REMOTE_CHAIN_ID!],
    [REMOTE_POOL!],
    [true]
  );
  await setTrustedRemotes.wait();

  const configRemotePool = await edexaCCPool.configRemotePool(
    REMOTE_CHAIN_ID!,
    REMOTE_POOL!
  );
  await configRemotePool.wait();

  console.log("Txn Hash:", configRemotePool.hash);
}

configPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
