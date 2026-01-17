<p align="center">
  <img src="assets/logo.png" alt="Lavarel" width="300">
</p>

# Guia: Criando Módulos no Lavarel

## O que é o Lavarel?

O Lavarel é uma **aplicação fullstack completa** (backend Laravel + frontend Vue/Quasar) que funciona como **gerador de código**. 

Você usa o Lavarel para criar novos módulos, e ele gera automaticamente todo o código necessário — tanto no backend quanto no frontend.

```
┌─────────────────────────────────────────────────────────┐
│                       LAVAREL                           │
├────────────────────────┬────────────────────────────────┤
│   Frontend (Vue)       │      Backend (Laravel)         │
│   • Interface admin    │      • API REST                │
│   • Telas CRUD         │      • Autenticação            │
│   • UI Kit             │      • Permissões RBAC         │
├────────────────────────┴────────────────────────────────┤
│                      GERADOR                            │
│        JSON de definição → Código fullstack             │
└─────────────────────────────────────────────────────────┘
```

**Dois papéis:**

1. **Aplicação funcional** — Sistema de admin pronto com login, permissões, notificações
2. **Ferramenta geradora** — Cria módulos automaticamente a partir de JSON

---

## Conceito de Módulo

Um **módulo** representa uma entidade do sistema (ex: Produtos, Clientes, Pedidos). 

Quando você define um módulo em JSON e executa o gerador, o Lavarel cria automaticamente:

| Backend (Laravel) | Frontend (Vue/Quasar) |
|-------------------|----------------------|
| Model | Página de listagem |
| Controller | Página de formulário |
| Repository | Página de detalhes |
| Migration | Rotas |

---

## Passo a Passo: Criando o Módulo "Products"

### 1. Criar o arquivo de definição

Crie `generator/scopes/products.json`:

```json
[
  {
    "name": "Products",
    "column": [
      {
        "name": "id",
        "type": "bigIncrements",
        "attributes": ["index"]
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "description",
        "type": "text",
        "attributes": ["nullable"]
      },
      {
        "name": "price",
        "type": "double",
        "length": 10,
        "length2": 2
      },
      {
        "name": "stock",
        "type": "integer",
        "default": 0
      },
      {
        "name": "is_active",
        "type": "boolean",
        "default": true
      }
    ]
  }
]
```

### 2. Executar o gerador

```bash
php artisan lv:generate --scope=products
```

Arquivos criados:
```
app/
├── Models/Products.php
├── Models/Products_H.php
├── Http/Controllers/API/ProductsController.php
├── Repositories/ProductsRepository.php

database/migrations/
├── xxxx_products_init.php

ui/src/pages/products/
├── Index.vue
├── Form.vue
├── Detail.vue
```

### 3. Registrar o módulo

Edite `config/lv_modules.php`:

```php
return [
    "Users",
    "Permissions",
    "RolePermissions",
    "RoleGroups",
    "Roles",
    "Metas",
    "Notifications",
    "UserNotifications",
    "Products",  // ← adicione aqui
];
```

### 4. Executar a migration

```bash
php artisan migrate
```

### 5. Adicionar ao menu (opcional)

Edite `config/lv_menu.php`:

```php
[
    'title' => 'Products',
    'route' => 'products',
    'icon' => 'inventory_2',
],
```

### 6. Adicionar rota no frontend

Edite `ui/src/router/routes.js` e adicione dentro do array de rotas:

```javascript
{
  path: '/products',
  name: 'products',
  component: () => import('pages/products/Index.vue'),
},
{
  path: '/products/create',
  name: 'products-create',
  component: () => import('pages/products/Form.vue'),
},
{
  path: '/products/:id',
  name: 'products-detail',
  component: () => import('pages/products/Detail.vue'),
},
{
  path: '/products/:id/edit',
  name: 'products-edit',
  component: () => import('pages/products/Form.vue'),
},
```

---

## Referência: Tipos de Coluna

