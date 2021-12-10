import { INFURA_API_URL } from "../wormhole/constant/ethConfig";

const Web3 = require("web3");

export const web3 = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.HttpProvider(INFURA_API_URL.goerli)
);