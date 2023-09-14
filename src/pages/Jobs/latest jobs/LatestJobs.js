import React from "react";
import Moment from "react-moment";
import { Container } from "reactstrap";
import { latestJobsTag } from "../../../helpers/appContants";
import DataTableCustom from "../../Widgets/DataTableCustom";
import { useTranslation } from "react-i18next";

const LatestJobs = () => {
  const { t } = useTranslation();
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">#</span>,
      cell: (row) => <span>{row.id}</span>,
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Date")}</span>,
      selector: (row) => row.date,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.date}</Moment>}</span>
      ),
      // sortable: true,
      database_name: "insertedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Customer")}</span>,
      selector: (row) => row.customer,
      cell: (row) => (
        <a
          href={`/customer-product?cid=${row.customer.split(" #")[1]}&cname=${
            row.customer.split(" #")[0]
          }`}
        >
          {row.customer.split(" #")[0]}
        </a>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Product")}</span>,
      selector: (row) => row.product,
      cell: (row) => (
        <a
          href={`/product-order?pid=${row.product.split(" #")[1]}&pname=${
            row.product.split(" #")[0]
          }`}
        >
          {row.product.split(" #")[0]}
        </a>
      ),
      // database_name: "name",
      // sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Order")}</span>,
      selector: (row) => row.order,
      cell: (row) => (
        <a
          href={`/customer-product?cid=${row.order.split(" #")[1]}&cname=${
            row.order.split(" #")[0]
          }`}
        >
          {row.order.split(" #")[0]}
        </a>
      ),
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Total Sheets</span>,
    //   selector: (row) => row.totalSheets,
    // },
    // {
    //   name: <span className="font-weight-bold fs-13">Good Sheets</span>,
    //   selector: (row) => row.goodSheets,
    // },
    // {
    //   name: <span className="font-weight-bold fs-13">Bad Sheets</span>,
    //   selector: (row) => row.badSheets,
    // },
    // {
    //   name: <span className="font-weight-bold fs-13">Ejected sheets</span>,
    //   selector: (row) => row.ejectedSheets,
    //   button: true,
    // },
  ];

  document.title = t("Latest Jobs");

  return (
    <div className="page-content">
      <Container fluid>
        <DataTableCustom
          columns={columns}
          url={"jobs/search/orders/latest"}
          expressions={["name"]}
          tag={latestJobsTag}
          isreportingApi={true}
          performanceUrl={"orders"}
        />
      </Container>
    </div>
  );
};

export default LatestJobs;
