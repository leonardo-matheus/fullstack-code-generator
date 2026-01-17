<template>
  <div class="lv-credit-card-wrapper">
    <div 
      class="flip-card" 
      :class="{ 'is-flipped': isFlipped }"
      @click="toggleFlip"
    >
      <div class="flip-card-inner">
        <!-- Frente do cartão -->
        <div class="flip-card-front" :style="cardGradientStyle">
          <!-- Logo do banco detectado pelo BIN -->
          <div v-if="detectedBank" class="bank-logo">
            <span class="bank-emoji">{{ bankConfig.logo }}</span>
            <span class="bank-name-text">{{ bankConfig.name }}</span>
          </div>

          <!-- Nome da bandeira (canto superior direito) -->
          <p class="brand-name">{{ brandDisplayName }}</p>

          <!-- Chip EMV e ícone de pagamento por aproximação -->
          <div class="chip-container">
            <svg class="chip" xmlns="http://www.w3.org/2000/svg" width="50" height="40" viewBox="0 0 50 40">
              <rect x="0" y="0" width="50" height="40" rx="5" ry="5" fill="#d4af37"/>
              <rect x="5" y="5" width="15" height="10" rx="2" fill="#c4a030"/>
              <rect x="5" y="18" width="15" height="10" rx="2" fill="#c4a030"/>
              <rect x="25" y="5" width="20" height="23" rx="2" fill="#c4a030"/>
              <line x1="25" y1="16" x2="45" y2="16" stroke="#d4af37" stroke-width="2"/>
            </svg>
            <svg class="contactless" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2">
              <path d="M8.5 14.5A3.5 3.5 0 0 0 12 11"/>
              <path d="M6 17a7 7 0 0 0 7-7"/>
              <path d="M3.5 19.5a11 11 0 0 0 11-11"/>
            </svg>
          </div>

          <!-- Número do cartão formatado em grupos de 4 -->
          <p class="card-number">{{ displayNumber }}</p>

          <!-- Rodapé: titular, validade e logo da bandeira -->
          <div class="card-bottom">
            <div class="holder-info">
              <span class="label">TITULAR</span>
              <span class="holder-name">{{ displayHolder }}</span>
            </div>
            <div class="expiry-info">
              <span class="label">VALIDADE</span>
              <span class="expiry-date">{{ displayExpiry }}</span>
            </div>
            <div class="brand-logo">
              <component :is="brandLogoComponent" />
            </div>
          </div>
        </div>

        <!-- Verso do cartão -->
        <div class="flip-card-back" :style="cardBackGradientStyle">
          <div class="magnetic-strip"></div>
          <div class="signature-area">
            <div class="signature-strip"></div>
            <div class="cvv-strip">
              <span class="cvv-label">CVV</span>
              <span class="cvv-value">{{ displayCvv }}</span>
            </div>
          </div>
          <p class="back-text">Este cartão é de uso pessoal e intransferível.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, h } from 'vue'

/**
 * Mapeamento de BINs (Bank Identification Number) para bancos brasileiros.
 * Os primeiros 4-6 dígitos do cartão identificam o emissor.
 * Fonte: ranges públicos, podem não cobrir todos os cartões.
 */
const BANK_BINS = {
  nubank:    /^(5162|5167|5171|5451|5480|5502|5509)/,
  inter:     /^(5359|5357|5395|5200)/,
  itau:      /^(4380|4387|4389|4504|4514|4516|5044|5045|5169|5178)/,
  bradesco:  /^(4119|4199|4286|4312|4488|5276|5277|5283|5519)/,
  bb:        /^(4011|4017|4018|4019|4284|4301|4302|4304|4305|4984|5070|5071)/,
  santander: /^(4130|4377|4465|4466|5177|5326|5402|5454)/,
  caixa:     /^(5041|5057|5127|5128|5181)/,
  c6bank:    /^(5425|5426|5427|5428)/,
  picpay:    /^(5439|5447)/,
  neon:      /^(5432)/,
  next:      /^(5503|5504)/
}

/**
 * Configuração visual de cada banco: nome exibido e emoji representativo.
 */
