<template>
  <q-page class="code-output-page" :class="{ 'dark': $q.dark.isActive }">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>Code Output</h1>
        <p>Gere o código PHP e Vue a partir dos scopes definidos</p>
      </div>
    </div>

    <!-- Scope Selector -->
    <div class="scope-selector">
      <q-select
        v-model="selectedScope"
        :options="scopes"
        option-label="name"
        option-value="name"
        label="Selecione um Scope"
        outlined
        class="scope-select"
        @update:model-value="onScopeChange"
      >
        <template v-slot:prepend>
          <q-icon name="folder" />
        </template>
      </q-select>

      <q-btn 
        label="Gerar Todos os Arquivos" 
        color="primary" 
        icon="play_arrow"
        @click="generateAll"
        :disable="!selectedScope"
        class="q-ml-md"
      />
    </div>

    <!-- Modules List -->
    <div v-if="selectedScope" class="modules-section">
      <h2 class="section-title">
        <q-icon name="apps" class="q-mr-sm" />
        Módulos em "{{ selectedScope.name }}"
      </h2>

      <div class="modules-grid">
        <div 
          v-for="(module, i) in selectedScope.modules" 
          :key="`mod-${i}`"
          class="module-card"
          :class="{ 'active': selectedModule === module }"
          @click="selectModule(module)"
        >
          <div class="module-icon">
            <q-icon name="view_module" />
          </div>
          <div class="module-info">
            <h4>{{ module.name }}</h4>
            <span>{{ module.column?.length || 0 }} colunas</span>
          </div>
          <q-icon name="chevron_right" class="module-arrow" />
        </div>
      </div>
    </div>

    <!-- Code Panels -->
    <div v-if="selectedModule" class="code-section">
      <q-tabs v-model="activeTab" class="code-tabs" align="left">
        <q-tab name="model" label="Model" icon="data_object" />
        <q-tab name="controller" label="Controller" icon="api" />
        <q-tab name="repository" label="Repository" icon="storage" />
        <q-tab name="migration" label="Migration" icon="schema" />
        <q-tab name="artisan" label="Artisan" icon="terminal" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated class="code-panels">
        <q-tab-panel v-for="tab in codeTabs" :key="tab.name" :name="tab.name">
          <div class="code-block-container">
            <div class="code-header">
              <div class="code-info">
                <span class="code-filename">{{ tab.filename }}</span>
                <span class="code-lang">{{ tab.lang }}</span>
              </div>
              <div class="code-actions">
                <button class="code-btn" @click="copyCode(tab.name)">
                  📋 Copiar
                </button>
                <button class="code-btn" @click="downloadCode(tab.name, tab.filename)">
                  ⬇️ Download
                </button>
              </div>
            </div>
            <pre class="code-content"><code>{{ generatedCode[tab.name] }}</code></pre>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Empty State -->
    <div v-else-if="selectedScope" class="empty-state">
      <q-icon name="touch_app" size="64px" color="grey-5" />
      <p>Selecione um módulo para ver o código gerado</p>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import useServices from 'src/composables/Services'

