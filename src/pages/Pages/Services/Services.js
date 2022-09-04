import React, { useEffect, useState, useMemo, useRef } from "react";
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
      // sortable: true,
      wrap: true,
      database_name: "key",
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
      database_name: "name",
    },
    {
      name: <span className="font-weight-bold fs-13">EndPoint</span>,
      selector: (row) => row.endpoint,
      sortable: true,
      wrap: true,
      database_name: "endpoint",
    },
    {
      name: <span className="font-weight-bold fs-13">CreatedOn</span>,
      selector: (row) => row.insertedAt,
      sortable: true,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.insertedAt}</Moment>}</span>
      ),
      database_name: "insertedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">Updated On</span>,
      selector: (row) => row.updatedAt,
      sortable: true,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.updatedAt}</Moment>}</span>
      ),
      database_name: "updatedAt",
    },

    {
      name: <span className="font-weight-bold fs-13">Machine-ID</span>,
      selector: (row) => row.machineId,
      //sortable: true,
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Machine-Key</span>,
      selector: (row) => row.machineKey,
      // sortable: true,
      wrap: true,
    },
  ];
  const [isLoaded, setIsLoaded] = useState(false);
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
  });
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("key ASC");
  const [search, setSearch] = useState("");
  const [expression, setExpression] = useState("");

  const [modalService, setmodalService] = useState(false);
  const [modalMachine, setmodalMachine] = useState(false);
  document.title = "All Services";
  useEffect(() => {
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;
    console.log("user role", userRole);
    if (userRole !== "user") {
      //getAllUsers(1, 10);
      console.log("useEffect page", getSearchString());
      setSearch(getSearchString());
      fetchData(page, perPage, sort, expression);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, [page, perPage, sort, expression]);

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
    setItems(res1);
  };
  const fetchDataDefault = async () => {
    fetchData(page, perPage, sort, expression);
  };
  const fetchData = async (page, per_page, sort, expression) => {
    // if (!page || page == "undefined") {
    //   setPage(1);
    // }
    console.log({ page });
    setLoading(true);
    axios
      .post(`/services?page=${page}&itemsPerPage=${per_page}`, {
        sort: sort,
        expression: expression,
      })
      .then((data) => {
        console.log("services data", {
          data,
          page,
          "data.page": data.page,
        });
        setLoading(false);
        if (page != data.page) setPage(data.page);
        if (data?.items) {
          setServiceArr(data.items);
        } else {
          return setItems([]);
        }
        // setItems(data.items);
        setIsLoaded(true);
        setTotalRows(data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoaded(true);
        setLoading(false);
        // setSuccess({
        //   error: true,
        //   success: false,
        //   msg: `Error: ${err} Please try again later! `,
        // });
      });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };
  const getSearchString = () => {
    return localStorage.getItem("service_search");
  };
  const setSearchString = (val) => {
    localStorage.setItem("service_search", val);
  };
  const removeSearchString = () => {
    localStorage.removeItem("service_search");
  };
  const handleInputExpression = async (e) => {
    var val = e.target.value.toLowerCase();
    console.log("serched string", val);
    // let inputStr = getSearchString().concat(val);
    // console.log(inputStr);
    // removeSearchString();
    setSearchString(val);
    // setSearch(val);
    if (val == "") setExpression("");
    else
      setExpression(`name.Contains("${val}") || endpoint.Contains("${val}")`);
    // fetchData(page, perPage, sort, val);
  };
  const handleSort = async (column, sortDirection) => {
    console.log({ column: column.database_name, sortDirection });
    try {
      let sort = column.database_name + " " + sortDirection;
      console.log({ sort });
      setSort(column.database_name + " " + sortDirection);
      // console.log({ page, perPage, sort, expression });
      // fetchData(page, perPage, sort, expression);
    } catch (err) {
      console.log(err);
      setSuccess({
        error: true,
        success: false,
        msg: `Error: ${err} Please try again later! `,
      });
    }
  };
  const debouncedChangeHandler = useMemo(
    () =>
      debounce((e) => {
        console.log(e.target);

        handleInputExpression(e);
        // setSearch(e.target.value.toLowerCase());
      }, 300),
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
                <Col lg={4} md={4}>
                  <InputGroup>
                    <Input
                      value={getSearchString()}
                      //ref={inputEl}
                      type="text"
                      name="search-service"
                      placeholder="Search any field..."
                      onChange={debouncedChangeHandler}
                    />
                    <Button
                      onClick={() => {
                        localStorage.removeItem("service_search");
                        setExpression("");
                        setPage(1);
                      }}
                    >
                      Clear
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
              <Card>
                <CardBody>
                  <DataTable
                    title="LIST OF SERVICES"
                    columns={columns}
                    data={items}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationRowsPerPageOptions={[10, 25, 50]}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerRowsChange}
                    sortServer
                    onSort={handleSort}
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
