// window.onload = async function () {
//   const button = document.getElementById("updateButton");
//   const resultDiv = document.getElementById("result");

//   // LIFF初期化
//   try {
//     await liff.init({ liffId: "2009569390-ToBfmkCN" });
//   } catch (err) {
//     console.error(err);
//     resultDiv.textContent = "LIFF初期化エラー";
//     return;
//   }

//   // ボタン押下処理
//   button.addEventListener("click", async () => {
//     try {
//       // ログインチェック
//       if (!liff.isLoggedIn()) {
//         // ログイン後、元のページに戻る
//         liff.login();
//         return;
//       }

//       // プロフィール取得
//       const profile = await liff.getProfile();
//       const payload = {
//         userId: profile.userId,
//         name: profile.displayName
//       };

//       // GASにPOST
//       const response = await fetch(
//         "https://script.google.com/macros/s/AKfycbzGPx2dqhDxn4bGv_AgVJv1K1om_SKKzvLpDBwNxIzLTzNci81wVaxSx8MU6Pg9qS7pfA/exec",
//         {
//           method: "POST",
//           contentType: "application/json",
//           body: JSON.stringify(payload)
//         }
//       );

//       if (!response.ok) {
//         throw new Error("GASへのリクエスト失敗: " + response.status);
//       }

//       const data = await response.json();
//       resultDiv.textContent = "合計稼働時間: " + (data.total ?? 0);

//     } catch (err) {
//       console.error(err);
//       resultDiv.textContent = "エラー: " + err.message;
//       alert("エラーが発生しました: " + err.message); // スマホでも確認できるように
//     }
//   });
// };



window.onload = async function () {
  const calendarDiv = document.getElementById("calendar");
  const currentMonthSpan = document.getElementById("currentMonth");
  const updateButton = document.getElementById("updateButton");
  
  let currentDate = new Date(); // 今月を基準に
  let shiftData = {}; // 日付ごとのシフト時間を格納するオブジェクト

  // 💡 ここでは仮データを使います
  shiftData = {
    "2026-03-01": "9:00-17:00",
    "2026-03-02": "10:00-18:00",
    "2026-03-04": "9:30-17:30",
    "2026-03-07": "11:00-19:00",
    // ...必要に応じて追加
  };

  // カレンダー生成関数
  function generateCalendar(date) {
    calendarDiv.innerHTML = ""; // まず空にする
    const year = date.getFullYear();
    const month = date.getMonth(); // 0~11
    currentMonthSpan.textContent = `${year}年 ${month + 1}月`;

    // 月初・月末
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    for (let day = 1; day <= totalDays; day++) {
      const fullDate = new Date(year, month, day);
      const fullDateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

      const dayDiv = document.createElement("div");
      dayDiv.className = "day";

      // 日付表示
      const dateSpan = document.createElement("span");
      dateSpan.className = "date";
      dateSpan.textContent = day;
      dayDiv.appendChild(dateSpan);

      // シフト時間表示（ある場合のみ）
      if (shiftData[fullDateStr]) {
        const shiftSpan = document.createElement("div");
        shiftSpan.className = "shift-time";
        shiftSpan.textContent = shiftData[fullDateStr];
        dayDiv.appendChild(shiftSpan);
      }

      calendarDiv.appendChild(dayDiv);
    }
  }

  // 初期表示
  generateCalendar(currentDate);

  // 更新ボタン（今回はデータ更新用のダミー）
  updateButton.addEventListener("click", () => {
    alert("更新処理を呼び出すところです。GASからのデータ取得後に反映可能");
    // ここで fetch → GAS → Anycross → JSON を取得して shiftData を更新
    // その後 generateCalendar(currentDate) を呼ぶ
  });
};