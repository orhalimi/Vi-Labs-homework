import fs from 'fs';
import path from 'path';
const {promisify} = require('util');

const readFileAsync = promisify(fs.readFile);
const resources = {};
const resourcesPath = path.join(__dirname, '../resources/');

async function getWordsCount(filename){
    const countResults = {};
    if(!resources[filename]) {
        try{
            resources[filename] = await readFileAsync(path.join(resourcesPath, filename), 'utf8');
        } catch(e){
            return {error: `couldn't load file at path ${path.join(resourcesPath, filename)}`};
        }
    }
    const file = resources[filename];
    const mappedResource = file? file.split(/\s+/) : [];
    mappedResource.forEach(word => {
        const alphaChars = word.match(/[a-z]/gi, '');
        if (!alphaChars) return;
        let alphaWord = alphaChars.join('');
        if (!countResults[alphaWord]) countResults[alphaWord]= {count:0, word: alphaWord};
        countResults[alphaWord].count +=1;
    });
    Object.keys(countResults).forEach(key => {
        countResults[key].isPrime = isPrime(countResults[key].count);
    });
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