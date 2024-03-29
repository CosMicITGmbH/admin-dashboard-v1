import React from "react";
import Moment from "react-moment";
import { useLocation } from "react-router-dom";
import { Button, Container } from "reactstrap";
import { customerProductTag } from "../../helpers/appContants";
import DataTableCustom from "../Widgets/DataTableCustom";
import { useTranslation } from "react-i18next";

const CustomerProduct = (props) => {
  const { t } = useTranslation();
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">#{t("ID")}</span>,
      selector: (row) => row.id,
      sortable: true,
      database_name: "id",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Date")}</span>,
      selector: (row) => row.updatedAt,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.updatedAt}</Moment>}</span>
      ),
      sortable: true,
      database_name: "updatedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Name")}</span>,
      selector: (row) => row.name,
      database_name: "name",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">{t("View")}</span>,
      cell: (row, column) => (
        <Button
          color="danger"
          onClick={() => {
            props.history.push(
              `/product-order?pid=${row.id}&pname=${row.name}`
            );
          }}
        >
          {t("Details")}
        </Button>
      ),

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
  ];

  const searchParam = useLocation().search;
  const custid = new URLSearchParams(searchParam).get("cid");
  const custName = new URLSearchParams(searchParam).get("cname");

  document.title = t("Customer Product Details");

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
