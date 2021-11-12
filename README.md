# Project
This project is submitted to [BlockHack Hackathon 2021 (Nov 8-14)](https://blockhack-hackathon.devpost.com/)

# Jibse
The platform where the user can post and rent the house. Also they can transfer deposit and set auto transfer using cryptocurrency.

# What this platfrom offers
- transparency of renting market reliability of both owner and tenant by publishing all transfer
- convenient and cheaper transfer, espcially renting from overseas before moving in
- equality of background check by using own payment history instead of using bank credit score, income proof, reference etc

# Inspiration
We are from outside of Canada and have struggled to find a good place because
- there was no way to check if the ower is reliable or not on existing platform like Kijiji, Craigslist
- we always had to exchange money as we didn't have much Canada dollers
- we were not able to rent proper place since we don't have credit score, income, reference in Canada

# Tech Stack
## SmartContract
- Build on Ethereum. There are Rent Contract, Payment Contract, Score Contract
- Chainlink to manage auto transfer

## Frontend
- React
- NextJs
- Tailwind CSS

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

# Live
https://jibse.vercel.app/

# Future plan
- Price graph　for each room
- Allow using DAI because it's stable coin
- Introduce more robust score system
- Introducing bidding system

# About CryptoGirls
@backy22 and @sera0731 are from Japan and Korean, Software Engineer based in Toronto.
