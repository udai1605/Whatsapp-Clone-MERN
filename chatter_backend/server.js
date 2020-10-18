const express= require('express');
const mongoose= require('mongoose');
require("./dbMessages.js");
mongoose.connect(process.env.MONGO_URL ,{ useNewUrlParser: true, useUnifiedTopology: true })
const app = express();
const port=process.env.PORT || 9000;

const Pusher = require('pusher');
const cors= require('cors');

var pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: 'ap2',
    useTLS: true,
});

app.use(express.json());
app.use(cors())

const db= mongoose.connection;
db.once('open', () =>{
    console.log('database connected');
    const msgCollection = db.collection('messages');
    const changeStream=msgCollection.watch();

    changeStream.on('change',(change)=>{
        console.log(change);
        if(change.operationType==='insert'){
            const messageDetails=change.fullDocument;
            pusher.trigger('messages','inserted',{
                name:messageDetails.name,
                message:messageDetails.message,
                timestamp:messageDetails.timestamp,
                received:messageDetails.received,
            })
        }else{
            console.log('Error occured')
        }
    })
})



const Messages = mongoose.model("Messages")
app.get('/', (req, res) =>res.status(200).send('hello world'));


app.get('/messages/sync', (req, res) =>{
    Messages.find((err,data) =>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new', (req, res) =>{
    const dbMessage=req.body;
    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

app.listen(port,()=>console.log(`listening on port : ${port}`));
