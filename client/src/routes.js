import DailyContestDetails from './layouts/dailyContest/dailyContestDetails'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DailyContestDashboard from './layouts/dailyContestDashboard'
import DailyContest from "./layouts/dailyContest";

const routes = [

  {
    // type: "collapse",
    // name: "Internship Batch",
    key: "dailycontest",
    // icon: <BatchIcon/>,
    route: "/contestdashboard/dailycontest",
    component: <DailyContest />,
  },
  {
    type: "collapse",
    name: "TestZone Dashboard",
    key: "contestdashboard",
    icon: <EmojiEventsIcon/>,
    route: "/contestdashboard",
    component: <DailyContestDashboard />,
  },
  {
    route: "/dailycontestdetails",
    component: <DailyContestDetails />,
  },



];

export default routes;
