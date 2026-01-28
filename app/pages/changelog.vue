<script setup>
import { releases, getVersionBadgeColor } from '~/data/changelog'

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'سجل التحديثات - Project Template Wizard',
  description: 'تتبع التحديثات والميزات الجديدة في معالج مواصفات المشروع'
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
    <div class="text-center space-y-3">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        سجل التحديثات
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        تتبع التحديثات والميزات الجديدة في المشروع
      </p>
    </div>

    <div class="space-y-6">
      <UCard v-for="release in releases" :key="release.version">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UBadge :color="getVersionBadgeColor(release.type)" size="lg">
                v{{ release.version }}
              </UBadge>
              <span class="text-sm text-gray-500">{{ release.date }}</span>
            </div>
            <UBadge
              v-if="release.type === 'feature'"
              color="primary"
              variant="subtle"
            >
              ميزات جديدة
            </UBadge>
            <UBadge
              v-else-if="release.type === 'fix'"
              color="warning"
              variant="subtle"
            >
              إصلاحات
            </UBadge>
            <UBadge
              v-else
              color="success"
              variant="subtle"
            >
              إصدار رئيسي
            </UBadge>
          </div>
        </template>

        <ul class="space-y-2">
          <li
            v-for="(change, index) in release.changes"
            :key="index"
            class="flex items-start gap-2"
          >
            <UIcon
              name="i-lucide-check-circle"
              class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
            />
            <span class="text-gray-700 dark:text-gray-300">{{ change }}</span>
          </li>
        </ul>
      </UCard>
    </div>

    <div class="text-center">
      <UButton
        to="/"
        variant="ghost"
        icon="i-lucide-arrow-right"
        label="العودة للرئيسية"
      />
    </div>
  </div>
</template>