const BANK_CONFIG = {
  nubank:    { name: 'NUBANK',           logo: '💜' },
  inter:     { name: 'INTER',            logo: '🧡' },
  itau:      { name: 'ITAÚ',             logo: '🔷' },
  bradesco:  { name: 'BRADESCO',         logo: '🔴' },
  bb:        { name: 'BANCO DO BRASIL',  logo: '💛' },
  santander: { name: 'SANTANDER',        logo: '❤️' },
  caixa:     { name: 'CAIXA',            logo: '🔵' },
  c6bank:    { name: 'C6 BANK',          logo: '⬛' },
  picpay:    { name: 'PICPAY',           logo: '💚' },
  neon:      { name: 'NEON',             logo: '💠' },
  next:      { name: 'NEXT',             logo: '💚' }
}

/**
 * Gradientes de cores da frente do cartão por banco.
 * Cores baseadas na identidade visual oficial de cada instituição.
 */
const BANK_GRADIENTS_FRONT = {
  nubank:    'linear-gradient(135deg, #8A05BE 0%, #5C0080 100%)',
  inter:     'linear-gradient(135deg, #FF7A00 0%, #FF5500 100%)',
  itau:      'linear-gradient(135deg, #003366 0%, #002244 100%)',
  bradesco:  'linear-gradient(135deg, #CC092F 0%, #8B0620 100%)',
  bb:        'linear-gradient(135deg, #FFCC00 0%, #003366 100%)',
  santander: 'linear-gradient(135deg, #EC0000 0%, #B30000 100%)',
  caixa:     'linear-gradient(135deg, #005CA9 0%, #003D73 100%)',
  c6bank:    'linear-gradient(135deg, #1A1A1A 0%, #000000 100%)',
  picpay:    'linear-gradient(135deg, #21C25E 0%, #168F42 100%)',
  neon:      'linear-gradient(135deg, #00D4AA 0%, #00A884 100%)',
  next:      'linear-gradient(135deg, #00FF87 0%, #00CC6D 100%)'
}

/**
 * Gradientes do verso do cartão (versão mais escura).
 */
const BANK_GRADIENTS_BACK = {
  nubank:    'linear-gradient(135deg, #5C0080 0%, #3D0055 100%)',
  inter:     'linear-gradient(135deg, #FF5500 0%, #CC4400 100%)',
  itau:      'linear-gradient(135deg, #002244 0%, #001122 100%)',
  bradesco:  'linear-gradient(135deg, #8B0620 0%, #5C0415 100%)',
  bb:        'linear-gradient(135deg, #003366 0%, #001133 100%)',
  santander: 'linear-gradient(135deg, #B30000 0%, #800000 100%)',
  caixa:     'linear-gradient(135deg, #003D73 0%, #002244 100%)',
  c6bank:    'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
  picpay:    'linear-gradient(135deg, #168F42 0%, #0F6B30 100%)',
  neon:      'linear-gradient(135deg, #00A884 0%, #007A60 100%)',
  next:      'linear-gradient(135deg, #00CC6D 0%, #009950 100%)'
}

const DEFAULT_GRADIENT_FRONT = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
const DEFAULT_GRADIENT_BACK = 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)'

/**
 * Regex para detecção de bandeiras de cartão.
 * Ordem importa: Elo deve vir antes de Visa/Master pois tem BINs que conflitam.
 */
const BRAND_PATTERNS = [
  { brand: 'elo',       pattern: /^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|651|652|655)/ },
  { brand: 'amex',      pattern: /^3[47]/ },
  { brand: 'hipercard', pattern: /^(38|60)/ },
  { brand: 'visa',      pattern: /^4/ },
  { brand: 'mastercard', pattern: /^(5[1-5]|2[2-7])/ }
]

const BRAND_NAMES = {
  visa: 'VISA',
  mastercard: 'MASTERCARD',
  amex: 'AMEX',
  elo: 'ELO',
  hipercard: 'HIPERCARD'
}

