document.addEventListener("DOMContentLoaded", function () {
  const pdfList = document.getElementById("pdf-list");
  const pdfFrame = document.getElementById("pdf-frame");
  let currentLi = null;

  // 为每个列表项添加点击事件
  pdfList.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      const pdfPath = e.target.getAttribute("data-pdf");

      // 更新 iframe
      pdfFrame.src = pdfPath;

      // 更新 active 样式
      if (currentLi) {
        currentLi.classList.remove("active");
      }
      e.target.classList.add("active");
      currentLi = e.target;
    }
  });

  // 默认加载第一个 PDF
  const firstItem = pdfList.querySelector("li");
  if (firstItem) {
    firstItem.click();
  }
});