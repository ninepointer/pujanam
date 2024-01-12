import DailyContestDetails from './layouts/dailyContest/dailyContestDetails'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DailyContestDashboard from './layouts/dailyContestDashboard'
import DailyContest from "./layouts/dailyContest";
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


const routes = [

  {
    key: "dailycontest",
    route: "/dashboard/dailycontest",
    component: <DailyContest />,
  },
  {
    key: "devidevta",
    route: "/devidevta",
    component: <DeviDev />,
  },
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
    name: "TestZone Dashboard",
    key: "contestdashboard",
    icon: <EmojiEventsIcon/>,
    route: "/dashboard",
    component: <DailyContestDashboard />,
  },
  {
    route: "/dailycontestdetails",
    component: <DailyContestDetails />,
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
    key: "carouselDetails",
    route: "/carouseldetails",
    component: <CarouselDetails />,
  },


];

export default routes;
