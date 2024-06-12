import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const { TOKEN_NAME, TOKEN_SYMBOL } = process.env;

const EdexaTokenModule = buildModule("EdexaTokenModule", (m) => {
  const tokenName = m.getParameter("_name", TOKEN_NAME);
  const tokenSymbol = m.getParameter("_symbol", TOKEN_SYMBOL);

  const edexaToken = m.contract("EdexaToken", [tokenName, tokenSymbol]);

  return { edexaToken };
});

export default EdexaTokenModule;
