# TestReactPolizas
Proyecto Prueba React + Webappi Netcore +SQLServer



Guía de Instalación - Sistema de Gestión de Pólizas

Este proyecto incluye una Web API desarrollada con ASP.NET Core y un frontend en React + Vite. A continuación se detallan todos los pasos para la instalación del entorno y ejecución de ambas aplicaciones.

📁 Requisitos Previos

.NET 8 SDK

Node.js (v16+)

Visual Studio 2022 con soporte para ASP.NET y Entity Framework Core

SQL Server (Express o superior)

🚀 Instalación del Backend (Web API Aspt NetCore )

1. Restaurar paquetes NuGet

Desde la carpeta del proyecto Web API, ejecutar:

 dotnet restore

2. Instalar paquetes NuGet necesarios

 dotnet add package Microsoft.EntityFrameworkCore
 dotnet add package Microsoft.EntityFrameworkCore.SqlServer
 dotnet add package Microsoft.EntityFrameworkCore.Tools
 dotnet add package Swashbuckle.AspNetCore
 dotnet add package Swashbuckle.AspNetCore.Filters
 dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

3. Configurar appsettings.json

Actualizar la cadena de conexión con tu base de datos SQL Server y asegurarte de que el Jwt:Key y Issuer estén configurados:

"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=PolizasDB;Trusted_Connection=True;"
},
"Jwt": {
  "Key": "CLAVE_SECRETA_AQUI",
  "Issuer": "https://localhost:44320"
}

4. Ejecutar el proyecto

 dotnet run

El proyecto se servirá en https://localhost:44320

📚 Instalación del Frontend (React + Vite)

1. Entrar al directorio del frontend

cd frontend

2. Instalar dependencias

install Vite 
en la ruta del proyecto desde CMD  >  npm create vite@lastest luego colocar Name Project  y tipo proyecto React + SWC
npm install
en la consola abrir el VScode , comando "code . "

desde la consola Manager de Nuget npm run dev


3. Instalar paquetes necesarios desde la consola Manager de Nuget

npm install react-router-dom
npm install bootstrap reactstrap
npm install sweetalert2

# Tipos para TypeScript
npm install --save-dev @types/react-router-dom
npm install --save-dev @types/sweetalert2

4. Importar Bootstrap

Agregar en main.tsx o index.tsx:

import 'bootstrap/dist/css/bootstrap.min.css';

5. Configurar appsettings.ts

Archivo src/settings/appsettings.ts:

export const appsettings = {
  apiUrl: "https://localhost:44320/api/" -Piuerto puede variar

};

6. Ejecutar la aplicación React

npm run dev

La app estará disponible en http://localhost:5173--Piuerto puede variar

🌐 Rutas importantes

Ruta

Descripción

/login

Inicio de sesión

/polizas

Listado de pólizas

/nuevaPoliza

Crear nueva póliza

/editarPoliza/:id

Editar una póliza existente

Eliminar Poliza

📄 Notas

El backend usa autenticación JWT.

Asegúrate de tener configurado CORS si accedés desde diferentes dominios.

Swagger está disponible en: https://localhost:44320/swagger  --puerto puede variar


