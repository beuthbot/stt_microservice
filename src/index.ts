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

function bufferToStream(buffer) {
	let stream = new Duplex();
	stream.push(buffer);
	stream.push(null);
	return stream;
}

async function translate(buffer: string): Promise<string>{
    let audioStream = new MemoryStream();
    bufferToStream(buffer).pipe(Sox({
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
    })).pipe(audioStream);

    return audioStream.on('finish', () => {
        let audioBuffer = audioStream.toBuffer();
        let result = model.stt(audioBuffer);
        console.log('Result:', result);
        return result;
    }); 
}

/* Init Service */
import {Service, AppConfig} from '@bhtbot/bhtbotservice';
const config = new AppConfig();
config.port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = new Service('sttService', config);

/* Listen on endpoint /stt */
app.fileUploadEndpoint('stt', async (req, answ)=>{
    let buffer = req.files.audio.data;
    answ.setHistory()
    return answ.setContent(await translate(buffer)).setCacheable(false).addHistory('STT');
});

/* Start server */
app.start();