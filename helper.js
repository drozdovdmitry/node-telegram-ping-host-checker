const config = require('./config.json');

if (!config?.telegram?.token) {
    console.warn('Telegram token is not installed in config.json');
    process.exit();
}

if (!config?.ping?.timeout) {
    console.warn('Timeout for pingchecker is not installed in config.json');
    process.exit();
}


if (config?.hosts?.length == 0) {
    console.warn('There are no servers in config.json');
    process.exit();
}