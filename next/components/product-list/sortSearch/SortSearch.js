import React, { useState } from "react";
import styles from "./SortSearch.module.css";
import MobileFliterAside from "../aside/MobileFliterAside";

export default function SortSearch({currentSort,changeSort}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* top的排序+搜尋欄 */}
      <div className={`row ${styles["shop-fliterSearch"]}`}>
        <div className="col-7" />
        {/* top的排序欄 */}
        <div className={`col-2 ${styles["shop-fliter"]}`}>
            <select value={currentSort} onChange={
              (e) => {changeSort(e.target.value)}
            }>
              <option value={"id_asc"}>默認排序</option>
              <option value={"name_asc"}>商品名稱 A-Z</option>
              <option value={"name_desc"}>商品名稱 Z-A</option>
              <option value={"price_asc"}>商品金額 0-9</option>
              <option value={"price_desc"}>商品金額 9-0</option>
            </select>
        </div>
        {/* top的search欄 */}
        <div className={`col-3 ${styles["shop-search"]}`}>
          <form action="" method="">
            <input type="search" className="" placeholder="搜尋關鍵字" />
            <button>
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </form>
        </div>
      </div>
      {/* 手機搜尋+篩選 */}
      <div className={`row ${styles["shop-fliterSearch-m"]}`}>
        <div className={`col-md-11 col-10 ${styles["shop-search-m"]}`}>
          <form action="" method="">
            <input type="search" className="" placeholder="搜尋關鍵字" />
            <i
              className={`fa-solid fa-magnifying-glass ${styles["search-icon"]}`}
            />
          </form>
        </div>
        <div
          className={`col-md-1 col-2 ${styles["shop-fliter-m"]} ${styles["aside-open-button"]}`}
        >
          <button className={`${styles["fliter-icon"]}`} onClick={handleOpen}>
            <img src="/shop_images/fliter-icon.svg" alt="" />
          </button>
        </div>
      </div>
      {/* 手機排序 */}
      <div className={`${styles["shop-port"]}`}>
        <div className={`${styles["port-top"]}`}>綜合排名</div>
        <div className={`${styles["port-hr"]}`}>|</div>
        <div className={`${styles["port-new"]}`}>最新</div>
        <div className={`${styles["port-hr"]}`}>|</div>
        <div className={`${styles["port-sales"]}`}>銷量</div>
        <div className={`${styles["port-hr"]}`}>|</div>
        <div className={`${styles["port-price"]}`}>價格</div>
      </div>
      <MobileFliterAside isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
