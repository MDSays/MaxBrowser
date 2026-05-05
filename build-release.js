<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Настройки · Макс Браузер</title>
  <link rel="stylesheet" href="internal.css" />
  <style>
    .cert-form {
      margin-top: 4px;
      padding: 14px;
      background: var(--bg-3);
      border: 1px solid var(--border);
      border-radius: 6px;
    }
    .cert-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
    .cert-help  { color: var(--fg-dim); font-size: 12px; line-height: 1.5; margin-bottom: 10px; }
    .cert-row {
      display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
    }
    .cert-row input {
      flex: 1; min-width: 220px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      letter-spacing: 0.5px;
    }
    .cert-status { margin-top: 10px; font-size: 12.5px; min-height: 16px; }
    .cert-status.ok  { color: var(--ok); }
    .cert-status.bad { color: var(--danger); }
  </style>
</head>
<body>
  <div class="container">
    <div class="page-header">
      <div>
        <h1>Настройки</h1>
        <div class="subtitle">Конфигурация Макс Браузера</div>
      </div>
    </div>

    <div class="card">
      <h2>Основное</h2>
      <div class="row">
        <div class="label">
          <div class="t">Стартовая страница</div>
          <div class="h">Откроется при запуске и при нажатии кнопки «Домой».</div>
        </div>
        <input type="text" id="homepage" style="min-width: 280px" />
      </div>
      <div class="row">
        <div class="label">
          <div class="t">Поисковая система</div>
          <div class="h">Запросы из адресной строки отправляются в Яндекс — отечественный поиск с релевантной выдачей на русском языке.</div>
        </div>
        <select id="searchEngine" disabled aria-disabled="true">
          <option value="yandex">Яндекс</option>
        </select>
      </div>
      <div class="row">
        <div class="label">
          <div class="t">Показывать панель закладок</div>
        </div>
        <label class="switch">
          <input type="checkbox" id="showBookmarksBar" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div class="card">
      <h2>Контур безопасности SafeNet&nbsp;Periphery</h2>
      <div class="row">
        <div class="label">
          <div class="t">Доверенный цифровой контур</div>
          <div class="h">Интеллектуальный контур доверия удерживает работу в проверенной цифровой среде. При попытке выйти за периметр браузер показывает прозрачный диалог подтверждения. Отключение контура — только при наличии ключа сертификации.</div>
        </div>
        <label class="switch">
          <input type="checkbox" id="whitelistEnabled" />
          <span class="slider"></span>
        </label>
      </div>

      <div id="cert-form" class="cert-form" hidden>
        <div class="cert-title">Введите ключ сертификации</div>
        <div class="cert-help">Ключ выдаётся уполномоченным органом и подтверждает право на расширение контура доверия за пределы доверенной среды.</div>
        <div class="cert-row">
          <input type="password" id="cert-key" autocomplete="off" spellcheck="false" placeholder="Ключ сертификации" />
          <button class="btn btn-primary" id="cert-submit">Подтвердить</button>
          <button class="btn"             id="cert-cancel">Отмена</button>
        </div>
        <div id="cert-status" class="cert-status"></div>
      </div>

      <div class="section-divider">Доверенные исключения (домены)</div>
      <p class="help" style="margin-top: -4px; margin-bottom: 8px;">
        Перечисленные домены включаются в доверенный контур и открываются без дополнительного подтверждения.
        Один домен в строке. Поддомены добавляются автоматически.
      </p>
      <textarea id="domains" placeholder="Например:&#10;example.org&#10;*.intranet"></textarea>

      <div class="section-divider">Разрешённые IP</div>
      <textarea id="ips" placeholder="Например:&#10;127.0.0.1&#10;192.168.1.10"></textarea>

      <div class="toolbar" style="margin-top: 14px;">
        <button class="btn btn-primary" id="btn-save-wl">Сохранить</button>
        <span class="spacer"></span>
        <span id="wl-status" class="badge"></span>
      </div>
    </div>

    <div class="card">
      <h2>Очистка данных</h2>
      <div class="row">
        <div class="label"><div class="t">Кэш</div><div class="h">Сохранённые ресурсы страниц.</div></div>
        <label class="switch"><input type="checkbox" id="clr-cache" checked><span class="slider"></span></label>
      </div>
      <div class="row">
        <div class="label"><div class="t">Куки</div><div class="h">Файлы cookie всех сайтов.</div></div>
        <label class="switch"><input type="checkbox" id="clr-cookies"><span class="slider"></span></label>
      </div>
      <div class="row">
        <div class="label"><div class="t">Локальное хранилище</div><div class="h">localStorage, IndexedDB, ServiceWorkers и т.п.</div></div>
        <label class="switch"><input type="checkbox" id="clr-local"><span class="slider"></span></label>
      </div>
      <div class="row">
        <div class="label"><div class="t">История посещений</div></div>
        <label class="switch"><input type="checkbox" id="clr-history"><span class="slider"></span></label>
      </div>
      <div class="toolbar" style="margin-top: 12px;">
        <button class="btn btn-danger" id="btn-clear">Очистить выбранное</button>
        <span class="spacer"></span>
        <span id="clr-status" class="badge"></span>
      </div>
    </div>
  </div>

