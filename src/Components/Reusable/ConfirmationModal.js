import React from "react";
import {
  Button,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const ConfirmationModal = (props) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {/* modal to change Register */}
      <Modal
        isOpen={props.modalState}
        toggle={() => {
          props.confirmResp(false);
        }}
        unmountOnClose={true}
      >
        <ModalHeader style={{ marginLeft: "auto" }}>
          <div>
            <Button
              type="button"
              onClick={() => {
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
              <h5 className="text-primary text-center">{t(props.title)}</h5>
              <div className="text-center my-4 mx-2">
                <Button
                  type="button"
                  color="info"
                  onClick={() => {
                    props.confirmResp(true);
                  }}
                >
                  {t("YES")}
                </Button>

                <Button
                  type="button"
                  color="success"
                  onClick={() => {
                    props.confirmResp(false);
                  }}
                  style={{ marginLeft: "3px" }}
                >
                  {t("NO")}
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
