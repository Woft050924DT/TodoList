<template>
  <aside
    class="w-48 shrink-0 bg-white flex flex-col py-5 px-3 gap-4 border-r border-gray-100"
  >
    <div class="flex items-center gap-2 px-2 mb-1">
      <div
        class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <polyline points="3 6 4 7 6 5" />
          <polyline points="3 12 4 13 6 11" />
          <polyline points="3 18 4 19 6 17" />
        </svg>
      </div>
      <div>
        <div class="text-sm font-bold text-gray-800 leading-tight">TodoApp</div>
        <div class="text-[10px] text-gray-400 leading-tight">
          Quản lý công việc
        </div>
      </div>
    </div>

    <div class="bg-violet-600 rounded-xl p-3 text-white">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium opacity-90">Tiến độ hôm nay</span>
        <span class="text-xs font-bold bg-white/20 px-1.5 py-0.5 rounded-full"
          >{{ stats.pct }}%</span
        >
      </div>
      <div class="w-full bg-white/25 rounded-full h-1.5 mb-3">
        <div
          class="bg-white rounded-full h-1.5 transition-all duration-500"
          :style="`width:${stats.pct}%`"
        ></div>
      </div>
      <div class="flex justify-between text-center">
        <div>
          <div class="text-base font-bold">{{ stats.done }}</div>
          <div class="text-[10px] opacity-75">Đã xong</div>
        </div>
        <div>
          <div class="text-base font-bold">{{ stats.remaining }}</div>
          <div class="text-[10px] opacity-75">Còn lại</div>
        </div>
        <div>
          <div class="text-base font-bold">{{ stats.overdue }}</div>
          <div class="text-[10px] opacity-75">Quá hạn</div>
        </div>
      </div>
    </div>

    <div>
      <div
        class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-2"
      >
        Danh mục
      </div>
      <nav class="flex flex-col gap-0.5">
        <button
          v-for="cat in categories"
          :key="cat.name"
          @click="store.activeCategory = cat.name"
          class="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-all"
          :class="
            store.activeCategory === cat.name
              ? 'bg-violet-50 text-violet-700'
              : 'text-gray-600 hover:bg-gray-50'
          "
        >
          <span class="flex-1 text-left">{{ cat.name }}</span>
          <span
            class="text-xs font-semibold px-1.5 py-0.5 rounded-full"
            :class="
              store.activeCategory === cat.name
                ? 'bg-violet-100 text-violet-700'
                : 'bg-gray-100 text-gray-500'
            "
          >
            {{ store.categoryCounts[cat.name] || 0 }}
          </span>
        </button>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTodoStore } from "../../store/todoStore";
import { useCategoryStore } from "../../store/categoryStore";

const store = useTodoStore();
const categoryStore = useCategoryStore();
const stats = computed(() => store.todayStats);

const categories = computed(() => {
  const allCategories = categoryStore.categoryOptions;
  return allCategories.map((cat: any) => ({
    name: cat.name,
  }));
});
</script>
