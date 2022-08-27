import React, { useState, useEffect } from "react";
import {
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  CardBody,
  Label,
  Input,
  Col,
  Alert,
} from "reactstrap";
import axios from "axios";
//import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateGroupModal = (props) => {
  const [groupName, setGroupName] = useState("");
  const [setup, setSetup] = useState({
    loading: false,
    error: false,
    success: false,
    msg: "",
  });
  return (
    <React.Fragment>
      {/* modal to change Register */}
      <Modal
        isOpen={props.modalState}
        toggle={() => {
          console.log("togle modle fired");
          setGroupName("");
          props.closeCreategrpModal();
        }}
      >
        <ModalHeader style={{ marginLeft: "auto" }}>
          {/* <h6>Close</h6> */}
          <div>
            <Button
              type="button"
              onClick={() => {
                setGroupName("");
                props.closeCreategrpModal();
              }}
              className="btn-close m-lg-auto"
              aria-label="Close"
            ></Button>
          </div>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col lg="12">
              {setup.error === true ? (
                <Alert color="danger">{setup.msg}</Alert>
              ) : setup.success === true ? (
                <Alert color="success">{setup.msg}</Alert>
              ) : null}
            </Col>
          </Row>

          <CardBody>
            <h5 className="text-primary text-center">{props.title}</h5>
            <div className="my-4 mx-2">
              <Col xxl={3} md={6}>
                {/* <Label htmlFor="placeholderInput" className="form-label">
                   Enter New group Name
                  </Label> */}
                <Input
                  type="text"
                  className="form-control"
                  id="createGroup"
                  placeholder="Enter New Group Name"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                />
              </Col>

              <div className=" my-2 mx-2">
                <Button
                  type="button"
                  color="info"
                  onClick={() => {
                    axios
                      .put("/groups", {
                        name: groupName,
                      })
                      .then((data) => {
                        props.groupResponse(data);
                        setGroupName("");
                      })
                      .catch((err) => {
                        console.log("Error while creating new group", err);
                      });
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          </CardBody>
          {/* </Row> */}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default CreateGroupModal;
