// Conteúdo completo do script.js com a correção da exclusão e as novas áreas de negócio

// Dados de exemplo para demonstração
// Sistema de Usuários e Privilégios
let currentUser = null;

const users = {
    'renato': {
        name: 'Renato',
        role: 'admin',
        privileges: ['create', 'edit', 'delete', 'view']
    },
    'victor': {
        name: 'Victor', 
        role: 'editor',
        privileges: ['create', 'edit', 'view']
    },
    'fabriciano': {
        name: 'Fabriciano',
        role: 'admin',
        privileges: ['create', 'edit', 'delete', 'view']
    }
};

// Função para calcular markup automaticamente
function calculateMarkup(purchasePrice, salePrice) {
    if (purchasePrice === 0) return 0;
    return ((salePrice - purchasePrice) / purchasePrice) * 100;
}

// Função para calcular preço de venda baseado no markup
function calculateSalePrice(purchasePrice, markupMargin) {
    return purchasePrice * (1 + markupMargin / 100);
}

// Função para validar e formatar valores financeiros
function validateFinancialValue(value) {
    const numValue = parseFloat(value);
    return isNaN(numValue) ? 0 : Math.max(0, numValue);
}

// Dados das tarefas - Array vazio para começar limpo
// ATENÇÃO: O array 'tasks' é preenchido pela função loadFromDatabase() no final do arquivo.
// Deixamos vazio aqui para garantir que o banco de dados seja a fonte primária.
let tasks = [];

// Mapeamento de áreas de negócio - ATUALIZADO COM O MAPA MENTAL
const businessAreaMap = {
    'solvente': 'Solvente Dielétrico',
    'solar': 'Energia Solar',
    'mercado-livre': 'Mercado Livre',
    'servicos-eletricos': 'Vendas e Serviços Elétricos',
    'ativos-web': 'Gerenciador de Ativos Web'
};

// Mapeamento de fases
const phaseNames = {
    'prospeccao': 'Prospecção e Geração de Leads',
    'proposta': 'Proposta e Negociação',
    'execucao': 'Execução e Entrega',
    'pos-venda': 'Pós-Venda e Relacionamento'
};
// Variáveis globais
let currentEditingTask = null;
let filteredTasks = [...tasks];

// Elementos DOM
const businessAreaFilter = document.getElementById('businessAreaFilter');
const responsibleFilter = document.getElementById('responsibleFilter');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const taskDetailsModal = document.getElementById('taskDetailsModal');
const taskForm = document.getElementById('taskForm');
const closeModal = document.getElementById('closeModal');
const closeDetailsModal = document.getElementById('closeDetailsModal');
const cancelBtn = document.getElementById('cancelBtn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    populateResponsibleFilter();
    applyFilters(); // Isso vai chamar renderTasks() e updateStats()
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    businessAreaFilter.addEventListener('change', applyFilters);
    responsibleFilter.addEventListener('change', applyFilters);
    
    // Modal de adicionar tarefa
    addTaskBtn.addEventListener('click', () => {
        if (checkCreatePermission()) {
            openAddTaskModal();
        }
    });
    closeModal.addEventListener('click', closeTaskModal);
    cancelBtn.addEventListener('click', closeTaskModal);
    
    // Modal de detalhes
    closeDetailsModal.addEventListener('click', closeTaskDetailsModal);
    
    // Formulário
    taskForm.addEventListener('submit', handleTaskSubmit);
    
    // Fechar modal clicando fora
    taskModal.addEventListener('click', function(e) {
        if (e.target === taskModal) {
            closeTaskModal();
        }
    });
    
    taskDetailsModal.addEventListener('click', function(e) {
        if (e.target === taskDetailsModal) {
            closeTaskDetailsModal();
        }
    });
    
    // Tecla ESC para fechar modais
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeTaskModal();
            closeTaskDetailsModal();
        }
    });
}

// Popular filtro de responsáveis
function populateResponsibleFilter() {
    const responsibles = [...new Set(tasks.map(task => task.responsible))].sort();
    
    // Limpar opções existentes (exceto "Todos")
    responsibleFilter.innerHTML = '<option value="all">Todos</option>';
    
    responsibles.forEach(responsible => {
        const option = document.createElement('option');
        option.value = responsible;
        option.textContent = responsible;
        responsibleFilter.appendChild(option);
    });
}

