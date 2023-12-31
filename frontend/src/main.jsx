import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";
import { StateContext } from "./lib/context";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import { domain, clientId } from "./utils/config";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: "https://resource-booking-frontend.vercel.app",
        audience: "https://resource-booking-api.vercel.app/",
        grant_type: `authorization_code `,
        scope: "openid profile email read:admin read:client",
      }}
      cacheLocation="localstorage"
      response_type="token"
    >
      <BrowserRouter>
        <StateContext>
          <App />
        </StateContext>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
