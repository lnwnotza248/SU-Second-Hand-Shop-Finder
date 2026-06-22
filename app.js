let showOnlyFavorites = false;
let shopsData = [];
let userPosition = null;
let map;
let markers = [];
let userMarker = null;
let directionsService;
let directionsRenderer;
let activeInfoWindow = null;
let currentLang = "th";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const formTranslations = {
  title: { th: "➕ เพิ่มร้านใหม่", zh: "➕ 添加新店", en: "➕ Add New Shop" },
  link: { th: "🔗 ลิงก์ Google Maps", zh: "🔗 Google 地图链接", en: "🔗 Google Maps Link" },
  hours: { th: "⏰ เวลาเปิด-ปิด", zh: "⏰ 营业时间", en: "⏰ Opening Hours" },
  rating: { th: "⭐ Rating", zh: "⭐ 评分", en: "⭐ Rating" },
  location: { th: "📍 ที่อยู่", zh: "📍 地址", en: "📍 Location" },
  desc: { th: "💬 รายละเอียด", zh: "💬 描述", en: "💬 Description" },
  price: { th: "💰 ราคา", zh: "💰 价格", en: "💰 Price" },
  image: { th: "📷 รูปภาพ", zh: "📷 图片", en: "📷 Image" },
  add: { th: "➕ เพิ่ม", zh: "➕ 添加", en: "➕ Add" },
  cancel: { th: "❌ ยกเลิก", zh: "❌ 取消", en: "❌ Cancel" },
  placeholderLink: { th: "วางลิงก์...", zh: "粘贴链接...", en: "Paste link..." },
  placeholderHours: { th: "เช่น 10:00-20:00", zh: "例如 10:00-20:00", en: "e.g. 10:00-20:00" },
  placeholderLocation: { th: "เช่น หน้ามหาวิทยาลัย", zh: "例如 大学附近", en: "e.g. near university" },
  placeholderDesc: { th: "เช่น เสื้อวินเทจ", zh: "例如 复古服装", en: "e.g. vintage clothes" },
  priceOptions: {
    low: { th: "💸 ไม่แพง(100-200)", zh: "💸 便宜(100-200)", en: "💸 Cheap (100-200)" },
    mid: { th: "💰 กลาง(100-500)", zh: "💰 中等(100-500)", en: "💰 Medium (100-500)" },
    high: { th: "💎 ราคาหลากหลาย(100-1000)", zh: "💎 多种价格(100-1000)", en: "💎 Various (100-1000)" }
  }
};

const buttonTranslations = {
  resetMap: { th: "🔄 รีเซ็ตแผนที่", zh: "🔄 重置地图", en: "🔄 Reset Map" },
  locateUser: { th: "📍 ตำแหน่งของฉัน", zh: "📍 我的位置", en: "📍 My Location" },
  survey: { th: "📝 กรอกแบบสอบถาม", zh: "📝 填写问卷", en: "📝 Fill Survey" },
  favorite: { th: "❤️ ร้านที่ชอบ", zh: "❤️ 收藏店铺", en: "❤️ Favorites" },
  addShop: { th: "➕ เพิ่มร้านจากลิงก์", zh: "➕ 添加店铺", en: "➕ Add Shop" }
};

const translations = {
  title: { th: "ร้านทั้งหมด", zh: "所有商店", en: "All Shops" },
  searchPlaceholder: { th: "ค้นหาร้าน...", zh: "搜索店铺...", en: "Search shops..." },
  categoryOptions: {
    all: { th: "ทุกหมวด", zh: "所有类别", en: "All Categories" },
    Vintage: { th: "Vintage", zh: "复古", en: "Vintage" },
    Streetwear: { th: "Streetwear", zh: "街头风", en: "Streetwear" },
    ญี่ปุ่น: { th: "ญี่ปุ่น", zh: "日本风", en: "Japanese" }
  },
  priceOptions: {
    all: { th: "ทุกช่วงราคา", zh: "所有价格", en: "All Prices" },
    low: { th: "💸 ไม่แพง", zh: "💸 不贵", en: "💸 Cheap" },
    mid: { th: "💰 กลาง", zh: "💰 中等", en: "💰 Medium" },
    high: { th: "💎 หลากหลาย", zh: "💎 各种价格", en: "💎 Various" }
  },
  mapLinkText: { th: "📌 เปิดใน Google Maps", zh: "📌 在 Google Maps 打开", en: "📌 Open in Google Maps" },
  lastUpdateText: { th: "อัปเดตล่าสุด: ", zh: "最后更新: ", en: "Last updated: " },
  filtersHeader: { th: "ตัวกรอง", zh: "筛选器", en: "Filters" },
  unknown: { th: "ไม่ทราบ", zh: "未知", en: "Unknown" }
};

