import { useState, useEffect, useMemo, useContext, useRef ,Fragment } from "react";
import axios from "axios"
import ReactGA from "react-ga"
import { Routes, Route, Navigate, useLocation, useNavigate, Redirect } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SettingsIcon from '@mui/icons-material/Settings';

// Material Dashboard 2 React components
import MDBox from "./components/MDBox";
// import MDAvatar from "./components/MDAvatar";

// Material Dashboard 2 React example components
import Sidenav from "./examples/Sidenav";
// import NewSidenav from "./examples/NewSideNav/Sidebar";
import Configurator from "./examples/Configurator";

// Material Dashboard 2 React themes
import theme from "./assets/theme";
import themeRTL from "./assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "./assets/theme-dark";
import themeDarkRTL from "./assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "./routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator, setLayout } from "./context";

// Images
import brandWhite from "./assets/images/logo-ct.png";
import Logo from "./assets/images/logos/fullLogo.png"
import brandDark from "./assets/images/logo-ct-dark.png";
import { userContext } from "./AuthContext";
import Cookies from 'js-cookie';
import homeRoutes from "./homeRoute";
import SignUp from './layouts/authentication/sign-up'
import About from "../src/layouts/HomePage/pages/About";
import Mandir from "../src/layouts/HomePage/pages/mandir/Mandir";
import ResetPassword from './layouts/authentication/reset-password/cover';
import { adminRole } from "./variables";
import { userRole } from "./variables";
import { Affiliate } from "./variables";
import Contact from "./layouts/HomePage/pages/Contact";
import Privacy from "./layouts/HomePage/pages/Privacy";
import Terms from "./layouts/HomePage/pages/Tnc";
import ProtectedRoute from "./ProtectedRoute";
import AdminLogin from "./layouts/authentication/sign-in/adminLogin";
import MandirData from "./layouts/HomePage/pages/mandir/MandirData";

const TRACKING_ID = "G-N2HM9R3W60"
ReactGA.initialize(TRACKING_ID);

function NotFound() {
  let navigate = useNavigate();
  // Redirecting to home when the component is loaded
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;  // You can also return some "Not Found" text or component here if you prefer
}

export default function App() {
  // const routesCollege = routesCollegeFunc();
  const cookieValue = Cookies.get("jwtoken");
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  // const [routes1, setRoutes] = useState();
  const [detailUser, setDetailUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { pathname } = useLocation();
  const location = useLocation();
  let noCookie = false;
  let myLocation = useRef(location);
  // const socket = useContext(socketContext)
  
  //get userdetail who is loggedin
  const setDetails = useContext(userContext);
  const getDetails = useContext(userContext);
  const navigate = useNavigate();
  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"
  
  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/loginDetail`, {
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
    })
    .then((res)=>{
      setDetails.setUserDetail(res.data.data);
      setDetailUser((res.data));
      setIsLoading(false);

    }).catch((err)=>{
      noCookie = true;
      setIsLoading(false);
    })

  }, [])
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction, getDetails]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname, getDetails]);


  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        if(route.route !== '/'){
          return <Route exact path={route.route} 
          element={
            <ProtectedRoute>
             {route.component}
            </ProtectedRoute>
          } 
          key={route.key} />;
        }else{
          return <Route exact path={route.route} 
          element={
             route.component
          } 
          key={route.key} />;
        }
      }
      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
      >
      <SettingsIcon/>
    </MDBox>
  );

  if (isLoading) {
    return <div></div>;
  }

  const isCollegeRoute = pathname.includes(getDetails?.userDetails?.collegeDetails?.college?.route)
  // console.log("cookieValue",isCollegeRoute, pathname, !cookieValue)

  return direction === "rtl" ? (
    
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
          <CssBaseline />
          {layout === "stoxherouserdashboard" && (
            <>
              {
                (getDetails?.userDetails?.role?.roleName == adminRole || getDetails?.userDetails?.role?.roleName == userRole|| getDetails?.userDetails?.role?.roleName == Affiliate || getDetails?.userDetails?.role?.roleName === "data") &&
                <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                // brandName="StoxHero"
                routes={(detailUser.role?.roleName === adminRole || getDetails?.userDetails?.role?.roleName === adminRole)
                ? routes
                 : homeRoutes
                }  
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
                // <NewSidenav/>
              }
              
              <Configurator />
              {configsButton}
            </>
          )}
        </ThemeProvider>
        {/* <MessagePopUp socket={socket} /> */}
      </CacheProvider>
    
  ) : (
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
          {
            (getDetails?.userDetails?.role?.roleName === Affiliate || getDetails?.userDetails?.role?.roleName === adminRole || getDetails?.userDetails?.role?.roleName === userRole|| getDetails?.userDetails?.role?.roleName === "data") &&
            <Sidenav
              color={sidenavColor}
              brand={Logo}
              // brandName="StoxHero"
              routes={
                (detailUser.role?.roleName === adminRole || getDetails?.userDetails?.role?.roleName === adminRole)
                ? routes 
                 : homeRoutes
              }
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            // <NewSidenav/>
          }

            <Configurator />
            {/* {configsButton} */}
          </>
        )}
        {layout === "infinitydashboard" && <Configurator />}
        {/* {layout === "analytics" && <Configurator />} */}
        <Routes>
        {(detailUser.role?.roleName === adminRole || getDetails?.userDetails?.role?.roleName === adminRole) 
        ? getRoutes(routes) : 
        getRoutes(homeRoutes)
        }
{/* 65659e451aac3cb5490d2e526579442a7a6c4ec430d7b219 overallpnlDailyContest */}
          {!cookieValue  ?  
          
          // pathname == "/login" ?
          // <Route path="/login" element={<SignIn />} />
          // :
          pathname == "/" ?
          <Route path="/" element={<SignUp location={myLocation.current} />} />
          :
          pathname == "/resetpassword" ?
          <Route path="/resetpassword" element={<ResetPassword/>} />
          :
          <Route path="/" element={<SignUp />} />
          :
          pathname == "/" || !pathname ?
          <Route path="/" element={<Navigate 
            to={getDetails?.userDetails.role?.roleName === adminRole ? "/dashboard" : getDetails.userDetails?.designation == 'Equity Trader' ? '/infinitytrading':'/dashboard'} 
            />} />
            :
            <Route path="*" element={<NotFound />} />
          
          }


          <Route path='/resetpassword' element={<ResetPassword/>}/>
          <Route path='/privacy' element={<Privacy/>}/>
          <Route path='/terms' element={<Terms/>}/>
          <Route path='/' element={<Navigate 
            to={getDetails?.userDetails?.role ? getDetails?.userDetails.role?.roleName === adminRole ? "/dashboard" : getDetails.userDetails?.designation == 'Equity Trader' ? '/infinitytrading':'/dashboard':'/'} 
            />}/>
          <Route path='/adminlogin' element={<AdminLogin />}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/mandir' element={<Mandir/>}/>
          <Route path='/mandir/:id' element={<MandirData/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path="*" element={<NotFound />} />

        </Routes>
      </ThemeProvider>
  );
} 