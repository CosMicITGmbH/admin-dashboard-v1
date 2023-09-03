import React from "react";
import Moment from "react-moment";
import { useLocation } from "react-router-dom";
import { Container } from "reactstrap";
import { productOrderTag } from "../../helpers/appContants";
import DataTableCustom from "../Widgets/DataTableCustom";

const ProductOrder = () => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">#ID</span>,
      selector: (row) => row.id,
      // cell: (row) => (
      //   <span>{<Moment format="DD/MM/YYYY">{row.date}</Moment>}</span>
      // ),
      sortable: true,
      database_name: "id",
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => row.updatedAt,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.updatedAt}</Moment>}</span>
      ),
      sortable: true,
      database_name: "updatedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      // cell: (row) => <a href={`/order?oid=${row.id}`}>{row.order}</a>,
      database_name: "name",
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Total Sheets</span>,
    //   selector: (row) => row.totalResults,
    // },
    // {
    //   name: <span className="font-weight-bold fs-13">Good Sheets</span>,
    //   selector: (row) => row.goodResults,
    // },
    // {
    //   name: <span className="font-weight-bold fs-13">Bad Sheets</span>,
    //   selector: (row) => row.badResults,
    // },
    // {
    //   name: <span className="font-weight-bold fs-13">Ejected sheets</span>,
    //   selector: (row) => row.ejectedTotalResults,
    //   button: true,
    // },
    // {
    //   name: <span className="font-weight-bold fs-13">View</span>,
    //   cell: (row, column) => (
    //     <Button
    //       color="danger"
    //       onClick={() => {
    //         props.history.push(`/order?oid=${row.id}`);
    //       }}
    //     >
    //       Details
    //     </Button>
    //   ),

    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,
    // },
  ];

  document.title = "Product Details";

  const searchParam = useLocation().search;
  const productId = new URLSearchParams(searchParam).get("pid");
  const productName = new URLSearchParams(searchParam).get("pname");

  return (
    <div className="page-content">
      <Container fluid>
        <DataTableCustom
          columns={columns}
          url={`jobs/products/${productId}/orders`}
          expressions={["name"]}
          tag={productOrderTag}
          isreportingApi={true}
          title={productName}
          isPieChartVisible={true}
          value={productId}
        />
      </Container>
    </div>
  );
};

export default ProductOrder;
