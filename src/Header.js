import React, { useState } from "react";
import ERC20Logs from "./ERC20Logs";
import Homepage from "./Homepage";
import styles from "./Header.module.css";
import { ReactComponent as Logo } from "./Images/ethereum-1.svg";
import BaseFee from "./BaseFee";
import Ratio from "./Ratio";

function Header() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className={styles.header}>
      <div className={styles.tab_menu}>
        <div>
          <Logo />
        </div>
        <button className={styles.button} onClick={() => setActiveTab("tab1")}>
          <span className={styles.span}>Homepage</span>
        </button>
        <button className={styles.button} onClick={() => setActiveTab("tab2")}>
          <span className={styles.span}>DAI Logs</span>
        </button>
        <button className={styles.button} onClick={() => setActiveTab("tab3")}>
          <span className={styles.span}>EIP1559</span>
        </button>
        <button className={styles.button} onClick={() => setActiveTab("tab4")}>
          <span className={styles.span}>Ratio Gas</span>
        </button>
        <div>
          <Logo />
        </div>
      </div>
      {activeTab === "tab1" && (
        <div>
          <Homepage />
        </div>
      )}
      {activeTab === "tab2" && (
        <div>
          <ERC20Logs />
        </div>
      )}
      {activeTab === "tab3" && (
        <div>
          <BaseFee />
        </div>
      )}
      {activeTab === "tab4" && (
        <div>
          <Ratio />
        </div>
      )}
    </div>
  );
}

export default Header;
