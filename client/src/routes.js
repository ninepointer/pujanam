import Dashboard from './layouts/Dashboard'
import Pandit from "./layouts/Pandit"
import PanditDetails from './layouts/Pandit/panditDetails'
import Tier from './layouts/Tier'
import Pooja from './layouts/Pooja'
import TierDetails from './layouts/Tier/tierDetails'
import PoojaDetails from './layouts/Pooja/poojaDetails'
import DeviDevDetails from './layouts/DeviDevta/devDetails'
import DeviDev from './layouts/DeviDevta';
import MandirDetails from './layouts/Mandir/mandirDetails';
import Mandir from './layouts/Mandir';
import Carousel from './layouts/carousel'
import CarouselDetails from './layouts/carousel/carouselDetails'
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import Face5Icon from '@mui/icons-material/Face5';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import TempleBuddhistIcon from '@mui/icons-material/TempleBuddhist';
import { LiaPrayingHandsSolid } from "react-icons/lia";
import Booking from "./layouts/admin-booking";
import Consultation from "./layouts/admin-consultation";
import ItemDetails from './layouts/Item/itemDetails';
import Item from './layouts/Item';
import CategoryDetails from './layouts/Item-Category/categoryDetails';
import Category from './layouts/Item-Category';

const routes = [

  {
    route: "/devidevtadetails",
    component: <DeviDevDetails />,
  },
  {
    key: "pandit",
    route: "/pandit",
    component: <Pandit />,
  },
  {
    route: "/panditdetails",
    component: <PanditDetails />,
  },
  {
    key: "mandir",
    route: "/mandir",
    component: <Mandir />,
  },
  {
    route: "/mandirdetails",
    component: <MandirDetails />,
  },
  {
    key: "tier",
    route: "/tier",
    component: <Tier />,
  },
  {
    route: "/tierdetails",
    component: <TierDetails />,
  },
  {
    key: "pooja",
    route: "/pooja",
    component: <Pooja />,
  },
  {
    route: "/poojadetails",
    component: <PoojaDetails />,
  },
  {
    route: "/tierdetails",
    component: <TierDetails />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <DashboardIcon/>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Mandir",
    key: "mandir",
    icon: <TempleBuddhistIcon/>,
    route: "/mandir",
    component: <Mandir />,
  },
  {
    type: "collapse",
    name: "Pooja Services",
    key: "pooja",
    icon: <LiaPrayingHandsSolid/>,
    route: "/pooja",
    component: <Pooja />,
  },
  {
    type: "collapse",
    name: "Devi-Devta",
    key: "devidevta",
    icon: <LogoDevIcon/>,
    route: "/devidevta",
    component: <DeviDev />,
  },
  {
    type: "collapse",
    name: "Pandits",
    key: "pandit",
    icon: <Face5Icon/>,
    route: "/pandit",
    component: <Pandit />,
  },
  {
    type: "collapse",
    name: "Packages",
    key: "tier",
    icon: <Inventory2Icon/>,
    route: "/tier",
    component: <Tier />,
  },
  {
    type: "collapse",
    name: "Carousel",
    key: "carousel",
    icon: <ViewCarouselIcon/>,
    route: "/carousel",
    component: <Carousel />,
  },
  {
    type: "collapse",
    name: "Bookings",
    key: "booking",
    icon: <ViewCarouselIcon/>,
    route: "/booking",
    component: <Booking />,
  },
  {
    type: "collapse",
    name: "Consultations",
    key: "consultation",
    icon: <ViewCarouselIcon/>,
    route: "/consultation",
    component: <Consultation />,
  },
  {
    key: "carouselDetails",
    route: "/carouseldetails",
    component: <CarouselDetails />,
  },

  {
    type: "collapse",
    name: "Item",
    icon: <ViewCarouselIcon/>,
    key: "item",
    route: "/item",
    component: <Item />,
  },
  {
    route: "/itemdetails",
    component: <ItemDetails />,
  },

  {
    type: "collapse",
    name: "Category",
    icon: <ViewCarouselIcon/>,
    key: "category",
    route: "/category",
    component: <Category />,
  },
  {
    route: "/categorydetails",
    component: <CategoryDetails />,
  },


];

export default routes;
