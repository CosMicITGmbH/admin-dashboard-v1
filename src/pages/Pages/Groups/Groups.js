import React, { useState, useEffect, useMemo } from "react";
import Loader from "../../../Components/Common/Loader";

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
  CardTitle,
} from "reactstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import ConfirmationModal from "../../../Components/Reusable/ConfirmationModal";
import CreateGroupModal from "./CreateGroupModal";

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
            <a href={`/group/?groupid=${row.id}&groupname=${row.name}`}>
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
      // cell: (row) => <span>{row.machines.join(", ")}</span>,
      database_name: "machines",
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Delete</span>,
      cell: (row, column) => (
        <Button
          color="danger"
          onClick={() => {
            console.log("grup to delete", row.id);
            setGrouptoDelete(row.id);
            setConfirmModal(true);
          }}
        >
          Delete
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  const [isLoaded, setIsLoaded] = useState(false);
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
  });
  const [groupToDelete, setGrouptoDelete] = useState(null);
  const [OpenGroupModal, setOpenGroupModal] = useState(false);
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("id asc");
  const [search, setSearch] = useState("");
  const [expression, setExpression] = useState("");
  const [userToDelete, setUsertoDelete] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [modal_RegistrationModal, setmodal_RegistrationModal] = useState(false);

  document.title = "All Groups";
  useEffect(() => {
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;
    // console.log("user role", userRole);
    if (userRole !== "user") {
      //getAllUsers(1, 10);
      console.log("useEffect page", page);
      fetchData(page, perPage, sort, expression);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, [page, perPage, sort, expression]);

  const getUserResponse = (response) => {
    console.log("group input close", response);
    setConfirmModal(false);
    if (response) {
      deleteGroupById(groupToDelete);
    }
  };

  const createGroupResponse = (response) => {
    console.log("group created", response);
    setOpenGroupModal(false);
    props.history.push(
      `/group/?groupid=${response.groupId}&groupname=${response.name}`
    );
  };

  const deleteGroupById = (id) => {
    console.log("id to be deleted", id, groupToDelete);
    setLoading(true);
    axios
      .delete(`/groups/${id}`)
      .then((data) => {
        setLoading(true);
        fetchDataDefault();
        setSuccess({
          success: true,
          error: false,
          msg: "Group deleted successfully.",
        });
      })
      .catch((err) => {
        console.log("err occurred while delete data", err);
        // alert(err);
        setSuccess({
          success: false,
          error: true,
          msg: err,
        });
        setLoading(false);
      });
  };
  const setgridData = (data) => {
    let machineNames = "";
    let gridData = data.map((item) => {
      return {
        id: item.groupId,
        name: item.name,
        member: item?.users.length || 0,
        machines:
          item.machines.length > 0
            ? item.machines
                .map((machine) => {
                  return machineNames.concat(machine.name);
                })
                .join(",")
            : "NA",
      };
    });

    console.log("grid data", gridData);
    setItems(gridData);
  };

  const fetchDataDefault = async () => {
    fetchData(page, perPage, sort, expression);
  };
  const fetchData = async (page, per_page, sort, expression) => {
    axios
      .post(`/groups?page=${page}&itemsPerPage=${per_page}`, {
        sort: sort,
        expression: expression,
      })
      .then((data) => {
        console.log("dta", data);
        setIsLoaded(true);
        setLoading(false);
        if (page != data.page) setPage(data.page);
        if (data.items.length === 0) {
          return setItems([]);
        }
        setgridData(data.items);
        //  setItems(data.totalItems);
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
    else setExpression(`name.Contains("${val}")`);
    // fetchData(page, perPage, sort, val);
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
              <Row>
                <Col lg="12">
                  {successMsg.error === true ? (
                    <Alert color="danger">{successMsg.msg}</Alert>
                  ) : successMsg.success === true ? (
                    <Alert color="success">{successMsg.msg}</Alert>
                  ) : null}
                </Col>
              </Row>

              <Card>
                <CardTitle>
                  <div className="group">
                    <div>
                      <Button
                        type="button"
                        color="success"
                        onClick={() => {
                          setOpenGroupModal(true);
                        }}
                      >
                        CREATE NEW GROUP
                      </Button>
                    </div>
                  </div>
                </CardTitle>
                <CardBody>
                  <Input
                    type="text"
                    placeholder="Search group name ..."
                    value={search}
                    onChange={handleInputExpression}
                  />
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
              <ConfirmationModal
                title={`Do you wish to delete this user?`}
                getUserResponse={getUserResponse}
                modalState={confirmModal}
              />
              <CreateGroupModal
                title="Enter new group name"
                closeCreategrpModal={() => setOpenGroupModal(!OpenGroupModal)}
                modalState={OpenGroupModal}
                groupResponse={createGroupResponse}
              />
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Groups;
