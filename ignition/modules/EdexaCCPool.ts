import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EdexaCCPoolModule = buildModule("EdexaCCPoolModule", (m) => {
  const edexaCCPool = m.contract("EdexaCCPool");

  return { edexaCCPool };
});

export default EdexaCCPoolModule;
