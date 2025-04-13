const mongoose=require ("mongoose");

require('dotenv').config();

const connectDb=async()=>{


    try 
    {
        await mongoose.connect(process.env.URI);
        console.log('cnx réussie à mongo');
        
    } 
    catch (error) 
    {
        console.error("echec de cnx a mongo");
        process.exit(1);
    }
}
module.exports=connectDb;