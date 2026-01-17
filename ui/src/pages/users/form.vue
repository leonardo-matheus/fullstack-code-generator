<template>
  <div class="user-form">
    <n-form
      ref="formRef"
      :model="dataModel"
      :rules="rules"
      label-placement="top"
      label-width="auto"
      @submit.prevent="submit"
    >
      <!-- Header (for standalone page) -->
      <lv-header-page
        v-if="!fromModal"
        :title="Meta.name"
        :subtitle="type === 'update' ? 'Editar' : 'Criar'"
        :breadcrumb="[
          { label: 'Home', to: '/' },
          { label: Meta.name, to: { name: Meta.module } },
          { label: type === 'update' ? 'Editar' : 'Criar' }
        ]"
        showBack
        :backTo="{ name: Meta.module }"
      >
        <template #actions>
          <n-space>
            <lv-btn 
              icon="close" 
              label="Cancelar" 
              @click="backToRoot()"
            />
            <lv-btn
              v-if="!loading"
              type="primary"
              icon="checkmark"
              label="Salvar"
              :disabled="disableSubmit"
              :loading="disableSubmit"
              @click="submit"
            />
          </n-space>
        </template>
      </lv-header-page>

      <!-- Content -->
      <lv-loading v-if="loading" />
      
      <n-card v-if="!loading" :bordered="false">
        <n-grid :cols="3" :x-gap="16" :y-gap="8" responsive="screen" item-responsive>
          <n-grid-item span="3 m:1">
            <lv-input
              label="Nome"
              v-model="dataModel.name"
              required
              placeholder="Digite o nome"
            />
          </n-grid-item>
          <n-grid-item span="3 m:1">
            <lv-input
              label="Email"
              v-model="dataModel.email"
              type="email"
              placeholder="Digite o email"
            />
          </n-grid-item>
          <n-grid-item span="3 m:1">
            <lv-input
              label="Senha"
              v-model="dataModel.password"
              type="password"
              placeholder="Digite a senha"
              show-password-on="click"
            />
          </n-grid-item>
        </n-grid>

        <!-- Modal Actions -->
        <template v-if="fromModal" #action>
          <n-space justify="end">
            <lv-btn 
              icon="close" 
              label="Cancelar" 
              @click="$emit('close')"
            />
            <lv-btn
              type="primary"
              icon="checkmark"
              label="Salvar"
              :disabled="disableSubmit"
              :loading="disableSubmit"
              @click="submit"
            />
          </n-space>
        </template>
      </n-card>
    </n-form>
  </div>
</template>

<script>
import { ref, reactive, computed, onBeforeMount, defineComponent } from "vue";
import { NForm, NCard, NGrid, NGridItem, NSpace } from "naive-ui";
import useServices from "./../../composables/Services";
import { useRouter, useRoute } from "vue-router";
import Meta from "./meta";

export default defineComponent({
  name: Meta.moduleName + "Form",
  components: {
    NForm,
    NCard,
    NGrid,
    NGridItem,
    NSpace,
  },
  emits: ['close'],
  props: {
    data: {
      type: Object,
      default: null,
    },
    onSubmit: {
      type: Function,
      default: null,
    },
    disableMeta: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { Config, Handler, Helper, Api, Store, SetMetaPage } = useServices();
    const router = useRouter();
    const route = useRoute();

    // Properties
    const formRef = ref(null);
    const loading = ref(false);
    const disableSubmit = ref(false);
    const dataModel = ref({ ...Meta.model });
    const topMenu = [{ name: "Refresh", event: onRefresh }];
    const select = reactive({});
    
    const rules = {
      name: {
        required: true,
        message: 'Nome é obrigatório',
        trigger: ['blur', 'input']
      },
      email: {
        type: 'email',
        message: 'Email inválido',
        trigger: ['blur', 'input']
      }
    };

    /* LIFECYCLE */
    onBeforeMount(() => {
      if (!Meta.permission[type.value]) Handler._403();
      else {
        if (!fromModal.value) {
          Handler.topMenu(topMenu);
          if (!props.disableMeta) SetMetaPage(`${type.value} ${Meta.name}`);
        }
        onRefresh();
        resetModel();
      }
    });

    /* COMPUTED */
    const fromModal = computed(() => {
      return props.data ? props.data : null;
    });
    const id = computed(() => {
      return fromModal.value && fromModal.value.id
        ? fromModal.value.id
        : Handler.urlParams(route, "id", true);
    });
    const type = computed(() => {
      return id.value ? "update" : "create";
    });

    /* METHODS */
    function onRefresh() {
      if (id.value) getData();
    }

    function backToRoot(data) {
      if (!fromModal.value) {
        if (data) router.push({ name: `${Meta.module}-detail`, params: data });
        else router.push({ name: Meta.module });
      } else {
        emit('close');
      }
    }

    function resetModel() {
      Object.assign(dataModel.value, Meta.model);
    }

    function validateSubmit() {
      return true;
    }

    function submit() {
      if (validateSubmit()) {
        disableSubmit.value = true;
        if (dataModel.value.id !== null) update();
        else save();
      }
    }

    const callback = (status, data, message) => {
      Helper.loadingOverlay(false);
      callbackFunc(data);
      if (status === 200) {
        Helper.showSuccess("Sucesso", message);
        backToRoot(data);
      } else disableSubmit.value = false;
    };

    function save() {
      Helper.loadingOverlay(true, "Salvando...");
      Api.post(Meta.module, dataModel.value, callback);
    }

    function update() {
      Helper.loadingOverlay(true, "Atualizando...");
      Api.put(
        `${Meta.module}/${dataModel.value.id}`,
        dataModel.value,
        callback
      );
    }

    function getData() {
      loading.value = true;
      Api.get(`${Meta.module}/${id.value}`, (status, data, message, full) => {
        loading.value = false;
        if (status === 200 && data) {
          dataModel.value = data;
        }
      });
    }

    function callbackFunc(data) {
      if (props.onSubmit) props.onSubmit(data);
    }

    return {
      Meta,
      formRef,
      loading,
      disableSubmit,
      dataModel,
      select,
      rules,
      type,
      fromModal,
      id,
      onRefresh,
      getData,
      submit,
      backToRoot,
    };
  },
});
</script>

<style scoped>
.user-form {
  width: 100%;
  min-width: 500px;
}
</style>
