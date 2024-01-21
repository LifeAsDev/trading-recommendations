"use client";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { useOnboardingContext } from "@/context/MyContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingToast from "../usersTable/loading";
import isEqual from "lodash/isEqual";
import livelogo from "../../../public/images/Logo.png";
import BitasEth from "./bitasetherum";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);
import { Line } from "react-chartjs-2";

export default function Bitcoin() {
  const dataExample = {
    Time: "15:25-15:30",
    CallOI: 31.89,
    IV1: 26.39,
    Delta1: 0.96,
    OIInter1: 0,
    Price1: 0,
    CallOIInterpretation: 0,
    Strike: 47700,
    PutOiInterpretation: 0,
    Price2: 0,
    OIInter2: 0,
    Delta2: 0.96,
    IV2: 26.39,
    PutOI: "20.55.825",
  };
  const { session, status } = useOnboardingContext();

  const [data, setData] = useState([]);

  const updateData = async (dataSelect = "Bitcoin") => {
    let newData;
    if (dataSelect === "Bitcoin") {
      newData = [...data];
    } else if (dataSelect === "chartDataBitcoin") {
      newData = [...chartData];
    } else {
      newData = [...freeTextTable];
    }

    let toastId;
    try {
      toastId = toast(<LoadingToast text="Updating table..." />, {
        autoClose: false,
      });
      const res = await fetch("/api/ethereum", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ newData, dataSelect }),
      });

      if (res.ok) {
        toast.update(toastId, {
          render: "Table update successfully",
          type: "success",
          autoClose: 5000,
        });
        const data = await res.json();
        return data.data;
      } else if (res.status === 404) {
        toast.update(toastId, {
          render: res.error,
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        });
        console.warn("API endpoint not found");
        return [];
      } else {
        toast.update(toastId, {
          render: res.error,
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        });
        console.error("Error in the request:", res.status);
        return [];
      }
    } catch (error) {
      toast.update(toastId, {
        render: res.error,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
      console.error("Error in the request:", error);
      return [];
    }
  };
  const [chartData, setChartData] = useState([]);

  const chartDataExample = {
    Time: "15:25-15:30",
    Value1: 5000000,
    Value2: 5000000,
  };
  const addItem = (dataSelect = "data") => {
    closeAllDropdown();
    let newDataExample;
    let newData;
    if (dataSelect === "data") {
      newData = [...data];
      newDataExample = { ...dataExample };
    } else if (dataSelect === "chartDataBitcoin") {
      newData = [...chartData];
      newDataExample = { ...chartDataExample };
    } else {
      newData = [...freeTextTable];
      newDataExample = { ...dataFreeText };
    }
    if (newData.length > 0) {
      const lastEntryTime = newData[0].Time;
      const newTime = calculateNewTime(lastEntryTime);
      newDataExample.Time = newTime;
    } else {
      const currentTime = getCurrentTime();
      newDataExample.Time = currentTime;
    }
    newData.unshift(newDataExample);
    if (dataSelect === "data") {
      setData((prevData) => [newDataExample, ...prevData]);
    } else if (dataSelect === "chartDataBitcoin") {
      setChartData((prevData) => [newDataExample, ...prevData]);
    } else {
      setFreeTextTable((prevData) => [newDataExample, ...prevData]);
    }
  };

  const calculateNewTime = (lastEntryTime) => {
    const [start, end] = lastEntryTime.split("-");
    const endTime = new Date(`01/01/2022 ${end}`);
    endTime.setMinutes(endTime.getMinutes() + 5);

    // Obtén el tiempo de inicio en formato hh:mm
    const formattedEndTime = endTime.toTimeString().slice(0, 5);
    return `${end}-${formattedEndTime}`;
  };

  const getCurrentTime = () => {
    const currentTime = new Date();
    const currentMinutes = currentTime.getMinutes();

    const roundedMinutes = Math.floor(currentMinutes / 5) * 5;

    currentTime.setMinutes(roundedMinutes);

    const formattedStartTime = currentTime.toTimeString().slice(0, 5);

    currentTime.setMinutes(roundedMinutes + 5);
    const formattedEndTime = currentTime.toTimeString().slice(0, 5);

    return `${formattedStartTime}-${formattedEndTime}`;
  };
  const deleteItem = (index, dataSelect = "Bitcoin") => {
    closeAllDropdown();
    let newData;
    if (dataSelect === "Bitcoin") {
      newData = [...data];
      newData.splice(index, 1);
      setData(newData);
    } else if (dataSelect === "chartDataBitcoin") {
      newData = [...chartData];
      newData.splice(index, 1);
      setChartData(newData);
    } else {
      newData = [...freeTextTable];
      newData.splice(index, 1);
      setFreeTextTable(newData);
    }
  };
  const getData = async (dataSelect = "Bitcoin") => {
    try {
      const queryParams = new URLSearchParams({ dataSelect });

      const res = await fetch(`/api/ethereum?${queryParams}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        return data.data;
      } else if (res.status === 404) {
        console.warn("API endpoint not found");
        return [];
      } else {
        console.error("Error in the request:", res.status);
        return [];
      }
    } catch (error) {
      console.error("Error in the request:", error);
      return [];
    }
  };

  const onChange = (value, property, index, dataSelect = "Bitcoin") => {
    closeAllDropdown();
    let newData;
    if (dataSelect === "Bitcoin") {
      newData = [...data];
      newData[index][property] = value;
      setData(newData);
    } else if (dataSelect === "chartDataBitcoin") {
      newData = [...chartData];
      newData[index][property] = value;
      setChartData(newData);
    } else {
      newData = [...freeTextTable];
      newData[index][property] = value;
      setFreeTextTable(newData);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setData(data);
        const dataFetch3 = await getData("chartDataBitcoin");
        setChartData((prevState) => {
          if (!isEqual(prevState, dataFetch3)) {
            return dataFetch3;
          }
          return prevState;
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFetch = await getData();
        const dataFetch3 = await getData("chartDataBitcoin");
        setChartData((prevState) => {
          if (!isEqual(prevState, dataFetch3)) {
            return dataFetch3;
          }
          return prevState;
        });

        setData(dataFetch);

        if (JSON.stringify(data) !== JSON.stringify(dataFetch)) return false;
      } catch (error) {
        console.error(error);
        return false;
      }
    };
    const intervalId = setInterval(async () => {
      if (!session || (session && session.user && !session.user.admin)) {
        const beep = await fetchData();
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [session, data]);

  const closeAllDropdown = (id = "") => {
    for (let i = 1; i <= 6 * data.length; i++) {
      if (id !== `check${i}`) {
        const checkbox = document.getElementById(`check${i}`);
        if (checkbox) {
          checkbox.checked = false;
        }
      }
    }
  };
  const [tableData, setTableData] = useState({
    labels: [],
    datasets: [
      {
        label: "Users Gained",
        data: [],
        backgroundColor: ["white"],
        borderColor: "#a33131",
        borderWidth: 2,
      },
    ],
  });
  const options = {
    tension: 0.01,

    type: "line",
    maintainAspectRatio: false,
  };
  useEffect(() => {
    const reversedData = [...chartData].reverse();

    setTableData({
      labels: reversedData.map((item) => item.Time),
      datasets: [
        {
          label: "Selling Pressure",
          data: reversedData.map((item, i) => item.Value1),
          backgroundColor: ["white"],
          borderColor: "#a33131",
          borderWidth: 6,
          pointBackgroundColor: "white",
          pointRadius: 6,
        },
        {
          label: "Buying Pressure",
          data: reversedData.map((item, i) => item.Value2),
          backgroundColor: ["white"],
          borderColor: "green",
          borderWidth: 6,
          pointRadius: 6,
        },
      ],
      scales: {
        y: {
          ticks: {
            min: 0,
            max: 10000000,
          },
        },
      },
    });
  }, [chartData]);

  return (
    <main className={styles.main}>
      <h1 className={styles.zigZagText}>
        <Image width={90} height={90} alt="Live Feed" src="/images/gipy.gif" />
        Bitcoin Option Chain: Open Interest Interpretation
      </h1>
      <div className="flex flex-col w-full lg:flex-row justify-between overflow-hidden">
        <div className="w-full">
          <div className={styles.head1}>
            <div className={styles.prov}>
              <p>CALL</p>
            </div>
            <div className={styles.prov}>
              <p>PUT</p>
            </div>
          </div>
          <div
            className={`scrollbar1 w-full flex overflow-scroll justify-start flex-col h-[39rem] bg-[#181a1b] ${styles.table}`}
          >
            <table>
              <thead>
                <tr>
                  {/* <th>N</th> */}
                  {/* <th>Time</th> */}
                  {session && session.user.admin ? <th>Delete</th> : null}{" "}
                  <th>Call OI</th>
                  <th>IV</th>
                  <th>Delta</th>
                  <th>Trend</th>
                  <th>Price</th>
                  <th>Call OI Interpretation</th>
                  <th>Strike</th>
                  <th>Put OI Interpretation</th>
                  <th>Price</th>
                  <th>Trend</th>
                  <th>Delta</th>
                  <th>IV</th>
                  <th>Put OI</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  return (
                    <tr key={item.Time}>
                      {/* <td className="flex flex-row gap-2 justify-center">
                        {session && session.user.admin ? (
                          <div
                            onClick={() => deleteItem(index)}
                            className="cursor-pointer w-6 flex justify-center items-center rounded h-6 bg-red-600"
                          >
                            X
                          </div>
                        ) : null}
                    { null}
                      </td> */}
                      {/* <td>
                        {session && session.user.admin ? (
                          <div>
                            <input
                              onChange={(e) =>
                                onChange(e.target.value, "Time", index)
                              }
                              defaultValue={item.Time}
                              className={styles.inputTable}
                              type="text"
                            />
                          </div>
                        ) : (
                          item.Time
                        )}
                      </td> */}

                      {session && session.user.admin ? (
                        <td className="flex justify-center">
                          <div
                            onClick={() => deleteItem(index)}
                            className="cursor-pointer w-6 flex justify-center items-center rounded h-6 bg-red-600"
                          >
                            X
                          </div>
                        </td>
                      ) : null}

                      <td>
                        {session && session.user.admin ? (
                          <input
                            onChange={(e) =>
                              onChange(e.target.value, "CallOI", index)
                            }
                            defaultValue={item.CallOI}
                            className={styles.inputTable}
                            type="text"
                          />
                        ) : (
                          item.CallOI
                        )}
                      </td>
                      <td>
                        {session && session.user.admin ? (
                          <input
                            onChange={(e) =>
                              onChange(e.target.value, "IV1", index)
                            }
                            defaultValue={item.IV1}
                            className={styles.inputTable}
                            type="text"
                          />
                        ) : (
                          item.IV1
                        )}
                      </td>
                      <td>
                        {session && session.user.admin ? (
                          <input
                            onChange={(e) =>
                              onChange(e.target.value, "Delta1", index)
                            }
                            defaultValue={item.Delta1}
                            className={styles.inputTable}
                            type="text"
                          />
                        ) : (
                          item.Delta1
                        )}
                      </td>
                      <td className={styles.dropdown}>
                        <label htmlFor={`check${1 + 6 * index}`}>
                          <input
                            disabled={
                              session && session.user.admin ? false : true
                            }
                            className={styles.input1}
                            type="checkbox"
                            id={`check${1 + 6 * index}`}
                            onChange={() =>
                              closeAllDropdown(`check${1 + 6 * index}`)
                            }
                          />
                          <label className={styles.label1}>
                            <label
                              onClick={() => onChange(0, "OIInter1", index)}
                            >
                              <div className={styles.blue}>
                                <Image
                                  alt="arrow horizontal"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow h.png"
                                />
                              </div>
                            </label>
                            <label
                              onClick={() => onChange(2, "OIInter1", index)}
                            >
                              <div className={styles.red}>
                                <Image
                                  alt="arrow down"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                            <label
                              onClick={() => onChange(1, "OIInter1", index)}
                            >
                              <div className={styles.green}>
                                <Image
                                  alt="arrow up"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                          </label>
                          <div
                            className={`${
                              item.OIInter1 === 0
                                ? styles.blue
                                : item.OIInter1 === 1
                                ? styles.green
                                : styles.red
                            }`}
                          >
                            <Image
                              alt={
                                item.OIInter1 === 0
                                  ? "arrow horizontal"
                                  : item.OIInter1 === 1
                                  ? "arrow up"
                                  : "arrow down"
                              }
                              width={32}
                              height={32}
                              src={
                                "/images/table/" +
                                (item.OIInter1 === 0
                                  ? "arrow h.png"
                                  : "arrow.png")
                              }
                            />
                          </div>
                        </label>
                      </td>
                      <td className={styles.dropdown}>
                        <label htmlFor={`check${2 + 6 * index}`}>
                          <input
                            disabled={
                              session && session.user.admin ? false : true
                            }
                            className={styles.input1}
                            type="checkbox"
                            id={`check${2 + 6 * index}`}
                            onChange={() =>
                              closeAllDropdown(`check${2 + 6 * index}`)
                            }
                          />
                          <label className={styles.label1}>
                            <label onClick={() => onChange(0, "Price1", index)}>
                              <div className={styles.blue}>
                                <Image
                                  alt="arrow horizontal"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow h.png"
                                />
                              </div>
                            </label>
                            <label onClick={() => onChange(2, "Price1", index)}>
                              <div className={styles.red}>
                                <Image
                                  alt="arrow down"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                            <label onClick={() => onChange(1, "Price1", index)}>
                              <div className={styles.green}>
                                <Image
                                  alt="arrow up"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                          </label>
                          <div
                            className={`${
                              item.Price1 === 0
                                ? styles.blue
                                : item.Price1 === 1
                                ? styles.green
                                : styles.red
                            }`}
                          >
                            <Image
                              alt={
                                item.Price1 === 0
                                  ? "arrow horizontal"
                                  : item.Price1 === 1
                                  ? "arrow up"
                                  : "arrow down"
                              }
                              width={32}
                              height={32}
                              src={
                                "/images/table/" +
                                (item.Price1 === 0
                                  ? "arrow h.png"
                                  : "arrow.png")
                              }
                            />
                          </div>
                        </label>
                      </td>
                      <td className={styles.dropdown}>
                        <label htmlFor={`check${3 + 6 * index}`}>
                          <input
                            disabled={
                              session && session.user.admin ? false : true
                            }
                            className={styles.input1}
                            type="checkbox"
                            id={`check${3 + 6 * index}`}
                            onChange={() =>
                              closeAllDropdown(`check${3 + 6 * index}`)
                            }
                          />
                          <label className={styles.label1}>
                            <label
                              onClick={() =>
                                onChange(0, "CallOIInterpretation", index)
                              }
                            >
                              <div className={`${styles.blue} ${styles.wide}`}>
                                Shorts Covering
                                <Image
                                  alt="arrow horizontal"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                            <label
                              onClick={() =>
                                onChange(2, "CallOIInterpretation", index)
                              }
                            >
                              <div className={`${styles.red} ${styles.wide}`}>
                                Short Build Up
                                <Image
                                  alt="arrow down"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                            <label
                              onClick={() =>
                                onChange(1, "CallOIInterpretation", index)
                              }
                            >
                              <div className={`${styles.green} ${styles.wide}`}>
                                Long Build Up
                                <Image
                                  alt="arrow up"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                            <label
                              onClick={() =>
                                onChange(3, "CallOIInterpretation", index)
                              }
                            >
                              <div
                                className={`${styles.yellow} ${styles.wide}`}
                              >
                                Long Unwinding
                                <Image
                                  alt="arrow up"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                          </label>
                          <div
                            className={`${
                              item.CallOIInterpretation === 0
                                ? styles.blue
                                : item.CallOIInterpretation === 1
                                ? styles.green
                                : item.CallOIInterpretation === 2
                                ? styles.red
                                : styles.yellow
                            } ${styles.wide}`}
                          >
                            {item.CallOIInterpretation === 0
                              ? "Shorts Covering"
                              : item.CallOIInterpretation === 3
                              ? "Long Unwinding"
                              : item.CallOIInterpretation === 1
                              ? "Long Build Up"
                              : "Short Build Up"}
                            <Image
                              alt={
                                item.CallOIInterpretation === 0
                                  ? "arrow horizontal"
                                  : item.CallOIInterpretation === 1
                                  ? "arrow up"
                                  : "arrow down"
                              }
                              width={32}
                              height={32}
                              src={
                                "/images/table/" +
                                (item.CallOIInterpretation === 0
                                  ? "arrow.png"
                                  : "arrow.png")
                              }
                            />
                          </div>
                        </label>
                      </td>
                      <td>
                        {session && session.user.admin ? (
                          <input
                            onChange={(e) =>
                              onChange(e.target.value, "Strike", index)
                            }
                            defaultValue={item.Strike}
                            className={styles.inputTable}
                            type="text"
                          />
                        ) : (
                          item.Strike
                        )}
                      </td>
                      <td className={styles.dropdown}>
                        <label htmlFor={`check${4 + 6 * index}`}>
                          <input
                            disabled={
                              session && session.user.admin ? false : true
                            }
                            className={styles.input1}
                            type="checkbox"
                            id={`check${4 + 6 * index}`}
                            onChange={() =>
                              closeAllDropdown(`check${4 + 6 * index}`)
                            }
                          />
                          <label className={styles.label1}>
                            <label
                              onClick={() =>
                                onChange(0, "PutOiInterpretation", index)
                              }
                            >
                              <div className={`${styles.blue} ${styles.wide}`}>
                                Shorts Covering
                                <Image
                                  alt="arrow horizontal"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                            <label
                              onClick={() =>
                                onChange(2, "PutOiInterpretation", index)
                              }
                            >
                              <div className={`${styles.red} ${styles.wide}`}>
                                Short Build Up
                                <Image
                                  alt="arrow down"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                            <label
                              onClick={() =>
                                onChange(1, "PutOiInterpretation", index)
                              }
                            >
                              <div className={`${styles.green} ${styles.wide}`}>
                                Long Build Up
                                <Image
                                  alt="arrow up"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                            <label
                              onClick={() =>
                                onChange(3, "PutOiInterpretation", index)
                              }
                            >
                              <div
                                className={`${styles.yellow} ${styles.wide}`}
                              >
                                Long Unwinding
                                <Image
                                  alt="arrow up"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                          </label>
                          <div
                            className={`${
                              item.PutOiInterpretation === 0
                                ? styles.blue
                                : item.PutOiInterpretation === 1
                                ? styles.green
                                : item.PutOiInterpretation === 2
                                ? styles.red
                                : styles.yellow
                            } ${styles.wide}`}
                          >
                            {item.PutOiInterpretation === 0
                              ? "Shorts Covering"
                              : item.PutOiInterpretation === 3
                              ? "Long Unwinding"
                              : item.PutOiInterpretation === 1
                              ? "Long Build Up"
                              : "Short Build Up"}
                            <Image
                              alt={
                                item.PutOiInterpretation === 0
                                  ? "arrow horizontal"
                                  : item.PutOiInterpretation === 1
                                  ? "arrow up"
                                  : "arrow down"
                              }
                              width={32}
                              height={32}
                              src={
                                "/images/table/" +
                                (item.PutOiInterpretation === 0
                                  ? "arrow.png"
                                  : "arrow.png")
                              }
                            />
                          </div>
                        </label>
                      </td>
                      <td className={styles.dropdown}>
                        <label htmlFor={`check${5 + 6 * index}`}>
                          <input
                            disabled={
                              session && session.user.admin ? false : true
                            }
                            className={styles.input1}
                            type="checkbox"
                            id={`check${5 + 6 * index}`}
                            onChange={() =>
                              closeAllDropdown(`check${5 + 6 * index}`)
                            }
                          />
                          <label className={styles.label1}>
                            <label onClick={() => onChange(0, "Price2", index)}>
                              <div className={styles.blue}>
                                <Image
                                  alt="arrow horizontal"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow h.png"
                                />
                              </div>
                            </label>
                            <label onClick={() => onChange(2, "Price2", index)}>
                              <div className={styles.red}>
                                <Image
                                  alt="arrow down"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                            <label onClick={() => onChange(1, "Price2", index)}>
                              <div className={styles.green}>
                                <Image
                                  alt="arrow up"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                          </label>
                          <div
                            className={`${
                              item.Price2 === 0
                                ? styles.blue
                                : item.Price2 === 1
                                ? styles.green
                                : styles.red
                            }`}
                          >
                            <Image
                              alt={
                                item.Price2 === 0
                                  ? "arrow horizontal"
                                  : item.Price2 === 1
                                  ? "arrow up"
                                  : "arrow down"
                              }
                              width={32}
                              height={32}
                              src={
                                "/images/table/" +
                                (item.Price2 === 0
                                  ? "arrow h.png"
                                  : "arrow.png")
                              }
                            />
                          </div>
                        </label>
                      </td>
                      <td className={styles.dropdown}>
                        <label htmlFor={`check${6 + 6 * index}`}>
                          <input
                            disabled={
                              session && session.user.admin ? false : true
                            }
                            className={styles.input1}
                            type="checkbox"
                            id={`check${6 + 6 * index}`}
                            onChange={() =>
                              closeAllDropdown(`check${6 + 6 * index}`)
                            }
                          />
                          <label className={styles.label1}>
                            <label
                              onClick={() => onChange(0, "OIInter2", index)}
                            >
                              <div className={styles.blue}>
                                <Image
                                  alt="arrow horizontal"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow h.png"
                                />
                              </div>
                            </label>
                            <label
                              onClick={() => onChange(2, "OIInter2", index)}
                            >
                              <div className={styles.red}>
                                <Image
                                  alt="arrow down"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                            <label
                              onClick={() => onChange(1, "OIInter2", index)}
                            >
                              <div className={styles.green}>
                                <Image
                                  alt="arrow up"
                                  width={32}
                                  height={32}
                                  src="/images/table/arrow.png"
                                />
                              </div>
                            </label>
                          </label>
                          <div
                            className={`${
                              item.OIInter2 === 0
                                ? styles.blue
                                : item.OIInter2 === 1
                                ? styles.green
                                : styles.red
                            }`}
                          >
                            <Image
                              alt={
                                item.OIInter2 === 0
                                  ? "arrow horizontal"
                                  : item.OIInter2 === 1
                                  ? "arrow up"
                                  : "arrow down"
                              }
                              width={32}
                              height={32}
                              src={
                                "/images/table/" +
                                (item.OIInter2 === 0
                                  ? "arrow h.png"
                                  : "arrow.png")
                              }
                            />
                          </div>
                        </label>
                      </td>
                      <td>
                        {session && session.user.admin ? (
                          <input
                            onChange={(e) =>
                              onChange(e.target.value, "Delta2", index)
                            }
                            defaultValue={item.Delta2}
                            className={styles.inputTable}
                            type="text"
                          />
                        ) : (
                          item.Delta2
                        )}
                      </td>
                      <td>
                        {session && session.user.admin ? (
                          <input
                            onChange={(e) =>
                              onChange(e.target.value, "IV2", index)
                            }
                            defaultValue={item.IV2}
                            className={styles.inputTable}
                            type="text"
                          />
                        ) : (
                          item.IV2
                        )}
                      </td>
                      <td>
                        {session && session.user.admin ? (
                          <input
                            onChange={(e) =>
                              onChange(e.target.value, "PutOI", index)
                            }
                            defaultValue={item.PutOI}
                            className={styles.inputTable}
                            type="text"
                          />
                        ) : (
                          item.PutOI
                        )}
                      </td>
                    </tr>
                  );
                })}
                {session && session.user.admin ? (
                  <tr>
                    <td colSpan="15">
                      <div className="flex flex-start pb-28 ">
                        <button
                          onClick={() => addItem()}
                          className="w-48 text-center bg-green-800 h-12 hover:bg-green-700"
                        >
                          +
                        </button>
                        <button
                          onClick={() => updateData()}
                          className="w-48 text-center bg-blue-700 h-12 hover:bg-blue-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setData([])}
                          className="w-48 text-center bg-red-700 h-12 hover:bg-red-600"
                        >
                          Delete All
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BitasEth />
    </main>
  );
}
