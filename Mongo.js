import mongoose from 'mongoose'

if (process.argv.length < 3) {
    console.log('Please provide a password: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack_course:${password}@cluster0.24lwm.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
});

const Note = mongoose.model('Note', noteSchema);

Note.find({important: true}).then(result => {
    result.forEach(note => console.log(note));
    mongoose.connection.close();
})

