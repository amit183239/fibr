const express = require('express');
const bodyParser = require('body-parser');
const Validator = require('../middlewares/Validator')
const { addAnswer, getAnswerDetails } = require('../controllers/answer');
const { requiresAuth } = require('express-openid-connect');
const Users = require('../models/user');

const answerRouter = express.Router();
answerRouter.use(bodyParser.json());

exports.verifyUser = async (userId, verifiedUser) =>{
    let userRec = await Users.findById(userId);
    if(userRec && userRec.email == verifiedUser.email){
        userRec.verified = true
        userRec.save()
        return true;
    }
    return false;
}

answerRouter.get('/:userId/quiz/:quizId', requiresAuth(), async (req, res, next) => {
    console.log("process.env.NODE_ENV"+process.env.NODE_ENV)
    if (process.env.NODE_ENV !== "testing") {
        let isUserVerified =  await this.verifyUser(req.params.userId, req.oidc.user);
        if (!isUserVerified){
            err = new Error('Unauthorized access');
            err.statusCode = 401;
            return next(err);
        }
    }

    let answerInfo = await getAnswerDetails(req.params.userId, req.params.quizId);
    if (answerInfo != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(answerInfo);
    }
    else {
        err = new Error('Answer error');
        err.statusCode = 500;
        return next(err);
    }
});

answerRouter.post('/:userId/quiz/:quizId', Validator('answer'), async  (req, res, next) => {
        let answerDetails = await addAnswer(req.params.userId, req.params.quizId , req.body);
        if (answerDetails != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(answerDetails);
        }
        else {
            err = new Error('Answer error');
            err.statusCode = 500;
            return next(err);
        }
    });

module.exports = answerRouter;