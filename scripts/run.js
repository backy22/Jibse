const main = async () => {
  const RentContractFactory = await hre.ethers.getContractFactory('RentPortal');
  const RentContract = await RentContractFactory.deploy(
    ['333 Adelaide St W 4th Floor, Toronto, ON M5V 1R5', '122 Tyndall Ave, Toronto, ON M6K 2E2', '580 Church St, Toronto, ON M4Y 2E5'],
    [1,2,3], // roomId
    [new Date().getTime(), new Date().getTime(), new Date().getTime()], // startdate
    [new Date().getTime(), new Date().getTime(), new Date().getTime()], // endDate
    [1000, 850, 1200] // price
  )

  await RentContract.deployed();
  console.log("Contract deployed to:", RentContract.address);

  let allRooms = await RentContract.getAllRooms();
  console.log('allRooms'. allRooms);

  let allLRents = await RentContract.getAllRents();
  console.log('allLRents', allLRents);

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