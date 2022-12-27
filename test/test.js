const expect = require('chai').expect;
const request = require('supertest');

const app = require('../app.js');
const Answers = require('../models/answer.js');
const Quizes = require('../models/quiz.js');
const Users = require('../models/user.js');
var quiz_id = 0;
var question_id = 0;
var question_id_1 = 0;

describe('Unit tests for CRUD operations on different end points', () => {
  it('OK, cannot create a new Quiz without authorization', (done)=> {
    request(app).post('/quizes')
    .send({"name":"My Quiz","instructions":"Instructions goes here","isEnabled":true,"questions":[{"question":"What is capital of AP","answers":[{"option":"new york"},{"option":"Bombay"},{"option":"Vijayawada"},{"option":"noida"}],"answer":2,"isEnabled":true,"explanation":"Something"},{"question":"What is capital of us","answers":[{"option":"new york"},{"option":"dc"},{"option":"qwer"},{"option":"mumbai"}],"answer":2,"isEnabled":true,"explanation":"Something"}],"duration":{"hours":10,"minutes":20,"seconds":30}})
    .then((res) => {
      const statusCode = res.statusCode
      expect(statusCode).equal(401);
      done();
    })
    .catch((err) => done(err));
  });

  it('OK, created a new Quiz', (done)=> {
    request(app).post('/quizes')
    .set('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=')
    .send({
      "name": "test2",
      "instructions": "first",
      "isEnabled": true,
      "questions": [
          {
              "question": "select random",
              "options": [
                  {
                      "option": "test1"
                  },
                  {
                      "option": "test2"
                  }
              ],
              "answer": [0],
              "isEnabled": true
          }
      ]
    })
    .then((res) => {
      const body = res.body
      expect(body).to.contain.property('_id');
      quiz_id = body._id;
      question_id_1 = body.questions[0]._id
      done();
    })
    .catch((err) => done(err));
  });


  it('OK, Added a new question', (done)=> {
    request(app).post('/quizes/' + quiz_id + '/questions')
    .set('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=')
    .send({
      "question": "What is capital of Japan",
      "options": [
          {
              "option": "new york"
          },
          {
              "option": "Tokyo"
          },
          {
              "option": "Vijayawada"
          },
          {
              "option": "berlin"
          }
      ],
      "answer": [2],
      "isEnabled": true
    })
    .then((res) => {
      const added = res.body.length;
      expect(added).equal(2);
      question_id = res.body[1]._id;
      done();
    })
    .catch((err) => done(err));
  });

  it('OK, Updated an existing question', (done)=> {
    request(app).put('/quizes/' + quiz_id + '/questions/' + question_id)
    .set('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=')
    .send({"question":"What is capital of Japan ??"})
    .then((res) => {
      done();
    })
    .catch((err) => done(err));
  });

  it('OK, Getting data from the end point /quizes/:quizId/questions/:questionId', (done)=> {
    request(app).get('/quizes/' + quiz_id + '/questions/' + question_id)
    .send({})
    .then((res) => {
      const statusCode = res.statusCode
      expect(statusCode).equal(200);
      done();
    })
    .catch((err) => done(err));
  });

  it('OK, Getting data from the end point /quizes/:quizId/questions', (done)=> {
    request(app).get('/quizes/' + quiz_id + '/questions')
    .send({})
    .then((res) => {
      const statusCode = res.statusCode
      expect(statusCode).equal(200);
      done();
    })
    .catch((err) => done(err));
  });

  it('OK, Getting data from the end point /quizes/:quizId', (done)=> {
    request(app).get('/quizes/' + quiz_id)
    .send({})
    .then((res) => {
      const statusCode = res.statusCode
      expect(statusCode).equal(200);
      done();
    })
    .catch((err) => done(err));
  });

  it('OK, Getting data from the end point /quizes', (done)=> {
    request(app).get('/quizes')
    .send({})
    .then((res) => {
      const statusCode = res.statusCode
      expect(statusCode).equal(200);
      done();
    })
    .catch((err) => done(err));
  });

  it('OK, Deleted a question from a quiz', (done)=> {
    request(app).delete('/quizes/' + quiz_id + '/questions/' + question_id)
    .set('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=')
    .send({})
    .then((res) => {
      const afterDeletion = res.body.questions.length;
      expect(afterDeletion).equal(2);
      done();
    })
    .catch((err) => done(err));
  });

  it('OK, Share the quiz', (done)=> {
    request(app).post('/quizes/' + quiz_id+"/share")
    .set('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=')
    .send({
      email: ['a@g.com', 'b@g.com']
    })
    .then((res) => {
      const statusCode = res.statusCode
      expect(statusCode).equal(200);
      done();
    })
    .catch((err) => done(err));
  });

  it('OK, get quiz answer details', (done)=> {
    request(app).get('/quizes/' + quiz_id+"/answer-details")
    .set('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=')
    .then((res) => {
      const statusCode = res.statusCode
      expect(statusCode).equal(200);
      done();
    })
    .catch((err) => done(err));
  });

  it('OK, add answer to the quiz ', async () =>{
    let user = await Users.findOne({email: 'a@g.com'})
    let res = await request(app).post('/answer/'+user.id+'/quiz/' + quiz_id)
      .send({
        "questionAnswered" : [
            {
                "questionId": question_id,
                "optionSelected": [0]
            }
        ]
    });
    if(res){
      const statusCode = res.statusCode
      expect(statusCode).equal(200);
    };
  });

  it('OK, add answer to the quiz twice ', async () =>{
    let user = await Users.findOne({email: 'a@g.com'})
    let res = await request(app).post('/answer/'+user.id+'/quiz/' + quiz_id)
      .send({
        "questionAnswered" : [
            {
                "questionId": question_id,
                "optionSelected": [0]
            }
        ]
    });
    if(res){
      const statusCode = res.statusCode
      expect(statusCode).equal(200);
    };
  });

  it('OK, add answer to the quiz first question ', async () =>{
    let user = await Users.findOne({email: 'a@g.com'})
    let res = await request(app).post('/answer/'+user.id+'/quiz/' + quiz_id)
      .send({
        "questionAnswered" : [
            {
                "questionId": question_id_1,
                "optionSelected": [0]
            }
        ]
    });
    if(res){
      const statusCode = res.statusCode
      expect(statusCode).equal(200);
    };
  });

  // it('OK, get answer to the quiz ', async () =>{
  //   let user = await Users.findOne({email: 'a@g.com'})
  //   let res = await request(app).get('/answer/'+user.id+'/quiz/' + quiz_id);
  //   if(res){
  //     const statusCode = res.statusCode
  //     expect(statusCode).equal(200);
  //   };
  // });



});

after(async () => {
  try {
    await Quizes.remove();
    await Users.remove();
    await Answers.remove();
  } catch (err) {
    console.error(err);
  }
});