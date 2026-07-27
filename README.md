# BookManager

Aplicação full stack para gestão colaborativa de livros, com backend em Spring Boot + PostgreSQL + JWT e frontend em React + TypeScript + Material UI.

## Stack

- Backend: Java 21, Spring Boot 3, Spring Security, JWT (jjwt), Flyway, JPA/Hibernate
- Frontend: React 19, TypeScript, Material UI, React Query, Axios, SweetAlert2
- Infra: Docker, Docker Compose, Nginx

## Arquitetura

Backend segue separação por camadas com orientação a Clean Architecture:

- `domain`: entidades, regras e contratos (ports)
- `application`: use cases e DTOs
- `infrastructure`: controllers, segurança, persistência e configurações

Regras atuais do catálogo:

- qualquer usuário autenticado pode criar, editar e excluir livros
- não existe mais separação por proprietário (`createdBy`)
- autorização de acesso é feita pela camada de segurança e use cases

## Execução com Docker (1 comando)

Pré-requisito: Docker Desktop ativo.

### Rodar em outra máquina (clone + up)

```powershell
git clone <url-do-repo>
cd bookmanager
docker compose up
```

Opcional: para personalizar portas, banco e JWT, copie `.env.example` para `.env` antes de subir.

```powershell
docker compose up --build
```

URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Health: http://localhost:8080/actuator/health
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Autenticação e usuários seed

Usuários seed (Flyway):

- ADMIN: `admin@bookmanager.com`
- USER: `user@bookmanager.com`
- Senha (ambos): `password`

Fluxo JWT:

1. `POST /api/auth/login`
2. usar token no header `Authorization: Bearer <token>`
3. renovar token em `POST /api/auth/refresh`
4. logout em `POST /api/auth/logout`

## Funcionalidades principais

- Login e cadastro
- CRUD colaborativo de livros
- CRUD administrativo de usuários (somente ADMIN)
- Ativação/inativação de usuários
- Swagger com autenticação Bearer JWT
- Tratamento padronizado de erros

## Testes e qualidade

### Backend

Build + testes via Docker:

```powershell
docker compose build backend
```

### Frontend

```powershell
cd frontend
npm install
npm run lint
npm run build
```

## Variáveis importantes

- `JWT_SECRET` (Base64)
- `JWT_EXPIRATION_MS`
- `REFRESH_TOKEN_EXPIRATION_MS`
- `CORS_ALLOWED_ORIGINS`
- `VITE_API_BASE_URL`

## Troubleshooting

Se houver conflito de estado antigo no banco durante evolução de migrations:

```powershell
docker compose down
docker volume rm bookmanager_postgres_data
docker compose up --build
```
