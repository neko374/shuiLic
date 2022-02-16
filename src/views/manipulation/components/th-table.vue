<template>
  <div style="height:100%;">
    <div ref="scrollDom" class="list" style="overflow: scroll" @scroll="scroll">
      <div :style="{height:list.length*40+'px'}" />
      <div style="position:absolute;width: 100%" :style="{top:startIndex*40+25+'px'}">
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
        <table style="text-align: center;width:100%;border-collapse: collapse;" border class="mytable">
          <tbody>
            <tr v-for="(item,index) in splitData" :key="index" class="item" style="line-height:40px;" :class="{trbac:index%2==1}">
              <td style="min-width:70px;">{{ index+startIndex+1 }}</td>
              <td style="min-width:200px;">{{ item.time }}</td>
              <template v-for="(ite,index) in listTitle">
                <td v-if="!ite.disable&&!ite.disablel" :key="'1w2'+index" :style="{minWidth:hengwidth+'px',maxWidth:'200px'}">
                  <div class="popup">{{ item[ite.prop] | unitfilter(ite.label) }}
                    <div><span>{{ item[ite.prop] | unitfilter(ite.label) }}</span></div>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
const hengwidth = 200
export default {
  filters: {
    unitfilter(val, unit) {
      let valunit = ''
      if (/ID|编号|组号$/.test(unit)) {
        return Number(val)
      }
      if (/温度/.test(unit)) {
        valunit = '℃'
      } else if (/电压/.test(unit)) {
        valunit = 'V'
      } else if (/电流/.test(unit)) {
        valunit = 'A'
      } else if (/SOC|SOH/.test(unit)) {
        valunit = '%'
      } else if (/湿度/.test(unit)) {
        valunit = '%RH'
      } else if (/电量/.test(unit)) {
        valunit = 'kWh'
      } else if (/功率因数/.test(unit)) {
        valunit = ''
      } else if (/_有功功率/.test(unit)) {
        valunit = 'MW'
      }else if (/_无功功率/.test(unit)) {
        valunit = 'Mvar'
      } else if (/功率/.test(unit)) {
        valunit = 'kW'
      } else if (/效率/.test(unit)) {
        valunit = '%'
      }
      if (valunit == '' || val == undefined || val == '') { return val } else { return val + ' ' + valunit }
    }
  },
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
      return 25
    },
    limitCountLeft() {
      const width = 1920
      return 1920 / hengwidth + 2
    },
    splitData() {
      let list = this.list
      list = list.slice(this.startIndex, this.startIndex + this.limitCount)
      // this.listTitle.forEach((value,index)=>{
      //   if(!((index+1)>=this.startIndexLeft&&(index+1)<=this.startIndexLeft+this.limitCountLeft)) {
      //     this.$set(value,'disablel',true)
      //   } else {
      //     this.$set(value,'disablel',false)
      //   }
      // })
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
      // let scrollLeft = this.$refs.scrollDom.scrollLeft;
      // this.scrollLeft = scrollLeft
      // this.startIndexLeft = Math.floor(scrollLeft / hengwidth);
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
    }
    .popup{
      // display: inline-block;
      // width:90px;
      word-break: keep-all;
      overflow: hidden;
      text-overflow: ellipsis;
      // position:relative;
    }
    .popup div{
      display:none;
      background-color:#F1867C;
      position:absolute;
      border: 1px solid;
      padding:4px;
      width:217px;
      white-space:normal;
      text-align:left;
      margin-left:-27px;
      word-break: normal;
    }
    // .popup:hover div{display:block;}
</style>
