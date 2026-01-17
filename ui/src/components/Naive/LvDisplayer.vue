<!-- 
  LvDisplayer.vue - Naive UI Edition
  Componente de exibição de dados para views readonly
  
  Tipos suportados:
  - text (default)
  - boolean/bool
  - status/tag
  - currency
  - number
  - percent
  - date
  - datetime
  - link
  - email
  - phone
  - cpf
  - cnpj
  - image
-->
<template>
  <div :class="['lv-displayer', `col-${col}`, { 'lv-displayer--inline': inline }]">
    <div v-if="label" class="lv-displayer-label">
      {{ label }}
    </div>
    <div :class="['lv-displayer-value', { 'lv-displayer-value--empty': isEmpty }]">
      <slot>
        <!-- Boolean display -->
        <n-tag 
          v-if="type === 'boolean' || type === 'bool'"
          :type="displayValue ? 'success' : 'default'"
          size="small"
          round
        >
          {{ displayValue ? (trueLabel || 'Sim') : (falseLabel || 'Não') }}
        </n-tag>

        <!-- Status/Tag display -->
        <n-tag 
          v-else-if="type === 'status' || type === 'tag'"
          :type="statusType"
          size="small"
        >
          {{ displayValue || '-' }}
        </n-tag>

        <!-- Currency display -->
        <span v-else-if="type === 'currency'" class="lv-displayer-currency">
          {{ formattedCurrency }}
        </span>

        <!-- Number display -->
        <span v-else-if="type === 'number'" class="lv-displayer-number">
          {{ formattedNumber }}
        </span>

        <!-- Percent display -->
        <span v-else-if="type === 'percent'" class="lv-displayer-percent">
          {{ formattedPercent }}
        </span>

        <!-- Date display -->
        <span v-else-if="type === 'date'">
          {{ formattedDate }}
        </span>

        <!-- DateTime display -->
        <span v-else-if="type === 'datetime'">
          {{ formattedDateTime }}
        </span>

        <!-- Link display -->
        <n-button 
          v-else-if="type === 'link'"
          text
          tag="a"
          :href="value"
          target="_blank"
          type="primary"
        >
          {{ displayValue || value }}
          <template #icon>
            <n-icon><OpenOutline /></n-icon>
          </template>
        </n-button>

        <!-- Email display -->
        <n-button 
          v-else-if="type === 'email'"
          text
          tag="a"
          :href="`mailto:${value}`"
          type="primary"
        >
          {{ displayValue }}
        </n-button>

        <!-- Phone display -->
        <n-button 
          v-else-if="type === 'phone'"
          text
          tag="a"
          :href="`tel:${value}`"
          type="primary"
        >
          {{ formattedPhone }}
        </n-button>

        <!-- CPF display -->
        <span v-else-if="type === 'cpf'" class="lv-displayer-document">
          {{ formattedCpf }}
        </span>

        <!-- CNPJ display -->
        <span v-else-if="type === 'cnpj'" class="lv-displayer-document">
          {{ formattedCnpj }}
        </span>

        <!-- Image display -->
        <n-image 
          v-else-if="type === 'image'"
          :src="value"
          :width="imageWidth"
          :height="imageHeight"
          object-fit="cover"
          :preview-disabled="!imagePreview"
        />

        <!-- Default text display -->
        <span v-else>
          {{ displayValue || placeholder }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { NTag, NButton, NIcon, NImage } from "naive-ui";
import { OpenOutline } from "@vicons/ionicons5";
import useServices from "../../composables/Services";

export default defineComponent({
  name: "LvDisplayer",
  components: {
    NTag,
    NButton,
    NIcon,
    NImage,
    OpenOutline,
  },
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: null,
    },
    label: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text", // Tipos: text, boolean, status, currency, number, percent, date, datetime, link, email, phone, cpf, cnpj, image
    },
    col: {
      type: [String, Number],
      default: 12,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "-",
    },
    // Boolean labels
    trueLabel: {
      type: String,
      default: null,
    },
    falseLabel: {
      type: String,
      default: null,
    },
    // Permite copiar valor
    copyable: {
      type: Boolean,
      default: false,
    },
    // Image specific
    imageWidth: {
      type: [String, Number],
      default: 100,
    },
    imageHeight: {
      type: [String, Number],
      default: 100,
    },
    imagePreview: {
      type: Boolean,
      default: true,
    },
    // Locale para formatação
    locale: {
      type: String,
      default: 'pt-BR',
    },
  },
  setup(props) {
    const { Helper } = useServices();

    const displayValue = computed(() => {
      if (props.value === null || props.value === undefined) return null;
      return props.value;
    });

    const isEmpty = computed(() => {
      return props.value === null || props.value === undefined || props.value === "";
    });

    const statusType = computed(() => {
      const val = String(props.value).toLowerCase();
      const typeMap = {
        active: "success",
        ativo: "success",
        inactive: "default",
        inativo: "default",
        pending: "warning",
        pendente: "warning",
        approved: "success",
        aprovado: "success",
        rejected: "error",
        rejeitado: "error",
        cancelled: "error",
        cancelado: "error",
        completed: "success",
        concluido: "success",
        processing: "info",
        processando: "info",
      };
      return typeMap[val] || "default";
    });

    const formattedCurrency = computed(() => {
      if (props.value === null || props.value === undefined) return "-";
      return new Intl.NumberFormat(props.locale, {
        style: 'currency',
        currency: 'BRL'
      }).format(props.value);
    });

    const formattedNumber = computed(() => {
      if (props.value === null || props.value === undefined) return "-";
      return new Intl.NumberFormat(props.locale).format(props.value);
    });

    const formattedPercent = computed(() => {
      if (props.value === null || props.value === undefined) return "-";
      return new Intl.NumberFormat(props.locale, {
        style: 'percent',
        minimumFractionDigits: 2
      }).format(props.value / 100);
    });

    const formattedDate = computed(() => {
      if (!props.value) return "-";
      return Helper.beautyDate(props.value);
    });

    const formattedDateTime = computed(() => {
      if (!props.value) return "-";
      return Helper.beautyDate(props.value, "", true);
    });

    // Formata telefone brasileiro
    const formattedPhone = computed(() => {
      if (!props.value) return "-";
      const cleaned = String(props.value).replace(/\D/g, '');
      if (cleaned.length === 11) {
        return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,7)}-${cleaned.slice(7)}`;
      }
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,6)}-${cleaned.slice(6)}`;
      }
      return props.value;
    });

    // Formata CPF
    const formattedCpf = computed(() => {
      if (!props.value) return "-";
      const cleaned = String(props.value).replace(/\D/g, '').padStart(11, '0');
      return `${cleaned.slice(0,3)}.${cleaned.slice(3,6)}.${cleaned.slice(6,9)}-${cleaned.slice(9)}`;
    });

    // Formata CNPJ
    const formattedCnpj = computed(() => {
      if (!props.value) return "-";
      const cleaned = String(props.value).replace(/\D/g, '').padStart(14, '0');
      return `${cleaned.slice(0,2)}.${cleaned.slice(2,5)}.${cleaned.slice(5,8)}/${cleaned.slice(8,12)}-${cleaned.slice(12)}`;
    });

    return {
      displayValue,
      isEmpty,
      statusType,
      formattedCurrency,
      formattedNumber,
      formattedPercent,
      formattedDate,
      formattedDateTime,
      formattedPhone,
      formattedCpf,
      formattedCnpj,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-displayer {
  margin-bottom: 16px;
  
  &--inline {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .lv-displayer-label {
      margin-bottom: 0;
      min-width: 120px;
    }
  }
}

.lv-displayer-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--lv-text-muted);
  margin-bottom: 6px;
}

.lv-displayer-value {
  font-size: 14px;
  color: var(--lv-text-primary);
  
  &--empty {
    color: var(--lv-text-muted);
  }
}

.lv-displayer-currency,
.lv-displayer-number,
.lv-displayer-percent {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.lv-displayer-document {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  letter-spacing: 0.5px;
}
</style>
