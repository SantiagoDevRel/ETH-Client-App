import React, { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";
import styles from "./ERC20Logs.module.css";
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
import { checkResultErrors } from "@ethersproject/abi";
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);
const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/`;
const ALCHEMY_KEY = `uk3L_f3i_POcVTRhWxKrYlUm__ftnzfm`;

const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const TransferSignature =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

function ERC20Logs() {
  useEffect(() => {
    //formatLogs(`${TransferSignature}`);
  }, []);

  const blocksArrayChart = [],
    logsArrayChart = [];
 
  const [startingBlock, setStartingBlock] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [logsPerBlock, setLogsPerBlock] = useState([]);
  const [blocksArray, setBlocksArray] = useState([]);

  const settings = {
    apiKey: `${ALCHEMY_KEY}`,
    network: Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(settings);

  async function getLast20Blocks() {
    const latestBlock = await alchemy.core.getBlockNumber();
    setCurrentBlock(latestBlock.toLocaleString());
    setStartingBlock((latestBlock - 20).toLocaleString());
    return latestBlock-20;
  }

  const fetchLogs = async () => {
    //get last 20 blocks
    const last20Blocks = await getLast20Blocks();
    //fetch the logs the last 10 blocks
    const Logs = await fetch(`${ALCHEMY_URL + ALCHEMY_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 0,
        method: "eth_getLogs",
        params: [
          {
            fromBlock: `${ethers.utils.hexlify(last20Blocks)}`,
            address: DAIAddress,
            topics: [`${TransferSignature}`],
          },
        ],
      }),
    });
    for(let i=last20Blocks;i<=last20Blocks+20;i++){
      blocksArrayChart.push(i)
    }
    setBlocksArray(blocksArrayChart);
    return await Logs.json();    
  };


  async function formatTransfers(){

    const {result} = await fetchLogs()
    const blocksInDecimal = result.map(x => parseInt(x.blockNumber,16))
    const transferArray = []
    console.log("array",blocksInDecimal)
    console.log([1,2,3,4,4,5,6,6,6,6].find(x=> x==6))
   // const object
    //console.log(result)
    for(let i=0;i<blocksArrayChart.length;i++){
      const aux = 0;
      for(let j=0;j<blocksInDecimal.length;j++){
        if(blocksArrayChart[i] == blocksInDecimal[j]){
          aux++
          transferArray.push[aux]
        }else{
          transferArray.push[0]
        }
      }
    }
    console.log("TX",transferArray);
  }

  


  //Chart data
  const data = {
    labels: blocksArray,
    datasets: [
      {
        label: "BaseFeePerGas per Block in Gwei",
        data: [],//baseFeesArray,
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
        min: null,
        max: null,
      },
    },
  };


  return (
    <>
      <div className={styles.container_title}>
        <span className={styles.title}>
          From the block #{startingBlock}
          <br></br> to the block #{currentBlock}
        </span>
        <button
          className={styles.button}
          onClick={() => {
            formatTransfers();
          }}
        >
          Update last 20 blocks BaseFee
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


export default ERC20Logs;
