<template>
  <div style="height:100%;">
    <div style="position:fixed;right:0%;top:15%;">
      缩放：<el-input-number :step="0.1" size="mini" style="width: 40%;" v-model="zoom" @change="location(zoom)"></el-input-number>
    </div>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" preserveAspectRatio="none">
      <g transform="translate(-50 0)" id="htmlx">
        <!-- <rect stroke-dasharray="0" height="17%" width="33%" y="425" x="980" rx="20" stroke-width="3.5" stroke="#08D0FE" fill="rgba(0,0,0,0)" /> -->
        <rect stroke-dasharray="5,5" height="84%" width="39%" y="70" x="840" rx="20" stroke-width="3.5" stroke="#08D0FE" fill="rgba(0,0,0,0)" />

        <!-- 内网 -->
        <rect stroke-dasharray="5,5" height="93%" width="30%" y="48" x="105" rx="20" stroke-width="2" stroke="#08D0FE" fill="rgba(0,0,0,0)" />
        <!-- 外网 -->
        <rect stroke-dasharray="5,5" height="93%" width="61%" y="48" x="535" rx="20" stroke-width="2" stroke="#08D0FE" fill="rgba(0,0,0,0)" />
        <!-- 云服务器mqtt -->
        <!-- <rect stroke-dasharray="5,5" height="20%" width="8%" y="280" x="1000" rx="20" stroke-width="3.5" stroke="#08D0FE" fill="rgba(0,0,0,0)" /> -->
        <!-- 正反向隔离 -->
        <!-- <rect stroke-dasharray="5,5" height="10%" width="13%" y="120" x="430" rx="20" stroke-width="3.5" stroke="#08D0FE" fill="rgba(0,0,0,0)" />
        <rect stroke-dasharray="5,5" height="10%" width="13%" y="370" x="430" rx="20" stroke-width="3.5" stroke="#08D0FE" fill="rgba(0,0,0,0)" /> -->
        <!-- 内网控制器 -->
        <rect stroke-dasharray="5,5" height="8%" width="20%" y="580" x="210" rx="20" stroke-width="3.5" stroke="#08D0FE" fill="rgba(0,0,0,0)" />
        <!-- 右侧5个光伏 -->
        <svg class="icon" aria-hidden="true" width="60" x="1300" y="-240">
          <use xlink:href="#icon-guangfu" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1300" y="-120">
          <use xlink:href="#icon-guangfu" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1300" y="0">
          <use xlink:href="#icon-guangfu" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1300" y="120">
          <use xlink:href="#icon-guangfu" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1300" y="240">
          <use xlink:href="#icon-guangfu" color="#0088D2" />
        </svg>
        <!-- 右侧5个逆变器 -->
        <svg class="icon" aria-hidden="true" width="60" x="1200" y="-240">
          <use xlink:href="#icon-nibianqi1" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1200" y="-120">
          <use xlink:href="#icon-nibianqi1" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1200" y="0">
          <use xlink:href="#icon-nibianqi1" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1200" y="120">
          <use xlink:href="#icon-nibianqi1" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1200" y="240">
          <use xlink:href="#icon-nibianqi1" color="#0088D2" />
        </svg>
        <!-- 右侧5个采集器 -->
        <svg class="icon" aria-hidden="true" width="60" x="1100" y="-240">
          <use xlink:href="#icon-kongzhiqi-chanpin_fuzhi-copy" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1100" y="-120">
          <use xlink:href="#icon-kongzhiqi-chanpin_fuzhi-copy" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1100" y="0">
          <use xlink:href="#icon-kongzhiqi-chanpin_fuzhi-copy" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1100" y="120">
          <use xlink:href="#icon-kongzhiqi-chanpin_fuzhi-copy" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="1100" y="240">
          <use xlink:href="#icon-kongzhiqi-chanpin_fuzhi-copy" color="#0088D2" />
        </svg>
        <!-- 云 mqtt-->
        <!-- <svg class="icon" aria-hidden="true" width="80" x="1020" y="-40">
            <use xlink:href="#icon-yunfuwuqi" color="#0088D2"/>
          </svg> -->
        <svg class="icon" aria-hidden="true" width="80" x="880" y="0">
          <use xlink:href="#icon-MQTTgongneng" color="#0088D2" />
        </svg>
        <!-- 无线 -->
        <svg class="icon" aria-hidden="true" width="60" x="720" y="0">
          <use xlink:href="#icon-wuxianWIFI" color="#0088D2" />
        </svg>
        <!-- 外网服务器 -->
        <svg class="icon" aria-hidden="true" width="60" x="640" y="-200">
          <use xlink:href="#icon-server" color="#0088D2" />
        </svg>
        <!-- 中间-隔离 -->
        <svg class="icon" aria-hidden="true" width="140" x="470" y="-200">
          <use xlink:href="#icon-tongxunguanlijibeifen" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="140" x="470" y="50">
          <use xlink:href="#icon-tongxunguanlijibeifen" color="#0088D2" />
        </svg>
        <!-- 内网交换机 -->
        <svg class="icon" aria-hidden="true" width="140" x="380" y="-60">
          <use xlink:href="#icon-jiaohuanji" color="#0088D2" />
        </svg>
        <!-- 外网交换机 -->
        <svg class="icon" aria-hidden="true" width="140" x="540" y="-60">
          <use xlink:href="#icon-jiaohuanji" color="#0088D2" />
        </svg>
        <!-- 远动服务器 -->
        <svg class="icon" aria-hidden="true" width="60" x="130" y="-60">
          <use xlink:href="#icon-server" color="#333" />
        </svg>
        <!-- 内网服务器 -->
        <svg class="icon" aria-hidden="true" width="60" x="370" y="50">
          <use xlink:href="#icon-server" color="#0088D2" />
        </svg>
        <!-- 内网控制器 -->
        <svg class="icon" aria-hidden="true" width="60" x="240" y="160">
          <use xlink:href="#icon-kongzhiqi-chanpin_fuzhi-copy" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="330" y="160">
          <use xlink:href="#icon-kongzhiqi-chanpin_fuzhi-copy" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="420" y="160">
          <use xlink:href="#icon-kongzhiqi-chanpin_fuzhi-copy" color="#0088D2" />
        </svg>
        <!-- 逆变器pcs -->
        <svg class="icon" aria-hidden="true" width="60" x="240" y="240">
          <use xlink:href="#icon-nibianqi" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="330" y="240">
          <use xlink:href="#icon-nibianqi" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="420" y="240">
          <use xlink:href="#icon-nibianqi" color="#0088D2" />
        </svg>
        <!-- 左下-储能 -->
        <svg class="icon" aria-hidden="true" width="60" x="240" y="320">
          <use xlink:href="#icon-chuneng-copy" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="330" y="320">
          <use xlink:href="#icon-chuneng-copy" color="#0088D2" />
        </svg>
        <svg class="icon" aria-hidden="true" width="60" x="420" y="320">
          <use xlink:href="#icon-chuneng-copy" color="#0088D2" />
        </svg>

        <!-- 连线 -->
        <!-- 光伏连云 -->
        <polyline points="1100,220 960,400 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1100,340 970,420 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1100,450 980,450 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1100,560 970,480 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1100,680 960,500 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <!-- 采集器连逆变器 -->
        <polyline points="1160,210 1198,210 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1160,330 1198,330 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1160,450 1198,450 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1160,570 1198,570 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1160,690 1198,690 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <!-- pv连逆变器 -->
        <polyline points="1250,210 1290,210 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1250,330 1290,330 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1250,450 1290,450 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1250,570 1290,570 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <polyline points="1250,690 1290,690 " stroke-dasharray="10,5" fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />

        <!-- 云连无线连服务器 -->
        <polyline points="655,400 655,465 720,465 " stroke-dasharray="10, 5" fill="none" stroke="#00FF99" stroke-width="4" />
        <polyline points="780,465 880,465 " stroke-dasharray="10, 5" fill="none" stroke="#00FF99" stroke-width="4" />

        <!-- 外网交换机连外网服务器 -->
        <polyline points="655,280 655,360 " fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" marker-start="url(#Triangle1)" />
        <!-- 外网交换机连正隔离 -->
        <polyline points="580,270 580,360 " fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" />
        <!-- 外网交换机连反隔离 -->
        <polyline points="580,410 580,490 " fill="none" stroke="#00FF99" stroke-width="4" marker-end="url(#Triangle)" />

        <!-- 内网交换机连反隔离 -->
        <polyline points="492,490 492,420 " fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" />
        <!-- 内网交换机连正隔离 -->
        <polyline points="492,370 492,270 " fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" />
        <!-- 内网交换机连内网服务器 -->
        <polyline points="400,410 400,460 " fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" marker-start="url(#Triangle3)" />
        <!-- 内网服务器连远动 -->
        <polyline points="380,390 200,390 " stroke-dasharray="10,5" fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" marker-start="url(#Triangle3)" />
        <!-- 内网服务器连控制器 -->
        <polyline points="400,530 400,570 " stroke-dasharray="10,5" fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" marker-start="url(#Triangle3)" />

        <!-- 控制器连pcs -->
        <polyline points="270,620 270,660 " stroke-dasharray="10,5" fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" marker-start="url(#Triangle3)" />
        <polyline points="360,620 360,660 " stroke-dasharray="10,5" fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" marker-start="url(#Triangle3)" />
        <polyline points="450,620 450,660 " stroke-dasharray="10,5" fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" marker-start="url(#Triangle3)" />
        <!-- 控制器连pcs -->
        <polyline points="270,710 270,730 " stroke-dasharray="10,5" fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" marker-start="url(#Triangle3)" />
        <polyline points="360,710 360,730 " stroke-dasharray="10,5" fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" marker-start="url(#Triangle3)" />
        <polyline points="450,710 450,730 " stroke-dasharray="10,5" fill="none" stroke="#08D0FE" stroke-width="4" marker-end="url(#Triangle2)" marker-start="url(#Triangle3)" />
        <!-- 内外网间隔线 -->
        <polyline points="530,10 530,970 " stroke-dasharray="10,5" fill="none" stroke="#333" stroke-width="3" />

        <!--圆点  -->
        <!-- 光伏 -->
        <!-- <circle cx="1280" cy="120" r="7" stroke="#808080" stroke-width="2" fill="#08D0FE" />
        <circle cx="1280" cy="240" r="7" stroke="#808080" stroke-width="2" fill="#08D0FE" />
        <circle cx="1280" cy="350" r="7" stroke="#808080" stroke-width="2" fill="#08D0FE" />
        <circle cx="1280" cy="460" r="7" stroke="#808080" stroke-width="2" fill="#08D0FE" />
        <circle cx="1280" cy="580" r="7" stroke="#808080" stroke-width="2" fill="#08D0FE" /> -->
        <!-- 云服务器 -->
        <!-- <circle cx="980" cy="350" r="7" stroke="#808080" stroke-width="2" fill="#08D0FE" /> -->

        <!-- 中间椭圆 -->
        <!-- <polyline points="510,60 625,150 625,390 510,460 400,390 400,150 510,60" stroke-dasharray="10, 5" fill="none" stroke="#08D0FE" stroke-width="4" /> -->
        <!-- 中间连线 -->
        <!-- <polyline points="570,110 685,60" :stroke-dasharray="(dash[num],dash[num])" fill="none" :stroke="colorL[num]" stroke-width="4" />
        <polyline points="570,430 685,460 " fill="none" stroke="#08D0FE" stroke-width="4" /> -->

        <!-- 滚动箭头 -->
        <marker id="TriangleM" viewBox="0 0 20 20" refX="0" refY="10" markerWidth="5" markerHeight="5" orient="auto">
          <animate attributeName="refX" from="180" to="0" dur="2s" repeatCount="indefinite" />
          <path d="M 0 0 L 20 10 L 0 20 z" fill="#08D0FE" />
        </marker>
        <marker id="TriangleS" viewBox="0 0 20 20" refX="0" refY="10" markerWidth="5" markerHeight="5" orient="auto">
          <animate attributeName="refX" from="-180" to="0" dur="2s" repeatCount="indefinite" />
          <path d="M 0 10 L 20 0 L 20 20 z" fill="#08D0FE" />
        </marker>

        <!-- 左侧线框-箭头 -->
        <defs>
          <marker id="Triangle" viewBox="0 0 20 20" refX="0" refY="10" markerWidth="3" markerHeight="3" orient="auto">
            <path d="M 0 0 L 20 10 L 0 20 z" fill="#00FF99" />
          </marker>
          <marker id="Triangle1" viewBox="0 0 20 20" refX="0" refY="10" markerWidth="3" markerHeight="3" orient="auto">
            <path d="M 0 10 L 20 0 L 20 20 z" fill="#00FF99" />
          </marker>
          <marker id="Triangle2" viewBox="0 0 20 20" refX="0" refY="10" markerWidth="3" markerHeight="3" orient="auto">
            <path d="M 0 0 L 20 10 L 0 20 z" fill="#08D0FE" />
          </marker>
          <marker id="Triangle3" viewBox="0 0 20 20" refX="0" refY="10" markerWidth="3" markerHeight="3" orient="auto">
            <path d="M 0 10 L 20 0 L 20 20 z" fill="#08D0FE" />
          </marker>
          <marker id="TriangleS" viewBox="0 0 20 20" refX="0" refY="10" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 10 L 20 0 L 20 20 z" fill="#08D0FE" />
          </marker>
        </defs>

        <!-- 文字描述 -->
        <text x="180" y="40" fill="#333">
          <tspan fill="#08D0FE" />

          <tspan x="450" y="40" style="font-size:20px;color:red;">内网</tspan>
          <tspan x="580" y="40" style="font-size:20px;color:#08D0FE;">外网</tspan>
          <tspan x="1310" y="260">PV阵列一</tspan>
          <tspan x="1310" y="380">PV阵列二</tspan>
          <tspan x="1310" y="500">PV阵列三</tspan>
          <tspan x="1310" y="620">PV阵列四</tspan>
          <tspan x="1310" y="740">PV阵列五</tspan>
          <tspan x="1210" y="260">逆变器</tspan>
          <tspan x="1210" y="380">逆变器</tspan>
          <tspan x="1210" y="500">逆变器</tspan>
          <tspan x="1210" y="620">逆变器</tspan>
          <tspan x="1210" y="740">逆变器</tspan>
          <tspan x="1100" y="260">采集器</tspan>
          <tspan x="1100" y="380">采集器</tspan>
          <tspan x="1100" y="500">采集器</tspan>
          <tspan x="1100" y="620">采集器</tspan>
          <tspan x="1100" y="740">采集器</tspan>

          <tspan x="880" y="520">AIPower云</tspan>
          <tspan x="720" y="500">网络模块</tspan>
          <tspan x="500" y="200">正向隔离</tspan>
          <tspan x="500" y="550">反向隔离</tspan>
          <tspan x="290" y="510">内网服务器</tspan>
          <tspan x="640" y="200">外网服务器</tspan>
          <tspan x="400" y="360">内网交换机</tspan>
          <tspan x="690" y="400">外网交换机</tspan>
          <tspan x="155" y="620">采集器</tspan>
          <tspan x="155" y="700">PCS</tspan>
          <tspan x="155" y="780">电池</tspan>
          <tspan x="110" y="440">远动服务器</tspan>

        </text>

      </g>
    </svg>
  </div>
</template>

<script>

export default {
  data() {
    return {
      dash: [7, 9],
      colorL: ['#00D170', '#1296DB'],
      num: 0,
      timer: '',
      TimeOut: '',
      zoom:'1'

    }
  },
  created() {

  },
  mounted() {
    this.timer = setInterval(this.dashLine, 1000)
    this.TimeOut = setInterval(this.reload, 1000 * 1)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    clearInterval(this.TimeOut)
  },
  methods: {
    dashLine() {
      this.num === 1 ? this.num = 0 : this.num++
    },
    text() {
      confirm('是否打开？')
    },
    reload() {

    },
    location(val) {
        this.zoom = val
        var el = document.getElementById('htmlx')
        el.setAttribute('transform', 'scale('+ val +')')
    },

  }

}
</script>

<style lang="less" scoped>

</style>
