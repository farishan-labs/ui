import "/dist/index.js";

const content = document.getElementById("content");

const body = document.body;
const menuToggle = document.getElementById("menuToggle");
const backdrop = document.getElementById("backdrop");
const sidebar = document.getElementById("sidebar");

function openDrawer() {
  body.classList.add("drawer-open");
  menuToggle?.setAttribute("aria-expanded", "true");
}
function closeDrawer() {
  body.classList.remove("drawer-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}
function toggleDrawer() {
  if (body.classList.contains("drawer-open")) closeDrawer();
  else openDrawer();
}

menuToggle?.addEventListener("click", toggleDrawer);
backdrop?.addEventListener("click", closeDrawer);
sidebar?.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", closeDrawer));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

const routes = {
  "/README": "/README.md",
  "/PHILOSOPHY": "/PHILOSOPHY.md",
  "/LAYOUT": "/LAYOUT.md",
  "/BASELINE": "/BASELINE.md",
  "/demo": null,
  "/components": null,
};

const componentShowcase = `
  <h1>Components</h1>
  <p>Live primitives with the default skin applied.</p>

  <h2>Button</h2>
  <ui-button variant="primary" label="Primary"></ui-button>
  <ui-button variant="secondary" label="Secondary"></ui-button>
  <ui-button variant="danger" label="Danger" disabled></ui-button>
  <pre><code>&lt;ui-button variant="primary" label="Save"&gt;&lt;/ui-button&gt;</code></pre>

  <h2>Card</h2>
  <ui-card>
    <span slot="header">Card title</span>
    <p>Card body content.</p>
    <span slot="footer">Footer</span>
  </ui-card>

  <h2>Field</h2>
  <ui-field label="Email" hint="We never share" placeholder="you@example.com"></ui-field>
  <ui-field label="Password" type="password" error="Too short"></ui-field>

  <h2>Accordion</h2>
  <ui-accordion items='[{"value":"a","title":"Section A","content":"Content A."},{"value":"b","title":"Section B","content":"Content B."}]'></ui-accordion>

  <h2>Tabs</h2>
  <ui-tabs items='[{"value":"a","title":"Tab A","content":"Panel A."},{"value":"b","title":"Tab B","content":"Panel B."}]'></ui-tabs>

  <h2>Dialog</h2>
  <ui-dialog label="Confirm" id="dlg"><p>Are you sure?</p></ui-dialog>
  <ui-button label="Open dialog" id="openDlg"></ui-button>

  <h2>Toast</h2>
  <ui-toast message="Saved successfully" variant="success" open></ui-toast>

  <h2>Playground</h2>
  <label>Variant: <select id="pgVariant"><option>primary</option><option>secondary</option><option>danger</option></select></label>
  <label><input type="checkbox" id="pgDisabled" /> disabled</label>
  <div id="pgOut"><ui-button id="pgBtn" variant="primary" label="Playground"></ui-button></div>
`;

async function render() {
  closeDrawer();
  const hash = location.hash || "#/README";
  const key = hash.replace(/^#/, "");
  if (key === "/demo") {
    content.innerHTML =
      '<iframe src="/demo/index.html" style="width:100%;height:80vh;border:0"></iframe>';
    bindDemo();
    return;
  }
  if (key === "/components") {
    content.innerHTML = componentShowcase;
    if (window.Prism) window.Prism.highlightAllUnder(content);
    const btn = content.querySelector("#openDlg");
    btn?.addEventListener("click", () => content.querySelector("#dlg")?.setAttribute("open", ""));
    const v = content.querySelector("#pgVariant");
    const d = content.querySelector("#pgDisabled");
    const b = content.querySelector("#pgBtn");
    v?.addEventListener("change", () => b?.setAttribute("variant", v.value));
    d?.addEventListener("change", () => {
      if (d.checked) b?.setAttribute("disabled", "");
      else b?.removeAttribute("disabled");
    });
    return;
  }
  const path = routes[key] || "/README.md";
  try {
    const res = await fetch(path);
    const md = await res.text();
    content.innerHTML = marked.parse(md);
    if (window.Prism) window.Prism.highlightAllUnder(content);
  } catch (e) {
    content.textContent = "Failed to load " + path;
  }
}

function bindDemo() {}

const themeToggle = document.getElementById("themeToggle");
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("fhl-theme", theme);
  } catch {}
}
const stored = (() => {
  try {
    return localStorage.getItem("fhl-theme");
  } catch {
    return null;
  }
})();
const initial =
  stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
applyTheme(initial);
themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "light" ? "dark" : "light");
});

function addCopyButtons() {
  document.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".copy-btn")) return;
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", () => {
      const code = pre.querySelector("code");
      navigator.clipboard?.writeText(code ? code.textContent : pre.textContent);
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = "Copy"), 1200);
    });
    pre.style.position = "relative";
    pre.appendChild(btn);
  });
}
function updateActiveLink() {
  const key = (location.hash || "#/README").replace(/^#/, "");
  addCopyButtons();
  document.querySelectorAll("#sidebar nav a").forEach((a) => {
    const href = (a.getAttribute("href") || "").replace(/^#/, "");
    a.classList.toggle("active", href === key);
  });
}
const origRender = render;
render = async function () {
  await origRender();
  updateActiveLink();
};

const searchInput = document.getElementById("search");
searchInput?.addEventListener("input", () => {
  const q = (searchInput.value || "").toLowerCase();
  document.querySelectorAll("#sidebar nav a").forEach((a) => {
    const text = a.textContent.toLowerCase();
    a.style.display = text.includes(q) ? "" : "none";
  });
});
window.addEventListener("hashchange", render);
render();
