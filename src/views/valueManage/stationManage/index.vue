<template>
  <div style="width:100%;height:100%;">
    <!-- <component :is="device" /> -->
    <desktop />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mobile from './mobile/index'
import desktop from './pc/index'

export default {
  components: { mobile, desktop },
  computed: {
    ...mapGetters([
      'device'
    ])
  }
}
</script>
