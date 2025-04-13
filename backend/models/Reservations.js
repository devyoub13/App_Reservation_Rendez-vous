const mongoose = require("mongoose");


// shema dial reservations


const reservationSchema = new mongoose.Schema({


    patientId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    status:{
        type:String,
        enum:["En cours",'Validée','Annulée'],
        default:"En cours",

    },

    date:
    {
        type:Date,
        required:true,

    },
    

    hour:{
        type:String,
        required:true,
    },
   

},{ timestamps: true });

// lmodel diali

const Reservation = mongoose.model("Reservation", reservationSchema, "reservations"); // hna j ai saisi le nom de collection li brit

module.exports = Reservation;
