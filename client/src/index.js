
import React from "react";
import ReactDOM from "react-dom";
// import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./context";
import AuthContext, { userContext } from "./AuthContext";
import RenderContext from "./renderContext";
import SettingContext from "./settingContext"
// import FeaturedContestRegistration from "./layouts/HomePage/pages/FeaturedContestRegistration"


ReactDOM.render(
  // const root = ReactDOM.createRoot(document.getElementById("root"));
  // root.render(

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

  </AuthContext>,
  document.getElementById("root")
);
