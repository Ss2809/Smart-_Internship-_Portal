import axios from "axios";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://smart-internship-backend.onrender.com/api/user/logout",
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      window.location.href = "/"; // force navbar refresh
    } catch (error) {
      console.error("Logout failed", error);
      alert("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

export default Logout;
