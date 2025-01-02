import { useState, useEffect } from "react";
import { useNavigate,NavLink } from "react-router-dom";
import Modal from "react-modal";
import Navbar from "../../components/Navbar/Navbar";
import AddEditNotes from "./AddEditNotes";
import Toast from "../../components/ToastMessage/Toast";
import axiosInstance from "../../utils/axiosInstance";

function Home() {
  const [allJobs, setAllJobs] = useState([]);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null, // Ensure it's `data` here
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "",
  });
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Fetch all jobs
  const getAllJobs = async () => {
    try {
      const response = await axiosInstance.get("/get-all-jobs");
      console.log("API Response:", response.data); // Debug the response
      if (response.data && response.data.jobs) {
        setAllJobs(response.data.jobs);
      } else {
        setAllJobs([]); // Set empty array if no notes found
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
      setAllJobs([]); // Handle error by resetting the state
    }
  };

  // Fetch user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Delete a job
  const deleteJob = async (jobId) => {
    try {
      const response = await axiosInstance.delete(`/delete-job/${jobId}`);
      if (response.data && !response.data.error) {
        showToastMessage("Job deleted successfully", "delete");
        setAllJobs(allJobs.filter((job) => job._id !== jobId));
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      showToastMessage("Error deleting job", "error");
    }
  };

  const handleEdit = (jobDetails) => {
    //console.log("Job Details:", jobDetails); // Debug log
    setOpenAddEditModal({ isShown: true, data: jobDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
    setTimeout(() => {
      setShowToastMsg({ isShown: false, message: "", type: "" });
    }, 2000);
  };

  useEffect(() => {
    // Fetch jobs and user info once when the component mounts
    getAllJobs();
    getUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once
  
  return (
    <div className="p-6">
      <Navbar userInfo={userInfo} />
      <div className="flex justify-between items-center mb-6 p-5">
  <h1 className="text-2xl font-bold">Job List</h1>
  <div className="flex gap-4">
    <button
      className="px-4 py-3 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-300"
      onClick={() =>
        setOpenAddEditModal({ isShown: true, type: "add", data: null })
      }
    >
      Add Job
    </button>
   

    <NavLink
          to="/openpostition"
          className={({ isActive }) =>
            `px-4 py-3 bg-blue-500 text-white rounded-full text-sm ${
              isActive ? "bg-blue-300 text-white" : "text-white hover:bg-blue-200"
            }`
          }
        >
          Open Postition
        </NavLink>

  </div>
</div>


      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          jobData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getAllJobs={getAllJobs}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Job Title</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Company</th>
              <th className="p-2 text-left">Salary Range</th>
              <th className="p-2 text-left">Salary Type</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Posting Date</th>
              <th className="p-2 text-left">Experience Level</th>
              <th className="p-2 text-left">Skills</th>
              <th className="p-2 text-left">Employment Type</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Company Logo</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allJobs.length === 0 ? (
              <tr>
                <td className="text-center text-gray-500 mt-4" colSpan="13">
                  No data available
                </td>
              </tr>
            ) : (
              allJobs.map((job) => (
                <tr key={job._id} className="border-b">
                  <td className="p-2">{job.jobTitle}</td>
                  <td className="p-2">{job.jobCategory}</td>
                  <td className="p-2">{job.companyName}</td>
                  <td className="p-2">
                    {job.minSalary} - {job.maxSalary}
                  </td>
                  <td className="p-2">{job.salaryType}</td>
                  <td className="p-2">{job.jobLocation}</td>
                  <td className="p-2">
                    {new Date(job.postingDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">{job.experienceLevel}</td>
                  <td className="p-2">{job.requiredSkills || "N/A"}</td>
                  <td className="p-2">{job.employmentType}</td>
                  <td className="p-2">{job.jobDescription}</td>
                  <td className="p-2">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={`${job.companyName} Logo`}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      "No Logo"
                    )}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                        onClick={() => handleEdit(job)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 border border-red-500 text-red-500 rounded text-sm"
                        onClick={() => deleteJob(job._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={() =>
          setShowToastMsg({ isShown: false, message: "", type: "" })
        }
      />
    </div>
  );
}

export default Home;
