# Docker Troubleshooting - Monynha Fun

## Erro: "The system cannot find the file specified" (Windows)

### Problema
```
ERROR: error during connect: Head "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/_ping": 
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

### Causa
O Docker Desktop não está rodando no Windows.

### Solução

1. **Abra o Docker Desktop**
   - Procure "Docker Desktop" no Menu Iniciar
   - Clique para abrir

2. **Aguarde inicialização completa**
   - Verifique o ícone na bandeja do sistema (system tray)
   - Aguarde até o ícone ficar verde/estável
   - Pode levar 30-60 segundos

3. **Verifique se está funcionando**
   ```bash
   docker info
   ```
   
   Se funcionar, você verá informações sobre o Docker.

4. **Execute o build novamente**
   ```bash
   bash docker/build.sh
   ```

### Alternativas se Docker Desktop não iniciar

#### Opção 1: Reinicie o serviço
```powershell
# No PowerShell como Administrador
Restart-Service docker
```

#### Opção 2: Reinicie o Docker Desktop
1. Feche completamente o Docker Desktop (Exit no system tray)
2. Abra novamente
3. Aguarde a inicialização

#### Opção 3: Reinicie o computador
Se nada funcionar, reinicie o Windows.

## Erro: ".env file not found"

### Solução
Crie um arquivo `.env` ou `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://wvkjainfwsyiyfcmbtid.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Erro: "frozen lockfile"

### Problema
```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile"
```

### Solução
```bash
# Atualize o lockfile
pnpm install

# Commit as mudanças
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"

# Build novamente
bash docker/build.sh
```

## Erro: Build muito lento

### Soluções

#### 1. Limpe o cache do Docker
```bash
docker builder prune
```

#### 2. Use BuildKit (mais rápido)
```bash
DOCKER_BUILDKIT=1 docker build ...
```

#### 3. Ajuste recursos do Docker Desktop
- Abra Docker Desktop
- Settings → Resources
- Aumente CPU e Memory

## Erro: "Permission denied" (Linux/Mac)

### Solução
```bash
# Adicione seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Ou execute com sudo
sudo bash docker/build.sh
```

## Erro: Container não inicia (Exit code 1 ou 137)

### Verificar logs
```bash
docker logs monynha-fun
```

### Possíveis causas

#### Out of Memory (Exit 137)
```bash
# Aumente memory no Docker Desktop
# Settings → Resources → Memory
```

#### Port já em uso (Exit 1)
```bash
# Verifique se porta 8080 está ocupada
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Linux/Mac

# Use outra porta
docker run -p 3000:80 ...
```

## Erro: "No space left on device"

### Solução
```bash
# Remova imagens não utilizadas
docker image prune -a

# Remova containers parados
docker container prune

# Remova tudo não utilizado
docker system prune -a --volumes
```

## Erro: Health check failing

### Verificar
```bash
# Entre no container
docker exec -it monynha-fun sh

# Teste manualmente
wget -O- http://localhost/index.html

# Verifique se nginx está rodando
ps aux | grep nginx
```

## Build funciona mas app não carrega

### Verificar variáveis de ambiente

As variáveis do Vite são **incorporadas no build**, não no runtime:

```bash
# ❌ Não funciona - tarde demais
docker run -e VITE_SUPABASE_URL="..." monynha-fun

# ✅ Correto - durante o build
docker build --build-arg VITE_SUPABASE_URL="..." ...
```

### Rebuild com variáveis corretas
```bash
bash docker/build.sh
```

## Windows: Script não executa

### Git Bash não funciona
Use PowerShell ou WSL2:

```powershell
# PowerShell
docker build `
  --build-arg VITE_SUPABASE_URL="..." `
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="..." `
  -t monynha-fun:latest .
```

Ou use Docker Compose:
```bash
docker-compose up --build
```

## Comandos Úteis de Diagnóstico

```bash
# Verificar se Docker está rodando
docker info

# Listar containers
docker ps -a

# Listar imagens
docker images

# Verificar uso de espaço
docker system df

# Logs detalhados do build
docker build --progress=plain --no-cache ...

# Inspecionar container
docker inspect monynha-fun

# Ver processos dentro do container
docker top monynha-fun

# Estatísticas de recursos
docker stats monynha-fun
```

## Ainda com problemas?

1. Verifique a versão do Docker:
   ```bash
   docker --version
   docker-compose --version
   ```
   Recomendado: Docker 20.10+ e Docker Compose 2.0+

2. Verifique os logs do Docker Desktop:
   - Docker Desktop → Troubleshoot → Show Logs

3. Reinicie o Docker Desktop:
   - Docker Desktop → System Tray → Quit
   - Abra novamente

4. Em último caso, reinstale o Docker Desktop:
   - https://www.docker.com/products/docker-desktop/
