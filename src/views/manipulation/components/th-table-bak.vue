<template>
  <div style="height:100%;">
    <div ref="scrollDom" class="list" style="overflow: scroll" @scroll="scroll">
      <div :style="{height:list.length*40+'px',width:(listTitle.length+2)*hengwidth + 'px'}" />
      <div style="position:absolute;width: 100%" :style="{top:startIndex*40+25+'px',left:startIndexLeft*hengwidth+'px'}">
        <table style="text-align: center;width:100%;position:absolute;border-collapse: collapse;" :style="{top:(scrollTop-startIndex*40-25)+'px'}" border>
          <tbody>
            <tr class="item trbac" style="line-height:20px;height:25px;">
              <td style="min-width:70px;">序号</td>
              <td style="min-width:200px;">时间</td>
              <template v-for="(ite,index) in listTitle">
                <td v-if="!ite.disable&&!ite.disablel" :key="'1w2'+index" :style="{minWidth:hengwidth+'px'}" v-html="ite.label" />
              </template>
            </tr>
          </tbody>
        </table>
        <table style="text-align: center;width:100%;border-collapse: collapse;" border>
          <tbody>
            <tr v-for="(item,index) in splitData" :key="index" class="item" style="line-height:40px;" :class="{trbac:index%2==1}">
              <td style="min-width:70px;">{{ index+startIndex+1 }}</td>
              <td style="min-width:200px;">{{ item.time }}</td>
              <template v-for="(ite,index) in listTitle">
                <td v-if="!ite.disable&&!ite.disablel" :key="'1w2'+index" :style="{minWidth:hengwidth+'px'}" v-html="item[ite.prop]" />
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
const hengwidth = 300
export default {
  props: ['data', 'dataTitle'],
  data() {
    return {
      hengwidth: hengwidth,
      scrollTop: 0,
      scrollLeft: 0,
      startIndex: 0,
      list: this.data,
      startIndexLeft: 0,
      listTitle: this.dataTitle.reduce((pre, cur) => { if (!cur.disable) pre.push(cur); return pre }, [])
    }
  },
  computed: {
    limitCount() {
      const height = 400
      return height / 40 + 2
    },
    limitCountLeft() {
      const width = 1920
      return 1920 / hengwidth + 2
    },
    splitData() {
      let list = this.list
      list = list.slice(this.startIndex, this.startIndex + this.limitCount)
      this.listTitle.forEach((value, index) => {
        if (!((index + 1) >= this.startIndexLeft && (index + 1) <= this.startIndexLeft + this.limitCountLeft)) {
          this.$set(value, 'disablel', true)
        } else {
          this.$set(value, 'disablel', false)
        }
      })
      return list
    }
  },
  watch: {
    data: {
      handler(val) {
        this.list = val
      },
      deep: true
    },
    dataTitle: {
      handler(val) {
        this.listTitle = val.reduce((pre, cur) => { if (!cur.disable) pre.push(cur); return pre }, [])
      },
      deep: true
    }
  },
  created() {
  },
  methods: {
    scroll() {
      // 根据滚动的距离，估算出这个滚动位置对应的数组序列，例如滚动100px，每条40px，对应第3条
      const scrollTop = this.$refs.scrollDom.scrollTop
      this.scrollTop = scrollTop
      this.startIndex = Math.floor(scrollTop / 40)
      const scrollLeft = this.$refs.scrollDom.scrollLeft
      this.scrollLeft = scrollLeft
      this.startIndexLeft = Math.floor(scrollLeft / hengwidth)
    }
  }
}
</script>
<style scoped lang="less">
    .list {
        // height:300px;
        height:100%;
        position: relative;

        .item {
            // display: flex;
            height: 40px;

            // > * {
            //     flex-grow: 1;
            //     // border: solid 1px #9e9e9e;
            //     // padding: 3px;
            // }
        }
    }
    .trbac{
      background:#efedfb;
    }
    .mytable tr td {
      /* for IE */
      text-overflow: ellipsis;
      /* for Firefox,mozilla */
      -moz-text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-align: left
    }
</style>
