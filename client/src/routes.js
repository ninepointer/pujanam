import DailyContestDetails from './layouts/dailyContest/dailyContestDetails'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DailyContestDashboard from './layouts/dailyContestDashboard'
import DailyContest from "./layouts/dailyContest";
import Pandit from "./layouts/Pandit"
import PanditDetails from './layouts/Pandit/panditDetails'


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
