import wordCountModule from '../modules/wordcount.module';

async function getWordsCount(req, res) {
    let result = await wordCountModule.getWordsCount('TheKingJamesBible.txt');
    res.json(result);
}

export default {getWordsCount};