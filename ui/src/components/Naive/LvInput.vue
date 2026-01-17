<!-- 
  LvInput.vue - Naive UI Edition
  Modern input component with validation support
-->
<template>
  <div :class="['lv-field', `col-${col}`]">
    <n-form-item
      v-if="showFormItem"
      :label="label"
      :path="name"
      :required="required"
      :feedback="errorMessage"
      :validation-status="error ? 'error' : undefined"
    >
      <!-- Currency/Number Input -->
      <n-input-number
        v-if="mode === 'currency' || mode === 'number'"
        v-model:value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :size="inputSize"
        :precision="mode === 'currency' ? 2 : precision"
        :min="min"
        :max="max"
        :step="step"
        :show-button="showButton"
        :clearable="clearable"
        style="width: 100%"
        @update:value="handleChange"
      >
        <template #prefix v-if="mode === 'currency'">
          <span class="lv-currency-prefix">R$</span>
        </template>
      </n-input-number>

      <!-- Date Picker -->
      <n-date-picker
        v-else-if="mode === 'date'"
        v-model:value="dateValue"
        type="date"
        :placeholder="placeholder"
        :disabled="disabled"
        :size="inputSize"
        :clearable="clearable"
        style="width: 100%"
        @update:value="handleDateChange"
      />

      <!-- DateTime Picker -->
      <n-date-picker
        v-else-if="mode === 'datetime'"
        v-model:value="dateValue"
        type="datetime"
        :placeholder="placeholder"
        :disabled="disabled"
        :size="inputSize"
        :clearable="clearable"
        style="width: 100%"
        @update:value="handleDateChange"
      />

      <!-- Time Picker -->
      <n-time-picker
        v-else-if="mode === 'time'"
        v-model:value="timeValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :size="inputSize"
        :clearable="clearable"
        style="width: 100%"
        @update:value="handleTimeChange"
      />

      <!-- Date Range Picker -->
      <n-date-picker
        v-else-if="mode === 'daterange'"
        v-model:value="dateRangeValue"
        type="daterange"
        :placeholder="['Start Date', 'End Date']"
        :disabled="disabled"
        :size="inputSize"
        :clearable="clearable"
        style="width: 100%"
        @update:value="handleDateRangeChange"
      />

      <!-- Password Input -->
      <n-input
        v-else-if="type === 'password'"
        v-model:value="inputValue"
        type="password"
        show-password-on="click"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :size="inputSize"
        :clearable="clearable"
        :maxlength="maxlength"
        :show-count="showCount"
        @update:value="handleChange"
      >
        <template #prefix v-if="$slots.prefix">
          <slot name="prefix" />
        </template>
        <template #suffix v-if="$slots.suffix">
          <slot name="suffix" />
        </template>
      </n-input>

      <!-- Textarea -->
      <n-input
        v-else-if="type === 'textarea'"
        v-model:value="inputValue"
        type="textarea"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :size="inputSize"
        :rows="rows"
        :autosize="autosize"
        :maxlength="maxlength"
        :show-count="showCount"
        :clearable="clearable"
        @update:value="handleChange"
      />

      <!-- Default Text Input -->
      <n-input
        v-else
        v-model:value="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :size="inputSize"
        :clearable="clearable"
        :maxlength="maxlength"
        :show-count="showCount"
        @update:value="handleChange"
      >
        <template #prefix v-if="$slots.prefix">
          <slot name="prefix" />
        </template>
        <template #suffix v-if="$slots.suffix">
          <slot name="suffix" />
        </template>
      </n-input>
    </n-form-item>

    <!-- Without form item wrapper -->
    <template v-else>
      <n-input
        v-model:value="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :size="inputSize"
        :clearable="clearable"
        @update:value="handleChange"
      >
        <template #prefix v-if="$slots.prefix">
          <slot name="prefix" />
        </template>
        <template #suffix v-if="$slots.suffix">
          <slot name="suffix" />
        </template>
      </n-input>
    </template>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
import { NFormItem, NInput, NInputNumber, NDatePicker, NTimePicker } from "naive-ui";

export default defineComponent({
  name: "LvInput",
  components: {
    NFormItem,
    NInput,
    NInputNumber,
    NDatePicker,
    NTimePicker,
  },
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    mode: {
      type: String,
      default: "", // 'currency', 'number', 'date', 'datetime', 'time', 'daterange'
    },
    size: {
      type: String,
      default: "medium", // 'small', 'medium', 'large'
    },
    col: {
      type: [String, Number],
      default: 12,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    showFormItem: {
      type: Boolean,
      default: true,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    // Number specific
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
    step: {
      type: Number,
      default: 1,
    },
    precision: {
      type: Number,
      default: 0,
    },
    showButton: {
      type: Boolean,
      default: true,
    },
    // Textarea specific
    rows: {
      type: Number,
      default: 3,
    },
    autosize: {
      type: [Boolean, Object],
      default: false,
    },
    maxlength: {
      type: Number,
      default: undefined,
    },
    showCount: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const inputValue = ref(props.modelValue);
    const dateValue = ref(null);
    const timeValue = ref(null);
    const dateRangeValue = ref(null);

    const inputSize = computed(() => props.size);

    // Watch for external changes
    watch(
      () => props.modelValue,
      (newVal) => {
        inputValue.value = newVal;
        
        // Handle date conversions
        if (props.mode === "date" || props.mode === "datetime") {
          dateValue.value = newVal ? new Date(newVal).getTime() : null;
        }
        if (props.mode === "time" && newVal) {
          const [hours, minutes] = String(newVal).split(":");
          const date = new Date();
          date.setHours(parseInt(hours) || 0, parseInt(minutes) || 0, 0, 0);
          timeValue.value = date.getTime();
        }
      },
      { immediate: true }
    );

    function handleChange(value) {
      inputValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
    }

    function handleDateChange(value) {
      dateValue.value = value;
      const formatted = value ? new Date(value).toISOString().split("T")[0] : null;
      emit("update:modelValue", formatted);
      emit("change", formatted);
    }

    function handleTimeChange(value) {
      timeValue.value = value;
      if (value) {
        const date = new Date(value);
        const formatted = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
        emit("update:modelValue", formatted);
        emit("change", formatted);
      } else {
        emit("update:modelValue", null);
        emit("change", null);
      }
    }

    function handleDateRangeChange(value) {
      dateRangeValue.value = value;
      if (value && value[0] && value[1]) {
        const formatted = {
          from: new Date(value[0]).toISOString().split("T")[0],
          to: new Date(value[1]).toISOString().split("T")[0],
        };
        emit("update:modelValue", formatted);
        emit("change", formatted);
      } else {
        emit("update:modelValue", null);
        emit("change", null);
      }
    }

    return {
      inputValue,
      dateValue,
      timeValue,
      dateRangeValue,
      inputSize,
      handleChange,
      handleDateChange,
      handleTimeChange,
      handleDateRangeChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-field {
  width: 100%;
}

.lv-currency-prefix {
  color: var(--lv-text-muted);
  font-weight: 500;
}
</style>
