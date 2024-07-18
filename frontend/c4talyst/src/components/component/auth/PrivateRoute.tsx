"use client";

import { useContext, useEffect } from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "./AuthContext";
import Loading from "../Loading";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      redirect("/login");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <Loading />;
  }

  return <>{isAuthenticated ? children : null}</>;
};

export default PrivateRoute;