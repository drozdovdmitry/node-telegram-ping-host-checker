# Telegram host ping checker

Install nodejs (tested on Ubuntu 18.04)
```
sudo apt-get install curl -y &&
sudo curl -sL https://deb.nodesource.com/setup_14.x | bash - &&
sudo apt-get install -y nodejs &&
sudo apt install npm -y &&
sudo npm install pm2 -g &&
sudo apt-get install git -y
```

Install service
```
sudo git clone https://github.com/drozdovdmitry/node-telegram-ping-host-checker.git && 
cd node-telegram-ping-host-checker &&
sudo npm install
```

Create telegram [bot](https://www.youtube.com/watch?v=2jdsvSKVXNs/) [botfather](https://t.me/botfather)

Edit config.json
- Add telegram token without "bot" to config.json
- Add telegram user chat id to config.json
- Add server ip and name to array "hosts" to config.json

Start service
```
sudo npm start
```

Stop service
```
sudo npm stop
```

Service logs
```
suod pm2 logs
```

