const SENHA = "condessa123";
let admin = false;

let dados = JSON.parse(localStorage.getItem("condessa")) || {
  logo: "logo.png",
  sobre: "A Banda Condessa mistura rock, energia jovem e muita vibração!",
  integrantes: [],
  agenda: [],
  imagens: []
};

function salvar() { localStorage.setItem("condessa", JSON.stringify(dados)); render(); }

function render(){
  document.getElementById("logoBanda").src = dados.logo;
  document.getElementById("sobreText").innerText = dados.sobre;
  document.getElementById("sobreInput").value = dados.sobre;

  const intGrid = document.getElementById("integrantesGrid");
  intGrid.innerHTML = dados.integrantes.map(i=>`<div><h3>${i.nome}</h3><p>${i.bio}</p></div>`).join("");

  const ag = document.getElementById("agendaList");
  ag.innerHTML = dados.agenda.map(s=>`<li>${s.data} - ${s.local}</li>`).join("");

  const gal = document.getElementById("galeriaGrid");
  gal.innerHTML = dados.imagens.map(url=>`<img src="${url}">`).join("");

  document.querySelectorAll(".admin-only").forEach(el=>el.style.display = admin?"block":"none");
}

function salvarSobre() { dados.sobre = document.getElementById("sobreInput").value; salvar(); }
function adicionarIntegrante() {
  const nome=document.getElementById("nomeIntegrante").value;
  const bio=document.getElementById("bioIntegrante").value;
  if(nome&&bio){dados.integrantes.push({nome,bio}); salvar();}
}
function adicionarShow() {
  const d=document.getElementById("showDate").value;
  const l=document.getElementById("showLocal").value;
  if(d&&l){dados.agenda.push({data:d,local:l}); salvar();}
}
function adicionarImagem() {
  const url=document.getElementById("imgURL").value;
  if(url){dados.imagens.push(url); salvar();}
}
function alterarLogo() {
  const url=document.getElementById("logoURL").value;
  if(url){dados.logo=url; salvar();}
}

document.getElementById("adminBtn").onclick = ()=>document.getElementById("loginModal").style.display="flex";
function fecharModal(){document.getElementById("loginModal").style.display="none";}
function loginAdmin(){
  const p=document.getElementById("adminPassword").value;
  if(p===SENHA){admin=true;fecharModal();render();}
  else alert("Senha incorreta");
}
window.fecharModal=fecharModal;
window.loginAdmin=loginAdmin;
window.salvarSobre=salvarSobre;
window.adicionarIntegrante=adicionarIntegrante;
window.adicionarShow=adicionarShow;
window.adicionarImagem=adicionarImagem;
window.alterarLogo=alterarLogo;

const canvas = document.getElementById("notasCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const notas = ["\u266B", "\u266A", "\u2669", "\u266C"];
let particulas = [];
let refletores = [];

// =======================
// 🎭 REFLETORES DE LUZES
// =======================
class Refletor {
  constructor(x, y, cor) {
    this.x = x;
    this.y = y;
    this.cor = cor;
    this.angulo = Math.random() * Math.PI / 2 - Math.PI / 4; // inclinação
    this.raio = 300 + Math.random() * 200;
    this.opacidade = 0.4 + Math.random() * 0.4;
  }

  atualizar() {
    // mudar cor lentamente
    const cores = ["#ff0000", "#00ffea", "#ffe600", "#ff00f7", "#00ff00", "#ff7f00"];
    if (Math.random() < 0.01) {
      this.cor = cores[Math.floor(Math.random() * cores.length)];
    }

    // mudar leve opacidade
    this.opacidade += (Math.random() - 0.5) * 0.02;
    this.opacidade = Math.max(0.2, Math.min(0.7, this.opacidade));

    this.desenhar();
  }

  desenhar() {
    let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.raio);
    grad.addColorStop(0, this.cor + Math.floor(this.opacidade * 255).toString(16));
    grad.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
    ctx.fill();
  }
}
// =======================
// 🌟 FLASH DE ESTROBO
// =======================
let flashAtivo = false;
let flashOpacidade = 0;

function dispararFlash() {
  flashAtivo = true;
  flashOpacidade = 1; // começa forte
}

// Detectar clique
window.addEventListener("click", dispararFlash);

  // toca som de flash
  if (somFlash) {
    somFlash.currentTime = 0;
    somFlash.play();
  }



function dispararFlash() {
  flashAtivo = true;
  flashOpacidade = 1; // começa forte
}

// Detectar clique
window.addEventListener("click", dispararFlash);

// =======================
// 🎶 NOTAS MUSICAIS
// =======================
class Nota {
  constructor(x, y, velocidade, tamanho, simbolo) {
    this.x = x;
    this.y = y;
    this.velocidade = velocidade;
    this.tamanho = tamanho;
    this.simbolo = simbolo;
    this.cor = "#e63946";
  }

  desenhar() {
    ctx.font = `${this.tamanho}px Arial`;
    ctx.fillStyle = this.cor;
    ctx.fillText(this.simbolo, this.x, this.y);
  }

