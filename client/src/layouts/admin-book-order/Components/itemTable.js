import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox"
import MDTypography from "../../../components/MDTypography"
import Card from "@mui/material/Card";

const AddTier = ({ items }) => {
    let columns = [
        { Header: "#", accessor: "no", align: "center" },
        { Header: "Item", accessor: "item", align: "center" },
        { Header: "Category", accessor: "category", align: "center" },
        { Header: "Quantity", accessor: "quantity", align: "center" },
        { Header: "Amount", accessor: "amount", align: "center" },
    ];

    let rows = [];
    let totalAmount = 0;
    let totalQuantity = 0;
    const infoData = {};

    items?.map((elem, index) => {
        let infoData = {}
        totalQuantity += elem?.order_quantity;
        totalAmount += elem?.order_amount;

        infoData.no = (
            <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {index+1}
        </MDTypography>
        );
        infoData.item = (
            <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {elem?.item_id?.name}
        </MDTypography>
        );
        infoData.category = (
            <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {elem?.category_id?.name}
        </MDTypography>
        );
        infoData.quantity = (
            <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
                {elem?.order_quantity}
            </MDTypography>
        );
        infoData.amount = (
            <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
                {elem?.order_amount}
            </MDTypography>
        );

        rows.push(infoData)
    })


    infoData.item = (
        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {/* {elem?.item_id?.name} */}
        </MDTypography>
    );
    infoData.category = (
        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {"TOTAL"}
        </MDTypography>
    );
    infoData.quantity = (
        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {totalQuantity}
        </MDTypography>
    );
    infoData.amount = (
        <MDTypography component="a" variant="caption" color="dark" fontWeight="medium">
            {totalAmount}
        </MDTypography>
    );

    rows.push(infoData)


    return (

        <Card>
            <MDBox mt={1}>
                <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                />
            </MDBox>
        </Card>
    );
}

export default AddTier;