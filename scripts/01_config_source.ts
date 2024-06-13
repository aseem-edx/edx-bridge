import { ethers } from "hardhat";

const {
  SOURCE_POOL,
  SOURCE_GATEWAY,
  SOURCE_TOKEN,
  DESTINATION_POOL,
  DESTINATION_CHAIN_ID,
} = process.env;

async function configSource() {
  const sourcePool = await ethers.getContractAt("EdexaCCPool", SOURCE_POOL!);

  const configGateway = await sourcePool.configGateway(SOURCE_GATEWAY!);
  await configGateway.wait();
  console.log("Txn - Config Gateway", configGateway.hash);

  const configRemote = await sourcePool.configRemotePool(
    DESTINATION_CHAIN_ID!,
    DESTINATION_POOL!
  );
  await configRemote.wait();
  console.log("Txn - Config Remote", configRemote.hash);

  const configToken = await sourcePool.configToken(SOURCE_TOKEN!);
  await configToken.wait();
  console.log("Txn - Config Token", configToken.hash);
}

configSource()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
