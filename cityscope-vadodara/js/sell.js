// ===== Cityscope Vadodara — sell wizard (admin-only listing tool) =====
requireAdmin();

const CATEGORIES = [
  {key:"Apartment", title:"Apartment", desc:"Flats in Buildings", icon:"apartment"},
  {key:"Villa / House", title:"Villa / House", desc:"Independent House / Villa", icon:"villa"},
  {key:"Plot / Land", title:"Plot / Land", desc:"Residential / Commercial Land", icon:"land"},
  {key:"Commercial", title:"Commercial", desc:"Shops, Offices, Showrooms", icon:"commercial"},
];

const PROP_TYPE_OPTIONS = {
  "Apartment":["1 BHK Apartment","2 BHK Apartment","3 BHK Apartment","4 BHK Apartment","5+ BHK Apartment"],
  "Villa / House":["2 BHK Villa","3 BHK Villa","4 BHK Villa","5+ BHK Villa","Independent House"],
  "Plot / Land":["Residential Plot","Commercial Plot","Agricultural Land"],
  "Commercial":["Office Space","Shop / Showroom","Warehouse","Commercial Building"],
};

const STEP_TITLES = ["Sell Property","Location Details","Basic Details","Add Photos & Videos","Set Price","Review & Publish"];

const state = {
  category:"", propType:"",
  city:"Vadodara", locality:"", project:"", address:"",
  builtUp:"", carpet:"", bedrooms:3, bathrooms:3, floorNo:"", totalFloors:"", age:"2 - 5 Years", furnishing:"Semi-Furnished",
  photos:[],
  price:"", negotiable:true, contact:"", amenities:[], description:"",
  brokerId:"",
};

let currentStep = 0;
const TOTAL_STEPS = 6;

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return document.querySelectorAll(sel); }

function showStep(n){
  currentStep = n;
  $all(".step-panel").forEach(p=> p.classList.toggle("active", Number(p.dataset.step)===n));
  $("#wizTitle").textContent = STEP_TITLES[n];
  window.scrollTo({top:0, behavior:"instant" in window ? "instant" : "auto"});
  renderProgress();
}

function renderProgress(){
  for(let i=1;i<=5;i++){
    const el = document.getElementById("progress"+i);
    if(!el) continue;
    let bars = "";
    for(let b=0;b<TOTAL_STEPS;b++){
      bars += `<span class="bar ${b<=currentStep?'done':''}"></span>`;
    }
    el.innerHTML = bars;
  }
}

document.getElementById("backBtn").innerHTML = ICON.back;
document.getElementById("backBtn").onclick = ()=>{
  if(currentStep===0){ window.location.href="admin.html"; }
  else{ showStep(currentStep-1); }
};

// ---- Broker dropdown (Step 4) ----
const brokerSelect = document.getElementById("fBroker");
const brokerList = DB.brokers();
brokerSelect.innerHTML = `<option value="">No broker assigned</option>` +
  brokerList.map(b=>`<option value="${b.id}">${b.name} — ${b.expertise}</option>`).join("");
if(brokerList.length){ brokerSelect.value = brokerList[0].id; state.brokerId = brokerList[0].id; }
brokerSelect.addEventListener("change",(e)=> state.brokerId = e.target.value);

// ---- Step 0: category ----
const typeGrid = document.getElementById("typeGrid");
typeGrid.innerHTML = CATEGORIES.map(c=>`
  <div class="type-opt" data-cat="${c.key}">
    <span class="ic-wrap">${ICON[c.icon]}</span>
    <div class="info"><b>${c.title}</b><span>${c.desc}</span></div>
    <span class="check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
  </div>`).join("");
document.querySelectorAll(".perk .ic-wrap")[0].innerHTML = ICON.trend;
document.querySelectorAll(".perk .ic-wrap")[1].innerHTML = ICON.shield;
document.querySelectorAll(".perk .ic-wrap")[2].innerHTML = ICON.rupee;
document.querySelectorAll(".perk .ic-wrap")[3].innerHTML = ICON.bolt;
document.querySelectorAll(".why-item span:first-child").forEach((s,i)=>{
  s.innerHTML = `<b style="width:26px;height:26px;border-radius:50%;background:var(--red-50);color:var(--red);display:inline-flex;align-items:center;justify-content:center;font-size:11px;margin-right:8px;">${i+1}</b>`;
});

typeGrid.addEventListener("click",(e)=>{
  const opt = e.target.closest(".type-opt");
  if(!opt) return;
  $all(".type-opt").forEach(o=>o.classList.remove("selected"));
  opt.classList.add("selected");
  state.category = opt.dataset.cat;
  const cta = document.getElementById("cta0");
  cta.disabled = false;
  cta.style.opacity = 1;
});
document.getElementById("cta0").onclick = ()=>{
  if(!state.category) return;
  populatePropTypeOptions();
  showStep(1);
};

