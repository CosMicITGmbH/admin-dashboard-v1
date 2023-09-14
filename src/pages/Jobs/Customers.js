import React from "react";
import Moment from "react-moment";
import { Button, Container } from "reactstrap";
import { customerJobTag } from "../../helpers/appContants";
import DataTableCustom from "../Widgets/DataTableCustom";
import { useTranslation } from "react-i18next";

const Customers = (props) => {
  const { t } = useTranslation();
  const columns = [
    {
      name: <span className="font-weight-bold fs-13"># {t("ID")}</span>,
      selector: (row) => row.id,
      sortable: true,
      database_name: "id",
      width: "100px",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Date")}</span>,
      selector: (row) => row.date,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.date}</Moment>}</span>
      ),
      sortable: true,
      database_name: "insertedAt",
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
              `/customer-product?cid=${row.id}&cname=${row.name}`
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
      // style: {
      //   width: "auto",
      //   background: "orange",
      //   display: "block",
      // },
    },
  ];
  // const [reload, setreload] = useState(false);
  // const machineName = useSelector((state) => state.Machine.machineName);
  // useEffect(() => {
  //   console.log("*** out ", machineName);
  //   //setreload(false);
  //   if (machineName.name) {
  //     console.log("*** in ");
  //     //setreload(true);
  //     //window.location.reload();
  //   }
  // }, [machineName.name]);

  document.title = t("Customer");

  return (
    <div className="page-content">
      <Container fluid>
        <DataTableCustom
          columns={columns}
          url={"jobs/customers"}
          expressions={["name"]}
          tag={customerJobTag}
          isreportingApi={true}
          performanceUrl={"customers"}
          isPieChartVisible={true}
          title={"Customers"}
          // reloadData={reload}
          // unsetReload={() => setreload(false)}
          // machineData={machineName}
        />
      </Container>
    </div>
  );
};

export default Customers;
