<template>
  <lv-container v-if="Meta.permission.browse">
    <!-- Header -->
    <lv-header-page 
      v-if="controls.title" 
      :title="Meta.name"
      :breadcrumb="[{ label: 'Home', to: '/' }, { label: Meta.name }]"
    >
      <template v-if="controls.action" #actions>
        <lv-btn
          v-if="Meta.permission.create"
          type="primary"
          icon="add"
          label="Adicionar Novo"
          @click="action('form', Meta.model)"
        />
      </template>
    </lv-header-page>

    <!-- List -->
    <lv-table
      ref="refTable"
      :config="table"
      :hideTop="hideTop"
      :url-path="Meta.module"
      :height="height"
      :url-params="`_with=${Meta.withRelation.join(',')}`"
      :searchBy="Meta.searchBy"
      @deleted="onDeleted"
      @restored="onRestored"
      @row-clicked="onRowClicked"
      :noShorthand="noShorthand"
      :setting="setting"
      :allowTrash="Meta.permission.delete"
      :allowRestore="Meta.permission.restore"
    >
      <template #col-action="{ row }">
        <n-dropdown 
          trigger="click" 
          :options="getRowActions(row)" 
          @select="(key) => handleAction(key, row)"
        >
          <n-button quaternary circle>
            <template #icon>
              <n-icon :component="EllipsisHorizontal" />
            </template>
          </n-button>
        </n-dropdown>
      </template>

      <template #col-name="{ row, value }">
        <n-space align="center" :size="8">
          <n-avatar 
            round 
            :size="32" 
            :src="row.picture"
            :fallback-src="''"
          >
            {{ $Helper.getFirstChar(row.username) }}
          </n-avatar>
          <n-text strong>{{ value }}</n-text>
          <n-tag v-if="$Config.userId() === row.id" size="small" type="warning">
            Eu
          </n-tag>
        </n-space>
      </template>

      <template #col-log_data="{ value }">
        <lv-log-data :data="value" />
      </template>
    </lv-table>

    <!-- Modal -->
    <lv-modal
      v-model:show="modal.show"
      :title="modal.target === 'form' ? 'Usuário' : 'Detalhes'"
      :width="600"
    >
      <Form
        v-if="modal.target === 'form'"
        :data="modal.data"
        :onSubmit="onSubmitForm"
        @close="modal.show = false"
      />
      <Detail 
        v-if="modal.target === 'detail'" 
        :data="modal.data" 
        @close="modal.show = false"
      />
    </lv-modal>
  </lv-container>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  watchEffect,
  onBeforeMount,
  defineComponent,
  h,
} from "vue";
import { useRoute } from "vue-router";
import { NDropdown, NButton, NIcon, NAvatar, NText, NTag, NSpace } from "naive-ui";
import { EllipsisHorizontal, Eye, Pencil } from "@vicons/ionicons5";
import useServices from "./../../composables/Services";
import Meta from "./meta";
import Form from "./form";
import Detail from "./detail";

