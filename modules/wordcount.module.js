import fs from 'fs';
import path from 'path';
import moment from 'moment';
import readline from 'readline';
const {promisify} = require('util'); 
const request = require('request');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const dataPath = path.join(__dirname, '../data/');
if (!fs.existsSync(dataPath)){
    fs.mkdirSync(dataPath);
}
const totalResults = {};

async function getWordsCount(url){
    if(!url) return { error: 'invalid url'}
    // if we have updated cache response return it
    if(totalResults[url] && totalResults[url]['expiry'] && moment().isBefore(totalResults[url]['expiry']) &&
     fs.existsSync(totalResults[url]['path'])) {
        const fileData = await readFileAsync(totalResults[url]['path'], 'utf8');
        return JSON.parse(fileData);
    }

    const countResults = {};
    const readlinePromise = new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: request.get(url).on('error', (err) => reject(err)) 
        });
        rl.on('line', (line) => {
            const mappedResource = line? line.split(/\s+/) : [];
            mappedResource.forEach(word => { 
                const alphaChars = word.match(/[a-z]/gi, '');
                if (!alphaChars) return;
                let alphaWord = alphaChars.join('');
                if (!countResults[alphaWord]) countResults[alphaWord]= {count:0, word: alphaWord};
                countResults[alphaWord].count +=1;
            });
        })
        .on('close', () => resolve());
    });

    try { 
        await readlinePromise;
    } catch(e) {
        return { error: `Couldn't parse data. Error: ${e.message}`};
    }

    Object.keys(countResults).forEach(key => {
        countResults[key].isPrime = isPrime(countResults[key].count);
    });

    const savedResultPath = path.join(dataPath + Buffer.from(url).toString('base64')) + '.json';
    await writeFileAsync(savedResultPath, JSON.stringify(countResults));
    totalResults[url] = {expiry: moment().add(3, 'hours'), path: savedResultPath};
    return countResults;
}

function isPrime(number) {
    const sqrtNum=Math.floor(Math.sqrt(number));
    let prime = number != 1;
        for(let i=2; i<sqrtNum+1; i++) {
            if(number % i == 0) {
                prime = false;
                break;
            }
        }
    return prime;
}

export default {getWordsCount};