import React from "react";
import {
  Button,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

//import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmationModal = (props) => {
  return (
    <React.Fragment>
      {/* modal to change Register */}
      <Modal
        isOpen={props.modalState}
        toggle={() => {
          //props.closeConfirmModal();
          props.confirmResp(false);
        }}
        unmountOnClose={true}
      >
        <ModalHeader style={{ marginLeft: "auto" }}>
          {/* <h6>Close</h6> */}
          <div>
            <Button
              type="button"
              onClick={() => {
                // setmodal_Register(false);
                // props.closeConfirmModal();
                props.confirmResp(false);
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
                <Button
                  type="button"
                  color="info"
                  onClick={() => {
                    props.confirmResp(true);
                  }}
                >
                  YES
                </Button>

                <Button
                  type="button"
                  color="success"
                  onClick={() => {
                    props.confirmResp(false);
                  }}
                  style={{ marginLeft: "3px" }}
                >
                  NO
                </Button>
              </div>
            </CardBody>
          </Row>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default ConfirmationModal;
