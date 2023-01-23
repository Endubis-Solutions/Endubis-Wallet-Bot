const { Seed, WalletServer, ShelleyWallet } = require("cardano-wallet-js");
const {
  TransactionsApi,
  AddressesApi,
  CoinSelectionsApi,
  StakePoolsApi,
  WalletsApi,
} = require("cardano-wallet-js/dist/api");

require("dotenv").config();
let walletServer = WalletServer.init(
  process.env.WALLET_SERVER_URL || "http://localhost:8091/v2"
);

const timeout = (prom, time) =>
  Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time))]);

const loadAccountFromSeed = async (seedPhrases, passphrase, walletName) => {
  const seedArray = Seed.toMnemonicList(seedPhrases);
  const wallet = await walletServer.createOrRestoreShelleyWallet(
    walletName,
    seedArray,
    passphrase
  );
  return wallet;
};

const getWalletById = async (walletId) => {
  try {
    const wallet = await timeout(walletServer.getShelleyWallet(walletId), 4000);
    return wallet;
  } catch (e) {
    console.error(e?.message);
    return null;
  }
};

const getWalletByName = async (walletName) => {
  try {
    let wallets = await timeout(walletServer.wallets(), 4000);
    let foundWallet = wallets.find((wallet) => wallet.name === walletName);
    return foundWallet;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const isWalletServerActive = async () => {
  try {
    await timeout(walletServer.wallets(), 4000);
    return true;
  } catch (e) {
    return false;
  }
};
const listWallets = async () => {
  let wallets = await timeout(walletServer.wallets(), 4000);
  console.log(
    wallets.map((w) => ({
      id: w.id,
      name: w.name,
      balance: w.balance.total.quantity / 1000000,
      status: w.state.status,
    }))
  );
  return wallets;
};

// const getAddresses = async (wallet) => {
//   const addresses = await wallet.getAddresses();

//   return addresses;
// };

// const getTransactions = async (wallet) => {
//   const transactions = await wallet.getTransactions();
//   return transactions;
// };

const getReceivingAddress = async (walletId) => {
  const wallet = await timeout(getWalletById(walletId), 4000);
  if (wallet?.state?.status !== "ready") {
    throw Error("Wallet not ready");
  }
  const addresses = await wallet.getUnusedAddresses();
  return addresses.slice(0, 1)[0].id;
};

const changePassphrase = async (walletId, oldPassphrase, newPassphrase) => {
  const wallet = await timeout(getWalletById(walletId), 4000);
  const result = await wallet.updatePassphrase(oldPassphrase, newPassphrase);
  return result;
};

const deleteWallet = async (walletId) => {
  const wallet = await timeout(getWalletById(walletId), 4000);
  const result = await wallet.delete();
  return result;
};

const walletServerInfo = async () => {
  return walletServer.getNetworkInformation();
};

const generateSeed = (size = 15) => {
  return Seed.generateRecoveryPhrase(size);
};
//account-1
// loadAccountFromSeed(
//   "celery trumpet decade draft naive nature antique novel topple slice celery gas fossil transfer wash",
//   "passwordistooshort",
//   "test-wallet"
// );

//account-2
// loadAccountFromSeed(
//   "exercise cycle law pig success shaft ship ripple second pave slab card cotton lens eight",
//   "passwordistamir",
//   "tamir-test-wallet"
// );
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const idFromSeed = async (seedPhrases) => {
  const { stdout, stderr } = await exec(
    `cd ~/Downloads/cardano-wallet-v2022-01-18-macos64; echo "${seedPhrases}" | ./cardano-address key from-recovery-phrase Shelley | ./cardano-address key public --with-chain-code | ./bech32 | xxd -r -p | b2sum -l 160 | cut -d' ' -f1`
  );
  if (stderr) {
    throw {
      message:
        "There was an error when executing the cli command for function: idFromSeed",
      payload: stderr,
    };
  }
  return stdout.trim();
};

const makeShelleyWallet = (wallet) => {
  const shelley = Object.assign(new ShelleyWallet(), wallet);
  shelley.transactionsApi = Object.assign(
    new TransactionsApi(),
    shelley.transactionsApi
  );
  shelley.addressesApi = Object.assign(
    new AddressesApi(),
    shelley.addressesApi
  );
  shelley.coinSelectionsApi = Object.assign(
    new CoinSelectionsApi(),
    shelley.coinSelectionsApi
  );
  shelley.stakePoolApi = Object.assign(
    new StakePoolsApi(),
    shelley.stakePoolApi
  );
  shelley.walletsApi = Object.assign(new WalletsApi(), shelley.walletsApi);
  return shelley;
};

const getTransaction = (wallet, txId) => {
  return wallet.getTransaction(txId);
};

(async function () {
  // listWallets();
  // deleteWallet("6b619ed2da709dd8fbbbf0f1cdf8e0175f1282fe");
  // deleteWallet("a6e8fd1f12afefb8fbf4d0caaa9836c9f22801be");
})();

module.exports = {
  loadAccountFromSeed,
  getWalletById,
  changePassphrase,
  deleteWallet,
  walletServerInfo,
  listWallets,
  getWalletByName,
  idFromSeed,
  getReceivingAddress,
  makeShelleyWallet,
  generateSeed,
  getTransaction,
  isWalletServerActive,
};
