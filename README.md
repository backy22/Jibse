# Project
This project is submitted to [BlockHack Hackathon 2021 (Nov 8-14)](https://blockhack-hackathon.devpost.com/)

# Jibse 🏠
Jibse helps tenants and owners make a worry-free lease contract without knowing each other.  
  
🙋‍♀️ As an owner,  
- I can post a place I want to rent out at any price and for any period I want using cryptocurrency.
- I can check the transaction histories of applicants to prevent fraud.
- I can easily check the payment status of current tenants.
  
🙋‍♂️ As a tenant,  
- I can ensure if the owner is a trustworthy person by reading reviews of rooms.
- I can pay a deposit and rent using cryptocurrency.
- I can get evidence on the network without having to write a separate contract.
- I can set up auto-payment.

# Inspiration ⚡️
We are foreigners who have recently settled in Toronto. It was unnecessarily difficult for us to find a place to rent because of : 
- **Uncertain identity of owners** on existing platforms like Kijiji, Craigslist
- **Shortage of local currency holdings**
- **Lack of proofs to prove identities** such as credit scores, income, and reference in Canada

# What this platfrom offers
- **Transparency** and **reliability** of both owner and tenant by publishing all transactions into the Ethereum network
- **Convenience** and **practicality** by using cryptocurrencies especially paying a deposit from overseas before moving into a country
- **Equality** by giving the "ownership" of payment history to the user on Jibse to determine reliability instead of relying on bank credit score, income proof, reference, etc

# Tech Stack
## Smart contract
- Solidity
- Chainlink Upkeep
- Ethereum Kovan network

## Frontend
- React
- Next.js
- Tailwind CSS

# Get started
Run smart contract tests by :
```
npx hardhat run scripts/run.js
```

Deploy testnet by :
```
npx hardhat run scripts/deploy.js --network kovan
```

Run a frontend server by :
```
cd front && npm run dev
```

# Live
https://jibse.vercel.app/

# Future plan
- Adapt to Layer2 rollups
- Accept stable coins
- Introduce a robust score system
- Improve auto-payment system
- Add price graph for each room
- Build a bidding system
- Integrate with Google map (allow any location)

# About CryptoGirls
@backy22 and @sera0731 are from Japan and Korea, Software Engineer based in Toronto.
