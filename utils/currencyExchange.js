const { default: fetch } = require("cross-fetch");

const fetchWithRetries = async (url, options = {}, retryCount = 0) => {
  // split out the maxRetries option from the remaining
  // options (with a default of 3 retries)
  const { maxRetries = 3, ...remainingOptions } = options;
  try {
    return await fetch(url, remainingOptions);
  } catch (error) {
    // if the retryCount has not been exceeded, call again
    if (retryCount < maxRetries) {
      return fetchWithRetries(url, options, retryCount + 1);
    }
    // max retries exceeded
    throw error;
  }
};

const getADAtoUSDRate = async () => {
  const {
    cardano: { usd: adaToUsd },
  } = await fetchWithRetries(
    "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd"
  ).then((res) => res.json());
  return adaToUsd;
};

const getUsdToCurrencyRate = async (currency) => {
  const result = await fetchWithRetries(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`
  ).then((res) => res.json());
  return result["usd"][currency];
};

const getADAtoETBRate = async () => {
  const ADAtoUSD = await getADAtoUSDRate();
  const USDtoETB = await getUsdToCurrencyRate("etb");

  return ADAtoUSD * USDtoETB;
};

const getADAtoKESRate = async () => {
  const ADAtoUSD = await getADAtoUSDRate();
  const USDtoKES = await getUsdToCurrencyRate("kes");

  return ADAtoUSD * USDtoKES;
};

module.exports = { getADAtoETBRate, getADAtoUSDRate, getADAtoKESRate };
