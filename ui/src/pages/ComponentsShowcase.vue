<template>
  <div class="components-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <n-h1>Component Library</n-h1>
        <n-text depth="3">Explore todos os componentes Lavarel disponíveis</n-text>
      </div>
    </div>

    <!-- Tabs: Componentes / Criar no Scope -->
    <div class="tabs-container">
      <n-tabs v-model:value="activeTab" type="segment" size="large">
        <n-tab-pane name="library" tab="📦 Biblioteca">
          <!-- Search -->
          <div class="search-section">
            <n-input
              v-model:value="search"
              placeholder="Buscar componentes..."
              size="large"
              round
              clearable
            >
              <template #prefix>
                <n-icon :size="18"><SearchOutline /></n-icon>
              </template>
            </n-input>
          </div>

          <!-- Grid de Cards -->
          <div class="components-grid">
            <n-card
              v-for="comp in filteredComponents"
              :key="comp.id"
              hoverable
              class="component-card"
              @click="openComponent(comp)"
            >
              <template #header>
                <div class="card-icon" :style="{ background: comp.gradient }">
                  <n-icon :size="24"><component :is="comp.iconComponent" /></n-icon>
                </div>
              </template>
              <n-h4>{{ comp.name }}</n-h4>
              <n-text depth="3">{{ comp.description }}</n-text>
              <n-tag size="small" class="card-tag">{{ comp.tag }}</n-tag>
            </n-card>
          </div>
        </n-tab-pane>

        <n-tab-pane name="create" tab="🚀 Criar no Scope">
          <!-- Criar Componente no Scope -->
          <div class="create-scope-section">
            <n-card title="Criar Componente em um Scope" class="create-card">
              <template #header-extra>
                <n-button 
                  type="primary" 
                  @click="createInScope" 
                  :loading="creating"
                  :disabled="!selectedScope || !moduleName"
                >
                  <template #icon>
                    <n-icon><AddOutline /></n-icon>
                  </template>
                  Criar Componente
                </n-button>
              </template>

              <n-space vertical :size="24">
                <!-- Selecionar Scope -->
                <n-form-item label="Scope" label-placement="left" label-width="120">
                  <n-select
                    v-model:value="selectedScope"
                    :options="scopeOptions"
                    placeholder="Selecione um scope..."
                    filterable
                    clearable
                    style="width: 300px"
                  />
                </n-form-item>

                <!-- Selecionar Template -->
                <n-form-item label="Template" label-placement="left" label-width="120">
                  <n-select
                    v-model:value="selectedTemplate"
                    :options="templateOptions"
                    placeholder="Selecione um template..."
                    filterable
                    clearable
                    style="width: 300px"
                  />
                </n-form-item>

                <!-- Nome do Módulo -->
                <n-form-item label="Nome" label-placement="left" label-width="120">
                  <n-input
                    v-model:value="moduleName"
                    placeholder="Nome do módulo (ex: Products)"
                    style="width: 300px"
                  />
                </n-form-item>

                <!-- Preview do JSON -->
                <n-card v-if="moduleName" title="Preview do Módulo" size="small" embedded>
                  <pre class="json-preview">{{ modulePreview }}</pre>
                </n-card>

                <!-- Módulos existentes no Scope -->
                <n-divider v-if="selectedScope" />
                <div v-if="selectedScope && scopeModules.length">
                  <n-text strong>Módulos no scope "{{ selectedScope }}":</n-text>
                  <n-space style="margin-top: 12px">
                    <n-tag 
                      v-for="mod in scopeModules" 
                      :key="mod.name"
                      type="info"
                      round
                    >
                      {{ mod.name }}
                    </n-tag>
                  </n-space>
                </div>
              </n-space>
            </n-card>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>

    <!-- Modal do Componente -->
    <n-modal
      v-model:show="modal.show"
      preset="card"
      :title="modal.component?.name"
      :style="{ width: '900px', maxWidth: '95vw' }"
      :segmented="{ content: true }"
    >
      <template #header-extra>
        <n-space>
          <n-tag>{{ modal.component?.tag }}</n-tag>
          <n-button type="primary" size="small" @click="useComponent">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            Usar Componente
          </n-button>
        </n-space>
      </template>

      <n-tabs v-model:value="modal.tab" type="segment" animated>
        <!-- Preview -->
        <n-tab-pane name="preview" tab="Preview">
          <div class="preview-container">
            <!-- LvInput Preview -->
            <div v-if="modal.component?.id === 'input'" class="preview-demo">
              <n-space vertical :size="16">
                <lv-input v-model="demoData.text" label="Nome Completo" placeholder="Digite seu nome" />
                <lv-input v-model="demoData.email" label="E-mail" placeholder="seu@email.com" mode="text" />
                <lv-input v-model="demoData.number" label="Quantidade" mode="number" />
                <lv-input v-model="demoData.currency" label="Valor" mode="currency" />
              </n-space>
            </div>

            <!-- LvSelect Preview -->
            <div v-else-if="modal.component?.id === 'select'" class="preview-demo">
              <n-space vertical :size="16">
                <lv-select 
                  v-model="demoData.country" 
                  label="País" 
                  :options="countryOptions"
                  placeholder="Selecione um país"
                />
                <lv-select 
                  v-model="demoData.categories" 
                  label="Categorias" 
                  :options="categoryOptions"
                  multiple
                  placeholder="Selecione categorias"
                />
              </n-space>
            </div>

            <!-- LvBtn Preview -->
            <div v-else-if="modal.component?.id === 'button'" class="preview-demo">
              <n-space :size="16" wrap>
                <lv-btn label="Primary" color="primary" icon="save" />
                <lv-btn label="Success" color="success" icon="checkmark" />
                <lv-btn label="Warning" color="warning" icon="alert" />
                <lv-btn label="Error" color="error" icon="close" />
                <lv-btn label="Loading" color="primary" :loading="true" />
                <lv-btn label="Soft" color="primary" soft />
                <lv-btn label="Flat" color="primary" flat />
              </n-space>
            </div>

            <!-- LvCard Preview (Credit Card) -->
            <div v-else-if="modal.component?.id === 'card'" class="preview-demo card-preview">
              <div class="card-preview-layout">
                <!-- Cartão de crédito -->
                <div class="card-display">
                  <lv-credit-card
                    :number="demoData.cardNumber"
                    :holder="demoData.cardHolder"
                    :expiry="demoData.cardExpiry"
                    :cvv="demoData.cardCvv"
                    v-model:flipped="demoData.cardFlipped"
                  />
                </div>
                
                <!-- Formulário -->
                <div class="card-form">
                  <n-space vertical :size="16">
                    <div>
                      <label class="form-label">Número do Cartão</label>
                      <n-input 
                        v-model:value="demoData.cardNumber" 
                        placeholder="0000 0000 0000 0000"
                        size="large"
                        maxlength="19"
                        @input="formatCardInput"
                        @focus="demoData.cardFlipped = false"
                      />
                    </div>
                    <div>
                      <label class="form-label">Nome no Cartão</label>
                      <n-input 
                        v-model:value="demoData.cardHolder" 
                        placeholder="NOME COMO ESTÁ NO CARTÃO"
                        size="large"
                        @focus="demoData.cardFlipped = false"
                      />
                    </div>
                    <n-space :size="16">
                      <div style="flex: 1;">
                        <label class="form-label">Validade</label>
                        <n-input 
                          v-model:value="demoData.cardExpiry" 
                          placeholder="MM/AA" 
                          size="large"
                          @focus="demoData.cardFlipped = false"
                        />
                      </div>
                      <div style="width: 120px;">
                        <label class="form-label">CVV</label>
                        <n-input 
                          v-model:value="demoData.cardCvv" 
                          placeholder="***" 
                          size="large"
                          maxlength="4"
                          @focus="demoData.cardFlipped = true"
                          @blur="demoData.cardFlipped = false"
                        />
                      </div>
                    </n-space>
                  </n-space>
                </div>
              </div>
            </div>

            <!-- LvTable Preview -->
            <div v-else-if="modal.component?.id === 'table'" class="preview-demo">
              <n-data-table
                :columns="demoTableColumns"
                :data="demoTableData"
                :bordered="false"
                striped
              />
            </div>

            <!-- LvModal Preview -->
            <div v-else-if="modal.component?.id === 'modal'" class="preview-demo">
              <n-space vertical align="center">
                <lv-btn label="Abrir Modal" color="primary" @click="demoData.showModal = true" />
                <lv-modal v-model="demoData.showModal" title="Modal de Exemplo" size="medium">
                  <n-space vertical>
                    <n-text>Este é um modal de exemplo usando o componente LvModal.</n-text>
                    <lv-input v-model="demoData.modalInput" label="Campo no Modal" />
                  </n-space>
                  <template #footer>
                    <n-space justify="end">
                      <lv-btn label="Cancelar" flat @click="demoData.showModal = false" />
                      <lv-btn label="Confirmar" color="primary" @click="demoData.showModal = false" />
                    </n-space>
                  </template>
                </lv-modal>
              </n-space>
            </div>

            <!-- LvContainer Preview -->
            <div v-else-if="modal.component?.id === 'container'" class="preview-demo">
              <n-space vertical :size="16">
                <n-text depth="3">Container com flex layout:</n-text>
                <lv-container direction="row" gap="16" padding="16" style="background: rgba(100, 108, 255, 0.1); border-radius: 8px;">
                  <div style="padding: 16px; background: #6366f1; color: white; border-radius: 4px;">Item 1</div>
                  <div style="padding: 16px; background: #8b5cf6; color: white; border-radius: 4px;">Item 2</div>
                  <div style="padding: 16px; background: #a855f7; color: white; border-radius: 4px;">Item 3</div>
                </lv-container>
                <lv-container direction="column" gap="8" padding="16" style="background: rgba(34, 197, 94, 0.1); border-radius: 8px;">
                  <div style="padding: 8px; background: #22c55e; color: white; border-radius: 4px; text-align: center;">Vertical 1</div>
                  <div style="padding: 8px; background: #16a34a; color: white; border-radius: 4px; text-align: center;">Vertical 2</div>
                </lv-container>
              </n-space>
            </div>

            <!-- LvDisplayer Preview -->
            <div v-else-if="modal.component?.id === 'displayer'" class="preview-demo">
              <n-space vertical :size="16">
                <lv-displayer label="Nome" value="João Silva" />
                <lv-displayer label="CPF" value="12345678901" type="cpf" copyable />
                <lv-displayer label="CNPJ" value="12345678000190" type="cnpj" copyable />
                <lv-displayer label="Telefone" value="11987654321" type="phone" />
                <lv-displayer label="Valor" :value="2500.50" type="currency" />
                <lv-displayer label="Percentual" :value="75.5" type="percent" />
                <lv-displayer label="Ativo" :value="true" type="boolean" true-label="Sim" false-label="Não" />
                <lv-displayer label="Nascimento" value="1990-05-15" type="date" />
              </n-space>
            </div>

            <!-- LvDivider Preview -->
            <div v-else-if="modal.component?.id === 'divider'" class="preview-demo">
              <n-space vertical :size="24">
                <div>
                  <n-text>Conteúdo acima</n-text>
                  <lv-divider />
                  <n-text>Conteúdo abaixo</n-text>
                </div>
                <lv-divider title="Seção 1" />
                <lv-divider title="À esquerda" title-placement="left" />
                <lv-divider title="Tracejado" dashed />
                <n-space :size="24" style="height: 60px;">
                  <n-text>Esquerda</n-text>
                  <lv-divider direction="vertical" />
                  <n-text>Centro</n-text>
                  <lv-divider direction="vertical" dashed />
                  <n-text>Direita</n-text>
                </n-space>
              </n-space>
            </div>

            <!-- LvBadge Preview -->
            <div v-else-if="modal.component?.id === 'badge'" class="preview-demo">
              <n-space :size="32" align="center" wrap>
                <lv-badge :value="5">
                  <n-button>Notificações</n-button>
                </lv-badge>
                <lv-badge :value="150" :max="99">
                  <n-button>Mensagens</n-button>
                </lv-badge>
                <lv-badge dot processing>
                  <n-icon :size="28"><BellOutline /></n-icon>
                </lv-badge>
                <lv-badge :value="3" type="success">
                  <n-button>Sucesso</n-button>
                </lv-badge>
                <lv-badge :value="7" type="warning">
                  <n-button>Alerta</n-button>
                </lv-badge>
                <lv-badge :value="0" show-zero type="info">
                  <n-button>Zero</n-button>
                </lv-badge>
              </n-space>
            </div>

            <!-- LvAvatar Preview -->
            <div v-else-if="modal.component?.id === 'avatar'" class="preview-demo">
              <n-space :size="24" align="center" wrap>
                <lv-avatar name="João Silva" />
                <lv-avatar name="Maria Santos" size="large" />
                <lv-avatar name="Pedro" shape="square" />
                <lv-avatar name="Ana Costa" status="online" />
                <lv-avatar name="Carlos" status="busy" />
                <lv-avatar name="Julia" status="away" />
                <lv-avatar name="Admin" bordered color="#6366f1" />
              </n-space>
            </div>

            <!-- LvTag Preview -->
            <div v-else-if="modal.component?.id === 'tag'" class="preview-demo">
              <n-space :size="12" wrap>
                <lv-tag label="Default" />
                <lv-tag label="Primary" type="primary" />
                <lv-tag label="Success" type="success" />
                <lv-tag label="Warning" type="warning" />
                <lv-tag label="Error" type="error" />
                <lv-tag label="Info" type="info" />
                <lv-tag label="Arredondada" type="primary" round />
                <lv-tag label="Fechável" type="success" closable />
              </n-space>
            </div>

            <!-- LvProgress Preview -->
            <div v-else-if="modal.component?.id === 'progress'" class="preview-demo">
              <n-space vertical :size="24">
                <lv-progress :percentage="75" label="Download" />
                <lv-progress :percentage="50" status="success" />
                <lv-progress :percentage="30" status="warning" striped striped-animated />
                <lv-progress :percentage="90" status="error" />
                <lv-progress :percentage="0" indeterminate label="Carregando..." />
                <n-space :size="24" align="center">
                  <lv-progress :percentage="60" type="circle" :circle-width="80" />
                  <lv-progress :percentage="85" type="circle" :circle-width="80" status="success" />
                  <lv-progress :percentage="40" type="circle" :circle-width="80" status="warning" />
                </n-space>
              </n-space>
            </div>

            <!-- LvEmpty Preview -->
            <div v-else-if="modal.component?.id === 'empty'" class="preview-demo">
              <n-space vertical :size="24">
                <lv-empty />
                <n-divider />
                <lv-empty type="search" size="small" />
                <n-divider />
                <lv-empty type="error" size="small">
                  <lv-btn label="Tentar novamente" color="primary" size="small" />
                </lv-empty>
              </n-space>
            </div>

            <!-- LvSkeleton Preview -->
            <div v-else-if="modal.component?.id === 'skeleton'" class="preview-demo">
              <n-space vertical :size="24">
                <div>
                  <n-text depth="3" style="margin-bottom: 8px; display: block;">Texto:</n-text>
                  <lv-skeleton preset="text" :rows="3" />
                </div>
                <n-divider />
                <div>
                  <n-text depth="3" style="margin-bottom: 8px; display: block;">Lista:</n-text>
                  <lv-skeleton preset="list" :rows="2" />
                </div>
                <n-divider />
                <n-space :size="16" align="center">
                  <lv-skeleton preset="avatar" :avatar-size="48" />
                  <lv-skeleton preset="button" width="120px" height="36px" />
                </n-space>
              </n-space>
            </div>

            <!-- LvTooltip Preview -->
            <div v-else-if="modal.component?.id === 'tooltip'" class="preview-demo">
              <n-space :size="24" wrap>
                <lv-tooltip content="Tooltip padrão">
                  <n-button>Hover me</n-button>
                </lv-tooltip>
                <lv-tooltip content="Informação importante" type="info" :icon="true">
                  <n-button type="info">Info</n-button>
                </lv-tooltip>
                <lv-tooltip content="Operação bem sucedida!" type="success" :icon="true">
                  <n-button type="success">Success</n-button>
                </lv-tooltip>
                <lv-tooltip content="Atenção com esta ação" type="warning" :icon="true">
                  <n-button type="warning">Warning</n-button>
                </lv-tooltip>
                <lv-tooltip content="Erro encontrado" type="error" :icon="true">
                  <n-button type="error">Error</n-button>
                </lv-tooltip>
              </n-space>
            </div>

            <!-- Default -->
            <n-empty v-else description="Preview não disponível">
              <template #icon>
                <n-icon :size="48"><CubeOutline /></n-icon>
              </template>
            </n-empty>
          </div>
        </n-tab-pane>

        <!-- Props -->
        <n-tab-pane name="props" tab="Props">
          <n-data-table
            :columns="propsColumns"
            :data="modal.component?.props || []"
            :bordered="false"
            size="small"
          />
        </n-tab-pane>

        <!-- Frontend Code -->
        <n-tab-pane name="frontend" tab="Frontend">
          <n-card embedded size="small">
            <template #header>
              <n-space justify="space-between" align="center">
                <n-text depth="3">Vue Template</n-text>
                <n-button size="small" quaternary @click="copyCode(modal.component?.code)">
                  <template #icon>
                    <n-icon><CopyOutline /></n-icon>
                  </template>
                  Copiar
                </n-button>
              </n-space>
            </template>
            <pre class="code-block">{{ modal.component?.code || '' }}</pre>
          </n-card>
        </n-tab-pane>

        <!-- Backend Code -->
        <n-tab-pane name="backend" tab="Backend">
          <n-card embedded size="small">
            <template #header>
              <n-space justify="space-between" align="center">
                <n-text depth="3">Laravel / PHP</n-text>
                <n-button size="small" quaternary @click="copyCode(modal.component?.backendCode)">
                  <template #icon>
                    <n-icon><CopyOutline /></n-icon>
                  </template>
                  Copiar
                </n-button>
              </n-space>
            </template>
            <pre class="code-block">{{ modal.component?.backendCode || '// Sem código backend específico' }}</pre>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </n-modal>
  </div>
