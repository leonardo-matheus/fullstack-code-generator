<p align="center">
  <img src="docs/assets/logo.png" alt="Lavarel" width="400">
</p>

<h1 align="center">🚀 Lavarel Fullstack Generator</h1>

<p align="center">
  <strong>Framework completo para criar aplicações Laravel + Vue 3</strong><br>
  Gere módulos CRUD completos com um comando. Backend + Frontend integrados automaticamente.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue">
  <img src="https://img.shields.io/badge/Quasar-2.x-1976D2?style=for-the-badge&logo=quasar&logoColor=white" alt="Quasar">
  <img src="https://img.shields.io/badge/Naive_UI-2.x-18A058?style=for-the-badge" alt="Naive UI">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

<p align="center">
  <a href="https://leonardo-matheus.github.io/Lavarel-Fullstack-Generator/">📖 Documentação</a> •
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-componentes">Componentes</a>
</p>

---

## ✨ Features

- 🔧 **Gerador de Módulos** - Crie CRUD completo com um comando
- 🎨 **20+ Componentes** - Biblioteca completa com Naive UI
- 🌙 **Dark Mode** - Suporte nativo a tema escuro
- 🔐 **Autenticação** - Laravel Sanctum com roles e permissões
- 📱 **100% Responsivo** - Mobile-first design
- 💳 **Credit Card** - Componente com detecção de bandeira e banco
- 📊 **Formatação BR** - CPF, CNPJ, telefone, moeda automático

---

## 🚀 Quick Start

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

## 🎨 Componentes UI (Lavarel Kit)

| Componente | Descrição |
|------------|-----------|
| `LvInput` | Input com validação, modos: text, number, currency, date |
| `LvSelect` | Select com busca, múltipla seleção e ajax |
| `LvBtn` | Botão com variantes: soft, flat, outlined, loading |
| `LvTable` | Tabela com paginação, busca, ordenação |
| `LvCard` | Card com header, footer e slots |
| `LvModal` | Modal com header, conteúdo e footer |
| `LvContainer` | Container flex com layout responsivo |
| `LvDisplayer` | Exibidor com formatação automática (CPF, CNPJ, moeda) |
| `LvAvatar` | Avatar com imagem ou iniciais automáticas |
| `LvBadge` | Badge para notificações e contadores |
| `LvTag` | Tag/chip com tipos e ações |
| `LvProgress` | Barra de progresso linear ou circular |
| `LvDivider` | Separador horizontal ou vertical |
| `LvEmpty` | Estado vazio para listas |
| `LvSkeleton` | Skeleton loading placeholder |
| `LvTooltip` | Tooltip responsivo com tipos |
| `LvCreditCard` | Cartão de crédito com detecção de bandeira e banco BR |

---

## 📸 Screenshots

<p align="center">
  <img src="docs/assets/screenshot-dark.png" alt="Dark Mode" width="45%">
  <img src="docs/assets/screenshot-light.png" alt="Light Mode" width="45%">
</p>

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com ❤️ por <a href="https://github.com/leonardo-matheus">Leonardo Matheus</a>
</p>
