import React, { useState, useEffect, useRef, useContext } from "react";
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from "next/router";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";

export default function Nav() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isOpen, setisOpen] = useState(false);
  const [infodata, setInfo] = useState(null);
  const navRef = useRef(null);
  const { cartQuantity } = useContext(CartContext); // 使用 CartContext
  console.log('總數量',cartQuantity)

  const Data = useAuth().auth
  const userData = (Data && Data.userData) ? Data.userData : '';


  const userId = userData ? userData.id : 0

  
  
  useEffect(() => {
    if (userId) {
        fetch(`http://localhost:3005/api/header/${userId}`)
            .then(response => response.json())
            .then(infodata => setInfo(infodata))
            .catch(error => console.error('Error:', error));
    }
  }, [userId]);



  let userinfo = infodata?.userinfo?.[0].img || [];

  if (typeof userinfo === 'string') {
    userinfo = userinfo.replace(/[\r\n]+/g, '');
  } else {
    userinfo = ''
  }




  const memberLevels = {
    1: '初級會員',
    2: '白銀會員',
    3: '黃金會員',
    4: '白金會員'
  }

  const GoCart = () => {
    router.push("/cart/cartCheckout1"); // 使用 router.push 直接導航到首頁
  };

  const goHome = () => {
    router.push("/");
  }

  const hamburgerHook = () => {
    setisOpen((prevState) => !prevState);

    setTimeout(() => {
      if (navRef.current) {
        navRef.current.classList.toggle("opacity");
      }
    }, 100);
  };

  useEffect(() => {
    const navShop = document.querySelector(".navShop");
    const shop_li = document.getElementById("shop_li");

    let navview = true;
    function remove() {
      if (navview) {
        navShop.classList.remove("opacity");
        setTimeout(() => {
          navShop.classList.remove("display");
        }, 100);
      }
    }
    function add() {
      navShop.classList.add("display");
      setTimeout(() => {
        navShop.classList.add("opacity");
      }, 10);
    }

    shop_li.addEventListener("mouseenter", () => {
      add();
    });
    shop_li.addEventListener("mouseleave", () => {
      setTimeout(() => {
        remove();
      }, 10);
    });
    navShop.addEventListener("mouseenter", () => {
      navview = false;
    });
    navShop.addEventListener("mouseleave", () => {
      navview = true;
      remove();
    });

    for (let i = 0; i <= 2; i++) {
      const col4 = document.querySelectorAll(".navShop .col-4");

      const col4_img = document.querySelectorAll(".navShop .col-4 .img");

      const canvas = document.querySelectorAll(".Header_ProgressCircle");

      const slider = document.querySelectorAll(".progressSlider");

      const navShop_list = document.querySelector(".navShop_list");

      const navarr = document.querySelector(".navarr");

      const ctx = canvas[i].getContext("2d", { antialias: true });

      function drawCircle(percentage) {
        const centerX = canvas[i].width / 2;
        const centerY = canvas[i].height / 2;
        const radius = 40;

        ctx.clearRect(0, 0, canvas[i].width, canvas[i].height);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "#6f5158";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          radius,
          -Math.PI / 2,
          (percentage / 100) * 2 * Math.PI - Math.PI / 2
        );
        ctx.strokeStyle = "#ff6e5b";
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      let circleInterval;

      function startCircle() {
        if (circleInterval) {
          clearInterval(circleInterval);
        }

        circleInterval = setInterval(() => {
          if (slider[i].value < 100) {
            slider[i].value++;
            drawCircle(slider[i].value);
          } else {
            clearInterval(circleInterval);
          }
        }, 15);
      }

      col4[i].addEventListener("mouseenter", function () {
        startCircle();
        col4_img[i].classList.add("active");
      });

      col4[i].addEventListener("mouseleave", function () {
        if (circleInterval) {
          clearInterval(circleInterval);
        }
        slider[i].value = 0;
        drawCircle(slider[i].value);
        col4_img[i].classList.remove("active");
      });

      drawCircle(0);
    }

    const nav_user = document.querySelector(".nav_user");
    const user_area = document.querySelector(".user_area");

    nav_user.addEventListener("mouseenter", (e) => {
      user_area.style.right = "-22px";
      user_area.style.top = "22px";
      user_area.classList.add("active");
    });
    nav_user.addEventListener("mouseleave", (e) => {
      user_area.classList.remove("active");
    });
    user_area.addEventListener("mouseenter", (e) => {
      user_area.classList.add("active");
    });
    user_area.addEventListener("mouseleave", (e) => {
      user_area.classList.remove("active");
    });

    document.addEventListener("click", (e) => {
      if (!user_area.contains(e.target) && !nav_user.contains(e.target)) {
        user_area.classList.remove("active");
      }
    });
  }, []);

  // 登出
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/'); // 登出成功後導航到首頁或登錄頁面
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };


  return (
    <>
      <div className="nav_margin"></div>
      <div className="HeaderCNav">
        <div className="container d-none d-lg-flex">
          <a onClick={goHome} style={{ cursor: 'pointer' }}>
            <img
              className="nav_logo"
              src="/nav-footer/nav_logo.png"
              alt=""
              width={170}
            />
          </a>
          <ul id="nav_ul">
            {/* <a href="" id="shop_li">
              <li>商品列表+</li>
            </a>
            <a href="/article">
              <li>相關文章</li>
            </a>
            <a href="">
              <li>品酒課程</li>
            </a>
            <a href="">
              <li>活動專區</li>
            </a> */}
            <Link href="/product" id="shop_li">
                  <li>商品列表+</li>
            </Link>
           
            <Link href="/article" >
                  <li>相關文章</li>
            </Link>
            <Link href="/course" >
                  <li>品酒課程</li>
            </Link>
            <Link href="/event" >
                  <li>活動專區</li>
            </Link>
           
           
          </ul>
          <div className="HeaderCNavR">
            <div className="NavCSearch">
              <i className="fa-solid fa-magnifying-glass NavCSearchIcon" />
              <input id="nav_search" type="search" placeholder="搜 尋" />
            </div>
            <div className="HeaderCart">
              <button onClick={GoCart}>
                <i className="fa-solid fa-cart-shopping" />
                <div className="dot nonedot">沒有購物車內容</div>
                <div className="dot">{cartQuantity}</div>
              </button>
            </div>
            <div className="nav_user">
              <img src={userData ? `/images/member/avatar/${userinfo}` : '/nav-footer/default_user_pr.jpg'} alt="" />
            </div>
            <div className="user_area">
              <div className="user_area_t">
                {userData && <div className={`userlvis lv${userData.member_level_id}`}>Lv.{userData.member_level_id}</div> }
                {/* <div className={`userlvis lv${userData.member_level_id}`}>Lv.4</div> */}
                <div className="user_area_tl">
                  <img src={userData ? `/images/member/avatar/${userinfo}` : '/nav-footer/default_user.jpg'} alt="" />
                </div>
                <div className="user_area_tr">
                  <p>{userData ? userData.user_name : '訪客'}</p>
                  <p>{userData ? userData.account : '--'}</p>
                </div>
              </div>
              <div className="line" />
              <ul>
                <Link href="/dashboard/profile">
                  <li>個人資料</li>
                </Link>
                <Link href="/dashboard/order">
                  <li>訂單查詢</li>
                </Link>
                <Link href="/dashboard/coupon">
                  <li>優惠券庫</li>
                </Link>
                <Link href="/dashboard/favorite">
                  <li>經典收藏</li>
                </Link>
              </ul>
              <div className="user_area_btn">
                {userData ? <button className="logout" onClick={handleLogout}>登出</button> : <Link href="/dashboard/profile"><button className="login">登入 / 註冊</button></Link>}
              </div>
            </div>
          </div>
        </div>
        <div className="HeaderNavRwd d-flex d-lg-none">
          <div
            role="button"
            tabIndex={0}
            className="hamburger"
            onClick={hamburgerHook}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                console.log("clicked");
              }
            }}
          >
            <div className={`line ${isOpen ? "rotate_l" : ""}`}></div>
            <div className={`line ${isOpen ? "d-none" : ""}`}></div>
            <div className={`line ${isOpen ? "rotate_r" : ""}`}></div>
          </div>
          <img
            className="nav_rwd_logo"
            src="/nav-footer/nav_logo_rwd.png"
            alt=""
            width={100}
          />
            <div className="HeaderCart">
              <button onClick={GoCart}>
                <i className="fa-solid fa-cart-shopping" />
                <div className="dot">{cartQuantity}</div>
              </button>
            </div>
        </div>
      </div>
      <div className="navShop">
        <div className="container">
          <div className="row h-100 nav_row align-items-center">
            <div className="col-4 ">
              <div className="navShopBox">
                <div className="img img1" />
                <div className="navShopBox_b d-flex align-items-center">
                  <img
                    className="navarr"
                    src="/nav-footer/navarr.png"
                    alt=""
                    width={45}
                  />
                  <canvas
                    className="Header_ProgressCircle"
                    width={100}
                    height={100}
                  />
                  <input
                    type="range"
                    className="progressSlider"
                    min={0}
                    max={100}
                    defaultValue={0}
                  />
                  <div className="navShopBox_b_text">
                    <small>RED WINE</small>
                    <div className="fs-5">紅酒</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="navShopBox">
                <div className="img img2" />
                <div className="navShopBox_b d-flex align-items-center">
                  <img src="/nav-footer/navarr.png" alt="" width={45} />
                  <canvas
                    className="Header_ProgressCircle"
                    width={100}
                    height={100}
                  />
                  <input
                    type="range"
                    className="progressSlider"
                    min={0}
                    max={100}
                    defaultValue={0}
                  />
                  <div className="navShopBox_b_text">
                    <small>WHITE WINE</small>
                    <div className="fs-5">白酒</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="navShopBox">
                <div className="img img3" />
                <div className="navShopBox_b d-flex align-items-center">
                  <img src="/nav-footer/navarr.png" alt="" width={45} />
                  <canvas
                    className="Header_ProgressCircle"
                    width={100}
                    height={100}
                  />
                  <input
                    type="range"
                    className="progressSlider"
                    min={0}
                    max={100}
                    defaultValue={0}
                  />
                  <div className="navShopBox_b_text">
                    <small>WINE-OPENER</small>
                    <div className="fs-5">開瓶器具</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="navShop_list"></div>
      <div ref={navRef} className={`nav_rwdArea ${isOpen ? "display" : ""}`}>
        <div className="nav_rwdArea_head">
          <div className="nav_rwdArea_head_t">
            <div className="nrht_l d-flex align-items-center">
              <img className="rounded-circle nrht_lpic" src={userData ? `/images/member/avatar/${userinfo}` : '/nav-footer/default_user.jpg'} alt="" width={60} height={60}/>
              <div className="nrht_l_text ms-3">
                <div>{userData ? userData.user_name : '訪客'}</div>
                <div>{userData ? userData.account : '--'}</div>
              </div>
            </div>
            {userData ? <div className={`nrht_r lv${userData.member_level_id}`}>{memberLevels[userData.member_level_id]}</div> : <div className="nrht_r">尚未登入</div>}
          </div>
          <div className="nav_rwdArea_head_b">
            <div className="nrhb_l">
              <i className="fa-solid fa-circle-dollar-to-slot me-1" />{" "}
              <span className="me-3">78P</span>
              <i className="fa-solid fa-ticket-simple me-1" /> <span>x4</span>
            </div>
            <div className="nrhb_r">
              <a href="">
                會員頁面
                <i className="fa-solid fa-chevron-right" />
              </a>
            </div>
          </div>
        </div>
        <div className="nav_rwdArea_bottom">
          <ul>
            <a href="">
              <li>
                <i className="fa-solid fa-house ihome" />
                首頁
              </li>
            </a>
            <a href="">
              <li>
                <i className="fa-solid fa-bag-shopping me-2" />
                商品列表
              </li>
            </a>
            <a href="">
              <li>
                <i className="fa-solid fa-book me-2" />
                相關文章
              </li>
            </a>
            <a href="">
              <li>
                <i className="fa-solid fa-chalkboard-user icourse" />
                <span>品酒課程</span>
              </li>
            </a>
            <a href="">
              <li>
                <i className="fa-solid fa-square-rss me-2" />
                活動專區
              </li>
            </a>
          </ul>
        </div>
      </div>
      {/* {userData ? <pre>{JSON.stringify(userData, null, 2)}</pre> : 'Loading...'}
      {userinfo ? <pre>{JSON.stringify(userinfo, null, 2)}</pre> : 'Loading...'}
      {userId} */}
    </>
  );
}
