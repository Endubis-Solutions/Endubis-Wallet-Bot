# Endubis Wallet Bot

A very simple Cardano wallet running as a telegram bot.

# Some disclaimers

Endubis Wallet is not created by Cardano Foundation, Emurgo, or IOHK. The official Cardano team has not reviewed this code and is not responsible for any damage it may cause you. Please be aware that if your device is compromised, your mnemonic may be leaked when used as the access method on Endubis Wallet. We appreciate feedback, especially a review of the crypto-related code.

## Why we are building this

Endubis wallet is created as a means to enable easy payments in ADA. Our target audience for this app/bot are people new to the crypto space, that don't want to deal with or have access to centralized platforms. We are strong believers in decentralized systems and thus our aim was to make the Cardano world easily accessible to the broader population. That is why we picked Telegram, the most widely used chatting app in Ethiopia, as a starting point. Since Endubis Wallet doesn't run a full node or require to sync the entire blockchain it's also very fast. Recovering your wallet from the mnemonic only takes a few seconds. 

## Features

* Main Menu: Users can access various features of the bot by navigating through the main menu.
* Receive: Users can generate a new receive address to receive ADA.
* Deposit: Users can view their deposit history and deposit addresses.
* Send: Users can send ADA to other users or external addresses.
* View Transactions: Users can view their transaction history.
* Manage Account: Users can log out, delete their wallet, or view their wallet balance.
* Withdraw: Users can withdraw ADA into FIAT currency.

# Usage
1. Clone the repository:
```
git clone https://github.com/<your-username>/telegraf-bot.git
```
2. Install the dependencies:
```
npm install
```
3. Set up a  [Firebase project](https://firebase.google.com/docs/web/setup) and configure the Firestore database.

4. Create a **`.env`** file in the root directory of the project and set the following environment variables:

* **BOT_TOKEN**: The token of your Telegram bot, obtained from the Bot Father.
* **FIRESTORE_API_KEY**: The API key of your Firebase project.
* **FIRESTORE_PROJECT_ID**: The project ID of your Firebase project.
Run the bot:
```
npm start
```
# Contributions
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
