import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import axios from "axios";
import { Grid, _ } from "gridjs-react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Cell } from "gridjs";
import RegisterUserModal from "./RegisterUserModal";
import Loader from "../../../Components/Common/Loader";

const AllUsers = (props) => {
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState([
    [
      "01",
      "Jonathan",
      "jonathan@example.com",
      "Senior Implementation Architect",
    ],
    ["02", "Harold", "harold@example.com", "Forward Creative Coordinator"],
    ["03", "Shannon", "shannon@example.com", "Legacy Functionality Associate"],
    ["04", "Robert", "robert@example.com", "Product Accounts Technician"],
    ["05", "Noel", "noel@example.com", "Customer Data Director"],
    ["06", "Traci", "traci@example.com", "Corporate Identity Director"],
    ["07", "Kerry", "kerry@example.com", "Lead Applications Associate"],
    ["08", "Patsy", "patsy@example.com", "Dynamic Assurance Director"],
    ["09", "Cathy", "cathy@example.com", "Customer Data Director"],
    ["10", "Tyrone", "tyrone@example.com", "Senior Response Liaison"],
  ]);
  const [modal_profile, setmodal_profile] = useState(false);
  const [modal_RegistrationModal, setmodal_RegistrationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  function tog_profileModal() {
    setmodal_profile(!modal_profile);
  }

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

  function getAllUsers() {
    setLoading(true);
    axios
      .post("/users", {})
      .then((data) => {
        // console.log(data);
        let newArr = [];
        let res1 = data.items.map((item) => {
          let n1 = [];
          n1.push(
            item.id,
            item.firstName + " " + item.lastName,
            item.email,
            getRole(item.role)
          );
          newArr.push(n1);
          //console.log("newArr", newArr);
          return newArr;
        });

        // console.log("res1", res1);
        // console.log("newArr", newArr);
        setUserData(newArr);
        setLoading(false);
      })

      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  useEffect(() => {
    //check role n
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;
    console.log("user role", userRole);
    if (userRole !== "user") {
      getAllUsers();
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, []);

  const deleteUserById = (id) => {
    axios
      .delete(`/users/${id}`)
      .then((data) => {
        //  console.log("data delete successfully");

        getAllUsers(); //already handles loading
      })
      .catch((err) => {
        console.log("err occurred while delete data", err);
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="button"
              color="info"
              //  disabled={userData.currentRole === "user"}
              onClick={() => {
                //  changePassword();
                setmodal_RegistrationModal(true);

                console.log("open register gui");
              }}
              style={{ marginLeft: "3px" }}
            >
              Register a user
            </Button>{" "}
          </div>
          {loading ? (
            <Loader />
          ) : (
            <Grid
              data={userData}
              columns={[
                {
                  name: "ID",
                  formatter: (cell) =>
                    _(<span className="fw-semibold">{cell}</span>),
                },
                "Name",
                {
                  name: "Email",
                  formatter: (cell) =>
                    _(<a href={"mailto:" + cell}> {cell} </a>),
                },
                "Role",

                {
                  name: "Open",
                  width: "120px",
                  formatter: (cell, row) =>
                    _(
                      <a href={"/profile?profileID=" + row._cells[0].data}>
                        Profile
                      </a>
                    ),
                },
                {
                  name: "Delete",
                  width: "120px",
                  formatter: (cell, row) =>
                    _(
                      <Button
                        color="danger"
                        onClick={() => {
                          console.log("delete row", row._cells[0].data);
                          // console.log("cell", cell);
                          deleteUserById(row._cells[0].data);
                        }}
                      >
                        {" "}
                        Delete
                      </Button>
                    ),
                },
              ]}
              search={true}
              sort={true}
              pagination={{ enabled: true, limit: 5 }}
            />
          )}

          <RegisterUserModal
            modalState={modal_RegistrationModal}
            closeRegModal={() => {
              setmodal_RegistrationModal(!modal_RegistrationModal);
            }}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AllUsers;
