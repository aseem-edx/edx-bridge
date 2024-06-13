import { ethers } from "hardhat";

const { DESTINATION_POOL, SOURCE_CHAIN_ID, SOURCE_POOL } = process.env;

async function configDestination() {
  const destinationPool = await ethers.getContractAt(
    "EdexaCCPool",
    DESTINATION_POOL!
  );

  const setTrustedRemote = await destinationPool.setTrustedRemotes(
    [SOURCE_CHAIN_ID!],
    [SOURCE_POOL!],
    [true]
  );
  await setTrustedRemote.wait();
  console.log("Txn - Set Trusted Remote", setTrustedRemote.hash);
}

configDestination()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
