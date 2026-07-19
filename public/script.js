const API_BASE = '/api/pessoas';

const estado = {
  pessoas: [],
  idSelecionado: null,
};

const tabelaCorpo = document.getElementById('tabela-corpo');
const estadoVazio = document.getElementById('estado-vazio');
const estadoVazioTexto = document.getElementById('estado-vazio-texto');
const estadoCarregando = document.getElementById('estado-carregando');
const searchInput = document.getElementById('search-input');
const btnNovo = document.getElementById('btn-novo');
const toast = document.getElementById('toast');
const modalVisualizar = document.getElementById('modal-visualizar');
const detalheId = document.getElementById('detalhe-id');
const detalheNome = document.getElementById('detalhe-nome');
const detalheCpf = document.getElementById('detalhe-cpf');
const btnEditar = document.getElementById('btn-editar');
const btnExcluir = document.getElementById('btn-excluir');
const modalFormulario = document.getElementById('modal-formulario');
const modalFormularioTitulo = document.getElementById('modal-formulario-titulo');
const formCidadao = document.getElementById('form-cidadao');
const formId = document.getElementById('form-id');
const formNome = document.getElementById('form-nome');
const formCpf = document.getElementById('form-cpf');
const erroNome = document.getElementById('erro-nome');
const erroCpf = document.getElementById('erro-cpf');
const erroGeral = document.getElementById('erro-geral');
const modalConfirmar = document.getElementById('modal-confirmar');
const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');

function mascararCpf(cpf) {
  const partes = String(cpf).match(/^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/);
  if (!partes) return cpf;
  return `${partes[1]}.***.***-${partes[4]}`;
}

function exibirToast(mensagem, tipo = 'sucesso') {
  toast.textContent = mensagem;
  toast.className = `toast ${tipo}`;
  toast.hidden = false;
  clearTimeout(exibirToast._timer);
  exibirToast._timer = setTimeout(() => { toast.hidden = true; }, 4000);
}

function abrirModal(modal) {
  modal.hidden = false;
}

function fecharModal(modal) {
  modal.hidden = true;
}

function fecharTodosModais() {
  [modalVisualizar, modalFormulario, modalConfirmar].forEach(fecharModal);
}

async function carregarPessoas() {
  estadoCarregando.hidden = false;
  estadoVazio.hidden = true;
  try {
    const resposta = await fetch(API_BASE);
    if (resposta.status === 204) {
      estado.pessoas = [];
    } else if (resposta.ok) {
      const dados = await resposta.json();
      estado.pessoas = dados.pessoas || [];
    } else {
      throw new Error('Não foi possível carregar os cidadãos.');
    }
    estadoVazioTexto.textContent = 'Não há cidadãos cadastrados.';
    renderizarTabela();
  } catch (erro) {
    exibirToast(erro.message || 'Erro ao carregar dados.', 'erro');
  } finally {
    estadoCarregando.hidden = true;
  }
}

async function buscarPessoas(termo) {
  estadoCarregando.hidden = false;
  estadoVazio.hidden = true;
  try {
    const resposta = await fetch(`${API_BASE}/pesquisa?termo=${encodeURIComponent(termo)}`);
    if (resposta.status === 404) {
      estado.pessoas = [];
    } else if (resposta.ok) {
      const dados = await resposta.json();
      estado.pessoas = dados.pessoas || [];
    } else {
      const erroDados = await resposta.json().catch(() => ({}));
      throw new Error(erroDados.erro || 'Erro ao buscar cidadãos.');
    }
    estadoVazioTexto.textContent = 'Nenhum cidadão encontrado para essa busca.';
    renderizarTabela();
  } catch (erro) {
    exibirToast(erro.message || 'Erro ao buscar dados.', 'erro');
  } finally {
    estadoCarregando.hidden = true;
  }
}

function renderizarTabela() {
  const total = estado.pessoas.length;
  tabelaCorpo.innerHTML = '';
  if (total === 0) {
    estadoVazio.hidden = false;
  } else {
    estadoVazio.hidden = true;
    estado.pessoas.forEach((pessoa) => {
      const tr = document.createElement('tr');
      const tdNome = document.createElement('td');
      tdNome.textContent = pessoa.nome;
      const tdCpf = document.createElement('td');
      tdCpf.className = 'cpf-cell';
      tdCpf.textContent = mascararCpf(pessoa.cpf);
      const tdAcao = document.createElement('td');
      const btnVer = document.createElement('button');
      btnVer.className = 'btn-ver';
      btnVer.type = 'button';
      btnVer.setAttribute('aria-label', `Visualizar ${pessoa.nome}`);
      btnVer.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z" stroke="currentColor" stroke-width="1.8"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>
      </svg>`;
      tdAcao.appendChild(btnVer);
      tr.appendChild(tdNome);
      tr.appendChild(tdCpf);
      tr.appendChild(tdAcao);
      tabelaCorpo.appendChild(tr);
    });
  }
}

async function recarregarListaAtual() {
  const termo = searchInput.value.trim();
  if (termo) {
    await buscarPessoas(termo);
  } else {
    await carregarPessoas();
  }
}

let debounceBusca;
function aoDigitarBusca() {
  clearTimeout(debounceBusca);
  debounceBusca = setTimeout(() => {
    const termo = searchInput.value.trim();
    if (termo) {
      buscarPessoas(termo);
    } else {
      carregarPessoas();
    }
  }, 350);
}

searchInput.addEventListener('input', aoDigitarBusca);

document.querySelectorAll('[data-close-modal]').forEach((el) => {
  el.addEventListener('click', () => {
    fecharTodosModais();
  });
});

document.querySelectorAll('.modal-overlay').forEach((overlay) => {
  overlay.addEventListener('click', (evento) => {
    if (evento.target === overlay) fecharModal(overlay);
  });
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') fecharTodosModais();
});

carregarPessoas();