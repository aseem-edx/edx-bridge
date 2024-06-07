import { ethers } from "hardhat";

const { TOKEN_ADDRESS, POOL_ADDRESS, REMOTE_CHAIN_ID, REMOTE_POOL } =
  process.env;

const ONE_ETHER = ethers.parseEther("1");

async function sendToken() {
  const token = await ethers.getContractAt("EdexaToken", TOKEN_ADDRESS!);
  const pool = await ethers.getContractAt("EdexaCCPool", POOL_ADDRESS!);

  const tokenApproval = await token.approve(pool.target, ONE_ETHER);
  await tokenApproval.wait();
  console.log("Txn - Token Approved:", tokenApproval.hash);

  const fees = await pool.estimateFee(REMOTE_CHAIN_ID!, 800000);

  const crossToken = await pool.crossTo(
    REMOTE_CHAIN_ID!,
    REMOTE_POOL!,
    ONE_ETHER,
    { value: fees }
  );
  await crossToken.wait();
  console.log("Txn - Cross Token:", crossToken.hash);
}

sendToken()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
