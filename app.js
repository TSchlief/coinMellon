import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import  CoinData  from './public/js/coinData.js';
import { error } from 'console';


const app = express();
const port = 3000;
const __dir = dirname(fileURLToPath(import.meta.url));
const __views = __dir + "/src/views";
const coinGeckoAPI = "https://api.coingecko.com/api/v3/";

const users = [
    {
        id: 1,
        firstname: "Test",
        lastname: "Account",
        username: 'test@coinmellon.com',
        password: '$2b$10$hI3TB2x03ZMq0TA3os4WK.6BxW3P75GSOI0gZ5afbyWPVjp3vJhQm', //1234
        assets: {
            "usd": 1000,
            "ripple": 2000,
            "gala": 30000
        }
    }
];

const requireAuth = (req, res, next) => {
    next();
    if (req.session && req.session.user) {
      return next();
    }
    res.redirect('/login');
};

const authenticateUser = (req, res, next) => {
    if (req.session && req.session.user) {
      res.locals.user = req.session.user; 
    }
    next();
};

const coinData= new CoinData();

//original function but doesnt work with rate limit
/*async function getPrices(req, res, next){
    try {
        let tickers = coinData.getTickers();
        tickers.shift();
        let coinsQuery = tickers.join("%2C");
        let queryString =  coinGeckoAPI +
            "/coins/markets?vs_currency=usd&ids=" +
            coinsQuery + 
            "&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";

        const result = await axios.get(queryString);
        coinData.updatePrices(result.data);
        res.locals.coinData = coinData;
        console.log(coinData);
        
        
    } catch (error) {
        console.error('Error fetching tickers:', error.message);
        
    }
    next();
}*/

//temp function to call just once for prices due to rate limit
async function setPrices(){
    try {
        let tickers = coinData.getTickers();
        tickers.shift();
        let coinsQuery = tickers.join("%2C");
        let queryString =  coinGeckoAPI +
            "/coins/markets?vs_currency=usd&ids=" +
            coinsQuery + 
            "&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";

        //const result = await axios.get(queryString);
        
    } catch (error) {
        console.error('Error fetching tickers:', error.message);
        
    }
} 
setPrices();

//temp middleware to set coindata locals
async function getPrices(req, res, next){
    res.locals.coinData = coinData;
    next();
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(getPrices);
app.use(session({
    secret: "wild-mushroom",
    resave: false,
    saveUninitialized: true
}));
app.use(authenticateUser);

app.listen(3000, (e)=> {
    if(e) throw e;
});

app.get("/", async (req, res)=>{
    res.render(__views + "/home.ejs");
});

app.get("/buy", requireAuth, (req, res)=>{
    const coinTicker = req.query.coin;
    res.render(__views + "/buy.ejs", { coinTicker });
});


app.get("/sell", requireAuth, (req, res)=>{
    const coinTicker = req.query.coin;
    res.render(__views + "/sell.ejs", { coinTicker });
});

app.get("/forgot-password", (req, res)=>{
    res.render(__views + "/forgotPassword.ejs");
});



app.get("/dashboard", requireAuth, (req, res)=>{
    res.render(__views + "/dashboard.ejs");
});

app.get("/fees", (req, res)=>{
    res.render(__views + "/fees.ejs");
});

app.get("/coin-pricing", (req, res)=>{
    res.render(__views + "/coinPricing.ejs");
});

app.get("/login", (req, res)=>{
    res.render(__views + "/login.ejs");
});

app.get("/settings", requireAuth, (req, res)=>{
    res.render(__views + "/settings.ejs");
});


app.get("/sign-up", (req, res)=>{
    res.render(__views + "/sign-up.ejs");
});

app.get("/about", async (req, res)=>{
    res.render(__views + "/about.ejs");
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});

app.post("/buy", requireAuth, (req, res)=>{
    const coinTicker = req.query.coin;
    const user = users[req.session.user.id-1];
    if(coinData.isCoin(coinTicker)){
        let amountUSD = parseFloat(req.body.amount);
        amountUSD = parseFloat(amountUSD.toFixed(2));
        let coinPrice = parseFloat(coinData.coinList[coinTicker].price);
        let amountCoin = parseFloat((amountUSD / coinPrice));
        amountCoin = amountCoin - (amountCoin * 0.01);
        if (amountUSD > user.assets.usd){
            amountUSD = user.assets.usd;
        }
        user.assets.usd -= amountUSD;
        if(user.assets[coinTicker]){
            user.assets[coinTicker] += amountCoin;
        } else{
            user.assets[coinTicker] = amountCoin;
        }
        req.session.user = user;

        res.redirect("/dashboard");
    } else{
        res.render(__views + "/buy.ejs", { coinTicker });
    }
});

app.post("/sell", requireAuth, (req, res)=>{
    const coinTicker = req.query.coin;
    const user = users[req.session.user.id-1];
    if(coinData.isCoin(coinTicker)){
        let amountCoin = parseFloat(req.body.amount);
        let coinPrice = parseFloat(coinData.coinList[coinTicker].price);
        let amountUSD = parseFloat((amountCoin * coinPrice));
        amountUSD = amountUSD - (amountUSD * 0.01);
        amountUSD = parseFloat(amountUSD.toFixed(2));
        if (amountCoin > user.assets[coinTicker]){
            amountCoin = user.assets[coinTicker];
        }
        user.assets.usd += amountUSD;
        user.assets[coinTicker] -= amountCoin;
        req.session.user = user;
        res.redirect("/dashboard");
    } else{
        res.render(__views + "/sell.ejs", { coinTicker });
    }
});

app.post("/sign-up", (req, res)=>{
    const { username, firstname, lastname, password, confirmPassword } = req.body;
    if(users.find(user => user.username === username)){
        res.render(__views + "/sign-up.ejs", {invalid: "Email already used."});
    }else if(password !== confirmPassword){
        res.render(__views + "/sign-up.ejs", {invalid: "Passwords do not match."});
    }else{
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = {
            id: users.length + 1,
            username: username,
            firstname: firstname,
            lastname: lastname,
            password: hashedPassword,
            assets: {
                "usd": 1000,
            }
        };
        users.push(newUser);
        req.session.user = newUser;
        res.redirect("/dashboard");
    }
});

app.post("/login", (req, res)=>{
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        
        res.redirect("/dashboard");
    } else {
        res.render(__views + "/login.ejs", {invalid: "Email or password incorrect."});
    }
});

