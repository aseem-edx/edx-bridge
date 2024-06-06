import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const { GATEWAY_ADDRESS, TOKEN_ADDRESS } = process.env;

const EdexaCCPoolModule = buildModule("EdexaCCPoolModule", (m) => {
  const gatewayAddress = m.getParameter("_wmbGateway", GATEWAY_ADDRESS);
  const tokenAddress = m.getParameter("_token", TOKEN_ADDRESS);

  const edexaCCPool = m.contract("EdexaCCPool", [gatewayAddress, tokenAddress]);

  return { edexaCCPool };
});

export default EdexaCCPoolModule;