const shopHoursData = [
  {
    id: 0,
    name: { th: "Perch Club Thrift Store", zh: "Perch 俱乐部二手店", en: "Perch Club Thrift Store" },
    hours: { Monday: "15:00-20:00", Tuesday: "15:00-20:00", Wednesday: "closed", Thursday: "15:00-20:00", Friday: "15:00-20:00", Saturday: "15:00-20:00", Sunday: "15:00-20:00" }
  },
  {
    id: 1,
    name: { th: "ฉยล Vintage", zh: "Chayan Vintage 店", en: "Chayan Vintage" },
    hours: { Monday: "09:00-22:00", Tuesday: "09:00-22:00", Wednesday: "09:00-22:00", Thursday: "09:00-22:00", Friday: "09:00-22:00", Saturday: "09:00-22:00", Sunday: "09:00-22:00" }
  },
  {
    id: 2,
    name: { th: "Silpakorn Thrift Market", zh: "Silpakorn 二手市场", en: "Silpakorn Thrift Market" },
    hours: { Monday: "closed", Tuesday: "closed", Wednesday: "09:00-14:00", Thursday: "closed", Friday: "closed", Saturday: "closed", Sunday: "closed" }
  },
  {
    id: 3,
    name: { th: "โกดังวินเทจ สาขา1", zh: "复古仓库 分店1", en: "Vintage Warehouse Branch 1" },
    hours: { Monday: "closed", Tuesday: "16:00-00:00", Wednesday: "16:00-00:00", Thursday: "16:00-00:00", Friday: "16:00-00:00", Saturday: "16:00-00:00", Sunday: "16:00-00:00" }
  },
  {
    id: 4,
    name: { th: "ร้านเสื้อยืดมือสอง ถนนคนเดิน", zh: "步行街二手T恤店", en: "Second-hand T-Shirt Street Shop" },
    hours: { Monday: "09:00-22:00", Tuesday: "09:00-22:00", Wednesday: "09:00-22:00", Thursday: "09:00-22:00", Friday: "09:00-22:00", Saturday: "09:00-22:00", Sunday: "09:00-22:00" }
  },
  {
    id: 5,
    name: { th: "Brown Lady", zh: "布朗女士店", en: "Brown Lady" },
    hours: { Monday: "12:00-22:00", Tuesday: "12:00-22:00", Wednesday: "12:00-22:00", Thursday: "12:00-22:00", Friday: "12:00-22:00", Saturday: "12:00-22:00", Sunday: "12:00-22:00" }
  },
  {
    id: 6,
    name: { th: "Happy Tee", zh: "Happy Tee 店", en: "Happy Tee" },
    hours: { Monday: "10:00-20:00", Tuesday: "10:00-20:00", Wednesday: "10:00-20:00", Thursday: "10:00-20:00", Friday: "10:00-20:00", Saturday: "10:00-20:00", Sunday: "10:00-20:00" }
  },
  {
    id: 7,
    name: { th: "Big-E มือสอง", zh: "Big-E 二手店", en: "Big-E Second-hand" },
    hours: { Monday: "09:00-18:00", Tuesday: "09:00-18:00", Wednesday: "09:00-18:00", Thursday: "09:00-18:00", Friday: "09:00-18:00", Saturday: "09:00-18:00", Sunday: "09:00-18:00" }
  },
  {
    id: 8,
    name: { th: "Vtassei (ญี่ปุ่น)", zh: "Vtassei (日本)", en: "Vtassei (Japan)" },
    hours: { Monday: "11:00-22:00", Tuesday: "11:00-22:00", Wednesday: "11:00-22:00", Thursday: "11:00-22:00", Friday: "11:00-22:00", Saturday: "11:00-22:00", Sunday: "11:00-22:00" }
  },
  {
    id: 9,
    name: { th: "โรงเกลือมาร์เก็ต", zh: "Rong Kluea 市场", en: "Rong Kluea Market" },
    hours: { Monday: "08:00-20:00", Tuesday: "08:00-20:00", Wednesday: "08:00-20:00", Thursday: "08:00-20:00", Friday: "08:00-20:00", Saturday: "08:00-20:00", Sunday: "08:00-20:00" }
  }
];

