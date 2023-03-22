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

function Ratio() {
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

  //Chart data
  const data = {
    labels: blocksArray,
    datasets: [
      {
        label: "% of Gas used of 30,000,000",
        data: baseFeesArray,
        backgroundColor: "white",
        borderColor: "black",
        pointBorderColor: "white",
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: true,
    },
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <>
      <div className={styles.container_title}>
        <span className={styles.title}>
          From the block #{startingBlock}
          <br></br> to the block #{toTheBlock}
        </span>
        <button
          className={styles.button}
          onClick={() => {
            getBaseFee();
          }}
        >
          Update last 20 blocks Gas Used
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.chart}>
          <Line data={data} options={options}></Line>
        </div>
      </div>
    </>
  );
}

export default Ratio;
