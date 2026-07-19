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

function formatandoCpf(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  let final = digitos;
  if (digitos.length > 9) {
    final = digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  } else if (digitos.length > 6) {
    final = digitos.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (digitos.length > 3) {
    final = digitos.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }
  return final;
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
      btnVer.addEventListener('click', () => abrirVisualizacao(pessoa.id));
      tdAcao.appendChild(btnVer);
      tr.appendChild(tdNome);
      tr.appendChild(tdCpf);
      tr.appendChild(tdAcao);
      tabelaCorpo.appendChild(tr);
    });
  }
}

function abrirVisualizacao(id) {
  const pessoa = estado.pessoas.find((p) => p.id === id);
  if (!pessoa) return;
  estado.idSelecionado = id;
  detalheId.textContent = pessoa.id;
  detalheNome.textContent = pessoa.nome;
  detalheCpf.textContent = pessoa.cpf;
  abrirModal(modalVisualizar);
}

function limparErrosFormulario() {
  [erroNome, erroCpf, erroGeral].forEach((el) => { el.hidden = true; el.textContent = ''; });
  formNome.classList.remove('campo-invalido');
  formCpf.classList.remove('campo-invalido');
}

function abrirFormularioNovo() {
  limparErrosFormulario();
  formCidadao.reset();
  formId.value = '';
  modalFormularioTitulo.textContent = 'Novo cidadão';
  abrirModal(modalFormulario);
  formNome.focus();
}

function abrirFormularioEdicao() {
  const pessoa = estado.pessoas.find((p) => p.id === estado.idSelecionado);
  if (!pessoa) return;
  limparErrosFormulario();
  formId.value = pessoa.id;
  formNome.value = pessoa.nome;
  formCpf.value = pessoa.cpf;
  modalFormularioTitulo.textContent = 'Editar cidadão';
  fecharModal(modalVisualizar);
  abrirModal(modalFormulario);
  formNome.focus();
}

function validarFormularioLocal() {
  limparErrosFormulario();
  let valido = true;
  if (!formNome.value.trim()) {
    erroNome.textContent = 'O nome é obrigatório.';
    erroNome.hidden = false;
    formNome.classList.add('campo-invalido');
    valido = false;
  }
  const digitosCpf = formCpf.value.replace(/\D/g, '');
  if (digitosCpf.length !== 11) {
    erroCpf.textContent = 'Informe um CPF completo (11 dígitos).';
    erroCpf.hidden = false;
    formCpf.classList.add('campo-invalido');
    valido = false;
  }
  return valido;
}

async function salvarFormulario(evento) {
  evento.preventDefault();
  if (!validarFormularioLocal()) return;
  const id = formId.value;
  const corpo = { nome: formNome.value.trim(), cpf: formCpf.value };
  const btnSalvar = document.getElementById('btn-salvar');
  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando...';
  try {
    const url = id ? `${API_BASE}/${id}` : API_BASE;
    const metodo = id ? 'PUT' : 'POST';
    const resposta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
      erroGeral.textContent = dados.erro || 'Não foi possível salvar o cadastro.';
      erroGeral.hidden = false;
      return;
    }
    fecharModal(modalFormulario);
    exibirToast(dados.mensagem || 'Cidadão salvo com sucesso!', 'sucesso');
    await recarregarListaAtual();
  } catch (erro) {
    erroGeral.textContent = 'Erro de conexão com o servidor.';
    erroGeral.hidden = false;
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar';
  }
}

function abrirConfirmacaoExclusao() {
  fecharModal(modalVisualizar);
  abrirModal(modalConfirmar);
}

async function confirmarExclusao() {
  if (!estado.idSelecionado) return;
  btnConfirmarExclusao.disabled = true;
  try {
    const resposta = await fetch(`${API_BASE}/${estado.idSelecionado}`, { method: 'DELETE' });
    if (!resposta.ok && resposta.status !== 204) {
      const dados = await resposta.json().catch(() => ({}));
      throw new Error(dados.erro || 'Não foi possível excluir o cidadão.');
    }
    fecharModal(modalConfirmar);
    exibirToast('Cidadão excluído com sucesso!', 'sucesso');
    await recarregarListaAtual();
  } catch (erro) {
    exibirToast(erro.message, 'erro');
  } finally {
    btnConfirmarExclusao.disabled = false;
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
btnNovo.addEventListener('click', abrirFormularioNovo);
btnEditar.addEventListener('click', abrirFormularioEdicao);
btnExcluir.addEventListener('click', abrirConfirmacaoExclusao);
btnConfirmarExclusao.addEventListener('click', confirmarExclusao);
formCidadao.addEventListener('submit', salvarFormulario);
formCpf.addEventListener('input', () => {
  formCpf.value = formatandoCpf(formCpf.value);
});

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