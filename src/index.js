import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { HMSRoomProvider } from "@100mslive/react-sdk";

import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HMSRoomProvider>
        <App />
      </HMSRoomProvider>
    </Provider>
  </React.StrictMode>
);
