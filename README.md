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

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)
- TypeScript
- Yarn

## 🔐 Environment Variables

This project uses the following environment variables:

- `MASTER_DB_URI`: MongoDB Atlas connection string for the master database
- `MONGO_URI`: Base MongoDB Atlas connection string for tenant databases (include `<DB_NAME>` placeholder)
- `PORT`: Port number for the server (default: 5000)

Create a `.env` file in the root directory and add these variables with your specific values.

## 🚀 Getting Started

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/mehulrana017/multi-tenancy-with-migration.git
   cd multi-tenancy-with-migration
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   yarn install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.sample .env
   \`\`\`
   Edit the `.env` file with your MongoDB Atlas connection strings and other configuration:
   \`\`\`
   MASTER_DB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<master_db_name>
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<DB_NAME>
   PORT=5000
   \`\`\`
   Replace `<username>`, `<password>`, `<cluster>`, and `<master_db_name>` with your MongoDB Atlas credentials and cluster information.

4. Build the project:
   \`\`\`bash
   yarn build
   \`\`\`

5. Start the server:
   \`\`\`bash
   yarn dev # for development
   yarn start # for production
   \`\`\`

## 🗄️ Database Migrations

The system supports different types of migrations:

### Master Database Migrations

\`\`\`bash

# Run up migrations

yarn migrate:master:up

# Run down migrations

yarn migrate:master:down
\`\`\`

### Tenant Database Migrations

\`\`\`bash

# Run up migrations

yarn migrate:tenant:up

# Run down migrations

yarn migrate:tenant:down
\`\`\`

### All Databases Migrations

\`\`\`bash

# Run up migrations for all databases

yarn migrate:all:up

# Run down migrations for all databases

yarn migrate:all:down
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── config/ # Configuration files
├── controllers/ # Request handlers
├── middleware/ # Express middleware
├── migrations/ # Database migrations
│ ├── master/ # Master database migrations
│ └── tenants/ # Tenant-specific migrations
├── models/ # Database models
├── routes/ # API routes
├── services/ # Business logic
├── app.ts # Express app setup
└── server.ts # Server entry point
\`\`\`

<!-- ## 🐳 Docker Support

To run the application using Docker:

\`\`\`bash

# Build and start containers

docker-compose up --build

# Stop containers

docker-compose down
\`\`\` -->

## 🔧 Available Scripts

- `yarn dev`: Start development server
- `yarn build`: Build the project
- `yarn start`: Start production server
- `yarn clean`: Clean build directory
- `yarn migrate:master:up`: Run master database up migrations
- `yarn migrate:master:down`: Run master database down migrations
- `yarn migrate:tenant:up`: Run tenant database up migrations
- `yarn migrate:tenant:down`: Run tenant database down migrations
- `yarn migrate:all:up`: Run all databases up migrations
- `yarn migrate:all:down`: Run all databases down migrations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
