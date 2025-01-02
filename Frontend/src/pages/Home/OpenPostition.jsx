import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { NavLink } from "react-router-dom";

const JobListings = () => {
  const [expandedSection, setExpandedSection] = useState(null); // Start with no section expanded
  const [jobCategories] = useState([
    { name: "Sales & Marketing", jobs: [] },
    { name: "Creative", jobs: [] },
    { name: "Human Resource", jobs: [] },
    { name: "Administration", jobs: [] },
    { name: "Digital Marketing", jobs: [] },
    { name: "Development", jobs: [] },
    { name: "Engineering", jobs: [] },
  ]);

  // Initialize jobs state with empty arrays for each category
  const [jobs, setJobs] = useState(
    jobCategories.reduce((acc, cat) => {
      acc[cat.name] = []; // Initialize each category with an empty array
      return acc;
    }, {})
  );

  // Function to fetch jobs for a category
  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get("/get-Jobs");
      console.log("Jobs Response: ", response);

      if (response.data && response.data.jobs) {
        const filteredJobs = response.data.jobs.reduce((acc, job) => {
          const category = jobCategories.find(
            (cat) => cat.name === job.jobCategory
          );
          if (category) {
            if (!acc[category.name]) {
              acc[category.name] = [];
            }
            acc[category.name].push(job);
          }
          return acc;
        }, {});

        setJobs(filteredJobs);
      } else {
        setJobs({});
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.", error);
      setJobs({});
    }
  };

  // Toggle expanded section and fetch jobs if not already fetched
  const toggleSection = (categoryName) => {
    if (expandedSection === categoryName) {
      setExpandedSection(null);
    } else {
      setExpandedSection(categoryName);
      if (!jobs[categoryName]) {
        fetchJobs();
      }
    }
  };

  useEffect(() => {
    fetchJobs(); // Initially fetch jobs when the component mounts
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-4 py-3 bg-blue-500 text-white rounded-full text-sm ${
              isActive
                ? "bg-blue-300 text-white"
                : "text-white hover:bg-blue-200"
            }`
          }
        >
          Add New Job
        </NavLink>
      </div>
      <div className="max-w-5xl mx-auto p-6">
        <div
          className="flex flex-col gap-4"
          style={{
            maxHeight: "500px", // Set the max height of the category container
            overflowY: "auto", // Enable vertical scrolling for categories
          }}
        >
          {/* Render each job category */}
          {jobCategories.map((dept) => (
            <div
              key={dept.name}
              className="border border-gray-300 rounded-lg bg-white"
            >
              {/* Section header */}
              <button
                onClick={() => toggleSection(dept.name)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="text-gray-700 font-medium">{dept.name}</span>
                <span className="text-lg">
                  {expandedSection === dept.name ? "−" : "+"}
                </span>
              </button>

              {/* Job listings for the expanded section */}
              {expandedSection === dept.name && (
                <div
                  className="px-6 pb-4"
                  style={{
                    maxHeight: "400px", // Set max-height for job listings area
                    overflowY: "auto", // Enable scrolling for job listings
                  }}
                >
                  {Array.isArray(jobs[dept.name]) &&
                  jobs[dept.name]?.length > 0 ? (
                    jobs[dept.name].map((job) => (
                      <div
                        key={job.id}
                        className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0"
                      >
                        <span className="text-gray-700">{job.jobTitle}</span>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-100">
                            <span>APPLY NOW</span>
                            <div className="flex ml-2 gap-x-2">
                              <img
                                src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/in.svg"
                                alt="India Flag"
                                className="inline-block w-6 h-6 rounded border border-gray-300"
                              />
                              <img
                                src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/bd.svg"
                                alt="Bangladesh Flag"
                                className="inline-block w-6 h-6 rounded border border-gray-300"
                              />
                            </div>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No openings in this category.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default JobListings;
