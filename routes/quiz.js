const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const Validator = require('../middlewares/Validator')

const Quizes = require("../models/quiz");
const { getQuizes, getQuizById, createQuiz, addQuestionsToQuiz, updateQuestion, deleteQuestionFromQuiz, getScores, shareQuiz, getQuestionDetails } = require('../controllers/quiz');

const quizRouter = express.Router();
quizRouter.use(bodyParser.json());

quizRouter.get('/', async (req, res, next) => {
    let quizInfo = await getQuizes();
    res.statusCode = 200;
    res.json(quizInfo);
})

quizRouter.post('/', authenticate.verifyUser, Validator('quiz'),async  (req, res, next) => {
    let quizDetails = await createQuiz(req.body);
    res.statusCode = 200;
    res.json(quizDetails);
})

quizRouter.delete('/', authenticate.verifyUser, (req, res, next) => {
    Quizes.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)).catch((err) => next(err));
});


quizRouter.get('/:quizId' ,async (req, res, next) => {
    let quizDetails = await getQuizById(req.params.quizId);
    if (quizDetails != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(quizDetails);
    }
    else {
        err = new Error('Quiz ' + req.params.quizId + ' not found');
        err.statusCode = 404;
        return next(err);
    }
})

quizRouter.post('/:quizId/share' , Validator('user'),async (req, res, next) => {
    shareQuiz(req.params.quizId, req.body);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({message: "sharing quiz"});
})

// quizRouter.delete('/:quizId', authenticate.verifyUser, (req, res, next) => {
//     Quizes.findByIdAndRemove(req.params.quizId)
//         .then((quiz) => {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(quiz);
//         }, (err) => next(err)).catch((err) => next(err));
// });

quizRouter.get('/:quizId/answer-details', async (req,res, next) =>{
    let details =  await getScores(req.params.quizId);
    if (details != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(details);
    }
    else {
        err.statusCode = 500;
        return next(err);
    }
})

quizRouter.get('/:quizId/questions', async (req, res, next) => {
    let quiz = await getQuizById(req.params.quizId)
    if (quiz != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(quiz.questions);
    }
    else {
        err = new Error('Quiz Error');
        err.statusCode = 500;
        return next(err);
    }
})

quizRouter.post('/:quizId/questions', authenticate.verifyUser, Validator('question'), async (req, res, next) => {
    let quiz = await addQuestionsToQuiz(req.params.quizId, req.body)
    if (quiz != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(quiz.questions);
    }
    else {
        err = new Error('Quiz Error');
        err.statusCode = 500;
        return next(err);
    }
})

quizRouter.get('/:quizId/questions/:questionId', async(req, res, next) => {

    let quizRes = await getQuestionDetails(req.params.quizId, req.params.questionId)
    if (quizRes != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(quizRes);
    }
    else {
        err = new Error('Quiz Error');
        err.statusCode = 500;
        return next(err);
    }
})

quizRouter.put('/:quizId/questions/:questionId', authenticate.verifyUser, async (req, res, next) => {
    let quizRes = await updateQuestion(req.params.quizId, req.params.questionId, req.body)
    if (quizRes != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(quizRes);
    }
    else {
        err = new Error('Quiz Error');
        err.statusCode = 500;
        return next(err);
    }
})

quizRouter.delete('/:quizId/questions/:questionId', authenticate.verifyUser, async (req, res, next) => {

    let quizRes = await deleteQuestionFromQuiz(req.params.quizId, req.params.questionId)
    if (quizRes != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(quizRes);
    }
    else {
        err = new Error('Quiz Error');
        err.statusCode = 500;
        return next(err);
    }
});


module.exports = quizRouter;