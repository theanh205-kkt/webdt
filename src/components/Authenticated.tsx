import React from "react";

type Props = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};

const Authenticated = ({ children, fallback }: Props) => {
  // Kiểm tra xem có user trong localStorage không
  const user = localStorage.getItem('user');
  const isAuthenticated = !!user;
  
  return <>{isAuthenticated ? children : fallback}</>;
};

export default Authenticated;
