const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session');

const app = express();

const staffRoutes = require('./routes/staff')
const loginRoutes = require('./routes/login')
const upmRoutes = require('./routes/upm')
const teachersRoutes = require('./routes/teachers')
const vacationsRoutes = require('./routes/vacations')
const businessTripsRoutes = require('./routes/vacations')
const operatingRoutes = require('./routes/operating')

app.use(cookieParser());
app.use(session({secret: 'big', saveUninitialized: false, resave: false}));

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.set("view engine", "hbs");

app.get("/", function (req, res) {
    if (req.session.success) {
        res.status(200).redirect("/upm")
    } else {
        res.status(401).redirect("/login")
    }
});

app.post('/logout', (req, res) => {
    req.session.success = false;
    res.status(200).redirect("/")
})

app.use('/login', loginRoutes)
app.use('/staff', staffRoutes)
app.use('/upm', upmRoutes)
app.use('/teachers', teachersRoutes)
app.use('/vacations', vacationsRoutes)
app.use('/business-trips', businessTripsRoutes)
app.use('/operating', operatingRoutes)


app.listen(80, function () {
    console.log("Сервер ожидает подключения...");
});
