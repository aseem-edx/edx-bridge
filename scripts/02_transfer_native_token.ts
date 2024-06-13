import { ethers } from "hardhat";

const { DESTINATION_POOL } = process.env;

const ONE_WEI = 1;

async function transferToken() {
  const [signer] = await ethers.getSigners();
  const sendToken = await signer.sendTransaction({
    value: ONE_WEI,
    to: DESTINATION_POOL!,
  });
  await sendToken.wait();
  console.log("Txn - sendToken", sendToken.hash);
}

transferToken()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
