/**
 *
 * STT Micrososervice is a tiny microservice for BHT-Bot
 *
 * Contributers
 * - Robert Halwaß 2020
 */

/* Init environment from .env for non-docker */
import {config as dotenvConfig} from 'dotenv';
dotenvConfig();

const DeepSpeech = require('deepspeech');
const MemoryStream = require('memory-stream');
const Duplex = require('stream').Duplex;
const Sox = require('sox-stream');

let modelPath = 'german.pb';

let model = new DeepSpeech.Model(modelPath);

let scorerPath = 'german.scorer';

model.enableExternalScorer(scorerPath);

let desiredSampleRate = model.sampleRate();

const soxConfig = {
    global: {
        'no-dither': true,
    },
    output: {
        bits: 16,
        rate: desiredSampleRate,
        channels: 1,
        encoding: 'signed-integer',
        endian: 'little',
        compression: 0.0,
        type: 'raw'
    }
};

function bufferToStream(buffer) {
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

function translate(buffer: Buffer, callback: (result: string) => void): void{
    let start = Date.now();
    const audioStream = bufferToStream(buffer).pipe(Sox(soxConfig)).pipe(new MemoryStream());
    audioStream.on('finish', async () => {
        let audioBuffer = audioStream.toBuffer();
        let result = await model.stt(audioBuffer);
        console.log('Result:', result);
        console.log("Berechnungszeit:", Date.now() - start);
        callback(result);
    });
}

const translatePromise = (buffer: Buffer)=> new Promise<string>((resolve, reject) => { translate(buffer, resolve) })

/* Init Service */
import {Service, AppConfig} from '@bhtbot/bhtbotservice';
const config = new AppConfig();
config.port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = new Service('sttService', config);

/* Listen on endpoint /stt */
app.fileUploadEndpoint('stt', async (req, answ) =>{
    let buffer = req.files.audio.data;
    return answ.setContent(await translatePromise(buffer)).setCacheable(false).addHistory('stt');
});

/* Start server */
app.start();