function updateSidebarToggleButton() {
  const sidebar = document.querySelector(".sidebar");
  const btn = document.getElementById("toggleSidebar");
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    btn.style.left = "";
    btn.style.top = "";
    btn.style.bottom = "24px";
    btn.style.transform = "translateX(-50%)";
    btn.innerText = sidebar.classList.contains("hidden") ? "☰ แสดงร้าน" : "✕ ซ่อน";
  } else {
    btn.style.bottom = "";
    btn.style.top = "50%";
    btn.style.transform = "translateY(-50%)";
    btn.style.left = sidebar.classList.contains("hidden") ? "0" : "340px";
    btn.innerText = sidebar.classList.contains("hidden") ? ">" : "<";
  }
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("hidden");
  updateSidebarToggleButton();
}

function setupEventListeners() {
  document.getElementById("toggleSidebar").addEventListener("click", toggleSidebar);
  document.getElementById("language").addEventListener("change", changeLanguage);
  document.getElementById("search").addEventListener("input", applyFilters);
  document.getElementById("category").addEventListener("change", applyFilters);
  document.getElementById("price").addEventListener("change", applyFilters);
  document.getElementById("btnResetMap").addEventListener("click", resetMap);
  document.getElementById("btnFavoriteFilter").addEventListener("click", toggleFavoriteFilter);
  document.getElementById("btnLocateUser").addEventListener("click", locateUser);
  document.getElementById("btnSurvey").addEventListener("click", () => window.open("https://forms.gle/tyC2Jc1Na3iUEhqs6", "_blank"));
  document.getElementById("btnAddShop").addEventListener("click", openLinkForm);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("imageModal").addEventListener("click", closeModal);
  document.querySelector("#linkForm .modal-content").addEventListener("click", event => event.stopPropagation());
  document.getElementById("linkForm").addEventListener("click", closeLinkForm);
  document.getElementById("btnSubmit").addEventListener("click", addShopFromLink);
  document.getElementById("btnCancel").addEventListener("click", closeLinkForm);
  window.addEventListener("resize", updateSidebarToggleButton);
}

window.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  updateSidebarToggleButton();
  changeLanguage();
});

function loadAllShops() {
  const userShops = JSON.parse(localStorage.getItem("userShops")) || [];

  fetch("shops.json")
    .then(response => {
      if (!response.ok) throw new Error("โหลด shops.json ไม่ได้");
      return response.json();
    })
    .then(data => {
      shopsData = [...data, ...userShops];
      applyFilters();
    })
    .catch(err => {
      console.warn("ใช้เฉพาะ userShops แทน:", err);
      shopsData = [...userShops];
      applyFilters();
    });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  applyFilters();
}

function toggleFavoriteFilter() {
  showOnlyFavorites = !showOnlyFavorites;
  const btn = document.getElementById("btnFavoriteFilter");

  if (showOnlyFavorites) {
    btn.style.background = "#ef4444";
    btn.style.color = "white";
  } else {
    btn.style.background = "";
    btn.style.color = "";
  }

  applyFilters();
}

function isOpenNow(shop) {
  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = dayNames[now.getDay()];
  const hours = shop.hours[day];
  if (!hours || hours === "closed") return false;

  const [start, end] = hours.split("-").map(t => t.split(":").map(Number));
  const startDate = new Date(now);
  startDate.setHours(start[0], start[1], 0, 0);
  let endDate = new Date(now);
  endDate.setHours(end[0], end[1], 0, 0);
  if (endDate < startDate) endDate.setDate(endDate.getDate() + 1);
  return now >= startDate && now <= endDate;
}