  atualizar() {
    this.y += this.velocidade;
    if (this.y > canvas.height) {
      this.y = -20;
      this.x = Math.random() * canvas.width;
    }
    this.desenhar();
  }
}

// =======================
// Inicializar
// =======================
function inicializar() {
  particulas = [];
  refletores = [];

  // criar refletores no topo
  for (let i = 0; i < 6; i++) {
    refletores.push(new Refletor(Math.random() * canvas.width, 0, "#ff0000"));
  }

  // criar notas
  for (let i = 0; i < 50; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let velocidade = 1 + Math.random() * 3;
    let tamanho = 20 + Math.random() * 20;
    let simbolo = notas[Math.floor(Math.random() * notas.length)];
    particulas.push(new Nota(x, y, velocidade, tamanho, simbolo));
  }
}

function animar() {  // Efeito de flash
  if (flashAtivo) {
    ctx.fillStyle = `rgba(255,255,255,${flashOpacidade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    flashOpacidade -= 0.05; // diminuir intensidade
    if (flashOpacidade <= 0) {
      flashAtivo = false;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // desenhar refletores primeiro (fundo)
  refletores.forEach(r => r.atualizar());

  // desenhar notas depois (frente)
  particulas.forEach(n => n.atualizar());

  requestAnimationFrame(animar);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  inicializar();
});

inicializar();
animar();

render();
// 🎵 Sons
const somClique = document.getElementById("somClique");
const somHover = document.getElementById("somHover");
const somSucesso = document.getElementById("somSucesso");

// Funções utilitárias
function tocarSom(som) {
  if (som) {
    som.currentTime = 0;
    som.play();
  }
}

// Ativar sons nos botões
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => tocarSom(somClique));
  btn.addEventListener("mouseover", () => tocarSom(somHover));
});

// Tocar som de sucesso quando salvar algo
function salvarSobre() { 
  dados.sobre = document.getElementById("sobreInput").value; 
  salvar(); 
  tocarSom(somSucesso);
}
function adicionarIntegrante() {
  const nome=document.getElementById("nomeIntegrante").value;
  const bio=document.getElementById("bioIntegrante").value;
  if(nome&&bio){dados.integrantes.push({nome,bio}); salvar(); tocarSom(somSucesso);}
}
function adicionarShow() {
  const d=document.getElementById("showDate").value;
  const l=document.getElementById("showLocal").value;
  if(d&&l){dados.agenda.push({data:d,local:l}); salvar(); tocarSom(somSucesso);}
}
function adicionarImagem() {
  const url=document.getElementById("imgURL").value;
  if(url){dados.imagens.push(url); salvar(); tocarSom(somSucesso);}
}
function alterarLogo() {
  const url=document.getElementById("logoURL").value;
  if(url){dados.logo=url; salvar(); tocarSom(somSucesso);}
}
// 🎵 Sons do flash
const sonsFlash = [
  document.getElementById("somBumbo"),
  document.getElementById("somPrato"),
  document.getElementById("somExplosao"),
  document.getElementById("somEstrobo")
];

function tocarSomAleatorio() {
  const escolhido = sonsFlash[Math.floor(Math.random() * sonsFlash.length)];
  if (escolhido) {
    escolhido.currentTime = 0;
    escolhido.play();
  }
}
function alterarBackground() {
  const url = document.getElementById("bgURL").value;
  if (url) {
    document.getElementById("tituloHeader").style.backgroundImage = `url('${url}')`;
    dados.background = url;
    salvarDados();
  }
}
if (dados.background) {
  document.getElementById("tituloHeader").style.backgroundImage = `url('${dados.background}')`;
}
function alterarBackground() {
  const url = document.getElementById("bgURL").value;
  if (url) {
    document.getElementById("tituloHeader").style.backgroundImage = `url('${url}')`;
    dados.background = url;
    salvarDados();
  }
}
if (dados.background) {
  document.getElementById("tituloHeader").style.backgroundImage = `url('${dados.background}')`;
}
function renderizarAgenda() {
  const lista = document.getElementById("agendaLista");
  lista.innerHTML = "";

  dados.agenda.forEach((show, index) => {
    const div = document.createElement("div");
    div.className = "agenda-item " + (index % 2 === 0 ? "agenda-left" : "agenda-right");

    div.innerHTML = `
      <strong>${show.data} - ${show.hora}</strong>
      <p>📍 ${show.local}</p>
    `;

    // Delay de animação (efeito cascata)
    div.style.animationDelay = `${index * 0.2}s`;

    if (adminAtivo) {
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.style.marginRight = "10px";
      btnEditar.onclick = () => editarAgenda(index);

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Remover";
      btnExcluir.onclick = () => {
        dados.agenda.splice(index, 1);
        salvarDados();
        renderizar();
      };

      div.appendChild(document.createElement("br"));
      div.appendChild(btnEditar);
      div.appendChild(btnExcluir);
    }

    lista.appendChild(div);
  });
}
function adicionarAgenda() {
  const data = document.getElementById("agendaData").value;
  const hora = document.getElementById("agendaHora").value;
  const local = document.getElementById("agendaLocal").value;
  const imagem = document.getElementById("agendaImagem").value || "https://via.placeholder.com/300x150?text=Evento";

  if (data && hora && local) {
    dados.agenda.push({ data, hora, local, imagem });
    salvarDados();
    renderizar();
  }
}

function renderizarAgenda() {
  const grid = document.getElementById("agendaGrid");
  grid.innerHTML = "";

  dados.agenda.forEach((show, index) => {
    const div = document.createElement("div");
    div.className = "agenda-card";

    div.innerHTML = `
      <img src="${show.imagem}" alt="Evento da Banda Condessa">
      <div class="info">
        <strong>${show.data} - ${show.hora}</strong>
        <p>📍 ${show.local}</p>
      </div>
    `;

    // Botões só para admin
    if (adminAtivo) {
      const btns = document.createElement("div");
      btns.style.marginTop = "10px";

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.onclick = () => editarAgenda(index);

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Remover";
      btnExcluir.onclick = () => {
        dados.agenda.splice(index, 1);
        salvarDados();
        renderizar();
      };

      btns.appendChild(btnEditar);
      btns.appendChild(btnExcluir);
      div.appendChild(btns);
    }

    grid.appendChild(div);
  });
}

function editarAgenda(index) {
  const novoData = prompt("Nova data:", dados.agenda[index].data);
  const novoHora = prompt("Novo horário:", dados.agenda[index].hora);
  const novoLocal = prompt("Novo local:", dados.agenda[index].local);
  const novoImagem = prompt("Nova imagem (URL):", dados.agenda[index].imagem);

  if (novoData && novoHora && novoLocal) {
    dados.agenda[index] = { 
      data: novoData, 
      hora: novoHora, 
      local: novoLocal, 
      imagem: novoImagem || dados.agenda[index].imagem 
    };
    salvarDados();
    renderizar();
  }
}
function adicionarAgenda() {
  const data = document.getElementById("agendaData").value;
  const hora = document.getElementById("agendaHora").value;
  const local = document.getElementById("agendaLocal").value;
  const imagem = document.getElementById("agendaImagem").value || "https://via.placeholder.com/300x150?text=Evento";

  if (data && hora && local) {
    dados.agenda.push({
      data,
      hora,
      local,
      imagem,
      descricao: "Show imperdível da Banda Condessa!",
      link: "#"
    });
    salvarDados();
    renderizar();
  }
}

function renderizarAgenda() {
  const grid = document.getElementById("agendaGrid");
  grid.innerHTML = "";

  dados.agenda.forEach((show, index) => {
    const div = document.createElement("div");
    div.className = "agenda-card";

    div.innerHTML = `
      <img src="${show.imagem}" alt="Evento da Banda Condessa">
      <div class="info">
        <strong>${show.data} - ${show.hora}</strong>
        <p>📍 ${show.local}</p>
        <button onclick="abrirPopup(${index})">Ver Detalhes</button>
      </div>
    `;

    if (adminAtivo) {
      const btns = document.createElement("div");
      btns.style.marginTop = "10px";

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.onclick = () => editarAgenda(index);

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Remover";
      btnExcluir.onclick = () => {
        dados.agenda.splice(index, 1);
        salvarDados();
        renderizar();
      };

      btns.appendChild(btnEditar);
      btns.appendChild(btnExcluir);
      div.appendChild(btns);
    }

    grid.appendChild(div);
  });
}

function abrirPopup(index) {
  const show = dados.agenda[index];
  document.getElementById("popupImagem").src = show.imagem;
  document.getElementById("popupTitulo").innerText = `${show.data} - ${show.hora}`;
  document.getElementById("popupLocal").innerText = `📍 ${show.local}`;
  document.getElementById("popupDescricao").innerText = show.descricao || "Show incrível da Banda Condessa!";
  document.getElementById("popupLink").href = show.link || "#";
  document.getElementById("popupDetalhes").style.display = "flex";
}

function fecharPopup() {
  document.getElementById("popupDetalhes").style.display = "none";
}

function editarAgenda(index) {
  const novoData = prompt("Nova data:", dados.agenda[index].data);
  const novoHora = prompt("Novo horário:", dados.agenda[index].hora);
  const novoLocal = prompt("Novo local:", dados.agenda[index].local);
  const novoImagem = prompt("Nova imagem (URL):", dados.agenda[index].imagem);
  const novoDescricao = prompt("Descrição do show:", dados.agenda[index].descricao);
  const novoLink = prompt("Link para ingressos:", dados.agenda[index].link);

  if (novoData && novoHora && novoLocal) {
    dados.agenda[index] = {
      data: novoData,
      hora: novoHora,
      local: novoLocal,
      imagem: novoImagem || dados.agenda[index].imagem,
      descricao: novoDescricao || dados.agenda[index].descricao,
      link: novoLink || dados.agenda[index].link
    };
    salvarDados();
    renderizar();
  }
}
