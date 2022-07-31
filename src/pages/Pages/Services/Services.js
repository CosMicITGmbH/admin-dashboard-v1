import React, { useEffect, useState } from "react";
import { Container, Button, Card, CardBody } from "reactstrap";
import { Grid, _ } from "gridjs-react";
import Loader from "../../../Components/Common/Loader";
import Moment from "react-moment";
const Services = () => {
  const [data, setData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  document.title = "All Services | Velzon - React Admin & Dashboard Template";
  useEffect(() => {
    let myData = [
      {
        key: "0dd27ca8-b303-4768-9185-f04bc7bde86a",
        name: "Test Machine #1",
        machine: {
          id: 1,
          connectedServices: [
            {
              key: "14b667f8-060b-4305-9fb9-d202066a0a1a",
              name: "api.reporting",
              endpoint: "https://report.csharpify.com/reporting/v1",
              insertedAt: "2022-07-28T09:47:00.9948781",
              updatedAt: "2022-07-28T09:47:00.9948781",
            },
          ],
        },
        endpoint: "1.1.1.1",
        insertedAt: "2022-07-28T08:35:45.1665621",
        updatedAt: "2022-07-28T08:35:45.1665621",
      },
      {
        key: "14b667f8-060b-4305-9fb9-d202066a0a1a",
        name: "api.reporting",
        endpoint: "https://report.csharpify.com/reporting/v1",
        insertedAt: "2022-07-28T09:47:00.9948781",
        updatedAt: "2022-07-28T09:47:00.9948781",
      },
      {
        key: "2d13be51-bbfc-4ded-98cf-e27b4d44a9d5",
        name: "Test Service #1",
        endpoint: "https://auth.csharpify.com/",
        insertedAt: "2022-07-28T08:36:12.0524819",
        updatedAt: "2022-07-28T08:36:12.0524819",
      },
      {
        key: "31820877-5240-427c-bce2-96ddc85b8047",
        name: "GMD",
        machine: {
          id: 5,
          connectedServices: [
            {
              key: "14b667f8-060b-4305-9fb9-d202066a0a1a",
              name: "api.reporting",
              endpoint: "https://report.csharpify.com/reporting/v1",
              insertedAt: "2022-07-28T09:47:00.9948781",
              updatedAt: "2022-07-28T09:47:00.9948781",
            },
          ],
        },
        endpoint: "debug",
        insertedAt: "2022-07-28T09:50:26.6896618",
        updatedAt: "2022-07-28T09:50:26.6896618",
      },
      {
        key: "90d6f37b-e31e-494f-9130-df19244e75c9",
        name: "Test Machine #3",
        machine: {
          id: 3,
        },
        endpoint: "1.1.1.3",
        insertedAt: "2022-07-28T08:35:54.2450391",
        updatedAt: "2022-07-28T08:35:54.2450391",
      },
      {
        key: "d5dc0ce7-2659-4c0d-9524-36c4bc2008e2",
        name: "api.reporting",
        endpoint: "https://report.csharpify.com/reporting/v1",
        insertedAt: "2022-07-28T09:32:07.4418105",
        updatedAt: "2022-07-28T09:32:07.4418105",
      },
      {
        key: "de689963-7d41-4dca-9a9c-19bfbb46bdde",
        name: "Test Machine #2",
        machine: {
          id: 2,
        },
        endpoint: "1.1.1.2",
        insertedAt: "2022-07-28T08:35:50.2545825",
        updatedAt: "2022-07-28T08:35:50.2545825",
      },
      {
        key: "f5e47b05-93cc-491d-832a-ab13c51defc7",
        name: "PrintInspect",
        machine: {
          id: 4,
          connectedServices: [
            {
              key: "d5dc0ce7-2659-4c0d-9524-36c4bc2008e2",
              name: "api.reporting",
              endpoint: "https://report.csharpify.com/reporting/v1",
              insertedAt: "2022-07-28T09:32:07.4418105",
              updatedAt: "2022-07-28T09:32:07.4418105",
            },
          ],
        },
        endpoint: "192.168.1.1",
        insertedAt: "2022-07-28T09:34:32.1853703",
        updatedAt: "2022-07-28T09:34:32.1853703",
      },
    ];
    setData(myData);
    setServiceArr(myData);
  }, []);
  const setServiceArr = (services) => {
    console.log("loading services");
    let newArr = [];
    let res1 = services.map((item) => {
      let n1 = [];
      n1.push(
        item.key,
        item.name,
        item.endpoint,
        item.insertedAt,
        item.updatedAt,
        item?.machine?.connectedServices?.[0].key || "NA",
        item?.machine?.connectedServices?.[0].name || "NA"
      );
      newArr.push(n1);
      return newArr;
    });
    console.log("newArr services", newArr);
    setGridData(newArr);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <header className="card-title mb-4">
            <h4>List of services</h4>
          </header>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Card>
                <CardBody>
                  <Grid
                    style={{
                      table: {
                        border: "3px solid #eee",
                      },
                      th: {
                        "background-color": "rgba(0, 0, 0, 0.1)",
                        color: "#000",
                        "border-bottom": "3px solid #ccc",
                        "text-align": "center",
                      },
                      td: {
                        // "text-align": "center",
                      },
                    }}
                    data={gridData}
                    columns={[
                      {
                        name: "ID",
                        formatter: (cell) =>
                          _(<span className="fw-semibold">{cell}</span>),
                      },
                      "Name",
                      "End-Point",
                      {
                        name: "Created On",
                        formatter: (cell) =>
                          _(<Moment format="YYYY/MM/DD">{cell}</Moment>),
                      },
                      {
                        name: "Updated On",
                        formatter: (cell) =>
                          _(<Moment format="YYYY/MM/DD">{cell}</Moment>),
                      },
                      {
                        name: "Machine",
                        columns: [
                          {
                            name: "ID",
                          },
                          {
                            name: "Name",
                          },
                        ],
                      },
                    ]}
                    search={true}
                    sort={true}
                    pagination={{ enabled: true, limit: 5 }}
                  />
                </CardBody>
                {/*ALL CODE ABOVE THIS: update profile and change pwd button below*/}
                <div className="text-center my-4 mx-2">
                  <Button
                    type="submit"
                    color="success"
                    // disabled={userData.currentRole === "user"}
                  >
                    Add Service
                  </Button>

                  <Button
                    type="button"
                    color="success"
                    // disabled={userData.currentRole === "user"}
                    onClick={() => {
                      //  changePassword();
                      //    setmodal_grid(true);
                    }}
                    style={{ marginLeft: "3px" }}
                  >
                    Add Machine
                  </Button>
                </div>
              </Card>

              {/* Groups table: Add,update,delete */}
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Services;
