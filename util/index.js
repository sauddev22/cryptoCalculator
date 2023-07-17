const axios = require('axios');
const qs = require('qs');

function getSeconds(d) {
    const date = new Date(d);
    const seconds = Math.floor(date.getTime() / 1000);
    return seconds;
}


module.exports.sendRequestToEtherscan = async function (req, res) {
    const address = req.query.address;
    const action = req.query.action;
    const module = 'account';
    // const page = 1;
    // const offset = 100;
    // const startblock = 0;
    // const endblock = 27025780;
    // const sort = 'asc';

    console.log('calling func sendRequestToEtherscan');
    const url = `${process.env.ETHERSCAN_ADDRESS}/api?` + qs.stringify({
        module, action, address, apikey: process.env.API_KEY
    });

    const config = {method: 'get', url, headers: {}};

    try {
        console.log('calling api Etherscan');
        const {data} = await axios(config);
        return res.send({
            called: `${address}-${action}`,
            data: JSON.stringify(data),
        });
    } catch (error) {
        res.status(500);
        console.log('api Etherscan err ', error);
        return res.send(error);
    }
};

module.exports.getHistoryArray = async function (req, res) {
    console.log('calling func getHistoryArray');
    const minTimeStamps = req.query.minTimeStamps;
    const maxTimeStamps = req.query.maxTimeStamps;
    const vs_currency = "usd";
    const from = minTimeStamps;
    const to = maxTimeStamps;
    // const from = process.env.FROM;
    // const to = process.env.TO;

    const urlForRangePriceList = `${process.env.COINGECKO_ADDRESS}/api/v3/coins/ethereum/market_chart/range?` + qs.stringify({vs_currency, from, to});
    console.log('urlForRangePriceList', urlForRangePriceList);
    const urlForLatestETHPriceUSD = `${process.env.COINGECKO_ADDRESS}/api/v3/simple/price?` + qs.stringify({ids: "ethereum", vs_currencies: vs_currency});

    try {
        console.log('calling api coingecko');
        const {data} = await axios({method: 'get', url: urlForRangePriceList, headers: {}});
        const {data: {ethereum}} = await axios({method: 'get', url: urlForLatestETHPriceUSD, headers: {}});

        const history = {};
        data.prices.map(arr => {history[new Date(arr[0]).toISOString().split('T')[0]] = arr[1].toFixed(2);});

        return res.send(JSON.stringify({
            history,
            latest: {"ethusd": ethereum.usd, "ethusd_timestamp": getSeconds(Date.now())},
            data: {},
            staked: [],
            spam: []
        }));

    } catch (error) {
        res.status(500);
        console.log('api coingecko err ', error);
        return res.send(error);
    }
};