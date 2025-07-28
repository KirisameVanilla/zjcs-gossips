// script.js
function goToPDF() {
  const select = document.getElementById("chapter2703");
  const url = select.value;

  if (!url) {
    alert("请先选择一个章节！");
    return;
  }

  window.location.href = url;
}