export default defineComponent({
  name: Meta.moduleName,
  components: {
    Form,
    Detail,
    NDropdown,
    NButton,
    NIcon,
    NAvatar,
    NText,
    NTag,
    NSpace,
  },
  emits: ["row-clicked"],
  props: {
    height: {
      type: String,
      default: "calc(100vh - 200px)",
    },
    hideTitle: {
      type: Boolean,
      default: false,
    },
    hideAction: {
      type: Boolean,
      default: false,
    },
    hideTop: {
      type: Boolean,
      default: false,
    },
    noShorthand: {
      type: Boolean,
      default: false,
    },
    setting: {
      type: Boolean,
      default: true,
    },
    disableMeta: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { Config, Handler, Helper, SetMetaPage, Api, GlobalStore } =
      useServices();
    const route = useRoute();

    // Properties
    const refTable = ref(1);
    const modal = reactive(Handler.modalConfig());
    const controls = reactive({
      title: true,
      action: true,
    });
    const selectedAction = reactive({
      isDelete: false,
      data: [],
    });
    let topMenu = [
      { name: "Refresh", event: onRefresh },
      { name: "Tools", children: [{ name: "Export" }, { name: "Download" }] },
    ];
    let table = reactive({
      ...Handler.table(Meta.columns, `${Meta.module}-columns`),
      action: true,
    });

    /* LIFECYCLE */
    onBeforeMount(() => {
      if (!Meta.permission.browse) Handler._403();
      else {
        Handler.topMenu(topMenu);
        handleControls();
        if (!props.disableMeta) SetMetaPage(Meta.name);
      }
    });

    watchEffect(() => {
      handleControls();
    });

    /* COMPUTED */
    const actionModal = computed(() => {
      return GlobalStore.getActionModal;
    });

    /* METHODS */
    function getRowActions(row) {
      const actions = [];
      if (Meta.permission.read) {
        actions.push({
          label: 'Visualizar',
          key: 'detail',
          icon: () => h(NIcon, { component: Eye }),
        });
      }
      if (Meta.permission.update) {
        actions.push({
          label: 'Editar',
          key: 'form',
          icon: () => h(NIcon, { component: Pencil }),
        });
      }
      return actions;
    }

    function handleAction(key, row) {
      action(key, row);
    }

    function onRefresh() {
      if (refTable.value.onRefresh) refTable.value.onRefresh();
    }

    function action(target = "form", data, returnLink = false) {
      const params = data.id ? { id: data.id } : null;
      if (returnLink)
        return actionModal.value
          ? null
          : Handler.actionLinkPage(Meta, target, params, data);
      else {
        modal.target = target;
        modal.data = data;
        modal.show = true;
      }
    }

    function handleControls() {
      controls.title = !props.hideTitle;
      controls.action = !props.hideAction;

      if (props.hideTop) controls.title = false;
      else controls.title = true;

      table.action = controls.action;
    }

    function onDeleted(data) {
      selectedAction.isDelete = true;
      selectedAction.data = data;
      let hold = 0;
      data.map((r) => {
        if (Config.userId() === r.id) hold += 1;
      });

      if (!hold) deleteRestoreHandler();
      else {
        Helper.showAlert("Ops!", "Você não pode deletar seus próprios dados!");
      }
    }

    function onRestored(data) {
      selectedAction.isDelete = false;
      selectedAction.data = data;
      deleteRestoreHandler();
    }

    function deleteRestoreHandler() {
      const totalData = selectedAction.data.length;
      const type = selectedAction.isDelete ? "Deletar" : "Restaurar";
      const title = `${type} ${totalData} ${totalData > 1 ? 'itens selecionados' : 'item selecionado'}`;
      const message = `Tem certeza que deseja ${title.toLowerCase()}?`;
      Helper.showAlert(title, message, false, type, deleteRestoreSelected);
    }

    function deleteRestoreSelected() {
      const mode = selectedAction.isDelete ? "delete" : "restore";
      Helper.loadingOverlay(
        true,
        mode === "delete" ? "Deletando..." : "Restaurando..."
      );
      const data = { id: [] };
      selectedAction.data.map((r) => {
        data.id.push(r.id);
      });

      Api.put(
        `${Meta.module}/${mode}`,
        data,
        (status, data, message, response) => {
          Helper.loadingOverlay(false);
          if (status === 200) {
            Helper.showToast(
              `${mode === "delete" ? "Deletado" : "Restaurado"} com sucesso`,
              5000,
              "top-right",
              message,
              "indigo"
            );
            onRefresh();
          }
        }
      );
    }

    function onRowClicked(evt, row, index, from) {
      emit("row-clicked", evt, row, index, from);
    }

    function onSubmitForm(data) {
      modal.show = false;
      onRefresh();
    }

    return {
      Meta,
      modal,
      controls,
      table,
      refTable,
      EllipsisHorizontal,
      getRowActions,
      handleAction,
      action,
      onDeleted,
      onRestored,
      onRowClicked,
      onSubmitForm,
    };
  },
});
</script>
