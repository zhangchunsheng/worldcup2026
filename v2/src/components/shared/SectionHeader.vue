<template>
  <div class="text-center mb-14">
    <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3">
      <slot />
    </h2>
    <p v-if="description" class="text-text-secondary text-lg max-w-xl mx-auto">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  description: { type: String, default: '' },
})
</script>
