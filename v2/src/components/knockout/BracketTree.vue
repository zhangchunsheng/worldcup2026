<template>
  <div class="flex flex-col items-center">
    <!-- Children row -->
    <div v-if="node.children?.length" class="flex justify-around w-full">
      <BracketTree v-for="(child, i) in node.children" :key="child.match.id"
        :node="child"
        :resolve-team="resolveTeam"
        @open-detail="$emit('openDetail', $event)"
      />
    </div>

    <!-- Connector lines from children to this match -->
    <div v-if="node.children?.length" class="connector relative w-full h-8"
    >
      <div class="absolute top-0 bottom-1/2 w-px bg-gold/30"
           :style="{ left: '25%' }"></div>
      <div class="absolute top-0 bottom-1/2 w-px bg-gold/30"
           :style="{ left: '75%' }"></div>
      <div class="absolute top-1/2 left-1/4 right-1/4 h-px bg-gold/30"></div>
      <div class="absolute top-1/2 bottom-0 left-1/2 w-px bg-gold/30"></div>
    </div>

    <!-- Match card -->
    <BracketMatch :match="node.match"
      :resolve-team="resolveTeam"
      @open-detail="$emit('openDetail', node.match)"
    />
  </div>
</template>

<script setup>
import BracketMatch from './BracketMatch.vue'

defineProps({
  node: { type: Object, required: true },
  resolveTeam: { type: Function, required: true },
})

defineEmits(['openDetail'])
</script>

<style scoped>
.connector {
  max-width: 100%;
}
</style>
