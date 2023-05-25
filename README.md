# strike-dca
DCA bitcoin from Strike to a Lightning Address or LNURL.

## Usage

1. Create an account with Strike if you don't already have one https://strike.me/download/ 
1. Get a Strike API key with all the payment scopes from https://dashboard.strike.me/
1. Create a .env file with all the required env variables (see .env.example)
1. Install the dependencies using npm or yarn or whatever your heart desires
1. Make sure you have money in your Strike account
1. Run the script providing the DCA amount in sats as an argument e.g. `node index.js 5000`

I recommend setting the STRIKE_DCA_INTERVAL_IN_SECONDS value to a high number to test it out first. Oh and don't forget to turn off the script when you're done.
