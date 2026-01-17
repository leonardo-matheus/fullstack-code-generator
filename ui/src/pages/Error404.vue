<template>
  <lv-container class="error-page error-404">
    <n-result
      status="404"
      title="404"
      description="Oops! A página que você está procurando não existe."
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
  name: "Error404",
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
