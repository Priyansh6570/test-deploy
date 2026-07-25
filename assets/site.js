/* SKPN shell: boot loader + SPA-style page transitions. Loaded from each page's helmet. */
(function () {
  if (window.__skpnShell) return;
  window.__skpnShell = true;

  var LOGO = "uploads/skpn-logo.png";

  var css = document.createElement("style");
  css.textContent = [
    "@keyframes skpnSpin{to{transform:rotate(360deg)}}",
    "@keyframes skpnSpinRev{to{transform:rotate(-360deg)}}",
    "@keyframes skpnBreathe{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.8;transform:scale(1.08)}}",
    "@keyframes skpnBar{0%{transform:translateX(-100%)}100%{transform:translateX(320%)}}",
    "@keyframes skpnRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
    "#skpn-loader{position:fixed;inset:0;z-index:99999;background:radial-gradient(78% 62% at 50% 42%,#101838 0%,#070B1E 62%,#04060F 100%);",
    "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;opacity:1;transition:opacity .46s cubic-bezier(.22,.61,.36,1)}",
    "#skpn-loader[data-hidden='1']{opacity:0;pointer-events:none}",
    "@media (prefers-reduced-motion: reduce){#skpn-loader *{animation:none !important}}"
  ].join("");
  document.head.appendChild(css);

  var el = document.createElement("div");
  el.id = "skpn-loader";
  el.setAttribute("role", "status");
  el.setAttribute("aria-label", "लोड हो रहा है");
  el.innerHTML =
    '<div style="position:relative;width:132px;height:132px;display:flex;align-items:center;justify-content:center">' +
      '<div style="position:absolute;inset:-40%;border-radius:50%;background:radial-gradient(circle,rgba(232,193,115,.38) 0%,rgba(232,193,115,.1) 44%,rgba(232,193,115,0) 70%);animation:skpnBreathe 2.6s ease-in-out infinite"></div>' +
      '<svg viewBox="-100 -100 200 200" width="152" height="152" aria-hidden="true" style="position:absolute;left:-10px;top:-10px">' +
        '<circle r="92" fill="none" stroke="rgba(232,193,115,.55)" stroke-width="1.6" stroke-dasharray="2 8" stroke-linecap="round" style="transform-origin:0 0;animation:skpnSpin 9s linear infinite"></circle>' +
        '<circle r="74" fill="none" stroke="rgba(232,193,115,.3)" stroke-width="3.4" stroke-dasharray="6 30" stroke-linecap="round" style="transform-origin:0 0;animation:skpnSpinRev 14s linear infinite"></circle>' +
      '</svg>' +
      '<span style="position:relative;width:88px;height:88px;border-radius:50%;background:#04060F;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 1px rgba(232,193,115,.3),0 12px 40px rgba(0,0,0,.6)">' +
        '<img src="' + LOGO + '" alt="" style="width:66px;height:auto;display:block" />' +
      '</span>' +
    '</div>' +
    '<div style="display:flex;flex-direction:column;align-items:center;gap:12px;animation:skpnRise .5s ease both">' +
      '<p style="margin:0;font-family:\'Noto Serif Devanagari\',serif;font-weight:600;font-size:19px;line-height:1.5;color:#FFF9EC;letter-spacing:.01em">श्रीकृष्ण पाथेय न्यास</p>' +
      '<p style="margin:0;font-family:\'Noto Sans Devanagari\',system-ui,sans-serif;font-size:12.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(232,193,115,.8)">संस्कृति विभाग, मध्यप्रदेश शासन</p>' +
      '<span style="margin-top:6px;position:relative;width:150px;height:2px;border-radius:2px;background:rgba(255,249,236,.14);overflow:hidden;display:block">' +
        '<span style="position:absolute;inset:0;width:32%;border-radius:2px;background:linear-gradient(90deg,rgba(232,193,115,0),#E8C173,rgba(232,193,115,0));animation:skpnBar 1.15s ease-in-out infinite"></span>' +
      '</span>' +
    '</div>';

  function mount() {
    if (document.body && !document.getElementById("skpn-loader")) document.body.appendChild(el);
  }
  mount();
  if (!document.body) document.addEventListener("DOMContentLoaded", mount);

  var hidden = false;
  function hide() {
    if (hidden) return;
    hidden = true;
    el.setAttribute("data-hidden", "1");
  }
  function show() {
    hidden = false;
    mount();
    el.removeAttribute("data-hidden");
  }

  function settle() {
    // Give the streamed template a beat to paint before revealing it.
    setTimeout(hide, 420);
  }
  if (document.readyState === "complete") settle();
  else window.addEventListener("load", settle);
  setTimeout(hide, 4200);
  window.addEventListener("pageshow", function (e) { if (e.persisted) hide(); });

  // SPA-feel navigation: hold the shell over the swap instead of flashing white.
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|https?:)/i.test(href)) return;
    if (!/\.dc\.html/i.test(href)) return;
    if (href.split("#")[0] === location.pathname.split("/").pop()) return;
    e.preventDefault();
    show();
    setTimeout(function () { window.location.href = href; }, 300);
  }, true);
})();
