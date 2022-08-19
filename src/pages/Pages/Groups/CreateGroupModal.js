import React, { useState, useEffect } from "react";
import {
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  CardBody,
} from "reactstrap";
import axios from "axios";
//import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateGroupModal = (props) => {
  const [groupName, setGroupName] = useState("");

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
          <Row className="justify-content-center">
            <CardBody>
              <h5 className="text-primary text-center">{props.title}</h5>
              <div className="text-center my-4 mx-2">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                />
                <Button
                  type="button"
                  color="info"
                  onClick={() => {
                    let data = {
                      users: [],
                      groupId: 2,
                      name: groupName,
                      machines: [],
                    };
                    props.groupResponse(data);
                    // axios
                    //   .put("/groups")
                    //   .then((data) => {
                    //     props.groupResponse(data);
                    // setGroupName("");
                    //   })
                    //   .catch((err) => {
                    //     console.log("Error while creating new group", err);
                    //   });
                  }}
                >
                  Create
                </Button>
              </div>
            </CardBody>
          </Row>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default CreateGroupModal;
