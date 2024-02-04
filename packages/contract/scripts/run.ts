import { ethers } from "hardhat";

const main = async () => {
  const YERC721ContractFactory = await ethers.getContractFactory('YERC721');
  const YERC721Contract = await YERC721ContractFactory.deploy();

  await YERC721Contract.deployed()

  console.log('Contract Address: ', YERC721Contract.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
