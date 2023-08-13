import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button, Col, Row } from "reactstrap";

const RoleOptions = ({ getRole }) => {
  const [sortBy, setSortBy] = useState(null);
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const response = await axios.post("/roles/applicable", {});
      console.log("roles response:", response);
      const options = response.items.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setRoles([{ options }]);
    } catch (error) {
      console.log("Error while fetching roles:", error);
      // Handle error, e.g., show a message to the user
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="role-options-container">
      <Row>
        <Col lg={12}>
          {/* <h5 className="card-title mb-3">Choose a role to change</h5> */}
          <Select
            value={sortBy}
            onChange={(value) => {
              console.log("Role value", value);
              setSortBy(value);
            }}
            options={roles}
            id="choices-single-default"
            className="role-select"
            name="state"
          />
        </Col>
        <div className="mt-4 text-center">
          <Button
            color="success"
            className="w-50"
            type="submit"
            onClick={(ev) => {
              ev.preventDefault();
              getRole(sortBy);
            }}
          >
            Save
          </Button>
        </div>
      </Row>
    </div>
  );
};

export default RoleOptions;
