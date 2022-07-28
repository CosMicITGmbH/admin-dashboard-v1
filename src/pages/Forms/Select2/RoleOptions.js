import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Select from "react-select";
import axios from "axios";
const RoleOptions = (props) => {
  const [sortBy, setsortBy] = useState(null);
  const [role, setRole] = useState([]);
  //   const [selectMulti, setselectMulti] = useState(null);
  //   const [ajaxSelect, setajaxSelect] = useState(null);
  //   const [temp, settemp] = useState(null);
  //   const [selTemp, setselTemp] = useState(null);
  //   const [dissortBy, setdissortBy] = useState(null);
  //   const [disselectMulti, setdisselectMulti] = useState(null);

  //   const [disable, setdisable] = useState(false);
  //   const sortbyname = [
  //     {
  //       options: [
  //         { label: "Admin", value: "1" },
  //         { label: "Manager", value: "2" },
  //         { label: "User", value: "3" },
  //       ],
  //     },
  //   ];

  useEffect(() => {
    axios
      .post("/roles/applicable", {})
      .then((data) => {
        let options = data.items.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
        //  console.log("new options: ", options);
        setRole([
          {
            options: options,
          },
        ]);
      })
      .catch((err) => console.log("error while fetching role", err));
  }, []);

  return (
    <React.Fragment>
      <div className="page-contentsdsd">
        <Row>
          <Col lg={12}>
            <h5 className="card-title mb-3">Choose a role to change</h5>
            <Select
              value={sortBy}
              onChange={(value) => {
                setsortBy(value);
                //      console.log("value on chanhge", value);
                props.getRole(value);
              }}
              options={role}
              id="choices-single-default"
              className="js-example-basic-single mb-0"
              name="state"
            />
          </Col>
        </Row>
        {/* <Container fluid></Container> */}
      </div>
    </React.Fragment>
  );
};

export default RoleOptions;
