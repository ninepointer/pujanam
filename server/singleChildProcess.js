const nodeCron = require("node-cron");

const { zerodhaAccountType } = require("./constant")
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");
const hpp = require("hpp")

async function singleProcess() {










    // const dailyContesttimeStore = nodeCron.schedule(`*/5 * * * * *`, dailyContestTradeCut);
    // const dailyContest = nodeCron.schedule(`*/59 * * * * *`, dailyContestTimeStore);


    app.get('/api/v1/servertime', (req, res, next) => { res.json({ status: 'success', data: new Date() }) })
    app.use(express.json({ limit: "10mb" }));
    app.use(require("cookie-parser")());
    app.use(cors({
        credentials: true,
        
        // origin: "http://3.7.187.183/"  // staging
        // origin: "http://3.108.76.71/"  // production
        origin: 'http://localhost:3000'
        
    }));
    
    app.use(mongoSanitize());
    app.use(helmet());
    app.use(xssClean());
    app.use(hpp());

    app.use('/api/v1', require("./routes/user/signedUpUser"))
    app.use('/api/v1', require("./routes/user/userLogin"));
    app.use('/api/v1', require('./routes/user/userDetailAuth'));
    app.use('/api/v1', require("./routes/user/everyoneRoleAuth"));
    app.use('/api/v1/pandit', require("./routes/Pandit/pandit"));
    app.use('/api/v1/tier', require("./routes/Tier/tier"));
    app.use('/api/v1/pooja', require("./routes/Pooja/pooja"));

    app.use('/api/v1/dailycontest', require("./routes/DailyContest/dailyContestRoutes"))
    app.use('/api/v1/user', require("./routes/user/userRoutes"));
    app.use('/api/v1/signup', require("./routes/UserRoute/signUpUser"));


    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT);


    if(process.env.CHART === "true"){
        webSocketService.init(io);
    }

    // notificationSender().then(()=>{});
}



module.exports = { singleProcess }
