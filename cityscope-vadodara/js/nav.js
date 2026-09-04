function bottomNavHTML(active){
  const item = (href, icon, label, key) => `
    <a href="${href}" class="${active===key?'active':''}">
      ${icon}<span>${label}</span>
    </a>`;
  return `
    ${item("index.html", ICON.home, "Home", "home")}
    ${item("buy.html", ICON.buy, "Buy/Rent", "buy")}
    ${item("saved.html", ICON.heart, "Saved", "saved")}
    ${item("account.html", ICON.user, "Account", "account")}
  `;
}

function mountBottomNav(active){
  const el = document.getElementById("bottom-nav");
  if(el){ el.innerHTML = bottomNavHTML(active); }
}
