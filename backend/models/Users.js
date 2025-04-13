const mongoose=require('mongoose');



const userSchema=new mongoose.Schema({

nom:
{

    type:String,
    required:true,
    trim: true,
},

prenom:{
    type:String,
    required:true,
    trim: true,
},

email:
{
    type:String,
    required:true,
    unique:true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']

},

pass:{

    type:String,
    required:true,
    trim: true,
    minlength: 8, 
},

dateNaissance:{
    type:Date,
    required:true,
    trim: true,
    validate:{
        validator: function(dt){
            const minValue= new Date("1940-01-01");
            return dt<=Date.now()  &&  dt>=minValue;
        },
        message:"Votre date de naissance semble incorrecte"
        
    }

},

role:{
type:String,
enum:["patient","admin","medecin"],
required: true,
default:"patient",
},

},{ timestamps: true });


const Users=mongoose.model('Users',userSchema,"users");

module.exports=Users;