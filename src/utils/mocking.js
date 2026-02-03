import { fakerES as fa } from "@faker-js/faker";
import { createHash } from "./index.js"; 

export const generateMockUsers = async (quantity) => {
    const users = [];
    const hashedPassword = await createHash("coder123"); 

    for (let i = 0; i < quantity; i++) {
        const first_name = fa.person.firstName();
        const last_name = fa.person.lastName();
        users.push({
            first_name,
            last_name,
            email: fa.internet.email({ firstName: first_name, lastName: last_name }),
            password: hashedPassword,
            role: fa.helpers.arrayElement(['user', 'admin']),
            pets: [] 
        });
    }
    return users;
};

export const generateMockPets = (quantity) => {
    const pets = [];
    for (let i = 0; i < quantity; i++) {
        pets.push({
            name: fa.animal.petName(),
            specie: fa.helpers.arrayElement(['dog', 'cat', 'bird', 'rabbit']),
            birthDate: fa.date.past({ years: 10 }),
            adopted: false,
            image: fa.image.urlLoremFlickr({ category: 'animals' })
        });
    }
    return pets;
};