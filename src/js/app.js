
const content = document.getElementById('content');
const categoriesEl = document.getElementById('categories');
const searchInput = document.getElementById('search');

let apps = [];

fetch('data/apps.json')
.then(r=>r.json())
.then(data=>{
  apps = data;
  renderCategories();
  renderGrid(apps);
});

function renderCategories(){
  const categories = [...new Set(apps.map(a=>a.category))];

  categoriesEl.innerHTML = '';

  categories.forEach(cat=>{
    const div = document.createElement('div');
    div.className = 'category';
    div.textContent = cat;

    div.onclick = ()=>{
      renderGrid(apps.filter(a=>a.category===cat));
    };

    categoriesEl.appendChild(div);
  });
}

function renderGrid(items){
  content.className = 'grid';
  content.innerHTML = items.map(app=>`
    <div class="card">
      <h3>${app.icon} ${app.name}</h3>
      <p>${app.description}</p>
      <div class="tags">
        ${app.tags.map(tag=>`<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderTree(items){
  content.className = 'tree';

  const grouped = {};

  items.forEach(app=>{
    if(!grouped[app.category]) grouped[app.category] = [];
    grouped[app.category].push(app);
  });

  content.innerHTML = Object.entries(grouped).map(([cat, apps])=>`
    <div>
      <h2>${cat}</h2>
      ${apps.map(a=>`
        <div class="tree-item">${a.icon} ${a.name}</div>
      `).join('')}
    </div>
  `).join('');
}

document.getElementById('gridBtn').onclick = ()=>renderGrid(apps);
document.getElementById('treeBtn').onclick = ()=>renderTree(apps);

searchInput.addEventListener('input', e=>{
  const q = e.target.value.toLowerCase();

  const filtered = apps.filter(a=>
    a.name.toLowerCase().includes(q) ||
    a.tags.join(' ').toLowerCase().includes(q)
  );

  renderGrid(filtered);
});
