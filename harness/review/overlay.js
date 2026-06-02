// Comment overlay: pin-drop annotations on specific spots + per-section notes,
// persisted to localStorage, exported as review-comments.json. Vanilla JS.
(function () {
  var KEY = 'aperture-review-v1';
  var store = load();
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || { sections: {} }; } catch (e) { return { sections: {} }; } }
  function save() { localStorage.setItem(KEY, JSON.stringify(store)); }
  function sec(id) { return (store.sections[id] || (store.sections[id] = { label: '', notes: '', pins: [] })); }

  function init() {
    var sections = document.querySelectorAll('.rv-section');
    if (!sections.length) return setTimeout(init, 120); // wait for React render

    sections.forEach(function (el) {
      var id = el.getAttribute('data-review');
      var label = el.getAttribute('data-label');
      sec(id).label = label;
      var frame = el.querySelector('.rv-frame');

      // notes + pinlist block (DOM-built, no innerHTML)
      var notes = document.createElement('div');
      notes.className = 'rv-notes';
      var ta = document.createElement('textarea');
      ta.placeholder = 'Section note for ' + label + " — what's not visually usable?";
      var ul = document.createElement('ul'); ul.className = 'rv-pinlist';
      notes.appendChild(ta); notes.appendChild(ul);
      el.appendChild(notes);
      ta.value = sec(id).notes || '';
      ta.addEventListener('input', function () { sec(id).notes = ta.value; save(); refresh(); });

      frame.addEventListener('click', function (ev) {
        if (!document.body.classList.contains('commenting')) return;
        var r = frame.getBoundingClientRect();
        var x = +(((ev.clientX - r.left) / r.width) * 100).toFixed(2);
        var y = +(((ev.clientY - r.top) / r.height) * 100).toFixed(2);
        sec(id).pins.push({ x: x, y: y, text: '' });
        save(); refresh();
        var inputs = notes.querySelectorAll('.rv-pinitem input');
        if (inputs.length) inputs[inputs.length - 1].focus();
      });
    });

    document.getElementById('rv-toggle').addEventListener('click', function () {
      var on = document.body.classList.toggle('commenting');
      this.textContent = '💬 Comment mode: ' + (on ? 'ON' : 'OFF');
      this.classList.toggle('active', on);
    });
    document.getElementById('rv-export').addEventListener('click', exportJSON);
    var clearBtn = document.getElementById('rv-clear');
    if (clearBtn) clearBtn.addEventListener('click', function () {
      if (!confirm('Clear all comments?')) return;
      store = { sections: {} }; localStorage.removeItem(KEY);
      document.querySelectorAll('.rv-section .rv-notes textarea').forEach(function (t) { t.value = ''; });
      refresh();
    });
    refresh();
  }

  function refresh() {
    var total = 0;
    document.querySelectorAll('.rv-section').forEach(function (el) {
      var id = el.getAttribute('data-review');
      var s = sec(id); var frame = el.querySelector('.rv-frame');
      // pins on frame
      frame.querySelectorAll('.rv-pin').forEach(function (p) { p.remove(); });
      s.pins.forEach(function (pin, i) {
        var m = document.createElement('div'); m.className = 'rv-pin'; m.textContent = i + 1;
        m.style.left = pin.x + '%'; m.style.top = pin.y + '%';
        m.title = pin.text || ('pin ' + (i + 1));
        frame.appendChild(m);
      });
      // pinlist
      var ul = el.querySelector('.rv-pinlist'); while (ul.firstChild) ul.removeChild(ul.firstChild);
      s.pins.forEach(function (pin, i) {
        var li = document.createElement('li'); li.className = 'rv-pinitem';
        var n = document.createElement('span'); n.className = 'n'; n.textContent = i + 1;
        var inp = document.createElement('input'); inp.value = pin.text; inp.placeholder = 'what about this spot?';
        inp.addEventListener('input', function () { pin.text = inp.value; save(); });
        var del = document.createElement('button'); del.className = 'del'; del.textContent = '✕';
        del.addEventListener('click', function () { s.pins.splice(i, 1); save(); refresh(); });
        li.appendChild(n); li.appendChild(inp); li.appendChild(del); ul.appendChild(li);
      });
      var n = s.pins.length + (s.notes && s.notes.trim() ? 1 : 0);
      total += n;
      el.classList.toggle('commented', n > 0);
      var badge = el.querySelector('[data-count-for="' + id + '"]');
      if (badge) { badge.textContent = n; badge.classList.toggle('show', n > 0); }
    });
    var t = document.getElementById('rv-total');
    if (t) t.textContent = total + ' comment' + (total === 1 ? '' : 's');
  }

  function exportJSON() {
    var out = { tool: 'aperture-design-review', exportedAt: new Date().toISOString(), sections: [] };
    Object.keys(store.sections).forEach(function (id) {
      var s = store.sections[id];
      if ((s.notes && s.notes.trim()) || s.pins.length) {
        out.sections.push({ id: id, label: s.label, notes: s.notes || '', pins: s.pins.filter(function (p) { return p.text && p.text.trim(); }).map(function (p, i) { return { n: i + 1, x: p.x, y: p.y, comment: p.text }; }) });
      }
    });
    var blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'review-comments.json'; a.click();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