shopHoursData.forEach(shop => {
  console.log(
    `🇹🇭 ${shop.name.th} : ${isOpenNow(shop) ? "✅ เปิด" : "❌ ปิด"}` +
    `\n🇨🇳 ${shop.name.zh} : ${isOpenNow(shop) ? "✅ 营业中" : "❌ 关闭"}` +
    `\n🇬🇧 ${shop.name.en} : ${isOpenNow(shop) ? "✅ Open" : "❌ Closed"}`
  );
});

function changeLanguage() {
  currentLang = document.getElementById("language").value;
  document.getElementById("title").innerText = translations.title[currentLang];
  document.getElementById("controlsHeader").innerText = translations.filtersHeader[currentLang];
  document.getElementById("search").placeholder = translations.searchPlaceholder[currentLang];
  document.getElementById("btnResetMap").innerText = buttonTranslations.resetMap[currentLang];
  document.getElementById("btnLocateUser").innerText = buttonTranslations.locateUser[currentLang];
  document.getElementById("btnSurvey").innerText = buttonTranslations.survey[currentLang];
  document.getElementById("btnFavoriteFilter").innerText = buttonTranslations.favorite[currentLang];
  document.getElementById("btnAddShop").innerText = buttonTranslations.addShop[currentLang];

  const priceSelectForm = document.getElementById("shopPrice");
  priceSelectForm.options[0].text = formTranslations.priceOptions.low[currentLang];
  priceSelectForm.options[1].text = formTranslations.priceOptions.mid[currentLang];
  priceSelectForm.options[2].text = formTranslations.priceOptions.high[currentLang];

  document.getElementById("formTitle").innerText = formTranslations.title[currentLang];
  document.getElementById("labelLink").innerText = formTranslations.link[currentLang];
  document.getElementById("labelHours").innerText = formTranslations.hours[currentLang];
  document.getElementById("labelRating").innerText = formTranslations.rating[currentLang];
  document.getElementById("labelLocation").innerText = formTranslations.location[currentLang];
  document.getElementById("labelDesc").innerText = formTranslations.desc[currentLang];
  document.getElementById("labelPrice").innerText = formTranslations.price[currentLang];
  document.getElementById("labelImage").innerText = formTranslations.image[currentLang];
  document.getElementById("btnSubmit").innerText = formTranslations.add[currentLang];
  document.getElementById("btnCancel").innerText = formTranslations.cancel[currentLang];
  document.getElementById("mapLink").placeholder = formTranslations.placeholderLink[currentLang];
  document.getElementById("shopHours").placeholder = formTranslations.placeholderHours[currentLang];
  document.getElementById("shopLocation").placeholder = formTranslations.placeholderLocation[currentLang];
  document.getElementById("shopDesc").placeholder = formTranslations.placeholderDesc[currentLang];

  const categorySelect = document.getElementById("category");
  Object.keys(translations.categoryOptions).forEach((key, i) => {
    categorySelect.options[i].text = translations.categoryOptions[key][currentLang];
  });

  const priceSelect = document.getElementById("price");
  Object.keys(translations.priceOptions).forEach((key, i) => {
    priceSelect.options[i].text = translations.priceOptions[key][currentLang];
  });

  updateDateDisplay();
  applyFilters();
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 13.8196, lng: 100.0405 },
    zoom: 15
  });

  map.addListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.add("hidden");
    updateSidebarToggleButton();
  });

  updateDateDisplay();
  loadAllShops();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
  directionsRenderer.setMap(map);
  locateUser();
}

function generateImagesHTML(shop) {
  let html = "<div class=\"image-scroll\">";
  const images = shop.images && shop.images.length ? shop.images : ["https://via.placeholder.com/200"];

  images.forEach(img => {
    html += `<img src="${img}" onclick="openModal('${img}')" class="preview-image" alt="shop image">`;
  });

  html += "</div>";
  return html;
}

function locateUser() {
  if (!navigator.geolocation) {
    alert(currentLang === 'th' ? "เบราว์เซอร์นี้ไม่รองรับการหาตำแหน่ง" : currentLang === 'zh' ? "此浏览器不支持定位" : "Browser doesn't support geolocation");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
      userPosition = pos;

      if (userMarker) {
        userMarker.setPosition(pos);
      } else {
        userMarker = new google.maps.Marker({
          position: pos,
          map,
          icon: {
            url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            scaledSize: new google.maps.Size(40, 40)
          },
          title: currentLang === 'th' ? "คุณอยู่ที่นี่" : currentLang === 'zh' ? "你的位置" : "You are here"
        });
      }

      map.panTo(pos);
      applyFilters();
    },
    () => {
      alert(currentLang === 'th' ? "ไม่สามารถระบุตำแหน่งของคุณได้" : currentLang === 'zh' ? "无法获取您的位置" : "Cannot get your location");
    }
  );
}

