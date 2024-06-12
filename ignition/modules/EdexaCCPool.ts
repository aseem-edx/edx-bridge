import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const { GATEWAY_ADDRESS } = process.env;

const EdexaCCPoolModule = buildModule("EdexaCCPoolModule", (m) => {
  const gatewayAddress = m.getParameter("_wmbGateway", GATEWAY_ADDRESS);

  const edexaCCPool = m.contract("EdexaCCPool", [gatewayAddress]);

  return { edexaCCPool };
});

export default EdexaCCPoolModule;
