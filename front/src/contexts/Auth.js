import React from "react";
import { hasAuthenticated } from "../services/AuthApi";

export default React.createContext({
  isAuthenticated: hasAuthenticated(),
});
