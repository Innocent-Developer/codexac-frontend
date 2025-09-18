import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
