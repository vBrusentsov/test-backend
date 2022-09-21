const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;
const dotenv = require('dotenv');
const authRouter = require('../router/authRouter');

dotenv.config();
app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL);
        await mongoose.syncIndexes();
        app.listen(PORT, () => {
            console.log(`server work on port: ${PORT}`)
        })
    } catch (e) {
        console.log(e);
    }
}

start()
