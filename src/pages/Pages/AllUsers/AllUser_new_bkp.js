import React, { useState, useEffect, useMemo } from "react";
import { isEmpty } from "lodash";
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
// import { Cell } from "gridjs";
import RegisterUserModal from "./RegisterUserModal";
import Loader from "../../../Components/Common/Loader";
import Groups from "../Groups/Groups";
import { debounce } from "lodash";
import Select from "../../../Components/Reusable/SelectPage";
import ConfirmationModal from "../../../Components/Reusable/ConfirmationModal";
//let pages = [5, 10, 20, 30, 40, 50];

const AllUsers = (props) => {
  const [userData, setUserData] = useState([]);
  const [userToDelete, setUsertoDelete] = useState(null);
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
    // found: false
  });
  // const [page, setPage] = useState(pages[0]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [confirmModal, setConfirmModal] = useState(false);
  const [modal_RegistrationModal, setmodal_RegistrationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  function getRole(role) {
    let newRole;
    switch (role) {
      case "1":
        newRole = "admin";
        break;
      case "2":
        newRole = "manager";
        break;
      case "3":
        newRole = "user";
        break;
      default:
        newRole = role;
        break;
    }
    return newRole;
  }
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">ID</span>,
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Email</span>,
      selector: (row) => row.Email,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Role</span>,
      selector: (row) => row.Role,
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
    // {
    //   name: <span className="font-weight-bold fs-13">Groups</span>,
    //   columns: [
    //     {
    //       name: "ID",
    //     },
    //     {
    //       name: "Name",
    //     },
    //   ],
    // },
  ];
  function getAllUsers(pageNo, per_Page) {
    setLoading(true);

    axios
      .post(`/users?page=${pageNo}&itemsPerPage=${per_Page}`, {})
      .then((data) => {
        //  let newArr = [];
        let res1 = data.items.map((item) => {
          return {
            id: item.id,
            Name: item.firstName + " " + item.lastName,
            Email: item.email,
            Role: getRole(item.role),
          };
        });
        // getRole(item.role)

        setTotalRows(data.totalItems);
        setUserData(res1);
        setLoading(false);
      })

      .catch((err) => {
        if (err.includes("401")) {
          props.history.push("/login");
        }
        setLoading(false);
      });
  }
  useEffect(() => {
    let pageLimit = 1;
    // let itemsPerPage = 5;
    //check role n
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;

    if (userRole !== "user") {
      getAllUsers(1, 10);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, []);

  const deleteUserById = (id) => {
    axios
      .delete(`/users/${id}`)
      .then((data) => {
        getAllUsers(1, perPage); //already handles loading
        setSuccess({
          success: true,
          error: false,
          msg: "User deleted successfully.",
        });
      })
      .catch((err) => {
        // alert(err);
        setSuccess({
          success: false,
          error: true,
          msg: err,
        });
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    getAllUsers(page, perPage);
    setTotalRows(totalRows - perPage);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    //let url = `/users?page=${page}&itemsPerPage=${newPerPage}`;

    try {
      setLoading(true);
      const response = await axios.post(
        `/users?page=${page}&itemsPerPage=${newPerPage}`,
        {}
      );

      let res1 = response.items.map((item) => {
        return {
          id: item.id,
          Name: item.firstName + " " + item.lastName,
          Email: item.email,
          Role: getRole(item.role),
        };
      });
      setUserData(res1);
      setPerPage(newPerPage);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const changeHandler = (event) => {
    setFilterText(event.target.value);
  };
  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300),
    []
  );

  const getUserResponse = (response) => {
    setConfirmModal(false);
    if (response) {
      deleteUserById(userToDelete);
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
                      // value={filterText}
                      type="text"
                      placeholder="Search any field..."
                      onChange={debouncedChangeHandler}
                    />
                    <Button
                      onClick={() => {
                        setFilterText("");
                        // getAllUsers(1)
                      }}
                    >
                      Reset
                    </Button>
                  </InputGroup>
                </Col>
                <Col>
                  <Button
                    type="button"
                    color="info"
                    onClick={() => {
                      setmodal_RegistrationModal(true);
                    }}
                    style={{ marginLeft: "3px" }}
                  >
                    Register a user
                  </Button>{" "}
                </Col>
              </Row>

              <DataTable
                title="List of Users"
                columns={columns}
                data={userData}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                paginationRowsPerPageOptions={[10, 15, 25, 50]}
                fixedHeader
              />
            </>
          )}
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
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AllUsers;
