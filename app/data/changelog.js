export const releases = [
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
