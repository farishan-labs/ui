const content = document.getElementById("content");

const routes = {
  "/README": "/README.md",
  "/PHILOSOPHY": "/PHILOSOPHY.md",
  "/LAYOUT": "/LAYOUT.md",
  "/BASELINE": "/BASELINE.md",
  "/demo": null,
};

async function render() {
  const hash = location.hash || "#/README";
  const key = hash.replace(/^#/, "");
  if (key === "/demo") {
    content.innerHTML = '<iframe src="/demo/index.html" style="width:100%;height:80vh;border:0"></iframe>';
    return;
  }
  const path = routes[key] || "/README.md";
  try {
    const res = await fetch(path);
    const md = await res.text();
    content.innerHTML = marked.parse(md);
  } catch (e) {
    content.textContent = "Failed to load " + path;
  }
}

window.addEventListener("hashchange", render);
render();