export default {
  name: 'CodeOutput',
  
  setup() {
    const $q = useQuasar()
    const { Api } = useServices()
    
    const scopes = ref([])
    const selectedScope = ref(null)
    const selectedModule = ref(null)
    const activeTab = ref('model')

    const codeTabs = computed(() => {
      if (!selectedModule.value) return []
      const m = selectedModule.value
      const tbl = toTableName(m.name)
      return [
        { name: 'model', filename: 'app/Models/' + m.name + '.php', lang: 'php' },
        { name: 'controller', filename: 'app/Http/Controllers/API/' + m.name + 'Controller.php', lang: 'php' },
        { name: 'repository', filename: 'app/Repositories/' + m.name + 'Repository.php', lang: 'php' },
        { name: 'migration', filename: 'database/migrations/' + tbl + '_init.php', lang: 'php' },
        { name: 'artisan', filename: 'Terminal', lang: 'bash' }
      ]
    })

    const toTableName = (name) => {
      return name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '') + 's'
    }

    const generatedCode = computed(() => {
      if (!selectedModule.value) return {}
      
      const m = selectedModule.value
      const columns = m.column || []
      const tbl = toTableName(m.name)
      
      return {
        model: buildModel(m.name, tbl, columns),
        controller: buildController(m.name),
        repository: buildRepository(m.name, columns),
        migration: buildMigration(tbl, columns),
        artisan: buildArtisan()
      }
    })

    const buildModel = (name, tbl, columns) => {
      const fillable = columns
        .filter(c => c.name !== 'id' && c.type !== 'bigIncrements')
        .map(c => "        '" + c.name + "'")
        .join(',\n')

      const belongsToRels = columns
        .filter(c => c.belongsTo)
        .map(c => {
          return '\n    public function ' + c.belongsTo.name + '()\n    {\n        return $this->belongsTo(' + c.belongsTo.model + '::class, \'' + c.name + '\', \'' + (c.belongsTo.owner_key || 'id') + '\');\n    }'
        })
        .join('\n')

      const lines = [
        '<?php',
        '',
        'namespace App\\Models;',
        '',
        'use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;',
        'use Illuminate\\Database\\Eloquent\\Model;',
        '',
        'class ' + name + ' extends Model',
        '{',
        '    use HasFactory;',
        '',
        '    protected $table = \'' + tbl + '\';',
        '',
        '    protected $fillable = [',
        fillable,
        '    ];',
        '',
        '    protected $casts = [',
        '        \'created_at\' => \'datetime\',',
        '        \'updated_at\' => \'datetime\',',
        '    ];' + belongsToRels,
        '}'
      ]
      return lines.join('\n')
    }

    const buildController = (name) => {
      const lines = [
        '<?php',
        '',
        'namespace App\\Http\\Controllers\\API;',
        '',
        'use App\\Http\\Controllers\\Controller;',
        'use App\\Repositories\\' + name + 'Repository;',
        'use Illuminate\\Http\\Request;',
        '',
        'class ' + name + 'Controller extends Controller',
        '{',
        '    protected $repository;',
        '',
        '    public function __construct(' + name + 'Repository $repository)',
        '    {',
        '        $this->repository = $repository;',
        '    }',
        '',
        '    public function index(Request $request)',
        '    {',
        '        $data = $this->repository->paginate($request);',
        '        return response()->json($data);',
        '    }',
        '',
        '    public function store(Request $request)',
        '    {',
        '        $data = $this->repository->create($request->all());',
        '        return response()->json([',
        '            \'success\' => true,',
        '            \'message\' => \'' + name + ' created successfully\',',
        '            \'data\' => $data',
        '        ]);',
        '    }',
        '',
        '    public function show($id)',
        '    {',
        '        $data = $this->repository->find($id);',
        '        return response()->json($data);',
        '    }',
        '',
        '    public function update(Request $request, $id)',
        '    {',
        '        $data = $this->repository->update($id, $request->all());',
        '        return response()->json([',
        '            \'success\' => true,',
        '            \'message\' => \'' + name + ' updated successfully\',',
        '            \'data\' => $data',
        '        ]);',
        '    }',
        '',
        '    public function destroy($id)',
        '    {',
        '        $this->repository->delete($id);',
        '        return response()->json([',
        '            \'success\' => true,',
        '            \'message\' => \'' + name + ' deleted successfully\'',
        '        ]);',
        '    }',
        '}'
      ]
      return lines.join('\n')
    }

    const buildRepository = (name, columns) => {
      const searchable = columns
        .filter(c => c.type === 'string' || c.type === 'text')
        .map(c => "'" + c.name + "'")
        .join(', ')

      const lines = [
        '<?php',
        '',
        'namespace App\\Repositories;',
        '',
        'use App\\Models\\' + name + ';',
        'use App\\Traits\\StandardRepo;',
        '',
        'class ' + name + 'Repository',
        '{',
        '    use StandardRepo;',
        '',
        '    protected $model;',
        '    protected $searchable = [' + searchable + '];',
        '',
        '    public function __construct(' + name + ' $model)',
        '    {',
        '        $this->model = $model;',
        '    }',
        '}'
      ]
      return lines.join('\n')
    }

    const buildMigration = (tbl, columns) => {
      const cols = columns
        .filter(c => c.type !== 'bigIncrements')
        .map(c => {
          let line = "            $table->" + c.type + "('" + c.name + "')"
          if (c.nullable || (c.attributes && c.attributes.includes('nullable'))) {
            line += '->nullable()'
          }
          if (c.default !== null && c.default !== undefined && c.default !== '') {
            line += "->default('" + c.default + "')"
          }
          return line + ';'
        })
        .join('\n')

      const lines = [
        '<?php',
        '',
        'use Illuminate\\Database\\Migrations\\Migration;',
        'use Illuminate\\Database\\Schema\\Blueprint;',
        'use Illuminate\\Support\\Facades\\Schema;',
        '',
        'return new class extends Migration',
        '{',
        '    public function up(): void',
        '    {',
        '        Schema::create(\'' + tbl + '\', function (Blueprint $table) {',
        '            $table->id();',
        cols,
        '            $table->timestamps();',
        '        });',
        '    }',
        '',
        '    public function down(): void',
        '    {',
        '        Schema::dropIfExists(\'' + tbl + '\');',
        '    }',
        '};'
      ]
      return lines.join('\n')
    }

    const buildArtisan = () => {
      const scopeName = selectedScope.value?.name || 'scope_name'
      const lines = [
        '# Gerar todos os arquivos do scope "' + scopeName + '"',
        'php artisan lavarel-generate ' + scopeName,
        '',
        '# Executar migrations',
        'php artisan migrate',
        '',
        '# Rodar seeds (se houver)',
        'php artisan db:seed',
        '',
        '# Limpar cache',
        'php artisan cache:clear',
        'php artisan config:clear',
        'php artisan route:clear'
      ]
      return lines.join('\n')
    }

    const loadScopes = () => {
      Api.get('app/scopes', (status, data) => {
        if (status === 200 && data) {
          scopes.value = data
        }
      })
    }

    const onScopeChange = () => {
      selectedModule.value = null
      activeTab.value = 'model'
    }

    const selectModule = (module) => {
      selectedModule.value = module
      activeTab.value = 'model'
    }

    const copyCode = (tabName) => {
      const code = generatedCode.value[tabName]
      if (code) {
        navigator.clipboard.writeText(code)
        $q.notify({
          type: 'positive',
          message: 'Código copiado!',
          position: 'top'
        })
      }
    }

    const downloadCode = (tabName, filename) => {
      const code = generatedCode.value[tabName]
      if (code) {
        const blob = new Blob([code], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename.split('/').pop()
        a.click()
        URL.revokeObjectURL(url)
      }
    }

    const generateAll = () => {
      if (!selectedScope.value) return
      
      $q.notify({
        type: 'info',
        message: 'Gerando arquivos...',
        caption: 'Scope: ' + selectedScope.value.name
      })
      
      Api.put('app/scopes/' + (selectedScope.value.id || selectedScope.value.name), selectedScope.value, (status) => {
        if (status === 200) {
          $q.notify({
            type: 'positive',
            message: 'Arquivos gerados com sucesso!',
            caption: 'Execute php artisan lavarel-generate para aplicar'
          })
        }
      })
    }

    loadScopes()

    return {
      $q,
      scopes,
      selectedScope,
      selectedModule,
      activeTab,
      codeTabs,
      generatedCode,
      onScopeChange,
      selectModule,
      copyCode,
      downloadCode,
      generateAll
    }
  }
}
</script>

