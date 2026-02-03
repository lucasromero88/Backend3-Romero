import { usersService, petsService } from "../services/index.js";
import { generateMockUsers, generateMockPets } from "../utils/mocking.js";

const getMockingPets = (req, res) => {
    const pets = generateMockPets(50);
    res.send({ status: "success", payload: pets });
};

const getMockingUsers = async (req, res) => {
    const users = await generateMockUsers(50);
    res.send({ status: "success", payload: users });
};

const generateData = async (req, res) => {
    try {
        const { users, pets } = req.body;
        
        if (isNaN(users) || isNaN(pets)) {
            return res.status(400).send({ status: "error", error: "Parameters 'users' and 'pets' must be numeric" });
        }

        const mockUsers = await generateMockUsers(Number(users));
        const mockPets = generateMockPets(Number(pets));

        
        const userPromises = mockUsers.map(user => usersService.create(user));
        const petPromises = mockPets.map(pet => petsService.create(pet));

        await Promise.all([...userPromises, ...petPromises]);

        res.send({ 
            status: "success", 
            message: `Data generated: ${users} users and ${pets} pets inserted successfully.` 
        });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export default {
    getMockingPets,
    getMockingUsers,
    generateData
};