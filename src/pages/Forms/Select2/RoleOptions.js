import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";

import Select from "react-select";
import axios from "axios";
const RoleOptions = (props) => {
  const [sortBy, setsortBy] = useState(null);
  const [role, setRole] = useState([]);

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
                props.getRole(value);
              }}
              options={role}
              id="choices-single-default"
              className="js-example-basic-single mb-0"
              name="state"
            />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default RoleOptions;
