:root {
  --bg: #0e0e12;
  --bg-2: #15151c;
  --bg-3: #1d1d27;
  --bg-4: #262635;
  --fg: #e6e6ef;
  --fg-dim: #9a9ab0;
  --fg-mute: #6a6a82;
  --accent: #6c8cff;
  --accent-2: #8a6cff;
  --danger: #ff5d6c;
  --ok: #5dd39e;
  --warn: #ffb84d;
  --border: #2a2a38;
}

* { box-sizing: border-box; }

html, body {
  margin: 0; padding: 0;
  min-height: 100%;
  background: var(--bg);
  color: var(--fg);
  font-family: -apple-system, "Segoe UI", Roboto, Inter, system-ui, sans-serif;
  font-size: 14px;
}

/* ----- Кастомный тёмный скроллбар ----- */
* { scrollbar-color: #2f2f3f var(--bg); scrollbar-width: thin; }
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb {
  background: #2f2f3f;
  border: 2px solid var(--bg);
  border-radius: 8px;
}
*::-webkit-scrollbar-thumb:hover { background: #3f3f55; }
*::-webkit-scrollbar-corner { background: transparent; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

.container {
  max-width: 880px;
  margin: 0 auto;
  padding: 36px 24px 80px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.subtitle { color: var(--fg-dim); font-size: 13px; margin-top: 4px; }

.card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 12px;
}
.card h2 {
  margin: 0 0 14px;
  font-size: 16px;
  letter-spacing: 0.3px;
}
.card .help {
  color: var(--fg-dim);
  font-size: 12.5px;
  margin-top: 10px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.row:last-child { border-bottom: none; }
.row .label { flex: 1; }
.row .label .t { font-weight: 500; }
.row .label .h { color: var(--fg-dim); font-size: 12px; margin-top: 2px; }

input[type=text], input[type=url], input[type=password], select, textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--fg);
  font-family: inherit;
  font-size: 13px;
  padding: 8px 10px;
  border-radius: 6px;
  outline: none;
}
input[type=text]:focus, input[type=url]:focus, input[type=password]:focus, select:focus, textarea:focus {
  border-color: var(--accent);
}
textarea { width: 100%; min-height: 140px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

button.btn {
  background: var(--bg-3);
  border: 1px solid var(--border);
  color: var(--fg);
  font-family: inherit;
  font-size: 13px;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
button.btn:hover { background: var(--bg-4); }
button.btn-primary { background: var(--accent); border-color: var(--accent); color: #fff; }
button.btn-primary:hover { filter: brightness(1.05); }
button.btn-danger { background: transparent; color: var(--danger); border-color: rgba(255,93,108,0.4); }
button.btn-danger:hover { background: rgba(255,93,108,0.10); }

.switch { position: relative; width: 38px; height: 22px; flex: 0 0 38px; }
.switch input { opacity: 0; width: 0; height: 0; }
.switch .slider {
  position: absolute; inset: 0;
  background: var(--bg-4);
  border-radius: 22px;
  transition: background 0.2s;
  cursor: pointer;
}
.switch .slider::before {
  content: ''; position: absolute;
  width: 16px; height: 16px;
  left: 3px; top: 3px;
  background: #fff; border-radius: 50%;
  transition: transform 0.2s;
}
.switch input:checked + .slider { background: var(--accent); }
.switch input:checked + .slider::before { transform: translateX(16px); }

.list {
  display: flex; flex-direction: column;
  gap: 1px;
}
.list-item {
  display: flex; align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 6px;
}
.list-item .favicon { width: 16px; height: 16px; object-fit: contain; flex: 0 0 16px; }
.list-item .info { flex: 1; min-width: 0; }
.list-item .title { font-size: 13px; color: var(--fg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.list-item .url   { font-size: 12px; color: var(--fg-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.list-item .meta  { color: var(--fg-mute); font-size: 12px; }
.list-item .actions { display: flex; gap: 6px; }
.iconbtn {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: none;
  color: var(--fg-dim); cursor: pointer;
  border-radius: 6px;
}
.iconbtn:hover { background: var(--bg-4); color: var(--fg); }

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: var(--fg-dim);
}

.search {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--fg);
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  margin-bottom: 12px;
}
.search:focus { border-color: var(--accent); }

.section-divider { color: var(--fg-mute); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 18px 4px 8px; }

.progress-thin {
  height: 3px; background: var(--bg-4); overflow: hidden;
  margin-top: 6px; width: 200px;
}
.progress-thin > div {
  height: 100%; background: var(--accent);
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  background: var(--bg-4);
  color: var(--fg-dim);
}
.badge.ok { background: rgba(93,211,158,0.15); color: var(--ok); }
.badge.bad { background: rgba(255,93,108,0.15); color: var(--danger); }
.badge.warn { background: rgba(255,184,77,0.15); color: var(--warn); }

.toolbar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.spacer { flex: 1; }