<style lang="scss" scoped>
.code-output-page {
  min-height: 100vh;
  background: #f5f7fa;
  
  &.dark {
    background: #121212;
    
    .section-title,
    .module-info h4 {
      color: #e2e8f0;
    }
    
    .module-card {
      background: #1e293b;
      
      &.active {
        background: #2d3748;
      }
    }
    
    .scope-select,
    .code-tabs {
      background: #1e293b;
    }
  }
}

.page-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 48px 32px;
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin: 0;
    }
    
    p {
      color: rgba(255,255,255,0.7);
      margin: 8px 0 0;
    }
  }
}

.scope-selector {
  max-width: 1200px;
  margin: -24px auto 32px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  
  .scope-select {
    flex: 1;
    max-width: 400px;
    background: white;
    border-radius: 12px;
  }
}

.modules-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px 32px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.module-card {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #667eea;
    background: #f0f4ff;
  }
}

.module-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
}

.module-info {
  flex: 1;
  
  h4 {
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  span {
    font-size: 0.85rem;
    color: #64748b;
  }
}

.module-arrow {
  color: #94a3b8;
}

.code-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px 48px;
}

.code-tabs {
  background: white;
  border-radius: 12px 12px 0 0;
}

.code-panels {
  background: transparent;
}

.empty-state {
  text-align: center;
  padding: 64px;
  color: #94a3b8;
  
  p {
    margin: 16px 0 0;
  }
}

.code-block-container {
  background: #0f172a;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.code-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.code-filename {
  color: #e2e8f0;
  font-family: monospace;
  font-size: 0.875rem;
}

.code-lang {
  padding: 2px 8px;
  background: #334155;
  border-radius: 4px;
  color: #94a3b8;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.code-actions {
  display: flex;
  gap: 8px;
}

.code-btn {
  padding: 6px 12px;
  background: #334155;
  border: none;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #475569;
  }
}

.code-content {
  padding: 16px;
  margin: 0;
  overflow-x: auto;
  max-height: 500px;
  
  code {
    color: #e2e8f0;
    font-size: 0.875rem;
    line-height: 1.6;
    white-space: pre;
  }
}
</style>