<script>
const $ = (id) => document.getElementById(id);

async function load() {
  const s = await window.maxAPI.settings.get();
  $('homepage').value         = s.homepage || 'max://start';
  $('searchEngine').value     = 'yandex';
  $('showBookmarksBar').checked = !!s.showBookmarksBar;
  $('whitelistEnabled').checked = s.whitelistEnabled !== false;

  const wl = await window.maxAPI.whitelist.get();
  $('domains').value = (wl.domains || []).join('\n');
  $('ips').value     = (wl.ips     || []).join('\n');
}

async function patch(field, value) {
  await window.maxAPI.settings.update({ [field]: value });
}

$('homepage').addEventListener('change',         () => patch('homepage', $('homepage').value.trim() || 'max://start'));
$('showBookmarksBar').addEventListener('change', () => patch('showBookmarksBar', $('showBookmarksBar').checked));

// Тумблер фильтрации:
//  - включить — без ключа (всегда доступно)
//  - выключить — только при наличии правильного ключа сертификации
const wlSwitch = $('whitelistEnabled');
const certForm = $('cert-form');
const certKey  = $('cert-key');
const certBtn  = $('cert-submit');
const certCnl  = $('cert-cancel');
const certSt   = $('cert-status');

function setCertStatus(msg, kind) {
  certSt.textContent = msg || '';
  certSt.className = 'cert-status' + (kind ? ' ' + kind : '');
}
function showCertForm(show) {
  certForm.hidden = !show;
  if (show) { setCertStatus(''); certKey.value = ''; setTimeout(() => certKey.focus(), 0); }
}

wlSwitch.addEventListener('change', async () => {
  if (wlSwitch.checked) {
    // Включаем сразу
    showCertForm(false);
    await window.maxAPI.app.enableFilter();
  } else {
    // Откатим тумблер обратно — он опустится только после успешной проверки ключа
    wlSwitch.checked = true;
    showCertForm(true);
  }
});

certCnl.addEventListener('click', () => {
  showCertForm(false);
  wlSwitch.checked = true;
});

async function submitCert() {
  const key = certKey.value.trim();
  if (!key) { setCertStatus('Введите ключ.', 'bad'); return; }
  setCertStatus('Проверка...', '');
  certBtn.disabled = true;
  try {
    const res = await window.maxAPI.app.disableFilter(key);
    if (res && res.ok) {
      wlSwitch.checked = false;
      setCertStatus('Ключ принят. Контур SafeNet расширен на весь интернет.', 'ok');
      setTimeout(() => showCertForm(false), 1200);
    } else {
      setCertStatus('Неверный ключ сертификации.', 'bad');
    }
  } finally {
    certBtn.disabled = false;
  }
}
certBtn.addEventListener('click', submitCert);
certKey.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submitCert(); } });

$('btn-save-wl').addEventListener('click', async () => {
  const domains = $('domains').value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const ips     = $('ips').value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const ok = await window.maxAPI.whitelist.save({ domains, ips });
  const st = $('wl-status');
  st.className = 'badge ' + (ok ? 'ok' : 'bad');
  st.textContent = ok ? 'Сохранено' : 'Ошибка';
  setTimeout(() => { st.textContent = ''; st.className = 'badge'; }, 1800);
});

$('btn-clear').addEventListener('click', async () => {
  const opts = {
    cache:   $('clr-cache').checked,
    cookies: $('clr-cookies').checked,
    local:   $('clr-local').checked,
    history: $('clr-history').checked
  };
  await window.maxAPI.app.clearData(opts);
  const st = $('clr-status');
  st.className = 'badge ok'; st.textContent = 'Очищено';
  setTimeout(() => { st.textContent = ''; st.className = 'badge'; }, 1800);
});

load();
</script>
</body>
</html>
