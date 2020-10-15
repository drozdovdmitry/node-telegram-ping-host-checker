const Host = require('./host');
const Checker = require('./checker');
const config = require('./config');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const helper = require('./helper');

let extra = Markup.keyboard([
    ['🔍 Ping hosts']
]).resize().extra()

function getHostsInfo() {
    return new Promise((resolve) => {
        let array = config?.hosts;
        let p = [];
        array.forEach((element) => {
            let host = new Host(element?.address, element?.name);
            p.push(host.checkPing());
        });
        Promise.all(p)
        .then((data) => {
            let msg = `⚠️ <b>Ping status</b>`
            data.forEach((element) => {
                let json = element.toJSON();
                let html = element.toHTML(json);
                msg = msg + html;
            });
            resolve(msg);
        })
    })
}

const bot = new Telegraf(config?.telegram?.token);

bot.start((ctx) => {
    console.log('New user: ' + ctx.message.chat.id);
    let html = `Welcome to host ping checker. You id: <b>` 
        + `${ctx.message.chat.id}</b>. Add this to array <code>telegram.users</code>`
        + ` in <b>config.json</b> and restart service`;
    ctx.replyWithHTML(html, extra);
})

bot.on('message', (ctx) => {
    let users = config.telegram.users;
    if (users.indexOf(ctx.message.chat.id) == -1) {
        console.warn('Not authorized user: ' + ctx.message.chat.id);
        let html = `You are not authorized on the service. Id: <b>`
            + `${ctx.message.chat.id} </b>. Add this to array <code>telegram.users</code>`
            + ` in <b>config.json</b> and restart service`
        ctx.replyWithHTML(html, extra);
    } else {
        console.log('Valid user: ' + ctx.message.chat.id);
        getHostsInfo()
        .then((data) => {
            ctx.replyWithHTML(data, extra);
        })
        .catch((err) => {
            ctx.replyWithHTML(`❗️ <b>Error, </b>check logs!`, extra);
        })
    }
})

bot.launch()
.then((data) => {
    let checker = new Checker();
    checker.prepareChecking()
    checker.checkAll()
    console.log('Service is started');
})