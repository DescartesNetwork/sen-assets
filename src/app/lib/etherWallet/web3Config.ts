const Web3 = require("web3");

export const web3 = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.HttpProvider('https://goerli.infura.io/v3/5eb1b92f2065414d9dd21858fac54257')
);