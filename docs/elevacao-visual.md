# Sistema de Profundidade Visual (Elevation)

Este documento descreve o sistema de profundidade visual utilizado no Monynha Fun para padronizar sombras, hierarquia e feedback de interação na interface.

## Tokens de Profundidade

Os níveis de profundidade são definidos via variáveis CSS no arquivo global `src/index.css`.

### Modo claro

- `--shadow-depth-1`: sombra leve (equivalente a `--shadow-sm`)
- `--shadow-depth-2`: sombra média (equivalente a `--shadow-md`)
- `--shadow-depth-3`: sombra intensa (equivalente a `--shadow-lg`)

### Modo escuro

No modo escuro, os valores são ajustados para aumentar o contraste das sombras sobre fundos escuros.

## Utilitários Tailwind

Os tokens são expostos no Tailwind como utilitários:

- `shadow-depth-1`
- `shadow-depth-2`
- `shadow-depth-3`

Normalmente, recomenda-se usar as classes de conveniência de elevação (`.elevation-*`). Porém, esses utilitários estão disponíveis para casos específicos.

## Classes Utilitárias de Elevação

As classes abaixo estão definidas no `@layer utilities` de `src/index.css`.

### `.elevation-card`

- **Uso**: cartões, blocos de conteúdo, itens clicáveis.
- **Comportamento**: sombra leve no estado normal, sobe para o nível 2 no hover/focus.

Exemplo:

```tsx
<div className="elevation-card rounded-lg bg-white p-4 dark:bg-neutral-800">
  <PlaylistCard data={item} />
</div>
```

### `.elevation-hover`

- **Uso**: elementos que não possuem sombra por padrão, mas devem “subir” ao interagir.
- **Comportamento**: sem sombra no estado normal, aplica `depth-1` no hover/focus.

Exemplo:

```tsx
<button className="elevation-hover rounded-md px-4 py-2">
  Ação
</button>
```

### `.elevation-dialog`

- **Uso**: modais, diálogos, popovers e menus sobrepostos.
- **Comportamento**: aplica a sombra mais intensa (nível 3) o tempo todo.

Exemplo:

```tsx
<DialogContent className="elevation-dialog">
  ...
</DialogContent>
```

### `.elevation-fab`

- **Uso**: Floating Action Buttons (FAB) e botões flutuantes.
- **Comportamento**: `depth-2` por padrão, sobe para `depth-3` no hover/focus.

Exemplo:

```tsx
<button className="elevation-fab rounded-full bg-primary p-4 text-white">
  ➕
</button>
```

## Acessibilidade e Contraste

- **Foco por teclado**: as classes aplicam sombras em `:focus`, mas recomenda-se combinar com `focus:ring-*` em elementos interativos para reforçar o feedback visual.
- **Contraste**: valide em light/dark para garantir que as sombras estejam perceptíveis, porém sutis. Ajuste os valores de `--shadow-depth-*` se necessário.
- **Hierarquia**: use `elevation-dialog` para garantir maior destaque em superfícies sobrepostas.

## Observações

- Sempre que possível, use as classes `.elevation-*` em vez de valores de sombra isolados.
- Ajustes futuros nos níveis de profundidade devem ser feitos nas variáveis CSS globais para manter consistência.
