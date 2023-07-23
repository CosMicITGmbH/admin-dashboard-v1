import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { debounce, isNil } from "lodash";
import DataTable from "react-data-table-component";
import { Input } from "reactstrap";
import customAxios from "../../Axios/axiosConfig";
import {
  groupTag,
  latestJobsTag,
  servicesTag,
  userTag,
} from "../../helpers/appContants";

const DataTableCustom = ({
  columns,
  url,
  expressions,
  tag,
  isreportingApi,
}) => {
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState("id ASC");
  const [search, setSearch] = useState("");
  const [expression, setExpression] = useState("");

  useEffect(() => {
    const authUser = sessionStorage.getItem("authUser");
    if (!authUser) {
      history.push("/login");
      return;
    }

    try {
      const {
        data: { role },
      } = JSON.parse(authUser);
      if (role !== "user") {
        fetchDataDefault();
      } else {
        history.push("/dashboard");
      }
    } catch (error) {
      console.error("Error parsing 'authUser' JSON data:", error);
    }
  }, [expression, sort, perPage, page]);

  const fetchDataDefault = async () => {
    await fetchData(page, perPage, sort, expression);
  };

  const setGroupData = (data) => {
    const gridData = data.map((item) => {
      const { groupId: id, name, users, machines } = item;
      const member = users?.length || 0;
      const machinesNames =
        machines.length > 0
          ? machines.map((machine) => machine.name).join(",")
          : "NA";

      return {
        id,
        name,
        member,
        machines: machinesNames,
      };
    });

    setItems(gridData);
  };

  const setServicesData = (data) => {
    let gridData = data.items.map((item) => {
      return {
        key: item.key,
        name: item.name,
        endpoint: item.endpoint,
        insertedAt: item.insertedAt,
        updatedAt: item.updatedAt,
        machineId: item?.machine?.connectedServices?.[0].key || "NA",
        machineKey: item?.machine?.connectedServices?.[0].name || "NA",
      };
    });
    setItems(gridData);
  };

  const getReportingUrl = () => {
    let baseUrlReporting = "";
    try {
      baseUrlReporting = JSON.parse(
        sessionStorage.getItem("selectedMachine")
      )?.endPoint;
      return baseUrlReporting;
    } catch (error) {
      console.log("Error fetching report Url:", error);
    }
  };

  const fetchData = async (page, per_page, sort, expression) => {
    try {
      let resp,
        totalItems = 0,
        items = [];
      if (isreportingApi) {
        let reportingUrl = getReportingUrl();
        let finalUrl = `${reportingUrl}/${url}`;
        let axiosInstReporting = customAxios(reportingUrl);
        console.log("final url", finalUrl);

        resp = await axiosInstReporting.post(
          `${finalUrl}?page=${page}&itemsPerPage=${per_page}`,
          {
            sort: "id DESC", //lates job should return latest record
            expression: expression,
          }
        );

        items = resp.data.items;
        totalItems = resp.data.totalItems;
      } else {
        resp = await axios.post(
          `/${url}?page=${page}&itemsPerPage=${per_page}`,
          {
            sort: sort,
            expression: expression,
          }
        );
        items = resp.items;
        totalItems = resp.totalItems;
      }

      console.log(`resp for ${url}:`, { items, totalItems });

      if (items && items.length) {
        switch (tag) {
          case groupTag:
            setGroupData(items);
            break;
          case servicesTag:
            setServicesData(items);
            break;
          case userTag:
            setItems(items);
            break;
          case latestJobsTag:
            setLatestJobitems(items);
            break;
          default:
            console.log("No tags matching:", tag);
            break;
        }

        setTotalRows(totalItems);
      } else {
        setItems(items ?? []);
        setTotalRows(totalItems ?? 0);
      }
    } catch (error) {
      console.log(`Error from ${url}:`, error);
    }
  };

  async function setLatestJobitems(dataSet) {
    let reportingUrl = getReportingUrl();
    let axiosInstReporting = customAxios(reportingUrl);

    const calculatePercent = (value, total) => {
      return `${((value / total) * 100).toFixed(2)}% (${value})`;
    };

    let customerObj = await Promise.all(
      dataSet.map(async (data) => {
        const perfData = await axiosInstReporting.get(
          `/jobs/orders/${data.id}/performance`
        );
        let { customer, product } = data;
        let {
          totalResults = 0,
          goodResults = 0,
          badResults = 0,
          unknownResults = 0,
          ejectedTotalResults = 0,
          ejectedGoodResults = 0,
          ejectedBadResults = 0,
          ejectedUnknownResults = 0,
        } = perfData.data;

        let finalres = {
          id: data.id,
          date: data.insertedAt,
          customer: `${customer.name} #${customer.id}`,
          product: `${product.name} #${product.id}`,
          order: `${data.name} #${data.id}`,
          totalSheets: totalResults,
          goodSheets:
            totalResults === 0
              ? "0.00% (0)"
              : calculatePercent(goodResults, totalResults),
          badSheets:
            totalResults === 0
              ? "0.00% (0)"
              : calculatePercent(badResults, totalResults),
          ejectedSheets: ejectedTotalResults,
        };
        return finalres;
      })
    );
    setItems(customerObj);
  }

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    debouncedHandleChange(e.target.value);
  };

  const debouncedHandleChange = useRef(
    debounce((q) => sendQuery(q), 500)
  ).current;

  const sendQuery = (value) => {
    if (isNil(value)) setExpression("");
    else {
      const exp = expressions
        .map((item) => `${item}.Contains("${value}")`)
        .join(" || ");
      setExpression(exp);
    }
  };

  const handleSort = async (column, sortDirection) => {
    setSort(column.database_name + " " + sortDirection);
  };

  return (
    <>
      <Input
        type="text"
        placeholder="type to search..."
        value={search}
        onChange={handleChange}
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
  );
};

export default DataTableCustom;
