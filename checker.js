const Host = require('./host');
const config = require('./config');
const request = require('request');

class Checker {
    constructor() {
        this.servers = [];
    };

    prepareChecking() {
        let arr = config?.hosts;
        arr.forEach((element) => {
            element.alive = 'unknown';
            this.servers.push(element);
        });
        return this
    };

    checkAll() {
        console.log('Starting checking hosts');
        setInterval(() => {
            let p = [];
            let servers = this.servers;
            servers.forEach((element) => {
                let host = new Host(element?.address, element?.name);
                p.push(host.checkPing());
            });
            Promise.all(p)
            .then((data) => {
                data.forEach((element) => {
                    let index = this.servers.findIndex((item, i) => {
                        return item.address === element.ip;
                    });
                    if (servers[index].alive == 'unknown') {
                        servers[index].alive = element.alive;
                    } else {
                        if (servers[index].alive !== element.alive) {
                            console.log(element.ip + ' alive: ' + element.alive);
                            let json = element.toJSON();
                            let html = element.toHTML(json);
                            let userList = config?.telegram?.users;
                            let p = [];
                            userList.forEach((id, index) => {
                                p.push(this.sendMsg(id, html, index));
                            });
                            Promise.all(p).then((data) => {});
                            servers[index].alive = element.alive;
                        }
                    }
                })
            });
        }, config.ping.interval);
    }

    sendMsg(chatId, html, interval) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                var options = {
                    'method': 'GET',
                    'url': `https://api.telegram.org/bot${config.telegram.token}/sendMessage?chat_id=${chatId}&text=${encodeURI(html)}&parse_mode=html`,
                    'headers': {
                        }
                };
                request(options, function (error, response) {
                    resolve(true);
                });
            }, interval*1000);
        })
    }

}

module.exports = Checker;