const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access-log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: 'assets',
    session_cookie_key: 'something',
    db: 'empReview_development',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream }
    },
    mongoURL: 'mongodb://127.0.0.1:27017/empReview_development'
}

const production = {
    name: 'production',
    asset_path: process.env.EMPREVIEW_ASSET_PATH,
    session_cookie_key: process.env.EMPREVIEW_SESSION_COOKIE_KEY,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream }
    },
    mongoURL: `mongodb+srv://admin:${process.env.EMPREVIEW_DB}@placement.jdhzqhg.mongodb.net/employee_review?retryWrites=true&w=majority`
}


module.exports = development;