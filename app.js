const { sendResponse, AppError } = require("./helpers/utils.js")
require(
    "dotenv"
).config()
const cors = require("cors")

const AuthRoute = require('./routes/AuthRoute');
const UserRoute = require('./routes/UserRoute.js')
const PostRoute = require('./routes/PostRoute.js')
const UpLoadRoute = require('./routes/UpLoadRoute.js')
const ChatRoute = require("./routes/ChatRoute.js")
const MessageRoute = require("./routes/MessageRoute.js")
const CommentRoute = require("./routes/CommentRoutes.js");

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

app.use('/images', express.static('images'))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())
const mongoose = require("mongoose")
/* DB connection*/
const mongoURI = process.env.MONGODB_URI;
mongoose
    .connect(mongoURI)
    .then(() => console.log(`DB connected ${mongoURI}`))
    .catch((err) => console.log(err));


app.use('/', indexRouter);
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/upload', UpLoadRoute);
app.use('/chat', ChatRoute);
app.use('/message', MessageRoute);
app.use('/comments', CommentRoute);


// catch 404 and forard to error handler
app.use((req, res, next) => {
    const err = new AppError(404, "Not Found", "Bad Request");
    next(err);
});

/* Initialize Error Handling */
app.use((err, req, res, next) => {
    console.log("ERROR", err);
    return sendResponse(
        res,
        err.statusCode ? err.statusCode : 500,
        false,
        null,
        { message: err.message },
        err.isOperational ? err.errorType : "Internal Server Error"
    );
});



module.exports = app;
