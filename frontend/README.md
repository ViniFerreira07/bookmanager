# BookManager Frontend

Frontend React/TypeScript para o BookManager.

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Configuração

Variável principal:

- `VITE_API_BASE_URL` (vazio em Docker para usar same-origin com proxy Nginx)

## Funcionalidades

- Login e cadastro com feedback visual via SweetAlert2
- Dashboard colaborativo de livros
- CRUD de livros (criar, editar, excluir)
- Página de administração de usuários (somente ADMIN)

## Padrões adotados

- Estado assíncrono com React Query
- Camada de serviços HTTP centralizada em `src/services`
- Guardas de rota com `ProtectedRoute`
- UI com Material UI + feedback de carregamento e estados vazios
