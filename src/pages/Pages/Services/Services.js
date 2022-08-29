import React, { useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";
import {
  Container,
  Button,
  Card,
  CardBody,
  InputGroup,
  Input,
  Row,
  Col,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Grid, _ } from "gridjs-react";
import Loader from "../../../Components/Common/Loader";
import Moment from "react-moment";
import axios from "axios";
import AddServiceModal from "./AddServiceModal";
import AddMachineModal from "./AddMachineModal";
import PaginatedTable from "../../../Components/Reusable/PaginatedTable";

const Services = (props) => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Key</span>,
      database_name: "key",
      selector: (row) => row.key,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      database_name: "name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">EndPoint</span>,
      database_name: "endpoint",
      selector: (row) => row.endpoint,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">CreatedOn</span>,
      database_name: "insertedAt",
      selector: (row) => row.insertedAt,
      sortable: true,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.insertedAt}</Moment>}</span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Updated On</span>,
      database_name: "updatedAt",
      selector: (row) => row.updatedAt,
      sortable: true,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.updatedAt}</Moment>}</span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Connected Service-ID</span>,
      database_name: "machineId",
      selector: (row) => row.machineId,
      sortable: false,
    },
    {
      name: <span className="font-weight-bold fs-13">Connected Service</span>,
      selector: (row) => row.machineKey,
      sortable: false,
    },
  ];
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalService, setmodalService] = useState(false);
  const [modalMachine, setmodalMachine] = useState(false);
  document.title = "All Services | Velzon - React Admin & Dashboard Template";
  useEffect(() => {
    let pageLimit = 1;
    // let itemsPerPage = 5;
    //check role n
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;
    //  console.log("user role", userRole);
    if (userRole !== "user") {
      //getAllServices(1, 10);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, []);
  const setServiceArr = (services) => {
    console.log("loading services");
    return services.map((item) => {
      return {
        key: item.key,
        name: item.name,
        endpoint: item.endpoint,
        insertedAt: item.insertedAt,
        updatedAt: item.updatedAt,
        machineId: item?.machine?.connectedServices?.map(service => service.key).join("<br />") || "",
        machineKey: item?.machine?.connectedServices?.map(service => service.name).join("<br />") || "",
      };
    });
  };

  const changeHandler = (event) => {
    console.log("event.target.value", event.target.value);
    //setFilterText(event.target.value);
  };
  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300),
    []
  );
  const getExpression = val => `Key.ToString().ToLower().Contains("${val}".ToLower()) || Name.ToLower().Contains("${val}".ToLower()) || identity.services.Any(x => x.key.ToString().ToLower().Contains("${val}".ToLower()) || x.name.ToLower().Contains("${val}".ToLower()))`;
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <header className="card-title mb-4">
            <h4>List of services</h4>
          </header>
          {loading ? <Loader /> : <></>}

          <div style={{ display: loading == false ? 'block' : 'hidden' }}>
            <Card>
              <CardBody>
                <PaginatedTable
                  title="List of Services"
                  url="/services"
                  columns={columns}
                  mapResponse={setServiceArr}
                  getExpression={getExpression}
                  defaultSort="insertedAt ASC"
                  setLoading={(state) => setLoading(state)}
                />
                {/*ALL CODE ABOVE THIS: update profile and change pwd button below*/}
                <div className="text-center my-4 mx-2">
                  <Button
                    type="button"
                    color="info"
                    onClick={() => {
                      setmodalService(true);
                    }}
                  >
                    Add Service
                  </Button>

                  <Button
                    type="button"
                    color="success"
                    onClick={() => {
                      setmodalMachine(true);
                    }}
                    style={{ marginLeft: "3px" }}
                  >
                    Add Machine
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <AddServiceModal
            modalState={modalService}
            closeServiceModal={() => {
              setmodalService(!modalService);
            }}
          />
          <AddMachineModal
            modalState={modalMachine}
            closeMachineModal={() => {
              setmodalMachine(!modalMachine);
            }}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Services;