// Aplicar filtros
function applyFilters() {
    const selectedArea = businessAreaFilter.value;
    const selectedResponsible = responsibleFilter.value;
    
    filteredTasks = tasks.filter(task => {
        const areaMatch = selectedArea === 'all' || task.businessArea === selectedArea;
        const responsibleMatch = selectedResponsible === 'all' || task.responsible === selectedResponsible;
        return areaMatch && responsibleMatch;
    });
    
    renderTasks();
    updateStats();
}

// Renderizar tarefas no board
function renderTasks() {
    // Limpar todas as colunas
    const columns = ['prospeccao', 'proposta', 'execucao', 'pos-venda'];
    columns.forEach(phase => {
        const container = document.getElementById(`${phase}-tasks`);
        container.innerHTML = '';
    });
    
    // Agrupar tarefas por fase
    const tasksByPhase = {};
    columns.forEach(phase => {
        tasksByPhase[phase] = filteredTasks.filter(task => task.phase === phase);
    });
    
    // Renderizar tarefas em cada coluna
    columns.forEach(phase => {
        const container = document.getElementById(`${phase}-tasks`);
        const phaseTasks = tasksByPhase[phase];
        
        if (phaseTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plus-circle"></i>
                    <p>Pronto para novas tarefas</p>
                    <small>Clique no botão + para adicionar</small>
                </div>
            `;
        } else {
            phaseTasks.forEach(task => {
                const taskCard = createTaskCard(task);
                container.appendChild(taskCard);
            });
        }
        
        // Atualizar contador da coluna
        updateColumnCount(phase, phaseTasks.length);
    });
    
    // Aplicar privilégios após renderização
    updateDeleteButtons();
}

// Criar cartão de tarefa
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('data-area', task.businessArea);
    card.setAttribute('data-task-id', task.id);
    
    // Verificar se a tarefa está vencida
    const today = new Date();
    const deadline = task.deadline || task.dueDate;
    const dueDate = new Date(deadline);
    const isOverdue = dueDate < today;
    
    if (isOverdue) {
        card.classList.add('overdue');
    }
    
    // Formatar data
    const formattedDate = formatDate(deadline);
    
    // Formatação de valores monetários
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    card.innerHTML = `
        <div class="task-title">${task.title}</div>
        ${task.client ? `<div class="task-client"><i class="fas fa-building"></i> ${task.client}</div>` : ''}
        <div class="task-meta">
            <span class="task-area">${businessAreaMap[task.businessArea]}</span>
            <span class="task-due-date">
                <i class="fas fa-calendar-alt"></i>
                ${formattedDate}
            </span>
        </div>
        <div class="task-financial">
            <div class="financial-row">
                <span class="financial-label">Compra:</span>
                <span class="financial-value purchase">${formatCurrency(task.purchasePrice)}</span>
            </div>
            <div class="financial-row">
                <span class="financial-label">Venda:</span>
                <span class="financial-value sale">${formatCurrency(task.salePrice)}</span>
            </div>
            <div class="financial-row">
                <span class="financial-label">Markup:</span>
                <span class="financial-value markup">${task.markupMargin.toFixed(1)}%</span>
            </div>
            <div class="financial-row profit-row">
                <span class="financial-label">Lucro:</span>
                <span class="financial-value profit">${formatCurrency(task.salePrice - task.purchasePrice)}</span>
            </div>
        </div>
        <div class="task-responsible">
            <i class="fas fa-user"></i>
            ${task.responsible}
        </div>
    `;
    
    // Adicionar evento de clique para abrir detalhes
    card.addEventListener('click', () => openTaskDetails(task));
    
    return card;
}

// Atualizar contador da coluna
function updateColumnCount(phase, count) {
    const column = document.querySelector(`[data-phase="${phase}"]`);
    const countElement = column.querySelector('.column-count');
    countElement.textContent = count;
}

// Atualizar estatísticas
function updateStats() {
    const totalTasks = filteredTasks.length;
    const activeTasks = filteredTasks.filter(task => 
        task.phase !== 'pos-venda'
    ).length;
    
    // Calcular lucro total
    const totalProfit = filteredTasks.reduce((sum, task) => {
        return sum + (task.salePrice - task.purchasePrice);
    }, 0);
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('activeTasks').textContent = activeTasks;
    
    // Atualizar lucro total se o elemento existir
    const totalProfitElement = document.getElementById('totalProfit');
    if (totalProfitElement) {
        totalProfitElement.textContent = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(totalProfit);
    }
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Abrir modal de adicionar tarefa
function openAddTaskModal() {
    currentEditingTask = null;
    document.getElementById('modalTitle').textContent = 'Adicionar Nova Tarefa';
    taskForm.reset();
    
    // Definir data mínima como hoje
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('taskDueDate').min = today;
    
    taskModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de tarefa
function closeTaskModal() {
    taskModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    currentEditingTask = null;
    taskForm.reset();
}

// Abrir detalhes da tarefa
function openTaskDetails(task) {
    const detailsContent = document.getElementById('taskDetailsContent');
    
    detailsContent.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Título</div>
            <div class="detail-value">${task.title}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Cliente</div>
            <div class="detail-value">${task.client}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Área de Negócio</div>
            <div class="detail-value">${businessAreaMap[task.businessArea]}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Fase Atual</div>
            <div class="detail-value">${phaseNames[task.phase]}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Responsável</div>
            <div class="detail-value">${task.responsible}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Data de Vencimento</div>
            <div class="detail-value">${formatDate(task.deadline || task.dueDate)}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Informações Financeiras</div>
            <div class="detail-financial">
                <div class="financial-detail-row">
                    <span class="financial-detail-label">Preço de Compra:</span>
                    <span class="financial-detail-value purchase">${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(task.purchasePrice)}</span>
                </div>
                <div class="financial-detail-row">
                    <span class="financial-detail-label">Preço de Venda:</span>
                    <span class="financial-detail-value sale">${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(task.salePrice)}</span>
                </div>
                <div class="financial-detail-row">
                    <span class="financial-detail-label">Margem de Markup:</span>
                    <span class="financial-detail-value markup">${task.markupMargin.toFixed(1)}%</span>
                </div>
                <div class="financial-detail-row profit">
                    <span class="financial-detail-label">Lucro Bruto:</span>
                    <span class="financial-detail-value profit">${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(task.salePrice - task.purchasePrice)}</span>
                </div>
            </div>
        </div>
        ${task.description ? `
        <div class="detail-item">
            <div class="detail-label">Descrição</div>
            <div class="detail-value">${task.description}</div>
        </div>
        ` : ''}
        <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="editTask(${task.id})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button type="button" class="btn btn-primary" onclick="moveTaskToNextPhase(${task.id})">
                <i class="fas fa-arrow-right"></i> Avançar Fase
            </button>
        </div>
    `;
    
    taskDetailsModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de detalhes
function closeTaskDetailsModal() {
    taskDetailsModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Editar tarefa
function editTask(taskId) {
    if (!checkEditPermission()) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    currentEditingTask = task;
    
    // Fechar modal de detalhes
    closeTaskDetailsModal();
    
    // Preencher formulário
    document.getElementById('modalTitle').textContent = 'Editar Tarefa';
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskClient').value = task.client;
    document.getElementById('taskBusinessArea').value = task.businessArea;
    document.getElementById('taskPhase').value = task.phase;
    document.getElementById('taskResponsible').value = task.responsible;
    document.getElementById('taskDueDate').value = task.dueDate;
    document.getElementById('taskDescription').value = task.description || '';
    
    // Abrir modal
    taskModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Mover tarefa para próxima fase
async function moveTaskToNextPhase(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const phases = ['prospeccao', 'proposta', 'execucao', 'pos-venda'];
    const currentPhaseIndex = phases.indexOf(task.phase);
    
    if (currentPhaseIndex < phases.length - 1) {
        const newPhase = phases[currentPhaseIndex + 1];
        
        try {
            // Atualizar no banco de dados
            const updatedTask = await apiClient.updateTask(taskId, { phase: newPhase });
            
            // Atualizar localmente
            task.phase = newPhase;
            const index = tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                tasks[index] = updatedTask;
            }
            
            // Atualizar visualização
            applyFilters();
            closeTaskDetailsModal();
            
            // Mostrar notificação
            showNotification(`Tarefa movida para: ${phaseNames[newPhase]}`, 'success');
        } catch (error) {
            console.error('Erro ao mover tarefa:', error);
            showNotification('Erro ao mover tarefa. Tente novamente.', 'error');
        }
    }
}

// Tratar submissão do formulário
async function handleTaskSubmit(event) {
    event.preventDefault();
    
    const taskData = {
        title: document.getElementById('taskTitle').value,
        client: document.getElementById('taskClient').value,
        businessArea: document.getElementById('taskBusinessArea').value,
        phase: document.getElementById('taskPhase').value,
        responsible: document.getElementById('taskResponsible').value,
        deadline: document.getElementById('taskDueDate').value,
        description: document.getElementById('taskDescription').value,
        purchasePrice: validateFinancialValue(document.getElementById('taskPurchasePrice').value),
        salePrice: validateFinancialValue(document.getElementById('taskSalePrice').value),
        markupMargin: validateFinancialValue(document.getElementById('taskMarkupMargin').value),
    };
    
    try {
        let result;
        if (currentEditingTask) {
            // Editar tarefa existente
            result = await apiClient.updateTask(currentEditingTask.id, taskData);
            showNotification('Tarefa atualizada com sucesso!', 'success');
        } else {
            // Criar nova tarefa
            result = await apiClient.createTask(taskData);
            showNotification('Tarefa criada com sucesso!', 'success');
        }
        
        // CORREÇÃO: Recarregar TODAS as tarefas do banco após criar/editar
        await loadFromDatabase();
        
        // Atualizar filtros e visualização
        populateResponsibleFilter();
        applyFilters();
        closeTaskModal();
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
        showNotification('Erro ao salvar tarefa. Tente novamente.', 'error');
    }
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : '#4299e1'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Adicionar estilos de animação para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyles);

// Função para exportar dados (opcional)
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tarefas_dashboard.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Função para importar dados (opcional)
function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTasks = JSON.parse(e.target.result);
            tasks = importedTasks;
            populateResponsibleFilter();
            applyFilters();
            showNotification('Dados importados com sucesso!', 'success');
        } catch (error) {
            showNotification('Erro ao importar dados. Verifique o formato do arquivo.', 'error');
        }
    };
    reader.readAsText(file);
}

// Funções de Login e Privilégios
function initializeAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const passwordInput = document.getElementById('passwordInput');
    
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Permitir login com Enter
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
    
    // Verificar se há usuário logado salvo
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateUserInterface();
        } catch (e) {
            localStorage.removeItem('currentUser');
        }
    }
}

