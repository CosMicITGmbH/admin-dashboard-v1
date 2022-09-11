import React, { useState, useEffect } from "react";

import axios from "axios";
import { Grid, _ } from "gridjs-react";
import {
  Container,
  Button,
  InputGroup,
  Input,
  Row,
  Col,
  Alert,
} from "reactstrap";
import DataTable from "react-data-table-component";
import RegisterUserModal from "./RegisterUserModal";
import Loader from "../../../Components/Common/Loader";
import ConfirmationModal from "../../../Components/Reusable/ConfirmationModal";

const AllUsers = (props) => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      sortable: true,
      database_name: "id",
    },
    {
      name: <span className="font-weight-bold fs-13">First Name</span>,
      selector: (row) => row.firstName,
      database_name: "firstName",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Last Name</span>,
      selector: (row) => row.lastName,
      database_name: "lastName",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Email</span>,
      selector: (row) => row.email,
      database_name: "email",
      sortable: true,
      wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Role</span>,
      selector: (row) => row.role,
      database_name: "role",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Open</span>,
      cell: (row) => <a href={"/profile?profileID=" + row.id}>Profile</a>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Delete</span>,
      cell: (row, column) => (
        <Button
          color="danger"
          onClick={() => {
            setUsertoDelete(row.id);
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
  document.title = "All Users";
  useEffect(() => {
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;

    if (userRole !== "user") {
      //getAllUsers(1, 10);
      fetchData(page, perPage, sort, expression);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, [page, perPage, sort, expression]);

  const fetchDataDefault = async () => {
    fetchData(page, perPage, sort, expression);
  };
  const fetchData = async (page, per_page, sort, expression) => {
    axios
      .post(`/users?page=${page}&itemsPerPage=${per_page}`, {
        sort: sort,
        expression: expression,
      })
      .then((data) => {
        setIsLoaded(true);
        if (page != data.page) setPage(data.page);
        setItems(data.items);
        setTotalRows(data.totalItems);
        setLoading(false);
      })

      .catch((err) => {
        console.log(err);
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
      setExpression(
        `firstname.Contains("${val}") || lastname.Contains("${val}") || email.Contains("${val}")`
      );
    // fetchData(page, perPage, sort, val);
  };
  const handleSort = async (column, sortDirection) => {
    setSort(column.database_name + " " + sortDirection);
  };

  const getUserResponse = (response) => {
    setConfirmModal(false);
    if (response) {
      deleteUserById(userToDelete);
    }
  };
  const deleteUserById = (id) => {
    axios
      .delete(`/users/${id}`)
      .then((data) => {
        fetchDataDefault();
        setSuccess({
          success: true,
          error: false,
          msg: "User deleted successfully.",
        });
      })
      .catch((err) => {
        setSuccess({
          success: false,
          error: true,
          msg: err,
        });
        setLoading(false);
      });
  };

  return (
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
            <Input
              type="text"
              placeholder="search user..."
              value={search}
              onChange={handleInputExpression}
            />
            <DataTable
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
            <RegisterUserModal
              modalState={modal_RegistrationModal}
              closeRegModal={() => {
                setmodal_RegistrationModal(!modal_RegistrationModal);
              }}
            />
            <ConfirmationModal
              title={`Do you wish to delete this user?`}
              getUserResponse={getUserResponse}
              modalState={confirmModal}
            />
          </>
        )}
      </Container>
    </div>
  );
};

export default AllUsers;
