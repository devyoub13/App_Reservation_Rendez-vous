const express=require('express');
const connectDbb=require("./config/db");
require('dotenv').config();
const cors = require("cors");

const app=express();
connectDbb();


app.use(cors({origin:'http://localhost:3000'}));

app.use(express.json());

const reservRouter=require("./routes/reservations.js");
const userRouter=require("./routes/authent.js");
app.use("/api",reservRouter);
app.use("/api",userRouter);



    
const PORT=process.env.PORT||6001;
app.listen(PORT,()=>{


    console.log(`app running on port ${PORT}`);
})
