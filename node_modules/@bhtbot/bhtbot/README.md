# BHT Chat-Bot Library

## Purpose

This library is meant to kickstart new BHT-Bot Chat-Client Applications (and reduce redundancy ofc)

You can setup a new Client in just a few lines of code. All you have to care about is the implementation of your specific Chat-Protocol, while Gateway Communication and Types are offered by the library.

The library contains CommonJS and ES-Modules bundles.

## Usage

### Install

Add to your script like you typically do
```
npm i @bhtbot/bhtbot 
 # or
yarn add @bhtbot/bhtbot
```

### Example Request

```
import BHTBot from '@bhtbot/bhtbot';
const {Gateway, BotRequest} = BHTBot;
const bot = new Gateway('http://localhost:3000', 'nameOfService');

async function queryBot(userId, message){
    const message = new BotRequest({
        text: message,
        serviceUserId: userId,
    });
    return await bot.query(message);
}

queryBot(333, 'Wie wird das Wetter morgen?').then(response=>{
    console.log(response);
});
```

## Contribution

### Lint

... TODO

### Build

... TODO

### Test

... TODO

### Versioning

... TODO

### Deployment

... TODO

### Credits 
Credits to Bitjson for providing a mature Typescript starter template https://github.com/bitjson/typescript-starter
Initial Work by Dennis Walz
