<script setup>
import { ar } from '@nuxt/ui/locale'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    // Google Fonts - Tajawal for Arabic
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap' }
  ],
  htmlAttrs: {
    lang: ar.code,
    dir: ar.dir
  }
})

const title = 'معالج مواصفات المشروع'
const description = 'أداة لإنشاء ملف مواصفات مشروع جاهز للاستخدام مع Claude Code'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp :locale="ar">
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2">
          <UIcon name="i-lucide-file-code-2" class="w-6 h-6 text-primary-500" />
          <span class="font-bold">معالج المواصفات</span>
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          تم إنشاؤه بواسطة Nuxt UI • {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>

<style>
/* Arabic font */
body {
  font-family: 'Tajawal', sans-serif;
}
</style>