function applyFilters() {
  const keyword = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;

  const filtered = shopsData.filter(shop => {
    const matchName = shop.name[currentLang].toLowerCase().includes(keyword);
    const matchCategory = category === "all" || (shop.food && shop.food.includes(category));
    const matchPrice = price === "all" || shop.price === price;
    const matchFavorite = !showOnlyFavorites || favorites.includes(shop.id);
    return matchName && matchCategory && matchPrice && matchFavorite;
  });

  renderMarkers(filtered);
  renderList(filtered);
}

function openModal(imgSrc) {
  const modal = document.getElementById("imageModal");
  document.getElementById("modalImg").src = imgSrc;
  modal.classList.remove("modal-hidden");
}

function closeModal() {
  document.getElementById("imageModal").classList.add("modal-hidden");
}

function renderMarkers(filtered) {
  markers.forEach(m => m.setMap(null));
  markers = [];

  filtered.forEach(shop => {
    let color = "blue";
    if (shop.price === "low") color = "green";
    if (shop.price === "mid") color = "yellow";
    if (shop.price === "high") color = "red";

    const marker = new google.maps.Marker({
      position: { lat: shop.lat, lng: shop.lng },
      map,
      icon: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
    });

    const shopWithHours = shopHoursData.find(s => s.id === shop.id);
    const openNow = shopWithHours ? isOpenNow(shopWithHours) : false;
    const openText = currentLang === 'th' ? (openNow ? "✅ เปิดตอนนี้" : "❌ ปิดตอนนี้") : currentLang === 'zh' ? (openNow ? "✅ 营业中" : "❌ 关闭") : (openNow ? "✅ Open now" : "❌ Closed now");

    const info = new google.maps.InfoWindow({
      content: `
        <div class="info-window">
          ${generateImagesHTML(shop)}
          <button onclick="openModal('${shop.images[0] || 'https://via.placeholder.com/200'}')" class="info-button">📷 ดูรูปทั้งหมด</button>
          <br>
          <div class="route-buttons">
            <button onclick="getRouteToShop(${shop.lat}, ${shop.lng}, 'WALKING')">🚶</button>
            <button onclick="getRouteToShop(${shop.lat}, ${shop.lng}, 'DRIVING')">🚗</button>
            <button onclick="getRouteToShop(${shop.lat}, ${shop.lng}, 'BICYCLING')">🚴</button>
          </div>
          <div class="info-note">*${currentLang === 'th' ? 'เส้นทางจะเปิดใน Google Maps' : currentLang === 'zh' ? '路线将在 Google Maps 打开' : 'Route opens in Google Maps'}*</div>
          <h3 style="margin:0">${shop.name[currentLang]}</h3>
          <p>⭐ ${shop.rating}</p>
          <p>📍 ${shop.location[currentLang]}</p>
          <p>🏷️ ${shop.food ? shop.food.join(", ") : ""}</p>
          <p>💰 ${shop.priceText?.[currentLang] || shop.price}</p>
          <p style="font-size:13px">${shop.description[currentLang] || ""}</p>
          <p>${openText}</p>
          <hr>
          <div style="font-size:13px">
            <b>${currentLang === 'th' ? 'เวลาทำการ' : currentLang === 'zh' ? '营业时间' : 'Opening Hours'}:</b><br>
            ${shopWithHours ? Object.entries(shopWithHours.hours).map(([day, h]) => {
              let dayText;
              if (currentLang === 'th') {
                const daysTH = { Sunday: "อาทิตย์", Monday: "จันทร์", Tuesday: "อังคาร", Wednesday: "พุธ", Thursday: "พฤหัสบดี", Friday: "ศุกร์", Saturday: "เสาร์" };
                dayText = daysTH[day];
              } else if (currentLang === 'zh') {
                const daysCN = { Sunday: "周日", Monday: "周一", Tuesday: "周二", Wednesday: "周三", Thursday: "周四", Friday: "周五", Saturday: "周六" };
                dayText = daysCN[day];
              } else {
                dayText = day;
              }
              return `${dayText}: ${h}`;
            }).join("<br>") : "No data"}
          </div>
          <a href="${shop.link}" target="_blank">${translations.mapLinkText[currentLang]}</a>
          <br>
          <button onclick="getRouteToShop(${shop.lat}, ${shop.lng})" style="margin-top:5px;padding:5px;width:100%;">${currentLang === 'th' ? 'ดูเส้นทาง' : currentLang === 'zh' ? '查看路线' : 'Get Directions'}</button>
        </div>
      `
    });

    marker.addListener("click", () => {
      if (activeInfoWindow) activeInfoWindow.close();
      info.open(map, marker);
      activeInfoWindow = info;
      map.panTo(marker.getPosition());
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => marker.setAnimation(null), 1400);
    });

    marker.info = info;
    markers.push(marker);
  });
}

