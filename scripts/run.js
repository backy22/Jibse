const main = async () => {
  const [owner, tenant] = await hre.ethers.getSigners();

  // Rent Contract
  const rentContractFactory = await hre.ethers.getContractFactory('Rent');
  const rentContract = await rentContractFactory.deploy();
  await rentContract.deployed();

  console.log('Rent Contract deployed to:', rentContract.address);
  console.log('Rent Contract deployed by:', owner.address);

  const addContract = await rentContract.addContract(1000,2000,'Toronto',1000)
  addContract.wait();

  const activeRents = await rentContract.getContractsByState(0);
  console.log('activeRents', activeRents);

  const applyContract = await rentContract.connect(tenant).applyForContract(0);
  const applicants = await rentContract.getApplicants(0);
  console.log('Applicants', applicants);

  const acceptContract = await rentContract.acceptApplicant(0, tenant.address);

  // Score Contract
  const scoreContractFactory = await hre.ethers.getContractFactory('Score');
  const scoreContract = await scoreContractFactory.deploy();
  await scoreContract.deployed();

  console.log('Score Contract deployed to:', scoreContract.address);
  console.log('Score Contract deployed by:', owner.address);

  const calculateTenantScore = await scoreContract.calculateTenantScore(tenant.address);
  console.log('calculateTenantScore', calculateTenantScore);

  const addReview = await scoreContract.addReview(0, 4, 'Quien and clean place. but not convenient');
  addReview.wait();

  const reviews = await scoreContract.getReviews(0);
  console.log('reviews', reviews);

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