const nodeCron = require("node-cron");
const Product = require('./models/Product/product');
const { zerodhaAccountType } = require("./constant")
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");
const hpp = require("hpp");
const LanguageSchema = require("./models/language");
const Setting = require("./models/setting");
const dbBackup = require("./Backup/mongoDbBackUp")

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
    app.get("/api/v1/dbbackup", async (req, res) => {
        // const sourceUri = process.env.STAGINGDB
        // const targetUri = process.env.DATABASE
        // await dbBackup.backupDatabase(sourceUri, targetUri, res);
    })
    app.get('/api/v1/product', async (req, res, next) => { res.json({ status: 'success', data: await Product.find() }) })
    app.get('/api/v1/language', async (req, res, next) => { res.json({ status: 'success', data: await LanguageSchema.find() }) })
    app.get('/api/v1/usersetting', async (req, res, next) => { res.json({ status: 'success', data: await Setting.find() }) })
    app.use('/api/v1/unknown', require("./routes/unKnownUserRoute"));

    app.use('/api/v1', require("./routes/user/signedUpUser"))
    app.use('/api/v1', require("./routes/user/userLogin"));
    app.use('/api/v1', require('./routes/user/userDetailAuth'));
    app.use('/api/v1', require("./routes/user/everyoneRoleAuth"));
    app.use('/api/v1/pandit', require("./routes/Pandit/pandit"));
    app.use('/api/v1/tier', require("./routes/Tier/tier"));
    app.use('/api/v1/pooja', require("./routes/Pooja/pooja"));
    app.use('/api/v1/booking', require("./routes/Booking/booking"));
    app.use('/api/v1/consultation', require("./routes/Consultation/consultation"));
    app.use('/api/v1/devta', require("./routes/DeviDevta/devi-devta"));
    app.use('/api/v1/itemcategory', require("./routes/ItemCategory/itemCategoryRoutes"));
    app.use('/api/v1/items', require("./routes/Item/itemRoutes"));
    app.use('/api/v1/carousels', require("./routes/carousel/carouselRoutes"));
    app.use('/api/v1/mandir', require("./routes/Mandir/mandir"));
    app.use('/api/v1/usermandir', require("./routes/Mandir/userMandir"));
    app.use('/api/v1/location', require("./routes/Location/locationRoutes"));
    app.use('/api/v1/order', require("./routes/book-order/bookOrder"));

    app.use('/api/v1/dailycontest', require("./routes/DailyContest/dailyContestRoutes"))
    app.use('/api/v1/user', require("./routes/user/userRoutes"));
    // app.use('/api/v1/signup', require("./routes/UserRoute/signUpUser"));


    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT);


    if(process.env.CHART === "true"){
        webSocketService.init(io);
    }

    // notificationSender().then(()=>{});
}



module.exports = { singleProcess }
