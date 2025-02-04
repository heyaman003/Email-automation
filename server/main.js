const express =require('express');
const app = express();
const cors=require('cors');
const dotenv = require('dotenv');
app.use(express.json());
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory as Buffers

const upload = multer({storage});
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const {sendEmailVerification}=require('./Email_logic/EmailSender');

app.get('/automation',(req,res)=>{
    res.json({msg:"hello ji /automation"});  
})
app.get('/',(req,res)=>{
    res.json({msg:"hello ji /"});  
})

app.post('/automation/send-email', upload.any(), async (req, res) => {
    const recipients = JSON.parse(req.body.recipients);
    const subject = req.body.subject;
    const content = req.body.content;
    const credinitals = typeof req?.body?.credinitals === 'string'
        ? JSON.parse(req.body.credinitals)
        : req.body.credinitals;

    
    console.log("Credentials:", credinitals);

    const attachments = req.files?.map((file) => ({
        filename: file.originalname, // Original file name
        content: file.buffer,       // File content as Buffer
    }));


    let emailsSent = 0;
    let emailsFailed = 0;
    const failedRecipients = [];

    for (const recipient of recipients) {
        try {
            await sendEmailVerification(recipient, subject, content, attachments, credinitals);
            emailsSent++;
            console.log(`Email sent successfully to ${recipient.email}`);
        } catch (error) {
            emailsFailed++;
            failedRecipients.push(recipient.email);
            console.error(`Failed to send email to ${recipient.email}:`, error.message);
        }
    }

    res.json({
        success: true,
        message: `Processed ${recipients.length} recipients.`,
        summary: {
            emailsSent,
            emailsFailed,
            failedRecipients, // List of emails that failed
        },
    });
});


app.listen(8700,()=>{    
    console.log("Server is running on port 8700 thsi time");
})