import wordCountModule from '../modules/wordcount.module';

async function getWordsCount(req, res) {
    let result = await wordCountModule.getWordsCount('http://www.gutenberg.org/cache/epub/10/pg10.txt');
    res.json(result);
}

export default {getWordsCount};