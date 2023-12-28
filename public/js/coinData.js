export const coinList = {
    'usd': { name: 'USD ', price: "1.00", symbol: "USD", svg: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"},
    'BTC-USD': { name: 'Bitcoin', price: null, symbol: "BTC", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d126235f4853_btc.svg"},
    'ETH-USD': { name: 'Ethereum', price: null, symbol: "ETH", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d135455f4830_eth.svg"},
    'ADA-USD': { name: 'Cardano', price: null, symbol: "ADA", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d1b8525f4840_ada.svg"},
    'XRP-USD': { name: 'Xrp', price: null, symbol: "XRP", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d13e655f483e_xrp.svg"},
    'GALA-USD': { name: 'Gala', price: null, symbol: "GALA", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d14eb95f48c1_gala-139.svg"},
    'DOGE-USD': { name: 'Dogecoin', price: null, symbol: "DOGE", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d140395f4848_doge.svg"},
    'DOT-USD': { name: 'Polkadot', price: null, symbol: "DOT", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d130a55f4837_dot.svg"},
    'UNI-USD': { name: 'Uniswap', price: null, symbol: "UNI", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d165645f4838_uni.svg"},
    'LTC-USD': { name: 'Litecoin', price: null, symbol: "LTC", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d17d2c5f4847_ltc.svg"},
    'LINK-USD': { name: 'Chainlink', price: null, symbol: "LINK", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d139905f4842_link.svg"},
    'BCH-USD': { name: 'Bitcoin Cash', price: null, symbol: "BCH", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d15f0d5f483d_bch.svg"},
    'SOL-USD': { name: 'Solana', price: null, symbol: "SOL", svg: "https://assets-global.website-files.com/618f5135a46a31556f014bd3/62057b133192663331e1bebc_SOL.svg"},
    'MATIC-USD': { name: 'Polygon', price: null, symbol: "MATIC", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d111365f4831_matic.svg"},
    'AAVE-USD': { name: 'Aave', price: null, symbol: "AAVE", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d1a7495f4841_aave.svg"},
    'XLM-USD': { name: 'Stellar', price: null, symbol: "XLM", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d13c805f4846_xlm.svg"},
    'TRX-USD': { name: 'TRON', price: null, symbol: "TRX", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d18f7c5f48b5_trx-139.svg"},
    'XTZ-USD': { name: 'Tezos', price: null, symbol: "XTZ", svg: "https://assets-global.website-files.com/618f5135a46a31556f014bd3/64b1b15d2089e3b35e7f6157_XTZ%20token.svg"},
    'ALGO-USD': { name: 'Algorand', price: null, symbol: "ALGO", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d1ef715f48bf_algo.svg"},
    'GRT-USD': { name: 'The Graph', price: null, symbol: "GRT", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d1016d5f482a_grt.svg"},
    'BAT-USD': { name: 'B.A.T', price: null, symbol: "BAT", svg: "https://assets-global.website-files.com/63a22878d7b6d183285f4638/63a22878d7b6d1576d5f482d_bat.svg"},
    'NEAR-USD': { name: 'Near Protocol', price: null, symbol: "NEAR", svg: "https://assets-global.website-files.com/618f5135a46a31556f014bd3/64af0bcd091a82c532df89ea_NEAR.svg"},
    'APE-USD': { name: 'Bored Ape', price: null, symbol: "APE", svg: "https://assets-global.website-files.com/618f5135a46a31556f014bd3/6279271d4a26f36163e31cd3_APE2.svg"},
  };

export default class CoinData {
    constructor(){
        this.coinList = coinList;
        
    }

    updatePrices(data) {
        for (let i = 0; i < data.length; i++) {
            const ticker = data[i];
            const symbol = ticker.symbol;
            if (Object.keys(this.coinList).includes(symbol) ) {
                let price = parseFloat(ticker.last_trade_price);
                if(price <= 1) {
                    price = price.toFixed(3);
                } else {
                    price = price.toFixed(2);
                }
                
                this.coinList[symbol].price = price;
            }
        }
    }

    getCoin(ticker){
        return this.coinList[ticker];
    }

    getTickers(){

        return Object.keys(this.coinList);
    }

    isCoin(ticker){
        if(this.coinList[ticker]){
            return true;
        }
        return false;
    }

    roundFigs(value, sigFigs) {
        
        let number = parseFloat(value);
        console.log("sigfigs",typeof value)
        console.log("sigfigs",value)
        if(number === 0){
            return 0;
        }
        let stringValue = value.toString();
        
        // Determine the number of significant figures
        let significantFigures = 0;
        let nonZeroFound = false;
    
        for (let i = 0; i < stringValue.length; i++) {
            if (stringValue[i] === '0' && !nonZeroFound) {
                // Ignore leading zeros
            } else if (stringValue[i] !== '.') {
                // Count digits (excluding the decimal point)
                significantFigures++;
                nonZeroFound = true;
            }
    
            if (significantFigures === sigFigs) {
                // Break once the desired number of significant figures is reached
                break;
            }
        }
    
        // Round the combined value to the specified number of significant figures
        let roundedValue = parseFloat(number.toPrecision(significantFigures));
    
        return roundedValue;
    }

}

