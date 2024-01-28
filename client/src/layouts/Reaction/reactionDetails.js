// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import CreateReactionForm from "./createReactionForm";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <CreateReactionForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
