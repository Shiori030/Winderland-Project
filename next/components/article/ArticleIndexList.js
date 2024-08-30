import React from "react";
import { useState, useEffect } from "react";
import ArticleSidebar from "@/components/article/article-sidebar";
import ArticleIndexCard from "@/components/article/article-index-card";
import ArticleIndexCardSm from "./article-index-card-sm";
import { useRouter } from "next/router";
import Link from "next/link";
import ArticlePagination from "./article-pagination";
import { FaBookmark } from "react-icons/fa";

export default function ArticleIndexList({ Article }) {
  const router = useRouter();
  const { search, category } = router.query;

  const [articles, setArticles] = useState([]);
  const [firstTwoArticles, setFirstTwoArticles] = useState([]);
  const [remainArticles, setRemainArticles] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 新增 totalPages 的 state

  useEffect(() => {
    const apiUrl = new URL("http://localhost:3005/api/article");

    if (search) {
      apiUrl.searchParams.append("search", search);
    }

    if (category) {
      apiUrl.searchParams.append("category", category);
    }

    if (dateFilter) {
      apiUrl.searchParams.append("dateFilter", dateFilter);
    }

    if (startDate && endDate) {
      apiUrl.searchParams.append("startDate", startDate);
      apiUrl.searchParams.append("endDate", endDate);
    }
    apiUrl.searchParams.append("page", currentPage);
    apiUrl.searchParams.append("limit", 8); // 每頁顯示6筆

    // 當組件掛載時執行 fetch 請求
    console.log(apiUrl.toString()); // 檢查 URL 是否正確
    fetch(apiUrl.toString())
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        // 處理 articles 資料，將 images 字段轉換為數組
        // console.log(data.articles)
        // console.log(data.totalPages)
        const processedArticles = data.articles.map((article) => ({
          ...article,
          images: article.images ? article.images.split(",") : [],
        }));
        console.log(processedArticles)
        setArticles(processedArticles);
        setFirstTwoArticles(processedArticles.slice(0, 2));
        setRemainArticles(processedArticles.slice(2));
        setTotalPages(data.totalPages); // 設置 totalPages
      })
      .catch((error) => {
        console.log(error);
      });
  }, [search, category, dateFilter, startDate, endDate, currentPage]);


  // 取得背景圖片的路徑
  const backgroundImage =
    Article?.images.length > 0
      ? `url(/images/article/${Article.images[0]})`
      : `url(/images/article/titlePic.jpeg)`;

  // 導向某篇文章
  const handleLink = () => {
    if (Article.id) {
      router.push(`/article/${Article.id}`);
    }
  };

  // 類別
  const handleCategoryChange = (newCategory) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, category: newCategory },
    });
  };

  // 日期radio篩選用
  const handleDateFilterChange = (e) => {
    router.push({
      pathname: router.pathname,
      query: {},
    });
    setDateFilter(e.target.value);
    setSelectedDate(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    setDateFilter(e.target.value);

  };

  // 輸入日期篩選用
  const handleStartDateChange = (value) => {
    setStartDate(value);
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
  };

  // 清空篩選用
  const handleResetFilters = () => {
    router.push({
      pathname: router.pathname,
      query: {},
    });

    // 清空日期篩選狀態
    setSelectedDate("全部");
    setStartDate("");
    setEndDate("");
    setDateFilter("");
  };

  return (
    <>
      {/* 側邊欄 */}
      <div className="d-none d-lg-block a-sidebar col-2 p-0">
        <ArticleSidebar
          onDateFilterChange={handleDateFilterChange}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          selectedDate={selectedDate}
          onCategoryChange={handleCategoryChange}
        />
        {/* 篩選按鈕 */}
        <button className="btn a-btn-select mt-3" onClick={handleFilterSubmit}>
          日期篩選
        </button>
        <button className="btn a-btn-clear mt-4" onClick={handleResetFilters}>
          清空篩選
        </button>
      </div>

      {/* 文章一格格 */}
      <div className="a-content col-lg-9 row g-3">
        {/* 文章頭條 */}
        <div className="col-9 col-lg-8">
          <div
            className="a-title d-none d-lg-flex"
            style={{ backgroundImage: backgroundImage }}
            onClick={handleLink}
          >
            <h3>{Article ? Article.title : "..."}</h3>
          </div>
          {/* 手機頭條 */}
          <div
            className="a-title d-lg-none"
            style={{ backgroundImage: backgroundImage, height:"200px", padding:"20px" }}
            onClick={handleLink}
          >
            <h3 style={{fontSize:"18px"}}>{Article ? Article.title : "..."}</h3>
          </div>
        </div>
        {/* 收藏 */}
        <div className="col-3 col-lg-4">
          <Link className="aLink d-none d-lg-block" href="/dashboard/favorite">
            <div className="a-collection p-2">
              <h3>
                <i className="fa-solid fa-bookmark" /> 我的收藏
              </h3>
            </div>
          </Link>
          {/* 手機收藏 */}
          <Link className="aLink d-lg-none" href="/dashboard/favorite">
            <div className="a-collection p-2" style={{height:"200px"}}>
              <FaBookmark className="mb-2" style={{fontSize:"18px", color:"var(--light)"}}/>
              <h3 className="" style={{fontSize:"18px", writingMode: "vertical-rl"}}>收藏庫</h3>
            </div>
          </Link>
        </div>

        {/* 根據 search 或 category 的情況來顯示文章列表 */}
        {search || category || dateFilter ? (
          articles.length > 0 ? (
            articles.map((article) => (
              <ArticleIndexCard key={article.id} article={article} />
            ))
          ) : (
            <h3 className="text-center" style={{ color: "var(--text_gray)" }}>
              沒有搜尋到可顯示的文章
            </h3>
          )
        ) : (
          <>
            {firstTwoArticles.length > 0 ? (
              firstTwoArticles.map((article) => (
                <ArticleIndexCard key={article.id} article={article} />
              ))
            ) : (
              <h3 className="text-center">沒有可顯示的文章</h3>
            )}

            {/* 文章區塊小 */}
            {remainArticles.length > 0 &&
              remainArticles.map((article) => (
                <ArticleIndexCardSm key={article.id} article={article} />
              ))}
          </>
        )}
      </div>
      {/* 選頁 */}
      {/* {console.log(totalPages)} */}
      <div aria-label="Page navigation">
        <ArticlePagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
