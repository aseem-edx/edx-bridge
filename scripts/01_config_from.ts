import { ethers } from "hardhat";

const { FROM_POOL, FROM_TOKEN, FROM_ } = process.env;

async function configFrom() {
  const pool = await ethers.getContractAt("EdexaCCPool", FROM_POOL!);
}

configFrom()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
