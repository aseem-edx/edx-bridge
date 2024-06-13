import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const { GATEWAY } = process.env;

const EdexaCCPoolModule = buildModule("EdexaCCPoolModule", (m) => {
  const gateway = m.getParameter("_wmbGateway", GATEWAY!);

  const edexaCCPool = m.contract("EdexaCCPool", [gateway]);

  return { edexaCCPool };
});

export default EdexaCCPoolModule;
