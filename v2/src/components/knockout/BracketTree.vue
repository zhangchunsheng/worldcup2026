<template>
  <div class="flex items-center" :class="{ 'flex-row-reverse': reverse }">
    <!-- Children -->
    <div v-if="node.children?.length" class="flex flex-col justify-around">
      <BracketTree v-for="(child, i) in node.children" :key="child.match.id"
        :node="child"
        :resolve-team="resolveTeam"
        :reverse="reverse"
        @open-detail="$emit('openDetail', $event)"
      />
    </div>

    <!-- Connector lines -->
    <div v-if="node.children?.length" class="connector relative flex-shrink-0 mx-2"
       :style="{ height: connectorHeight }"
    >
      <div class="absolute left-0 w-1/2 h-px bg-gold/30"
           :style="{ top: node.children.length > 1 ? '25%' : '50%' }"></div>
      <div v-if="node.children.length > 1"
           class="absolute left-0 w-1/2 h-px bg-gold/30"
           style="top: 75%"></div>

      <div v-if="node.children.length > 1"
           class="absolute left-1/2 top-1/4 bottom-1/4 w-px bg-gold/30"></div>

      <div class="absolute right-0 top-1/2 w-1/2 h-px bg-gold/30"
           :style="{ top: node.children.length > 1 ? '50%' : '50%' }"></div>
    </div>

    <!-- Match card -->
    <div class="relative">
      <!-- Entry line from parent (only if this node has a parent connector expectation) -->
      <div v-if="showEntryLine"
           class="absolute top-1/2 h-px bg-gold/30"
           :class="reverse ? 'left-full w-3' : 'right-full w-3'"></div>

      <BracketMatch :match="node.match"
        :resolve-team="resolveTeam"
        @open-detail="$emit('openDetail', node.match)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BracketMatch from './BracketMatch.vue'

const props = defineProps({
  node: { type: Object, required: true },
  resolveTeam: { type: Function, required: true },
  reverse: { type: Boolean, default: false },
  showEntryLine: { type: Boolean, default: false },
})

defineEmits(['openDetail'])

const connectorHeight = computed(() => {
  const count = props.node.children?.length || 0
  return count > 1 ? '100%' : '0px'
})
</script>

<style scoped>
.connector {
  width: 1rem;
}
</style>
