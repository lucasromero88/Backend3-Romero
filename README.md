# AdoptMe API - Entrega Final Backend 3

Este proyecto constituye la entrega final para la carrera de Backend 3. Es una plataforma para la gestión de adopciones de mascotas, que implementa arquitectura por capas, persistencia en MongoDB Atlas, documentación Swagger, testing de integración y containerización mediante Docker.

---

## Tecnologías utilizadas
* **Node.js** & **Express**
* [cite_start]**MongoDB Atlas** (Persistencia de datos en la nube) 
* **Swagger** (Documentación de API con Swagger JSDoc)
* **Mocha, Chai & Supertest** (Testing funcional y de integración)
* **Docker** (Imagen de contenedor para despliegue reproducible)
* **Faker-js** (Generación de datos mock para usuarios y mascotas)

---

## DockerHub

La imagen oficial del proyecto esta publicada en DockerHub:

🔗 **[lksrom/backend3-romero](https://hub.docker.com/r/lksrom/backend3-romero)**

Tag:
`lksrom/backend3-romero:1.0.1`

---

# Informacion para el contenedor

docker run -p 8080:8080 \
PORT=8080
MONGO_URL=mongodb+srv://coderbackend3romero:Backend3Romero@cluster0.kliam13.mongodb.net/?appName=Cluster0
DB_NAME=adoptme

---
La documentacion Swagger se encuentra en :

http://localhost:8080/apidocs/

# Construir la imagen Docker

Para construir la imagen localmente ejecutar:

docker build -t lksrom/backend3-romero:1.0.1 .

El proyecto incluye tests de integración desarrollados con Mocha, Chai y Supertest.

se puede ejecutar con el siguiente comando:

npm test