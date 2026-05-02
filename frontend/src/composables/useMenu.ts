import { ref } from 'vue'

export function useMenu() {
    const items = ref([])
    async function loadMenu() {}
    return { items, loadMenu }
}