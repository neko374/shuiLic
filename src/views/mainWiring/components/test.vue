<template>
  <div style="height:calc(100% - 90px)">
  <svg viewBox="0 0 1000 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <svg width="1000" height="480" xmlns="http://www.w3.org/2000/svg">
    <g>
        <title></title>
        <rect x="-1" y="-1" width="1000" height="480" id="canvas_background" fill="#fff"></rect>
        <g id="canvasGrid" display="none">
            <rect id="svg_1" width="100%" height="100%" x="0" y="0" stroke-width="0" fill="url(#gridpattern)"></rect>
        </g>
    </g>
    <g id="htmlx">
        <text x="0" y="0" fill="black" style="font-size:16px;" id="htmlFont">
            <tspan x="252" y="116" id="font947606515684340500" type="fontTag" fill="black" tagnames="12T1" style="font-size:12px;">12T1</tspan>
            <tspan x="522" y="119" id="font284468034898796900" type="fontTag" fill="black" tagnames="85T1" style="font-size:12px;">85T1</tspan>
            <tspan x="30" y="52" id="font359098408710903040" type="fontTag" fill="black" tagnames="鹅村站711开关">鹅村站711开关</tspan>
            <tspan x="26" y="159" id="font619071191766584000" type="fontTag" fill="black" tagnames="鹅村站701开关">鹅村站701开关</tspan>
            <tspan x="598" y="421" id="font703224592638950000" type="fontTag" fill="black" tagnames="台区低压负载">台区低压负载</tspan>
            <tspan x="426" y="165" id="font423164519556638460" type="fontTag" fill="black" tagnames="535 kVA" style="font-size:12px;">535 kVA</tspan>
            <tspan x="646" y="166" id="font20542486134544012" type="fontTag" fill="black" tagnames="965 kVA" style="font-size:12px;">965 kVA</tspan>
            <tspan x="786" y="166" id="font653794980742362400" type="fontTag" fill="black" tagnames="400 kVA" style="font-size:12px;">400 kVA</tspan>
            <tspan x="922" y="166" id="font267607319454148600" type="fontTag" fill="black" tagnames="630 kVA" style="font-size:12px;">630 kVA</tspan>
            <tspan x="216" y="50" id="font393562021510422500" type="fontTag" fill="black" tagnames="8T1" style="font-size:12px;">8T1</tspan>
            <tspan x="377" y="50" id="font636998685775996800" type="fontTag" fill="black" tagnames="75T1" style="font-size:12px;">75T1</tspan>
            <tspan x="714" y="50" id="font186544168775267600" type="fontTag" fill="black" tagnames="98T1" style="font-size:12px;">98T1</tspan>
            <tspan x="875" y="50" id="font29794996349438610" type="fontTag" fill="black" tagnames="2T1" style="font-size:12px;">2T1</tspan>
            <tspan x="480" y="322" id="font82759218000296740" type="fontTag" fill="black" tagnames="123" style="font-size:12px;"><tspan fill="blue">{{curName[3].value | numFilter}}</tspan> kW</tspan>
            <tspan x="570" y="312" id="font82759218000296740" type="fontTag" fill="black" tagnames="124" style="font-size:12px;"><tspan fill="blue">{{curName[4].value | numFilter}}</tspan> kW</tspan>
            <tspan x="570" y="336" id="font82759218000296740" type="fontTag" fill="black" tagnames="124" style="font-size:12px;"><tspan fill="blue">{{curName[5].value | numFilter}}</tspan> %</tspan>
            <tspan x="590" y="210" id="font709722966107703800" type="fontTag" fill="black" tagnames="457" style="font-size:12px;">Uab：<tspan fill="blue">{{curName[0].value | numFilter}}</tspan> V</tspan>
            <tspan x="590" y="230" id="font709722966107703800" type="fontTag" fill="black" tagnames="456" style="font-size:12px;">Ubc：<tspan fill="blue">{{curName[1].value | numFilter}}</tspan> V</tspan>
            <tspan x="590" y="250" id="font709722966107703800" type="fontTag" fill="black" tagnames="459" style="font-size:12px;">Uca：<tspan fill="blue">{{curName[2].value | numFilter}}</tspan> V</tspan>
        </text>
        <defs>
            <marker id="TriangleA" viewBox="0 0 20 20" refX="69.9385" refY="10" markerWidth="5" markerHeight="5" orient="auto">
                <animate attributeName="refX" from="180" to="0" dur="2s" repeatCount="indefinite"></animate>
                <path d="M 0 0 L 20 10 L 0 20 z" fill="#08D0FE"></path>
            </marker>
            <marker id="Triangle" viewBox="0 0 20 20" refX="0" refY="10" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 0 0 L 20 10 L 0 20 z" fill="rgba(8, 8, 8, 1)"></path>
            </marker>
        </defs>
        <line x1="135" x2="135" y1="63" y2="911" id="line873630535190127900" type="line" stroke="rgba(13, 12, 12, 1)" stroke-width="2" fill="none" tagnames="母线1" transform="rotate(270 135 61)" y="-65" x="7"></line>
        <line x1="133" x2="133" y1="174" y2="334" id="line400162785629756300" type="line" stroke="rgba(17, 16, 16, 1)" stroke-width="2" fill="none" tagnames="母线2" transform="rotate(270 131 174)"></line>
        <line x1="434" x2="434" y1="273" y2="513" id="line751862105762521600" type="line" stroke="rgba(14, 13, 13, 1)" stroke-width="5" fill="none" tagnames="母线3" transform="rotate(270 434 273)"></line>
        <svg class="icon" type="pv" id="svg120181288947561740" tagnames="升压变1" aria-hidden="true" width="50" x="538" y="-27">
            <use xlink:href="#icon-shengyazhan" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="pv" id="svg550084629292630300" tagnames="光伏1" aria-hidden="true" width="40" x="449" y="172">
            <use xlink:href="#icon-guangfu" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="ep" id="svg65851391666924776" tagnames="储能1" aria-hidden="true" width="40" x="543" y="175">
            <use xlink:href="#icon-xudianchi-copy" color="rgba(0, 136, 210, 1)"></use>
        </svg>
        <line x1="290" x2="290" y1="60" y2="171" id="line540468464761158400" type="line" stroke="black" stroke-width="2" fill="none" tagnames="母线联络线1" transform="rotate(0 290 63)"></line>
        <line x1="444" x2="444" y1="60" y2="134" id="line807919303108113800" type="line" stroke="rgba(13, 12, 12, 1)" stroke-width="2" fill="none" tagnames="箭头线1" transform="rotate(0 444 64)" marker-end="url(#Triangle)"></line>
        <line x1="561" x2="561" y1="60" y2="194" id="line291253573261790460" type="line" stroke="black" stroke-width="2" fill="none" tagnames="升压变线1" transform="rotate(0 561 64)"></line>
        <line x1="563" x2="563" y1="237" y2="273" id="line280293674959956930" type="line" stroke="black" stroke-width="2" fill="none" tagnames="升压变线2" transform="rotate(0 563 237)"></line>
        <line x1="665" x2="665" y1="60" y2="132" id="line905318965459109100" type="line" stroke="black" stroke-width="2" fill="none" tagnames="箭头线2" transform="rotate(0 665 62)" marker-end="url(#Triangle)"></line>
        <line x1="806" x2="806" y1="60" y2="133" id="line587155248177097600" type="line" stroke="black" stroke-width="2" fill="none" tagnames="箭头线3" transform="rotate(0 806 63)" marker-end="url(#Triangle)"></line>
        <line x1="947" x2="947" y1="60" y2="133" id="line92355894931980930" type="line" stroke="rgba(14, 13, 13, 1)" stroke-width="2" fill="none" tagnames="箭头线4" transform="rotate(0 947 63)" marker-end="url(#Triangle)"></line>
        <line x1="654" x2="654" y1="276" y2="389" id="line358558041104244800" type="line" stroke="rgba(14, 13, 13, 1)" stroke-width="2" fill="none" tagnames="箭头线5" transform="rotate(0 654 276)" marker-end="url(#Triangle)"></line>
        <line x1="467" x2="467" y1="275" y2="394" id="line693433760625670700" type="line" stroke="black" stroke-width="2" fill="none" tagnames="光伏线1" transform="rotate(0 467 275)"></line>
        <line x1="563" x2="563" y1="273" y2="396" id="line530950716527041700" type="line" stroke="black" stroke-width="2" fill="none" tagnames="储能线1" transform="rotate(0 563 276)"></line>
        <svg class="icon" type="wp" id="svg221400506221600000" tagnames="开关1" aria-hidden="true" width="40" x="271" y="-128">
            <use xlink:href="#icon-juxing1" color="red"></use>
        </svg>
        <svg class="icon" type="wp" id="svg582741399497558800" tagnames="开关2" aria-hidden="true" width="40" x="541" y="-128">
            <use xlink:href="#icon-juxing1" color="red"></use>
        </svg>
        <svg class="icon" type="wp" id="svg379993653281724100" tagnames="开关3" aria-hidden="true" width="40" x="447" y="79">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg10720010307011530" tagnames="开关4" aria-hidden="true" width="40" x="543" y="79">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg545293439357240200" tagnames="开关5" aria-hidden="true" width="40" x="635" y="79">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg468239074701286140" tagnames="横向开关1" aria-hidden="true" width="40" x="204" y="-179">
            <use xlink:href="#icon-juxing2" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg772732589053783700" tagnames="横向开关2" aria-hidden="true" width="40" x="372" y="-179">
            <use xlink:href="#icon-juxing2" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg387586333424756900" tagnames="横向开关3" aria-hidden="true" width="40" x="710" y="-179">
            <use xlink:href="#icon-juxing2" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg509064572272642370" tagnames="横向开关4" aria-hidden="true" width="40" x="867" y="-179">
            <use xlink:href="#icon-juxing2" color="#0088D2"></use>
        </svg>
    </g>
