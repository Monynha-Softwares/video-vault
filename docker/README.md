# Docker Deployment Guide

Este guia explica como fazer build e deploy da aplicação Monynha Fun usando Docker.

## Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+ (opcional, para desenvolvimento local)
- Variáveis de ambiente do Supabase configuradas

## Variáveis de Ambiente Necessárias

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

## Build da Imagem

### Build Manual

```bash
docker build \
  --build-arg VITE_SUPABASE_URL="https://xxxxx.supabase.co" \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGc..." \
  -t monynha-fun:latest \
  .
```

### Build com Docker Compose

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
PORT=8080
```

Build:

```bash
docker-compose build
```

## Executar Container

### Execução Manual

```bash
docker run -d \
  --name monynha-fun \
  -p 8080:80 \
  --restart unless-stopped \
  monynha-fun:latest
```

### Execução com Docker Compose

```bash
docker-compose up -d
```

## Verificar Status

### Logs

```bash
# Docker
docker logs -f monynha-fun

# Docker Compose
docker-compose logs -f web
```

### Health Check

```bash
# Docker
docker inspect --format='{{json .State.Health}}' monynha-fun | jq

# Docker Compose
docker-compose ps
```

### Acessar Container

```bash
# Docker
docker exec -it monynha-fun sh

# Docker Compose
docker-compose exec web sh
```

## Parar e Remover

### Docker

```bash
docker stop monynha-fun
docker rm monynha-fun
```

### Docker Compose

```bash
docker-compose down

# Remove também volumes (se houver)
docker-compose down -v
```

## Deploy em Produção

### Build Multi-Arquitetura (AMD64 + ARM64)

```bash
docker buildx create --use
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="$VITE_SUPABASE_PUBLISHABLE_KEY" \
  -t monynha-fun:latest \
  --push \
  .
```

### Deploy em Cloud Providers

#### Fly.io

```bash
# Configurar secrets
fly secrets set VITE_SUPABASE_URL="https://xxxxx.supabase.co"
fly secrets set VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGc..."

# Deploy
fly deploy
```

#### Railway

```bash
# Via CLI
railway up

# Ou conecte o repositório via Dashboard e configure as variáveis
```

#### Render

1. Conecte o repositório no Dashboard
2. Configure as variáveis de ambiente
3. Deploy automático no push para main

#### AWS ECS / Google Cloud Run / Azure Container Instances

Siga a documentação específica de cada provedor, usando:
- Imagem: `monynha-fun:latest`
- Porta: 80
- Health check: `GET /index.html`

## Otimizações

### Cache de Layers

O Dockerfile está otimizado para usar cache do Docker:
1. Copia apenas `package.json` e `pnpm-lock.yaml` primeiro
2. Instala dependências (layer cacheable)
3. Copia o resto do código
4. Faz build

### Multi-Stage Build

- **Stage 1 (builder)**: Node.js para build com pnpm
- **Stage 2 (production)**: Nginx Alpine (menor imagem)

Resultado: Imagem final ~25MB vs ~500MB se incluísse Node.js

### Segurança

- ✅ Roda como usuário `nginx` (não root)
- ✅ Security headers configurados
- ✅ `server_tokens off` (esconde versão do Nginx)
- ✅ Health check configurado
- ✅ Apenas porta 80 exposta

### Performance

- ✅ Gzip compression habilitado
- ✅ Cache de assets estáticos (1 ano)
- ✅ SPA routing otimizado
- ✅ index.html sem cache (sempre atualizado)

## Troubleshooting

### Build falha: "frozen lockfile"

Certifique-se de que `pnpm-lock.yaml` está commitado e atualizado:

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
```

### Container não inicia

Verifique logs:

```bash
docker logs monynha-fun
```

### Health check falhando

Acesse o container e teste manualmente:

```bash
docker exec -it monynha-fun sh
wget -O- http://localhost/index.html
```

### Variáveis de ambiente não funcionam

As variáveis devem ser passadas como **build args**, não env vars:

```bash
# ❌ Errado
docker run -e VITE_SUPABASE_URL="..." monynha-fun

# ✅ Correto
docker build --build-arg VITE_SUPABASE_URL="..." -t monynha-fun .
```

Isso porque o Vite incorpora as variáveis no build, não no runtime.

## Estrutura de Arquivos

```
.
├── Dockerfile              # Multi-stage build otimizado
├── docker-compose.yml      # Orquestração local
├── .dockerignore          # Arquivos ignorados no build
└── docker/
    └── nginx/
        └── nginx.conf     # Configuração customizada do Nginx
```

## Referências

- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
