const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    salaryType: { 
        type: String, 
        enum: ["Hourly", "Monthly", "Yearly"], 
        required: true 
    },
    jobLocation: { type: String, required: true },
    jobCategory: { 
        type: String, 
        enum: ["Sales & Marketing", "Creative", "Human Resource", "Administration", "Digital Marketing", "Development", "Engineering"],
        required: true 
    },
    postingDate: { type: Date, default: Date.now },
    experienceLevel: {
        type: String,
        enum: ["Entry Level", "Mid Level", "Senior Level"],
        required: true 
    },
    requiredSkills: { type: [String], required: true },
    companyLogo: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
            },
            message: "Invalid URL format for companyLogo"
        }
    },
    employmentType: {
        type: String,
        enum: ["Full-Time", "Part-Time", "Contract", "Freelance","Internship"],
        required: true 
    },
    jobDescription: { type: String, required: true },
    jobPostedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

// Validation for minSalary and maxSalary
jobSchema.pre("save", function (next) {
    if (this.minSalary >= this.maxSalary) {
        return next(new Error("minSalary should be less than maxSalary"));
    }
    next();
});

module.exports = mongoose.model("Job", jobSchema);