</svg>
  </svg>
  </div>
</template>

<script>
import img from '@/assets/mainWring.png'
import img1 from '@/assets/mainWring1.png'
import { getCurrentData1 } from '@/api/getCurChart'

export default {
  filters: {
    unitFilter(val) {
      // let valb = Math.abs(Number(val))
      // const y = (String(valb).indexOf('.') + 1) || String(valb).length// 获取小数点的位置
      // const count = String(valb).length - y// 获取小数点后的个数
      // if (y >= 4) {
      //   return (val/1000).toFixed(2)+'MW'
      // }
      return val + 'MW'
    }
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        V1: 0.4,
        V2: 10,
        P1: 121
      })
    }
  },
  data() {
    return {
      Vcolor: '#654BD8',
      Pcolor: '#0099ff',
      timer: '',
      TimeOut: '',
      imgcontent: [img, img1],
      imgxuh: 0,
      curName: []
    }
  },
  created() {
    if (this.$store.state.mainWiring.svgList) { this.curName = this.$store.state.mainWiring.svgList }
    this.reload()
    // this.timer = setInterval(this.imgbian, 2 * 1000)
    this.TimeOut = setInterval(this.reload, 1000 * sjzRealTime)
  },
  beforeDestroy() {
    this.$store.dispatch('mainWiring/setSvgList', this.curName)
    clearInterval(this.TimeOut)
    // clearInterval(this.timer)
  },
  methods: {
    imgbian() {
      if (this.imgxuh < 1) { this.imgxuh++ } else { this.imgxuh = 0 }
    },
    reload() {
      const asdfg = this.curName
      getCurrentData1(asdfg, response => {
        const res = response
          this.curName.forEach(val => {
            if('protocolType' in val) {
              if ('stateQk' in val) {
                for (const j in val.stateQk) {
                  if (val.stateQk[j].type == res[val.farmId[0] + '-' + val.protocolType] && res[val.farmId[0] + '-' + val.protocolType] !== undefined) {
                    val.value = val.stateQk[j].name
                    break
                  }
                }
              } else {
                if (res[val.farmId[0] + '-' + val.protocolType] != undefined) {
                  if ('coefficient' in val) { val.value = res[val.farmId[0] + '-' + val.protocolType] * val.coefficient } else { val.value = res[val.farmId[0] + '-' + val.protocolType] }
                }
              }
            }
          })
      })
    }
  }
}
</script>

