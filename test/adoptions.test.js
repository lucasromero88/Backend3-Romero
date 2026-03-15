// import { expect } from 'chai';
// import supertest from 'supertest';

// const requester = supertest('http://localhost:8080');

// describe('Tests de Adopciones', () => {
    
//     describe('GET /api/adoptions', () => {
//         it('Debería retornar status success y un array en payload', async () => {
//             const { status, _body } = await requester.get('/api/adoptions');
            
//             expect(status).to.equal(200);
//             expect(_body.status).to.equal('success');
//             expect(Array.isArray(_body.payload)).to.be.true;
//         });
//     });

//     describe('GET /api/adoptions/:aid', () => {
//         it('Debería retornar 404 si la adopción no existe', async () => {
//             const fakeId = '641234567890abcdef123456'; 
//             const { status } = await requester.get(`/api/adoptions/${fakeId}`);
//             expect(status).to.equal(404);
//         });
//     });
// });

// describe('POST /api/adoptions/:uid/:pid', () => {
//     it('Debería crear una adopción exitosamente', async () => {
        
//         const usersRes = await requester.get('/api/users');
//         const petsRes = await requester.get('/api/pets');
        
        
//         if (usersRes._body.payload.length === 0 || petsRes._body.payload.length === 0) {
//             throw new Error("Se requieren usuarios y mascotas en la DB para este test. Ejecuta los mocks primero.");
//         }

//         const uid = usersRes._body.payload[0]._id;
//         const pid = petsRes._body.payload.find(p => !p.adopted)._id; 

//         const { status, _body } = await requester.post(`/api/adoptions/${uid}/${pid}`);

//         expect(status).to.equal(200);
//         expect(_body.status).to.equal('success');
//         expect(_body.message).to.equal('Pet adopted');
//     });

//     it('Debería fallar (400) si la mascota ya está adoptada', async () => {
      
//         const usersRes = await requester.get('/api/users');
//         const petsRes = await requester.get('/api/pets');
//         const uid = usersRes._body.payload[0]._id;
//         const pid = petsRes._body.payload.find(p => p.adopted)._id; 

//         const { status, _body } = await requester.post(`/api/adoptions/${uid}/${pid}`);
        
//         expect(status).to.equal(400);
//         expect(_body.error).to.equal('Pet is already adopted');
//     });
// });
import 'dotenv/config';
import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import userModel from '../src/dao/models/User.js';
import petModel from '../src/dao/models/Pet.js';
import adoptionModel from '../src/dao/models/Adoption.js';

const requester = supertest('http://localhost:8080');

describe('Tests de Adopciones con Limpieza Automática', function() {
    this.timeout(10000); // Mayor tiempo para conexión a Atlas

    // Antes de todos los tests, nos aseguramos de estar conectados
    before(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME });
        }
    });

    // Después de todos los tests, borramos los datos de prueba
    after(async () => {
        await userModel.deleteMany({ email: /@testtest\.com$/ });
        await petModel.deleteMany({ name: 'TestPetMocha' });
        // Opcional: limpiar la tabla de adopciones de prueba si es necesario
    });

    describe('GET /api/adoptions', () => {
        it('Debería retornar status success y un array en payload', async () => {
            const { status, body } = await requester.get('/api/adoptions');
            expect(status).to.equal(200);
            expect(body.status).to.equal('success');
            expect(Array.isArray(body.payload)).to.be.true;
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('Debería crear una adopción exitosamente creando sus propios datos', async () => {
            // 1. Creamos un usuario y una mascota específicos para este test
            const mockUser = await userModel.create({
                first_name: "User",
                last_name: "Prueba",
                email: "mocha_success@testtest.com",
                password: "123"
            });

            const mockPet = await petModel.create({
                name: "TestPetMocha",
                specie: "dog",
                birthDate: new Date(),
                adopted: false
            });

            // 2. Ejecutamos el test
            const { status, body } = await requester.post(`/api/adoptions/${mockUser._id}/${mockPet._id}`);

            // 3. Validamos
            expect(status).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('Pet adopted');
        });

        it('Debería fallar (400) si la mascota ya está adoptada', async () => {
            const mockUser = await userModel.create({
                first_name: "User",
                last_name: "Fallo",
                email: "mocha_fail@testtest.com",
                password: "123"
            });

            const mockPetAlreadyAdopted = await petModel.create({
                name: "TestPetMocha",
                specie: "cat",
                birthDate: new Date(),
                adopted: true // Ya está adoptada
            });

            const { status, body } = await requester.post(`/api/adoptions/${mockUser._id}/${mockPetAlreadyAdopted._id}`);
            
            expect(status).to.equal(400);
            expect(body.error).to.equal('Pet is already adopted');
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('Debería retornar 404 si la adopción no existe', async () => {
            const fakeId = '641234567890abcdef123456'; 
            const { status } = await requester.get(`/api/adoptions/${fakeId}`);
            expect(status).to.equal(404);
        });
    });
});