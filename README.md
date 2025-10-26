# Dashboard Solconect - Railway Deployment

Dashboard profissional de gestão de projetos com 4 fases (Prospecção, Negociação, Execução, Pós-Venda) desenvolvido para a Solconect.

## 🚀 Características

- **Gestão Completa de Projetos**: Acompanhamento de projetos através de 4 fases distintas
- **Cálculos Financeiros Automáticos**: Markup e margens calculados automaticamente
- **Multi-usuário**: Sistema de autenticação com diferentes níveis de permissão
- **Persistência de Dados**: PostgreSQL para garantir que nenhum dado seja perdido
- **Interface Intuitiva**: Design responsivo e fácil de usar
- **Backup/Restore**: Sistema de exportação e importação de dados

## 🛠️ Tecnologias

### Backend
- **Flask 3.1.1**: Framework web Python
- **SQLAlchemy 2.0.41**: ORM para banco de dados
- **PostgreSQL**: Banco de dados relacional
- **Gunicorn**: Servidor WSGI para produção

### Frontend
- **HTML5/CSS3**: Interface responsiva
- **JavaScript (Vanilla)**: Lógica do cliente
- **Design Responsivo**: Funciona em desktop e mobile

## 📋 Estrutura do Projeto

```
dashboard_railway/
├── src/
│   ├── models/          # Modelos de dados (User, Task)
│   ├── routes/          # Rotas da API (auth, task, user)
│   ├── static/          # Arquivos estáticos (HTML, CSS, JS)
│   └── main.py          # Aplicação principal Flask
├── requirements.txt     # Dependências Python
├── Procfile            # Comando de inicialização
├── railway.json        # Configuração Railway
├── nixpacks.toml       # Configuração de build
└── .env.example        # Exemplo de variáveis de ambiente
```

## 🎯 Funcionalidades

### Gestão de Projetos
- Criar, editar e excluir projetos
- Mover projetos entre fases (drag-and-drop)
- Filtrar por área de negócio
- Busca por título ou cliente

### Cálculos Financeiros
- **Preço de Compra**: Custo do projeto
- **Preço de Venda**: Valor cobrado do cliente
- **Markup**: Percentual de lucro sobre o custo
- **Margem**: Percentual de lucro sobre a venda

### Sistema de Usuários
- **Admin**: Acesso total ao sistema
- **Editor**: Pode criar e editar projetos
- **Viewer**: Apenas visualização

### Usuários Padrão
- **Renato** (Admin): `renato123`
- **Victor** (Editor): `victor123`
- **Fabriciano** (Admin): `fabriciano123`

## 🔒 Segurança

- Senhas criptografadas com Werkzeug
- CORS configurado para segurança
- Validação de dados no backend
- Proteção contra SQL injection via SQLAlchemy

## 📊 Banco de Dados

### Tabela: users
- `id`: Identificador único
- `username`: Nome de usuário (único)
- `email`: Email do usuário
- `password_hash`: Senha criptografada
- `role`: Nível de permissão (admin/editor/viewer)

### Tabela: tasks
- `id`: Identificador único
- `title`: Título do projeto
- `client`: Nome do cliente
- `description`: Descrição detalhada
- `business_area`: Área de negócio
- `phase`: Fase atual do projeto
- `responsible`: Responsável pelo projeto
- `deadline`: Prazo de entrega
- `purchase_price`: Preço de compra
- `sale_price`: Preço de venda
- `markup_margin`: Margem de markup
- `created_at`: Data de criação
- `updated_at`: Data de atualização

## 🌐 API Endpoints

### Autenticação
- `POST /api/auth/login`: Login de usuário
- `GET /api/auth/users`: Listar usuários
- `POST /api/auth/users`: Criar usuário
- `PUT /api/auth/users/<id>`: Atualizar usuário
- `DELETE /api/auth/users/<id>`: Excluir usuário

### Tarefas
- `GET /api/tasks`: Listar todas as tarefas
- `GET /api/tasks/<id>`: Obter tarefa específica
- `POST /api/tasks`: Criar nova tarefa
- `PUT /api/tasks/<id>`: Atualizar tarefa
- `DELETE /api/tasks/<id>`: Excluir tarefa
- `POST /api/tasks/bulk`: Criar múltiplas tarefas

### Health Check
- `GET /health`: Verificar status da aplicação

## 💾 Backup e Restore

O sistema possui botões de **Exportar** e **Importar** para backup manual dos dados:

- **Exportar**: Baixa um arquivo JSON com todos os projetos
- **Importar**: Restaura projetos de um arquivo JSON

## 🚀 Deploy no Railway

Consulte o arquivo `DEPLOY_RAILWAY.md` para instruções detalhadas de deployment.

## 📝 Licença

Desenvolvido para Solconect - Todos os direitos reservados.

## 👥 Suporte

Para suporte técnico ou dúvidas, entre em contato com a equipe de desenvolvimento.

