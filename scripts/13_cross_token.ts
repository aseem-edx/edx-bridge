import { ethers } from "hardhat";

const { SOURCE_POOL, SOURCE_TOKEN, DESTINATION_CHAIN_ID } = process.env;

const ONE_WEI = 1;

async function crossToken() {
  const [signer] = await ethers.getSigners();

  const sourcePool = await ethers.getContractAt("EdexaCCPool", SOURCE_POOL!);
  const sourceToken = await ethers.getContractAt("EdexaToken", SOURCE_TOKEN!);

  const approveAmount = await sourceToken.approve(signer, ONE_WEI!);
  await approveAmount.wait();
  console.log("Txn - Approve Amount", approveAmount.hash);

  const fee = await sourcePool.estimateFee(DESTINATION_CHAIN_ID!, 800000);

  const crossToken = await sourcePool.crossTo(
    DESTINATION_CHAIN_ID!,
    signer,
    ONE_WEI,
    { value: fee }
  );
  await crossToken.wait();
  console.log("Txn - Cross Token", crossToken.hash);
}

crossToken()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
