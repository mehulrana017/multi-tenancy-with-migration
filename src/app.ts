import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectToMasterDB } from "./config/dbConfig";
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";
import axios from "axios";

// Load environment variables
dotenv.config();

// Initialize the Express app
const app: Application = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Example root route
app.use("/api/users", userRoutes);

// Error handling middleware
app.use(errorHandler);

const simulateConcurrentInserts = async () => {
  const url = "http://localhost:5000/api/users/insert-sample-data"; // Your server's URL

  // Start measuring time
  const startTime = Date.now();

  // Function to send a single request with a unique tenant name and sample data
  const sendRequest = async (tenantName: string) => {
    try {
      const sampleData = [
        {
          name: `Sample User ${tenantName}`,
          email: `user_${tenantName}@example.com`,
        },
        {
          name: `Another User ${tenantName}`,
          email: `another_user_${tenantName}@example.com`,
        },
      ]; // Generate some sample data for the tenant

      // Send the request with tenantName and sampleData
      const response = await axios.post(url, { tenantName, sampleData });
      console.log(response.data);
    } catch (error) {
      console.log("Error", error);
      console.error(`Error with tenant ${tenantName}: ${error}`);
    }
  };

  // Generate 20 unique tenant names
  const tenantNames = Array.from(
    { length: 100 },
    (_, index) => `tenant_${Date.now()}_${index + 1}`
  );

  // Simulate 20 concurrent requests, each with a different tenant name and sample data
  const requests = tenantNames.map((tenantName) => sendRequest(tenantName));

  // Wait for all requests to complete
  await Promise.all(requests);

  // End measuring time
  const endTime = Date.now();
  const totalTime = (endTime - startTime) / 1000; // Time in seconds

  console.log(`Total time taken for the test: ${totalTime} seconds`);
};

// Connect to MongoDB
const startServer = async (): Promise<void> => {
  await connectToMasterDB();
  //   simulateConcurrentInserts();
};

startServer();

export default app;
