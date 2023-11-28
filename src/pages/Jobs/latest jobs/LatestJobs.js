import React from "react";
import Moment from "react-moment";
import { useLocation, useHistory } from "react-router-dom";
import { Button, Container } from "reactstrap";
import { latestJobsTag } from "../../../helpers/appContants";
import DataTableCustom from "../../Widgets/DataTableCustom";
import { useTranslation } from "react-i18next";

const LatestJobs = () => {
  const navigate = useHistory();
  const { t } = useTranslation();
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">#</span>,
      cell: (row) => <span>{row.id}</span>,
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Date")}</span>,
      selector: (row) => row.insertedAt,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.insertedAt}</Moment>}</span>
      ),
      // sortable: true,
      database_name: "insertedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Schema ID")}</span>,
      cell: (row) => <span>{row.schemaId}</span>,
    },
    {
      name: <span className="font-weight-bold fs-13">{t("State")}</span>,
      cell: (row) => <span>{row.state}</span>,
    },
    {
      name: <span className="font-weight-bold fs-13">{t("View")}</span>,
      cell: (row) => (
        <Button
          color="danger"
          onClick={() => {
            navigate.push(`/orders?oid=${row.id}`);
          }}
        >
          {t("Details")}
        </Button>
      ),
    },
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