</template>

<script>
import { ref, computed, reactive, h, markRaw } from 'vue'
import { useMessage, NTag } from 'naive-ui'
import {
  NInput,
  NCard,
  NIcon,
  NText,
  NH1,
  NH4,
  NModal,
  NTabs,
  NTabPane,
  NDataTable,
  NButton,
  NSpace,
  NEmpty,
  NSelect,
  NFormItem,
  NDivider,
} from 'naive-ui'
import {
  SearchOutline,
  CubeOutline,
  CopyOutline,
  TextOutline,
  ListOutline,
  RadioButtonOnOutline,
  GridOutline,
  CardOutline,
  LayersOutline,
  AppsOutline,
  OptionsOutline,
  AddOutline,
  // Icons for new base components
  RemoveOutline,
  NotificationsOutline,
  PersonCircleOutline,
  PricetagOutline,
  SpeedometerOutline,
  FolderOpenOutline,
  ReloadOutline,
  InformationCircleOutline,
  WarningOutline,
  BellOutline,
} from '@vicons/ionicons5'

export default {
  name: 'ComponentsShowcase',
  components: {
    NInput,
    NCard,
    NIcon,
    NTag,
    NText,
    NH1,
    NH4,
    NModal,
    NTabs,
    NTabPane,
    NDataTable,
    NButton,
    NSpace,
    NEmpty,
    NSelect,
    NFormItem,
    NDivider,
    SearchOutline,
    CubeOutline,
    CopyOutline,
    AddOutline,
  },
  
  setup() {
    const message = useMessage()
    
    const search = ref('')
    const activeTab = ref('library')
    
    // Scope creation
    const selectedScope = ref(null)
    const selectedTemplate = ref('crud')
    const moduleName = ref('')
    const creating = ref(false)
    const scopeModules = ref([])
    
    // Demo data for previews
    const demoData = reactive({
      text: '',
      email: '',
      number: 0,
      currency: 0,
      country: null,
      categories: [],
      cardNumber: '',
      cardHolder: '',
      cardExpiry: '',
      cardCvv: '',
      cardFlipped: false,
      showModal: false,
      modalInput: '',
    })
    
    const modal = reactive({
      show: false,
      tab: 'preview',
      component: null
    })

    // Scope options (local, sem API)
    const scopeOptions = [
      { label: 'base', value: 'base' },
      { label: 'Loja', value: 'Loja' },
    ]

    const templateOptions = [
      { label: 'Módulo CRUD Básico', value: 'crud' },
      { label: 'Módulo com Table', value: 'table' },
      { label: 'Módulo com Form', value: 'form' },
      { label: 'Módulo Completo', value: 'full' },
    ]

    const countryOptions = [
      { label: 'Brasil', value: 'BR' },
      { label: 'Estados Unidos', value: 'US' },
      { label: 'Portugal', value: 'PT' },
      { label: 'Espanha', value: 'ES' },
    ]

    const categoryOptions = [
      { label: 'Tecnologia', value: 'tech' },
      { label: 'Saúde', value: 'health' },
      { label: 'Educação', value: 'education' },
      { label: 'Finanças', value: 'finance' },
    ]

    const demoTableColumns = [
      { title: 'ID', key: 'id', width: 60 },
      { title: 'Nome', key: 'name' },
      { title: 'Email', key: 'email' },
      { title: 'Status', key: 'status', render: (row) => h(NTag, { type: row.status === 'Ativo' ? 'success' : 'warning', size: 'small' }, () => row.status) },
    ]

    const demoTableData = [
      { id: 1, name: 'João Silva', email: 'joao@email.com', status: 'Ativo' },
      { id: 2, name: 'Maria Santos', email: 'maria@email.com', status: 'Ativo' },
      { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', status: 'Inativo' },
    ]

    const propsColumns = [
      { title: 'Prop', key: 'name', render: (row) => h('code', { style: 'color: #6366f1' }, row.name) },
      { title: 'Tipo', key: 'type', render: (row) => h('span', { style: 'color: #22c55e' }, row.type) },
      { title: 'Default', key: 'default', render: (row) => h('code', {}, row.default || '-') },
      { title: 'Descrição', key: 'description' },
    ]

    // Components list - usando markRaw para evitar warnings
    const components = [
      {
        id: 'input',
        name: 'LvInput',
        tag: '<lv-input>',
        iconComponent: markRaw(TextOutline),
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: 'Campo de entrada com suporte a vários modos: text, number, currency, date',
        props: [
          { name: 'v-model', type: 'String/Number', default: '', description: 'Valor do campo' },
          { name: 'mode', type: 'String', default: 'text', description: 'Modo: text, number, currency, date, datetime' },
          { name: 'label', type: 'String', default: '', description: 'Rótulo do campo' },
          { name: 'placeholder', type: 'String', default: '', description: 'Texto placeholder' },
          { name: 'required', type: 'Boolean', default: 'false', description: 'Campo obrigatório' },
        ],
        code: `<lv-input
  v-model="value"
  label="Nome"
  mode="text"
  placeholder="Digite seu nome"
/>`,
        backendCode: `// Validação no Controller
$request->validate([
    'name' => 'required|string|max:255',
]);

// No Model
protected $fillable = ['name'];`
      },
      {
        id: 'select',
        name: 'LvSelect',
        tag: '<lv-select>',
        iconComponent: markRaw(ListOutline),
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        description: 'Seletor com autocomplete, múltipla seleção e ajax',
        props: [
          { name: 'v-model', type: 'Any', default: '', description: 'Valor selecionado' },
          { name: 'options', type: 'Array', default: '[]', description: 'Lista de opções' },
          { name: 'searchable', type: 'Boolean', default: 'false', description: 'Permite buscar nas opções' },
          { name: 'multiple', type: 'Boolean', default: 'false', description: 'Permite múltipla seleção' },
          { name: 'url', type: 'String', default: '', description: 'URL para busca ajax' },
        ],
        code: `<lv-select
  v-model="selected"
  label="País"
  :options="countries"
  searchable
  clearable
/>`,
        backendCode: `// Endpoint para opções
Route::get('/options/countries', function() {
    return Country::select('id as value', 'name as label')->get();
});`
      },
      {
        id: 'button',
        name: 'LvBtn',
        tag: '<lv-btn>',
        iconComponent: markRaw(RadioButtonOnOutline),
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        description: 'Botão com variantes: soft, flat, outlined e loading',
        props: [
          { name: 'label', type: 'String', default: '', description: 'Texto do botão' },
          { name: 'color', type: 'String', default: 'primary', description: 'Cor do botão' },
          { name: 'icon', type: 'String', default: '', description: 'Ícone do botão' },
          { name: 'soft', type: 'Boolean', default: 'false', description: 'Estilo soft' },
          { name: 'loading', type: 'Boolean', default: 'false', description: 'Estado loading' },
        ],
        code: `<lv-btn
  label="Salvar"
  color="primary"
  icon="save"
  @click="save"
/>`,
        backendCode: `// Não requer código backend específico`
      },
      {
        id: 'table',
        name: 'LvTable',
        tag: '<lv-table>',
        iconComponent: markRaw(GridOutline),
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        description: 'Tabela de dados com paginação, busca e ações',
        props: [
          { name: 'config', type: 'Object', default: '', description: 'Configuração da tabela (Handler.table())' },
          { name: 'url-path', type: 'String', default: '', description: 'URL do endpoint' },
          { name: 'searchBy', type: 'String', default: '', description: 'Campos para busca' },
          { name: 'setting', type: 'Boolean', default: 'true', description: 'Mostrar configurações' },
        ],
        code: `<lv-table
  ref="refTable"
  :config="Handler.table(Meta)"
  :url-path="Meta.key"
  @deleted="onDeleted"
  @restored="onRestored"
/>`,
        backendCode: `// Controller index method
public function index(Request $request)
{
    $query = Model::query();
    
    if ($request->search) {
        $query->where('name', 'like', "%{$request->search}%");
    }
    
    return $query->paginate($request->per_page ?? 15);
}`
      },
      {
        id: 'card',
        name: 'LvCard',
        tag: '<lv-card>',
        iconComponent: markRaw(CardOutline),
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: 'Card com header, footer e slots. Inclui preview de cartão de crédito!',
        props: [
          { name: 'title', type: 'String', default: '', description: 'Título do card' },
          { name: 'subtitle', type: 'String', default: '', description: 'Subtítulo do card' },
          { name: 'bordered', type: 'Boolean', default: 'true', description: 'Mostrar borda' },
        ],
        code: `<lv-card title="Meu Card">
  <template #header-extra>
    <lv-btn icon="settings" quaternary />
  </template>
  Conteúdo do card
</lv-card>`,
        backendCode: `// Validação de cartão de crédito
public function validateCard($number)
{
    $patterns = [
        'visa' => '/^4[0-9]{12}(?:[0-9]{3})?$/',
        'mastercard' => '/^5[1-5][0-9]{14}$/',
        'amex' => '/^3[47][0-9]{13}$/',
        'elo' => '/^(636368|636297|504175)/',
    ];
    
    foreach ($patterns as $brand => $pattern) {
        if (preg_match($pattern, $number)) {
            return $brand;
        }
    }
    return 'unknown';
}`
      },
      {
        id: 'modal',
        name: 'LvModal',
        tag: '<lv-modal>',
        iconComponent: markRaw(LayersOutline),
        gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        description: 'Modal com header, conteúdo e footer',
        props: [
          { name: 'v-model', type: 'Boolean', default: 'false', description: 'Visibilidade do modal' },
          { name: 'title', type: 'String', default: '', description: 'Título do modal' },
          { name: 'size', type: 'String', default: 'medium', description: 'Tamanho: small, medium, large, huge' },
        ],
        code: `<lv-modal
  v-model="showModal"
  title="Título do Modal"
  size="medium"
>
  Conteúdo do modal
  
  <template #footer>
    <lv-btn label="Cancelar" flat @click="showModal = false" />
    <lv-btn label="Salvar" color="primary" @click="save" />
  </template>
</lv-modal>`,
        backendCode: `// Não requer código backend específico`
      },
      {
        id: 'container',
        name: 'LvContainer',
        tag: '<lv-container>',
        iconComponent: markRaw(AppsOutline),
        gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        description: 'Container wrapper para páginas',
        props: [],
        code: `<lv-container>
  <lv-header-page title="Página" subtitle="Descrição" />
  <!-- Conteúdo -->
</lv-container>`,
        backendCode: `// Não requer código backend específico`
      },
      {
        id: 'displayer',
        name: 'LvDisplayer',
        tag: '<lv-displayer>',
        iconComponent: markRaw(OptionsOutline),
        gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        description: 'Exibidor de dados com formatação automática para CPF, CNPJ, moeda e mais',
        props: [
          { name: 'label', type: 'String', default: '', description: 'Rótulo do campo' },
          { name: 'value', type: 'Any', default: '', description: 'Valor a exibir' },
          { name: 'type', type: 'String', default: 'text', description: 'text, boolean, currency, date, cpf, cnpj, phone, percent, number' },
          { name: 'copyable', type: 'Boolean', default: 'false', description: 'Permite copiar valor' },
        ],
        code: `<lv-displayer label="CPF" value="12345678901" type="cpf" />
<lv-displayer label="Valor" :value="1500.50" type="currency" />
<lv-displayer label="Ativo" :value="true" type="boolean" />`,
        backendCode: `// Formatação automática no frontend
// CPF: 123.456.789-01
// CNPJ: 12.345.678/0001-90
// Currency: R$ 1.500,50`
      },
      // ========== BASE COMPONENTS ==========
      {
        id: 'divider',
        name: 'LvDivider',
        tag: '<lv-divider>',
        iconComponent: markRaw(RemoveOutline),
        gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
        description: 'Separador de conteúdo horizontal ou vertical',
        props: [
          { name: 'title', type: 'String', default: '', description: 'Título opcional no divisor' },
          { name: 'direction', type: 'String', default: 'horizontal', description: 'horizontal ou vertical' },
          { name: 'titlePlacement', type: 'String', default: 'center', description: 'left, center, right' },
          { name: 'dashed', type: 'Boolean', default: 'false', description: 'Linha tracejada' },
        ],
        code: `<lv-divider />
<lv-divider title="Seção 1" />
<lv-divider title="Mais" title-placement="left" dashed />`,
        backendCode: `// Não requer código backend`
      },
      {
        id: 'badge',
        name: 'LvBadge',
        tag: '<lv-badge>',
        iconComponent: markRaw(NotificationsOutline),
        gradient: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
        description: 'Badge para notificações e contadores',
        props: [
          { name: 'value', type: 'Number', default: '', description: 'Valor numérico' },
          { name: 'max', type: 'Number', default: '99', description: 'Valor máximo (mostra 99+)' },
          { name: 'dot', type: 'Boolean', default: 'false', description: 'Modo dot (sem número)' },
          { name: 'type', type: 'String', default: 'error', description: 'default, primary, success, warning, error, info' },
          { name: 'processing', type: 'Boolean', default: 'false', description: 'Animação pulsante' },
        ],
        code: `<lv-badge :value="5">
  <n-button>Notificações</n-button>
</lv-badge>

<lv-badge dot processing>
  <n-icon :size="24"><bell-outline /></n-icon>
</lv-badge>`,
        backendCode: `// Contagem de notificações não lidas
public function unreadCount()
{
    return auth()->user()->notifications()->unread()->count();
}`
      },
      {
        id: 'avatar',
        name: 'LvAvatar',
        tag: '<lv-avatar>',
        iconComponent: markRaw(PersonCircleOutline),
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: 'Avatar com imagem ou iniciais automáticas',
        props: [
          { name: 'src', type: 'String', default: '', description: 'URL da imagem' },
          { name: 'name', type: 'String', default: '', description: 'Nome para gerar iniciais' },
          { name: 'size', type: 'Number/String', default: '40', description: 'Tamanho em pixels ou small/medium/large' },
          { name: 'shape', type: 'String', default: 'circle', description: 'circle ou square' },
          { name: 'status', type: 'String', default: '', description: 'online, offline, busy, away' },
        ],
        code: `<lv-avatar name="João Silva" />
<lv-avatar src="/avatar.jpg" status="online" />
<lv-avatar name="Maria" size="large" shape="square" />`,
        backendCode: `// Retorno de avatar no Resource
public function toArray($request)
{
    return [
        'avatar' => $this->avatar_url ?? null,
        'name' => $this->name,
    ];
}`
      },
      {
        id: 'tag',
        name: 'LvTag',
        tag: '<lv-tag>',
        iconComponent: markRaw(PricetagOutline),
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        description: 'Tag/chip com estilos e ações',
        props: [
          { name: 'label', type: 'String', default: '', description: 'Texto da tag' },
          { name: 'type', type: 'String', default: 'default', description: 'default, primary, success, warning, error, info' },
          { name: 'closable', type: 'Boolean', default: 'false', description: 'Pode fechar' },
          { name: 'round', type: 'Boolean', default: 'false', description: 'Bordas arredondadas' },
          { name: 'checkable', type: 'Boolean', default: 'false', description: 'Modo checkbox' },
        ],
        code: `<lv-tag label="Novo" type="success" />
<lv-tag label="Pendente" type="warning" closable @close="remove" />
<lv-tag label="Premium" type="primary" round />`,
        backendCode: `// Tags como relacionamento
public function tags()
{
    return $this->belongsToMany(Tag::class);
}`
      },
      {
        id: 'progress',
        name: 'LvProgress',
        tag: '<lv-progress>',
        iconComponent: markRaw(SpeedometerOutline),
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        description: 'Barra de progresso linear ou circular',
        props: [
          { name: 'percentage', type: 'Number', default: '0', description: 'Valor de 0 a 100' },
          { name: 'type', type: 'String', default: 'line', description: 'line ou circle' },
          { name: 'status', type: 'String', default: 'default', description: 'default, success, warning, error' },
          { name: 'striped', type: 'Boolean', default: 'false', description: 'Padrão listrado' },
          { name: 'indeterminate', type: 'Boolean', default: 'false', description: 'Animação contínua' },
        ],
        code: `<lv-progress :percentage="75" status="success" />
<lv-progress :percentage="50" striped striped-animated />
<lv-progress :percentage="60" type="circle" :circle-width="80" />`,
        backendCode: `// Cálculo de progresso
public function progress()
{
    $total = $this->tasks()->count();
    $done = $this->tasks()->where('done', true)->count();
    return $total > 0 ? ($done / $total) * 100 : 0;
}`
      },
      {
        id: 'empty',
        name: 'LvEmpty',
        tag: '<lv-empty>',
        iconComponent: markRaw(FolderOpenOutline),
        gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
        description: 'Estado vazio para listas e tabelas',
        props: [
          { name: 'type', type: 'String', default: 'empty', description: 'empty, search, error, offline, forbidden, maintenance' },
          { name: 'title', type: 'String', default: '', description: 'Título customizado' },
          { name: 'description', type: 'String', default: '', description: 'Descrição customizada' },
          { name: 'size', type: 'String', default: 'medium', description: 'small, medium, large' },
        ],
        code: `<lv-empty type="search" title="Nenhum resultado" />
<lv-empty type="error" description="Tente novamente mais tarde">
  <lv-btn label="Recarregar" @click="reload" />
</lv-empty>`,
        backendCode: `// Retorno para lista vazia
if ($items->isEmpty()) {
    return response()->json(['data' => [], 'message' => 'Nenhum registro']);
}`
      },
      {
        id: 'skeleton',
        name: 'LvSkeleton',
        tag: '<lv-skeleton>',
        iconComponent: markRaw(ReloadOutline),
        gradient: 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)',
        description: 'Placeholder de carregamento skeleton',
        props: [
          { name: 'loading', type: 'Boolean', default: 'true', description: 'Mostrar skeleton ou conteúdo' },
          { name: 'preset', type: 'String', default: '', description: 'text, avatar, image, card, list, button' },
          { name: 'rows', type: 'Number', default: '3', description: 'Número de linhas (text/list)' },
          { name: 'animated', type: 'Boolean', default: 'true', description: 'Animação de loading' },
        ],
        code: `<lv-skeleton :loading="isLoading" preset="card">
  <lv-card title="Carregado!">Conteúdo real</lv-card>
</lv-skeleton>

<lv-skeleton preset="list" :rows="5" />`,
        backendCode: `// Não requer código backend`
      },
      {
        id: 'tooltip',
        name: 'LvTooltip',
        tag: '<lv-tooltip>',
        iconComponent: markRaw(InformationCircleOutline),
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: 'Tooltip com tipos e ícones',
        props: [
          { name: 'content', type: 'String', default: '', description: 'Texto do tooltip' },
          { name: 'placement', type: 'String', default: 'top', description: 'top, bottom, left, right e variantes' },
          { name: 'type', type: 'String', default: 'default', description: 'default, info, success, warning, error, help' },
          { name: 'icon', type: 'Boolean', default: 'false', description: 'Mostrar ícone do tipo' },
        ],
        code: `<lv-tooltip content="Informação útil">
  <n-button>Hover me</n-button>
</lv-tooltip>

<lv-tooltip content="Atenção!" type="warning" :icon="true">
  <n-icon><warning-outline /></n-icon>
</lv-tooltip>`,
        backendCode: `// Não requer código backend`
      },
    ]

    const filteredComponents = computed(() => {
      if (!search.value) return components
      const term = search.value.toLowerCase()
      return components.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.tag.toLowerCase().includes(term)
      )
    })

    // Card brand detection
    const cardBrand = computed(() => {
      const num = demoData.cardNumber.replace(/\s/g, '')
      if (/^4/.test(num)) return 'visa'
      if (/^5[1-5]/.test(num)) return 'mastercard'
      if (/^3[47]/.test(num)) return 'amex'
      if (/^(636368|636297|504175|438935|40117[8-9]|45763[1-2])/.test(num)) return 'elo'
      if (/^(606282|3841)/.test(num)) return 'hipercard'
      return 'default'
    })

    // Brazilian banks detection by BIN ranges
    const cardBank = computed(() => {
      const num = demoData.cardNumber.replace(/\s/g, '')
      
      // Nubank BINs (Mastercard) - includes 5502, 5509
      if (/^(5162|5167|5171|5451|5480|5502|5509)/.test(num)) return 'nubank'
      
      // Inter BINs (Mastercard)
      if (/^(5359|5357|5395|5200)/.test(num)) return 'inter'
      
      // Itaú BINs
      if (/^(4380|4387|4389|4504|4514|4516|5044|5045|5169|5178)/.test(num)) return 'itau'
      
      // Bradesco BINs
      if (/^(4119|4199|4286|4312|4488|5276|5277|5283|5519)/.test(num)) return 'bradesco'
      
      // Banco do Brasil BINs
      if (/^(4011|4017|4018|4019|4284|4301|4302|4304|4305|4984|5070|5071)/.test(num)) return 'bb'
      
      // Santander BINs
      if (/^(4130|4377|4465|4466|5177|5326|5402|5454)/.test(num)) return 'santander'
      
      // Caixa BINs
      if (/^(5041|5057|5127|5128|5181)/.test(num)) return 'caixa'
      
      // C6 Bank BINs
      if (/^(5425|5426|5427|5428)/.test(num)) return 'c6bank'
      
      // PicPay BINs
      if (/^(5439|5447)/.test(num)) return 'picpay'
      
      // Neon BINs
      if (/^(5432)/.test(num)) return 'neon'
      
      // Next (Bradesco) BINs - different BINs
      if (/^(5503|5504)/.test(num)) return 'next'
      
      return null
    })

    const cardBrandName = computed(() => {
      const brands = {
        visa: 'VISA',
        mastercard: 'MASTERCARD',
        amex: 'AMEX',
        elo: 'ELO',
        hipercard: 'HIPERCARD',
        default: ''
      }
      return brands[cardBrand.value] || ''
    })

    const cardBankName = computed(() => {
      const banks = {
        nubank: 'NUBANK',
        inter: 'INTER',
        itau: 'ITAÚ',
        bradesco: 'BRADESCO',
        bb: 'BANCO DO BRASIL',
        santander: 'SANTANDER',
        caixa: 'CAIXA',
        c6bank: 'C6 BANK',
        picpay: 'PICPAY',
        neon: 'NEON',
        next: 'NEXT',
      }
      return banks[cardBank.value] || ''
    })

    // Card styling based on bank
    const cardStyle = computed(() => {
      const bank = cardBank.value
      const styles = {
        nubank: { background: 'linear-gradient(135deg, #8A05BE 0%, #5C0080 100%)', logo: '💜' },
        inter: { background: 'linear-gradient(135deg, #FF7A00 0%, #E85D00 100%)', logo: '🧡' },
        itau: { background: 'linear-gradient(135deg, #003366 0%, #002244 100%)', logo: '🔷' },
        bradesco: { background: 'linear-gradient(135deg, #CC092F 0%, #8C0620 100%)', logo: '🔴' },
        bb: { background: 'linear-gradient(135deg, #FDCF00 0%, #003366 100%)', logo: '💛' },
        santander: { background: 'linear-gradient(135deg, #EC0000 0%, #B50000 100%)', logo: '❤️' },
        caixa: { background: 'linear-gradient(135deg, #005CA8 0%, #003D70 100%)', logo: '🔵' },
        c6bank: { background: 'linear-gradient(135deg, #1A1A1A 0%, #333333 100%)', logo: '⬛' },
        picpay: { background: 'linear-gradient(135deg, #11C76F 0%, #0AA55A 100%)', logo: '💚' },
        neon: { background: 'linear-gradient(135deg, #00D3FF 0%, #00A8CC 100%)', logo: '💠' },
        next: { background: 'linear-gradient(135deg, #00FF87 0%, #00CC6D 100%)', logo: '💚' },
      }
      
      if (bank && styles[bank]) {
        return styles[bank]
      }
      
      // Fallback to brand colors
      const brandColors = {
        visa: { background: 'linear-gradient(135deg, #1a1f71 0%, #0d47a1 100%)', logo: '' },
        mastercard: { background: 'linear-gradient(135deg, #eb001b 0%, #ff5f00 100%)', logo: '' },
        amex: { background: 'linear-gradient(135deg, #006fcf 0%, #00aeef 100%)', logo: '' },
        elo: { background: 'linear-gradient(135deg, #ffcb05 0%, #00a4e0 100%)', logo: '' },
        hipercard: { background: 'linear-gradient(135deg, #b3131b 0%, #8e0a14 100%)', logo: '' },
        default: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', logo: '' },
      }
      
      return brandColors[cardBrand.value] || brandColors.default
    })

    // Preview do módulo JSON
    const modulePreview = computed(() => {
      if (!moduleName.value) return ''
      
      const baseModule = {
        name: moduleName.value,
        column: [
          { name: 'id', type: 'bigIncrements', attributes: ['index'] },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'text', attributes: ['nullable'] },
        ]
      }

      if (selectedTemplate.value === 'full' || selectedTemplate.value === 'table') {
        baseModule.column.push({ name: 'status', type: 'boolean', default: true })
      }

      return JSON.stringify(baseModule, null, 2)
    })

    const formatCardNumber = (num) => {
      if (!num) return '•••• •••• •••• ••••'
      const cleaned = num.replace(/\s/g, '')
      const groups = cleaned.match(/.{1,4}/g) || []
      const formatted = groups.join(' ')
      const remaining = 19 - formatted.length
      return formatted + '•'.repeat(Math.max(0, remaining)).replace(/(.{4})/g, ' $1').trim()
    }

    const formatCardInput = () => {
      let val = demoData.cardNumber.replace(/\s/g, '').replace(/\D/g, '')
      val = val.match(/.{1,4}/g)?.join(' ') || val
      demoData.cardNumber = val.substring(0, 19)
    }

    // Create component in scope (local, sem API)
    const createInScope = async () => {
      if (!selectedScope.value || !moduleName.value) {
        message.error('Selecione um scope e informe o nome do módulo')
        return
      }

      creating.value = true

      // Simula criação
      setTimeout(() => {
        creating.value = false
        message.success(`Módulo "${moduleName.value}" preparado para o scope "${selectedScope.value}"!`)
        message.info('Use o Generator para aplicar as mudanças.')
        
        scopeModules.value.push({ name: moduleName.value })
        moduleName.value = ''
      }, 1000)
    }

    const openComponent = (comp) => {
      modal.component = comp
      modal.tab = 'preview'
      modal.show = true
    }

    const useComponent = () => {
      if (!modal.component) return
      
      activeTab.value = 'create'
      modal.show = false
      
      message.success(`Componente ${modal.component.name} selecionado. Configure o módulo na aba "Criar no Scope".`)
    }

    const copyCode = (code) => {
      if (!code) return
      navigator.clipboard.writeText(code)
      message.success('Código copiado!')
    }

    return {
      search,
      activeTab,
      modal,
      filteredComponents,
      propsColumns,
      openComponent,
      copyCode,
      useComponent,
      // Scope creation
      selectedScope,
      selectedTemplate,
      moduleName,
      creating,
      scopeModules,
      scopeOptions,
      templateOptions,
      modulePreview,
      createInScope,
      // Demo data
      demoData,
      countryOptions,
      categoryOptions,
      demoTableColumns,
      demoTableData,
      // Card
      cardBrand,
      cardBank,
      cardBrandName,
      cardBankName,
      cardStyle,
      formatCardNumber,
      formatCardInput,
    }
  }
}
</script>

