# Project
This project is submitted to [BlockHack Hackathon 2021 (Nov 8-14)](https://blockhack-hackathon.devpost.com/)

# Jibse
The platform where the user can post and rent the house. Also they can transfer deposit and set auto transfer using cryptocurrency.

# What this platfrom offers
-transparency of renting market reliability of both owner and tenant by publishing all transfer
-convenient and cheaper transfer, espcially renting from overseas before moving in
-equality of background check by using own payment history instead of using bank credit score, income proof, reference etc

# Inspiration
We are from outside of Canada and have struggled to find a good place because
1. there was no way to check if the ower is reliable or not on existing platform like Kijiji, Craigslist
2. we always had to exchange money as we didn't have much Canada dollers
3. we were not able to rent proper place since we don't have credit score, income, reference in Canada

# Structure
## SmartContract
Built on Ethereum smart contract.
- Rent Contract ... manage all rent contract. 
- Payment Contract ... manage payment
- Score Contract ... have score logic for each user. manage all score and review.

## Frontend
React, NextJs

# Get started
run test
```
npx hardhat run scripts/run.js
```

deploy testnet
```
npx hardhat run scripts/deploy.js --network kovan
```

run front (under front directory)
```
npm run dev
```

# live
https://jibse.vercel.app/

# member
@backy22
@sera0731
