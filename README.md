# RetailEase

RetailEase is a React/Vite storefront with a Spring Boot product API.

## Requirements

- Java 17 or newer
- Node.js 18 or newer

The default backend configuration uses a local H2 database, so MySQL is not
required.

## Run locally

Start the backend:

```powershell
cd ecom
.\mvnw.cmd spring-boot:run
```

Start the frontend in a second terminal:

```powershell
cd ecom-frontend-5-main
npm.cmd ci
npm.cmd run dev
```

Open `http://localhost:5173`.

The backend API runs on `http://localhost:8081/api` by default. Override it
with the `SERVER_PORT` environment variable and set `VITE_API_URL` to the
matching frontend URL when needed.

## Optional MySQL profile

Create the database or allow the configured user to create it, then set:

```powershell
$env:SPRING_PROFILES_ACTIVE = "mysql"
$env:DB_URL = "jdbc:mysql://localhost:3306/ECOM?createDatabaseIfNotExist=true"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your-password"
.\mvnw.cmd spring-boot:run
```

## Connect your GitHub repository

Create an empty repository in your GitHub account, then run from this folder:

```powershell
git config user.name "YOUR_NAME"
git config user.email "YOUR_GITHUB_EMAIL"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git add .
git commit -m "Prepare RetailEase for local development"
git push -u origin main
```
