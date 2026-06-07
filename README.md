# todoList-Programacion_web
Proyecto de todoList para programacion web

App de lista de tareas hecha con Node.js, Express, MongoDB y React.

## Lo que necesitas tener instalado

- Node.js v18 o superior
- Una cuenta en MongoDB Atlas
- mkcert (para el HTTPS local)

## Instalar mkcert

### Windows

1. Entra a `https://github.com/FiloSottile/mkcert/releases/latest` y descarga `mkcert-v1.4.4-windows-amd64.exe`
2. Renómbralo a `mkcert.exe`
3. Muévelo a `C:\Windows\System32\`
4. Abre PowerShell como administrador y ejecuta `mkcert -install`

### Mac

1. Ejecuta `brew install mkcert`
2. Luego `mkcert -install`

### Linux

1. Ejecuta `sudo apt install mkcert`
2. Luego `mkcert -install`

## Configurar MongoDB Atlas

1. Crea una cuenta en `https://www.mongodb.com/cloud/atlas`
2. Crea un cluster gratuito (M0 Free Tier)
3. En Database Access crea un usuario con permisos de lectura y escritura
4. En Network Access agrega `0.0.0.0/0` para permitir cualquier IP
5. En el cluster ve a Connect → Drivers y copia la URI que tiene este formato `mongodb+srv://usuario:contraseña@cluster.mongodb.net/nombre_bd`

## Configuracion del backend

1. Entra a la carpeta desde la raiz principal 
`cd backend`
2. Instala las dependencias 
`npm install`
3. Genera los certificados HTTPS con el siguiente comando
`mkcert -key-file key.pem -cert-file cert.pem localhost`
4. Crea un archivo `.env` dentro de backend con esto 
`MONGODB_URI=tu_uri_de_mongodb_atlas`
`JWT_SECRET=cualquier_clave_secreta`
5. Arranca el servidor con el comando 
`node src` 
que corre en `https://localhost:5000`

## Configuracion del frontend

1. Entra a la carpeta desde la raiz principal `cd frontend`
2. Instala las dependencias `npm install`
3. Genera los certificados HTTPS con el siguiente comando
`mkcert -key-file key.pem -cert-file cert.pem localhost`
4. Arranca el frontend con el comando
`npm run dev` 
que corre en `https://localhost:3000`

## Cargar datos para la bd

Desde la raiz del proyecto entra al backend `cd backend` y luego ejecuta el comando 
`node seed/seed.js` que inyectara las credenciales de prueba son:
Alex con email:
`alex@gmail.com` 
contraseña:
`WEB1234`, 
Maria con email: 
`maria@gmail.com` 
contraseña:
`WEB1234`.
Carlos con email:
`carlos@gmail.com`
contraseña:
`WEB1234`

## Arrancar la app

1. Primero abre un terminal y entra al backend desde la raiz del proyecto con `cd backend` luego el comando `node src` para levantarlo.
2. Luego abre otro terminal y entra al frontend desde la raiz del proyecto con `cd frontend` luego el comando `npm run dev` para levantarlo.
3. Abre el navegador en `https://localhost:3000`

## Variables de entorno

`MONGODB_URI` es la URI de conexión a MongoDB Atlas y `JWT_SECRET` es la clave para firmar los tokens JWT.