export default {
  name: 'LvCreditCard',
  
  props: {
    number:  { type: String, default: '' },
    holder:  { type: String, default: '' },
    expiry:  { type: String, default: '' },
    cvv:     { type: String, default: '' },
    brand:   { type: String, default: null },  // Força bandeira específica
    bank:    { type: String, default: null },  // Força banco específico
    flipped: { type: Boolean, default: false } // Controla flip via v-model
  },
  
  emits: ['update:flipped'],
  
  setup(props, { emit }) {
    // Número do cartão sem espaços para processamento
    const cleanNumber = computed(() => props.number.replace(/\s/g, ''))
    
    // Computed bidirecional para v-model:flipped funcionar
    const isFlipped = computed({
      get: () => props.flipped,
      set: (val) => emit('update:flipped', val)
    })

    const toggleFlip = () => emit('update:flipped', !props.flipped)

    // Formata número em grupos de 4, preenchendo com bullets
    const displayNumber = computed(() => {
      const num = cleanNumber.value
      if (!num) return '•••• •••• •••• ••••'
      return num.padEnd(16, '•').match(/.{1,4}/g)?.join(' ') ?? '•••• •••• •••• ••••'
    })

    const displayExpiry = computed(() => props.expiry || 'MM/AA')
    const displayHolder = computed(() => props.holder?.toUpperCase() || 'SEU NOME AQUI')
    const displayCvv = computed(() => props.cvv || '***')

    // Detecta bandeira pelo BIN (primeiros dígitos)
    const detectedBrand = computed(() => {
      if (props.brand) return props.brand
      const num = cleanNumber.value
      for (const { brand, pattern } of BRAND_PATTERNS) {
        if (pattern.test(num)) return brand
      }
      return null
    })

    const brandDisplayName = computed(() => BRAND_NAMES[detectedBrand.value] || '')

    // Detecta banco brasileiro pelo BIN
    const detectedBank = computed(() => {
      if (props.bank) return props.bank
      const num = cleanNumber.value
      for (const [bank, pattern] of Object.entries(BANK_BINS)) {
        if (pattern.test(num)) return bank
      }
      return null
    })

    const bankConfig = computed(() => 
      BANK_CONFIG[detectedBank.value] || { name: '', logo: '' }
    )

    // Estilos de gradiente baseados no banco detectado
    const cardGradientStyle = computed(() => ({
      background: BANK_GRADIENTS_FRONT[detectedBank.value] || DEFAULT_GRADIENT_FRONT
    }))

    const cardBackGradientStyle = computed(() => ({
      background: BANK_GRADIENTS_BACK[detectedBank.value] || DEFAULT_GRADIENT_BACK
    }))

    // Componente de logo da bandeira (renderizado dinamicamente)
    const brandLogoComponent = computed(() => {
      const brand = detectedBrand.value
      
      // SVGs das bandeiras como funções render
      const logos = {
        mastercard: () => h('svg', { 
          xmlns: 'http://www.w3.org/2000/svg', 
          width: 60, height: 36, viewBox: '0 0 48 30' 
        }, [
          h('circle', { cx: 15, cy: 15, r: 14, fill: '#eb001b' }),
          h('circle', { cx: 33, cy: 15, r: 14, fill: '#f79e1b' }),
          h('path', { 
            d: 'M24,5.5c3.5,2.7,5.8,7,5.8,11.5s-2.3,8.8-5.8,11.5c-3.5-2.7-5.8-7-5.8-11.5S20.5,8.2,24,5.5z', 
            fill: '#ff5f00' 
          })
        ]),
        
        visa: () => h('svg', { 
          xmlns: 'http://www.w3.org/2000/svg', 
          width: 70, height: 24, viewBox: '0 0 100 32' 
        }, [
          h('text', { 
            x: 0, y: 26, fill: '#fff', 
            'font-family': 'Arial', 'font-size': 28, 
            'font-weight': 'bold', 'font-style': 'italic' 
          }, 'VISA')
        ]),
        
        elo: () => h('svg', { 
          xmlns: 'http://www.w3.org/2000/svg', 
          width: 55, height: 22, viewBox: '0 0 60 24' 
        }, [
          h('text', { 
            x: 0, y: 20, fill: '#fff', 
            'font-family': 'Arial Black', 'font-size': 22, 'font-weight': 'bold' 
          }, 'elo')
        ]),
        
        amex: () => h('svg', { 
          xmlns: 'http://www.w3.org/2000/svg', 
          width: 55, height: 22, viewBox: '0 0 60 24' 
        }, [
          h('text', { 
            x: 0, y: 20, fill: '#fff', 
            'font-family': 'Arial', 'font-size': 16, 'font-weight': 'bold' 
          }, 'AMEX')
        ]),
        
        hipercard: () => h('svg', { 
          xmlns: 'http://www.w3.org/2000/svg', 
          width: 70, height: 22, viewBox: '0 0 80 24' 
        }, [
          h('text', { 
            x: 0, y: 18, fill: '#fff', 
            'font-family': 'Arial', 'font-size': 12, 'font-weight': 'bold' 
          }, 'HIPERCARD')
        ])
      }
      
      // Logo padrão (ícone de cartão genérico)
      const defaultLogo = () => h('svg', { 
        xmlns: 'http://www.w3.org/2000/svg', 
        width: 45, height: 28, viewBox: '0 0 24 24', 
        fill: 'none', stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 1.5 
      }, [
        h('rect', { x: 1, y: 4, width: 22, height: 16, rx: 2, ry: 2 }),
        h('line', { x1: 1, y1: 10, x2: 23, y2: 10 })
      ])
      
      return logos[brand] || defaultLogo
    })

    return {
      isFlipped,
      toggleFlip,
      displayNumber,
      displayExpiry,
      displayHolder,
      displayCvv,
      detectedBrand,
      brandDisplayName,
      detectedBank,
      bankConfig,
      cardGradientStyle,
      cardBackGradientStyle,
      brandLogoComponent
    }
  }
}
</script>

