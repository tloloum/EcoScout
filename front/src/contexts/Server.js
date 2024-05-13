import { createContext } from "react";

const ServerContext = createContext();

const ServerContextProvider = (props) => {
  const getServerAddress = () => {
    const ServerAddress = "http://localhost:3000/";
    return ServerAddress;
  };

  return (
    <ServerContext.Provider value={{ getServerAddress }}>
      {props.children}
    </ServerContext.Provider>
  );
};

export { ServerContext, ServerContextProvider };
