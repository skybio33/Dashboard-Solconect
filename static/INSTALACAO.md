# Guia de Instalação - Dashboard Solconect

## 🎯 Objetivo

Este guia fornece instruções detalhadas para instalar e configurar o Dashboard Solconect em diferentes plataformas de hospedagem.

## 📋 Pré-requisitos

Antes de iniciar a instalação, certifique-se de ter:

- Acesso a um serviço de hospedagem web
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet estável

## 🚀 Opções de Hospedagem

### **1. Netlify (Recomendado - Gratuito)**

O Netlify é a opção mais simples e rápida para hospedar o dashboard.

#### **Passo a Passo:**

1. **Acesse o Netlify**
   - Vá para [netlify.com](https://netlify.com)
   - Crie uma conta gratuita se não tiver

2. **Deploy por Drag & Drop**
   - Na página inicial, localize a área "Deploy manually"
   - Arraste a pasta `dashboard-solconect-4fases` para essa área
   - Aguarde o upload e processamento

3. **Configuração Automática**
   - O Netlify gerará automaticamente um URL público
   - Exemplo: `https://amazing-site-123456.netlify.app`

4. **Personalizar URL (Opcional)**
   - Acesse as configurações do site
   - Altere o nome do site para algo como `dashboard-solconect`
   - Novo URL: `https://dashboard-solconect.netlify.app`

#### **Vantagens do Netlify:**
- Deploy instantâneo
- HTTPS automático
- CDN global
- Atualizações fáceis
- Domínio personalizado gratuito

### **2. Vercel (Alternativa Gratuita)**

#### **Passo a Passo:**

1. **Acesse o Vercel**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login com GitHub, GitLab ou email

2. **Novo Projeto**
   - Clique em "New Project"
   - Selecione "Browse All Templates"
   - Escolha "Static Site"

3. **Upload dos Arquivos**
   - Faça upload da pasta do dashboard
   - Configure o nome do projeto
   - Clique em "Deploy"

4. **Acesso ao Site**
   - URL será gerado automaticamente
   - Exemplo: `https://dashboard-solconect.vercel.app`

### **3. GitHub Pages (Gratuito)**

#### **Pré-requisitos:**
- Conta no GitHub

#### **Passo a Passo:**

1. **Criar Repositório**
   - Acesse [github.com](https://github.com)
   - Clique em "New repository"
   - Nome: `dashboard-solconect`
   - Marque como "Public"

2. **Upload dos Arquivos**
   - Clique em "uploading an existing file"
   - Arraste todos os arquivos do dashboard
   - Commit as mudanças

3. **Ativar GitHub Pages**
   - Vá em "Settings" do repositório
   - Role até "Pages"
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"

4. **Acessar o Site**
   - URL: `https://seuusuario.github.io/dashboard-solconect`

### **4. Hospedagem Tradicional (cPanel)**

Para hospedagens tradicionais com cPanel:

#### **Passo a Passo:**

1. **Acesso ao cPanel**
   - Faça login no painel de controle da hospedagem
   - Localize o "File Manager"

2. **Upload dos Arquivos**
   - Navegue até a pasta `public_html`
   - Crie uma pasta `dashboard` (opcional)
   - Faça upload de todos os arquivos

3. **Configurar Permissões**
   - Certifique-se de que os arquivos têm permissão 644
   - Pastas devem ter permissão 755

4. **Testar Acesso**
   - Acesse `https://seudominio.com/dashboard`
   - Ou `https://seudominio.com` se instalou na raiz

## 🔧 Configurações Pós-Instalação

### **1. Teste Inicial**

Após a instalação, teste as seguintes funcionalidades:

- **Login de Usuários**: Teste com Renato, Victor e Fabriciano
- **Criação de Tarefas**: Adicione uma tarefa de teste
- **Movimentação**: Mova a tarefa entre as fases
- **Filtros**: Teste os filtros por área e responsável
- **Responsividade**: Acesse pelo celular

### **2. Configuração de Usuários**

Se precisar adicionar novos usuários:

1. Abra o arquivo `script.js`
2. Localize a seção `const users = {`
3. Adicione novos usuários seguindo o padrão existente
4. Faça upload do arquivo atualizado

### **3. Personalização de Cores**

Para alterar as cores das áreas de negócio:

1. Abra o arquivo `styles.css`
2. Localize as classes `.business-area-*`
3. Modifique as propriedades `background-color`
4. Salve e faça upload

### **4. Backup de Dados**

Configure rotinas de backup:

- Os dados ficam no localStorage do navegador
- Oriente os usuários a exportar dados importantes
- Considere implementar backup automático no futuro

## 📱 Configuração Mobile

### **PWA (Progressive Web App)**

O dashboard pode ser instalado como app no celular:

1. **Android (Chrome)**
   - Acesse o dashboard
   - Menu → "Adicionar à tela inicial"

2. **iOS (Safari)**
   - Acesse o dashboard
   - Botão compartilhar → "Adicionar à Tela de Início"

3. **Desktop**
   - Chrome: Ícone de instalação na barra de endereços
   - Edge: Menu → "Aplicativos" → "Instalar este site como aplicativo"

## 🔒 Segurança

### **Configurações Recomendadas**

1. **HTTPS Obrigatório**
   - Certifique-se de que o site usa HTTPS
   - Netlify e Vercel fazem isso automaticamente

2. **Headers de Segurança**
   - Configure CSP (Content Security Policy) se possível
   - Adicione headers anti-clickjacking

3. **Backup Regular**
   - Mantenha cópias dos arquivos atualizados
   - Documente mudanças realizadas

## 🚨 Solução de Problemas

### **Problemas Comuns**

#### **Dashboard não carrega**
- Verifique se todos os arquivos foram enviados
- Confirme se JavaScript está habilitado
- Teste em modo incógnito

#### **Estilos não aplicados**
- Verifique se o arquivo `styles.css` foi carregado
- Limpe o cache do navegador
- Confirme o caminho dos arquivos

#### **Dados não salvam**
- Verifique se localStorage está disponível
- Teste em diferentes navegadores
- Confirme se não há bloqueadores de script

#### **Layout quebrado no mobile**
- Verifique a meta tag viewport no HTML
- Teste em diferentes dispositivos
- Confirme se CSS responsivo está funcionando

### **Logs e Debugging**

Para identificar problemas:

1. **Console do Navegador**
   - Pressione F12
   - Vá na aba "Console"
   - Procure por erros em vermelho

2. **Network Tab**
   - Verifique se todos os arquivos carregaram
   - Confirme códigos de status 200

3. **Application Tab**
   - Verifique localStorage
   - Confirme dados salvos

## 📞 Suporte Técnico

### **Recursos de Ajuda**

- **Documentação**: Consulte o README.md
- **Comunidade**: Fóruns das plataformas de hospedagem
- **Tutoriais**: YouTube e documentações oficiais

### **Contatos de Emergência**

Para problemas críticos:
- Mantenha backup dos arquivos originais
- Documente erros com screenshots
- Teste em ambiente de desenvolvimento primeiro

---

**Instalação Concluída com Sucesso!**

*Seu Dashboard Solconect está pronto para uso. Compartilhe o link com sua equipe e comece a organizar suas atividades de forma mais eficiente.*
