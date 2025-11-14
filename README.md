# Sistema de Cadastro de Leads - React

Este é um sistema de cadastro de leads desenvolvido em React para substituir a versão PHP e ser hospedado no GitHub Pages.

## 🚀 Funcionalidades

- ✅ Cadastro completo de leads
- ✅ Envio automático para webhook N8N
- ✅ Backup local no localStorage
- ✅ Interface responsiva
- ✅ Validação de formulários
- ✅ Campos condicionais (Due Diligence e Indicação)
- ✅ Múltiplas razões sociais/CNPJs

## 🛠️ Tecnologias

- React 18
- Axios para requisições HTTP
- CSS3 com design responsivo
- GitHub Pages para hospedagem

## 📦 Como fazer o deploy no GitHub Pages

### 1. Criar o repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Nome: `cadastro-lead`
4. Marque como "Public"
5. Clique em "Create repository"

### 2. Fazer upload dos arquivos

Você pode fazer de duas formas:

#### Opção A: Via interface web do GitHub
1. No seu repositório, clique em "uploading an existing file"
2. Arraste todos os arquivos desta pasta
3. Commit as mudanças

#### Opção B: Via Git (recomendado)
```bash
# Navegar até a pasta do projeto
cd cadastro-lead

# Inicializar git
git init

# Adicionar remote
git remote add origin https://github.com/LeoMarquesSilva/cadastro-lead.git

# Adicionar arquivos
git add .

# Commit
git commit -m "Initial commit - Sistema de cadastro de leads React"

# Push
git branch -M main
git push -u origin main
```

### 3. Configurar GitHub Pages

1. No seu repositório, vá em "Settings"
2. No menu lateral, clique em "Pages"
3. Em "Source", selecione "GitHub Actions"
4. O deploy será automático a cada push na branch main

### 4. Instalar dependências localmente (opcional)

Se quiser testar localmente:

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Build para produção
npm run build

# Deploy manual (se necessário)
npm run deploy
```

## 🌐 URL do site

Após o deploy, seu site estará disponível em:
`https://LeoMarquesSilva.github.io/cadastro-lead`

## 🔧 Configuração do Webhook

O sistema tenta enviar para múltiplos endpoints do N8N:
- `http://212.85.2.227/webhook/cadastro-lead2`
- `http://212.85.2.227:3000/webhook/cadastro-lead2`
- `https://ia-n8n.a8fvaf.easypanel.host/webhook/cadastro-lead2`

Se o webhook falhar, os dados são salvos no localStorage do navegador como backup.

## 📱 Recursos

- **Responsivo**: Funciona em desktop, tablet e mobile
- **Offline**: Salva dados localmente se o webhook falhar
- **Validação**: Campos obrigatórios e validação de email
- **UX**: Interface intuitiva com campos condicionais
- **Backup**: Dados salvos no localStorage como segurança

## 🐛 Solução de Problemas

### Webhook não funciona
- Os dados são salvos localmente no navegador
- Verifique o console do navegador para logs detalhados
- Teste os endpoints do N8N individualmente

### Deploy falha
- Verifique se o repositório é público
- Confirme que o GitHub Actions está habilitado
- Verifique os logs na aba "Actions" do repositório

### Site não carrega
- Aguarde alguns minutos após o primeiro deploy
- Verifique se a URL está correta
- Limpe o cache do navegador

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs no console do navegador (F12)
2. Verifique os logs do GitHub Actions
3. Teste os webhooks individualmente
4. Verifique se todos os arquivos foram enviados corretamente

---

**Desenvolvido para substituir o sistema PHP e resolver problemas de SSL com o N8N**