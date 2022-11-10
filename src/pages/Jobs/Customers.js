import React, { useState, useEffect, useRef } from "react";

import axios from "axios";
import {
  Container,
  Button,
  InputGroup,
  Input,
  Row,
  Col,
  Alert,
} from "reactstrap";
import DataTable from "react-data-table-component";
import ReportConfig from "./ReportConfig";
import Loader from "../../Components/Common/Loader";
import { APIClient } from "../../helpers/api_helper";
//import { reportingAxios } from "../../Axios/axiosConfig";
import customAxios from "../../Axios/axiosConfig";
import * as url from "../../helpers/url_helper";
import Moment from "react-moment";
import { PieCharFunc } from "./PieChart";
const api = new APIClient();
const Customers = (props) => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => row.date,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.date}</Moment>}</span>
      ),
      sortable: true,
      database_name: "insertedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">Customer</span>,
      selector: (row) => row.customer,
      cell: (row) => (
        <a href={`/customer-product?cid=${row.id}&cname=${row.customer}`}>
          {row.customer}
        </a>
      ),
      database_name: "name",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Total Sheets</span>,
      selector: (row) => row.totalSheets,
      //   database_name: "lastName",
      //   sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Good Sheets</span>,
      selector: (row) => row.goodSheets,
      //   database_name: "email",
      //   sortable: true,
      //   wrap: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Bad Sheets</span>,
      selector: (row) => row.badSheets,
      //   database_name: "role",
      //   sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Ejected sheets</span>,
      selector: (row) => row.ejectedSheets,
      // cell: (row) => <a href={"/profile?profileID=" + row.id}>Ejected</a>,
      // ignoreRowClick: true,
      // allowOverflow: true,
      button: true,
    },
    {
      name: <span className="font-weight-bold fs-13">View</span>,
      cell: (row, column) => (
        <Button
          color="danger"
          onClick={() => {
            props.history.push(
              `/customer-product?cid=${row.id}&cname=${row.customer}`
            );
          }}
        >
          Details
        </Button>
      ),
      //  cell: (row) => <a href={`/customer-product?cid=${row.id}`}>Details</a>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  const [isLoaded, setIsLoaded] = useState(false);
  const [successMsg, setSuccess] = useState({
    success: false,
    error: false,
    msg: "",
  });
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(Number(1));
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("id ASC");
  const [search, setSearch] = useState("");
  const [expression, setExpression] = useState("");
  const [chartData, setChartData] = useState([]);
  // const [url, setUrl] = useState(null || sessionStorage.getItem("endPoint"));
  // const inputTxt = useRef(null);
  document.title = "Customers";
  //window.location.reload();
  useEffect(() => {
    // window.location.reload();
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;

    if (userRole !== "user") {
      let endpoint = JSON.parse(
        sessionStorage.getItem("selectedMachine")
      )?.endPoint;

      console.log("endpoint", endpoint);
      //setUrl(endpoint);
      console.log({
        page,
        perPage,
        sort,
        expression,
        endpoint,
      });
      fetchData(page, perPage, sort, expression, endpoint);
      // inputTxt.current.focus();
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, [page, perPage, sort, expression]);

  async function makeDataItems(dataSet, endpoint) {
    //console.log("dataSet", dataSet);
    let baseURL = customAxios(endpoint);
    let customerObj = await Promise.all(
      dataSet.map(async (data) => {
        const res = await baseURL.get(`/jobs/customers/${data.id}/performance`);
        //  const res = await resp.json();
        console.log("/jobs/customers data> ", res);
        let finalres = {
          id: data.id,
          date: data.insertedAt,
          customer: data.name,
          totalSheets: res.data.totalResults,
          goodSheets: `${(
            (res.data.goodResults / res.data.totalResults) *
            100
          ).toFixed(2)}% (${res.data.goodResults})`,
          badSheets: `${(
            (res.data.badResults / res.data.totalResults) *
            100
          ).toFixed(2)}% (${res.data.badResults})`,
          ejectedSheets: res.data.ejectedTotalResults,
        };
        //console.log("finalres", finalres);
        return finalres;
      })
    );
    setItems(customerObj);
    //  window.location.reload();
  }
  const fetchDataDefault = async () => {
    fetchData(page, perPage, sort, expression);
  };
  const fetchData = async (page, per_page, sort, expression, endpoint) => {
    let baseURL = customAxios(endpoint);
    setLoading(true);
    console.log("**** aparams ", {
      page,
      per_page,
      sort,
      expression,
      endpoint,
    });
    baseURL
      .post(
        `${
          JSON.parse(sessionStorage.getItem("selectedMachine")).endPoint
        }/jobs/customers?page=${page}&itemsPerPage=${per_page}`,
        {
          sort: sort,
          expression: expression,
        }
      )
      .then((data) => {
        console.log("1st data", data.data.items, page);
        setIsLoaded(true);
        if (page != data.page) setPage(data.page);
        // setItems(data.items);
        makeDataItems(data.data.items, endpoint);
        setTotalRows(data.data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // props.history.push("/login");
        setIsLoaded(true);
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleInputExpression = async (e) => {
    var val = e.target.value;
    //console.log("aval", val);
    setSearch(val);
    if (val == "") setExpression("");
    else setExpression(`name.ToLower().Contains("${val}")`);
    // fetchData(page, perPage, sort, val);
  };
  const handleSort = async (column, sortDirection) => {
    setSort(column.database_name + " " + sortDirection);
  };

  return (
    <div className="page-content">
      <Container fluid>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Row>
              <Col lg="12">
                {successMsg.error === true ? (
                  <Alert color="danger">{successMsg.msg}</Alert>
                ) : successMsg.success === true ? (
                  <Alert color="success">{successMsg.msg}</Alert>
                ) : null}
              </Col>
            </Row>
            <h4>{`Customers`}</h4>
            <div
              style={{
                width: "50%",
                height: "50%",
                margin: "10px auto",
                textAlign: "center",
              }}
            >
              <PieCharFunc
                configuration={{
                  labels: ["Good", "Bad", "Ejected"],
                  title: "Performance for customer",
                  data: [10, 50, 0],
                  color: ["#7acc29", "#db184f", "#0bcbe0"],
                }}
              />
            </div>
            <Input
              autoFocus
              type="text"
              placeholder="search by name..."
              value={search}
              onChange={handleInputExpression}
            />
            <DataTable
              columns={columns}
              data={items}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationRowsPerPageOptions={[10, 25, 50]}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              sortServer
              onSort={handleSort}
              highlightOnHover
            />
          </>
        )}
      </Container>
    </div>
  );
};

export default Customers;
