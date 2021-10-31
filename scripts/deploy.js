const main = async () => {
  const [owner] = await hre.ethers.getSigners();
  const rentContractFactory = await hre.ethers.getContractFactory('Rent');
  const rentContract = await rentContractFactory.deploy();
  await rentContract.deployed();

  console.log('Contract deployed to:', rentContract.address);
  console.log('Contract deployed by:', owner.address);
};

const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
};
  
runMain();