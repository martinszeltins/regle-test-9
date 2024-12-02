<template>
    <ul class="text-xs text-red-700">
        <li v-for="error of props.errors" :key='error'>
            {{ error }}
        </li>
    </ul>
</template>

<script setup lang="ts">
    const props = defineProps<{
        errors: any
    }>() 
</script>
