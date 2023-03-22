import React, { useState, useEffect } from "react";
import styles from "./BaseFee.module.css";
import { fetchFeeHistory } from "./BaseFee";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale, //x axis --> block#
  LinearScale, //y axis --> baseFee
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

function GetRatio() {
  const blocksArrayChart = [],
    baseFeeArrayChart = [];

  useEffect(() => {
    getBaseFee();
  }, []);

  const [baseFeesArray, setBaseFeesArray] = useState([]);
  const [blocksArray, setBlocksArray] = useState([]);
  const [startingBlock, setStartingBlock] = useState(null);
  const [toTheBlock, settoTheBlock] = useState(null);

  //Fetch feeHistory from alchemy
  async function getBaseFee() {
    const { currentBlock, arrayFeeHistory } = await fetchFeeHistory();
    setStartingBlock((currentBlock - 19).toLocaleString());
    settoTheBlock(currentBlock.toLocaleString());
    const { gasUsedRatio } = arrayFeeHistory;
    let _blockNumber = currentBlock - 19;
    if(baseFeeArrayChart.length===0){
      for (let i = 0; i < gasUsedRatio.length; i++) {
        baseFeeArrayChart.push(gasUsedRatio[i] * 100);
        blocksArrayChart.push(`${_blockNumber.toLocaleString()}`);
        _blockNumber++;
      }
      setBaseFeesArray(baseFeeArrayChart);
      setBlocksArray(blocksArrayChart);
    }
  }
  console.log(baseFeeArrayChart)

  return baseFeeArrayChart
}

export default GetRatio;