// ---- Step 1: location ----
document.getElementById("useLocBtn").innerHTML = ICON.gps + " Use Current Location";
document.querySelector("#mapBox1 .pin").innerHTML = ICON.pin.replace('width="13" height="13"','width="26" height="26"');
document.getElementById("useLocBtn").onclick = ()=>{
  toast("Detecting your location…");
  setTimeout(()=>{
    document.getElementById("fAddress").value = document.getElementById("fAddress").value || "Near Circle, ";
    toast("Location set from GPS");
  }, 700);
};
document.getElementById("cta1").onclick = ()=>{
  state.city = document.getElementById("fCity").value;
  state.locality = document.getElementById("fLocality").value.trim();
  state.project = document.getElementById("fProject").value.trim();
  state.address = document.getElementById("fAddress").value.trim();
  if(!state.locality){ toast("Please enter your locality / area"); return; }
  showStep(2);
};

// ---- Step 2: basic details ----
function populatePropTypeOptions(){
  const opts = PROP_TYPE_OPTIONS[state.category] || [];
  document.getElementById("fPropType").innerHTML = opts.map(o=>`<option>${o}</option>`).join("");
  state.propType = opts[Math.min(2,opts.length-1)] || opts[0];
  document.getElementById("fPropType").value = state.propType;
}
document.getElementById("fPropType").addEventListener("change",(e)=> state.propType = e.target.value);

$all("[data-step-target]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const key = btn.dataset.stepTarget;
    const dir = Number(btn.dataset.dir);
    const min = 0;
    state[key] = Math.max(min, state[key]+dir);
    document.getElementById("val"+key.charAt(0).toUpperCase()+key.slice(1)).textContent = state[key];
  });
});

