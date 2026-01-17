# Lavarel

Gerador fullstack de módulos CRUD. Define um JSON → gera backend Laravel + frontend Vue/Quasar automaticamente.

## Quick Start

```bash
# Backend
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite   # ou configure MySQL no .env
php artisan migrate --seed

# Frontend
cd ui && npm install

# Executar (2 terminais)
php artisan serve              # http://localhost:8000
cd ui && npx quasar dev        # http://localhost:8080
```

**Login:** `boss@mail.com` / `password`

## Stack

- **Backend:** Laravel 10, Sanctum, SQLite/MySQL
- **Frontend:** Vue 3, Quasar 2, Pinia

## Estrutura

```
app/
├── Http/Controllers/API/    # REST endpoints
├── Models/                  # Eloquent (*_H.php = helpers)
├── Repositories/            # Query abstraction
├── Services/                # Business logic
└── Traits/                  # Shared behaviors

generator/
├── scopes/*.json            # Definições dos módulos
└── template/                # Templates de código
    ├── api/                 # Controller, Model, Migration, Repository
    └── ui/                  # Index, Form, Detail (Vue)

ui/src/
├── components/
│   ├── core/                # Layout: TopBar, SideNav, Notif
│   ├── globals/             # Páginas de erro (401, 403)
│   └── Lavarel/             # UI Kit: LvTable, LvInput, LvBtn...
├── layouts/                 # MainLayout, Login
├── pages/                   # Telas por módulo
├── services/                # Api.js, Helper.js, Handler.js
└── store/                   # Pinia (GlobalStore)
```

## Gerador

### 1. Criar scope JSON

`generator/scopes/products.json`:
```json
[{
  "name": "Products",
  "column": [
    { "name": "id", "type": "bigIncrements", "attributes": ["index"] },
    { "name": "name", "type": "string" },
    { "name": "price", "type": "double", "length": 10, "length2": 2 },
    { "name": "category_id", "type": "unsignedBigInteger",
      "belongsTo": { "model": "Categories", "name": "Category" }
    }
  ]
}]
```

### 2. Gerar

```bash
php artisan lv:generate --scope=products
```

### 3. Registrar

`config/lv_modules.php`:
```php
return [
    "Users", "Roles", /* ... */
    "Products",  // novo
];
```

### 4. Migrar

```bash
php artisan migrate
```

## Tipos de Coluna

| Tipo | Uso |
|------|-----|
| `bigIncrements` | PK auto-increment |
| `string` | VARCHAR(255) |
| `text` | Texto longo |
| `double` | Decimal (`length`, `length2`) |
| `boolean` | 0/1 |
| `enum` | Lista fixa (`enum_list: [...]`) |
| `dateTime` | Timestamp |
| `unsignedBigInteger` | FK (com `belongsTo`) |

## API

### Auth
```
POST /api/app/login     { email, password } → { token }
Header: Authorization: Bearer {token}
```

### CRUD (por módulo)
```
GET    /api/{module}           Listar
GET    /api/{module}/{id}      Detalhe
POST   /api/{module}           Criar
PUT    /api/{module}/{id}      Atualizar
PUT    /api/{module}/delete    Soft delete (batch)
PUT    /api/{module}/restore   Restaurar (batch)
```

### Usuário
```
GET /api/me                    Perfil
GET /api/me/permissions        Permissões
GET /api/me/notifications      Notificações
```

## Componentes UI (Lavarel Kit)

| Componente | Descrição |
|------------|-----------|
| `LvTable` | Tabela com paginação, busca, ordenação |
| `LvInput` | Input com validação integrada |
| `LvSelect` | Select com busca |
| `LvBtn` | Botão padronizado |
| `LvUploader` | Upload de arquivos |
| `LvContainer` | Wrapper de página |
| `LvHeaderPage` | Título + breadcrumb + ações |
| `LvDisplayer` | Exibição de dados readonly |

## Config

### .env
```env
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
```

### API Root (Frontend)
Definido em `ui/src/index.template.html`. Reseta automaticamente ao mudar versão.

## CORS

Configurado em `config/cors.php` para aceitar todas origens em desenvolvimento.

## Licença

MIT