function deleteShop(id) {
  if (!confirm(currentLang === 'th' ? "คุณแน่ใจว่าจะลบร้านนี้?" : currentLang === 'zh' ? "您确定要删除此商店吗？" : "Are you sure you want to delete this shop?")) return;
  let userShops = JSON.parse(localStorage.getItem("userShops")) || [];
  userShops = userShops.filter(shop => shop.id !== id);
  localStorage.setItem("userShops", JSON.stringify(userShops));
  loadAllShops();
}

function renderList(filtered) {
  document.getElementById("shopCount").innerText = `${currentLang === 'th' ? 'ทั้งหมด' : currentLang === 'zh' ? '总计' : 'Total'} ${filtered.length}`;
  const list = document.getElementById("shopList");
  list.innerHTML = "";

  filtered.forEach(shop => {
    const shopWithHours = shopHoursData.find(s => s.id === shop.id);
    const openNow = shopWithHours ? isOpenNow(shopWithHours) : false;
    const distance = userPosition ? getDistance(userPosition.lat, userPosition.lng, shop.lat, shop.lng).toFixed(2) : null;

    const div = document.createElement("div");
    div.className = "shop-card";
    if (openNow) div.classList.add("shop-open");

    div.innerHTML = `
      <img src="${shop.images[0] || 'https://via.placeholder.com/200'}" alt="${shop.name[currentLang]}">
      ${shop.isUserAdded ? `<div class="delete-pin"><span class="delete-button" onclick="event.stopPropagation(); deleteShop(${shop.id})">🗑️</span></div>` : ""}
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong>${shop.name[currentLang]}</strong>
        <span class="favorite-toggle" onclick="event.stopPropagation(); toggleFavorite(${shop.id})">${favorites.includes(shop.id) ? "❤️" : "🤍"}</span>
      </div>
      <div>⭐ ${shop.rating}</div>
      <div>${shop.priceText?.[currentLang] || shop.price}</div>
      <div>📍 ${shop.location[currentLang]}</div>
      ${distance ? `<div>📏 ${distance} km</div>` : ""}
      <div>${openNow ? (currentLang === 'th' ? "✅ เปิดตอนนี้" : currentLang === 'zh' ? "✅ 营业中" : "✅ Open now") : (currentLang === 'th' ? "❌ ปิดตอนนี้" : currentLang === 'zh' ? "❌ 关闭" : "❌ Closed now")}</div>
    `;

    div.addEventListener("click", () => {
      map.setCenter({ lat: shop.lat, lng: shop.lng });
      map.setZoom(17);
      const marker = markers.find(m => Math.abs(m.getPosition().lat() - shop.lat) < 0.00001 && Math.abs(m.getPosition().lng() - shop.lng) < 0.00001);
      if (marker) {
        if (activeInfoWindow) activeInfoWindow.close();
        marker.info.open(map, marker);
        activeInfoWindow = marker.info;
        map.panTo(marker.getPosition());
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 1000);
      }
    });

    list.appendChild(div);
  });
}