<style scoped>
.lv-credit-card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Container do flip - define perspectiva 3D */
.flip-card {
  background-color: transparent;
  width: 420px;
  height: 260px;
  perspective: 1000px; /* Distância do ponto de vista para efeito 3D */
  color: white;
  cursor: pointer;
}

/* Elemento que rotaciona - preserva faces 3D dos filhos */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-card.is-flipped .flip-card-inner {
  transform: rotateY(180deg);
}

/* Estilos comuns frente/verso */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* Esconde face quando virada */
  -webkit-backface-visibility: hidden;
  border-radius: 20px;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.4),
    0 5px 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15); /* Brilho sutil no topo */
}

.flip-card-front {
  padding: 28px;
  display: flex;
  flex-direction: column;
}

.flip-card-back {
  transform: rotateY(180deg); /* Pré-rotacionado para aparecer corretamente */
  padding: 0;
}

/* Logo do banco (canto superior esquerdo) */
.bank-logo {
  position: absolute;
  top: 24px;
  left: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.bank-emoji {
  font-size: 20px;
}

.bank-name-text {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Nome da bandeira (canto superior direito) */
.brand-name {
  position: absolute;
  top: 26px;
  right: 28px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  opacity: 0.9;
  margin: 0;
}

/* Chip EMV e NFC */
.chip-container {
  position: absolute;
  top: 70px;
  left: 28px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.chip {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.contactless {
  opacity: 0.8;
}

/* Número do cartão - fonte monoespaçada para alinhamento */
.card-number {
  position: absolute;
  top: 145px;
  left: 28px;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
}

/* Rodapé do cartão */
.card-bottom {
  position: absolute;
  bottom: 24px;
  left: 28px;
  right: 28px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.holder-info,
.expiry-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 9px;
  opacity: 0.7;
  letter-spacing: 1px;
}

.holder-name {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expiry-date {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
}

.brand-logo {
  display: flex;
  align-items: center;
}

/* === VERSO DO CARTÃO === */

/* Tarja magnética - padrão listrado */
.magnetic-strip {
  width: 100%;
  height: 55px;
  background: repeating-linear-gradient(
    90deg,
    #1a1a1a,
    #1a1a1a 2px,
    #2a2a2a 2px,
    #2a2a2a 4px
  );
  margin-top: 35px;
}

.signature-area {
  display: flex;
  gap: 16px;
  padding: 24px 28px;
  margin-top: 24px;
}

/* Área de assinatura - padrão diagonal */
.signature-strip {
  flex: 1;
  height: 45px;
  background: repeating-linear-gradient(
    45deg,
    #e0e0e0,
    #e0e0e0 5px,
    #f0f0f0 5px,
    #f0f0f0 10px
  );
  border-radius: 6px;
}

/* Área do CVV */
.cvv-strip {
  width: 90px;
  height: 45px;
  background: white;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.cvv-label {
  font-size: 9px;
  color: #666;
  font-weight: 600;
}

.cvv-value {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  letter-spacing: 3px;
}

.back-text {
  position: absolute;
  bottom: 24px;
  left: 28px;
  right: 28px;
  font-size: 11px;
  opacity: 0.6;
  text-align: center;
  margin: 0;
}

/* Responsivo para telas menores */
@media (max-width: 500px) {
  .flip-card {
    width: 340px;
    height: 210px;
  }
  
  .card-number {
    font-size: 20px;
    top: 120px;
  }
  
  .holder-name,
  .expiry-date {
    font-size: 13px;
  }
}
</style>
