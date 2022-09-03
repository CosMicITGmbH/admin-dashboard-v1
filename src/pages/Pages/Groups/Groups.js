import React, { useState, useEffect, useMemo } from "react";
import Loader from "../../../Components/Common/Loader";
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
  Alert,
} from "reactstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
const Groups = (props) => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <span>
          {
            <a href={`/group/?groupid=${row.id}&groupname=${row.name}`}>
              {row.id}
            </a>
          }
        </span>
      ),
      wrap: true,
      database_name: "id",
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <span>
          {
            <a href={`/group/?groupid=${row.groupId}&groupname=${row.name}`}>
              {row.name}
            </a>
          }
        </span>
      ),
      database_name: "name",
    },
    {
      name: <span className="font-weight-bold fs-13">Members</span>,
      selector: (row) => row.member,
      // sortable: true,
      database_name: "users",
    },
    {
      name: <span className="font-weight-bold fs-13">Machine</span>,
      selector: (row) => row.machines,
      // sortable: true,
      cell: (row) => <span>{row.machines.join(", ")}</span>,
      database_name: "machines",
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
  const [sort, setSort] = useState("id ASC");
  const [search, setSearch] = useState("");
  const [expression, setExpression] = useState("");
  const [userToDelete, setUsertoDelete] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [modal_RegistrationModal, setmodal_RegistrationModal] = useState(false);
  useEffect(() => {
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;
    console.log("user role", userRole);
    if (userRole !== "user") {
      //getAllUsers(1, 10);
      console.log("useEffect page", page);
      fetchData(1, perPage, sort, expression);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, [page, perPage, sort, expression]);

  const setgridData = (data) => {
    let a = [];
    let gridData = data.map((item) => {
      return {
        id: item.groupId,
        name: item.name,
        member: item?.users.length || 0,
        machines: item?.machines.map((machine) => {
          return a.push(`${machine.name}`);
        }),
      };
    });
    gridData[0].machines = a;
    // console.log("final res", gridData, a);
    setItems(gridData);
  };

  const fetchDataDefault = async () => {
    fetchData(page, perPage, sort, expression);
  };
  const fetchData = async (page, per_page, sort, expression) => {
    if (!page || page == "undefined") {
      setPage(1);
    }
    console.log({ page });
    setLoading(true);
    axios
      .post(`/groups?page=${page}&itemsPerPage=${per_page}`, {
        sort: sort,
        expression: expression,
      })
      .then((data) => {
        console.log("user data", data);
        setLoading(false);
        if (page != data.page) setPage(data.page);
        if (data?.items) {
          setgridData(data.items);
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

  const handleInputExpression = async (e) => {
    var val = e.target.value.toLowerCase();
    setSearch(val);
    if (val == "") setExpression("");
    else setExpression(`groupId.Contains("${val}") || name.Contains("${val}")`);
    // fetchData(page, perPage, sort, val);
  };
  const handleSort = async (column, sortDirection) => {
    console.log({ column: column.database_name, sortDirection });
    try {
      let sort = (column.database_name + " " + sortDirection).replace(
        "groupId",
        "id"
      );
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Row>
                <Col lg="12">
                  {successMsg.error === true ? (
                    <Alert color="danger">{successMsg.msg}</Alert>
                  ) : successMsg.success === true ? (
                    <Alert color="success">{successMsg.msg}</Alert>
                  ) : null}
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="Search any field..."
                      value={search}
                      onChange={handleInputExpression}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Card>
                <CardBody>
                  <DataTable
                    title="LIST OF GROUPS"
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
                </CardBody>
              </Card>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Groups;