async function handleLogin() {
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || !password) {
        showMessage('Por favor, preencha usuário e senha.', 'error');
        return;
    }
    
    try {
        const response = await authAPI.login(username, password);
        
        if (response.success) {
            currentUser = {
                id: response.user.id,
                name: response.user.username,
                role: response.user.role,
                privileges: getRolePrivileges(response.user.role)
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserInterface();
            applyPrivileges();
            showMessage(`Bem-vindo, ${currentUser.name}!`, 'success');
            
            // Limpar campos
            usernameInput.value = '';
            passwordInput.value = '';
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showMessage(error.message || 'Usuário ou senha inválidos.', 'error');
    }
}

function getRolePrivileges(role) {
    const privileges = {
        'admin': ['view', 'create', 'edit', 'delete'],
        'editor': ['view', 'create', 'edit'],
        'viewer': ['view']
    };
    return privileges[role] || ['view'];
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    applyPrivileges();
    showMessage('Logout realizado com sucesso!', 'success');
}

function updateUserInterface() {
    const loginArea = document.getElementById('loginArea');
    const userInfo = document.getElementById('userInfo');
    const currentUserSpan = document.getElementById('currentUser');
    
    if (currentUser) {
        loginArea.style.display = 'none';
        userInfo.style.display = 'flex';
        currentUserSpan.textContent = `${currentUser.name} (${getRoleDisplayName(currentUser.role)})`;
    } else {
        loginArea.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'Administrador',
        'editor': 'Editor',
        'viewer': 'Visualizador'
    };
    return roleNames[role] || role;
}

function hasPrivilege(privilege) {
    return currentUser && currentUser.privileges.includes(privilege);
}

function applyPrivileges() {
    const addTaskBtn = document.querySelector('.add-task-btn');
    const filterSection = document.querySelector('.filters-section');
    
    if (!currentUser) {
        // Usuário não logado - desabilitar tudo
        if (addTaskBtn) addTaskBtn.style.display = 'none';
        if (filterSection) filterSection.classList.add('disabled');
        document.querySelectorAll('.task-card').forEach(card => {
            card.classList.add('disabled');
        });
        return;
    }
    
    // Aplicar privilégios baseados no usuário logado
    if (hasPrivilege('create')) {
        if (addTaskBtn) addTaskBtn.style.display = 'flex';
    } else {
        if (addTaskBtn) addTaskBtn.style.display = 'none';
    }
    
    // Remover classe disabled se usuário tem privilégio de visualização
    if (hasPrivilege('view')) {
        if (filterSection) filterSection.classList.remove('disabled');
        document.querySelectorAll('.task-card').forEach(card => {
            card.classList.remove('disabled');
        });
    }
    
    // Atualizar botões de exclusão
    updateDeleteButtons();
}

function updateDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => btn.remove());
    
    if (hasPrivilege('delete')) {
        document.querySelectorAll('.task-card').forEach(card => {
            if (!card.querySelector('.delete-btn')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.title = 'Excluir tarefa';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const taskId = parseInt(card.dataset.taskId);
                    deleteTask(taskId);
                });
                card.appendChild(deleteBtn);
            }
        });
    }
}

