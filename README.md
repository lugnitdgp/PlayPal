# PlayPal

![](https://github.com/lugnitdgp/PlayPal/blob/master/public/Demo.gif)
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
<br>
[![GSoC Heat 2021](https://img.shields.io/badge/GSOC%20HEAT-2021-orange)](https://nitdgpos.github.io/gsoc_heat)
<br>
[![forthebadge](https://forthebadge.com/images/badges/uses-html.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-css.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-git.svg)](https://forthebadge.com)


An app for finding songs later to be added to a playlist where they will be playable

## Contribution guidelines
Kindly follow [contributing.md](contributing.md), if you want to lend a hand in making this project better.

## Build Setup

### Requirements:

* NodeJS
   - [guide](https://nodejs.org/en/download/)
 
* npm
   - [guide](https://docs.npmjs.com/cli/install)
 
* Mongodb
  - The database used in the app is MongoDB, so it must be configured on you local machine. Follow the [guide](https://docs.mongodb.com/manual/administration/install-on-linux/) if you dont have MongoDB installed



1. Make Directory 
```bash
mkdir project
cd project
```

2. Clone the Repository
```bash

git clone https://github.com/lugnitdgp/PlayPal.git
```
3. Change directory
```bash
cd PlayPal
```

4. Start MongoDB
```bash
sudo service mongod start
```
5. Check Status
```bash
sudo service mongod status
```

6. Launch App by
```bash
node app.js
```

App hosted at 
```bash
http://localhost:3000/
```
