import wordcountEndpoint from '../endpoints/wordscount.endpoint';
import express from 'express';

const router = express.Router();
router.get('/getWordsCount', wordcountEndpoint.getWordsCount);

export default router;