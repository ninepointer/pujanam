const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");
const hpp = require("hpp")
const { zerodhaAccountType } = require("./constant")
const Product = require('./models/Product/product');
async function commonProcess() {
    // await setIOValue();


    
    // app.use(express.json({ limit: "20kb" }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb' }));
    
    app.use(cors({
        credentials: true,

        // origin: "http://3.7.187.183/"  // staging
        // origin: "http://3.108.76.71/"  // production
        origin: 'http://localhost:3000'

    }));
    app.use(require("cookie-parser")());

    app.use(mongoSanitize());
    app.use(helmet());
    app.use(xssClean());
    app.use(hpp());


    app.get('/api/v1/servertime', (req, res, next) => { res.json({ status: 'success', data: new Date() }) })
    app.get('/api/v1/product', async (req, res, next) => { res.json({ status: 'success', data: await Product.find() }) })

    app.use('/api/v1', require("./routes/user/signedUpUser"))
    app.use('/api/v1', require("./routes/user/userLogin"));
    app.use('/api/v1', require('./routes/user/userDetailAuth'));
    app.use('/api/v1', require("./routes/user/everyoneRoleAuth"));
    app.use('/api/v1/pandit', require("./routes/Pandit/pandit"));
    app.use('/api/v1/tier', require("./routes/Tier/tier"));
    app.use('/api/v1/pooja', require("./routes/Pooja/pooja"));
    app.use('/api/v1/booking', require("./routes/Booking/booking"));
    app.use('/api/v1/devta', require("./routes/DeviDevta/devi-devta"));
    app.use('/api/v1/carousels', require("./routes/carousel/carouselRoutes"));
    app.use('/api/v1/mandir', require("./routes/Mandir/mandir"));

    app.use('/api/v1/dailycontest', require("./routes/DailyContest/dailyContestRoutes"))
    app.use('/api/v1/user', require("./routes/user/userRoutes"));
    // app.use('/api/v1/signup', require("./routes/UserRoute/signUpUser"));
    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT);

    
    // await pendingOrderMain();

}

module.exports = { commonProcess }
