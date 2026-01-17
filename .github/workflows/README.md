# GitHub Actions Workflows

Este diretório contém os workflows de CI/CD para o projeto Monynha Fun.

## Workflows

### 1. CI (`ci.yml`)

**Trigger**: Push e Pull Requests em todas as branches

**Funcionalidades**:
- ✅ Instala dependências com pnpm (usando cache)
- ✅ Executa linting (ESLint)
- ✅ Verifica tipos (TypeScript)
- ✅ Executa testes unitários (Vitest)
- ✅ Faz build da aplicação (Vite)
- ✅ Upload de artefatos de build (retido por 7 dias)

**Timeout**: 15 minutos

**Concorrência**: Cancela runs anteriores da mesma branch

### 2. Schedule Mark Top Featured (`schedule-mark-top-featured.yml`)

**Trigger**: 
- Agendado: Diariamente às 02:00 UTC
- Manual: Via workflow_dispatch

**Funcionalidades**:
- 🎯 Chama a Edge Function `mark-top-featured` do Supabase
- ✅ Marca os 4 vídeos com mais visualizações como featured
- ✅ Validação de resposta HTTP com tratamento de erro
- ✅ Logs detalhados da execução

**Segurança**: Usa Service Role Key para autenticação privilegiada

## Configuração de Secrets

Para que os workflows funcionem corretamente, configure os seguintes **secrets** no GitHub:

### Secrets Necessários

1. **`VITE_SUPABASE_URL`**
   - Descrição: URL da API do Supabase
   - Exemplo: `https://xxxxxxxxxxxxx.supabase.co`
   - Uso: Todos os workflows (CI e scheduled)
   - Tipo: Secret (recomendado) ou Repository variable
   - Localização: Supabase Dashboard → Settings → API → Project URL

2. **`VITE_SUPABASE_PUBLISHABLE_KEY`**
   - Descrição: Publishable Key (anon key) do Supabase
   - Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Uso: CI workflow (testes e build)
   - Tipo: Secret
   - Localização: Supabase Dashboard → Settings → API → anon public key
   - ℹ️ Segura para uso em frontend e testes

3. **`SUPABASE_SERVICE_ROLE_KEY`** ⚠️ **IMPORTANTE**
   - Descrição: Service Role Key do Supabase (com privilégios elevados)
   - Localização: Supabase Dashboard → Settings → API → service_role key
   - Uso: `schedule-mark-top-featured.yml`
   - Tipo: Secret (nunca expor publicamente)
   - ⚠️ **NÃO use a anon/publishable key aqui!**

### Como Configurar Secrets no GitHub

1. Vá para o repositório no GitHub
2. Clique em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Adicione cada secret listado acima

### Diferença entre Publishable Key e Service Role Key

- **Publishable Key (anon)**: 
  - Segura para uso no frontend
  - Respeitada por Row Level Security (RLS)
  - Limitada às permissões do usuário

- **Service Role Key**: 
  - ⚠️ **NUNCA** use no frontend
  - Bypassa Row Level Security (RLS)
  - Acesso administrativo completo
  - Apenas para backend/scripts automatizados

## Testes Locais

### Testar CI localmente

```bash
# Instalar dependências
pnpm install

# Executar lint
pnpm run lint

# Verificar tipos
pnpm run typecheck

# Executar testes
pnpm run test

# Fazer build
pnpm run build
```

### Testar scheduled workflow localmente

```bash
# Definir variáveis de ambiente
export SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Fazer chamada manual à Edge Function
curl -X POST "${SUPABASE_URL}/functions/v1/mark-top-featured" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"limit":4}'
```

## Monitoramento

- **CI**: Verifique a tab "Actions" no GitHub após cada push/PR
- **Scheduled**: 
  - Verifica logs na tab "Actions" após execução
  - Pode executar manualmente via "Run workflow" button

## Troubleshooting

### CI falha no step de "Test"

**Causa**: Testes unitários falhando  
**Solução**: Execute `pnpm run test` localmente e corrija os testes

### CI falha no step de "Type check"

**Causa**: Erros de tipo TypeScript  
**Solução**: Execute `pnpm run typecheck` localmente e corrija os erros

### Schedule workflow retorna 401 Unauthorized

**Causa**: Secret `SUPABASE_SERVICE_ROLE_KEY` não configurado ou incorreto  
**Solução**: 
1. Verifique se o secret está configurado no GitHub
2. Confirme que está usando a Service Role Key, não a Publishable Key
3. Verifique se a Edge Function está deployada no Supabase

### Schedule workflow retorna 500 Internal Server Error

**Causa**: Erro na Edge Function ou RPC  
**Solução**:
1. Verifique os logs da Edge Function no Supabase Dashboard
2. Confirme que a função RPC `mark_top_videos_as_featured` existe no banco
3. Execute a função manualmente no Supabase para debug

## Melhorias Futuras

- [ ] Adicionar workflow de deploy automático
- [ ] Adicionar testes de cobertura com threshold mínimo
- [ ] Adicionar notificações de falha (Slack/Discord)
- [ ] Adicionar workflow para preview de PRs
- [ ] Adicionar cache de dependências do Supabase CLI
