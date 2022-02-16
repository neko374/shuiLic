<template>
  <div style="width:100%;height:100%;">
    <!-- <iframe src="http://47.103.79.116:8080/hbmanage" frameborder="0" style="width:100%;height:100%;"></iframe> -->
  </div>
</template>

<script>
export default {
  created() {
    window.open('_blank').location = 'http://47.103.79.116:8080/hbmanage'
  }
}
</script>
