# Task Frontend 🚀

Web app desarrollado con angular version 17 para la gestión de tareas.
La web app se despliega automaticmaente en Firebase Hosting.
El proceso de despliegue se realiza mediante entrega continua CI/CD con Github Actions.

Tecnologías utilizadas

- Angular 17
- TypeScript
- Angular Material
- Firebase Hosting
- GitHub Actions 
- Jest para pruebas unitarias
- Node.js 18


Estructura del proyecto

src/
 ├── app/
 │   ├── core/        # aqui se encuentran los servicios, guards e interceptores
 │   ├── features/    # aqui se encuentran los componentes de de autenticacion y gestion de tareas
 │   ├── layout/      # layout estructural compartido en cada pagina
 │   ├── shared/      # componentes y utileria compartida reutilizable
 │   └── app.routes.ts
 ├── environments/
 └── styles.scss

Pruebas unitarias

Este proyecto web utiliza Jest como framework de pruebas unitarias

Comando para ejecutar las pruebas de manera completa
npm run test

**Para ejecutar las pruebas unitarias tambien se puede instalar la extension Jest Runner.

Instalacion de dependencias
- Las dependencias del proyecto se instalan mediante el comando "npm install"
Ejecucion del proyecto
- Para ejecutar el proyecto localmente usa el siguiente comando "ng serve -o"   
  - el flag -o en el comando es para que el navegador se ejecute automaticamente
- El puerto de ejecucion del proyecto de manera local es el 4200 de manera que para acceder desde el navegador al entorno local 
accedemos a la siguiente ruta: http://localhost:4200

Build de produccion
- El comando para realizar el build es el siguiente "npm run build"

Despliegue (CI/CD)

El proyecto cuenta con despliegue automático a Firebase Hosting mediante GitHub Actions.

Flujo de despliegue
1. git push
   
2. GitHub Actions
   
3. Build Angular
   
4. Deploy a Firebase Hosting

Requisitos de despliegue a firebase:

El proyecto en firebase debe estar configurado previamente 
Tener listo un Secreto llamado: FIREBASE_TOKEN configurado en GitHub Actions

Hosting:
La aplicacion web se encuentra desplegada en Firebase Hosting y para acceder a ella se utiliza la siguiente url:
- https://atom-project-1ac29.web.app/

Autor: 
Cornelio de Wilso Leal Tut

