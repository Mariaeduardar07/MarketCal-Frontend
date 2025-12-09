# 🔧 Correção: Erro 500 ao Atualizar Conta Social

## ❌ Problema Identificado

**Erro**: Request failed with status code 500 (Internal Server Error)  
**Endpoint**: PUT /social-accounts/:id  
**Causa Provável**: Backend não está lidando corretamente com o campo `avatar` na atualização

---

## ✅ Soluções Implementadas

### 1. **Logs Detalhados na Atualização**

Agora mostra exatamente o que está sendo enviado:

```javascript
📤 Atualizando conta social ID 123: {
  name: "Maria Silva",
  platform: "Instagram",
  handle: "mariasilva",
  avatar: "[Base64: 85KB]"
}
```

Se houver erro, mostra:

```javascript
❌ Erro ao atualizar conta social: {
  id: 123,
  message: "Request failed with status code 500",
  responseData: { /* mensagem do backend */ },
  responseStatus: 500,
  sentData: { /* dados enviados */ }
}
```

### 2. **Fallback Automático - Atualizar Sem Avatar**

Se o backend retornar erro 500 ao tentar atualizar com avatar:

```javascript
1. Tenta atualizar COM avatar
2. Se erro 500 → Tenta atualizar SEM avatar
3. Se sucesso → Mostra mensagem informativa
4. Se erro → Exibe erro original
```

### 3. **Otimização: Não Enviar Avatar Se Não Mudou**

**Problema**: Toda vez que editava, reenviava o avatar (mesmo sem mudar)

**Solução**: Agora rastreia se o avatar foi alterado

```javascript
// Estado inicial
avatar: "/image/existing-avatar.png"
avatarChanged: false

// Usuário edita nome, mas não muda foto
→ NÃO envia avatar no update

// Usuário troca a foto
→ avatarChanged = true
→ Envia novo avatar no update

// Usuário remove a foto
→ avatarChanged = true
→ Envia avatar vazio no update
```

---

## 🎯 Como Funciona Agora

### Cenário 1: Editar SEM Mudar Foto

```javascript
1. Clica em "Editar"
2. Muda nome/plataforma/handle
3. NÃO mexe na foto
4. Clica em "Atualizar"

Resultado:
📋 Dados sendo enviados: {
  name: "Novo Nome",
  platform: "YouTube",
  handle: "novo_handle"
  // avatar NÃO é enviado
}
✅ Atualização bem-sucedida
```

### Cenário 2: Editar E Trocar Foto

```javascript
1. Clica em "Editar"
2. Clica em "📷 Trocar Foto"
3. Seleciona nova imagem
4. Clica em "Atualizar"

Resultado:
📋 Dados sendo enviados: {
  name: "Nome",
  platform: "Instagram",
  handle: "handle",
  avatar: "[Base64: 85KB]"  // Novo avatar incluído
}

Se sucesso: ✅ Atualizado
Se erro 500: ⚠️ Tenta sem avatar → Mensagem informativa
```

### Cenário 3: Editar E Remover Foto

```javascript
1. Clica em "Editar"
2. Clica no X vermelho (remover foto)
3. Clica em "Atualizar"

Resultado:
📋 Dados sendo enviados: {
  name: "Nome",
  platform: "Instagram",
  handle: "handle",
  avatar: ""  // Avatar vazio (removido)
}
```

---

## 🧪 Testes a Realizar

### Teste 1: Editar APENAS Texto (sem mexer na foto)

```
1. Clique em "Editar" numa conta que JÁ TEM foto
2. Mude apenas o nome
3. NÃO mexa na foto
4. Clique em "Atualizar"

Esperado no Console:
⚠️ Avatar não foi alterado, não enviando no update
📋 Dados sendo enviados: { avatar: "não incluído" }
✅ Atualizado com sucesso
```

### Teste 2: Editar E Trocar Foto