<style lang="scss" scoped>
.components-page {
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 48px 32px;
  text-align: center;
  
  .header-content {
    max-width: 600px;
    margin: 0 auto;
    
    .n-h1 {
      color: white;
      margin: 0 0 8px;
    }
  }
}

.tabs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.search-section {
  max-width: 600px;
  margin: 24px auto 32px;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 16px 0 48px;
}

.component-card {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .n-h4 {
    margin: 16px 0 8px;
  }
  
  .card-tag {
    margin-top: 12px;
  }
}

.preview-container {
  min-height: 200px;
  padding: 24px;
}

.preview-demo {
  width: 100%;
}

.card-preview {
  padding: 24px 0;
}

.card-preview-layout {
  display: flex;
  gap: 48px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}

.card-display {
  flex-shrink: 0;
}

.card-form {
  flex: 1;
  max-width: 380px;
  min-width: 300px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--n-text-color-3);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.create-scope-section {
  padding: 24px 0;
  
  .create-card {
    max-width: 800px;
    margin: 0 auto;
  }
}

.json-preview {
  background: var(--n-color-modal);
  padding: 16px;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
}

.code-block {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 16px;
  border-radius: 8px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
}

// Credit Card Styles
.credit-card-demo {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.credit-card {
  width: 340px;
  height: 200px;
  border-radius: 16px;
  padding: 24px;
  position: relative;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  font-family: 'Consolas', monospace;
  
  &.visa {
    background: linear-gradient(135deg, #1a1f71 0%, #0d47a1 100%);
  }
  
  &.mastercard {
    background: linear-gradient(135deg, #eb001b 0%, #ff5f00 100%);
  }
  
  &.amex {
    background: linear-gradient(135deg, #006fcf 0%, #00aeef 100%);
  }
  
  &.elo {
    background: linear-gradient(135deg, #ffcb05 0%, #00a4e0 100%);
  }
  
  &.hipercard {
    background: linear-gradient(135deg, #b3131b 0%, #8e0a14 100%);
  }
  
  .card-chip {
    width: 45px;
    height: 35px;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
    border-radius: 6px;
    margin-bottom: 20px;
  }
  
  .card-brand-logo {
    position: absolute;
    top: 20px;
    right: 24px;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 2px;
  }
  
  .card-bank-name {
    position: absolute;
    top: 20px;
    left: 24px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .card-number {
    font-size: 20px;
    letter-spacing: 3px;
    margin-bottom: 20px;
  }
  
  .card-info {
    display: flex;
    justify-content: space-between;
    
    .label {
      display: block;
      font-size: 9px;
      opacity: 0.7;
      margin-bottom: 4px;
    }
    
    .value {
      font-size: 14px;
      text-transform: uppercase;
    }
  }
}
</style>
