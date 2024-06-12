import { ethers } from "hardhat";

const { POOL_ADDRESS, TOKEN_ADDRESS } = process.env;

async function configToken() {
  const pool = await ethers.getContractAt("EdexaCCPool", POOL_ADDRESS!);

  const configPool = await pool.configToken(TOKEN_ADDRESS!);
  await configPool.wait();

  console.log("Txn Hash", configPool.hash);
}

configToken()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
