import React, { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import axios from "axios";
const PaginatedTable = (props) => {
  const { title, url, columns, mapResponse, getExpression, defaultSort } = props;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(defaultSort || "id ASC");
  const [search, setSearch] = useState("");
  const [expression, setExpression] = useState("");
  useEffect(() => {
    fetchData(page, perPage, sort, expression);
  }, [page, perPage, sort, expression])
  const fetchData = async (page, per_page, sort, expression) => {
    axios
      .post(`${url}?page=${page || 1}&itemsPerPage=${per_page || 10}`, { "sort": sort, "expression": expression })
      .then((data) => {
        setIsLoaded(true);
        if (page != data.page)
          setPage(data.page);
        setItems(mapResponse ? mapResponse(data.items) : data.items);
        setTotalRows(data.totalItems);
        setLoading(false);
      })

      .catch((err) => {
        console.log(err);
        if (err.split(" ").includes("401")) {
          props.history.push("/login");
        }
        setIsLoaded(true);
        setLoading(false);
      });
  }

  const handlePageChange = page => {
    setPage(page);
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  }

  columns.forEach(columnd => {

  });

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
      <div>
        <input
          type="text"
          value={search}
          onChange={handleInputExpression}
        />
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
      </div>
    </React.Fragment>
  );
};

export default PaginatedTable;