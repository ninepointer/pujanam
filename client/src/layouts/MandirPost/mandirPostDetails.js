// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import CreateMandirPostForm from "./createMandirPostForm";

function Tables() {

  return (
    <>
    <DashboardLayout>
      <DashboardNavbar />
      <CreateMandirPostForm/>
      <Footer />
    </DashboardLayout>
    </>
  );
}

export default Tables;
