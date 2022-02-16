<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    var { icon, title } = context.props
    const vnodes = []
    icon = 'iconfont ' + icon

    if (icon) {
      vnodes.push(<span style='visibility: visible;width:auto;height:auto;font-size:16px;' class={icon}></span>)
    }

    if (title) {
      vnodes.push(<span slot='title' style='font-size:16px;'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
