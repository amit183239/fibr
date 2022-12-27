const Quizes = require("../models/quiz");
const Answers = require("../models/answer")

exports.getAnswerDetails =  async (userId, quizId) =>{
    let answerRec = await Answers.findOne({quizId, userId});

    let quizDetails  =  await Quizes.findById(quizId)
    answerRec = JSON.parse(JSON.stringify(answerRec))
    for(let i=0; i<answerRec.questionAnswered.length; i++){
        answerRec.questionAnswered[i]['questionDetails']= quizDetails.questions.id(answerRec.questionAnswered[i].questionId)
    }
    return answerRec;
}

exports.addAnswer = async (userId, quizId, answerBody) =>{
    try{
        let answerRec = await Answers.findOneAndUpdate({quizId, userId}, {},
            {
                upsert: true,
                new: true
            }
        );

        if (answerBody.questionAnswered ){
            for(let i=0; i<answerBody.questionAnswered.length; i++){
                let answerSubmittedFlag = await checkIfAnswerSubmittedAlready(answerBody.questionAnswered[i].questionId, answerRec);
                if(!answerSubmittedFlag){
                    let score = await validateAnswerAndUpdateScore(quizId, answerBody.questionAnswered[i], answerRec.score)
                    answerRec.questionAnswered.push(answerBody.questionAnswered[i])
                    answerRec.score = score
                    await answerRec.save();
                }
            }
        }
        return answerRec;
    }catch(err){
        console.log(JSON.stringify(err))
        return "error in updating answer for user:"+userId;
    }
}

async function validateAnswerAndUpdateScore(quizId, questionAnsweredBody, score){
    // let score = score
    let questionId = questionAnsweredBody.questionId;
    let quizRec = await Quizes.findById(quizId)
    if (quizRec) {
        if(quizRec.questions.id(questionId)!=null){
            let validAnswer  = quizRec.questions.id(questionId).answer;
            console.log("questionAnsweredBody.optionSelected:"+JSON.stringify(questionAnsweredBody.optionSelected))
            console.log("validAnswer:"+JSON.stringify(validAnswer));
            if (JSON.stringify(questionAnsweredBody.optionSelected) == JSON.stringify(validAnswer)){
                score = score+1;
                console.log("validAnswer:"+validAnswer);
            }
        }
    }
    return score;
}

async function checkIfAnswerSubmittedAlready(questionId, answerRec){
    let answeredQuestionIds = answerRec.questionAnswered.map(a=> a.questionId);
    if(answeredQuestionIds.indexOf(questionId) == -1){
        return false;
    }
    return true;
}