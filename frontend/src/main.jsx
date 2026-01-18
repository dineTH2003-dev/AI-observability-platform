import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import { SidebarProvider } from "context/SidebarContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

const basename = import.meta.env.VITE_APP_BASE_NAME || "/";

root.render(
  <BrowserRouter basename={basename}>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </BrowserRouter>
);
