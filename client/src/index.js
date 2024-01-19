
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./context";
import AuthContext, { userContext } from "./AuthContext";
import RenderContext from "./renderContext";
import SettingContext from "./settingContext"
import LocationContext from "./locationContext"


ReactDOM.render(
  <LocationContext>
  <AuthContext>
    <RenderContext >
      <SettingContext>
          <BrowserRouter>
            <MaterialUIControllerProvider>
              <App />
            </MaterialUIControllerProvider>
          </BrowserRouter>
      </SettingContext>
    </RenderContext>
  </AuthContext>
  </LocationContext>,
  document.getElementById("root")
);
