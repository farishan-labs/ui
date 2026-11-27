import "/dist/index.js";

const content = document.getElementById("content");

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
  const hash = location.hash || "#/README";
  const key = hash.replace(/^#/, "");
  if (key === "/demo") {
    content.innerHTML =
      '<iframe src="/demo/index.html" style="width:100%;height:80vh;border:0"></iframe>';
    bindDemo();
    updateActiveLink();
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
    addCopyButtons();
    updateActiveLink();
    return;
  }
  const path = routes[key] || "/README.md";
  try {
    const res = await fetch(path);
    const md = await res.text();
    content.innerHTML = marked.parse(md);
    if (window.Prism) window.Prism.highlightAllUnder(content);
    addCopyButtons();
  } catch {
    content.textContent = "Failed to load " + path;
  }
  updateActiveLink();
}

function bindDemo() {}

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
  document.querySelectorAll("#sidebar nav a").forEach((a) => {
    const href = (a.getAttribute("href") || "").replace(/^#/, "");
    a.classList.toggle("active", href === key);
  });
}

// Theme toggle (polished)
const THEME_KEY = "theme";

function storedTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function currentTheme() {
  const value = document.documentElement.getAttribute("data-theme");
  return value === "light" || value === "dark" ? value : systemTheme();
}

function updateToggleLabel() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;
  const dark = currentTheme() === "dark";
  themeToggle.textContent = dark ? "Switch to light" : "Switch to dark";
  themeToggle.setAttribute("aria-pressed", String(dark));
}

const themeToggle = document.getElementById("themeToggle");
themeToggle?.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* ignore */
  }
  updateToggleLabel();
});

const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
colorSchemeQuery.addEventListener("change", (event) => {
  if (storedTheme()) return;
  document.documentElement.setAttribute("data-theme", event.matches ? "dark" : "light");
  updateToggleLabel();
});

updateToggleLabel();

// Search
const searchInput = document.getElementById("search");
searchInput?.addEventListener("input", () => {
  const q = (searchInput.value || "").toLowerCase();
  document.querySelectorAll("#sidebar nav a").forEach((a) => {
    const text = a.textContent.toLowerCase();
    a.style.display = text.includes(q) ? "" : "none";
  });
});

// Drawer (responsive) logic
const menuToggle = document.getElementById("menuToggle");
const backdrop = document.getElementById("backdrop");
const sidebar = document.getElementById("sidebar");

function openDrawer() {
  sidebar?.classList.add("open");
  backdrop?.classList.add("open");
  menuToggle?.setAttribute("aria-expanded", "true");
}
function closeDrawer() {
  sidebar?.classList.remove("open");
  backdrop?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}
menuToggle?.addEventListener("click", () => {
  if (sidebar?.classList.contains("open")) closeDrawer();
  else openDrawer();
});
backdrop?.addEventListener("click", closeDrawer);
document.querySelectorAll("#sidebar nav a").forEach((a) => {
  a.addEventListener("click", () => {
    if (window.innerWidth < 768) closeDrawer();
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

window.addEventListener("hashchange", render);
render();
