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
import { useLocation } from "react-router-dom";
const api = new APIClient();

const CustomerProduct = (props) => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row) => row.date,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.date}</Moment>}</span>
      ),
      sortable: true,
      database_name: "updatedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">Product</span>,
      selector: (row) => row.products,
      cell: (row) => (
        <a href={`/product-order?pid=${row.id}`}>{row.products}</a>
      ),
      database_name: "name",
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Total Sheets</span>,
      selector: (row) => row.totalResults,
    },
    {
      name: <span className="font-weight-bold fs-13">Good Sheets</span>,
      selector: (row) => row.goodResults,
    },
    {
      name: <span className="font-weight-bold fs-13">Bad Sheets</span>,
      selector: (row) => row.badResults,
    },
    {
      name: <span className="font-weight-bold fs-13">Ejected sheets</span>,
      selector: (row) => row.ejectedTotalResults,
      button: true,
    },
    {
      name: <span className="font-weight-bold fs-13">View</span>,
      cell: (row, column) => (
        <Button
          color="danger"
          onClick={() => {
            props.history.push(`/product-order?pid=${row.id}`);
          }}
        >
          Details
        </Button>
      ),

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
  document.title = "Customer Details";

  const searchParam = useLocation().search;
  const custid = new URLSearchParams(searchParam).get("cid");

  useEffect(() => {
    let userRole = JSON.parse(sessionStorage.getItem("authUser")).data.role;

    if (userRole !== "user") {
      //getAllUsers(1, 10);
      let endpoint = sessionStorage.getItem("endPoint");
      setUrl(endpoint);
      fetchData(page, perPage, sort, expression);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, [page, perPage, sort, expression]);

  async function makeDataItems(dataSet) {
    let custProdObj = await Promise.all(
      dataSet.map(async (data) => {
        // console.log("map data", data);
        const res = await api.get(
          `${ReportConfig.reportJobsApi}/products/${data.id}/performance`
        );
        // const res = await resp.json();
        console.log("res", res);
        let finalres = {
          id: data.id,
          date: data.insertedAt,
          products: data.name,
          totalResults: res.totalResults,
          goodResults: `${((res.goodResults / res.totalResults) * 100).toFixed(
            2
          )}% (${res.goodResults})`,
          badResults: `${((res.badResults / res.totalResults) * 100).toFixed(
            2
          )}% (${res.badResults})`,
          ejectedTotalResults: res.ejectedTotalResults,
        };
        //console.log("finalres", finalres);
        return finalres;
      })
    );
    // console.log("custProd", custProdObj);
    setItems(custProdObj);
  }
  const fetchDataDefault = async () => {
    fetchData(page, perPage, sort, expression);
  };
  const fetchData = async (page, per_page, sort, expression) => {
    setLoading(true);

    api
      .create(
        `${ReportConfig.reportJobsApi}/customers/${custid}/products?page=${page}&itemsPerPage=${per_page}`,
        {
          sort: sort,
          expression: expression,
        }
      )
      .then((data) => {
        // console.log("1st data", data);
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
    // console.log("aval", val);
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
            <h4>{`Customer ${custid}`}</h4>
            <Input
              type="text"
              placeholder="search by product name..."
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

export default CustomerProduct;
