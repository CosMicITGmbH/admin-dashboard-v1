import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Button,
  CardBody,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

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
          setGroupName("");
          props.closeCreategrpModal();
        }}
        unmountOnClose={true}
      >
        <ModalHeader style={{ marginLeft: "auto" }}>
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
              <Col md={6}>
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
                      .catch((err) => {});
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          </CardBody>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default CreateGroupModal;
