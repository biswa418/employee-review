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
    }
}

const production = {
    name: 'production',
    asset_path: process.env.EMPREVIEW_ASSET_PATH,
    session_cookie_key: process.env.EMPREVIEW_SESSION_COOKIE_KEY,
    db: process.env.EMPREVIEW_DB,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream }
    }
}


module.exports = development;