export const releases = [
  {
    version: '1.7.0',
    date: '2026-01-30',
    type: 'feature',
    changes: [
      'إضافة نظام نوع الـ Module مع 5 أنماط جاهزة: قائمة فقط، CRUD عبر Modal، قائمة + نموذج، CRUD كامل، مشاهدة وتعديل معاً',
      'إضافة نوع الترقيم (Pagination) لكل Module: ترقيم من الخادم، ترقيم في الواجهة، بدون ترقيم',
      'توليد تلقائي للصفحات عند اختيار نوع الـ Module مع تأكيد قبل استبدال الصفحات الموجودة',
      'إتاحة إضافة Modules إضافية في وضع القالب (Template mode) مع عرض معلومات القالب في الأعلى',
      'تحويل محاذير التطوير في خطوة الإرشادات إلى Checkboxes مفعّلة افتراضياً مع إمكانية إضافة محاذير مخصصة',
      'تصفية المحاذير المعطلة من الملفات المُولَّدة (project-spec.md, CLAUDE.md)',
      'إضافة migration تلقائي للمشاريع المحفوظة لدعم الحقول الجديدة (moduleType, paginationType, enabled)'
    ]
  },
  {
    version: '1.6.0',
    date: '2026-01-29',
    type: 'feature',
    changes: [
      'نقل اختيار قالب Nuxt UI من خطوة الواجهة إلى خطوة التقنيات كأول سؤال عند وجود واجهة أمامية',
      'إضافة حقل Frontend Port منفصل عن Backend Port في خطوة التقنيات',
      'تحسين حقل اللغة الأساسية - بطاقات اختيار غنية مع معلومات RTL/LTR واتجاه القراءة',
      'إضافة تنبيه @nuxtjs/i18n عند اختيار دعم متعدد اللغات مع Nuxt UI locale',
      'تعزيز تعليمات MCP في CLAUDE.md المُولَّد - قسم BLOCKING REQUIREMENT مع Pre-Code Checklist وجدول مرجعي وأمثلة',
      'إضافة قسم MCP FIRST — NON-NEGOTIABLE في أعلى CLAUDE.md المُولَّد لضمان أعلى دقة'
    ]
  },
  {
    version: '1.5.0',
    date: '2026-01-29',
    type: 'feature',
    changes: [
      'إضافة وضع اختيار قالب Nuxt UI كخيار افتراضي في خطوة الواجهة - اختيار قالب جاهز بدلاً من التصميم اليدوي',
      'دعم 11 قالب Nuxt UI جاهز: Dashboard, SaaS, Landing, Docs, Chat, Editor, Portfolio, Changelog, Starter + قوالب Vue',
      'إضافة وضع التصميم اليدوي كبديل مع الحفاظ على كل الوظائف السابقة (Modules, Pages, Shared Components)',
      'فلترة تلقائية للقوالب حسب الـ Framework المختار (Nuxt أو Vue)',
      'تحديث الملفات المُولَّدة (project-spec.md, CLAUDE.md, Prompt) لذكر القالب المحدد بالاسم',
      'إضافة migration تلقائي للمشاريع المحفوظة مسبقاً للتوافق مع النظام الجديد'
    ]
  },
  {
    version: '1.4.0',
    date: '2025-01-29',
    type: 'feature',
    changes: [
      'إضافة تحذير Monorepo Structure - منع إنشاء الملفات في root مباشرة',
      'تغيير نظام الإصدارات - استخدام Latest بشكل افتراضي مع إمكانية تحديد إصدار محدد',
      'دمج Nuxt 4 و Nuxt 3 في خيار واحد "Nuxt" مع حقل إصدار اختياري',
      'إضافة حقول إصدار اختيارية لكل تقنية في خطوة التقنيات',
      'تحديث جميع الملفات المُولَّدة (CLAUDE.md, Prompt, project-spec.md) لدعم Latest versions',
      'تحديث تعليمات MCP FIRST في الملفات المُولَّدة - استخدام النص الجديد الأوضح',
      'إضافة حقل Server Port في خطوة التقنيات لتحديد منفذ السيرفر'
    ]
  },
  {
    version: '1.3.0',
    date: '2025-01-29',
    type: 'feature',
    changes: [
      'دعم Nuxt UI MCP Template - إنشاء مشروع Nuxt UI بنقرة واحدة عبر /nuxt-ui-remote:setup_project_with_template',
      'إضافة تعليمات PROJECT SETUP التلقائية في CLAUDE.md لمشاريع Nuxt UI',
      'تحديث Prompt و Claude Command لدعم MCP Template كخطوة أولى',
      'حذف README.md من ملف ZIP - يُنشأ بعد اكتمال المشروع الفعلي',
      'إصلاح تحذير Playwright MCP على Windows (cmd /c wrapper)',
      'إضافة ملف تحليل التغييرات (upgrade-analysis.md)'
    ]
  },
  {
    version: '1.2.0',
    date: '2025-01-28',
    type: 'feature',
    changes: [
      'تحسين واجهة المكونات المشتركة (Shared Components) - أصبحت ديناميكية',
      'إضافة 35+ مكون شائع جاهز للإضافة بنقرة واحدة',
      'تصنيف المكونات: التخطيط، عرض البيانات، ردود الفعل، النماذج، التنقل، أدوات مساعدة',
      'إمكانية إضافة مكونات مخصصة',
      'إضافة سريعة حسب التصنيف',
      'إضافة Claude Code Hook للتذكير بتحديث Changelog'
    ]
  },
  {
    version: '1.1.0',
    date: '2025-01-28',
    type: 'feature',
    changes: [
      'إضافة تحميل مجلد ZIP مع ملفات التكوين الكاملة',
      'إضافة اختيار MCP Servers في Technical Step مع اختيار تلقائي',
      'إضافة توليد CLAUDE.md مع تعليمات إجبارية للإصدارات',
      'إضافة Claude Code command (/project) للتنفيذ التلقائي',
      'إضافة نص Prompt جاهز للنسخ في Guidelines',
      'إضافة fix.md لتسجيل المشاكل والحلول',
      'إضافة README.md template في الملفات المُصدَّرة',
      'إضافة .env.example بدون تكرار المتغيرات',
      'إضافة صفحة Changelog لتتبع التحديثات'
    ]
  },
  {
    version: '1.0.0',
    date: '2025-01-15',
    type: 'release',
    changes: [
      'الإصدار الأولي من معالج مواصفات المشروع',
      'دعم 12 خطوة كاملة للتخطيط',
      'تصدير ملف Markdown للمواصفات',
      'حفظ تلقائي في localStorage و MongoDB',
      'دعم RTL للواجهة العربية',
      'دعم أنواع مشاريع متعددة (Fullstack, Frontend, Backend, etc.)'
    ]
  }
]

export const getVersionBadgeColor = (type) => {
  switch (type) {
    case 'feature':
      return 'primary'
    case 'fix':
      return 'warning'
    case 'release':
      return 'success'
    default:
      return 'neutral'
  }
}
