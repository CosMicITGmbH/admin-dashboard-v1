import React, { useState } from "react";
import Moment from "react-moment";
import { Button, Card, CardBody, Container } from "reactstrap";
import { servicesTag } from "../../../helpers/appContants";
import DataTableCustom from "../../Widgets/DataTableCustom";
import AddMachineModal from "./AddMachineModal";
import AddServiceModal from "./AddServiceModal";
import ConnectMachineServiceModal from "./ConnectMachineServiceModal";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">{t("Key")}</span>,
      selector: (row) => row.key,
      wrap: true,
      database_name: "key",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Name")}</span>,
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
      database_name: "name",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("EndPoint")}</span>,
      selector: (row) => row.endpoint,
      sortable: true,
      wrap: true,
      database_name: "endpoint",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Created On")}</span>,
      selector: (row) => row.insertedAt,
      sortable: true,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.insertedAt}</Moment>}</span>
      ),
      database_name: "insertedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Updated On")}</span>,
      selector: (row) => row.updatedAt,
      sortable: true,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.updatedAt}</Moment>}</span>
      ),
      database_name: "updatedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">{t("Machine-Key")}</span>,
      selector: (row) => row.machineKey,
      wrap: true,
    },
  ];
  const [reloading, setRealoading] = useState(false);
  const [modalService, setmodalService] = useState(false);
  const [modalMachine, setmodalMachine] = useState(false);
  const [modalConnectBoth, setModalConnectBoth] = useState(false);
  document.title = t("All Services");

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Card>
            <CardBody>
              <DataTableCustom
                columns={columns}
                url={"services"}
                expressions={["name", "endpoint"]}
                reloadData={reloading}
                tag={servicesTag}
              />
              {/*add machine and add service modals*/}
              <div className="text-center my-4 mx-2">
                <Button
                  type="button"
                  color="info"
                  onClick={() => {
                    setRealoading(false);
                    setmodalService(true);
                  }}
                >
                  {t("Add Service")}
                </Button>

                <Button
                  type="button"
                  color="success"
                  onClick={() => {
                    setRealoading(false);
                    setmodalMachine(true);
                  }}
                  style={{ marginLeft: "3px" }}
                >
                  {t("Add Machine")}
                </Button>
                <Button
                  type="button"
                  color="success"
                  onClick={() => {
                    setRealoading(false);
                    setModalConnectBoth(true);
                  }}
                  style={{ marginLeft: "3px" }}
                >
                  {t("Connect Machine - Service")}
                </Button>
              </div>
            </CardBody>
          </Card>
          <AddServiceModal
            modalState={modalService}
            closeServiceModal={() => {
              setRealoading(true);
              setmodalService(!modalService);
            }}
          />
          <AddMachineModal
            modalState={modalMachine}
            closeMachineModal={() => {
              setRealoading(true);
              setmodalMachine(!modalMachine);
            }}
          />
          <ConnectMachineServiceModal
            modalState={modalConnectBoth}
            closeConnectModal={() => {
              setRealoading(true);
              setModalConnectBoth(!modalConnectBoth);
            }}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Services;
