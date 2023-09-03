import React from "react";
import Moment from "react-moment";
import { useLocation } from "react-router-dom";
import { Button, Container } from "reactstrap";
import { customerProductTag } from "../../helpers/appContants";
import DataTableCustom from "../Widgets/DataTableCustom";

const CustomerProduct = (props) => {
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
      // cell: (row) => (
      //   <a href={`/product-order?pid=${row.id}&pname=${row.name}`}>
      //     {row.name}
      //   </a>
      // ),
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
    {
      name: <span className="font-weight-bold fs-13">View</span>,
      cell: (row, column) => (
        <Button
          color="danger"
          onClick={() => {
            props.history.push(
              `/product-order?pid=${row.id}&pname=${row.name}`
            );
          }}
        >
          Details
        </Button>
      ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const searchParam = useLocation().search;
  const custid = new URLSearchParams(searchParam).get("cid");
  const custName = new URLSearchParams(searchParam).get("cname");

  document.title = "Product Details";

  return (
    <div className="page-content">
      <Container fluid>
        <DataTableCustom
          columns={columns}
          url={`jobs/customers/${custid}/products`}
          expressions={["name"]}
          tag={customerProductTag}
          isreportingApi={true}
          title={custName}
          isPieChartVisible={true}
          value={custid}
        />
      </Container>
    </div>
  );
};

export default CustomerProduct;
