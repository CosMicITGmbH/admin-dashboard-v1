import React from "react";
import Moment from "react-moment";
import { Button, Container } from "reactstrap";
import { customerJobTag } from "../../helpers/appContants";
import DataTableCustom from "../Widgets/DataTableCustom";
import { useTranslation } from "react-i18next";

const Orders = (props) => {
  const { t } = useTranslation();
  //   const columns = [
  //     {
  //       name: <span className="font-weight-bold fs-13"># {t("ID")}</span>,
  //       selector: (row) => row.id,
  //       sortable: true,
  //       database_name: "id",
  //       width: "100px",
  //     },
  //     {
  //       name: <span className="font-weight-bold fs-13">{t("Date")}</span>,
  //       selector: (row) => row.insertedAt,
  //       cell: (row) => (
  //         <span>{<Moment format="DD/MM/YYYY">{row.insertedAt}</Moment>}</span>
  //       ),
  //       sortable: true,
  //       database_name: "insertedAt",
  //     },
  //     {
  //       name: <span className="font-weight-bold fs-13">{t("Name")}</span>,
  //       selector: (row) => row.name,
  //       database_name: "name",
  //       sortable: true,
  //     },
  //     {
  //       name: <span className="font-weight-bold fs-13">{t("View")}</span>,
  //       cell: (row) => (
  //         <Button
  //           color="danger"
  //           onClick={() => {
  //             props.history.push(
  //               `/customer-product?cid=${row.id}&cname=${row.name}`
  //             );
  //           }}
  //         >
  //           {t("Details")}
  //         </Button>
  //       ),
  //       ignoreRowClick: true,
  //       allowOverflow: true,
  //       button: true,
  //       width: "150px",
  //     },
  //   ];

  document.title = t("Orders");

  return (
    <div className="page-content">
      <Container fluid>
        {/* <DataTableCustom
          columns={columns}
          url={"jobs/Orders"}
          expressions={["name"]}
          tag={customerJobTag}
          isreportingApi={true}
          performanceUrl={"Orders"}
          isPieChartVisible={true}
          title={"Orders"}
        /> */}
        <h2 className="text-center">{t("Order page coming soon...")}</h2>
      </Container>
    </div>
  );
};

export default Orders;
