import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import dotenv from 'dotenv'; 
import connectDB from './config/db.js'; 

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

import mocksRouter from './routes/mocks.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT||8080;
// const connection = mongoose.connect(`URL DE MONGO`)


app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.use('/api/mocks', mocksRouter);

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de AdoptMe API',
            description: 'API para la gestión de adopción de mascotas, usuarios y mocks.'
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Servidor local"
            }
        ]
    },
    apis: [`./src/docs/**/*.yaml`] 
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


// app.listen(PORT,()=>console.log(`Listening on ${PORT}`))

const startServer = async () => {
    await connectDB(); 
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
};

startServer();