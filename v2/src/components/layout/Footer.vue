<template>
  <footer class="text-center py-10 border-t border-border text-text-muted text-sm">
    <p>{{ t('footer.disclaimer') }}</p>
    <p class="mt-2">{{ t('footer.copyright') }}</p>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
