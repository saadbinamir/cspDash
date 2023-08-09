// import React from "react";
// import { Route, Navigate } from "react-router-dom";
// import { useAuth } from "./Auth";

// export default function PrivateRoute({ element, ...rest }) {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated() ? (
//     <Route {...rest} element={element} />
//   ) : (
//     <Navigate to="/login" replace />
//   );
// }

import React from "react";
import { Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Auth";

export default function PrivateRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }
  return children;
}
