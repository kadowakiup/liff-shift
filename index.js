window.onload = async function () {
  const button = document.getElementById("updateButton");
  const resultDiv = document.getElementById("result");

  // LIFF初期化
  try {
    await liff.init({ liffId: "2009569390-ToBfmkCN" });
  } catch (err) {
    console.error(err);
    resultDiv.textContent = "LIFF初期化エラー";
    return;
  }

  // ボタン押下処理
  button.addEventListener("click", async () => {
    try {
      // ログインチェック
      if (!liff.isLoggedIn()) {
        // ログイン後、元のページに戻る
        liff.login();
        return;
      }

      // プロフィール取得
      const profile = await liff.getProfile();
      const payload = {
        userId: profile.userId,
        name: profile.displayName
      };

      // GASにPOST
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzGPx2dqhDxn4bGv_AgVJv1K1om_SKKzvLpDBwNxIzLTzNci81wVaxSx8MU6Pg9qS7pfA/exec",
        {
          method: "POST",
          contentType: "application/json",
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error("GASへのリクエスト失敗: " + response.status);
      }

      const data = await response.json();
      resultDiv.textContent = "合計稼働時間: " + (data.total ?? 0);

    } catch (err) {
      console.error(err);
      resultDiv.textContent = "エラー: " + err.message;
      alert("エラーが発生しました: " + err.message); // スマホでも確認できるように
    }
  });
};