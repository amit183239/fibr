const Quizes = require("../models/quiz");
const Answers = require("../models/answer");
const Users = require("../models/user");

exports.getQuizes = async () =>{
    let quizRec = await Quizes.find({isEnabled : true})
    if (quizRec){
        return quizRec
    }else {
        return "";
    }
}

exports.getQuizById = async (quizId) =>{
    let quizRec = await Quizes.findById(quizId)
    if (quizRec){
        return quizRec
    }else {
        return "";
    }
}

exports.createQuiz = async (quizBody) =>{
    try{
        let quizRec = await Quizes.create(quizBody);
        return quizRec;
    }catch(err){
        console.log(JSON.stringify(err))
        return "error in creating quiz";
    }
}

exports.addQuestionsToQuiz = async (quizId, questionBody) =>{
    let quizRec = await Quizes.findById(quizId)

    if (quizRec){
        quizRec.questions.push(questionBody);
        await quizRec.save();
        let quizRec2 = await Quizes.findById(quizId)
        return quizRec2;
    }
    return null;

}

exports.deleteQuestionFromQuiz = async (quizId, questionId) =>{
    let quizRec = await Quizes.findById(quizId)

    if (quizRec) {
        if(quizRec.questions.id(questionId)!=null){
            quizRec.questions.id(questionId).remove();
            quizRec.save()

            let quizRec2 =  await Quizes.findById(quizId);
            return quizRec2;
        }
    }
    return null;
}

exports.getQuestionDetails = async(quizId, questionId) =>{
    let quizRec = await Quizes.findById(quizId)

    if (quizRec) {
        if(quizRec.questions.id(questionId)!=null){
            return quizRec.questions.id(questionId)
        }
    }
    return null;
}

exports.updateQuestion = async(quizId, questionId, questionBody) =>{
    let quizRec = await Quizes.findById(quizId)

    if (quizRec) {
        if(quizRec.questions.id(questionId)!=null){
            if (questionBody.question) {
                quizRec.questions.id(questionId).question = questionBody.question;
            }
            if (questionBody.options) {
                quizRec.questions.id(questionId).options = questionBody.options;
            }
            if (questionBody.answer) {
                quizRec.questions.id(questionId).answer = questionBody.answer;
            }
            if (questionBody.isEnabled != null) {
                quizRec.questions.id(questionId).isEnabled = questionBody.isEnabled;
            }
            quizRec.save();

            let quizRec2 =  await Quizes.findById(quizId);
            return quizRec2;
        }
    }
    return null;
}


exports.getScores = async(quizId) =>{
    let answerDetails  =  await Answers.find({
            quizId
    },{
        'userId': 1,
        'quizId': 1,
        'score':1
    });

    return answerDetails
}

exports.shareQuiz = async (quizId, users) =>{
    users.email.forEach(async email => {
        let userRec = await Users.findOneAndUpdate({email}, {email},
            {
                upsert: true,
                new: true
            }
        );

        let answerRec = await Answers.findOneAndUpdate({quizId, userId: userRec.id}, {},
            {
                upsert: true,
                new: true
            }
        );
    });
}