import { useNavigate } from "react-router-dom";

const CBackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/company")}
      className="text-blue-600 flex items-center gap-1 mb-4"
    >
      ⬅ Back
    </button>
  );
};

export default CBackButton;