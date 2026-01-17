<!-- 
  LvTable.vue - Naive UI Edition
  Modern data table with pagination, search, and actions
-->
<template>
  <div class="lv-table-wrapper">
    <!-- Table Header -->
    <div class="lv-table-header" v-if="!hideTop">
      <div class="lv-table-header-left">
        <!-- Refresh Button -->
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button 
              quaternary 
              circle 
              :loading="isLoading"
              @click="onRefresh"
            >
              <template #icon>
                <n-icon :size="18">
                  <RefreshOutline />
                </n-icon>
              </template>
            </n-button>
          </template>
          Refresh
        </n-tooltip>

        <!-- Trash Toggle -->
        <n-switch 
          v-if="allowTrash"
          :value="localIsTrashed"
          size="small"
          @update:value="toggleTrashed"
        >
          <template #checked>
            <n-icon :size="14"><TrashOutline /></n-icon>
          </template>
          <template #unchecked>
            <n-icon :size="14"><TrashOutline /></n-icon>
          </template>
        </n-switch>

        <!-- Batch Actions -->
        <n-button-group v-if="selectedItems.length > 0">
          <n-button 
            :type="localIsTrashed ? 'success' : 'error'"
            size="small"
            @click="deleteRestoreSelected"
          >
            <template #icon>
              <n-icon>
                <RefreshOutline v-if="localIsTrashed" />
                <TrashOutline v-else />
              </n-icon>
            </template>
            {{ localIsTrashed ? 'Restore' : 'Delete' }} ({{ selectedItems.length }})
          </n-button>
        </n-button-group>
      </div>

      <div class="lv-table-header-right">
        <!-- Search -->
        <n-input
          :value="localSearch"
          placeholder="Search..."
          clearable
          size="small"
          style="width: 240px"
          @update:value="handleSearchChange"
        >
          <template #prefix>
            <n-icon :size="16">
              <SearchOutline />
            </n-icon>
          </template>
        </n-input>

        <!-- Column Settings -->
        <n-popover trigger="click" placement="bottom-end" v-if="setting">
          <template #trigger>
            <n-button quaternary circle size="small">
              <template #icon>
                <n-icon :size="18">
                  <SettingsOutline />
                </n-icon>
              </template>
            </n-button>
          </template>
          <div class="lv-table-settings">
            <div class="lv-table-settings-title">Visible Columns</div>
            <n-checkbox-group 
              :value="localVisibleColumns"
              @update:value="handleVisibleColumnsChange"
            >
              <n-space vertical>
                <n-checkbox 
                  v-for="col in columnsForSettings"
                  :key="col.name"
                  :value="col.name"
                  :label="col.label"
                />
              </n-space>
            </n-checkbox-group>
          </div>
        </n-popover>
      </div>
    </div>

    <!-- Data Table -->
    <n-data-table
      :columns="tableColumns"
      :data="tableItems"
      :loading="isLoading"
      :pagination="paginationConfig"
      :row-key="rowKey"
      :row-class-name="rowClassName"
      :checked-row-keys="checkedKeys"
      :on-update:checked-row-keys="handleCheck"
      :scroll-x="scrollX"
      :max-height="maxHeight"
      :bordered="bordered"
      :single-line="singleLine"
      :striped="striped"
      :size="size"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
      @update:sorter="handleSorterChange"
    />

    <!-- Empty State -->
    <n-empty 
      v-if="!isLoading && tableItems.length === 0"
      description="No data found"
      class="lv-table-empty"
    >
      <template #icon>
        <n-icon :size="48">
          <DocumentTextOutline />
        </n-icon>
      </template>
    </n-empty>
  </div>
</template>

<script>
import { defineComponent, ref, computed, h, watch } from "vue";
import {
  NDataTable,
  NButton,
  NButtonGroup,
  NInput,
  NIcon,
  NSwitch,
  NTooltip,
  NPopover,
  NCheckboxGroup,
  NCheckbox,
  NSpace,
  NEmpty,
  NTag,
  NAvatar,
  NDropdown,
} from "naive-ui";
import {
  RefreshOutline,
  TrashOutline,
  SearchOutline,
  SettingsOutline,
  DocumentTextOutline,
  EllipsisVerticalOutline,
  CreateOutline,
  EyeOutline,
} from "@vicons/ionicons5";
import useServices from "../../composables/Services";

