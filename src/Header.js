import React, { useState } from "react";
import ERC20Logs from "./ERC20Logs";
import Homepage from "./Homepage";
import styles from "./Header.module.css";
import { ReactComponent as Logo } from "./Images/ethereum-1.svg";
import Eip1559 from "./EIP1559";

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
          <Eip1559/>
        </div>
      )}
    </div>
  );
}

export default Header;
