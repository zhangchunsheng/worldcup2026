<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div class="relative w-full max-w-md bg-bg-card border border-border rounded-card shadow-card">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 class="font-bold text-lg">⚙️ {{ t('settings.title') }}</h3>
          <button @click="$emit('close')" class="text-text-muted hover:text-text-primary text-xl transition-colors">✕</button>
        </div>

        <div class="p-6 space-y-4">
          <!-- Base URL -->
          <div>
            <label class="block text-sm font-medium mb-1.5 text-text-secondary">{{ t('settings.baseUrl') }}</label>
            <input v-model="form.baseUrl" type="text" placeholder="https://api.luomor.com"
                   class="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-border text-text-primary text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>

          <!-- API Key -->
          <div>
            <label class="block text-sm font-medium mb-1.5 text-text-secondary">{{ t('settings.apiKey') }}</label>
            <input v-model="form.apiKey" type="password" placeholder="sk-ant-api03-..."
                   class="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-border text-text-primary text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>

          <!-- Model -->
          <div>
            <label class="block text-sm font-medium mb-1.5 text-text-secondary">{{ t('settings.model') }}</label>
            <input v-model="form.model" type="text" placeholder="claude-sonnet-4-6"
                   class="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-border text-text-primary text-sm focus:outline-none focus:border-gold transition-colors" />
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button @click="handleSave"
                    class="flex-1 px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-gold to-gold-light text-bg-primary transition-all hover:shadow-lg hover:shadow-gold/20">
              {{ t('settings.save') }}
            </button>
            <button @click="$emit('close')"
                    class="px-4 py-2 rounded-lg font-semibold text-sm border border-border text-text-secondary hover:bg-white/5 transition-all">
              {{ t('settings.cancel') }}
            </button>
          </div>

          <p v-if="saved" class="text-green-400 text-xs text-center">{{ t('settings.saved') }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: { type: Boolean, default: false },
  baseUrl: { type: String, default: '' },
  apiKey: { type: String, default: '' },
  model: { type: String, default: '' },
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  baseUrl: props.baseUrl,
  apiKey: props.apiKey,
  model: props.model,
})

const saved = ref(false)

// Sync form when props change
watch(() => props.baseUrl, v => { form.value.baseUrl = v })
watch(() => props.apiKey, v => { form.value.apiKey = v })
watch(() => props.model, v => { form.value.model = v })

function handleSave() {
  emit('save', { ...form.value })
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}
</script>
