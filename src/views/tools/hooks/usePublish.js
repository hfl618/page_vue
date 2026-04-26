/**
 * @description 资产发布页业务逻辑
 */

export function usePublish() {
  const router = useRouter()
  const uiStore = useUiStore()

  // 表单状态
  const form = reactive({
    label: '',
    slug: '',
    version: 'V1.0.0',
    sortWeight: 100,
    isPublic: true,
    categoryTag: '',
    description: ''
  })

  const slugCustomized = ref(false)
  const iconPreview = ref('')
  const htmlFileName = ref('')
  const htmlContent = ref('')

  // 自动生成 Slug 逻辑
  watch(() => form.label, (newVal) => {
    if (!slugCustomized.value) {
      form.slug = newVal.trim().toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
  })

  /**
   * @description 处理图标改变
   */
  const onIconChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => iconPreview.value = ev.target.result
      reader.readAsDataURL(file)
    }
  }

  /**
   * @description 处理 HTML 改变
   */
  const onHtmlChange = (e) => {
    const file = e.target.files[0]
    if (file && file.name.endsWith('.html')) {
      htmlFileName.value = file.name
      const reader = new FileReader()
      reader.onload = (ev) => htmlContent.value = ev.target.result
      reader.readAsText(file)
    }
  }

  /**
   * @description 执行部署
   */
  const handleDeploy = async () => {
    uiStore.showLoading('DEPLOYING', 'Committing asset to registry...')
    // 模拟 API 请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    uiStore.hideLoading()
    uiStore.addNotice({ 
      title: 'SUCCESS', 
      message: 'Asset deployed to global registry.', 
      type: 'success' 
    })
    router.push('/discover')
  }

  const purgeSession = () => {
    form.label = ''
    form.slug = ''
    htmlContent.value = ''
    htmlFileName.value = ''
    iconPreview.value = ''
  }

  return {
    form,
    slugCustomized,
    iconPreview,
    htmlFileName,
    htmlContent,
    onIconChange,
    onHtmlChange,
    handleDeploy,
    purgeSession
  }
}
