import express, {request, response} from 'express'
import cors from 'cors'
import Note from './models/Note.mjs'
import dotenv from 'dotenv'

dotenv.config();

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'Malformatted ID'});
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({error: error.message})
    }
    next(error);
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' });
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('build'));


app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>');
});

app.get('/api/notes', (request, response) => {
    Note.find().then(notes => response.json(notes));
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body;
    if (body.content === undefined) {
        return response.status(400).json({'error' : 'Content missing'});
    }
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });
    note.save().then(savedNote => response.json(savedNote))
        .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note =>{
       if (note) { response.json(note)}
       else {response.status(404)}
    })
        .catch(error => next(error));
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error));
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body;
    const note = {
        content: body.content,
        important: body.important
    }
    Note.findByIdAndUpdate(request.params.id, note, {new : true})
        .then(updatedNote => response.json(updatedNote))
        .catch(error => next(error));
})

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
