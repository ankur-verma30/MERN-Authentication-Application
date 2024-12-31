import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'

const app =express();

const PORT=process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cors({credentials:true}));
app.use(cookieParser());


//api endpoints
app.get('/', (req, res) => {
    res.send('Hello from server, API Working');
})

app.use('/api/auth',authRouter)

app.listen(PORT,()=>{
    console.log('Server listening on port :',PORT);

})
