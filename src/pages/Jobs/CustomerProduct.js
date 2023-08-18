import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Moment from "react-moment";
import { useLocation } from "react-router-dom";
import { Alert, Button, Col, Container, Input, Row } from "reactstrap";
import { customAxios } from "../../Axios/axiosConfig";
import Loader from "../../Components/Common/Loader";
import {
  APIClient,
  getUserRole,
  machineEndPoint,
} from "../../helpers/api_helper";
import ReportConfig from "./ReportConfig";
import { userRole } from "../../helpers/appContants";
const api = new APIClient();

const CustomerProduct = (props) => {
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Date69</span>,
      selector: (row) => row.date,
      cell: (row) => (
        <span>{<Moment format="DD/MM/YYYY">{row.date}</Moment>}</span>
      ),
      sortable: true,
      database_name: "updatedAt",
    },
    {
      name: <span className="font-weight-bold fs-13">Product</span>,
      selector: (row) => row.productName,
      cell: (row) => (
        <a href={`/product-order?pid=${row.id}&pname=${row.productName}`}>
          {row.productName}
        </a>
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
            props.history.push(
              `/product-order?pid=${row.id}&pname=${row.productName}`
            );
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

  const searchParam = useLocation().search;
  const custid = new URLSearchParams(searchParam).get("cid");
  const custName = new URLSearchParams(searchParam).get("cname");

  document.title = "Customer Details";
  useEffect(() => {
    let role = getUserRole();

    if (role !== userRole) {
      let endpoint = machineEndPoint();
      fetchData(page, perPage, sort, expression, endpoint);
    } else {
      //redirect to dashboard
      props.history.push("/dashboard");
    }
  }, [page, perPage, sort, expression]);

  async function makeDataItems(dataSet) {
    let custProdObj = await Promise.all(
      dataSet.map(async (data) => {
        const res = await api.get(
          `${ReportConfig.reportJobsApi}/products/${data.id}/performance`
        );

        console.log("res", res);
        let finalres = {
          id: data.id,
          date: data.insertedAt,
          productName: data.name,
          totalResults: res.totalResults,
          goodResults: `${((res.goodResults / res.totalResults) * 100).toFixed(
            2
          )}% (${res.goodResults})`,
          badResults: `${((res.badResults / res.totalResults) * 100).toFixed(
            2
          )}% (${res.badResults})`,
          ejectedTotalResults: res.ejectedTotalResults,
        };

        return finalres;
      })
    );

    setItems(custProdObj);
  }
  const fetchDataDefault = async () => {
    fetchData(page, perPage, sort, expression);
  };
  const fetchData = async (page, per_page, sort, expression, endpoint) => {
    setLoading(true);
    let baseURL = customAxios(endpoint);
    baseURL
      .post(
        `jobs/customers/${custid}/products?page=${page}&itemsPerPage=${per_page}`,
        {
          sort: sort,
          expression: expression,
        }
      )
      .then((res) => {
        // console.log("1st data", data);
        const { data } = res;
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
            <h4>{`${custName}`}</h4>
            <Input
              autoFocus
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
