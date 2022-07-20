const express = require('express');
const app = express();
const itemRoutes = require('./itemRoutes')
const ExpressError = require("./expressError")
const morgan = require('morgan');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(morgan("dev"));

app.use("/items", itemRoutes);

// 404 handler
app.use(function (req, res, next){
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)});


// global error handler
app.use(function(err, req, res, next){
    // the default status is 500 Internal Server Error
    let status = err.status;
    let message = err.message;
    // set the status and alert the user
    return res.status(status).json({error: {
        message, status}});});


module.exports=app;

