const axios = require("axios");

require("dotenv").config();

const args = process.argv;
const dcaInterval = process.env.STRIKE_DCA_INTERVAL_IN_SECONDS;
const strikeApiKey = process.env.STRIKE_API_KEY;
const lnurlOrLightningAddress = process.env.LNURL_OR_LIGHTNING_ADDRESS;

if (args.length < 3) {
  console.log("Please provide amount in sats as an argument");
  process.exit(1);
}

if (!dcaInterval) {
  console.log("Please set STRIKE_DCA_INTERVAL_IN_SECONDS in .env file");
  process.exit(1);
}

if (!strikeApiKey) {
  console.log("Please set STRIKE_API_KEY in .env file");
  process.exit(1);
}

if (!lnurlOrLightningAddress) {
  console.log("Please set LNURL_OR_LIGHTNING_ADDRESS in .env file");
  process.exit(1);
}

// amount in sats to DCA
const amount = args[2];

dca();

setInterval(dca, process.env.STRIKE_DCA_INTERVAL_IN_SECONDS * 1000);

async function dca() {
  try {
    console.log("fetching invoice");
    const invoice = await fetchInvoice();
    console.log("creating payment quote");
    const paymentQuoteId = await createPaymentQuote(invoice);
    console.log("smash buying some corn");
    const result = await executePaymentQuote(paymentQuoteId);
    console.log("result");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.log(error);
  }
}

async function fetchInvoice() {
  const { data: invoice } = await axios(
    `https://lnurlpay.com/api/invoice?lnUrlOrAddress=${lnurlOrLightningAddress}&amount=${amount}`
  );

  return invoice;
}

async function createPaymentQuote(invoice) {
  const { data } = await axios({
    method: "post",
    url: "https://api.strike.me/v1/payment-quotes/lightning",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${strikeApiKey}`,
    },
    data: JSON.stringify({
      lnInvoice: invoice,
      sourceCurrency: "USD",
    }),
  });

  return data.paymentQuoteId;
}

async function executePaymentQuote(paymentQuoteId) {
  const { data } = await axios({
    method: "patch",
    url: `https://api.strike.me/v1/payment-quotes/${paymentQuoteId}/execute`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${strikeApiKey}`,
    },
  });

  return data;
}
