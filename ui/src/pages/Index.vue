<template>
  <lv-container class="index-page">
    <div class="welcome-content">
      <div class="logo-wrapper">
        <img :src="$Config.appLogo()" class="logo" alt="Lavarel Logo" />
      </div>
      
      <n-space vertical align="center" :size="24">
        <div class="welcome-text">
          <n-gradient-text type="primary" :size="42">
            Bem vindo ao Lavarel!
          </n-gradient-text>
          <p class="subtitle">Bora codar uns módulos?</p>
        </div>
        
        <n-space :size="16" wrap justify="center">
          <lv-btn
            color="warning"
            icon="grid"
            label="Ver Componentes"
            @click="$router.push('/example')"
          />
          <lv-btn
            color="primary"
            icon="create"
            label="Criar Módulo"
            @click="$router.push('/generator')"
          />
          <lv-btn
            color="success"
            icon="document-text"
            label="Documentação"
            @click="openDocs"
          />
        </n-space>

        <n-divider />

        <n-space vertical align="center" :size="16">
          <n-text depth="3">Estatísticas Rápidas</n-text>
          <n-space :size="24" wrap justify="center">
            <n-statistic label="Módulos" :value="stats.modules">
              <template #prefix>
                <n-icon :component="AppsOutline" />
              </template>
            </n-statistic>
            <n-statistic label="Usuários" :value="stats.users">
              <template #prefix>
                <n-icon :component="PeopleOutline" />
              </template>
            </n-statistic>
            <n-statistic label="Permissões" :value="stats.permissions">
              <template #prefix>
                <n-icon :component="ShieldOutline" />
              </template>
            </n-statistic>
          </n-space>
        </n-space>
      </n-space>
    </div>
  </lv-container>
</template>

<script>
import { ref, onMounted, computed, defineComponent, reactive } from "vue";
import { NSpace, NStatistic, NIcon, NText, NDivider, NGradientText } from "naive-ui";
import { AppsOutline, PeopleOutline, ShieldOutline } from "@vicons/ionicons5";
import useServices from "./../composables/Services";

export default defineComponent({
  name: "PageIndex",
  components: {
    NSpace,
    NStatistic,
    NIcon,
    NText,
    NDivider,
    NGradientText
  },
  setup() {
    const { Config, Handler, Helper, SetMetaPage, Api } = useServices();

    const stats = reactive({
      modules: 12,
      users: 48,
      permissions: 156
    });

    onMounted(() => {
      SetMetaPage("Home");
    });

    function openDocs() {
      window.open("https://Lavarel-doc.sopeus.com", "_blank");
    }

    function onRefresh() {
      //
    }

    return {
      onRefresh,
      openDocs,
      stats,
      AppsOutline,
      PeopleOutline,
      ShieldOutline
    };
  },
});
</script>

<style scoped>
.index-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
}

.welcome-content {
  text-align: center;
  max-width: 800px;
  padding: 48px 24px;
}

.logo-wrapper {
  margin-bottom: 32px;
}

.logo {
  width: 280px;
  max-width: 80%;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.welcome-text {
  margin-bottom: 16px;
}

.subtitle {
  font-size: 18px;
  color: var(--lv-text-secondary);
  margin-top: 8px;
}
</style>
