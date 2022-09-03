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

const Services = (props) => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Key</span>,
      selector: (row) => row.key,
      sortable: true,
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">EndPoint</span>,
      selector: (row) => row.endpoint,
      sortable: true,
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">CreatedOn</span>,
      selector: (row) => row.insertedAt,
      sortable: true,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.insertedAt}</Moment>}</span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Updated On</span>,
      selector: (row) => row.updatedAt,
      sortable: true,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.updatedAt}</Moment>}</span>
      ),
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Machine</span>,
    //   selector: (row) => row.machine,
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Machine-ID</span>,
      selector: (row) => row.machineId,
      sortable: true,
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Machine-Key</span>,
      selector: (row) => row.machineKey,
      sortable: true,
      wrap: true,
    },
  ];
  // const [data, setData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
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
      getAllServices(1, 10);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, []);
  const setServiceArr = (services) => {
    console.log("loading services");
    //let newArr = [];
    let res1 = services.map((item) => {
      return {
        key: item.key,
        name: item.name,
        endpoint: item.endpoint,
        insertedAt: item.insertedAt,
        updatedAt: item.updatedAt,
        machineId: item?.machine?.connectedServices?.[0].key || "NA",
        machineKey: item?.machine?.connectedServices?.[0].name || "NA",
      };
    });
    console.log("newArr services", res1);
    setGridData(res1);
  };
  function getAllServices(pageNo, per_Page) {
    setLoading(true);
    console.log(`url=/services?page=${pageNo}&itemsPerPage=${per_Page}`);
    axios
      .post(`/services?page=${pageNo}&itemsPerPage=${per_Page}`, {})
      .then((data) => {
        console.log(data.items);

        setLoading(false);
        //setData(data.items)
        setServiceArr(data.items);
      })

      .catch((err) => {
        console.log(err);
        if (err.split(" ").includes("401")) {
          props.history.push("/login");
        }
        setLoading(false);
      });
  }
  const handlePageChange = (page) => {
    console.log("handlePageChange", page);
    getAllServices(page, perPage);
    //setTotalRows(totalRows - perPage);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    //let url = `/users?page=${page}&itemsPerPage=${newPerPage}`;
    console.log(
      `newPerPage=${newPerPage} page=${page} url=/services?page=${page}&itemsPerPage=${newPerPage}`
    );
    try {
      setLoading(true);
      const response = await axios.post(
        `/services?page=${page}&itemsPerPage=${newPerPage}`,
        {}
      );
      setLoading(false);
      setServiceArr(response.items);
    } catch (error) {
      console.log("Err", error);
      setLoading(false);
    }
  };

  const changeHandler = (event) => {
    console.log("event.target.value", event.target.value);
    //setFilterText(event.target.value);
  };
  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300),
    []
  );
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <header className="card-title mb-4">
            <h4>List of services</h4>
          </header>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Row>
                <Col>
                  <InputGroup>
                    <Input
                      // value={filterText}
                      type="text"
                      placeholder="Search any field..."
                      onChange={debouncedChangeHandler}
                    />
                    <Button
                      onClick={() => {
                        console.log("clear button clicked");
                        //  setFilterText("");
                        // getAllUsers(1)
                      }}
                    >
                      Reset
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
              <Card>
                <CardBody>
                  <DataTable
                    title="List of Services"
                    columns={columns}
                    data={gridData}
                    pagination
                    paginationServer
                    // paginationTotalRows={totalRows}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerRowsChange}
                    paginationRowsPerPageOptions={[10, 15, 25, 50]}
                    fixedHeader
                    style={{
                      td: "80px",
                      th: "80px",
                    }}
                    //paginationTotalRows
                    //  paginationDefaultPage={perPage}
                    //fixedHeaderScrollHeight="500px"
                    //selectableRows
                    //persistTableHead
                    //subHeader
                    // subHeaderComponent={subHeaderComponentMemo}
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
            </>
          )}
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
