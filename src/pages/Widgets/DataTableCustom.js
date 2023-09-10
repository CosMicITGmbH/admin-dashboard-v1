/* eslint-disable no-lone-blocks */
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
  customerProductTag,
  groupTag,
  latestJobsTag,
  machineInAGroupTag,
  productOrderTag,
  servicesTag,
  userInAGroupTag,
  userRole,
  userTag,
} from "../../helpers/appContants";
import { getCustomerJobResponse } from "../Jobs/CustomersData";
import {
  getJobItemResponse,
  getJobItemResponseV2,
  getReportingUrl,
} from "../Jobs/latest jobs/JobData";
import {
  getMachineDatabyId,
  getUserDatabyId,
} from "../Pages/Groups/GroupHelpers";
import { PieChart } from "../Jobs/PieChart";
import { useTranslation } from "react-i18next";

const DataTableCustom = ({
  columns,
  url,
  expressions,
  tag,
  isreportingApi,
  isPieChartVisible,
  title,
  reloadData,
  value,
  // unsetReload,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const machineName = useSelector((state) => state.Machine.machineName);
  // console.log("machineName reducer", machineName);
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
    //  console.log("out trying to reload machine data");
    if (machineName.name && tag === customerJobTag) {
      console.log("trying to reload machine data", { machineName, tag });
      setGraphData({ ...graphData, show: false });
      setExpression(`machineId==${machineName.id}`);
      // setNewLoading(false);
    }
  }, [machineName.name]);

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
    if (reloadData) {
      console.log("****Pls wait reloading data*****");
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
      let reportingUrl = machineName.endpoint || getReportingUrl();
      let axiosInstReporting = customAxios(reportingUrl);
      if (isreportingApi) {
        console.log("in reporting api");
        finalUrl = `${reportingUrl}/${url}`;
        console.log("final url", finalUrl);
        switch (tag) {
          case latestJobsTag:
            {
              resp = await axiosInstReporting.post(
                `${finalUrl}?page=${page}&itemsPerPage=${per_page}`,
                {
                  sort: "id DESC", //lates job should return latest record
                  expression: expression,
                }
              );
              if (resp.items.length) {
                let finalItems = await getJobItemResponseV2(resp.items);
                console.log("finalItems", finalItems);
                setItems(finalItems);
              }

              setTotalRows(resp.totalItems);
            }
            break;
          case customerJobTag:
            {
              resp = await axiosInstReporting.post(
                `${finalUrl}?page=${page}&itemsPerPage=${per_page}`,
                { expression: `machineId==${machineName.id}` }
              );
              setNewLoading(false);
              setItems(resp.items);
              setTotalRows(resp.totalItems);
              setNewLoading(true);
              // set performance data of product
              const perfData = await axiosInstReporting.get(
                `${reportingUrl}/jobs/machines/${machineName.id}/performance`
              );
              console.log("perfData for customer****", perfData);

              setGraphData({
                show: true,
                data: [
                  perfData.goodResults,
                  perfData.badResults,
                  perfData.unknownResults,
                ],
              });
            }

            break;
          case customerProductTag:
            {
              resp = await axiosInstReporting.post(
                `${finalUrl}?page=${page}&itemsPerPage=${per_page}`,
                {}
              );
              setNewLoading(false);
              setItems(resp.items);
              setTotalRows(resp.totalItems);
              setNewLoading(true);
              // set performance data of machine
              const perfData = await axiosInstReporting.get(
                `${reportingUrl}/jobs/products/${value}/performance`
              );
              console.log("perfData for produt****", perfData);

              setGraphData({
                show: true,
                data: [
                  perfData.goodResults,
                  perfData.badResults,
                  perfData.unknownResults,
                ],
              });
            }
            break;
          case productOrderTag:
            {
              resp = await axiosInstReporting.post(
                `${finalUrl}?page=${page}&itemsPerPage=${per_page}`,
                {}
              );
              setNewLoading(false);
              setItems(resp.items);
              setTotalRows(resp.totalItems);
              setNewLoading(true);
              // set performance data of machine
              const perfData = await axiosInstReporting.get(
                `${reportingUrl}/jobs/orders/${value}/performance`
              );
              console.log("perfData for orders****", perfData);

              setGraphData({
                show: true,
                data: [
                  perfData.goodResults,
                  perfData.badResults,
                  perfData.unknownResults,
                ],
              });
            }
            break;
          default:
            break;
        }
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
        items = resp.items;
        totalItems = resp.totalItems;

        if (tag === groupTag) {
          setGroupData(items);
        } else if (tag === servicesTag) {
          setServicesData(items);
        } else {
          setItems(items);
          setTotalRows(totalItems);
        }
        console.log("resp from datacustom", resp);
      }

      // if (items && items.length) {
      //   switch (tag) {
      //     case groupTag:
      //       setGroupData(items);
      //       break;
      //     case servicesTag:
      //       setServicesData(items);
      //       break;
      //     case userTag:
      //       setItems(items);
      //       break;
      //     // case latestJobsTag: {
      //     //   let resp = await getJobItemResponse(items);
      //     //   setItems(resp);
      //     //   break;
      //     // }
      //     case customerJobTag: {
      //       // let resp = await getCustomerJobResponse(items);
      //       // setItems(resp);
      //       // const graphDataResp = await getGraphdata(resp);
      //       // //  console.log("graphDataResp", graphDataResp);
      //       // setGraphData({
      //       //   show: true,
      //       //   data: Object.values(graphDataResp),
      //       // });
      //       break;
      //     }
      //     // case customerProductTag: {
      //     //   //get grpah data
      //     //   let resp = await  getCustomerProductResp(items)
      //     //   setItems(items);

      //     //       const graphDataResp = await getGraphdata(resp);
      //     //       //  console.log("graphDataResp", graphDataResp);
      //     //       setGraphData({
      //     //         show: true,
      //     //         data: Object.values(graphDataResp),
      //     //       });
      //     //   break;
      //     // }
      //     default:
      //       console.log("No tags matching:", tag);
      //       break;
      //   }
      //   setItems(items);
      //   setTotalRows(totalItems);
      // } else {
      //   setItems(items ?? []);
      //   setTotalRows(totalItems ?? 0);
      // }
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
      {graphData.show && (
        <div
          style={{
            width: "50%",
            height: "50%",
            margin: "10px auto",
            textAlign: "center",
          }}
        >
          <PieChart
            configuration={{
              labels: ["Good", "Bad", "Unkown"],
              title: "Performance for customer",
              data: graphData.data,
              color: ["#7acc29", "#db184f", "#0bcbe0"],
            }}
          />
        </div>
      )}

      <Input
        type="text"
        placeholder={t("type to search") + " ..."}
        value={search}
        onChange={handleChange}
      />

      <DataTable
        title={t(title)}
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
