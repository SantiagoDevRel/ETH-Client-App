import React, { useState, useEffect } from "react";
import styles from "./EIP1559.module.css";
import { Network, Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";
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

const KEY = process.env.REACT_APP_KEY;

const ALCHEMY_KEY = "IpyDwxNjc0EQh7Fry0jz03AbWFLTXwIr";

const settings = {
  apiKey: `${ALCHEMY_KEY}`,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export async function fetchFeeHistory() {
  const _currentBlock = await alchemy.core.getBlockNumber();
  const _hexNumber = ethers.utils.hexlify(_currentBlock);
  const _currentBlockHex = ethers.utils.hexStripZeros(_hexNumber);
  return {
    currentBlock: _currentBlock,
    arrayFeeHistory: await alchemy.core.send("eth_feeHistory", [
      20,
      _currentBlockHex,
    ]),
  };
}

function Eip1559() {
  useEffect(() => {
    getBaseFee();
    getRatio();
  }, []);

  const auxArray = [],
    blocksArrayChart = [],
    baseFeeArrayChart = [],
    blocksRatioChart = [],
    ratioArray = [];

  const [ratioChart, setRatioChart] = useState([]);
  const [baseFeesArray, setBaseFeesArray] = useState([]);
  const [blocksArray, setBlocksArray] = useState([]);
  const [startingBlock, setStartingBlock] = useState(null);
  const [toTheBlock, settoTheBlock] = useState(null);

  //format baseeFeeHistory per block
  async function getBaseFee() {
    const { currentBlock, arrayFeeHistory } = await fetchFeeHistory();
    setStartingBlock((currentBlock - 19).toLocaleString());
    settoTheBlock(currentBlock.toLocaleString());
    const baseFeeArray = arrayFeeHistory["baseFeePerGas"];
    let _blockNumber = currentBlock;
    //[11] --> current block, [10] --> current block - 1, etc...
    for (let i = baseFeeArray.length - 1; i > 0; i--) {
      const formattedString = parseInt(baseFeeArray[i - 1], 16)
        .toString()
        .slice(0, -9)
        .concat(
          ".",
          parseInt(baseFeeArray[i - 1], 16)
            .toString()
            .slice(-9)
        );

      const block = {
        blockNumber: _blockNumber,
        baseFee: `${formattedString}`,
      };
      auxArray.push(block);
      _blockNumber -= 1;
    }

    if (blocksArrayChart.length === 0) {
      for (let i = auxArray.length - 1; i >= 0; i--) {
        blocksArrayChart.push(auxArray[i]["blockNumber"].toLocaleString());
        baseFeeArrayChart.push(Number(auxArray[i]["baseFee"]));
      }
      setBlocksArray(blocksArrayChart);
      setBaseFeesArray(baseFeeArrayChart);
    }
  }

  //format Ratio used per block
  async function getRatio() {
    const { currentBlock, arrayFeeHistory } = await fetchFeeHistory();
    setStartingBlock((currentBlock - 19).toLocaleString());
    settoTheBlock(currentBlock.toLocaleString());
    const { gasUsedRatio } = arrayFeeHistory;
    let _blockNumber = currentBlock - 19;
    if (ratioArray.length === 0) {
      for (let i = 0; i < gasUsedRatio.length; i++) {
        ratioArray.push(gasUsedRatio[i] * 100);
        blocksRatioChart.push(`${_blockNumber.toLocaleString()}`);
        _blockNumber++;
      }
      setRatioChart(ratioArray);
    }
  }

  //Chart data
  const data = {
    labels: blocksArray,
    datasets: [
      {
        label: "BaseFeePerGas per Block in Gwei",
        data: baseFeesArray,
        backgroundColor: "black",
        borderColor: "black",
        pointBorderColor: "white",
        tension: 0.3,
        yAxisID: "y",
      },
      {
        label: "Ratio % gas used per Block",
        data: ratioChart,
        backgroundColor: "#03E1FF",
        borderColor: "#03E1FF",
        pointBorderColor: "black",
        tension: 0.3,
        yAxisID: "percentage",
      },
    ],
  };

  const options = {
    plugins: {
      legend: true,
    },
    scales: {
      y: {
        min: null,
        max: null,
        position: "left",
      },
      percentage: {
        min: 0,
        max: 100,
        position: "right",
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
            getRatio();
          }}
        >
          Update last 20 blocks BaseFee & Ratio
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

export default Eip1559;
