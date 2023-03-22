import React, { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { ethers, BigNumber } from "ethers";
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
    formatTransfers()
  }, []);

  let blocksArrayFromTo_Chart = []
   
  const [startingBlock, setStartingBlock] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [amountPerBlock, setAmountPerBlock] = useState([]);
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
    let aux = []
    if(blocksArrayFromTo_Chart.length===0){
      for(let i=last20Blocks;i<=last20Blocks+20;i++){
        blocksArrayFromTo_Chart.push(i)
        aux.push(i.toLocaleString())
      }
      setBlocksArray(aux);
    }
    return await Logs.json();    
  };


  async function formatTransfers(){
    //1. fetch {result} that has all the transfers that has been maded in the last 20 blocks
    let {result} = await fetchLogs()
    
    let transfersArray = []

    //2. create an object with all the transfers and their amount in decimal and its blockNumbers
    //push this objects to transfersArray 
    for(let i=0;i<result.length;i++){
      let objectTransfer = {}
      const blockNumberDec = BigNumber.from(result[i].blockNumber).toString()
      const amountDec = ethers.utils.formatEther(BigNumber.from(result[i].data).toString())
      objectTransfer[blockNumberDec] = amountDec
      transfersArray.push(objectTransfer);
    }
   
    //3. remove and sum duplicate blocks to have unique amounts transffered per block
    let uniqueTransfersObject = {}
    for(let i=0;i<transfersArray.length;i++){
      const key = Object.keys(transfersArray[i])
      const value = parseFloat(transfersArray[i][key])

      if(uniqueTransfersObject.hasOwnProperty(key)){
        uniqueTransfersObject[key] += value;
      }else{
        uniqueTransfersObject[key] = value;
      }
    }
    
    //4. add to the uniqueTransfersObject the blocks with 0 transactions
    for(let i=0;i<blocksArrayFromTo_Chart.length;i++){
      const currentBlock = (blocksArrayFromTo_Chart[i]).toString()
      
      if(!uniqueTransfersObject.hasOwnProperty(currentBlock)){
        uniqueTransfersObject[currentBlock] = 0;
      }
      
    }

    //5. Update the state array with the amounts per block
    let transferAmountChart = []
    for(const props in uniqueTransfersObject){
      transferAmountChart.push(uniqueTransfersObject[props])
    }
    setAmountPerBlock(transferAmountChart)
  }

  


  //Chart data
  const data = {
    labels: blocksArray,
    datasets: [
      {
        label: "Amount of DAI Transferred per Block",
        data: amountPerBlock,
        backgroundColor: "black",
        borderColor: "black",
        pointBorderColor: "white",
        tension: 0.5,
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
          Update last 20 blocks DAI Transfers
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
