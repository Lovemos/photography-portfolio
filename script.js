const demoPhotos = [
  ["land-01","https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=86","暮色中的山谷","风经过的地方","风光","2026"],
  ["land-02","https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=86","雪山与星空","寂静以北","风光","2025"],
  ["land-03","https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=86","湖畔群山","远岸","风光","2025"],
  ["street-01","https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=86","夜色中的城市街道","霓虹之后","街景","2026"],
  ["street-02","https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=86","城市建筑与行人","城市切片","街景","2025"],
  ["street-03","https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=1400&q=86","雨中的街角","雨夜来信","街景","2024"],
  ["people-01","https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=86","自然光女性肖像","无声对白","人文","2026"],
  ["people-02","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1400&q=86","男性人物肖像","途中","人文","2025"],
  ["people-03","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=86","街头女性肖像","春日侧影","人文","2025"],
  ["cos-01","https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=86","戏剧感服装肖像","异世界来客","Cosplay","2026"],
  ["cos-02","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=86","红色造型时尚肖像","绯色章节","Cosplay","2025"],
  ["cos-03","https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=86","电影感角色肖像","幕间","Cosplay","2025"],
  ["park-01","https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=86","晨光中的城市公园","树影之间","公园","2026"],
  ["portrait-01","https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1400&q=86","自然光人像写真","午后微光","人像约拍","2026"]
].map(([id,src,alt,title,category,year])=>({id,src,alt,title,category,year}));
const photos = Array.isArray(window.GENERATED_PHOTOS) && window.GENERATED_PHOTOS.length ? window.GENERATED_PHOTOS : demoPhotos;
const byFilenameDescending = (a,b) => b.title.localeCompare(a.title,"zh-CN",{numeric:true,sensitivity:"base"});

const gallery=document.querySelector("#gallery"),lightbox=document.querySelector("#lightbox"),lightboxImage=document.querySelector("#lightbox-image");
let visible=photos,activeIndex=0;
document.querySelector("#hero-image").src=photos[0].src;
document.querySelector("#hero-image").alt=photos[0].alt;
document.querySelector("#hero-total").textContent=String(photos.length).padStart(2,"0");
document.querySelector("#archive-total").textContent=String(photos.length).padStart(2,"0");

function render(category="全部"){
  visible=(category==="全部"?photos:photos.filter(photo=>photo.category===category)).slice().sort(byFilenameDescending);
  gallery.innerHTML=visible.map((photo,index)=>`<button class="photo-card" data-index="${index}" style="animation-delay:${Math.min(index,8)*65}ms" aria-label="查看${photo.category}摄影作品"><span class="photo-frame"><img src="${photo.src}" alt="${photo.category}摄影作品" width="${photo.width}" height="${photo.height}" loading="lazy"></span><span class="photo-meta"><small>${photo.category} · ${photo.year}</small><i>${String(index+1).padStart(2,"0")}</i></span></button>`).join("");
  gallery.querySelectorAll(".photo-card").forEach(card=>card.addEventListener("click",()=>openLightbox(Number(card.dataset.index))));
  scheduleMasonry();
}
let masonryFrame=0;
function layoutMasonry(){
  const gap=innerWidth<=760?28:innerWidth*.045;
  gallery.querySelectorAll(".photo-card").forEach(card=>{
    card.style.gridRowEnd="auto";
    card.style.gridRowEnd=`span ${Math.ceil(card.getBoundingClientRect().height+gap)}`;
  });
}
function scheduleMasonry(){cancelAnimationFrame(masonryFrame);masonryFrame=requestAnimationFrame(layoutMasonry)}
function openLightbox(index){activeIndex=index;const photo=visible[index];lightboxImage.src=photo.src;lightboxImage.alt=`${photo.category}摄影作品`;lightbox.hidden=false;document.body.style.overflow="hidden"}
function closeLightbox(){lightbox.hidden=true;document.body.style.overflow=""}
function move(direction){openLightbox((activeIndex+direction+visible.length)%visible.length)}

document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-filter]").forEach(item=>item.classList.remove("active"));button.classList.add("active");render(button.dataset.filter)}));
document.querySelector("#close-lightbox").addEventListener("click",closeLightbox);document.querySelector("#prev-photo").addEventListener("click",()=>move(-1));document.querySelector("#next-photo").addEventListener("click",()=>move(1));lightbox.addEventListener("click",event=>{if(event.target===lightbox)closeLightbox()});
window.addEventListener("keydown",event=>{if(lightbox.hidden)return;if(event.key==="Escape")closeLightbox();if(event.key==="ArrowLeft")move(-1);if(event.key==="ArrowRight")move(1)});
window.addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector("#scroll-progress").style.transform=`scaleX(${max?scrollY/max:0})`},{passive:true});
window.addEventListener("resize",scheduleMasonry,{passive:true});
render();
