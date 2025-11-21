


const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsEl = document.getElementById('results');
const noResultsEl = document.getElementById('no-results');


let teams = [];


async function loadData(){
try{
const res = await fetch('data.json');
teams = await res.json();
    renderTeams(teams); 
}catch(err){
console.error('Erro ao carregar data.json — lembre de rodar via servidor local:', err);
teams = [];
}
}


function normalize(str){
return String(str).toLowerCase();
}


function teamMatchesQuery(team, q){
const normalizedQ = normalize(q);
  return normalize(team.nomeCompleto).includes(normalizedQ) ||
         normalize(team.id).includes(normalizedQ) ||
         normalize(team.estado).includes(normalizedQ) ||
         normalize(team.estadio).includes(normalizedQ) ||
         (Array.isArray(team.jogadores) && team.jogadores.some(player => normalize(player).includes(normalizedQ))) ||
         normalize(team.posicaoBrasileirao?.situacao || '').includes(normalizedQ);
}


function createCard(team){
const card = document.createElement('article');
card.className = 'card';


const escudo = document.createElement('div');
escudo.className = 'escudo';
const img = document.createElement('img');
img.src = team.escudo || 'https://via.placeholder.com/80x80.png?text=?';
img.alt = `${team.nomeCompleto} escudo`;
img.width = 80; img.height = 80; img.style.borderRadius = '8px';
escudo.appendChild(img);


const content = document.createElement('div');
content.className = 'card-content';


const title = document.createElement('h3');
title.textContent = team.nomeCompleto;


const subtitle = document.createElement('div');
subtitle.className = 'meta';
subtitle.innerHTML = `ID: <span class="badge">${team.id}</span> — Posição: ${team.posicaoBrasileirao?.posicaoTabela || '-'} (pts ${team.posicaoBrasileirao?.pontos || '-'})`;


const info = document.createElement('p');
info.innerHTML = `<strong>Fundação:</strong> ${team.fundacao || '-'} &nbsp; • &nbsp; <strong>Estado:</strong> ${team.estado || '-'}<br>
<strong>Estádio:</strong> ${team.estadio || '-'} &nbsp; • &nbsp; <strong>Títulos:</strong> ${team.titulos ?? '-'} `;


const players = document.createElement('p');
players.innerHTML = `<strong>Jogadores:</strong> ${Array.isArray(team.jogadores) ? team.jogadores.join(', ') : (team.jogadores || '-')}`;


const actions = document.createElement('div');
actions.className = 'actions';
const wiki = document.createElement('a');
wiki.className = 'button-link';
wiki.href = team.wikipedia || '#';
wiki.target = '_blank';
wiki.rel = 'noopener noreferrer';
wiki.textContent = 'Ver na Wikipedia';


  content.appendChild(title);
  content.appendChild(subtitle);
  content.appendChild(info);
  content.appendChild(players);

  actions.appendChild(wiki); 
  content.appendChild(actions); 

  card.appendChild(escudo);
  card.appendChild(content);

  return card; 
}


function renderTeams(filteredTeams) {
  resultsEl.innerHTML = ''; 
  if (filteredTeams.length === 0) {
    noResultsEl.hidden = false; 
  } else {
    noResultsEl.hidden = true; 
    filteredTeams.forEach(team => {
      resultsEl.appendChild(createCard(team)); 
    });
  }
}


searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  const filteredTeams = teams.filter(team => teamMatchesQuery(team, query));
  renderTeams(filteredTeams);
});

searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
});

loadData();