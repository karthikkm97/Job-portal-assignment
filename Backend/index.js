require("dotenv").config();

const mongoose = require("mongoose");

const User = require("./models/user.model");
const Job = require('./models/jobs.model');

const connectionString = process.env.MONGO_URL;

mongoose.connect(connectionString);

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
app.use(express.json());

app.use(
    cors({
        origin: "*"
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

// Create account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full Name is required" });
    }

    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });
    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists",
        });
    }
    const user = new User({
        fullName,
        email,
        password,
    });
    await user.save();
    const accessToken = jwt.sign({ user },
        process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });
    if (!userInfo) {
        return res.json({
            error: true,
            message: "User Not Found",
        });
    }
    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });

    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });
    if (!isUser) {
        return res.sendStatus(401);

    }
    return res.json({
        user: { fullName: isUser.fullName, email: isUser.email, "_id": isUser._id, createdOn: isUser.createdOn },
        message: "",
    });
});

// Add Job
app.post("/add-job", authenticateToken, async (req, res) => {
    const {
        jobTitle,
        jobCategory,
        companyName,
        minSalary,
        maxSalary,
        salaryType,
        jobLocation,
        postingDate,
        experienceLevel,
        requiredSkills,
        companyLogo,
        employmentType,
        jobDescription,
    } = req.body;

    const { user } = req.user;

    // Validation
    if (!jobTitle || !companyName || !requiredSkills || !jobDescription || !jobCategory || !minSalary || !maxSalary || !salaryType || !jobLocation || !experienceLevel || !employmentType || !companyLogo) {
        return res.status(400).json({ error: true, message: "Required fields are missing." });
    }
    

    try {
        const job = new Job({
        jobTitle,
        jobCategory,
        companyName,
        minSalary,
        maxSalary,
        salaryType,
        jobLocation,
        experienceLevel,
        requiredSkills,
        companyLogo,
        employmentType,
        jobDescription,
        postingDate: postingDate || Date.now(),
        jobPostedBy: user._id,
        });

        await job.save();
        return res.json({ error: false, job, message: "Job added successfully." });
    } 
    catch (error) {
        console.error("Error adding job:", error); // Log full error details
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
    
});


// Edit Job
app.put("/edit-job/:jobId", authenticateToken, async (req, res) => {
    const jobId = req.params.jobId;
    const { jobTitle, companyName, minSalary, maxSalary, salaryType, jobLocation, postingDate, experienceLevel, requiredSkills, companyLogo, employmentType, jobDescription,jobCategory } = req.body;
    const { user } = req.user;

    if (!jobTitle || !companyName || !requiredSkills || !jobDescription || !jobCategory || !minSalary || !maxSalary || !salaryType || !jobLocation || !experienceLevel || !employmentType || !companyLogo || !postingDate) {
        return res
            .status(400)
            .json({ error: true, message: "No Changes provided" });
    }

    try {
        const job = await Job.findOne({ _id: jobId, jobPostedBy: user._id });
        if (!job) {
            return res
                .status(400)
                .json({ error: true, message: "Job not found" });

        }
        if (jobTitle) job.jobTitle = jobTitle;
        if (jobCategory) job.jobCategory = jobCategory;
        if (companyName) job.companyName = companyName;
        if (minSalary) job.minSalary = minSalary;
        if (maxSalary) job.maxSalary = maxSalary;
        if (salaryType) job.salaryType = salaryType;
        if (jobLocation) job.jobLocation = jobLocation;
        if (postingDate) job.postingDate = postingDate;
        if (experienceLevel) job.experienceLevel = experienceLevel;
        if (requiredSkills) job.requiredSkills = requiredSkills;
        if (companyLogo) job.companyLogo = companyLogo;
        if (employmentType) job.employmentType = employmentType;
        if (jobDescription) job.jobDescription = jobDescription;

        await job.save();
        return res.json({
            error: false,
            job,
            message: "Job updated Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });

    }
});

// Get All Jobs based on user
app.get("/get-all-jobs/", authenticateToken, async (req, res) => {

    const { user } = req.user;

    try {
        const jobs = await Job.find({ jobPostedBy: user._id });
        return res.json({
            error: false,
            jobs,
            message: "All Jobs retrieved Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Delete Job
app.delete("/delete-job/:jobId", authenticateToken, async (req, res) => {
    const jobId = req.params.jobId;
    const { user } = req.user;

    try {
        const deletedJob = await Job.findOneAndDelete({ _id: jobId, jobPostedBy: user._id });

        if (!deletedJob) {
            return res
                .status(404)
                .json({ error: true, message: "Job not found" });
        }

        return res.json({
            error: false,
            message: "Job Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Search Jobs based on category
// app.get("/search-jobs", async (req, res) => {
//     try {
//       const categories = await Job.aggregate([
//         { $group: { _id: "$jobCategory", jobs: { $push: "$$ROOT" } } },
//         { $project: { name: "$_id", jobs: 1, _id: 0 } },
//       ]);
//       res.status(200).json(categories);
//     } catch (error) {
//       console.error("Error fetching categories:", error.message);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   });
  
app.get("/get-Jobs/", async (req, res) => {
    try {
        const jobs = await Job.find().select('jobTitle jobCategory');
        return res.json({
            error: false,
            jobs,
            message: "All jobTitle jobCategory retrieved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});


  
  
      
  
app.listen(8000);

module.exports = app;
