const DeepSpeech = require('deepspeech');
const Fs = require('fs');
const MemoryStream = require('memory-stream');
const Duplex = require('stream').Duplex;

let modelPath = 'german.pb';

let model = new DeepSpeech.Model(modelPath);

let scorerPath = 'german.scorer';

model.enableExternalScorer(scorerPath);

function bufferToStream(buffer) {
	let stream = new Duplex();
	stream.push(buffer);
	stream.push(null);
	return stream;
}

async function translate(file){
    const buffer = Fs.readFileSync(file);
    let audioStream = new MemoryStream();
    bufferToStream(buffer).pipe(audioStream);

    audioStream.on('finish', () => {
        let audioBuffer = audioStream.toBuffer();
        let result = model.stt(audioBuffer);
        console.log('Ergebnis:', result);
        let millis = Date.now() - start
        console.log(`Berechnungszeit: ${Math.floor(millis / 10) / 100} Sekunden`);
        return result;
    }); 
}

let file = 'test.wav';
let start = Date.now();
translate(file);
