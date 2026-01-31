<script setup>
const { state, updateNestedField } = useWizardState()

const capabilities = [
  { key: 'fileSystemAccess', label: 'الوصول لنظام الملفات', description: 'قراءة وكتابة الملفات على جهاز المستخدم', icon: 'i-lucide-folder-open' },
  { key: 'microphone', label: 'الميكروفون', description: 'الوصول لتسجيل الصوت', icon: 'i-lucide-mic' },
  { key: 'camera', label: 'الكاميرا', description: 'الوصول للكاميرا والتصوير', icon: 'i-lucide-camera' },
  { key: 'globalShortcuts', label: 'اختصارات لوحة المفاتيح', description: 'اختصارات عامة تعمل من أي مكان', icon: 'i-lucide-keyboard' },
  { key: 'backgroundExecution', label: 'العمل في الخلفية', description: 'تشغيل العمليات في الخلفية', icon: 'i-lucide-play-circle' },
  { key: 'autoStart', label: 'التشغيل التلقائي', description: 'بدء التشغيل مع النظام', icon: 'i-lucide-power' }
]
</script>

<template>
  <div class="space-y-6">
    <p class="text-sm text-gray-500">
      حدد إمكانيات سطح المكتب والنظام التي يحتاجها تطبيقك.
      هذه الخيارات اختيارية — تصف ما يمكن للتطبيق فعله، وليس ما يجب أن يفعله.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UCard
        v-for="cap in capabilities"
        :key="cap.key"
        class="cursor-pointer transition-all"
        :class="state.desktopSystemCapabilities[cap.key] ? 'ring-2 ring-primary shadow-md' : 'hover:ring-1 hover:ring-gray-300'"
        :ui="{ body: 'p-4' }"
        @click="updateNestedField('desktopSystemCapabilities', cap.key, !state.desktopSystemCapabilities[cap.key])"
      >
        <div class="flex items-start gap-3">
          <div class="flex items-center gap-3 flex-1">
            <UIcon
              :name="cap.icon"
              class="text-xl shrink-0"
              :class="state.desktopSystemCapabilities[cap.key] ? 'text-primary' : 'text-gray-400'"
            />
            <div>
              <div class="font-medium text-sm">
                {{ cap.label }}
              </div>
              <div class="text-xs text-gray-500">
                {{ cap.description }}
              </div>
            </div>
          </div>
          <USwitch
            :model-value="state.desktopSystemCapabilities[cap.key]"
            @update:model-value="updateNestedField('desktopSystemCapabilities', cap.key, $event)"
            @click.stop
          />
        </div>
      </UCard>
    </div>
  </div>
</template>