function extractDataFromGoogleMaps(url) {
  const realMatch = url.match(/!3d([-0-9.]+)!4d([-0-9.]+)/);
  const coordMatch = url.match(/@([-0-9.]+),([-0-9.]+)/);
  let lat = null;
  let lng = null;

  if (realMatch) {
    lat = parseFloat(realMatch[1]);
    lng = parseFloat(realMatch[2]);
  } else if (coordMatch) {
    lat = parseFloat(coordMatch[1]);
    lng = parseFloat(coordMatch[2]);
  }

  if (lat === null || lng === null) return null;

  const nameMatch = url.match(/place\/([^/]+)/);
  const name = nameMatch ? decodeURIComponent(nameMatch[1].replace(/\+/g, " ")) : "ร้านใหม่";
  return { lat, lng, name };
}

function addShopFromLink() {
  const url = document.getElementById("mapLink").value;
  const data = extractDataFromGoogleMaps(url);
  const category = document.getElementById("shopCategory").value;
  if (!data) {
    alert(currentLang === 'th' ? "ลิงก์ไม่ถูกต้อง" : currentLang === 'zh' ? "链接不正确" : "Invalid link");
    return;
  }

  const hours = document.getElementById("shopHours").value || translations.unknown[currentLang];
  const ratingInput = document.getElementById("shopRating").value;
  const rating = ratingInput ? parseFloat(ratingInput) : translations.unknown[currentLang];
  const location = document.getElementById("shopLocation").value || translations.unknown[currentLang];
  const desc = document.getElementById("shopDesc").value || translations.unknown[currentLang];
  const price = document.getElementById("shopPrice").value || "low";
  const file = document.getElementById("shopImage").files[0];

  const saveShop = img => {
    const newShop = {
      id: Date.now(),
      isUserAdded: true,
      category,
      name: { th: data.name, en: data.name, zh: data.name },
      lat: data.lat,
      lng: data.lng,
      rating: rating !== translations.unknown[currentLang] ? rating : 0,
      price,
      priceText: {
        th: price === "low" ? "💸 ไม่แพง" : price === "mid" ? "💰 กลาง" : "💎 แพง",
        en: price === "low" ? "💸 Cheap" : price === "mid" ? "💰 Medium" : "💎 Various",
        zh: price === "low" ? "💸 便宜" : price === "mid" ? "💰 中等" : "💎 多种价格"
      },
      food: [category],
      location: { th: location, en: location, zh: location },
      description: { th: desc, en: desc, zh: desc },
      hoursText: hours,
      images: [img],
      link: url
    };

    const userShops = JSON.parse(localStorage.getItem("userShops")) || [];
    userShops.push(newShop);
    localStorage.setItem("userShops", JSON.stringify(userShops));
    closeLinkForm();
    loadAllShops();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = event => saveShop(event.target.result);
    reader.readAsDataURL(file);
  } else {
    saveShop("https://via.placeholder.com/200");
  }
}

function resetMap() {
  map.setCenter({ lat: 13.8196, lng: 100.0405 });
  map.setZoom(15);
  if (activeInfoWindow) activeInfoWindow.close();
}

function getRouteToShop(lat, lng, mode) {
  if (!userPosition) {
    alert(currentLang === 'th' ? "กรุณากด 'ตำแหน่งของฉัน' ก่อน" : currentLang === 'zh' ? "请先点击'我的位置'" : "Please click 'My Location' first");
    return;
  }

  let travelMode = "walking";
  if (mode === "DRIVING") travelMode = "driving";
  if (mode === "BICYCLING") travelMode = "bicycling";
  const url = `https://www.google.com/maps/dir/?api=1&origin=${userPosition.lat},${userPosition.lng}&destination=${lat},${lng}&travelmode=${travelMode}`;
  window.open(url, "_blank");
}

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function openLinkForm() {
  changeLanguage();
  document.getElementById("linkForm").classList.remove("modal-hidden");
}

function closeLinkForm() {
  document.getElementById("linkForm").classList.add("modal-hidden");
}

function updateDateDisplay() {
  const dateContainer = document.getElementById("lastUpdate");
  const today = new Date();
  let formattedDate = "";

  switch (currentLang) {
    case "th":
      formattedDate = today.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
      break;
    case "en":
      formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      break;
    case "zh": {
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      formattedDate = `${today.getFullYear()}年${month}月${day}日`;
      break;
    }
  }

  dateContainer.innerText = translations.lastUpdateText[currentLang] + formattedDate;
}
