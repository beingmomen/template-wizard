export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    input: {
      slots: {
        root: 'relative inline-flex items-center w-full'
      },
      defaultVariants: {
        size: 'xl'
      }
    },
    textarea: {
      slots: {
        root: 'relative inline-flex items-center w-full'
      },
      defaultVariants: {
        size: 'xl'
      }
    },
    select: {
      slots: {
        base: 'relative group rounded-md inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors w-full'
      },
      defaultVariants: {
        size: 'xl'
      }
    },
    selectMenu: {
      slots: {
        base: 'relative group rounded-md inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors w-full'
      },
      defaultVariants: {
        size: 'xl'
      }
    }
  }
})
