#!/bin/bash

echo "🚀 Iniciando deploy do Sistema de Cadastro de Leads..."

# Verificar se o Git está inicializado
if [ ! -d ".git" ]; then
    echo "📁 Inicializando repositório Git..."
    git init
    git remote add origin https://github.com/LeoMarquesSilva/cadastro-lead.git
fi

# Adicionar todos os arquivos
echo "📦 Adicionando arquivos..."
git add .

# Commit
echo "💾 Fazendo commit..."
git commit -m "Deploy: Sistema de cadastro de leads React - $(date)"

# Push para o GitHub
echo "🌐 Enviando para o GitHub..."
git branch -M main
git push -u origin main

echo "✅ Deploy concluído!"
echo "🌍 Seu site estará disponível em: https://LeoMarquesSilva.github.io/cadastro-lead"
echo "⏱️  Aguarde alguns minutos para o GitHub Pages processar..."