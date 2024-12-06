# Multi-Tenant Database Migration System

A robust Node.js/TypeScript application that handles database migrations for multi-tenant architecture, supporting both master and tenant-specific database operations.

## 🌟 Features

- Multi-tenant database architecture
- Separate migration handling for master and tenant databases
- Concurrent database operations support
- TypeScript implementation
- Docker support
- Automated migration scripts
- Error handling middleware
- User authentication system

## 🛠️ Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB with Mongoose
- Docker
- Axios

## 📊 Database

This project uses MongoDB Atlas as the database service. MongoDB Atlas provides a cloud-hosted MongoDB service with a free tier available for small projects and easy scalability for larger applications.

To use MongoDB Atlas:

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Obtain your connection string and add it to the `.env` file as described in the Environment Variables section

## 📋 Prerequisites

- Node.js (v22.11)
- MongoDB
- Docker (optional)
- TypeScript
- Yarn

## 🔐 Environment Variables

This project uses the following environment variables:

```env
MASTER_DB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<master_db_name>
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<DB_NAME>
PORT=5000
```

Create a `.env` file in the root directory and add these variables with your specific values.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mehulrana017/multi-tenancy-with-migration.git
cd multi-tenancy-with-migration
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

```bash
cp .env.sample .env
```

### 4. Build the project

```bash
yarn build
```

### 5. Start the server

```bash
# For development
yarn dev

# For production
yarn start
```

## 🗄️ Database Migrations

The system supports different types of migrations:

### Master Database Migrations

```bash
# Run up migrations
yarn migrate:master:up

# Run down migrations
yarn migrate:master:down
```

### Tenant Database Migrations

```bash
# Run up migrations
yarn migrate:tenant:up

# Run down migrations
yarn migrate:tenant:down
```

### All Databases Migrations

```bash
# Run up migrations for all databases
yarn migrate:all:up

# Run down migrations for all databases
yarn migrate:all:down
```

## 📁 Project Structure

```
├── src/
│   ├── cli/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── migrations/
│   │   ├── master/
│   │   ├── tenants/
│   │   └── index.ts
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── .env
├── .env.sample
├── .gitignore
├── .nvmrc
├── docker-compose.yml
├── Dockerfile
├── package.json
├── README.md
├── tsconfig.json
└── yarn.lock
```

## 🔧 Available Scripts

```bash
# Start development server
yarn dev

# Build the project
yarn build

# Start production server
yarn start

# Clean build directory
yarn clean

# Database migrations
yarn migrate:master:up      # Run master database up migrations
yarn migrate:master:down    # Run master database down migrations
yarn migrate:tenant:up      # Run tenant database up migrations
yarn migrate:tenant:down    # Run tenant database down migrations
yarn migrate:all:up         # Run all databases up migrations
yarn migrate:all:down       # Run all databases down migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
