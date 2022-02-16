<template>
  <table class="tableA" border="0" cellspacing="0">
    <tr><td colspan="4" style="color:#fff;text-align:center;" :style="{height:titleHeight,background:titleColor}">{{ title }}</td></tr>
    <tr v-for="(item,index) in value" :key="'alarm'+index">
      <td>
        <div class="iconfont icon-dian_blue td1" :style="{color:(item.color || '#19E659')}" />
        <span class="td2">{{ item.name }}</span>
      </td>
      <td>
        <div class="iconfont icon-dian_blue td1" :style="{color:(value1[index].color || '#19E659')}" />
        <span class="td2">{{ value1[index].name }}</span>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    value1: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    titleHeight: {
      type: String,
      default: ''
    },
    titleColor: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped>
.tableA {
  width:38%;
  height:100%;
  margin-top:10px;
}
    .tableA tr:nth-child(2n){
        background:#EFF3FB;
    }
    .td1{
      width:70px;
      padding-left:20px;
      font-size:20px;
      float:left;
    }
    .td2{
      font-size:16px;
      color:black;
    }
    @media screen and (max-width:1200px){
      .td1{
        width:45px;
        padding-left:10px;
        font-size:20px;
      }
      .td2{
        font-size:14px;
      }
    }
</style>
