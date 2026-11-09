/* MR AQDAS STORE: account layer (branch signup-login-balance).
 * PLACEHOLDERS (marked in place):
 *   - Google sign-in needs a real Google OAuth client ID (CONFIG.GOOGLE_CLIENT_ID).
 *     Until then the Google button runs a local demo sign-in and says so.
 *   - Email/password is a local stub: no backend, no password check.
 *   - One account per phone needs an SMS verification service. Not set up, not enforced.
 *   - Channel-follow pop-up: there is no real follow check yet. It only shows when
 *     detectChannelFollow() returns true, and that is a stub that returns false.
 *   - Rs 1000 is display only. No money moves and there is no withdrawal.
 */
(function () {
  'use strict';

  var CONFIG = {
    // PLACEHOLDER: real Google OAuth web client ID goes here.
    GOOGLE_CLIENT_ID: 'PLACEHOLDER_GOOGLE_CLIENT_ID',
    START_BALANCE_RS: 1000,
    CHANNEL_URL: 'https://whatsapp.com/channel/0029Vb9FRVV8F2pDezlyrD0q',
    STORE_KEY: 'aq_account_v1'
  };

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // Local stub store (device only). Holds emails and balances, never passwords.
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(CONFIG.STORE_KEY) || 'null');
      if (d && d.users) return d;
    } catch (e) { /* fall through */ }
    return { users: {}, session: null };
  }
  function save(d) {
    try { localStorage.setItem(CONFIG.STORE_KEY, JSON.stringify(d)); } catch (e) { /* private mode */ }
  }
  function currentUser(d) {
    return d.session && d.users[d.session] ? d.users[d.session] : null;
  }

  // PLACEHOLDER: one account per phone. Needs an SMS verification service
  // (not set up). Until then every phone is allowed and nothing is checked.
  function checkOnePerPhone(phone) {
    return { allowed: true, placeholder: true, phone: phone };
  }

  // PLACEHOLDER: cannot detect a real WhatsApp channel follow yet.
  // Returns false unless a test sets window.__AQ_STUB_FOLLOW__ = true.
  function detectChannelFollow() {
    return window.__AQ_STUB_FOLLOW__ === true;
  }

  function googleIsPlaceholder() {
    return /^PLACEHOLDER/.test(CONFIG.GOOGLE_CLIENT_ID);
  }

  // ---- modal ----
  var amBg, amBody, errEl;

  function build() {
    amBg = document.createElement('div');
    amBg.className = 'am';
    amBg.id = 'amBg';
    amBg.setAttribute('role', 'dialog');
    amBg.setAttribute('aria-modal', 'true');
    amBg.setAttribute('aria-labelledby', 'amTitle');
    amBg.innerHTML =
      '<div class="amBox"><button class="amX" id="amX" type="button" aria-label="Close">✕</button>' +
      '<div id="amBody"></div></div>';
    document.body.appendChild(amBg);

    var pop = document.createElement('div');
    pop.className = 'aqPop';
    pop.id = 'aqPop';
    pop.hidden = true;
    pop.innerHTML =
      '<b>WhatsApp channel follow karein</b>' +
      '<p>Naye updates aur offers wahin milenge.</p>' +
      '<div class="amBtns"><a class="pri" id="popGo" href="' + esc(CONFIG.CHANNEL_URL) +
      '" target="_blank" rel="noopener">Channel kholen</a><button id="popX" type="button">Baad mein</button></div>';
    document.body.appendChild(pop);

    amBody = $('amBody');
    $('amX').onclick = closeModal;
    amBg.addEventListener('click', function (e) { if (e.target === amBg) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    $('popX').onclick = function () { $('aqPop').hidden = true; };
    $('popGo').onclick = function () { $('aqPop').hidden = true; };
  }

  function openModal() {
    var d = load();
    render(d);
    amBg.classList.add('open');
  }
  function closeModal() {
    if (amBg) amBg.classList.remove('open');
  }

  function render(d) {
    var u = currentUser(d);
    if (u) { renderAccount(u); }
    else { renderAuth(); }
    updateNav(d);
  }

  function renderAuth() {
    amBody.innerHTML =
      '<h3 id="amTitle">Sign up / Log in</h3>' +
      '<p>Naye user ko <b>Rs 1000 free balance</b> milta hai. Ye sirf dikhane ke liye hai, withdrawal nahi.</p>' +
      '<button class="gbtn" id="gBtn" type="button"><i>G</i> Google se continue karo</button>' +
      (googleIsPlaceholder()
        ? '<p class="amNote">Google client abhi set nahi hua (placeholder). Ye local demo login hai.</p>'
        : '') +
      '<div class="amSep">ya email se</div>' +
      '<input id="aEmail" type="email" placeholder="Email" autocomplete="email">' +
      '<input id="aPass" type="password" placeholder="Password" autocomplete="current-password">' +
      '<div class="amBtns"><button id="bLogin" type="button">Log in</button>' +
      '<button class="pri" id="bSignup" type="button">Sign up</button></div>' +
      '<label class="amLbl" for="aPhone">Phone (ek phone par ek account)</label>' +
      '<input id="aPhone" type="tel" placeholder="+92 3xx xxxxxxx" autocomplete="tel">' +
      '<p class="amNote">PLACEHOLDER: SMS verification service abhi set nahi hai. Phone abhi check nahi hota.</p>' +
      '<p class="amErr" id="aErr"></p>';
    errEl = $('aErr');
    $('gBtn').onclick = googleLogin;
    $('bLogin').onclick = login;
    $('bSignup').onclick = signup;
  }

  function renderAccount(u) {
    amBody.innerHTML =
      '<h3 id="amTitle">Aap ka account</h3>' +
      '<p>' + esc(u.name) + ' · ' + esc(u.provider) + '</p>' +
      '<div class="aqBal">Rs ' + esc(u.balanceRs) + '</div>' +
      '<p>Free balance, sirf dikhane ke liye. Ye asli paise nahi hain, withdrawal nahi hota.</p>' +
      '<div class="amBtns"><button id="bLogout" type="button">Log out</button></div>';
    $('bLogout').onclick = logout;
  }

  function showErr(msg) {
    if (errEl) errEl.textContent = msg;
  }

  function startSession(d, email) {
    d.session = email;
    save(d);
    afterAuth();
  }

  function signup() {
    var email = ($('aEmail').value || '').trim().toLowerCase();
    var pass = $('aPass').value || '';
    var phone = ($('aPhone').value || '').trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return showErr('Email sahi likhein.');
    if (pass.length < 6) return showErr('Password kam se kam 6 characters ka ho.');
    var d = load();
    if (d.users[email]) return showErr('Ye email pehle se hai. Log in karein.');
    var ph = checkOnePerPhone(phone);
    if (!ph.allowed) return showErr(ph.reason || 'Is phone par account hai.');
    d.users[email] = {
      name: email.split('@')[0], email: email, provider: 'email (demo)',
      createdAt: new Date().toISOString(), balanceRs: CONFIG.START_BALANCE_RS
    };
    startSession(d, email);
  }

  function login() {
    var email = ($('aEmail').value || '').trim().toLowerCase();
    if (!email) return showErr('Email likhein.');
    var d = load();
    // Stub: matches the email on this device only. No password check yet.
    if (!d.users[email]) return showErr('Ye email nahi mili. Sign up karein.');
    startSession(d, email);
  }

  function googleLogin() {
    if (!googleIsPlaceholder()) {
      // Real Google sign-in (Google Identity Services with the client ID) is not wired yet.
      return showErr('Google login abhi set nahi hua.');
    }
    // PLACEHOLDER demo sign-in until the Google client ID is set.
    var key = 'google-demo@local';
    var d = load();
    if (!d.users[key]) {
      d.users[key] = {
        name: 'Google demo user', email: key, provider: 'google (demo)',
        createdAt: new Date().toISOString(), balanceRs: CONFIG.START_BALANCE_RS
      };
    }
    startSession(d, key);
  }

  function logout() {
    var d = load();
    d.session = null;
    save(d);
    try { sessionStorage.removeItem('aq_pop_seen'); } catch (e) { /* ignore */ }
    render(d);
  }

  function updateNav(d) {
    var u = currentUser(d);
    var nav = $('navAuth'), hero = $('heroAuth');
    if (u) {
      nav.textContent = 'Rs ' + u.balanceRs;
      nav.classList.add('on');
      hero.textContent = 'Mera account · Rs ' + u.balanceRs;
    } else {
      nav.textContent = 'Sign up / Log in';
      nav.classList.remove('on');
      hero.textContent = 'Sign up / Log in';
    }
  }

  function afterAuth() {
    var d = load();
    render(d);
    maybeChannelPopup();
  }

  function maybeChannelPopup() {
    if (!detectChannelFollow()) return;
    try { if (sessionStorage.getItem('aq_pop_seen')) return; } catch (e) { /* ignore */ }
    try { sessionStorage.setItem('aq_pop_seen', '1'); } catch (e) { /* ignore */ }
    $('aqPop').hidden = false;
  }

  function init() {
    build();
    $('navAuth').onclick = openModal;
    $('heroAuth').onclick = openModal;
    var d = load();
    updateNav(d);
    // Session already on this device: the channel check still runs (stub: never true).
    if (currentUser(d)) maybeChannelPopup();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
