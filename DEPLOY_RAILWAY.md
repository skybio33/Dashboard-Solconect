> **AVISO IMPORTANTE**
> Este guia assume que você já possui uma conta no [Railway](https://railway.app/) e no [GitHub](https://github.com/).

# Guia de Deployment do Dashboard Solconect no Railway

Este documento detalha o processo passo a passo para fazer o deploy da aplicação **Dashboard Solconect** na plataforma de nuvem Railway, utilizando um banco de dados PostgreSQL para persistência de dados.

## Sumário

1.  **Preparação do Ambiente**
2.  **Criação do Projeto no Railway**
3.  **Configuração do Banco de Dados PostgreSQL**
4.  **Configuração das Variáveis de Ambiente**
5.  **Deploy da Aplicação**
6.  **Verificação e Acesso**

---

### 1. Preparação do Ambiente

Antes de iniciar o deploy, você precisa ter o código-fonte da aplicação em um repositório Git (preferencialmente no GitHub).

- **Crie um novo repositório no GitHub** e envie todo o conteúdo da pasta `dashboard_railway` para ele.

O repositório deve conter a seguinte estrutura de arquivos:

```
.gitattributes
.gitignore
.env.example
DEPLOY_RAILWAY.md
Procfile
README.md
init_db.py
nixpacks.toml
railway.json
requirements.txt
runtime.txt
src/
```

### 2. Criação do Projeto no Railway

Com o código no GitHub, o próximo passo é criar o projeto no Railway.

1.  Acesse seu painel do Railway e clique em **"New Project"**.
2.  Selecione a opção **"Deploy from GitHub repo"**.
3.  Escolha o repositório que você acabou de criar.

O Railway irá analisar o repositório e detectar automaticamente que se trata de uma aplicação Python, mas faremos a configuração do banco de dados manualmente.

### 3. Configuração do Banco de Dados PostgreSQL

Para garantir a persistência dos dados, adicionaremos um serviço de banco de dados PostgreSQL.

1.  Dentro do seu projeto no Railway, clique em **"+ New"**.
2.  Selecione **"Database"** e depois **"Add PostgreSQL"**.
3.  O Railway irá provisionar um novo banco de dados e o conectará automaticamente à sua aplicação.

Ao fazer isso, o Railway cria uma variável de ambiente chamada `DATABASE_URL` e a injeta no serviço da sua aplicação. O nosso código em `src/main.py` já está preparado para detectar e utilizar essa variável.

### 4. Configuração das Variáveis de Ambiente

A aplicação precisa de algumas variáveis de ambiente para funcionar corretamente em produção.

1.  No painel do seu projeto no Railway, vá para a aba **"Variables"** do serviço da sua aplicação (não do banco de dados).
2.  Adicione as seguintes variáveis:

| Variável | Valor | Descrição |
| :--- | :--- | :--- |
| `SECRET_KEY` | Gere uma chave segura e aleatória | Chave secreta para segurança da sessão Flask. Você pode usar um gerador online. |
| `FLASK_ENV` | `production` | Define o ambiente da aplicação como produção. |
| `PYTHON_VERSION` | `3.11` | Garante que o Railway use a versão correta do Python. |

**Observação**: A variável `DATABASE_URL` já deve estar presente e configurada automaticamente pelo Railway.

### 5. Deploy da Aplicação

O Railway tentará fazer o deploy automaticamente assim que você conectar o repositório. No entanto, após adicionar o banco de dados e as variáveis de ambiente, um novo deploy será acionado.

- **Monitoramento**: Você pode acompanhar o progresso do build e do deploy na aba **"Deployments"**.
- **Logs**: Verifique os logs de build e da aplicação para identificar e corrigir possíveis erros.

O arquivo `nixpacks.toml` e `railway.json` ajudam o Railway a entender como construir e iniciar a aplicação, usando `gunicorn` como servidor de produção.

### 6. Verificação e Acesso

Após o deploy ser concluído com sucesso, o Railway fornecerá um domínio público para acessar sua aplicação.

1.  No painel do projeto, vá para a aba **"Settings"** do serviço da aplicação.
2.  Na seção **"Domains"**, você encontrará a URL pública gerada (ex: `dashboard-solconect-production.up.railway.app`).
3.  Acesse a URL no seu navegador.

**Primeiro Acesso:**

- A aplicação criará as tabelas do banco de dados e os usuários padrão no primeiro boot.
- Você pode fazer login com um dos usuários padrão definidos no `src/main.py`:
    - **Usuário:** `Renato` / **Senha:** `renato123` (Admin)
    - **Usuário:** `Victor` / **Senha:** `victor123` (Editor)

---

## Solução de Problemas Comuns

- **Erro de Build**: Verifique se o arquivo `requirements.txt` está correto e se todas as dependências são compatíveis.
- **Aplicação não Inicia (Application Error)**: Consulte os logs em tempo real no Railway. Geralmente, o problema está relacionado a uma variável de ambiente ausente ou a um erro no código de inicialização.
- **Erro de Conexão com o Banco de Dados**: Confirme se a variável `DATABASE_URL` está configurada corretamente e se o banco de dados está ativo.

Com este guia, seu **Dashboard Solconect** estará funcionando em um ambiente de produção robusto, seguro e com persistência de dados. Parabéns!