async function deleteTask(taskId) {
    if (!hasPrivilege('delete')) {
        showMessage('Você não tem permissão para excluir tarefas.', 'error');
        return;
    }
    
    // Garantir que o taskId é um número válido
    const id = parseInt(taskId);
    if (isNaN(id)) {
        console.error('ID de tarefa inválido:', taskId);
        showMessage('Erro: ID de tarefa inválido.', 'error');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
            await apiClient.deleteTask(id); // Usar o ID validado
            
            // CORREÇÃO: Recarregar TODAS as tarefas do banco após excluir
            await loadFromDatabase();
            
            renderTasks();
            updateStats();
            showMessage('Tarefa excluída com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            showMessage('Erro ao excluir tarefa. Tente novamente.', 'error');
        }
    }
}

function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `access-denied ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function checkEditPermission() {
    if (!hasPrivilege('edit')) {
        showMessage('Você não tem permissão para editar tarefas.', 'error');
        return false;
    }
    return true;
}

function checkCreatePermission() {
    if (!hasPrivilege('create')) {
        showMessage('Você não tem permissão para criar tarefas.', 'error');
        return false;
    }
    return true;
}

// Salvar dados no banco de dados (via API)
async function saveToDatabase() {
    // Cada operação já salva automaticamente via API
    console.log('Dados sincronizados com o banco de dados');
}

// Carregar dados do banco de dados
async function loadFromDatabase() {
    console.log('🔄 Iniciando carregamento de dados do banco...');
    try {
        const loadedTasks = await apiClient.getTasks();
        tasks = loadedTasks;
        console.log('✅ Dados carregados do banco de dados:', tasks.length, 'tarefas');
        console.log('📊 Tarefas:', tasks);
        return tasks.length;
    } catch (error) {
        console.error('❌ Erro ao carregar dados do banco:', error);
        tasks = [];
        return 0;
    }
}

// Salvar automaticamente a cada mudança
function autoSave() {
    // Não precisa fazer nada, cada operação já salva via API
}

// Configurar event listeners para campos financeiros
function setupFinancialListeners() {
    const purchaseInput = document.getElementById('taskPurchasePrice');
    const saleInput = document.getElementById('taskSalePrice');
    const markupInput = document.getElementById('taskMarkupMargin');
    
    if (purchaseInput && saleInput && markupInput) {
        // Atualizar markup quando preços mudarem
        purchaseInput.addEventListener('input', () => {
            const purchasePrice = validateFinancialValue(purchaseInput.value);
            const salePrice = validateFinancialValue(saleInput.value);
            const calculatedMarkup = calculateMarkup(purchasePrice, salePrice);
            markupInput.value = calculatedMarkup.toFixed(1);
        });
        
        saleInput.addEventListener('input', () => {
            const purchasePrice = validateFinancialValue(purchaseInput.value);
            const salePrice = validateFinancialValue(saleInput.value);
            const calculatedMarkup = calculateMarkup(purchasePrice, salePrice);
            markupInput.value = calculatedMarkup.toFixed(1);
        });
    }
}

// Função para sincronizar dados
async function syncWithDatabase() {
    const syncBtn = document.getElementById('syncBtn');
    const icon = syncBtn.querySelector('i');
    const text = syncBtn.querySelector('.btn-text');
    
    // Mostrar estado de sincronização
    syncBtn.classList.add('syncing');
    text.textContent = 'Sincronizando...';
    
    try {
        // Recarregar dados do banco
        await loadFromDatabase();
        renderTasks();
        updateStats();
        
        // Mostrar sucesso
        syncBtn.classList.remove('syncing');
        syncBtn.classList.remove('error');
        text.textContent = 'Sincronizado!';
        
        // Voltar ao estado normal após 2 segundos
        setTimeout(() => {
            text.textContent = 'Sincronizado';
        }, 2000);
        
        showNotification('Dados sincronizados com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao sincronizar:', error);
        syncBtn.classList.remove('syncing');
        syncBtn.classList.add('error');
        text.textContent = 'Erro';
        
        setTimeout(() => {
            syncBtn.classList.remove('error');
            text.textContent = 'Sincronizar';
        }, 3000);
        
        showNotification('Erro ao sincronizar dados.', 'error');
    }
}

// Função para exportar dados
async function exportData() {
    try {
        // Obter todos os dados do banco
        const allTasks = await apiClient.getTasks();
        
        // Criar objeto com metadados
        const exportData = {
            exportDate: new Date().toISOString(),
            totalTasks: allTasks.length,
            dashboard: 'Solconect - Gestão Empresarial',
            version: '2.0',
            tasks: allTasks
        };
        
        // Converter para JSON
        const jsonString = JSON.stringify(exportData, null, 2);
        
        // Criar blob e download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Nome do arquivo com data
        const date = new Date().toISOString().split('T')[0];
        link.download = `dashboard-solconect-backup-${date}.json`;
        link.href = url;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification(`${allTasks.length} tarefas exportadas com sucesso!`, 'success');
    } catch (error) {
        console.error('Erro ao exportar dados:', error);
        showNotification('Erro ao exportar dados.', 'error');
    }
}

// Função para importar dados de backup
async function importData() {
    const fileInput = document.getElementById('importFile');
    fileInput.click();
}

// Processar arquivo importado
async function processImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        // Ler arquivo JSON
        const text = await file.text();
        const importData = JSON.parse(text);
        
        // Validar estrutura
        if (!importData.tasks || !Array.isArray(importData.tasks)) {
            throw new Error('Formato de arquivo inválido. Esperado array de tarefas.');
        }
        
        // Criar tarefas em massa
        const createdTasks = await apiClient.bulkCreateTasks(importData.tasks);
        
        // Recarregar dados
        await loadFromDatabase();
        
        // Atualizar visualização
        populateResponsibleFilter();
        applyFilters();
        
        showNotification(`${createdTasks.length} tarefas importadas com sucesso!`, 'success');
    } catch (error) {
        console.error('Erro ao importar dados:', error);
        showNotification(error.message || 'Erro ao importar dados. Verifique o formato do arquivo.', 'error');
    }
}

// Event listener para o botão de importação
document.getElementById('importBtn').addEventListener('click', importData);
document.getElementById('importFile').addEventListener('change', processImportFile);

// Event listener para o botão de exportação
document.getElementById('exportBtn').addEventListener('click', exportData);

// Inicializar autenticação e carregar dados
document.addEventListener('DOMContentLoaded', async function() {
    initializeAuth();
    setupFinancialListeners();
    
    // Carregar dados do banco de dados
    const taskCount = await loadFromDatabase();
    
    // Se houver tarefas, renderizar
    if (taskCount > 0) {
        populateResponsibleFilter();
        applyFilters();
    }
    
    // Inicializar painéis de exportação (AWS S3 e Google Drive)
    initializeExportPanels();
});

// Funções de Exportação (AWS S3 e Google Drive)
function initializeExportPanels() {
    // AWS S3
    const awsPanel = document.getElementById('awsS3Panel');
    if (awsPanel) {
        const isEnabled = awsPanel.dataset.enabled === 'true';
        if (isEnabled) {
            // Se habilitado, inicializar lógica de auto-backup
            setupAwsS3Listeners();
        }
    }
    
    // Google Drive
    const gdPanel = document.getElementById('googleDrivePanel');
    if (gdPanel) {
        const isEnabled = gdPanel.dataset.enabled === 'true';
        if (isEnabled) {
            // Se habilitado, inicializar lógica de auto-backup
            setupGoogleDriveListeners();
        }
    }
}

// Lógica AWS S3
function setupAwsS3Listeners() {
    const testBtn = document.getElementById('testAwsS3Btn');
    const backupBtn = document.getElementById('backupAwsS3Btn');
    const startAutoBtn = document.getElementById('startAutoAwsS3Btn');
    const stopAutoBtn = document.getElementById('stopAutoAwsS3Btn');
    const intervalInput = document.getElementById('awsS3Interval');
    const saveIntervalBtn = document.getElementById('saveAwsS3IntervalBtn');
    
    // Testar conexão
    testBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/aws/test');
            const data = await response.json();
            if (data.success) {
                showNotification('Conexão AWS S3 bem-sucedida!', 'success');
            } else {
                showNotification(`Erro AWS S3: ${data.error}`, 'error');
            }
        } catch (error) {
            showNotification('Erro ao testar conexão AWS S3.', 'error');
        }
    });
    
    // Backup manual
    backupBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/aws/backup', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                showNotification('Backup AWS S3 realizado com sucesso!', 'success');
            } else {
                showNotification(`Erro no Backup AWS S3: ${data.error}`, 'error');
            }
        } catch (error) {
            showNotification('Erro ao realizar backup AWS S3.', 'error');
        }
    });
    
    // Iniciar auto-backup
    startAutoBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/aws/start_auto', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                showNotification('Auto-backup AWS S3 iniciado!', 'success');
            } else {
                showNotification(`Erro ao iniciar auto-backup: ${data.error}`, 'error');
            }
        } catch (error) {
            showNotification('Erro ao iniciar auto-backup AWS S3.', 'error');
        }
    });
    
    // Parar auto-backup
    stopAutoBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/aws/stop_auto', { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                showNotification('Auto-backup AWS S3 parado!', 'info');
            } else {
                showNotification(`Erro ao parar auto-backup: ${data.error}`, 'error');
            }
        } catch (error) {
            showNotification('Erro ao parar auto-backup AWS S3.', 'error');
        }
    });
    
    // Salvar intervalo
    saveIntervalBtn.addEventListener('click', async () => {
        const interval = parseInt(intervalInput.value);
        if (isNaN(interval) || interval < 1) {
            showNotification('Intervalo inválido. Mínimo de 1 minuto.', 'error');
            return;
        }
        try {
            const response = await fetch('/api/aws/interval', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interval: interval })
            });
            const data = await response.json();
            if (data.success) {
                showNotification(`Intervalo AWS S3 salvo para ${interval} minutos.`, 'success');
            } else {
                showNotification(`Erro ao salvar intervalo: ${data.error}`, 'error');
            }
        } catch (error) {
            showNotification('Erro ao salvar intervalo AWS S3.', 'error');
        }
    });
}

// Lógica Google Drive (similar ao AWS S3)
function setupGoogleDriveListeners() {
    // Implementação similar ao AWS S3, usando endpoints /api/google_drive/...
    // ...
}
