/* ─── Login Screen Logic ─── */
let _lsRole = '';

function lsTab(t) {
  document.getElementById('lf-in').style.display  = t === 'in' ? 'block' : 'none';
  document.getElementById('lf-up').style.display  = t === 'up' ? 'block' : 'none';
  document.getElementById('lt-in').className = 'lf-tab' + (t==='in' ? ' act' : '');
  document.getElementById('lt-up').className = 'lf-tab' + (t==='up' ? ' act' : '');
}

function lsPickRole(el, r) {
  document.querySelectorAll('#ls-role-grid .lf-role').forEach(x => x.classList.remove('picked'));
  el.classList.add('picked');
  _lsRole = r;
}

function lsQuick(el, role) {
  document.querySelectorAll('#lf-in .lf-roles .lf-role').forEach(x => x.classList.remove('picked'));
  el.classList.add('picked');
  lsEnter(role, role, false);
}

function lsForgot() {
  if (typeof toast === 'function')
    toast('📩', 'Reset Link Sent', 'Check your email for the password reset link.', 'grn');
}

function lsLogin() {
  const id = (document.getElementById('li_id').value || '').trim();
  const pw = (document.getElementById('li_pw').value || '').trim();
  if (!id) { lsShake('li_id'); return; }
  if (!pw) { lsShake('li_pw'); return; }
  const name = id.includes('@') ? id.split('@')[0] : id;
  lsBtnLoad('lf-btn-in');
  setTimeout(() => lsEnter(name, 'Member', false), 1100);
}

function lsSignup() {
  const name = (document.getElementById('su_name').value || '').trim();
  const ph   = (document.getElementById('su_ph').value   || '').trim();
  const em   = (document.getElementById('su_em').value   || '').trim();
  const ar   = (document.getElementById('su_ar').value   || '').trim();
  const pw   = (document.getElementById('su_pw').value   || '').trim();
  if (!name) { lsShake('su_name'); return; }
  if (!ph)   { lsShake('su_ph');   return; }
  if (!em)   { lsShake('su_em');   return; }
  if (!ar)   { lsShake('su_ar');   return; }
  if (pw.length < 6) { lsShake('su_pw'); return; }
  lsBtnLoad('lf-btn-up');
  setTimeout(() => lsEnter(name, _lsRole || 'Member', true), 1100);
}

function lsBtnLoad(id) {
  const b = document.getElementById(id);
  if (!b) return;
  b.textContent = '⏳ Loading dashboard…';
  b.style.opacity = '.7';
  b.style.pointerEvents = 'none';
}

function lsEnter(name, role, isNew) {
  const ls = document.getElementById('LS');
  ls.classList.add('bye');
  setTimeout(() => { ls.style.display = 'none'; }, 560);

  /* update nav button label */
  const nb = document.querySelector('nav .nbtn');
  if (nb) nb.textContent = '👤 ' + name.split(' ')[0];

  /* fire welcome toast (toast fn available from main JS) */
  setTimeout(() => {
    if (typeof toast !== 'function') return;
    if (isNew) {
      toast('🎉', 'Welcome, ' + name + '!',
        'Account created. Live remainder dashboard is active.', 'grn', 7000);
    } else {
      toast('👋', 'Welcome back, ' + name + '!',
        'Live surplus feed is ready.' + (role !== 'Member' ? ' Role: ' + role : ''), 'grn', 5000);
    }
    if (typeof startAlerts === 'function') startAlerts();
  }, 600);
}

function lsShake(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#F72585';
  el.style.boxShadow   = '0 0 0 3px rgba(247,37,133,.25)';
  el.style.animation   = 'lsShake .4s ease';
  setTimeout(() => {
    el.style.animation   = '';
    el.style.borderColor = '';
    el.style.boxShadow   = '';
  }, 700);
}

/* ── Animate live remainder numbers ── */
(function lsLiveTick() {
  const items = [
    { pill: 'lp1', box: 'slb1', val: 18, unit: ' kg'  },
    { pill: 'lp2', box: 'slb2', val: 35, unit: ' kg'  },
    { pill: 'lp3', box: 'slb3', val: 24, unit: ' pcs' },
  ];
  setInterval(() => {
    items.forEach(it => {
      if (Math.random() > 0.35) return;
      const d = Math.random() < .55 ? -1 : 1;
      it.val = Math.max(1, it.val + d);
      [it.pill, it.box].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = it.val + it.unit;
        el.style.transform = 'scale(1.3)';
        setTimeout(() => el.style.transform = 'scale(1)', 280);
      });
    });
  }, 3200);
})();

