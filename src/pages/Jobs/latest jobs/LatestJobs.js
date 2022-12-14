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
//import ReportConfig from "./ReportConfig";
import Loader from "../../../Components/Common/Loader";
import { APIClient } from "../../../helpers/api_helper";
//import { reportingAxios } from "../../Axios/axiosConfig";
import customAxios from "../../../Axios/axiosConfig";
import * as url from "../../../helpers/url_helper";
import Moment from "react-moment";
const api = new APIClient();
const LatestJobs = (props) => {
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
        <a
          href={`/customer-product?cid=${row.customer.split(" #")[1]}&cname=${
            row.customer.split(" #")[0]
          }`}
        >
          {row.customer}
        </a>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Product</span>,
      selector: (row) => row.product,
      cell: (row) => (
        <a
          href={`/product-order?pid=${row.product.split(" #")[1]}&pname=${
            row.product.split(" #")[0]
          }`}
        >
          {row.product}
        </a>
      ),
      // database_name: "name",
      // sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Order</span>,
      selector: (row) => row.order,
      cell: (row) => (
        <a
          href={`/customer-product?cid=${row.order.split(" #")[1]}&cname=${
            row.order.split(" #")[0]
          }`}
        >
          {row.order}
        </a>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Total Sheets</span>,
      selector: (row) => row.totalSheets,
    },
    {
      name: <span className="font-weight-bold fs-13">Good Sheets</span>,
      selector: (row) => row.goodSheets,
    },
    {
      name: <span className="font-weight-bold fs-13">Bad Sheets</span>,
      selector: (row) => row.badSheets,
    },
    {
      name: <span className="font-weight-bold fs-13">Ejected sheets</span>,
      selector: (row) => row.ejectedSheets,
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
  const [userToDelete, setUsertoDelete] = useState(null);
  // const [url, setUrl] = useState(null || sessionStorage.getItem("endPoint"));
  // const inputTxt = useRef(null);
  document.title = "Latest Jobs";
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
        const res = await baseURL.get(`/jobs/orders/${data.id}/performance`);
        let { customer, product } = data;
        let finalres = {
          id: data.id,
          date: data.insertedAt,
          customer: `${customer.name} #${customer.id}`,
          product: `${product.name} #${product.id}`,
          order: `${data.name} #${data.id}`,
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
        }/jobs/search/orders/latest?page=${page}&itemsPerPage=${per_page}`,
        {
          sort: sort,
          expression: expression,
        }
      )
      .then((res) => {
        const { data } = res;

        setIsLoaded(true);
        if (page != data.page) setPage(data.page);
        console.log("1st data", data.items, page, data.page);
        makeDataItems(data.items, endpoint);
        setTotalRows(data.totalItems);
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
            />
          </>
        )}
      </Container>
    </div>
  );
};

export default LatestJobs;
