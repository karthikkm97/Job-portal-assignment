/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditJobs = ({
  jobData,
  type,
  onClose,
  getAllJobs,
  showToastMessage,
}) => {
  const [jobTitle, setJobTitle] = useState(jobData?.jobTitle || "");
  const [jobCategory, setJobCategory] = useState(jobData?.jobCategory || "");
  const [companyName, setCompanyName] = useState(jobData?.companyName || "");
  const [minSalary, setMinSalary] = useState(jobData?.minSalary || "");
  const [maxSalary, setMaxSalary] = useState(jobData?.maxSalary || "");
  const [salaryType, setSalaryType] = useState(jobData?.salaryType || "");
  const [jobLocation, setJobLocation] = useState(jobData?.jobLocation || "");
  const [postingDate, setPostingDate] = useState(jobData?.postingDate || "");
  const [experienceLevel, setExperienceLevel] = useState(
    jobData?.experienceLevel || ""
  );
  const [requiredSkills, setRequiredSkills] = useState(
    jobData?.requiredSkills || ""
  );
  const [companyLogo, setCompanyLogo] = useState(jobData?.companyLogo || "");
  const [employmentType, setEmploymentType] = useState(
    jobData?.employmentType || ""
  );
  const [jobDescription, setJobDescription] = useState(
    jobData?.jobDescription || ""
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobData) {
      // If jobData exists, populate the form fields
      setJobTitle(jobData.jobTitle || "");
      setJobCategory(jobData.jobCategory || "");
      setCompanyName(jobData.companyName || "");
      setMinSalary(jobData.minSalary || "");
      setMaxSalary(jobData.maxSalary || "");
      setSalaryType(jobData.salaryType || "");
      setJobLocation(jobData.jobLocation || "");
      setExperienceLevel(jobData.experienceLevel || "");
      setRequiredSkills(jobData.requiredSkills || "");
      setCompanyLogo(jobData.companyLogo || "");
      setEmploymentType(jobData.employmentType || "");
      setJobDescription(jobData.jobDescription || "");

      if (jobData.postingDate) {
        // Convert the postingDate to 'yyyy-mm-dd' format before setting it
        const formattedDate = new Date(jobData.postingDate).toISOString().split("T")[0];
        setPostingDate(formattedDate);
      }
    }
  }, [jobData]);

  const handlePostingDateChange = (e) => {
    const newDate = e.target.value;
    setPostingDate(newDate); // Update the state with the formatted date
  };

  // Add job
  const addNewJob = async () => {
    try {
      const response = await axiosInstance.post("/add-job", {
        jobTitle,
        jobCategory,
        companyName,
        minSalary,
        maxSalary,
        salaryType,
        jobLocation,
        postingDate: postingDate || undefined, // Send only if valid
        experienceLevel,
        requiredSkills,
        companyLogo,
        employmentType,
        jobDescription,
      });
      if (response.data && response.data.job) {
        onClose(); // Close the modal first
        showToastMessage("Job Added Successfully"); // Show toast message after closing the modal
        getAllJobs(); // Fetch updated job list
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit job
  const editJob = async () => {
    const jobId = jobData._id;
    try {
      const response = await axiosInstance.put("/edit-job/" + jobId, {
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
      });
      if (response.data && response.data.job) {
        onClose(); // Close the modal first
        showToastMessage("Job Updated Successfully"); // Show toast message after closing the modal
        getAllJobs(); // Fetch updated job list
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddJob = () => {
    // Check for required fields
    if (!jobTitle) {
      setError("Please enter the job title");
      return;
    }
    if (!companyName) {
      setError("Please enter the company name");
      return;
    }
    if (!jobCategory) {
      setError("Please select a job category");
      return;
    }
    if (!minSalary) {
      setError("Please enter the minimum salary");
      return;
    }
    if (!maxSalary) {
      setError("Please enter the maximum salary");
      return;
    }
    if (!salaryType) {
      setError("Please select a salary type");
      return;
    }
    if (!jobLocation) {
      setError("Please enter the job location");
      return;
    }
    if (!postingDate) {
      setError("Please enter the posting date");
      return;
    }
    if (!experienceLevel) {
      setError("Please select an experience level");
      return;
    }
    if (!requiredSkills) {
      setError("Please enter the required skills");
      return;
    }
    if (!companyLogo) {
      setError("Please enter the company logo URL");
      return;
    }
    if (!employmentType) {
      setError("Please select an employment type");
      return;
    }
    if (!jobDescription) {
      setError("Please enter the job description");
      return;
    }

    // If all required fields are filled, clear the error and proceed
    setError("");

    if (type === "edit") {
      editJob();
    } else {
      addNewJob();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>
      <div className="max-h-[75vh] overflow-y-auto p-6">
        <div className="flex flex-col gap-2">
          <label className="input-label">Job Title</label>
          <input
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Job Title"
            value={jobTitle}
            onChange={({ target }) => setJobTitle(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Job Category</label>
          <select
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            value={jobCategory}
            onChange={({ target }) => setJobCategory(target.value)}
          >
            <option value="" disabled>
              Select Job Category
            </option>
            <option value="Sales & Marketing">Sales & Marketing</option>
            <option value="Creative">Creative</option>
            <option value="Human Resource">Human Resource</option>
            <option value="Administration">Administration</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Development">Development</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Company Name</label>
          <input
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Company Name"
            value={companyName}
            onChange={({ target }) => setCompanyName(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Minimum Salary</label>
          <input
            type="number"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Minimum Salary"
            value={minSalary}
            onChange={({ target }) => setMinSalary(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Maximum Salary</label>
          <input
            type="number"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Maximum Salary"
            value={maxSalary}
            onChange={({ target }) => setMaxSalary(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Salary Type</label>
          <select
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            value={salaryType}
            onChange={({ target }) => setSalaryType(target.value)}
          >
            <option value="" disabled>
              Select Salary Type
            </option>
            <option value="Hourly">Hourly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Job Location</label>
          <input
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Job Location"
            value={jobLocation}
            onChange={({ target }) => setJobLocation(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Posting Date</label>
          <input
            type="date"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Posting Date"
            value={postingDate}
            onChange={handlePostingDateChange}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Experience Level</label>
          <select
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            value={experienceLevel}
            onChange={({ target }) => setExperienceLevel(target.value)}
          >
            <option value="" disabled>
              Select Experience Level
            </option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Required Skills</label>
          <input
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Required Skills"
            value={requiredSkills}
            onChange={({ target }) => setRequiredSkills(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Company Logo</label>
          <input
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Company Logo URL"
            value={companyLogo}
            onChange={({ target }) => setCompanyLogo(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Employment Type</label>
          <select
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            value={employmentType}
            onChange={({ target }) => setEmploymentType(target.value)}
          >
            <option value="" disabled>
              Select Employment Type
            </option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Job Description</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Enter Job Description"
            rows={5}
            value={jobDescription}
            onChange={({ target }) => setJobDescription(target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

        <button
          className="btn-primary font-medium mt-5 p-3"
          onClick={handleAddJob}
        >
          {type === "edit" ? "UPDATE" : "ADD"}
        </button>
      </div>
    </div>
  );
};

export default AddEditJobs;
    