// Gallery lightbox
document.querySelectorAll('.gal-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.gal-overlay span');
    document.getElementById('lb-img').src = img.src;
    document.getElementById('lb-caption').textContent = cap ? cap.textContent : '';
    document.getElementById('lightbox').classList.add('open');
  });
});
function closeLb() { document.getElementById('lightbox').classList.remove('open'); }
document.getElementById('lightbox').addEventListener('click', e => {
  if(e.target === e.currentTarget) closeLb();
});
document.addEventListener('keydown', e => { if(e.key==='Escape') closeLb(); });

/* ── In-memory store ── */
let regs = [];
let notifOn = false, notifTmr = null;

/* ── Toast ── */
function toast(icon, title, body, type='', dur=5000) {
  const c = document.getElementById('tc');
  const d = document.createElement('div');
  d.className = 'toast ' + type;
  d.innerHTML = `<div class="ticon">${icon}</div><div style="flex:1"><div class="ttitle">${title}</div><div class="tbody">${body}</div></div><button class="tclose" onclick="killToast(this.parentElement)">✕</button><div class="tprog"></div>`;
  c.appendChild(d);
  setTimeout(() => killToast(d), dur);
}
function killToast(el) {
  if (!el || !el.parentElement) return;
  el.style.animation = 'tOut .3s ease forwards';
  setTimeout(() => el && el.remove(), 310);
}

/* ── Browser notification ── */
function sendBN(title, body) {
  if (notifOn && 'Notification' in window && Notification.permission === 'granted') {
    try { new Notification(title, { body }); } catch(e){}
  }
}

/* ── Enable notifications ── */
function enableNotif() {
  document.getElementById('nb').style.display = 'none';
  if (!('Notification' in window)) {
    toast('📲','Toast Alerts Active','Browser notifications unsupported. Using on-screen alerts.','');
    startAlerts(); return;
  }
  Notification.requestPermission().then(p => {
    if (p === 'granted') {
      notifOn = true;
      toast('✅','Notifications Enabled!','You will receive live food surplus alerts.','grn');
      sendBN('FeedForward Activated 🍱','Real-time food surplus alerts are now live.');
    } else {
      toast('📲','Toast Alerts Active','Browser notifications denied. On-screen alerts enabled.','');
    }
    startAlerts();
  });
}

/* ── Periodic live alerts ── */
const ALERTS = [
  {i:'🍛', t:'Surplus Alert – IT Park A',     b:'18kg of rice & dal available. Pickup in 45 mins.',      tp:''},
  {i:'🏠', t:'Anand Ashram Needs Food',        b:'Sai Seva Ashram urgently needs 20kg. Respond now.',      tp:'red'},
  {i:'🚚', t:'Delivery Completed ✅',          b:'42kg delivered to Anand Ashram Begumpet!',               tp:'grn'},
  {i:'⏰', t:'Expiry Warning',                 b:'JNTU Mess: 15kg unclaimed for 1.5 hrs. Escalating.',    tp:'red'},
  {i:'🎉', t:'New Canteen Joined',             b:'Gachibowli Tech Park Canteen joined the network.',       tp:'gld'},
  {i:'🍽️', t:'Lunch Surplus Logged',          b:'Corp Block B reported 12kg leftover post-lunch.',        tp:''},
  {i:'♻️', t:'Zero Waste Day! 🌿',            b:'School D canteen – 0kg waste today. Excellent work!',    tp:'grn'},
  {i:'📍', t:'Pickup Available Near You',      b:'Hospital Canteen C has 9kg chapati. Collect by 8 PM.',  tp:'gld'},
  {i:'🙏', t:'1000th Meal Served Today',       b:'FeedForward just served the 1,000th meal this week!',   tp:'grn'},
  {i:'📲', t:'Reminder Sent to Canteens',      b:'Post-lunch reminder dispatched to 38 canteens.',         tp:''},
];
let ai = 0;
function startAlerts() {
  if (notifTmr) return;
  fire(); notifTmr = setInterval(fire, 9000);
}
function fire() {
  const a = ALERTS[ai % ALERTS.length]; ai++;
  toast(a.i, a.t, a.b, a.tp, 6000);
  sendBN(a.t, a.b);
}

