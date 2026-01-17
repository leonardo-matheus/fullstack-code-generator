<template>
  <lv-container class="error-page error-403">
    <n-result
      status="403"
      title="403"
      description="Você não tem permissão para acessar esta página."
    >
      <template #footer>
        <lv-btn 
          color="primary" 
          icon="home" 
          label="Voltar ao Início"
          @click="$router.push('/')"
        />
      </template>
    </n-result>
  </lv-container>
</template>

<script>
import { defineComponent } from "vue";
import { NResult } from "naive-ui";

export default defineComponent({
  name: "Error403",
  components: { NResult }
});
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
