<template>
  <div class="generator-page">
    <!-- Header -->
    <div class="generator-header">
      <div class="header-content">
        <n-h1 class="header-title">Module Generator</n-h1>
        <n-text depth="3" class="header-subtitle">Crie módulos fullstack em poucos cliques</n-text>
        <n-button 
          quaternary 
          size="small" 
          class="legacy-link"
          @click="$router.push('/generator-legacy')"
        >
          <template #icon>
            <n-icon><SettingsOutline /></n-icon>
          </template>
          Versão avançada
        </n-button>
      </div>
    </div>

    <!-- Grid de Opções -->
    <div class="generator-grid">
      <!-- Card: Novo Módulo -->
      <div class="generator-card generator-card--primary" @click="openWizard('module')">
        <div class="card-icon">
          <n-icon :size="32"><AddCircleOutline /></n-icon>
        </div>
        <h3 class="card-title">Novo Módulo</h3>
        <p class="card-description">Criar um módulo CRUD completo com Model, Controller, Migration e páginas Vue</p>
        <div class="card-arrow">
          <n-icon><ChevronForwardOutline /></n-icon>
        </div>
      </div>

      <!-- Card: Novo Scope -->
      <div class="generator-card" @click="openWizard('scope')">
        <div class="card-icon card-icon--purple">
          <n-icon :size="32"><FolderOpenOutline /></n-icon>
        </div>
        <h3 class="card-title">Novo Scope</h3>
        <p class="card-description">Agrupar módulos relacionados em um escopo para organização</p>
        <div class="card-arrow">
          <n-icon><ChevronForwardOutline /></n-icon>
        </div>
      </div>

      <!-- Card: Importar JSON -->
      <div class="generator-card" @click="openWizard('import')">
        <div class="card-icon card-icon--teal">
          <n-icon :size="32"><CloudUploadOutline /></n-icon>
        </div>
        <h3 class="card-title">Importar JSON</h3>
        <p class="card-description">Importar definição de módulos a partir de arquivo JSON</p>
        <div class="card-arrow">
          <n-icon><ChevronForwardOutline /></n-icon>
        </div>
      </div>

      <!-- Card: Gerar Código -->
      <div class="generator-card" @click="openWizard('generate')">
        <div class="card-icon card-icon--green">
          <n-icon :size="32"><PlayOutline /></n-icon>
        </div>
        <h3 class="card-title">Gerar Código</h3>
        <p class="card-description">Executar gerador para criar arquivos backend e frontend</p>
        <div class="card-arrow">
          <n-icon><ChevronForwardOutline /></n-icon>
        </div>
      </div>
    </div>

    <!-- Scopes Existentes -->
    <div class="existing-scopes" v-if="scopes.length">
      <h2 class="section-title">
        <n-icon style="margin-right: 8px;"><LayersOutline /></n-icon>
        Scopes Existentes
      </h2>
      <div class="scopes-grid">
        <div 
          v-for="(scope, i) in scopes" 
          :key="`scope-${i}`"
          class="scope-card"
          @click="editScope(scope)"
        >
          <div class="scope-avatar" :style="{ background: getGradient(i) }">
            {{ getInitials(scope.name) }}
          </div>
          <div class="scope-info">
            <h4 class="scope-name">{{ scope.name }}</h4>
            <span class="scope-count">{{ scope.modules?.length || 0 }} módulos</span>
          </div>
          <n-icon class="scope-arrow"><ChevronForwardOutline /></n-icon>
        </div>
      </div>
    </div>

    <!-- Wizard Modal -->
    <n-modal v-model:show="wizard.show" :mask-closable="false" style="width: 100vw; height: 100vh; max-width: 100vw;">
      <n-card class="wizard-container" :bordered="false" style="width: 100%; height: 100%; border-radius: 0;">
        <!-- Wizard Header -->
        <template #header>
          <div class="wizard-header">
            <div class="wizard-header-left">
              <n-button quaternary circle @click="closeWizard" class="close-btn">
                <template #icon>
                  <n-icon><CloseOutline /></n-icon>
                </template>
              </n-button>
              <h2 class="wizard-title">{{ wizardTitle }}</h2>
            </div>
            <div class="wizard-steps">
              <div 
                v-for="(step, i) in wizard.steps" 
                :key="`step-${i}`"
                class="step-indicator"
                :class="{ 
                  'step-indicator--active': wizard.currentStep === i,
                  'step-indicator--completed': wizard.currentStep > i 
                }"
              >
                <div class="step-number">
                  <n-icon v-if="wizard.currentStep > i"><CheckmarkOutline /></n-icon>
                  <span v-else>{{ i + 1 }}</span>
                </div>
                <span class="step-label">{{ step.label }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Wizard Content -->
        <div class="wizard-content">
          <transition name="slide-fade" mode="out-in">
            <!-- Step 1: Info Básica -->
            <div v-if="wizard.currentStep === 0" key="step-0" class="wizard-step">
              <div class="step-header">
                <h3>Informações Básicas</h3>
                <p>Defina o nome e escopo do seu módulo</p>
              </div>
              
              <div class="form-group">
                <label>Nome do Módulo</label>
                <input 
                  v-model="wizard.data.name" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: Products, Customers, Orders"
                />
                <span class="form-hint">Use PascalCase para nomes compostos (ex: OrderItems)</span>
              </div>

              <div class="form-group">
                <label>Escopo</label>
                <select v-model="wizard.data.scope" class="form-input">
                  <option value="">Selecione um escopo</option>
                  <option v-for="s in scopes" :key="s.name" :value="s.name">{{ s.name }}</option>
                  <option value="__new__">+ Criar novo escopo</option>
                </select>
              </div>

              <div v-if="wizard.data.scope === '__new__'" class="form-group">
                <label>Nome do Novo Escopo</label>
                <input 
                  v-model="wizard.data.newScopeName" 
                  type="text" 
                  class="form-input"
                  placeholder="Ex: ecommerce, crm, inventory"
                />
              </div>
            </div>

            <!-- Step 2: Colunas -->
            <div v-else-if="wizard.currentStep === 1" key="step-1" class="wizard-step">
              <div class="step-header">
                <h3>Definir Colunas</h3>
                <p>Adicione os campos da sua tabela</p>
              </div>

              <div class="columns-list">
                <!-- Coluna ID (fixa) -->
                <div class="column-item column-item--fixed">
                  <div class="column-icon">
                    <n-icon><KeyOutline /></n-icon>
                  </div>
                  <div class="column-info">
                    <span class="column-name">id</span>
                    <span class="column-type">Primary Key (auto)</span>
                  </div>
                </div>

                <!-- Colunas dinâmicas -->
                <div 
                  v-for="(col, i) in wizard.data.columns" 
                  :key="`col-${i}`"
                  class="column-item"
                >
                  <div class="column-icon" :class="`column-icon--${getColumnColor(col.type)}`">
                    <n-icon><component :is="getColumnIconComponent(col.type)" /></n-icon>
                  </div>
                  <div class="column-fields">
                    <input 
                      v-model="col.name" 
                      type="text" 
                      class="column-input"
                      placeholder="nome_coluna"
                    />
                    <select v-model="col.type" class="column-select">
                      <option value="string">String</option>
                      <option value="text">Text</option>
                      <option value="integer">Integer</option>
                      <option value="double">Double</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                      <option value="dateTime">DateTime</option>
                      <option value="enum">Enum</option>
                      <option value="unsignedBigInteger">Foreign Key</option>
                    </select>
                    <label class="column-checkbox">
                      <input type="checkbox" v-model="col.nullable" />
                      <span>Nullable</span>
                    </label>
                  </div>
                  <n-button quaternary circle size="small" @click="removeColumn(i)" class="column-remove">
                    <template #icon><n-icon><CloseOutline /></n-icon></template>
                  </n-button>
                </div>

                <!-- Botão Adicionar -->
                <div class="column-add" @click="addColumn">
                  <n-icon><AddOutline /></n-icon>
                  <span>Adicionar Coluna</span>
                </div>
              </div>

              <!-- Templates Rápidos -->
              <div class="quick-templates">
                <span class="template-label">Templates rápidos:</span>
                <button class="template-btn" @click="applyTemplate('basic')">Básico</button>
                <button class="template-btn" @click="applyTemplate('timestamps')">+ Timestamps</button>
                <button class="template-btn" @click="applyTemplate('softdelete')">+ Soft Delete</button>
              </div>
            </div>

            <!-- Step 3: Relacionamentos -->
            <div v-else-if="wizard.currentStep === 2" key="step-2" class="wizard-step">
              <div class="step-header">
                <h3>Relacionamentos</h3>
                <p>Configure as relações com outros módulos</p>
              </div>

              <div class="relations-list">
                <div 
                  v-for="(col, i) in foreignKeyColumns" 
                  :key="`rel-${i}`"
                  class="relation-item"
                >
                  <div class="relation-header">
                    <n-icon class="relation-icon"><LinkOutline /></n-icon>
                    <span class="relation-column">{{ col.name }}</span>
                  </div>
                  <div class="relation-config">
                    <div class="form-group">
                      <label>Modelo Relacionado</label>
                      <input 
                        v-model="col.belongsTo.model" 
                        type="text"
                        class="form-input form-input--sm"
                        placeholder="Ex: Categories"
                      />
                    </div>
                    <div class="form-group">
                      <label>Nome da Relação</label>
                      <input 
                        v-model="col.belongsTo.name" 
                        type="text"
                        class="form-input form-input--sm"
                        placeholder="Ex: Category"
                      />
                    </div>
                  </div>
                </div>

                <div v-if="!foreignKeyColumns.length" class="no-relations">
                  <n-icon><InformationCircleOutline /></n-icon>
                  <p>Nenhuma coluna do tipo Foreign Key definida</p>
                </div>
              </div>
            </div>

            <!-- Step 4: Revisão -->
            <div v-else-if="wizard.currentStep === 3" key="step-3" class="wizard-step">
              <div class="step-header">
                <h3>Revisão</h3>
                <p>Confirme as configurações antes de gerar</p>
              </div>

              <div class="review-card">
                <div class="review-section">
                  <h4>Módulo</h4>
                  <div class="review-item">
                    <span class="review-label">Nome:</span>
                    <span class="review-value">{{ wizard.data.name }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">Tabela:</span>
                    <span class="review-value">{{ tableName }}</span>
                  </div>
                  <div class="review-item">
                    <span class="review-label">Escopo:</span>
                    <span class="review-value">{{ wizard.data.scope === '__new__' ? wizard.data.newScopeName : wizard.data.scope }}</span>
                  </div>
                </div>

                <div class="review-section">
                  <h4>Colunas ({{ wizard.data.columns.length + 1 }})</h4>
                  <div class="review-columns">
                    <span class="review-column review-column--pk">id</span>
                    <span 
                      v-for="col in wizard.data.columns" 
                      :key="col.name"
                      class="review-column"
                    >
                      {{ col.name }}
                    </span>
                  </div>
                </div>

                <div class="review-section">
                  <h4>Arquivos que serão gerados</h4>
                  <div class="review-files">
                    <div class="file-item file-item--php">
                      <n-icon><DocumentOutline /></n-icon>
                      <span>app/Models/{{ wizard.data.name }}.php</span>
                    </div>
                    <div class="file-item file-item--php">
                      <n-icon><DocumentOutline /></n-icon>
                      <span>app/Http/Controllers/API/{{ wizard.data.name }}Controller.php</span>
                    </div>
                    <div class="file-item file-item--php">
                      <n-icon><DocumentOutline /></n-icon>
                      <span>app/Repositories/{{ wizard.data.name }}Repository.php</span>
                    </div>
                    <div class="file-item file-item--php">
                      <n-icon><DocumentOutline /></n-icon>
                      <span>database/migrations/{{ migrationName }}</span>
                    </div>
                    <div class="file-item file-item--vue">
                      <n-icon><CodeSlashOutline /></n-icon>
                      <span>ui/src/pages/{{ slugName }}/Index.vue</span>
                    </div>
                    <div class="file-item file-item--vue">
                      <n-icon><CodeSlashOutline /></n-icon>
                      <span>ui/src/pages/{{ slugName }}/Form.vue</span>
                    </div>
                    <div class="file-item file-item--vue">
                      <n-icon><CodeSlashOutline /></n-icon>
                      <span>ui/src/pages/{{ slugName }}/Detail.vue</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Wizard Footer -->
        <template #footer>
          <div class="wizard-footer">
            <n-button 
              v-if="wizard.currentStep > 0"
              quaternary 
              @click="prevStep" 
              class="btn-back"
            >
              Voltar
            </n-button>
            <div style="flex: 1"></div>
            <n-button 
              v-if="wizard.currentStep < wizard.steps.length - 1"
              type="primary" 
              @click="nextStep"
              :disabled="!canProceed"
              class="btn-next"
            >
              Próximo
            </n-button>
            <n-button 
              v-else
              type="success" 
              @click="generateModule"
              class="btn-generate"
            >
              <template #icon><n-icon><CheckmarkOutline /></n-icon></template>
              Gerar Módulo
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
import { ref, computed, reactive, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  NButton,
  NIcon,
  NModal,
  NCard,
  NH1,
  NText,
} from 'naive-ui'
import {
  SettingsOutline,
  AddCircleOutline,
  ChevronForwardOutline,
  FolderOpenOutline,
  CloudUploadOutline,
  PlayOutline,
  LayersOutline,
  CloseOutline,
  CheckmarkOutline,
  KeyOutline,
  AddOutline,
  LinkOutline,
  InformationCircleOutline,
  DocumentOutline,
  CodeSlashOutline,
  TextOutline,
  ListOutline,
  CalendarOutline,
  ToggleOutline,
  GitBranchOutline,
} from '@vicons/ionicons5'
import useServices from 'src/composables/Services'

export default {
  name: 'GeneratorNew',
  components: {
    NButton,
    NIcon,
    NModal,
    NCard,
    NH1,
    NText,
    SettingsOutline,
    AddCircleOutline,
    ChevronForwardOutline,
    FolderOpenOutline,
    CloudUploadOutline,
    PlayOutline,
    LayersOutline,
    CloseOutline,
    CheckmarkOutline,
    KeyOutline,
    AddOutline,
    LinkOutline,
    InformationCircleOutline,
    DocumentOutline,
    CodeSlashOutline,
  },
  
  setup() {
    const { Api, Helper } = useServices()
    const router = useRouter()
    const message = useMessage()
    const scopes = ref([])
    const loading = ref(false)
    
    const wizard = reactive({
      show: false,
      type: 'module',
      currentStep: 0,
      steps: [
        { label: 'Básico' },
        { label: 'Colunas' },
        { label: 'Relações' },
        { label: 'Revisão' }
      ],
      data: {
        name: '',
        scope: '',
        newScopeName: '',
        columns: []
      }
    })

    const wizardTitle = computed(() => {
      const titles = {
        module: 'Criar Novo Módulo',
        scope: 'Criar Novo Scope',
        import: 'Importar JSON',
        generate: 'Gerar Código'
      }
      return titles[wizard.type] || 'Wizard'
    })

    const tableName = computed(() => {
      return wizard.data.name
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '') + 's'
    })

    const slugName = computed(() => {
      return wizard.data.name
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')
    })

    const migrationName = computed(() => {
      const date = new Date().toISOString().split('T')[0].replace(/-/g, '_')
      return `${date}_${tableName.value}_init.php`
    })

    const foreignKeyColumns = computed(() => {
      return wizard.data.columns
        .filter(c => c.type === 'unsignedBigInteger')
        .map(c => {
          if (!c.belongsTo) {
            c.belongsTo = { model: '', name: '', foreign_key: c.name, owner_key: 'id' }
          }
          return c
        })
    })

    const canProceed = computed(() => {
      if (wizard.currentStep === 0) {
        return wizard.data.name && 
               (wizard.data.scope || wizard.data.newScopeName)
      }
      return true
    })

    const loadScopes = () => {
      loading.value = true
      Api.get('app/scopes', (status, data) => {
        loading.value = false
        if (status === 200 && data) {
          scopes.value = data
        }
      })
    }

    const openWizard = (type) => {
      wizard.type = type
      wizard.show = true
      wizard.currentStep = 0
      wizard.data = {
        name: '',
        scope: scopes.value[0]?.name || '',
        newScopeName: '',
        columns: []
      }
    }

    const closeWizard = () => {
      wizard.show = false
    }

    const nextStep = () => {
      if (wizard.currentStep < wizard.steps.length - 1) {
        wizard.currentStep++
      }
    }

    const prevStep = () => {
      if (wizard.currentStep > 0) {
        wizard.currentStep--
      }
    }

    const addColumn = () => {
      wizard.data.columns.push({
        name: '',
        type: 'string',
        nullable: false,
        attributes: []
      })
    }

    const removeColumn = (index) => {
      wizard.data.columns.splice(index, 1)
    }

    const applyTemplate = (template) => {
      if (template === 'basic') {
        wizard.data.columns = [
          { name: 'name', type: 'string', nullable: false, attributes: [] },
          { name: 'description', type: 'text', nullable: true, attributes: [] }
        ]
      } else if (template === 'timestamps') {
        wizard.data.columns.push(
          { name: 'created_at', type: 'dateTime', nullable: true, attributes: [] },
          { name: 'updated_at', type: 'dateTime', nullable: true, attributes: [] }
        )
      } else if (template === 'softdelete') {
        wizard.data.columns.push(
          { name: 'deleted_at', type: 'dateTime', nullable: true, attributes: [] }
        )
      }
    }

    const editScope = (scope) => {
      // Redirecionar para a página legado para edição completa
      message.info(`Abrindo scope "${scope.name}" para edição...`)
      router.push('/generator-legacy')
    }

    const generateModule = async () => {
      Helper.loadingOverlay(true, 'Gerando módulo...')
      
      // Preparar dados no formato esperado pela API
      const scopeName = wizard.data.scope === '__new__' 
        ? wizard.data.newScopeName 
        : wizard.data.scope
      
      // Buscar scope existente ou criar novo
      let scopeData = scopes.value.find(s => s.name === scopeName)
      
      if (!scopeData) {
        scopeData = {
          id: null,
          name: scopeName,
          modules: []
        }
      }
      
      // Criar módulo no formato esperado
      const newModule = {
        name: wizard.data.name,
        columns: [
          { name: 'id', type: 'increments', nullable: false, attributes: [] },
          ...wizard.data.columns.map(col => ({
            name: col.name,
            type: col.type,
            nullable: col.nullable,
            attributes: col.attributes || [],
            belongsTo: col.belongsTo || null
          }))
        ]
      }
      
      // Adicionar módulo ao scope
      scopeData.modules.push(newModule)
      
      // Enviar para API
      const endpoint = scopeData.id ? `app/scopes/${scopeData.id}` : 'app/scopes'
      
      Api.put(endpoint, scopeData, (status, data, msg) => {
        Helper.loadingOverlay(false)
        if (status === 200) {
          message.success(`Módulo ${wizard.data.name} criado com sucesso!`)
          closeWizard()
          loadScopes()
        } else {
          message.error(msg || 'Erro ao criar módulo')
        }
      })
    }

    const getGradient = (index) => {
      const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
      ]
      return gradients[index % gradients.length]
    }

    const getInitials = (name) => {
      return name?.substring(0, 2).toUpperCase() || '?'
    }

    const getColumnIcon = (type) => {
      const icons = {
        string: 'text_fields',
        text: 'notes',
        integer: 'pin',
        double: 'calculate',
        boolean: 'toggle_on',
        date: 'event',
        dateTime: 'schedule',
        enum: 'list',
        unsignedBigInteger: 'link'
      }
      return icons[type] || 'help'
    }

    const getColumnIconComponent = (type) => {
      const icons = {
        string: markRaw(TextOutline),
        text: markRaw(DocumentOutline),
        integer: markRaw(KeyOutline),
        double: markRaw(KeyOutline),
        boolean: markRaw(ToggleOutline),
        date: markRaw(CalendarOutline),
        dateTime: markRaw(CalendarOutline),
        enum: markRaw(ListOutline),
        unsignedBigInteger: markRaw(LinkOutline)
      }
      return icons[type] || TextOutline
    }

    const getColumnColor = (type) => {
      const colors = {
        string: 'blue',
        text: 'indigo',
        integer: 'orange',
        double: 'amber',
        boolean: 'green',
        date: 'purple',
        dateTime: 'purple',
        enum: 'pink',
        unsignedBigInteger: 'teal'
      }
      return colors[type] || 'grey'
    }

    // Load on mount
    loadScopes()

    return {
      scopes,
      loading,
      wizard,
      wizardTitle,
      tableName,
      slugName,
      migrationName,
      foreignKeyColumns,
      canProceed,
      openWizard,
      closeWizard,
      nextStep,
      prevStep,
      addColumn,
      removeColumn,
      applyTemplate,
      editScope,
      generateModule,
      getGradient,
      getInitials,
      getColumnIcon,
      getColumnIconComponent,
      getColumnColor
    }
  }
}
</script>

