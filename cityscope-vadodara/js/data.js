// ===== Cityscope Vadodara — data layer (localStorage-backed) =====

const AMENITY_ICON = {
  "Power Backup":"bolt","24x7 Security":"shield","CCTV Camera":"cctv","Gym":"dumbbell",
  "Garden":"tree","Club House":"club","Children Play Area":"kids","Rain Water Harvesting":"rain",
  "Swimming Pool":"pool","Fire Safety":"fire","Intercom":"wifi","Lift":"lift","Parking":"parking"
};
const ALL_AMENITIES = Object.keys(AMENITY_ICON);

const DEFAULT_PROPERTIES = [
  {
    id:"p1",
    title:"4 BHK Premium Villa",
    type:"Villa / House",
    forType:"Rent",
    price:35000,
    priceLabel:"₹ 35,000",
    priceUnit:"/mo",
    negotiable:true,
    verified:true,
    isNew:true,
    locality:"Gotri",
    city:"Vadodara",
    fullLocation:"Gotri, Vadodara, Gujarat 390021",
    bedrooms:4,
    bathrooms:4,
    area:2400,
    parking:2,
    facing:"East",
    rating:4.8,
    reviews:128,
    agent:"Cityscope Realty",
    phone:"+919876543210",
    description:"Experience luxury living in this beautiful 4 BHK villa located in the prime location of Gotri, Vadodara. Spacious rooms, modern architecture, premium fittings and peaceful surroundings make it an ideal home for your family. The villa features double-height living spaces, a private garden, and covered parking for two cars, all within a secure gated community close to schools, hospitals and the Gotri main road.",
    amenities:["Power Backup","24x7 Security","CCTV Camera","Gym","Garden","Club House","Children Play Area","Rain Water Harvesting"],
    images:[
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80"
    ],
    lat:22.3211, lng:73.1519
  },
  {
    id:"p2",
    title:"3 BHK Apartment",
    type:"Apartment",
    forType:"Sale",
    price:8500000,
    priceLabel:"₹ 85.0 L",
    priceUnit:"",
    negotiable:true,
    verified:true,
    isNew:false,
    locality:"Alkapuri",
    city:"Vadodara",
    fullLocation:"Alkapuri, Vadodara, Gujarat 390007",
    bedrooms:3,
    bathrooms:3,
    area:1650,
    parking:1,
    facing:"North",
    rating:4.6,
    reviews:82,
    agent:"Cityscope Realty",
    phone:"+919876543210",
    description:"A beautifully maintained 3 BHK apartment in the heart of Alkapuri, one of Vadodara's most sought-after neighbourhoods. Walking distance to Alkapuri market, top schools and reputed hospitals, this semi-furnished home offers a modular kitchen, ample natural light and a peaceful balcony view over a tree-lined street.",
    amenities:["Lift","Parking","Power Backup","24x7 Security","Intercom","Fire Safety"],
    images:[
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900&q=80"
    ],
    lat:22.3117, lng:73.1668
  },
  {
    id:"p3",
    title:"2 BHK Apartment",
    type:"Apartment",
    forType:"Rent",
    price:16000,
    priceLabel:"₹ 16,000",
    priceUnit:"/mo",
    negotiable:false,
    verified:true,
    isNew:false,
    locality:"Manjalpur",
    city:"Vadodara",
    fullLocation:"Manjalpur, Vadodara, Gujarat 390011",
    bedrooms:2,
    bathrooms:2,
    area:1050,
    parking:1,
    facing:"West",
    rating:4.3,
    reviews:41,
    agent:"Cityscope Realty",
    phone:"+919876543210",
    description:"Cosy and well-ventilated 2 BHK apartment in Manjalpur, ideal for small families and working professionals. Close to schools, supermarkets and the Manjalpur bus depot, with a dedicated covered parking spot and round-the-clock water supply.",
    amenities:["Lift","Parking","Power Backup","24x7 Security"],
    images:[
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=900&q=80"
    ],
    lat:22.2751, lng:73.1897
  },
  {
    id:"p4",
    title:"Residential Plot",
    type:"Plot / Land",
    forType:"Sale",
    price:4200000,
    priceLabel:"₹ 42.0 L",
    priceUnit:"",
    negotiable:true,
    verified:false,
    isNew:true,
    locality:"Waghodia Road",
    city:"Vadodara",
    fullLocation:"Waghodia Road, Vadodara, Gujarat 391760",
    bedrooms:0,
    bathrooms:0,
    area:1800,
    parking:0,
    facing:"South",
    rating:4.1,
    reviews:12,
    agent:"Cityscope Realty",
    phone:"+919876543210",
    description:"A clear-title residential plot on Waghodia Road with excellent road connectivity, ready for immediate construction. Located in a fast-developing corridor close to upcoming IT parks and educational institutions, this plot is a strong long-term investment opportunity.",
    amenities:["24x7 Security"],
    images:[
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80"
    ],
    lat:22.3350, lng:73.2340
  },
  {
    id:"p5",
    title:"Commercial Shop",
    type:"Commercial",
    forType:"Sale",
    price:6800000,
    priceLabel:"₹ 68.0 L",
    priceUnit:"",
    negotiable:true,
    verified:true,
    isNew:false,
    locality:"Sayajigunj",
    city:"Vadodara",
    fullLocation:"Sayajigunj, Vadodara, Gujarat 390005",
    bedrooms:0,
    bathrooms:1,
    area:420,
    parking:0,
    facing:"East",
    rating:4.5,
    reviews:19,
    agent:"Cityscope Realty",
    phone:"+919876543210",
    description:"Prime ground-floor commercial shop on the bustling Sayajigunj main road, with heavy footfall and high street visibility. Well-suited for retail, showroom or F&B use, with existing electrical and shutter fittings in place.",
    amenities:["24x7 Security","CCTV Camera","Fire Safety","Power Backup"],
    images:[
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80",
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=900&q=80"
    ],
    lat:22.3126, lng:73.1873
  },
  {
    id:"p6",
    title:"3 BHK Villa",
    type:"Villa / House",
    forType:"Sale",
    price:9800000,
    priceLabel:"₹ 98.0 L",
    priceUnit:"",
    negotiable:true,
    verified:true,
    isNew:true,
    locality:"Vasna-Bhayli Road",
    city:"Vadodara",
    fullLocation:"Vasna-Bhayli Road, Vadodara, Gujarat 391410",
    bedrooms:3,
    bathrooms:3,
    area:2100,
    parking:2,
    facing:"North-East",
    rating:4.7,
    reviews:56,
    agent:"Cityscope Realty",
    phone:"+919876543210",
    description:"Contemporary 3 BHK villa in a gated township off Vasna-Bhayli Road, offering a private terrace, landscaped lawn and dedicated two-car parking. Close to reputed schools and the upcoming ring-road connectivity.",
    amenities:["Garden","Club House","Swimming Pool","Gym","24x7 Security","Power Backup"],
    images:[
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900&q=80"
    ],
    lat:22.2820, lng:73.1180
  }
];

