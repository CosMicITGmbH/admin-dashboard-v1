import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
import {
  Input,
  InputGroup,
  InputGroupText,
  Button,
  Row,
  Col,
} from "reactstrap";
const PaginatedTable = (props) => {
  const { title, url, columns, mapResponse, getExpression, defaultSort, setLoading } = props;

  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(defaultSort || "id ASC");
  const [search, setSearch] = useState("");
  const [expression, setExpression] = useState("");
  useEffect(() => {
    fetchData(page, perPage, sort, expression);
  }, [page, perPage, sort, expression])
  const fetchData = async (page, per_page, sort, expression) => {
    setLoading(true);
    axios
      .post(`${url}?page=${page || 1}&itemsPerPage=${per_page || 10}`, { "sort": sort, "expression": expression })
      .then((data) => {
        if (page != data.page)
          setPage(data.page);
        setItems(mapResponse ? mapResponse(data.items) : data.items);
        setTotalRows(data.totalItems);
      })

      .catch((err) => {
        console.log(err);
        if (err.split(" ").includes("401")) {
          props.history.push("/login");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handlePageChange = page => {
    setPage(page);
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  }


  const handleInputExpression = async (e) => {
    var val = e.target.value;
    setSearch(val);
    if (val == "")
      setExpression("");
    else
      setExpression(getExpression(val));
    //`firstname.Contains("${val}") || lastname.Contains("${val}") || email.Contains("${val}")`
  };
  const handleSort = async (column, sortDirection) => {
    setSort(column.database_name + " " + sortDirection);
  };
  return (
    <React.Fragment>
      <Row>
        <Col>
          <InputGroup>
            <Input
              type="search"
              placeholder="Search any field..."
              value={search}
              onChange={handleInputExpression}
            />
            <Button addon addonType="prepend">
              <i className="las la-search" />
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <DataTable
          title={title}
          columns={columns}
          data={items}
          fixedHeader
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationRowsPerPageOptions={[10, 25, 50]}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
          sortServer
          onSort={handleSort}
        />
      </Row>
    </React.Fragment >
  );
};

export default PaginatedTable;