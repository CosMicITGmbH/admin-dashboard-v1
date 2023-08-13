import React from "react";
import Moment from "react-moment";
import { Button, Container } from "reactstrap";
import { customerJobTag } from "../../helpers/appContants";
import DataTableCustom from "../Widgets/DataTableCustom";

const Customers = (props) => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => row.date,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.date}</Moment>}</span>
      ),
      sortable: true,
      database_name: "insertedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">Customer</span>,
      selector: (row) => row.customer,
      cell: (row) => (
        <a href={`/customer-product?cid=${row.id}&cname=${row.customer}`}>
          {row.customer}
        </a>
      ),
      database_name: "name",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Total Sheets</span>,
      selector: (row) => row.totalSheets,
    },
    {
      name: <span className="font-weight-bold fs-13">Good Sheets</span>,
      selector: (row) => row.goodSheets,
    },
    {
      name: <span className="font-weight-bold fs-13">Bad Sheets</span>,
      selector: (row) => row.badSheets,
    },
    {
      name: <span className="font-weight-bold fs-13">Ejected sheets</span>,
      selector: (row) => row.ejectedSheets,
      // cell: (row) => <a href={"/profile?profileID=" + row.id}>Ejected</a>,
      // ignoreRowClick: true,
      // allowOverflow: true,
      button: true,
    },
    {
      name: <span className="font-weight-bold fs-13">View</span>,
      cell: (row, column) => (
        <Button
          color="danger"
          onClick={() => {
            props.history.push(
              `/customer-product?cid=${row.id}&cname=${row.customer}`
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

  document.title = "Customers";

  return (
    <div className="page-content">
      <Container fluid>
        <h4>{`Customers`}</h4>
        <DataTableCustom
          columns={columns}
          url={"jobs/customers"}
          expressions={["name"]}
          tag={customerJobTag}
          isreportingApi={true}
          performanceUrl={"customers"}
          isPieChartVisible={true}
        />
      </Container>
    </div>
  );
};

export default Customers;
