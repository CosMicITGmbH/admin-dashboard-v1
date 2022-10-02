import React, { useState, useEffect } from "react";

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
import { reportingAxios } from "../../Axios/axiosConfig";
import * as url from "../../helpers/url_helper";
import Moment from "react-moment";
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
        <a href={`/customer-product?cid=${row.id}`}>{row.customer}</a>
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
            props.history.push(`/customer-product?cid=${row.id}`);
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("id ASC");
  const [search, setSearch] = useState("");
  const [expression, setExpression] = useState("");
  const [userToDelete, setUsertoDelete] = useState(null);
  const [url, setUrl] = useState(null);
  document.title = "Customers";
  useEffect(() => {
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;

    if (userRole !== "user") {
      let endpoint = sessionStorage.getItem("endPoint");
      // console.log("endpoint", endpoint);
      setUrl(endpoint);
      fetchData(page, perPage, sort, expression);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, [page, perPage, sort, expression]);

  async function makeDataItems(dataSet) {
    let customerObj = await Promise.all(
      dataSet.map(async (data) => {
        const res = await api.get(
          `${url}/jobs/customers/${data.id}/performance`
        );
        // const res = await resp.json();
        //console.log("res", res);
        let finalres = {
          id: data.id,
          date: data.insertedAt,
          customer: data.name,
          totalSheets: res.totalResults,
          goodSheets: `${((res.goodResults / res.totalResults) * 100).toFixed(
            2
          )}% (${res.goodResults})`,
          badSheets: `${((res.badResults / res.totalResults) * 100).toFixed(
            2
          )}% (${res.badResults})`,
          ejectedSheets: res.ejectedTotalResults,
        };
        //console.log("finalres", finalres);
        return finalres;
      })
    );
    setItems(customerObj);
  }
  const fetchDataDefault = async () => {
    fetchData(page, perPage, sort, expression);
  };
  const fetchData = async (page, per_page, sort, expression) => {
    setLoading(true);

    api
      .create(
        `${ReportConfig.reportJobsApi}/customers?page=${page}&itemsPerPage=${per_page}`,
        {
          sort: sort,
          expression: expression,
        }
      )
      .then((data) => {
        //   console.log("1st data", data);
        setIsLoaded(true);
        if (page != data.page) setPage(data.page);
        // setItems(data.items);
        makeDataItems(data.items);
        setTotalRows(data.totalItems);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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
            <Input
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
            />
          </>
        )}
      </Container>
    </div>
  );
};

export default Customers;
