import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const { GATEWAY_ADDRESS, POOL_TOKEN_ADDRESS } = process.env;

const EdexaTokenPoolModule = buildModule("EdexaTokenPoolModule", (m) => {
  const gatewayAddress = m.getParameter("_wmbGateway", GATEWAY_ADDRESS);
  const poolAddress = m.getParameter("_poolToken", POOL_TOKEN_ADDRESS);

  const edexaTokenPool = m.contract("EdexaTokenPool", [
    gatewayAddress,
    poolAddress,
  ]);

  return { edexaTokenPool };
});

export default EdexaTokenPoolModule;
