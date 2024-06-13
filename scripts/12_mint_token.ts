import { ethers } from "hardhat";

const { SOURCE_TOKEN } = process.env;

const TEN_ETHER = ethers.parseEther("10");

async function mintToken() {
  const [signer] = await ethers.getSigners();
  const sourceToken = await ethers.getContractAt("EdexaToken", SOURCE_TOKEN!);

  const mintToken = await sourceToken.mint(signer, TEN_ETHER);
  await mintToken.wait();
  console.log("Txn - Mint Token", mintToken.hash);
}

mintToken()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
