/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-prototype-builtins */
// import axios from "axios";
import { debounce, isNil } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Input } from "reactstrap";
import { AxiosInstance as axios, customAxios } from "../../Axios/axiosConfig";
import Loader from "../../Components/Common/Loader";
import {
  customerJobTag,
  groupTag,
  latestJobsTag,
  machineInAGroupTag,
  servicesTag,
  userInAGroupTag,
  userRole,
  userTag,
} from "../../helpers/appContants";
import { getCustomerJobResponse } from "../Jobs/CustomersData";
import {
  getJobItemResponse,
  getReportingUrl,
} from "../Jobs/latest jobs/JobData";
import {
  getMachineDatabyId,
  getUserDatabyId,
} from "../Pages/Groups/GroupHelpers";

const DataTableCustom = ({
  columns,
  url,
  expressions,
  tag,
  isreportingApi,
  //isPieChartVisible,
  title,
  reloadData,
}) => {
  const dispatch = useDispatch();

  const machineName = useSelector((state) => state.Machine.machineName);
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState("id ASC");
  const [search, setSearch] = useState("");
  const [expression, setExpression] = useState("");
  const [graphData, setGraphData] = useState({
    show: false,
    data: [0, 0, 0],
  });
  const [newloading, setNewLoading] = useState(true);

  useEffect(() => {
    if (machineName.endPoint) {
      setNewLoading(true);
      setPage(1);
      setNewLoading(false);
    }
  }, [machineName]);

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
      if (role !== userRole) {
        fetchDataDefault();
      } else {
        history.push("/dashboard");
      }
    } catch (error) {
      console.error("Error parsing 'authUser' JSON data:", error);
    }
  }, [expression, sort, perPage, page, reloadData]);

  useEffect(() => {
    console.log("need to reload page", reloadData, typeof reloadData);
    if (reloadData) {
      fetchDataDefault();
    }
  }, [reloadData]);

  const fetchDataDefault = async () => {
    setNewLoading(true);
    await fetchData(page, perPage, sort, expression);
    setNewLoading(false);
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
    let gridData = data.map((item) => {
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

  const fetchData = async (page, per_page, sort, expression) => {
    try {
      let resp,
        totalItems = 0,
        finalUrl,
        items = [];

      setNewLoading(true);
      let reportingUrl = machineName.endPoint || getReportingUrl();
      let axiosInstReporting = customAxios(reportingUrl);
      if (isreportingApi) {
        console.log("in reporting api");
        let reportingUrl = machineName.endPoint || getReportingUrl();
        let axiosInstReporting = customAxios(reportingUrl);
        finalUrl = `${reportingUrl}/${url}`;

        resp = await axiosInstReporting.post(
          `${finalUrl}?page=${page}&itemsPerPage=${per_page}`,
          {
            sort: "id DESC", //lates job should return latest record
            expression: expression,
          }
        );

        // items = resp.items;
        // totalItems = resp.totalItems;
      } else {
        //auth.charpify
        console.log("auth sharpify api");
        if (tag === userInAGroupTag) {
          const resp = await getUserDatabyId(url, expression);
          console.log("RESP *****", resp);
          setItems(resp.items);
          setTotalRows(resp.totalItems);
          return;
        } else if (tag === machineInAGroupTag) {
          const resp = await getMachineDatabyId(url, expression);
          console.log("RESP *****", resp);
          setItems(resp.items);
          setTotalRows(resp.totalItems);
          return;
        }
        resp = await axios.post(
          `/${url}?page=${page}&itemsPerPage=${per_page}`,
          {
            sort: tag === servicesTag ? "" : sort,
            expression: expression,
          }
        );

        // items = resp.items;
        // totalItems = resp.totalItems;
      }

      items = resp.items;
      totalItems = resp.totalItems;

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
          case latestJobsTag: {
            let resp = await getJobItemResponse(items);
            setItems(resp);
            break;
          }
          case customerJobTag: {
            let resp = await getCustomerJobResponse(items);
            setItems(resp);
            // const graphDataResp = await getGraphdata(resp);
            // //  console.log("graphDataResp", graphDataResp);
            // setGraphData({
            //   show: true,
            //   data: Object.values(graphDataResp),
            // });
            break;
          }
          // case customerProductTag: {
          //   //get grpah data
          //   let resp = await  getCustomerProductResp(items)
          //   setItems(items);

          //       const graphDataResp = await getGraphdata(resp);
          //       //  console.log("graphDataResp", graphDataResp);
          //       setGraphData({
          //         show: true,
          //         data: Object.values(graphDataResp),
          //       });
          //   break;
          // }
          default:
            console.log("No tags matching:", tag);
            break;
        }
        setTotalRows(totalItems);
      } else {
        setItems(items ?? []);
        setTotalRows(totalItems ?? 0);
      }
      setNewLoading(false);
    } catch (error) {
      console.log(`Error from ${url} ${tag}:`, error);
      // if (error?.response?.status === 401) {
      //   history.push("/login");
      // }
    }
  };

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
      {/* graph data omitted from MVP  */}
      {/* {graphData.show && (
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
              data: graphData.data,
              color: ["#7acc29", "#db184f", "#0bcbe0"],
            }}
          />
        </div>
      )} */}

      <Input
        type="text"
        placeholder="type to search..."
        value={search}
        onChange={handleChange}
      />

      <DataTable
        title={title}
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
        progressPending={newloading}
        progressComponent={<Loader />}
      />
    </>
  );
};

export default DataTableCustom;
