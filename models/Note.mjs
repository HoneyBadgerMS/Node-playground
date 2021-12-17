import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();
const url = process.env.MONGODB_URI;
console.log('connecting to ', url);

mongoose.connect(url).then(result => {
    console.log('Connected');
}).catch(error => {
    console.log('Connection error: ', error);
});

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 5,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
});
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete  returnedObject.__v;
    }
})

export default  mongoose.model('Note', noteSchema);