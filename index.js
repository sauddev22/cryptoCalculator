require('dotenv').config();
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const {sendRequestToEtherscan, getHistoryArray} = require('./util');
const router = express.Router();


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// const corsOptions = {
//     origin: 'http://127.0.0.1:5500',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

const whitelist = ['http://127.0.0.1:5500', 'https://ehth-usd.web.app'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

router.get('/', function (req, res) {
    return res.json({foo: 'bar'});
});

app.get('/api/etherscan', cors(corsOptions), sendRequestToEtherscan);

app.get('/api/pricing', getHistoryArray);

app.post('/api/feedback', (req, res) => {
    return res.json({foo: 'bar'});
});

app.use(router);
app.listen(process.env.PORT);
console.log(`server at http://localhost:${process.env.PORT}`);