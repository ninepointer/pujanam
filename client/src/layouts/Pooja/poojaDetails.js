// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import CreatePoojaForm from "./createPoojaForm";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <CreatePoojaForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;