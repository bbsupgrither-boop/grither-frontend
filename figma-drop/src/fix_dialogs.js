const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://hui-production.up.railway.app';

function findAdminModal(root) {
  // Поля
  const idInput = root.querySelector('input[type="number"], input[placeholder*="Telegram"], input[placeholder*="ID"], input[name*="telegram"], input[name="id"]');
  const passInput = root.querySelector('input[type="password"], input[placeholder*="код"], input[placeholder*="парол"], input[name*="password"]');

  // Кнопка «Войти»
  const loginBtn = [...root.querySelectorAll('button,[role="button"],input[type="submit"]')]
    .find(el => /(войти\s*в\s*админ|войти|login)/i.test((el.innerText || el.value || '').trim()));

  if (!idInput || !passInput || !loginBtn) return null;

  // Контейнер ошибки (или создадим рядом с кнопкой)
  let errorBox = root.querySelector('[data-admin-error]');
  if (!errorBox && loginBtn && loginBtn.parentElement) {
    errorBox = document.createElement('div');
    errorBox.setAttribute('data-admin-error', '1');
    errorBox.style.cssText = 'color:#ff6b6b;font-size:12px;margin-top:8px;';
    loginBtn.parentElement.appendChild(errorBox);
  }

  return { idInput, passInput, loginBtn, errorBox };
}

function stripHandlers(el) {
  const clone = el.cloneNode(true);
  el.parentNode && el.parentNode.replaceChild(clone, el);
  return clone;
}

async function bindAdminLogin(modalRoot) {
  const found = findAdminModal(modalRoot);
  if (!found) return false;
  let { idInput, passInput, loginBtn, errorBox } = found;
  if (loginBtn.__gritherBound) return true;

  const btn = stripHandlers(loginBtn);

  async function doLogin(e) {
    e?.preventDefault?.(); e?.stopPropagation?.(); e?.stopImmediatePropagation?.();
    if (errorBox) { errorBox.style.color = '#ff6b6b'; errorBox.textContent = ''; }

    const idNum = Number(String(idInput.value || '').trim());
    const pwd   = String(passInput.value || '').trim();
    if (!idNum || !pwd) {
      if (errorBox) errorBox.textContent = 'Введите Telegram ID и пароль';
      return;
    }

    try {
      const rsp = await fetch(${API_BASE}/api/admin/login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tg_user_id: idNum, password: pwd })
      });
      const data = await rsp.json().catch(() => ({}));
      if (!rsp.ok || !data?.ok) {
        if (errorBox) errorBox.textContent = (data?.error === 'bad_credentials')
          ? 'Неверный ID или пароль'
          : 'Ошибка входа';
        return;
      }

      // успех
      localStorage.setItem('grither_admin_token', data.token);
      localStorage.setItem('grither_admin_role',  data.role);

      if (errorBox) { errorBox.style.color = '#0a7c2f'; errorBox.textContent = 'Вход выполнен'; }

      // событие для приложения
      try { window.dispatchEvent(new CustomEvent('grither:admin:login', { detail: { role: data.role } })); } catch {}

      // закрыть модалку: ищем крестик/закрывающую кнопку
      const closeBtn = modalRoot.querySelector('[aria-label="Close"], [data-dialog-close], .close, button:has(svg)');
      try { closeBtn?.click(); } catch {}

      // чтобы настройки увидели, что доступ есть
      setTimeout(() => { try { location.reload(); } catch {} }, 400);
    } catch {
      if (errorBox) errorBox.textContent = 'Сеть недоступна';
    }
  }

  btn.addEventListener('click', doLogin, { capture: true });
  passInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(e); }, { capture: true });
  btn.__gritherBound = true;

  const form = btn.closest('form');
  if (form && !form.__gritherBound) {
    form.addEventListener('submit', (e) => { e.preventDefault(); e.stopPropagation(); doLogin(e); }, { capture: true });
    form.__gritherBound = true;
  }

  return true;
}

// Наблюдатель появления модалок
const obs = new MutationObserver((muts) => {
  for (const m of muts) {
    for (const node of m.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.matches?.('dialog,[role="dialog"],[data-state="open"],.modal,.overlay,.fixed')) {
        bindAdminLogin(node);
      }
      node.querySelectorAll?.('dialog,[role="dialog"],[data-state="open"],.modal,.overlay,.fixed')
        .forEach(el => bindAdminLogin(el));
    }
  }
});
obs.observe(document.documentElement, { childList: true, subtree: true });