<style lang="scss" scoped>
.generator-page {
  min-height: 100vh;
  background: #f8fafc;
}

// Header
.generator-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 48px 32px;
  text-align: center;
}

.header-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.header-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.7);
  margin: 8px 0 0;
}

.legacy-link {
  color: rgba(255,255,255,0.5);
  margin-top: 16px;
  font-size: 0.85rem;
  
  &:hover {
    color: rgba(255,255,255,0.8);
  }
}

// Grid
.generator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 32px;
  max-width: 1200px;
  margin: -40px auto 0;
}

.generator-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);

    .card-arrow {
      transform: translateX(4px);
      opacity: 1;
    }
  }

  &--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    .card-title, .card-description {
      color: white;
    }
    
    .card-icon {
      background: rgba(255,255,255,0.2);
      color: white;
    }

    .card-arrow {
      color: white;
    }
  }
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #667eea;
  margin-bottom: 20px;

  &--purple { background: #f3e8ff; color: #9333ea; }
  &--teal { background: #e0f7f7; color: #14b8a6; }
  &--green { background: #dcfce7; color: #22c55e; }
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px;
}

.card-description {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.card-arrow {
  position: absolute;
  right: 24px;
  bottom: 24px;
  font-size: 20px;
  color: #94a3b8;
  opacity: 0;
  transition: all 0.3s ease;
}

// Existing Scopes
.existing-scopes {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
}

.scopes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.scope-card {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
}

.scope-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1rem;
}

.scope-info {
  flex: 1;
}

.scope-name {
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.scope-count {
  font-size: 0.85rem;
  color: #64748b;
}

.scope-arrow {
  color: #94a3b8;
  font-size: 20px;
}

// Wizard
.wizard-container {
  width: 100%;
  height: 100%;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.wizard-header {
  background: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
}

.wizard-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.close-btn {
  color: #64748b;
}

.wizard-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.wizard-steps {
  display: flex;
  gap: 32px;
}

.step-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.5;

  &--active {
    opacity: 1;
    
    .step-number {
      background: #667eea;
      color: white;
    }
  }

  &--completed {
    opacity: 1;
    
    .step-number {
      background: #22c55e;
      color: white;
    }
  }
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
}

.step-label {
  font-size: 0.9rem;
  color: #64748b;
}

.wizard-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  display: flex;
  justify-content: center;
}

.wizard-step {
  width: 100%;
  max-width: 640px;
}

.step-header {
  margin-bottom: 32px;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px;
  }
  
  p {
    color: #64748b;
    margin: 0;
  }
}

// Forms
.form-group {
  margin-bottom: 24px;
  
  label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &--sm {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}

.form-hint {
  display: block;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 6px;
}

// Columns
.columns-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.column-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;

  &--fixed {
    background: #f8fafc;
    border-style: dashed;
  }
}

.column-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #fef3c7;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &--blue { background: #dbeafe; color: #3b82f6; }
  &--indigo { background: #e0e7ff; color: #6366f1; }
  &--orange { background: #ffedd5; color: #f97316; }
  &--amber { background: #fef3c7; color: #f59e0b; }
  &--green { background: #dcfce7; color: #22c55e; }
  &--purple { background: #f3e8ff; color: #a855f7; }
  &--pink { background: #fce7f3; color: #ec4899; }
  &--teal { background: #ccfbf1; color: #14b8a6; }
}

.column-info {
  flex: 1;
  
  .column-name {
    font-weight: 600;
    color: #1e293b;
  }
  
  .column-type {
    display: block;
    font-size: 0.8rem;
    color: #94a3b8;
  }
}

.column-fields {
  flex: 1;
  display: flex;
  gap: 8px;
  align-items: center;
}

.column-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
}

.column-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  min-width: 120px;
}

.column-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
  white-space: nowrap;
}

.column-remove {
  color: #ef4444;
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
  }
}

.column-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
    background: #f8fafc;
  }
}

// Quick Templates
.quick-templates {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.template-label {
  font-size: 0.85rem;
  color: #64748b;
}

.template-btn {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 0.8rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
}

// Relations
.relations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.relation-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.relation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.relation-icon {
  color: #14b8a6;
}

.relation-column {
  font-weight: 600;
  color: #1e293b;
}

.relation-config {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.no-relations {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  
  p {
    margin: 8px 0 0;
  }
}

// Review
.review-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.review-section {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 16px;
  }
}

.review-item {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.review-label {
  color: #64748b;
  min-width: 80px;
}

.review-value {
  font-weight: 500;
  color: #1e293b;
}

.review-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.review-column {
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #475569;
  
  &--pk {
    background: #fef3c7;
    color: #92400e;
    font-weight: 600;
  }
}

.review-files {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: monospace;
  color: #475569;
  
  &--php {
    border-left: 3px solid #6366f1;
  }
  
  &--vue {
    border-left: 3px solid #22c55e;
  }
}

// Wizard Footer
.wizard-footer {
  background: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  border-top: 1px solid #e2e8f0;
}

.btn-back {
  color: #64748b;
}

.btn-next, .btn-generate {
  padding: 10px 24px;
  font-weight: 500;
}

// Animations
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

// Responsive
@media (max-width: 768px) {
  .generator-grid {
    padding: 24px 16px;
    margin-top: -24px;
  }

  .wizard-steps {
    display: none;
  }

  .wizard-content {
    padding: 24px 16px;
  }

  .relation-config {
    grid-template-columns: 1fr;
  }
}
</style>
