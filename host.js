const ping = require('ping');
const config = require('./config');

class Host {
    constructor(ip, name, alive) {
        this.ip = ip;
        this.name = name;
        this.alive = undefined;
        this.time_min = 0.000;
        this.time_max = 0.000;
        this.lose = 0.000;
    }

    toJSON() {
        let json = {
            ip: this.ip,
            name: this.name,
            alive: this.alive,
            time_min: this.time_min,
            time_max: this.time_max,
            lose: this.lose,
        };
        return json;
    }

    toHTML(json) {
        if (json.alive) {
            let html = `\n\n✅<b>${json.name}</b> is alive. \n`            
                + `IP: ${json.ip}\n`
                + `Min: ${json.time_min} ms\n`
                + `Max: ${json.time_max} ms\n`
                + `Lose: ${json.lose} % pct`
            return(html);
        } else {
            let html = `\n\n❌<b>${json.name}</b> is NOT alive. \n`            
                + `IP: ${json?.ip}\n`
                + `Min: - ms\n`
                + `Max: - ms\n`
                + `Lose: ${json.lose} % pct`
            return(html);
        }
    }

    checkPing() {
        return new Promise((resolve) => {
            ping.promise.probe(this.ip, {
                timeout: config.ping.timeout,
                extra: config.ping.extra
            })
            .then((res) => {
                this.alive = res.alive;
                this.time_min = res.min;
                this.time_max = res.max;
                this.lose = res.packetLoss;
                resolve(this)
            });
        });
    }
}

module.exports = Host;