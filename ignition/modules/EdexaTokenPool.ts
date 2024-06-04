import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const { GATEWAY_ADDRESS, POOL_ADDRESS } = process.env;

const EdexaTokenPoolModule = buildModule("EdexaTokenPoolModule", (m) => {
  const gatewayAddress = m.getParameter("_wmbGateway", GATEWAY_ADDRESS);
  const poolAddress = m.getParameter("_poolToken", POOL_ADDRESS);

  const edexaTokenPool = m.contract("EdexaTokenPool", [
    gatewayAddress,
    poolAddress,
  ]);

  return { edexaTokenPool };
});

export default EdexaTokenPoolModule;
