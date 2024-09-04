import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from 'next/router';
import Image from "next/image";
import Swal from "sweetalert2";

export default function TestArticleComment({ articleId, comments, userId, account }) {
  const router = useRouter();
  console.log(userId)
  console.log(account)
  const [commentText, setCommentText] = useState("");
  const [rows, setRows] = useState(2);
  // 這邊是使用hooks的useAuth測試
  // const { auth } = useAuth();

  // 如果 auth.userData 不存在，提前處理避免錯誤
  if (userId == null) {
    console.log("使用者尚未登入或用戶資料尚未載入");

    // 渲染登入提示和按鈕
    return (
      <div className="text-center mt-2 mb-5">
        <p className="mb-3" style={{letterSpacing:"1.4px", fontSize:"18px"}}>想分享點什麼嗎</p>
        <button
          onClick={() => {
            router.push("/member/login");
          }}
          className="btn btn-primary aLoginButton"
        >
          點擊登入留言
        </button>
      </div>
    );
  }

  // const userId = auth.userData.id; // 取得使用者 ID
  // const account = auth.userData.account;

  // const firstTwoChars = account.slice(0, 2).toUpperCase();

  // 新增
  const handleCreate = async () => {
    if (!commentText.trim()) {
      Swal.fire({
        title: "警告",
        text: "評論內容不能為空白",
        icon: "warning",
        confirmButtonText: "確定"
      });
      return;
    }

    try {
      const entityType = "article";
      const response = await fetch(
        `http://localhost:3005/api/a-comment/${articleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entity_type: entityType,
            user_id: userId,
            comment_text: commentText,
            parent_comment_id: null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
        Swal.fire({
          title: "提交評論失敗",
          text: "錯誤信息：" + errorData.error,
          icon: "error",
          confirmButtonText: "確定"
        });
      } else {
        const responseData = await response.json();
        console.log(
          "Comment submitted successfully with ID:",
          responseData.commentId
        );
        Swal.fire({
          title: "成功",
          text: "評論提交成功",
          icon: "success",
          confirmButtonText: "確定"
        });
        // 清空輸入框或進行其他操作
        setCommentText("");
        // 刷新頁面
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      Swal.fire({
        title: "發生錯誤",
        text: "請聯繫管理員",
        icon: "error",
        confirmButtonText: "確定"
      });
    }
  };

  return (
    <>
      <div className="col-12 mb-4">
        <div className="aid-reply row">
          <div className="col-auto">
            {/* 桌機icon */}
            <div className="au-icon d-none d-lg-flex">
            {/* {console.log(auth.userData.id)} */}
              {/* <p className="m-0">{firstTwoChars}</p> */}
              <Image src={`/images/member/avatar/${userId}.png`} width={100} height={100} />
            </div>
            {/* 手機icon */}
            <div className="au-icon-sm d-lg-none">
              {/* <p className="m-0">{firstTwoChars}</p> */}
              <Image src={`/images/member/avatar/${userId}.png`} width={100} height={100} />
            </div>
          </div>
          <div className="aucomment-section col">
            <div className="aucomment-nav row align-items-center mb-2">
              {/* 使用者 */}
              <div className="au-name col-auto col-lg-auto">
                <h5 className="m-0">{account}</h5>
              </div>
            </div>
            {/* 評論內容 */}
            <div className="aucomment p-4">
              <form>
                <textarea
                  placeholder="在這邊寫點什麼..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={rows}
                  onFocus={() => setRows(4)}
                  className="form-control"
                  id="message-text"
                />
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreate}
                  >
                    送出
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
