const hre = require("hardhat");
const ethers=require('ethers');
async function main() {
  const NAME = "AI Generated NFT"
  const SYMBOL = "AINFT"
  const COST = ethers.utils.parseUnits("1", "ether") // 1 ETH

  //const NFT = await hre.ethers.getContractFactory("ai_NFT")
  const NFT = await hre.ethers.getContractFactory("ai_NFT", {
    filePath: "contracts/ai_NFT.sol" // Provide the path address to the contract file
  });
  
  const nft = await NFT.deploy(NAME, SYMBOL, COST)
  await nft.deployed()

  console.log(`Deployed NFT Contract at: ${nft.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
