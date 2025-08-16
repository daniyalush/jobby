const { Server } = require("socket.io");
const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const http = require("http");
const path = require("path");
const connectDB = require("./database/db");
const Job = require("./models/job");

// Load environment variables BEFORE anything else
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Connect DB
connectDB(MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: { origin: "*" }, // in production: set to your frontend URL
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Function to fetch jobs and insert new ones
const fetchAndBroadcastJobs = async () => {
  try {
    const response = await axios.get("https://remotive.com/api/remote-jobs");
    const jobs = response.data.jobs;

    // Map fields
    const filteredJobs = jobs.map((job) => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location,
      skills: job.tags.join(", "),
      description: job.description.replace(/<[^>]*>/g, ""), // Remove HTML tags
      url: job.url,
      datePosted: new Date(job.publication_date),
    }));

    // Get URLs already in DB
    const existingUrls = await Job.find({
      url: { $in: filteredJobs.map((j) => j.url) },
    }).select("url");
    const existingSet = new Set(existingUrls.map((j) => j.url));

    // Filter new jobs only
    const newJobs = filteredJobs.filter((j) => !existingSet.has(j.url));

    if (newJobs.length > 0) {
      const insertedJobs = await Job.insertMany(newJobs);
      insertedJobs.forEach((job) => io.emit("new-job", job)); // broadcast immediately
      console.log(`${insertedJobs.length} new jobs inserted and broadcasted.`);
    }
  } catch (err) {
    console.error("Error fetching jobs:", err.message);
  }
};

// Initial fetch
fetchAndBroadcastJobs();

// Periodically fetch new jobs
setInterval(fetchAndBroadcastJobs, FETCH_INTERVAL);

// API endpoint to manually trigger job fetch
app.get("/api/jobs", async (req, res) => {
  try {
    await fetchAndBroadcastJobs();
    res.json({ message: "Jobs fetched and broadcasted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all jobs from DB sorted by newest first
app.get("/api/jobs/db", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ datePosted: -1 }).lean();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ In production: serve Angular dist/ folder
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../frontend/dist/frontend/browser"))
  );

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist/frontend/browser/index.html")
    );
  });
}

server.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
