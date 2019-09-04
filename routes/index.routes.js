import wordcountEndpoint from '../endpoints/wordscount.endpoint';
import express from 'express';

const router = express.Router();
router.get('/getWordCount', wordcountEndpoint.getWordsCount);

export default router;