| Tipo | Descrição | Parâmetros extras |
|------|-----------|-------------------|
| `bigIncrements` | ID auto-increment (PK) | - |
| `string` | Texto curto (255 chars) | - |
| `text` | Texto longo | - |
| `longtext` | Texto muito longo | - |
| `integer` | Número inteiro | - |
| `double` | Decimal | `length`, `length2` |
| `boolean` | Verdadeiro/Falso | - |
| `date` | Data | - |
| `dateTime` | Data e hora | - |
| `enum` | Lista de opções | `enum_list: [...]` |
| `unsignedBigInteger` | Chave estrangeira | `belongsTo: {...}` |

---

## Referência: Atributos

```json
{
  "name": "email",
  "type": "string",
  "attributes": ["nullable", "unique", "index"]
}
```

| Atributo | Efeito |
|----------|--------|
| `nullable` | Campo pode ser nulo |
| `unique` | Valor único na tabela |
| `index` | Cria índice para busca |

---

## Exemplo: Campo com Relacionamento

Para criar uma FK que relaciona Products → Categories:

```json
{
  "name": "category_id",
  "type": "unsignedBigInteger",
  "attributes": ["index"],
  "belongsTo": {
    "name": "Category",
    "model": "Categories",
    "foreign_key": "category_id",
    "owner_key": "id"
  }
}
```

Isso gera automaticamente:
- Coluna `category_id` na tabela
- Método `Category()` no Model para acessar o relacionamento
- Select no formulário Vue

---

## Exemplo: Campo Enum

```json
{
  "name": "status",
  "type": "enum",
  "default": "pending",
  "enum_list": ["pending", "approved", "rejected"]
}
```

---

## Exemplo Completo: Módulo de Pedidos

`generator/scopes/orders.json`:

```json
[
  {
    "name": "Orders",
    "column": [
      {
        "name": "id",
        "type": "bigIncrements",
        "attributes": ["index"]
      },
      {
        "name": "user_id",
        "type": "unsignedBigInteger",
        "attributes": ["index"],
        "belongsTo": {
          "name": "User",
          "model": "Users",
          "foreign_key": "user_id",
          "owner_key": "id"
        }
      },
      {
        "name": "total",
        "type": "double",
        "length": 12,
        "length2": 2
      },
      {
        "name": "status",
        "type": "enum",
        "default": "pending",
        "enum_list": ["pending", "paid", "shipped", "delivered", "cancelled"]
      },
      {
        "name": "notes",
        "type": "text",
        "attributes": ["nullable"]
      },
      {
        "name": "ordered_at",
        "type": "dateTime"
      }
    ]
  }
]
```

Depois:

```bash
php artisan lv:generate --scope=orders
# Registrar em config/lv_modules.php
php artisan migrate
```

---

## Dicas

1. **Nomes em PascalCase**: Use `Products`, não `products` ou `Product`
2. **Plural**: O nome do módulo deve ser no plural
3. **Escopo separado**: Crie um arquivo JSON por domínio (products.json, orders.json)
4. **Backup antes de gerar**: O gerador sobrescreve arquivos existentes

---

## Estrutura de Arquivos Gerados

```
Products/
├── Model (app/Models/Products.php)
│   └── Eloquent com fillable, casts e relacionamentos
│
├── Model Helper (app/Models/Products_H.php)
│   └── Métodos auxiliares estáticos
│
├── Controller (app/Http/Controllers/API/ProductsController.php)
│   └── CRUD: index, detail, store, delete, restore
│
├── Repository (app/Repositories/ProductsRepository.php)
│   └── Queries e lógica de acesso a dados
│
├── Migration (database/migrations/xxxx_products_init.php)
│   └── Criação da tabela no banco
│
└── Frontend (ui/src/pages/products/)
    ├── Index.vue   → Listagem com tabela
    ├── Form.vue    → Criar/Editar
    └── Detail.vue  → Visualização
```

---

## Testando

Após criar o módulo:

1. Acesse http://localhost:8080
2. Navegue até o menu do módulo
3. Crie, edite e delete registros
4. Verifique a API em http://localhost:8000/api/products