```
1. Clique em "Editar"
2. Clique em "📷 Trocar Foto"
3. Selecione nova imagem
4. Clique em "Atualizar"

Esperado no Console:
📸 Imagem comprimida: XX KB
📋 Dados sendo enviados: { avatar: "[Base64: XX KB]" }

Cenário A (sucesso):
✅ Conta atualizada com sucesso

Cenário B (erro 500):
⚠️ Erro ao atualizar com avatar, tentando sem avatar...
✅ Atualizado sem avatar
Alert: "Atualizado com sucesso! (Nota: Backend não permite atualizar avatar)"
```

### Teste 3: Editar E Remover Foto

```
1. Clique em "Editar" numa conta com foto
2. Clique no X vermelho
3. Clique em "Atualizar"

Esperado:
📋 Dados sendo enviados: { avatar: "" }
✅ Atualizado → Foto removida do card
```

---

## 🔍 Diagnóstico do Erro 500

Para identificar a causa exata do erro 500, verifique no console:

```javascript
❌ Erro ao atualizar conta social: {
  responseData: {
    message: "LEIA ESTA MENSAGEM DO BACKEND"  ← IMPORTANTE
  }
}
```

### Causas Possíveis:

| Mensagem do Backend            | Causa                                  | Solução                         |
| ------------------------------ | -------------------------------------- | ------------------------------- |
| "Campo avatar não permitido"   | Backend não aceita avatar no UPDATE    | ✅ Fallback ativo               |
| "Erro ao processar imagem"     | Backend tenta processar Base64 e falha | ✅ Fallback ativo               |
| "Tamanho muito grande"         | Limite de payload excedido             | ✅ Compressão reduz para ~100KB |
| "userId não pode ser alterado" | Enviando campo inválido                | Não enviar userId no update     |
| "Campo obrigatório faltando"   | Falta name/platform/handle             | Verificar validação             |

---

## 📊 Fluxo de Atualização

```mermaid
1. Usuário clica "Editar"
   ↓
2. Formulário carrega com dados atuais
   ↓
3. Usuário faz alterações
   ↓
4. Clica "Atualizar"
   ↓
5. Sistema verifica: Avatar foi alterado?
   ├─ NÃO → Remove avatar dos dados
   └─ SIM → Inclui avatar (comprimido)
   ↓
6. Envia PUT /social-accounts/:id
   ↓
7. Backend processa
   ├─ Sucesso (200) → ✅ Atualiza lista
   └─ Erro (500) → Tenta sem avatar
       ├─ Sucesso → ✅ Atualiza + aviso
       └─ Erro → ❌ Mostra erro
```

---

## 🎯 Checklist de Verificação

- [ ] Testar editar SEM trocar foto
- [ ] Verificar console: "Avatar não foi alterado, não enviando"
- [ ] Testar editar E trocar foto
- [ ] Verificar console: Logs detalhados do erro (se houver)
- [ ] Verificar se fallback funciona (tenta sem avatar)
- [ ] Testar remover foto existente
- [ ] Verificar se atualização persiste no banco

---

## 💡 Observações Importantes

### ⚠️ Se o Backend NÃO Aceita Avatar no Update:

**Opção 1 - Frontend (temporário):**

- ✅ Fallback automático já implementado
- Updates funcionam, mas avatar não muda

**Opção 2 - Backend (permanente):**

```javascript
// Controller de Update
const { name, platform, handle, avatar } = req.body;

// Se avatar foi enviado, atualizar
const updateData = { name, platform, handle };
if (avatar !== undefined) {
  updateData.avatar = avatar;
}

await prisma.socialAccount.update({
  where: { id },
  data: updateData,
});
```

### 🎯 Comportamento Esperado:

1. **Criar** → SEMPRE envia avatar (opcional)
2. **Editar sem trocar foto** → NÃO envia avatar
3. **Editar e trocar foto** → Envia novo avatar
4. **Editar e remover foto** → Envia avatar vazio

---

## 🚀 Próximos Passos

1. **Teste editar uma conta existente** (sem trocar foto)
2. **Verifique o console** - deve dizer "Avatar não foi alterado"
3. **Me envie os logs** se ainda der erro 500:
   ```
   ❌ Erro ao atualizar conta social: {
     responseData: { ... }  ← ESTA PARTE
   }
   ```

**Com esses logs, posso identificar exatamente o que o backend não está aceitando!** 🔍
