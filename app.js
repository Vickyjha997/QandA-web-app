const express=require("express");

const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();
const multer = require('multer');


const path=require("path");
const mongoose=require("mongoose");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const Student = require('./models/student'); // Assuming you have a Student model defined
const Tutor = require('./models/tutor'); // Assuming you have a Tutor model defined
const Question = require('./models/question'); // Assuming you have a Question model defined
const Support = require('./models/support'); // Assuming you have a Support model defined
const Answer = require('./models/answer'); // Assuming you have an Answer model defined
const app = express();
const port = 3000;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


mongoose.connect('mongodb://127.0.0.1:27017/QandA')
.then((res)=>{
    console.log("Connection established/Database Connected..");
}).catch((err)=>{
    console.log("Database error..");  
});

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads/');
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`);
    }
});

const upload=multer({storage:storage});

app.get('/', (req, res) => {
    res.render("home.ejs");
});

app.get('/student/register', (req, res) => {
    res.render("register-student.ejs");
});

app.get('/tutor/register', (req, res) => {
    res.render("register-tutor.ejs");
});

app.get('/student/login', (req, res) => {
    res.render("login-student.ejs");
});

app.get('/tutor/login', (req, res) => {
    res.render("login-tutor.ejs");
});

app.get('/student/:id/instant-answer',(req,res)=>{
    res.render("instant-answer.ejs");
});

app.get('/student/:id/raisequestion',(req,res)=>{
    res.render("student-question.ejs");
})



app.get('/tutor/:id/support',(req,res)=>{
    const tutorId=req.params.id;
    res.render("tutor-support.ejs",{tutorId});
})

app.get('/tutor/:id/newQuestion', async (req, res) => {
    try {
        const tutorId = req.params.id;
        const tutor = await Tutor.findById(tutorId);

        if (!tutor) {
            return res.status(404).send("Tutor not found");
        }

        const questions = await Question.find({ tutorId: undefined, subject: tutor.subject });
        console.log(questions);

        res.render("new-questions.ejs", { questions: questions });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving new questions");
    }
});

app.get('/tutor/:tid/:qid/answer', async (req, res) => {
    try {
        const tutorId = req.params.tid;
        const questionId = req.params.qid;

        // Find the question by ID
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).send("Question not found");
        }

        // Update the question with the tutorId
        question.tutorId = tutorId;
        await question.save();

        res.render("question-answer.ejs",{question});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error assigning question to tutor");
    }
});

app.get('/tutor/:id/history', async (req, res) => {
    try {
        const tutorId = req.params.id;

        // Find all answers by this tutor
        const answers = await Answer.find({ tutorId: tutorId });

        // Get the corresponding questions for these answers
        const questionAnswerData = await Promise.all(answers.map(async (answer) => {
            const question = await Question.findById(answer.questionId);
            return {
                question: question,
                answer: answer
            };
        }));

        res.render("tutor-history.ejs", { questionAnswerData: questionAnswerData });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving tutor history");
    }
});

app.get('/student/:id/history', async (req, res) => {
    try {
        const studentId = req.params.id;

        // Find all questions by this student
        const questions = await Question.find({ studentId: studentId });

        // Get the corresponding answers for these questions
        const questionAnswerData = await Promise.all(questions.map(async (question) => {
            const answer = await Answer.findOne({ questionId: question._id });
            return {
                question: question,
                answer: answer || { answerIntro: "Not Solved Yet", answerConclusion: "", answerImages: [] }
            };
        }));

        res.render("student-history.ejs", { questionAnswerData: questionAnswerData });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving student history");
    }
});

app.post('/tutor/:tid/:qid/submit-answer', upload.array('answerImages', 10), async (req, res) => {
    try {
        const tutorId = req.params.tid;
        const questionId = req.params.qid;
        const { answerIntro, answerConclusion } = req.body;
        let answerImages = [];

        if (req.files) {
            answerImages = req.files.map(file => file.filename);
        }

        const newAnswer = new Answer({
            tutorId,
            questionId,
            answerIntro,
            answerImages,
            answerConclusion
        });

        await newAnswer.save();
        console.log("Answer submitted successfully and saved to database");
        res.send("Your Answer Submitted Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error submitting answer");
    }
});

app.post('/tutor/:id/submit-support', upload.single('attachment'), async (req, res) => {
    try {
        const { email, subject, details } = req.body;
        const tutorId = req.params.id;
        let attachment = null;

        if (req.file) {
            attachment = req.file.filename;
        }

        const newSupport = new Support({
            tutorId,
            email,
            subject,
            Deatils: details,
            Attachment: attachment
        });

        await newSupport.save();
        console.log("Support request submitted successfully and saved to database");
        res.send("Your Support Request Submitted Succesfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error submitting support request");
    }
});

app.post('/student/:id/submit-question', upload.single('questionImage'), async (req, res) => {
    try {
        const { subject, questionText } = req.body;
        const studentId = req.params.id;
        let questionImage = null;

        if (req.file) {
            questionImage = req.file.filename;
        }

        const newQuestion = new Question({
            studentId,
            subject,
            questionImage,
            questionText
        });

        await newQuestion.save();
        console.log("Question submitted successfully and saved to database");
        res.redirect(`/student/${studentId}/raisequestion`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error submitting question");
    }
});

app.post("/student/:id/response",upload.single("promptImage") ,async (req, res) => {
    const prompt = req.body.promptText;
    let filename = null;
    
    if (req.file) {
        filename = req.file.filename;
    }
    const genAI = new GoogleGenerativeAI("AIzaSyCCTsHPDKugzSozu35qYOeU7ZRi8iXquMw");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const image = {
            inlineData: {
                data: Buffer.from(fs.readFileSync(`C:/Users/VICKY/OneDrive/Desktop/PROJECTS/QANDA/public/uploads/${filename}`)).toString("base64"),
                mimeType: "image/png",
            },
        };
        generateResponse=async()=>{
        const result = await model.generateContent([prompt, image]);
        const response = result.response.text();
        
        console.log(response);
        res.render("instant-answer-response.ejs",{response});

        }
        generateResponse();

    } catch (error) {
        generateResponse=async()=>{
        const result = await model.generateContent([prompt]);
        const response = result.response.text();
        console.log(response);
        res.render("instant-answer-response.ejs",{response});
       
        }
        generateResponse();
        
    }
    
});

app.post('/student/register', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        console.log("Student Registered Successfully and Saved to database");
        res.render("login-student.ejs");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering student");
    }
});

app.post('/tutor/register', async (req, res) => {
    try {
        const tutor = new Tutor(req.body);
        await tutor.save();
        console.log("Tutor Registered Successfully and Saved to database");
        res.render("login-tutor.ejs");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering tutor");
    }
});

app.post('/student/login', async (req, res) => {
    try {
        const student = await
        Student.findOne({username: req.body.username, password: req.body.password});
        if (!student) {
            console.log("Student not found");
            return res.status(404).send("Student not found");
        }
        console.log("Student logged in successfully");
        res.render("student-dashboard.ejs", {student: student});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in student");
    }
}
);

app.post('/tutor/login', async (req, res) => {
    try {
        const tutor = await
        Tutor.findOne({username: req.body.username, password: req.body.password});
        if (!tutor) {
            console.log("Tutor not found");
            return res.status(404).send("Tutor not found");
        }
        console.log("Tutor logged in successfully");
        res.render("tutor-dashboard.ejs", {tutor: tutor});
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in tutor");
    }
}
);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});