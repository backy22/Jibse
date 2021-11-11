const main = async () => {
  const [owner, tenant] = await hre.ethers.getSigners();

  // Rent Contract
  // const rentContractFactory = await hre.ethers.getContractFactory('Rent');
  // const rentContract = await rentContractFactory.deploy();
  // await rentContract.deployed();

  // console.log('Rent Contract deployed to:', rentContract.address);
  // console.log('Rent Contract deployed by:', owner.address);

  // const addContract = await rentContract.addContract(1000,2000,'Toronto',1)
  // addContract.wait();

  // const getAllContracts = await rentContract.getAllContracts();
  // console.log('getAllContracts', getAllContracts);

  // const activeRents = await rentContract.getContractsByState(0);
  // console.log('activeRents', activeRents);

  // const applyContract = await rentContract.connect(tenant).applyForContract(0);

  // const applicants = await rentContract.getApplicants(0);
  // console.log('Applicants', applicants);

  // const appliedContractIds = await rentContract.getAppliedContractIds(tenant.address);
  // console.log('Applied contract ids', appliedContractIds);

  // const acceptContract = await rentContract.acceptApplicant(0, tenant.address);
  // console.log('Accept', tenant.address);

  // const allTenants = await rentContract.getAllTenantsAddress();
  // console.log('allTenants', allTenants);

  // const allOwners = await rentContract.getAllOwnersAddress();
  // console.log('allOwners', allOwners);

  // const payDeposit = await rentContract.connect(tenant).payDeposit(0, { value: ethers.utils.parseEther('1.0') });
  // console.log('pay deposit', payDeposit);

  // Payment Contract
  // const paymentContractFactory = await hre.ethers.getContractFactory('Payment');
  // const paymentContract = await paymentContractFactory.deploy();
  // await paymentContract.deployed();

  // console.log('Payment Contract deployed to:', paymentContract.address);
  // console.log('Payment Contract deployed by:', owner.address);

  // const createBillTxn = await paymentContract.createBill(0);
  // console.log('createBillTxn', createBillTxn)

  // Score Contract
  // const scoreContractFactory = await hre.ethers.getContractFactory('Score');
  // const scoreContract = await scoreContractFactory.deploy();
  // await scoreContract.deployed();

  // console.log('Score Contract deployed to:', scoreContract.address);
  // console.log('Score Contract deployed by:', owner.address);

  // const calculateTenantScore = await scoreContract.calculateTenantScore('0xECcC87321FD9C54c51aB3FFfAfc19c5779cE9250');
  // console.log('calculateTenantScore', calculateTenantScore);

  // const tenantScore = await scoreContract.getScore('0xECcC87321FD9C54c51aB3FFfAfc19c5779cE9250');
  // console.log(`score for ${tenant.address}`, tenantScore.toNumber());

  // const addReview = await scoreContract.connect('0xECcC87321FD9C54c51aB3FFfAfc19c5779cE9250').addReview(0, 4, 'Quiet and clean place. but not convenient');
  // addReview.wait();
  // console.log('addReview', addReview);

  // const reviews = await scoreContract.getReviews(0);
  // console.log('reviews', reviews);

  // const calculateOwnerScore = await scoreContract.calculateOwnerScore('0x684367aa423f4c1446d99ae234E172AE1BA2842c');
  // console.log('calculateOwnerScore', calculateOwnerScore);

  // const ownerScore = await scoreContract.getScore('0x684367aa423f4c1446d99ae234E172AE1BA2842c');
  // console.log(`score for ${owner.address}`, ownerScore.toNumber());

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