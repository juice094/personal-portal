---
title: Vue 3 Composition API 实践总结
description: 在教务系统前端重构过程中积累的 Composition API 使用经验，涵盖响应式原理、逻辑复用模式以及与 Options API 的对比分析。
date: '2026-04-20'
category: article
tags:
  - Vue 3
  - TypeScript
  - 前端
published: true
---

# Vue 3 Composition API 实践总结

## 背景

在教务系统前端重构过程中，我们将整个项目从 Vue 2 + Options API 迁移到了 Vue 3 + Composition API。这篇文章记录了迁移过程中的关键决策和踩坑经验。

## 为什么选 Composition API

### 逻辑复用

Options API 中，相关逻辑分散在 `data`、`computed`、`methods`、`watch` 中。Composition API 允许我们将相关逻辑组织在一起：

```ts
// composables/useSchedule.ts
import { ref, computed } from 'vue'
import type { CourseItem } from '@/types/content'

export function useSchedule() {
  const courses = ref<CourseItem[]>([])
  const maxSlots = ref(12)

  const todayCourses = computed(() => {
    const today = new Date().getDay() || 7
    return courses.value.filter(c => c.day === today)
  })

  function addCourse(course: Omit<CourseItem, 'id'>) {
    courses.value.push({ ...course, id: `course-${Date.now()}` })
  }

  return { courses, maxSlots, todayCourses, addCourse }
}
```

### TypeScript 友好

Composition API 与 TypeScript 的类型推断配合更自然，无需复杂的类型注解：

```ts
const count = ref(0)           // Ref<number>
const user = reactive({        // { name: string, age: number }
  name: 'Alice',
  age: 25
})
```

## 关键模式

### 1. 状态管理：Pinia + Composition API

```ts
// stores/portal.ts
import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'

export const usePortalStore = defineStore('portal', () => {
  const _config = ref<PortalConfig>(loadConfig())
  const config = readonly(_config)

  const enabledSections = computed(() =>
    _config.value.sections
      .filter(s => s.enabled)
      .sort((a, b) => a.order - b.order)
  )

  function toggleSection(id: string) {
    const section = _config.value.sections.find(s => s.id === id)
    if (section) {
      section.enabled = !section.enabled
      saveConfig(_config.value)
    }
  }

  return { config, enabledSections, toggleSection }
})
```

### 2. 生命周期管理

在 Composition API 中，生命周期钩子需要显式导入：

```ts
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

### 3. 响应式陷阱

- `reactive()` 不能直接替换整个对象
- `ref()` 需要 `.value` 访问
- 解构响应式对象会丢失响应性，需使用 `toRefs()`

## 性能优化

| 技术 | 应用场景 | 效果 |
|------|---------|------|
| `shallowRef` | 大型对象（如 Canvas 上下文） | 避免深层监听开销 |
| `computed` + `readonly` | Store 导出 | 防止外部直接修改 |
| `markRaw` | 第三方库实例 | 跳过响应式转换 |

## 迁移经验

1. **不要一次性迁移**：先在新组件中使用 Composition API，逐步替换旧组件
2. **保留 Options API 组件**：Vue 3 支持混用，无需强制迁移
3. **提取 composables**：将可复用逻辑提取到 `composables/` 目录

## 总结

Composition API 不是银弹，但在中大型项目中，它的逻辑组织能力和 TypeScript 支持确实带来了显著的维护性提升。
