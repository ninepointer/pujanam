import DailyContestDetails from './layouts/dailyContest/dailyContestDetails'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DailyContestDashboard from './layouts/dailyContestDashboard'
import DailyContest from "./layouts/dailyContest";
import Pandit from "./layouts/Pandit"
import PanditDetails from './layouts/Pandit/panditDetails'
import Tier from './layouts/Tier'
import TierDetails from './layouts/Tier/tierDetails'


const routes = [

  {
    key: "dailycontest",
    route: "/dashboard/dailycontest",
    component: <DailyContest />,
  },
  {
    key: "dailycontest",
    route: "/pandit",
    component: <Pandit />,
  },
  {
    route: "/panditdetails",
    component: <PanditDetails />,
  },
  {
    key: "dailycontest",
    route: "/tier",
    component: <Tier />,
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



];

export default routes;
