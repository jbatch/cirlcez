#! /bin/bash

git pull && yarn build && pm2 restart circlez && pm2 logs circlez