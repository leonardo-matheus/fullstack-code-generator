<template>
  <div class="user-detail" v-if="Meta.permission.read">
    <!-- Header -->
    <lv-header-page
      v-if="!fromModal"
      :title="Meta.name"
      :subtitle="$Handler.keyLabelDisplay(dataModel, Meta.keyLabel)"
      :breadcrumb="[
        { label: 'Home', to: '/' },
        { label: Meta.name, to: { name: Meta.module } },
        { label: 'Detalhes' }
      ]"
      showBack
      :backTo="{ name: Meta.module }"
    >
      <template #actions>
        <n-dropdown
          v-if="!loading && Meta.permission.update"
          trigger="click"
          :options="actionOptions"
          @select="handleActionSelect"
        >
          <lv-btn icon="ellipsis-horizontal" label="Ações" />
        </n-dropdown>
      </template>
    </lv-header-page>

    <!-- Content -->
    <lv-loading v-if="loading" />
    
    <n-card v-if="!loading" :bordered="false">
      <n-grid :cols="12" :x-gap="24" :y-gap="16" responsive="screen" item-responsive>
        <!-- Avatar Column -->
        <n-grid-item span="12 m:3">
          <div class="avatar-container">
            <n-avatar
              round
              :size="180"
              :src="dataModel.picture"
              :fallback-src="''"
            >
              <n-icon :size="80" :component="PersonOutline" />
            </n-avatar>
          </div>
        </n-grid-item>
        
        <!-- Info Column -->
        <n-grid-item span="12 m:9">
          <n-descriptions label-placement="top" :column="2" bordered>
            <n-descriptions-item label="Nome">
              <n-text strong>{{ dataModel.name }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item label="Username">
              {{ dataModel.username }}
            </n-descriptions-item>
            <n-descriptions-item label="Email">
              {{ dataModel.email }}
            </n-descriptions-item>
            <n-descriptions-item label="Status">
              <n-tag :type="dataModel.is_ban ? 'error' : 'success'" size="small">
                {{ dataModel.is_ban ? 'Banido' : 'Ativo' }}
              </n-tag>
            </n-descriptions-item>
          </n-descriptions>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- Edit Modal -->
    <lv-modal
      v-model:show="modal.show"
      title="Editar Usuário"
      :width="600"
    >
      <Form
        v-if="modal.target === 'form'"
        :data="modal.data"
        :onSubmit="onFormSubmit"
        @close="modal.show = false"
      />
    </lv-modal>
  </div>
</template>

<script>
import { ref, reactive, computed, onBeforeMount, defineComponent, h } from "vue";
import { 
  NCard, NGrid, NGridItem, NAvatar, NDescriptions, NDescriptionsItem, 
  NText, NTag, NIcon, NDropdown 
} from "naive-ui";
import { PersonOutline, Pencil } from "@vicons/ionicons5";
import useServices from "./../../composables/Services";
import { useRoute } from "vue-router";
import Meta from "./meta";
import Form from "./form";

export default defineComponent({
  name: Meta.moduleName + "Detail",
  components: {
    Form,
    NCard,
    NGrid,
    NGridItem,
    NAvatar,
    NDescriptions,
    NDescriptionsItem,
    NText,
    NTag,
    NIcon,
    NDropdown,
  },
  emits: ['close'],
  props: {
    data: {
      type: Object,
      default: null,
    },
    disableMeta: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { Config, Handler, Helper, Api, GlobalStore, SetMetaPage } =
      useServices();
    const route = useRoute();

    // Properties
    const modal = reactive(Handler.modalConfig());
    const loading = ref(false);
    const dataModel = ref(Meta.model);
    const topMenu = [{ name: "Refresh", event: onRefresh }];
    const viewList = ref([]);

    const actionOptions = computed(() => {
      const options = [];
      if (Meta.permission.update) {
        options.push({
          label: 'Editar',
          key: 'edit',
          icon: () => h(NIcon, { component: Pencil }),
        });
      }
      return options;
    });

    /* LIFECYCLE */
    onBeforeMount(() => {
      if (!Meta.permission.read) Handler._403();
      else {
        if (!fromModal.value) {
          Handler.topMenu(topMenu);
          if (!props.disableMeta) SetMetaPage(`Detalhes ${Meta.name}`);
        }
        onRefresh();
      }
    });

    /* COMPUTED */
    const actionModal = computed(() => {
      return GlobalStore.getActionModal;
    });
    const fromModal = computed(() => {
      return props.data ? props.data : null;
    });

    const id = computed(() => {
      return parseInt(
        fromModal.value && fromModal.value.id
          ? fromModal.value.id
          : Handler.urlParams(route, "id")
      );
    });

    /* METHODS */
    function handleActionSelect(key) {
      if (key === 'edit') {
        action('form', dataModel.value);
      }
    }

    function onRefresh() {
      if (id.value) {
        getData();
      }
    }

    function getData() {
      loading.value = true;
      Api.get(`${Meta.module}/${id.value}`, (status, data, message, full) => {
        loading.value = false;
        if (status === 200 && data) {
          dataModel.value = data;
          viewList.value = Handler.viewList(Meta.model);
        }
      });
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

    function onFormSubmit() {
      modal.show = false;
      onRefresh();
    }

    return {
      Meta,
      loading,
      dataModel,
      viewList,
      modal,
      actionOptions,
      PersonOutline,
      fromModal,
      id,
      onRefresh,
      getData,
      action,
      handleActionSelect,
      onFormSubmit,
    };
  },
});
</script>

<style scoped>
.user-detail {
  width: 100%;
}

.avatar-container {
  display: flex;
  justify-content: center;
  padding: 16px;
}
</style>
