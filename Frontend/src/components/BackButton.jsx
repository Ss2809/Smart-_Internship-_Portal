import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="text-blue-600 flex items-center gap-1 mb-4"
    >
      ⬅ Back
    </button>
  );
};

export default BackButton;
