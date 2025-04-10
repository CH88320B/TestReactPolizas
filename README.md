Proyecto: CRUD de Pólizas - WebAPI + React (con Deploy en Azure)

Este proyecto consiste en una aplicación completa para el mantenimiento de pólizas de seguros. Incluye un backend desarrollado en ASP.NET Core Web API y un frontend moderno hecho en React con Vite, con despliegue continuo (CI/CD) automatizado en Azure Static Web Apps.

🚀 Tecnologías Usadas

Backend

ASP.NET Core 8.0

Entity Framework Core 9.0

SQL Server LocalDB

Autenticación JWT

Swagger

Frontend

React 18

Vite

TypeScript

Bootstrap 5

CI/CD y Hosting

GitHub Actions

Azure Static Web Apps (para el frontend)

Azure App Service (para el backend Web API)

📊 Estructura del Proyecto

CRUD_MANT_POLIZAS/
├── WebApiPolizas/                 # Proyecto ASP.NET Core Web API
│   └── WebApiPolizas.csproj
├── appPolizas/                   # Proyecto React con Vite
│   ├── dist/                     # Archivos de build (frontend)
│   ├── src/                      # Componentes React
│   ├── staticwebapp.config.json # Configuración para Azure Static Web Apps
│   └── vite.config.ts
├── .github/
│   └── workflows/
│       ├── azure-static-web-apps-<id>.yml   # Despliegue del frontend
│       └── main_webapi-pruebas-hj.yml      # Despliegue del backend

🚜 Instalación Local

1. Clonar el Repositorio

git clone https://github.com/CH88320B/TestReactPolizas.git
cd TestReactPolizas

2. Configurar el Backend

Requisitos:

.NET 8 SDK

SQL Server LocalDB

Ejecutar Web API localmente:

cd WebApiPolizas/WebApiPolizas

dotnet restore
dotnet build
dotnet run

Acceder a: http://localhost:5122/swagger/index.html

3. Configurar el Frontend

cd appPolizas
npm install
npm run dev

Acceder a: http://localhost:5173

⚙️ Configuración del YAML (CI/CD)

Archivo: .github/workflows/azure-static-web-apps-<id>.yml

name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Instalar dependencias
        run: npm install
        working-directory: appPolizas

      - name: Build de la app
        run: npm run build
        working-directory: appPolizas

      - name: Copiar staticwebapp.config.json
        run: cp staticwebapp.config.json dist/
        working-directory: appPolizas

      - name: Desplegar en Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_RIVER_03A6DED0F }}
          action: "upload"
          app_location: "appPolizas"
          output_location: "dist"

Nota: El secreto AZURE_STATIC_WEB_APPS_API_TOKEN_BRAVE_RIVER_03A6DED0F se genera desde el portal de Azure.

🌐 Despliegue a Producción

📱 Frontend - Azure Static Web Apps

Subida automática con cada push a main.

Azure usará dist/ como carpeta final.

Configurado con staticwebapp.config.json para manejar rutas y tipos MIME.

🚀 Backend - Azure App Service

Desplegado con su propio YAML.

Usa dotnet publish y az webapp deploy para montar el servicio.

🎮 Resultado Final

WebAPI Swagger: https://webapi-polizas-hjgroup.azurewebsites.net/swagger/index.html

Frontend React: https://brave-river-03a6ded0f.6.azurestaticapps.net/

🔗 Contacto

Autor: Henderson J.Email: hendersonc.tpfactory@gmail.com

