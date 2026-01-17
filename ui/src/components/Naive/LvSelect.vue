<!-- 
  LvSelect.vue - Naive UI Edition
  Modern select/dropdown component
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
      <n-select
        v-model:value="selectedValue"
        :options="selectOptions"
        :placeholder="placeholder"
        :disabled="disabled"
        :size="size"
        :multiple="multiple"
        :clearable="clearable"
        :filterable="filterable"
        :loading="loading"
        :remote="remote"
        :max-tag-count="maxTagCount"
        :tag="tag"
        :virtual-scroll="virtualScroll"
        @update:value="handleChange"
        @search="handleSearch"
      />
    </n-form-item>

    <n-select
      v-else
      v-model:value="selectedValue"
      :options="selectOptions"
      :placeholder="placeholder"
      :disabled="disabled"
      :size="size"
      :multiple="multiple"
      :clearable="clearable"
      :filterable="filterable"
      :loading="loading"
      @update:value="handleChange"
      @search="handleSearch"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
import { NFormItem, NSelect } from "naive-ui";

export default defineComponent({
  name: "LvSelect",
  components: {
    NFormItem,
    NSelect,
  },
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
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
      default: "Select...",
    },
    size: {
      type: String,
      default: "medium",
    },
    col: {
      type: [String, Number],
      default: 12,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: Boolean,
      default: false,
    },
    virtualScroll: {
      type: Boolean,
      default: true,
    },
    maxTagCount: {
      type: [Number, String],
      default: "responsive",
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
    // For mapping option keys
    optionValue: {
      type: String,
      default: "value",
    },
    optionLabel: {
      type: String,
      default: "label",
    },
  },
  emits: ["update:modelValue", "change", "search"],
  setup(props, { emit }) {
    const selectedValue = ref(props.modelValue);

    // Transform options to Naive UI format
    const selectOptions = computed(() => {
      return props.options.map((opt) => {
        if (typeof opt === "string" || typeof opt === "number") {
          return { label: String(opt), value: opt };
        }
        return {
          label: opt[props.optionLabel] || opt.label || opt.name || String(opt.value),
          value: opt[props.optionValue] ?? opt.value ?? opt.id,
          disabled: opt.disabled || false,
        };
      });
    });

    watch(
      () => props.modelValue,
      (newVal) => {
        selectedValue.value = newVal;
      }
    );

    function handleChange(value) {
      selectedValue.value = value;
      emit("update:modelValue", value);
      emit("change", value);
    }

    function handleSearch(query) {
      emit("search", query);
    }

    return {
      selectedValue,
      selectOptions,
      handleChange,
      handleSearch,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-field {
  width: 100%;
}
</style>
