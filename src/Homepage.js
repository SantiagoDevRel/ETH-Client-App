import React from "react";
import styles from "./Homepage.module.css";

function Homepage() {
  return (
    <>
      <div className={styles.title}>
        <h1>Welcome to the Ethereum Monitor</h1>
        <p>
          This app monitors various metrics on the Ethereum network, including
          the logs of an ERC20 token address, the BASEFEE of each block, and the
          ratio of gasUsed over gasLimit.
        </p>
      </div>
      <div className={styles.container}>
        <div className={styles.chart}>
          <h2>DAI Token Logs</h2>
          <p>
          This chart monitors the total amount transferred of DAI ERC20 token per block in the ETH Mainnet

          </p>
        </div>
        <div className={styles.chart}>
          <h2>EIP1559</h2>
          <p>
            This chart monitors the "BaseFee" of each block in Gwei, and shows the total percentage of gas used per block
          </p>
        </div>
      </div>
    </>
  );
}

export default Homepage;