const DEFAULT_BROKERS = [
  {
    id:"b1",
    name:"Rakesh Mehta",
    photo:"https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=300&q=80",
    experience:12,
    expertise:"Luxury Villas & Independent Houses",
    phone:"+919876500001",
    bio:"Specialist in premium villas and independent houses across Gotri and Vasna-Bhayli, known for closing deals fast without compromising on price."
  },
  {
    id:"b2",
    name:"Priya Shah",
    photo:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80",
    experience:8,
    expertise:"Apartments & Residential Resale",
    phone:"+919876500002",
    bio:"Helps first-time buyers and families find the right apartment in Alkapuri and Manjalpur, with a sharp eye for fair resale pricing."
  },
  {
    id:"b3",
    name:"Aman Trivedi",
    photo:"https://images.unsplash.com/photo-1615109398623-88346a601842?w=300&q=80",
    experience:15,
    expertise:"Commercial & Plot Investments",
    phone:"+919876500003",
    bio:"15 years advising investors on commercial shops and land parcels along Vadodara's fastest-growing corridors."
  }
];

const DB = {
  KEY_PROPS:"cs_properties",
  KEY_SAVED:"cs_saved",
  KEY_DRAFT:"cs_sell_draft",
  KEY_BROKERS:"cs_brokers",
  KEY_ADMIN:"cs_admin_session",

  init(){
    if(!localStorage.getItem(this.KEY_PROPS)){
      localStorage.setItem(this.KEY_PROPS, JSON.stringify(DEFAULT_PROPERTIES));
    }
    if(!localStorage.getItem(this.KEY_SAVED)){
      localStorage.setItem(this.KEY_SAVED, JSON.stringify([]));
    }
    if(!localStorage.getItem(this.KEY_BROKERS)){
      localStorage.setItem(this.KEY_BROKERS, JSON.stringify(DEFAULT_BROKERS));
    }
  },
  all(){ return JSON.parse(localStorage.getItem(this.KEY_PROPS) || "[]"); },
  get(id){ return this.all().find(p=>p.id===id); },
  add(prop){
    const list = this.all();
    list.unshift(prop);
    localStorage.setItem(this.KEY_PROPS, JSON.stringify(list));
  },
  update(id, patch){
    const list = this.all();
    const i = list.findIndex(p=>p.id===id);
    if(i===-1) return null;
    list[i] = Object.assign({}, list[i], patch);
    localStorage.setItem(this.KEY_PROPS, JSON.stringify(list));
    return list[i];
  },
  remove(id){
    const list = this.all().filter(p=>p.id!==id);
    localStorage.setItem(this.KEY_PROPS, JSON.stringify(list));
  },
  getSavedKey() {
    const mobile = localStorage.getItem('cs_current_user_mobile');
    return mobile ? this.KEY_SAVED + '_' + mobile : this.KEY_SAVED;
  },
  savedIds(){ 
    if(!localStorage.getItem('cs_user_role')) return [];
    return JSON.parse(localStorage.getItem(this.getSavedKey()) || "[]"); 
  },
  isSaved(id){ return this.savedIds().includes(id); },
  toggleSave(id){
    let ids = this.savedIds();
    if(ids.includes(id)) ids = ids.filter(x=>x!==id);
    else ids.push(id);
    localStorage.setItem(this.getSavedKey(), JSON.stringify(ids));
    return ids.includes(id);
  },
  savedProperties(){
    const ids = this.savedIds();
    return this.all().filter(p=>ids.includes(p.id));
  },

  // ---- Brokers ----
  brokers(){ return JSON.parse(localStorage.getItem(this.KEY_BROKERS) || "[]"); },
  getBroker(id){ return this.brokers().find(b=>b.id===id); },
  addBroker(broker){
    const list = this.brokers();
    list.unshift(broker);
    localStorage.setItem(this.KEY_BROKERS, JSON.stringify(list));
    return broker;
  },
  removeBroker(id){
    const list = this.brokers().filter(b=>b.id!==id);
    localStorage.setItem(this.KEY_BROKERS, JSON.stringify(list));
  },

  // ---- Admin session ----
  isAdmin(){ return localStorage.getItem('cs_user_role') === 'admin'; },
  loginAdmin(password){
    // Handled in account.html directly
    return false;
  },
  logoutAdmin(){ 
    localStorage.removeItem('cs_user_role'); 
    localStorage.removeItem('cs_current_user_mobile');
    localStorage.removeItem('cs_current_user_name');
  }
};
DB.init();