/* Auto-start after 2.5s */
setTimeout(() => { if (!notifTmr) startAlerts(); }, 2500);

/* ── Live counter: ticks up occasionally to simulate live activity ── */
(function() {
  const el = document.getElementById('liveCount');
  if (!el) return;
  let count = 38;
  function nudge() {
    const delta = Math.random() < 0.4 ? 1 : (Math.random() < 0.15 ? -1 : 0);
    count = Math.max(30, count + delta);
    el.textContent = count;
    el.style.transform = delta !== 0 ? 'scale(1.25)' : 'scale(1)';
    setTimeout(() => el.style.transform = 'scale(1)', 280);
    setTimeout(nudge, 4000 + Math.random() * 6000);
  }
  setTimeout(nudge, 3500);
})();

/* ── Card select ── */
function selCard(el, name) {
  document.querySelectorAll('.dcard').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  toast('📍', name + ' Selected', 'Contact them directly or register to receive pickup alerts.', 'gld');
}

/* ── Notify location ── */
function notifyLoc(name) {
  toast('🔔', 'Alert Set for ' + name, 'You\'ll be notified instantly when food is available here.', 'grn');
  sendBN('Alert Set — ' + name, 'We will notify you when food becomes available.');
}

/* ── Reminders ── */
function setRem(type, time) {
  toast('⏰', type + ' Activated', 'You will receive alerts: ' + time, 'gld');
  sendBN(type + ' Activated', 'Reminder set for: ' + time);
}

/* ── Registration ── */
function doRegister() {
  const name  = v('r_name'), phone = v('r_phone'),
        email = v('r_email'), type  = v('r_type'), area = v('r_area'),
        cap   = v('r_cap'),  addr  = v('r_addr');

  if (!name)  return err('r_name',  'Please enter your Name / Organisation.');
  if (!phone) return err('r_phone', 'Please enter a Phone Number.');
  if (!email) return err('r_email', 'Please enter an Email Address.');
  if (!type)  return err('r_type',  'Please select your Role.');
  if (!area)  return err('r_area',  'Please enter your City / Area.');

  const prefs = [];
  if (chk('c_sms'))    prefs.push('SMS');
  if (chk('c_email'))  prefs.push('Email');
  if (chk('c_wa'))     prefs.push('WhatsApp');
  if (chk('c_push'))   prefs.push('Push');
  if (chk('c_digest')) prefs.push('Digest');

  const entry = {
    id: regs.length + 1, name, phone, email, type, area,
    capacity: cap || '—', address: addr || '—',
    alerts: prefs.join(', ') || 'None',
    time: new Date().toLocaleString('en-IN', {dateStyle:'medium', timeStyle:'short'})
  };
  regs.push(entry);
  renderTable();
  clearForm();

  const btn = document.getElementById('regBtn');
  btn.textContent = '✅ Registration Successful!';
  btn.style.background = 'linear-gradient(135deg,var(--grn),#55efc4)';
  setTimeout(() => { btn.textContent = '🚀 Register & Activate Reminders'; btn.style.background = ''; }, 3000);

  toast('🎉', 'Welcome, ' + name + '!', 'You are now in the FeedForward network. Alerts are active.', 'grn', 7000);
  sendBN('Welcome to FeedForward! 🍱', name + ' — registered. Food alerts are live.');
  if (!notifTmr) startAlerts();
}

function v(id) { return document.getElementById(id).value.trim(); }
function chk(id){ return document.getElementById(id).checked; }
function err(id, msg) {
  const el = document.getElementById(id);
  el.style.borderColor = '#C0392B';
  el.style.animation = 'shake .4s ease';
  setTimeout(() => { el.style.animation=''; el.style.borderColor=''; }, 700);
  toast('⚠️', 'Missing Field', msg, 'red');
}
function clearForm(){
  ['r_name','r_phone','r_email','r_area','r_cap','r_addr'].forEach(id => document.getElementById(id).value='');
  document.getElementById('r_type').value='';
  document.getElementById('c_sms').checked=true;
  document.getElementById('c_email').checked=true;
  ['c_wa','c_push','c_digest'].forEach(id => document.getElementById(id).checked=false);
}

const roleMap = { Canteen:'rb-c', Ashram:'rb-a', NGO:'rb-n', Volunteer:'rb-v', Individual:'rb-i' };
const emojiMap= { Canteen:'🍽️', Ashram:'🏠', NGO:'🤝', Volunteer:'🚚', Individual:'👤' };

