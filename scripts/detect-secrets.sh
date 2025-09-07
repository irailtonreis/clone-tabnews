#!/bin/sh
# Verifica arquivos adicionados ao commit
FILES=$(git diff --cached --name-only)

# 1️⃣ Bloquear extensões proibidas
if echo "$FILES" | grep -qE '(\.env|\.pem|\.key|\.crt|\.p12|\.keystore)$'; then
  echo "❌ Você está tentando commitar arquivos sensíveis (.env, .pem, .key, .crt...)!"
  exit 1
fi

# 2️⃣ Buscar padrões suspeitos em arquivos de código
for file in $FILES; do
  if [ -f "$file" ] && echo "$file" | grep -qE '\.(js|ts|tsx|jsx|json)$'; then
    if grep -qE '(API_KEY\s*=|SECRET\s*=|AWS_SECRET|BEGIN PRIVATE KEY)' "$file"; then
      echo "❌ Possível chave/segredo encontrado no arquivo: $file"
      exit 1
    fi
  fi
done

echo "✅ Nenhum segredo detectado, commit liberado!"
exit 0
