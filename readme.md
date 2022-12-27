    -Install nodejs in the system if not present, install mongodb
    -Run npm install
    -Create .env file with following keys
        DATABASE_URL={mongodb://localhost:27017/quiz }
        PORT=3333
        CLIENT_ID={authoClientId}
        ISSUER_BASE_URL=https://{autho Issuer base url}
        SECRET={some secret for auth0}
        BASE_URL=http://localhost:3333
        DATABASE_URL_TEST={mongodb://localhost:27017/quiz_test}
    -Run npm start, the server will be running
    -To get the coverage, run npm test
    -Postman collection is also there, quiz.postman_collection.json to get the necessary API

