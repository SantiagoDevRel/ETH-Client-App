import React, { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";
import styles from "./ERC20Logs.module.css";
const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/`;
const ALCHEMY_KEY = `uk3L_f3i_POcVTRhWxKrYlUm__ftnzfm`;

const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const TransferSignature =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const ApproveSignature =
  "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";

function ERC20Logs() {
  useEffect(() => {
    formatLogs(`${ApproveSignature}`);
    formatLogs(`${TransferSignature}`);
  }, []);
  const [transactionsArray, setTransactionsArray] = useState([]);
  const [approvalsArray, setApprovalsArray] = useState([]);
  const [startingBlock, setStartingBlock] = useState(null);
  const [currentBlock, setCurrentBlock] = useState(null);

  const settings = {
    apiKey: `${ALCHEMY_KEY}`,
    network: Network.ETH_MAINNET,
  };

  const alchemy = new Alchemy(settings);

  async function getLast10Block() {
    const latestBlock = await alchemy.core.getBlockNumber();
    setCurrentBlock(latestBlock.toLocaleString());
    setStartingBlock((latestBlock - 10).toLocaleString());
    return latestBlock - 10;
  }

  const fetchLogs = async (logSignature) => {
    //get last 10 blocks
    const last10Block = await getLast10Block();
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
            fromBlock: `${ethers.utils.hexlify(last10Block)}`,
            address: DAIAddress,
            topics: [`${logSignature}`],
          },
        ],
      }),
    });
    return await Logs.json();
  };

  const formatLogs = async (typeOfLog) => {
    const auxArr = [];
    const logsState = await fetchLogs(typeOfLog);
    const result = logsState.result;
    if (typeOfLog === `${TransferSignature}`) {
      //format events Transfer()
      for (let i = 0; i < result.length; i++) {
        const _txHash = `https://etherscan.io/tx/${result[i]["transactionHash"]}`;
        const _from = ethers.utils.hexStripZeros(result[i]["topics"][1]);
        const _to = ethers.utils.hexStripZeros(result[i]["topics"][2]);
        const tx = { id: i, txHash: _txHash, from: _from, to: _to };
        //console.log("TRANSACTIONS", i, tx);
        //update state
        if (auxArr.length === 5) {
          auxArr.shift();
          auxArr.push(tx);
        } else {
          auxArr.push(tx);
        }
      }
      setTransactionsArray(auxArr);
    } else {
      //format events Approval()
      for (let i = 0; i < result.length; i++) {
        const _txHash = `https://etherscan.io/tx/${result[i]["transactionHash"]}`;
        const _from = ethers.utils.hexStripZeros(result[i]["topics"][1]);
        const _to = ethers.utils.hexStripZeros(result[i]["topics"][2]);
        const tx = { id: i, txHash: _txHash, from: _from, to: _to };
        //update state
        if (auxArr.length === 5) {
          auxArr.shift();
          auxArr.push(tx);
        } else {
          auxArr.push(tx);
        }
      }
      setApprovalsArray(auxArr);
    }
  };

  return (
    <>
      <div className={styles.containerButtons}>
        <button
          className={styles.button}
          onClick={() => formatLogs(`${TransferSignature}`)}
        >
          Update Transfer Logs
        </button>
        <div className={styles.title}>
          From the block #{startingBlock} <br></br> to the block #{currentBlock}
        </div>
        <button
          className={styles.button}
          onClick={() => formatLogs(`${ApproveSignature}`)}
        >
          Update Approval Logs
        </button>
      </div>
      <div className={styles.containerTxs}>
        {transactionsArray.length >= 1 ? (
          <ol className={styles.logs}>
            {transactionsArray.map((tx) => (
              <li className={styles.everyLog} key={tx.id}>
                <div>From: {tx.from}</div>
                <div>To: {tx.to}</div>
                <div>
                  <a
                    className={styles.a}
                    href={tx.txHash}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View in Etherscan{" "}
                    <img
                      className={styles.img}
                      alt="Etherscan Logo"
                      src="https://etherscan.io/images/brandassets/etherscan-logo-circle-light.svg"
                    />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className={styles.zero}>0 Transfers in the past 10 blocks.</div>
        )}
        {approvalsArray.length >= 1 ? (
          <ol className={styles.logs}>
            {approvalsArray.map((tx) => (
              <li className={styles.everyLog} key={tx.id}>
                <div>Approval From: {tx.from}</div>
                <div>Spender: {tx.to}</div>
                <div>
                  <a
                    className={styles.a}
                    href={tx.txHash}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View in Etherscan{" "}
                    <img
                      className={styles.img}
                      alt="Etherscan Logo"
                      src="https://etherscan.io/images/brandassets/etherscan-logo-circle-light.svg"
                    />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className={styles.zero}>0 Approvals in the past 10 blocks.</div>
        )}
      </div>
    </>
  );
}

export default ERC20Logs;