function renderTable() {
  document.getElementById('regCnt').textContent = regs.length;
  document.getElementById('regBody').innerHTML = regs.map(r =>
    `<tr>
      <td style="color:var(--txl)">${r.id}</td>
      <td><strong style="color:var(--lb3)">${r.name}</strong></td>
      <td><span class="rbadge ${roleMap[r.type]||'rb-i'}">${emojiMap[r.type]||'👤'} ${r.type}</span></td>
      <td>${r.phone}</td>
      <td style="font-size:.73rem">${r.email}</td>
      <td>${r.area}</td>
      <td>${r.capacity}</td>
      <td style="font-size:.72rem;color:var(--gold)">${r.alerts}</td>
      <td style="font-size:.72rem;color:var(--txl)">${r.time}</td>
    </tr>`).join('');
  document.getElementById('tblWrap').classList.add('show');
}

function exportCSV() {
  if (!regs.length) return toast('⚠️','No Data','Register at least one member first.','red');
  const h = ['#','Name','Role','Phone','Email','Area','Capacity','Alerts','Registered'];
  const rows = regs.map(r => [r.id,r.name,r.type,r.phone,r.email,r.area,r.capacity,r.alerts,r.time]);
  const csv = [h,...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'feedforward_registrations.csv';
  a.click();
  toast('📥','CSV Exported','Registration data downloaded successfully.','grn');
}

/* ── Bar chart on scroll ── */
const bObs = new IntersectionObserver(e => {
  e.forEach(en => {
    if (en.isIntersecting) {
      en.target.querySelectorAll('.bfill').forEach(b => {
        const w = b.getAttribute('data-w'); b.style.width='0%';
        setTimeout(() => b.style.width = w, 150);
      });
      bObs.unobserve(en.target);
    }
  });
}, {threshold:.3});
const bc = document.getElementById('barChart');
if (bc) bObs.observe(bc);

/* ── Impact counters ── */
const iObs = new IntersectionObserver(e => {
  e.forEach(en => {
    if (en.isIntersecting) {
      en.target.querySelectorAll('.impnum').forEach(n => {
        const tgt=+n.dataset.t, suf=n.dataset.s, step=tgt/90;
        let v=0; n.textContent='0';
        const t=setInterval(()=>{
          v=Math.min(v+step,tgt);
          n.textContent=Math.floor(v).toLocaleString('en-IN')+suf;
          if(v>=tgt)clearInterval(t);
        },18);
      });
      iObs.unobserve(en.target);
    }
  });
},{threshold:.3});
const ig = document.querySelector('.impgrid');
if (ig) iObs.observe(ig);

const REMAINDER_DATA = {
  fresh: {
    icon: '🥗',
    badge: '🥗 FRESH FOOD',
    badgeGrad: 'linear-gradient(135deg,#FF6B2B,#FFD166)',
    badgeColor: '#fff',
    title: 'Fresh Food Remainder',
    sub: 'Live surplus available from canteens right now',
    barGrad: 'linear-gradient(90deg,#FF6B2B,#FFD166)',
    pctColor: '#FFD166',
    items: [
      { label:'🍛 Rice & Dal',    qty:'18 kg', loc:'IT Park Canteen A',  color:'rgba(255,107,43,.3)',  border:'rgba(255,107,43,.6)' },
      { label:'🫓 Chapati',       qty:'7 kg',  loc:'Hospital Canteen C', color:'rgba(255,209,102,.2)', border:'rgba(255,209,102,.5)' },
      { label:'🍲 Curry',         qty:'5 kg',  loc:'JNTU Mess',          color:'rgba(255,140,85,.2)',  border:'rgba(255,140,85,.5)' },
      { label:'🥣 Breakfast Mix', qty:'3 kg',  loc:'Gachibowli Canteen', color:'rgba(255,107,43,.2)',  border:'rgba(255,107,43,.4)' },
    ],
    total: 33, pct: 72
  },
  produce: {
    icon: '🥦',
    badge: '🥦 PRODUCE',
    badgeGrad: 'linear-gradient(135deg,#06D6A0,#4CC9F0)',
    badgeColor: '#000',
    title: 'Produce Remainder',
    sub: 'Fresh fruits & vegetables with zero pesticides',
    barGrad: 'linear-gradient(90deg,#06D6A0,#4CC9F0)',
    pctColor: '#06D6A0',
    items: [
      { label:'🥕 Carrots',    qty:'12 kg', loc:'Central Market',   color:'rgba(6,214,160,.2)',  border:'rgba(6,214,160,.5)'  },
      { label:'🍅 Tomatoes',   qty:'8 kg',  loc:'Farm Fresh Hub',   color:'rgba(76,201,240,.2)', border:'rgba(76,201,240,.5)' },
      { label:'🥬 Leafy Veg',  qty:'6 kg',  loc:'Organic Store',    color:'rgba(6,214,160,.15)', border:'rgba(6,214,160,.4)'  },
      { label:'🍌 Fruits Mix', qty:'9 kg',  loc:'Fruit Market',     color:'rgba(76,201,240,.15)',border:'rgba(76,201,240,.4)' },
    ],
    total: 35, pct: 84
  },
  ready: {
    icon: '🍽️',
    badge: '🍽️ READY TO SERVE',
    badgeGrad: 'linear-gradient(135deg,#F72585,#7209B7)',
    badgeColor: '#fff',
    title: 'Ready-to-Serve Remainder',
    sub: 'Hot meals cooked within the last 2 hours',
    barGrad: 'linear-gradient(90deg,#F72585,#7209B7)',
    pctColor: '#F72585',
    items: [
      { label:'🍱 Meal Boxes',   qty:'24 pcs', loc:'IT Park Canteen A',  color:'rgba(247,37,133,.25)', border:'rgba(247,37,133,.6)'  },
      { label:'🥘 Biryani',      qty:'11 kg',  loc:'JNTU Mess',          color:'rgba(114,9,183,.25)',  border:'rgba(114,9,183,.6)'   },
      { label:'🫕 Sambar Rice',  qty:'9 kg',   loc:'Hospital Canteen C', color:'rgba(247,37,133,.2)',  border:'rgba(247,37,133,.4)'  },
      { label:'🥗 Salads',       qty:'5 kg',   loc:'Gachibowli Canteen', color:'rgba(114,9,183,.2)',   border:'rgba(114,9,183,.4)'   },
    ],
    total: 49, pct: 61
  }
};

let activeType = null;

function showRemainder(type) {
  const d = REMAINDER_DATA[type];
  activeType = type;

  document.getElementById('remIcon').textContent = d.icon;
  const badge = document.getElementById('remBadge');
  badge.textContent = d.badge;
  badge.style.background = d.badgeGrad;
  badge.style.color = d.badgeColor;
  document.getElementById('remTitle').textContent = d.title;
  document.getElementById('remSub').textContent = d.sub;

  // Items grid
  const grid = document.getElementById('remGrid');
  grid.innerHTML = d.items.map(it => `
    <div style="background:${it.color};border:1px solid ${it.border};border-radius:12px;padding:12px 14px;">
      <div style="font-size:1rem;font-weight:800;color:#fff;margin-bottom:2px;">${it.qty}</div>
      <div style="color:rgba(255,255,255,.9);font-size:.75rem;font-weight:700;margin-bottom:4px;">${it.label}</div>
      <div style="color:rgba(255,255,255,.45);font-size:.65rem;">📍 ${it.loc}</div>
    </div>
  `).join('');

  // Bar
  document.getElementById('remPct').style.color = d.pctColor;
  document.getElementById('remPct').textContent = d.pct + '% claimed';
  const bar = document.getElementById('remBar');
  bar.style.background = d.barGrad;
  bar.style.width = '0%';

  // CTA
  const btn = document.getElementById('remClaim');
  btn.style.background = d.barGrad;
  btn.style.boxShadow = `0 6px 20px rgba(0,0,0,.4)`;

  // Show modal
  const modal = document.getElementById('remModal');
  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { bar.style.width = d.pct + '%'; });
  });
}

function closeRemModal() {
  document.getElementById('remModal').style.display = 'none';
  activeType = null;
}

function claimRemainder() {
  const d = REMAINDER_DATA[activeType];
  closeRemModal();
  toast('📦', 'Remainder Claimed!',
    `You've claimed ${d.total}kg of ${d.title.replace(' Remainder','')}. A volunteer will contact you shortly.`, 'grn', 7000);
  sendBN('Remainder Claimed 🎉', `${d.total}kg claimed from ${d.badge} — connecting with nearest volunteer.`);
}