<template>
  <lv-container class="error-page error-401">
    <n-result
      status="warning"
      title="401"
      description="Você precisa estar autenticado para acessar esta página."
    >
      <template #footer>
        <lv-btn 
          color="primary" 
          icon="log-in" 
          label="Fazer Login"
          @click="$router.push('/login')"
        />
      </template>
    </n-result>
  </lv-container>
</template>

<script>
import { defineComponent } from "vue";
import { NResult } from "naive-ui";

export default defineComponent({
  name: "Error401",
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
