import React, { useEffect, useState, useMemo, useRef } from "react";
import { Container, Button, Card, CardBody, Input } from "reactstrap";
import DataTable from "react-data-table-component";
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

    if (userRole !== "user") {
      fetchData(page, perPage, sort, expression);
    } else {
      props.history.push("/dashboard");
    }
  }, [page, perPage, sort, expression]);

  const fetchDataDefault = async () => {
    fetchData(page, perPage, sort, expression);
  };
  const fetchData = async (page, per_page, sort, expression) => {
    axios
      .post(`/services?page=${page}&itemsPerPage=${per_page}`, {
        sort: sort,
        expression: expression,
      })
      .then((data) => {
        setIsLoaded(true);
        setLoading(false);
        if (page != data.page) setPage(data.page);
        if (data.items.length == 0) {
          return setItems([]);
        }
        let res1 = data.items.map((item) => {
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
        setItems(res1);
        setTotalRows(data.totalItems);
      })

      .catch((err) => {
        console.log(err);
        setItems([]);
        setIsLoaded(true);
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleInputExpression = async (e) => {
    var val = e.target.value;
    setSearch(val);
    if (val == "") setExpression("");
    else
      setExpression(`name.Contains("${val}") || endpoint.Contains("${val}")`);
  };
  const handleSort = async (column, sortDirection) => {
    setSort(column.database_name + " " + sortDirection);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Card>
                <CardBody>
                  <Input
                    type="text"
                    placeholder="search services ..."
                    value={search}
                    onChange={handleInputExpression}
                  />
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
