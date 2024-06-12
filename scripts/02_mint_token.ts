import { ethers } from "hardhat";

const { TOKEN_ADDRESS, POOL_ADDRESS } = process.env;

const HUNDRED_ETHER = ethers.parseEther("100");

async function mintToken() {
  const [SIGNER] = await ethers.getSigners();

  const token = await ethers.getContractAt("EdexaToken", TOKEN_ADDRESS!);

  const mintToPool = await token.mint(POOL_ADDRESS!, HUNDRED_ETHER);
  await mintToPool.wait();
  console.log("Txn - MintToPool:", mintToPool.hash);

  const mintToSigner = await token.mint(SIGNER, HUNDRED_ETHER);
  await mintToSigner.wait();
  console.log("Txn - MintToSigner:", mintToSigner.hash);
}

mintToken()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