export default defineComponent({
  name: "LvTable",
  components: {
    NDataTable,
    NButton,
    NButtonGroup,
    NInput,
    NIcon,
    NSwitch,
    NTooltip,
    NPopover,
    NCheckboxGroup,
    NCheckbox,
    NSpace,
    NEmpty,
    RefreshOutline,
    TrashOutline,
    SearchOutline,
    SettingsOutline,
    DocumentTextOutline,
  },
  props: {
    // Legacy 'config' prop for backwards compatibility
    config: {
      type: Object,
      default: null,
    },
    // New separated props
    table: {
      type: Object,
      default: null,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    urlPath: {
      type: String,
      default: "",
    },
    urlParams: {
      type: String,
      default: "",
    },
    searchBy: {
      type: [String, Array],
      default: "",
    },
    allowTrash: {
      type: Boolean,
      default: true,
    },
    allowRestore: {
      type: Boolean,
      default: true,
    },
    noShorthand: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "auto",
    },
    hideTop: {
      type: Boolean,
      default: false,
    },
    setting: {
      type: Boolean,
      default: true,
    },
    actionBtn: {
      type: Boolean,
      default: true,
    },
    scrollX: {
      type: [Number, String],
      default: undefined,
    },
    maxHeight: {
      type: [Number, String],
      default: undefined,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    singleLine: {
      type: Boolean,
      default: true,
    },
    striped: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "medium",
    },
    rowKey: {
      type: Function,
      default: (row) => row.id,
    },
    rowClassName: {
      type: Function,
      default: () => "",
    },
  },
  emits: ["refresh", "delete", "restore", "deleted", "restored", "row-click", "row-clicked", "update:table", "update:config"],
  setup(props, { emit, slots }) {
    const { Api, Helper } = useServices();
    const checkedKeys = ref([]);
    const searchTimeout = ref(null);
    const internalLoading = ref(false);
    
    // Resolve table data from config or table prop
    const tableData = computed(() => {
      if (props.config) return props.config;
      return props.table || {
        data: [],
        loading: false,
        isTrashed: false,
        search: "",
        selected: [],
        visibleColumns: [],
        columns: [],
        pagination: { page: 1, rowsPerPage: 20, rowsNumber: 0 },
      };
    });
    
    // Resolve columns from props or config
    const columnsData = computed(() => {
      if (props.columns && props.columns.length > 0) return props.columns;
      return tableData.value.columns || [];
    });
    
    // Local reactive copies to avoid prop mutation
    const localIsTrashed = ref(tableData.value.isTrashed || false);
    const localSearch = ref(tableData.value.search || "");
    const localVisibleColumns = ref(tableData.value.visibleColumns || []);
    const localSelected = ref(tableData.value.selected || []);
    
    // Sync local state with props
    watch(() => tableData.value.isTrashed, (val) => { localIsTrashed.value = val; });
    watch(() => tableData.value.search, (val) => { localSearch.value = val; });
    watch(() => tableData.value.visibleColumns, (val) => { localVisibleColumns.value = val; }, { deep: true });
    watch(() => tableData.value.selected, (val) => { localSelected.value = val; }, { deep: true });

    // Pagination config
    const paginationConfig = computed(() => ({
      page: tableData.value.pagination?.page || 1,
      pageSize: tableData.value.pagination?.rowsPerPage || 20,
      itemCount: tableData.value.pagination?.rowsNumber || 0,
      showSizePicker: true,
      pageSizes: [10, 20, 50, 100],
      prefix: ({ itemCount }) => `Total: ${itemCount}`,
    }));

    // Build Naive UI columns from props
    const tableColumns = computed(() => {
      const cols = [];

      // Selection column
      if (tableData.value.action) {
        cols.push({
          type: "selection",
          fixed: "left",
          width: 50,
        });
      }

      // Data columns
      columnsData.value.forEach((col) => {
        if (col.name === "action") return;
        if (!tableData.value.visibleColumns?.includes(col.name) && tableData.value.visibleColumns?.length > 0) return;

        const column = {
          key: col.name,
          title: col.label || col.name,
          width: col.width,
          minWidth: col.minWidth || 100,
          sorter: col.sortable !== false,
          ellipsis: col.ellipsis !== false ? { tooltip: true } : false,
        };

        // Custom render based on type
        if (col.type === "index") {
          column.render = (row, index) => index + 1;
          column.width = 60;
        } else if (col.type === "boolean" || col.type === "bool") {
          column.render = (row) => {
            const val = row[col.field || col.name];
            return h(NTag, {
              type: val ? "success" : "default",
              size: "small",
              round: true,
            }, () => val ? "Yes" : "No");
          };
        } else if (col.type === "date") {
          column.render = (row) => {
            const val = row[col.field || col.name];
            return val ? Helper.beautyDate(val) : "-";
          };
        } else if (col.type === "datetime") {
          column.render = (row) => {
            const val = row[col.field || col.name];
            return val ? Helper.beautyDate(val, "", true) : "-";
          };
        } else if (col.type === "currency") {
          column.render = (row) => {
            const val = row[col.field || col.name];
            return val ? `R$ ${Number(val).toFixed(2)}` : "-";
          };
        } else if (col.type === "tag" || col.type === "status") {
          column.render = (row) => {
            const val = row[col.field || col.name];
            const typeMap = {
              active: "success",
              inactive: "default",
              pending: "warning",
              approved: "success",
              rejected: "error",
              cancelled: "error",
            };
            return h(NTag, {
              type: typeMap[val?.toLowerCase()] || "default",
              size: "small",
            }, () => val || "-");
          };
        } else if (slots[`col-${col.name}`]) {
          column.render = (row, index) => {
            return slots[`col-${col.name}`]({ row, index, value: row[col.field || col.name] });
          };
        } else {
          column.render = (row) => row[col.field || col.name] ?? "-";
        }

        cols.push(column);
      });

      // Action column
      const actionCol = columnsData.value.find((c) => c.name === "action");
      if (actionCol || slots["col-action"]) {
        cols.push({
          key: "action",
          title: "Actions",
          width: 120,
          fixed: "right",
          render: (row, index) => {
            if (slots["col-action"]) {
              return slots["col-action"]({ row, index });
            }
            return h(NDropdown, {
              trigger: "click",
              options: [
                { label: "View", key: "view", icon: () => h(NIcon, null, () => h(EyeOutline)) },
                { label: "Edit", key: "edit", icon: () => h(NIcon, null, () => h(CreateOutline)) },
                { type: "divider", key: "d1" },
                { label: "Delete", key: "delete", icon: () => h(NIcon, null, () => h(TrashOutline)) },
              ],
              onSelect: (key) => handleAction(key, row),
            }, () => h(NButton, { quaternary: true, circle: true, size: "small" }, () => h(NIcon, null, () => h(EllipsisVerticalOutline))));
          },
        });
      }

      return cols;
    });

    // Sync selected with tableData.selected
    watch(
      () => tableData.value.selected,
      (newVal) => {
        checkedKeys.value = newVal?.map((r) => r.id) || [];
      },
      { immediate: true, deep: true }
    );

    // Helper to emit table updates
    function emitTableUpdate(updates) {
      if (props.config) {
        emit("update:config", { ...tableData.value, ...updates });
      } else {
        emit("update:table", { ...tableData.value, ...updates });
      }
    }

    function handleCheck(keys) {
      checkedKeys.value = keys;
      const selected = tableData.value.data.filter((r) => keys.includes(r.id));
      localSelected.value = selected;
      emitTableUpdate({ selected });
    }

    function handlePageChange(page) {
      emitTableUpdate({ 
        pagination: { ...tableData.value.pagination, page } 
      });
      onRefresh();
    }

    function handlePageSizeChange(pageSize) {
      emitTableUpdate({ 
        pagination: { ...tableData.value.pagination, rowsPerPage: pageSize } 
      });
      onRefresh();
    }

    function handleSorterChange(sorter) {
      if (sorter) {
        emitTableUpdate({
          sortBy: sorter.columnKey,
          sortOrder: sorter.order === "ascend" ? "asc" : "desc"
        });
      } else {
        emitTableUpdate({
          sortBy: null,
          sortOrder: null
        });
      }
      emit("refresh");
    }
    
    function toggleTrashed(value) {
      localIsTrashed.value = value;
      emitTableUpdate({ isTrashed: value });
      onRefresh();
    }
    
    function handleSearchChange(value) {
      localSearch.value = value;
      emitTableUpdate({ search: value });
      clearTimeout(searchTimeout.value);
      searchTimeout.value = setTimeout(() => {
        onRefresh();
      }, 500);
    }
    
    function handleVisibleColumnsChange(value) {
      localVisibleColumns.value = value;
      emitTableUpdate({ visibleColumns: value });
    }

    // Fetch data from API
    async function fetchData() {
      if (!props.urlPath) return;
      
      internalLoading.value = true;
      
      try {
        const params = new URLSearchParams();
        params.append("page", tableData.value.pagination?.page || 1);
        params.append("limit", tableData.value.pagination?.rowsPerPage || 20);
        
        if (localSearch.value) {
          params.append("search", localSearch.value);
        }
        if (localIsTrashed.value) {
          params.append("trashed", "true");
        }
        if (tableData.value.sortBy) {
          params.append("sortBy", tableData.value.sortBy);
          params.append("sortOrder", tableData.value.sortOrder || "asc");
        }
        if (props.urlParams) {
          params.append(props.urlParams.split("=")[0], props.urlParams.split("=")[1]);
        }
        
        const url = `${props.urlPath}?${params.toString()}`;
        
        Api.get(url, (status, data, message) => {
          internalLoading.value = false;
          if (status === 200 && data) {
            emitTableUpdate({
              data: data.data || data,
              loading: false,
              pagination: {
                ...tableData.value.pagination,
                rowsNumber: data.total || data.length || 0,
              },
            });
          }
        });
      } catch (error) {
        internalLoading.value = false;
        console.error("Error fetching data:", error);
      }
    }

    function onRefresh() {
      if (props.urlPath) {
        fetchData();
      } else {
        emit("refresh");
      }
    }

    function deleteRestoreSelected() {
      if (localIsTrashed.value) {
        emit("restore", localSelected.value);
        emit("restored", localSelected.value);
      } else {
        emit("delete", localSelected.value);
        emit("deleted", localSelected.value);
      }
    }

    function handleAction(key, row) {
      emit("row-click", { action: key, row });
      emit("row-clicked", null, row, null, key);
    }
    
    // Computed properties for template
    const isLoading = computed(() => internalLoading.value || tableData.value.loading);
    const tableItems = computed(() => tableData.value.data || []);
    const selectedItems = computed(() => localSelected.value || []);
    const columnsForSettings = computed(() => columnsData.value.filter(c => c.name !== 'action'));
    
    // Initial fetch
    if (props.urlPath) {
      fetchData();
    }

    return {
      checkedKeys,
      paginationConfig,
      tableColumns,
      localIsTrashed,
      localSearch,
      localVisibleColumns,
      isLoading,
      tableItems,
      selectedItems,
      columnsForSettings,
      handleCheck,
      handlePageChange,
      handlePageSizeChange,
      handleSorterChange,
      toggleTrashed,
      handleSearchChange,
      handleVisibleColumnsChange,
      onRefresh,
      deleteRestoreSelected,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-table-wrapper {
  background: var(--lv-bg-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.lv-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--lv-border-color);
  gap: 16px;
  flex-wrap: wrap;
}

.lv-table-header-left,
.lv-table-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lv-table-settings {
  padding: 8px 0;
  min-width: 160px;
  
  &-title {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 12px;
    color: var(--lv-text-secondary);
  }
}

.lv-table-empty {
  padding: 48px 24px;
}

// Override Naive UI table styles
:deep(.n-data-table) {
  .n-data-table-wrapper {
    border-radius: 0;
  }
  
  .n-data-table-th {
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}
</style>