function requireAdmin(){
  if(!DB.isAdmin()){ window.location.href = "account.html"; }
}

function brokerCardHTML(broker){
  if(!broker) return "";
  return `
  <div class="panel broker-card">
    <h4>Your Broker</h4>
    <div class="broker-top">
      <img class="broker-photo" src="${broker.photo}" alt="${broker.name}">
      <div class="broker-info">
        <div class="broker-name">${broker.name}</div>
        <div class="broker-exp">${ICON.star} ${broker.experience}+ Yrs Experience</div>
        <span class="broker-chip">${broker.expertise}</span>
      </div>
    </div>
    <p class="broker-bio">${broker.bio}</p>
    <div class="agent-actions">
      <button class="btn-outline" data-broker-call="${broker.phone}">${ICON.phone} Call Broker</button>
      <button class="btn-fill wa" data-broker-wa="${broker.phone}|${broker.name}">${ICON.whatsapp} WhatsApp</button>
    </div>
  </div>`;
}

function fmtArea(a){ return a ? a.toLocaleString("en-IN") : "0"; }

function toast(msg){
  let t = document.querySelector(".toast");
  if(!t){
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove("show"), 1800);
}

function propCardHTML(p, wide){
  const tagClass = p.forType === "Rent" ? "tag rent" : "tag";
  const tagText = p.forType === "Rent" ? "For Rent" : "For Sale";
  const saved = DB.isSaved(p.id);
  return `
  <a href="property.html?id=${p.id}" class="prop-card ${wide?'wide':''}">
    <div class="thumb">
      <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
      <span class="${tagClass}">${tagText}</span>
      <button class="fav-btn ${saved?'active':''}" data-fav="${p.id}" aria-label="Save property">${saved?ICON.heartFill:ICON.heart}</button>
    </div>
    <div class="body">
      <h3>${p.title}</h3>
      <div class="loc">${ICON.pin}<span>${p.locality}, ${p.city}</span></div>
      <div class="price">${p.priceLabel}<span> ${p.priceUnit}</span></div>
      <div class="specs">
        ${p.bedrooms?`<span>${ICON.bed} ${p.bedrooms} Bed</span>`:""}
        ${p.bathrooms?`<span>${ICON.bath} ${p.bathrooms} Bath</span>`:""}
        <span>${ICON.area} ${fmtArea(p.area)} Sq.Ft</span>
      </div>
    </div>
  </a>`;
}

function wireFavButtons(root=document){
  root.querySelectorAll(".fav-btn").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      e.preventDefault(); e.stopPropagation();
      const id = btn.dataset.fav;
      if(!localStorage.getItem('cs_user_role')) {
        sessionStorage.setItem('cs_toast_msg', 'login_to_save');
        window.location.href = 'account.html';
        return;
      }
      const isSaved = DB.toggleSave(id);
      btn.classList.toggle("active", isSaved);
      btn.innerHTML = isSaved ? ICON.heartFill : ICON.heart;
      toast(isSaved ? "Saved to your favourites" : "Removed from favourites");
    });
  });
}
