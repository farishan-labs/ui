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
`;

async function render() {
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

window.addEventListener("hashchange", render);
render();
