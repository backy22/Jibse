const main = async () => {
  const [owner] = await hre.ethers.getSigners();
  // Rent Contract
  // const rentContractFactory = await hre.ethers.getContractFactory('Rent');
  // const rentContract = await rentContractFactory.deploy();
  // await rentContract.deployed();

  // console.log('Rent Contract deployed to:', rentContract.address);
  // console.log('Rent Contract deployed by:', owner.address);

  // Score Contract
  const scoreContractFactory = await hre.ethers.getContractFactory('Score');
  const scoreContract = await scoreContractFactory.deploy();
  await scoreContract.deployed();

  console.log('Score Contract deployed to:', scoreContract.address);
  console.log('Score Contract deployed by:', owner.address);
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