document.getElementById("furnishPills").addEventListener("click",(e)=>{
  const btn = e.target.closest("button");
  if(!btn) return;
  $all("#furnishPills button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  state.furnishing = btn.dataset.val;
});

document.getElementById("cta2").onclick = ()=>{
  state.builtUp = document.getElementById("fBuiltUp").value || "1000";
  state.carpet = document.getElementById("fCarpet").value;
  state.floorNo = document.getElementById("fFloorNo").value;
  state.totalFloors = document.getElementById("fTotalFloors").value;
  state.age = document.getElementById("fAge").value;
  if(!document.getElementById("fBuiltUp").value){ toast("Please enter built-up area"); return; }
  showStep(3);
};

// ---- Step 3: photos ----
const MAX_PHOTOS = 20;
function renderPhotoGrid(){
  const grid = document.getElementById("photoGrid");
  let html = state.photos.map((src,i)=>`
    <div class="photo-slot"><img src="${src}"><button class="rm" data-rm="${i}">✕</button></div>`).join("");
  if(state.photos.length < MAX_PHOTOS){
    html += `<label class="photo-slot add">${ICON.camPlus}<span>Add Photos</span><input type="file" accept="image/*" multiple id="photoInput"></label>`;
  }
  grid.innerHTML = html;
  document.getElementById("photoHint").textContent = `${state.photos.length} / ${MAX_PHOTOS} photos added — add at least 3 for best results`;
  const input = document.getElementById("photoInput");
  if(input) input.addEventListener("change", handlePhotoUpload);
  grid.querySelectorAll("[data-rm]").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      e.preventDefault();
      state.photos.splice(Number(btn.dataset.rm),1);
      renderPhotoGrid();
    });
  });
}
function resizeImage(file){
  return new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onload = (e)=>{
      const img = new Image();
      img.onload = ()=>{
        const maxW = 900;
        const scale = Math.min(1, maxW/img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width*scale;
        canvas.height = img.height*scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
async function handlePhotoUpload(e){
  const files = Array.from(e.target.files).slice(0, MAX_PHOTOS-state.photos.length);
  for(const f of files){
    const dataUrl = await resizeImage(f);
    state.photos.push(dataUrl);
  }
  renderPhotoGrid();
}
document.getElementById("addVideoBtn").innerHTML = ICON.video + " Add Video (Optional)";
document.getElementById("addVideoBtn").onclick = ()=> toast("Video upload coming soon");
renderPhotoGrid();

document.getElementById("cta3").onclick = ()=>{
  if(state.photos.length===0){ toast("Please add at least one photo"); return; }
  updatePriceInsight();
  showStep(4);
};

// ---- Step 4: price ----
document.querySelector("#fPrice").closest(".input-icon").querySelector(".ic").innerHTML = ICON.rupee;
document.querySelector("#priceInsight .ic-wrap").innerHTML = ICON.trend;

function updatePriceInsight(){
  const built = Number(document.getElementById("fBuiltUp").value || state.builtUp || 1000);
  const isRent = false; // sell flow assumed for-sale; rate heuristic below adapts anyway
  const baseRate = state.category === "Commercial" ? 9500 : state.category === "Plot / Land" ? 3200 : 5667;
  const low = Math.round((built*baseRate*0.92)/100000)*100000;
  const high = Math.round((built*baseRate*1.08)/100000)*100000;
  document.getElementById("insRange").textContent = `₹${(low/100000).toFixed(0)}L - ₹${(high/100000).toFixed(0)}L`;
  document.getElementById("insAvg").textContent = `₹${baseRate.toLocaleString("en-IN")}/Sq.Ft`;
}
updatePriceInsight();

document.getElementById("negToggle").onclick = function(){
  this.classList.toggle("on");
  state.negotiable = this.classList.contains("on");
};

const amenityGrid = document.getElementById("amenityGrid");
amenityGrid.innerHTML = ALL_AMENITIES.map(a=>`
  <div class="amenity-opt" data-a="${a}"><span class="ic-wrap-a">${ICON[AMENITY_ICON[a]]}</span>${a}</div>`).join("");
amenityGrid.addEventListener("click",(e)=>{
  const opt = e.target.closest(".amenity-opt");
  if(!opt) return;
  const a = opt.dataset.a;
  opt.classList.toggle("selected");
  if(state.amenities.includes(a)) state.amenities = state.amenities.filter(x=>x!==a);
  else state.amenities.push(a);
});

document.getElementById("fDesc").addEventListener("input",(e)=>{
  document.getElementById("descCount").textContent = `${e.target.value.length}/500`;
});

document.getElementById("cta4").onclick = ()=>{
  state.price = document.getElementById("fPrice").value;
  state.contact = document.getElementById("fContact").value;
  state.description = document.getElementById("fDesc").value.trim();
  if(!state.price){ toast("Please enter the expected price"); return; }
  renderReview();
  showStep(5);
};

// ---- Step 5: review & publish ----
function fmtPriceLabel(price){
  price = Number(price);
  if(price >= 10000000) return `₹ ${(price/10000000).toFixed(2)} Cr`;
  if(price >= 100000) return `₹ ${(price/100000).toFixed(1)} L`;
  return `₹ ${price.toLocaleString("en-IN")}`;
}

function renderReview(){
  document.getElementById("reviewThumb").src = state.photos[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&q=80";
  document.getElementById("reviewTitle").textContent = state.propType;
  document.getElementById("reviewLoc").textContent = `${state.project ? state.project+", " : ""}${state.locality}, ${state.city}`;
  document.getElementById("rvPrice").textContent = fmtPriceLabel(state.price) + (state.negotiable ? " (Negotiable)" : "");
  document.getElementById("rvBuiltUp").textContent = state.builtUp + " Sq.Ft";
  document.getElementById("rvCarpet").textContent = state.carpet ? state.carpet+" Sq.Ft" : "—";
  document.getElementById("rvBed").textContent = state.bedrooms;
  document.getElementById("rvBath").textContent = state.bathrooms;
  document.getElementById("rvFloor").textContent = (state.floorNo||"—") + " of " + (state.totalFloors||"—");
  document.getElementById("rvFurnish").textContent = state.furnishing;
  document.getElementById("rvAge").textContent = state.age;
  document.getElementById("rvAmenities").textContent = state.amenities.length ? state.amenities.slice(0,3).join(", ") + (state.amenities.length>3?` +${state.amenities.length-3} more`:"") : "None";
  const broker = DB.getBroker(state.brokerId);
  document.getElementById("rvBroker").textContent = broker ? broker.name : "None (unassigned)";
}

document.querySelectorAll(".edit").forEach(a=>{
  a.addEventListener("click",(e)=>{ e.preventDefault(); showStep(Number(a.dataset.goto)); });
});

document.getElementById("publishBtn").innerHTML = ICON.bolt + " List Property";
document.getElementById("fineprint").textContent = "🔒 Listed under Cityscope Vadodara's admin account";

document.getElementById("publishBtn").onclick = ()=>{
  const id = "u" + Date.now();
  const forType = "Sale";
  const broker = DB.getBroker(state.brokerId);
  const newProp = {
    id,
    title: state.propType,
    type: state.category,
    forType,
    price: Number(state.price),
    priceLabel: fmtPriceLabel(state.price),
    priceUnit:"",
    negotiable: state.negotiable,
    verified:true,
    isNew:true,
    locality: state.locality,
    city: state.city,
    fullLocation: `${state.address ? state.address+", " : ""}${state.locality}, ${state.city}, Gujarat`,
    bedrooms: state.bedrooms,
    bathrooms: state.bathrooms,
    area: Number(state.builtUp),
    parking: 1,
    facing: "East",
    rating: 5.0,
    reviews: 0,
    agent: broker ? broker.name : "Cityscope Realty",
    phone: broker ? broker.phone : (state.contact ? "+91"+state.contact.replace(/\D/g,"") : "+919876543210"),
    brokerId: state.brokerId || "",
    description: state.description || `${state.propType} available in ${state.locality}, ${state.city}. ${state.furnishing}, ${state.age.toLowerCase()} old, with ${state.amenities.length} amenities including ${state.amenities.slice(0,3).join(", ")||"standard facilities"}.`,
    amenities: state.amenities.length ? state.amenities : ["Power Backup"],
    images: state.photos.length ? state.photos : ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80"],
    lat:22.3072, lng:73.1812
  };
  DB.add(newProp);
  document.getElementById("publishBtn").disabled = true;
  document.getElementById("publishBtn").innerHTML = "Publishing…";
  setTimeout(()=>{
    window.location.href = `property.html?id=${id}`;
  }, 700);
};

showStep(0);
