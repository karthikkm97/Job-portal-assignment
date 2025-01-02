import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    alert("Logout Successful");
    navigate("/");
  };

  return (
    <div className="bg-[#1a2f55] text-white p-6">
      <div className="flex items-center justify-between">
        {/* Logo and Description */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full">
            <img src={logo} alt="TechForing Logo" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">TechForing</h1>
            <p className="text-sm">Shaping Tomorrow&apos;s Cybersecurity</p>
          </div>
        </div>

        {/* Logout Button */}
        
        <button
          onClick={onLogout}
          className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
