// ===== Cityscope Vadodara — admin portal =====
requireAdmin();

document.getElementById("logoutBtn").innerHTML = ICON.logout;
document.getElementById("logoutBtn").onclick = ()=>{
  DB.logoutAdmin();
  window.location.href = "admin-login.html";
};
document.getElementById("plusIc").innerHTML = ICON.plus;

// ---- Tabs ----
const tabs = document.querySelectorAll(".admin-tab");
const panels = document.querySelectorAll(".admin-panel");
tabs.forEach(tab=>{
  tab.addEventListener("click", ()=>{
    tabs.forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    const key = tab.dataset.tab;
    panels.forEach(p=> p.style.display = p.dataset.panel===key ? "block" : "none");
    if(key==="brokers") renderBrokerList();
    if(key==="listings") renderListings();
  });
});

// ---- Overview stats ----
function renderStats(){
  document.getElementById("statListings").textContent = DB.all().length;
  document.getElementById("statBrokers").textContent = DB.brokers().length;
}
renderStats();

// ---- Broker photo upload (reuses the same resize approach as the sell wizard) ----
let brokerPhotoData = "";
function resizeImage(file, maxW){
  return new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onload = (e)=>{
      const img = new Image();
      img.onload = ()=>{
        const scale = Math.min(1, maxW/img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width*scale;
        canvas.height = img.height*scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
function renderBrokerPhotoSlot(){
  const wrap = document.getElementById("brokerPhotoSlotWrap");
  wrap.innerHTML = brokerPhotoData
    ? `<div class="photo-slot circle"><img src="${brokerPhotoData}"><button class="rm" id="rmBrokerPhoto">✕</button></div>`
    : `<label class="photo-slot circle add">${ICON.camPlus}<span style="font-size:9.5px;">Add Photo</span><input type="file" accept="image/*" id="brokerPhotoInput"></label>`;
  const input = document.getElementById("brokerPhotoInput");
  if(input) input.addEventListener("change", async (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    brokerPhotoData = await resizeImage(file, 300);
    renderBrokerPhotoSlot();
  });
  const rm = document.getElementById("rmBrokerPhoto");
  if(rm) rm.addEventListener("click",(e)=>{ e.preventDefault(); brokerPhotoData=""; renderBrokerPhotoSlot(); });
}
renderBrokerPhotoSlot();

document.getElementById("bBio").addEventListener("input",(e)=>{
  document.getElementById("bBioCount").textContent = `${e.target.value.length}/220`;
});

document.getElementById("addBrokerBtn").onclick = ()=>{
  const name = document.getElementById("bName").value.trim();
  const exp = Number(document.getElementById("bExp").value);
  const phoneRaw = document.getElementById("bPhone").value.trim();
  const expertise = document.getElementById("bExpertise").value.trim();
  const bio = document.getElementById("bBio").value.trim();

  if(!name){ toast("Please enter the broker's name"); return; }
  if(!phoneRaw){ toast("Please enter a phone number"); return; }
  if(!expertise){ toast("Please enter a field of expertise"); return; }

  const broker = {
    id: "b" + Date.now(),
    name,
    photo: brokerPhotoData || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&q=80",
    experience: exp || 0,
    expertise,
    phone: "+91" + phoneRaw.replace(/\D/g,""),
    bio: bio || `${name} is a Cityscope Vadodara broker specialising in ${expertise.toLowerCase()}.`
  };
  DB.addBroker(broker);
  toast("Broker added");

  document.getElementById("bName").value = "";
  document.getElementById("bExp").value = "";
  document.getElementById("bPhone").value = "";
  document.getElementById("bExpertise").value = "";
  document.getElementById("bBio").value = "";
  document.getElementById("bBioCount").textContent = "0/220";
  brokerPhotoData = "";
  renderBrokerPhotoSlot();

  renderBrokerList();
  renderStats();
};

function renderBrokerList(){
  const wrap = document.getElementById("brokerListWrap");
  const brokers = DB.brokers();
  if(!brokers.length){
    wrap.innerHTML = `<div class="empty"><div class="ic-wrap">${ICON.user}</div><h3>No brokers yet</h3><p>Add your first broker above.</p></div>`;
    return;
  }
  wrap.innerHTML = brokers.map(b=>`
    <div class="broker-mgmt-card">
      <img src="${b.photo}" alt="${b.name}">
      <div class="body">
        <b>${b.name}</b>
        <div class="meta">${b.experience}+ Yrs · ${b.expertise}</div>
        <div class="bio">${b.bio}</div>
      </div>
      <button class="rm-broker" data-del-broker="${b.id}">${ICON.trash}</button>
    </div>`).join("");
  wrap.querySelectorAll("[data-del-broker]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.dataset.delBroker;
      // Unassign this broker from any properties currently using them.
      DB.all().filter(p=>p.brokerId===id).forEach(p=> DB.update(p.id, {brokerId:"", agent:"Cityscope Realty"}));
      DB.removeBroker(id);
      renderBrokerList();
      renderStats();
      toast("Broker removed");
    });
  });
}

// ---- Listings: assign / reassign brokers, delete listings ----
function renderListings(){
  const wrap = document.getElementById("listingsWrap");
  const props = DB.all();
  const brokers = DB.brokers();
  if(!props.length){
    wrap.innerHTML = `<div class="empty"><div class="ic-wrap">${ICON.listing}</div><h3>No listings yet</h3><p>List your first property from the Overview tab.</p></div>`;
    return;
  }
  wrap.innerHTML = props.map(p=>`
    <div class="admin-listing-row">
      <img src="${p.images[0]}" alt="${p.title}">
      <div class="body">
        <b>${p.title}</b>
        <span>${p.locality}, ${p.city} · ${p.priceLabel}</span>
      </div>
      <select data-assign="${p.id}">
        <option value="">No broker</option>
        ${brokers.map(b=>`<option value="${b.id}" ${p.brokerId===b.id?"selected":""}>${b.name}</option>`).join("")}
      </select>
      <button class="del-listing" data-del-listing="${p.id}">${ICON.trash}</button>
    </div>`).join("");

  wrap.querySelectorAll("[data-assign]").forEach(sel=>{
    sel.addEventListener("change", ()=>{
      const id = sel.dataset.assign;
      const brokerId = sel.value;
      const broker = DB.getBroker(brokerId);
      DB.update(id, {
        brokerId,
        agent: broker ? broker.name : "Cityscope Realty",
        phone: broker ? broker.phone : "+919876543210"
      });
      toast(broker ? `${broker.name} assigned` : "Broker unassigned");
    });
  });
  wrap.querySelectorAll("[data-del-listing]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      DB.remove(btn.dataset.delListing);
      renderListings();
      renderStats();
      toast("Listing deleted");
    });
  });
}
