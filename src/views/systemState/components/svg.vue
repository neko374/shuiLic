<template>
  <div style="height:100%;">
    <!-- <div style="position:fixed;right:0%;top:15%;">
      缩放：<el-input-number :step="0.1" size="mini" style="width: 40%;" v-model="zoom" @change="location(zoom)"></el-input-number>
    </div> -->
    <SvgPanZoom
    style="width: 100%; height: 100%;"
    viewBox="0 0 1450 700"
    :zoomEnabled="true"
    :controlIconsEnabled="true"
    :fit="false"
    :center="true"
  >
    
   <svg width="100%" height="100%" viewBox="0 0 1450 700" xmlns="http://www.w3.org/2000/svg"> 
    <svg width="1450" height="700" xmlns="http://www.w3.org/2000/svg">
    <g>
        <title></title>
        <rect x="-1" y="-1" width="1450" height="700" id="canvas_background" fill="#fff"></rect>
        <g id="canvasGrid" display="none">
            <rect id="svg_1" width="100%" height="100%" x="0" y="0" stroke-width="0" fill="url(#gridpattern)"></rect>
        </g>
    </g>
    <g id="htmlx">
        <rect x="322" y="14" width="680" height="270" id="rect424614821906134800" type="polygon" stroke="#08D0FE" stroke-width="2.5" rx="10" fill="rgb(238,234,242)" tagnames="微网供电矩形" stroke-dasharray="5,5"></rect>
        <rect x="10" y="295" width="299" height="392" id="rect206443047071978240" type="polygon" stroke="#08D0FE" stroke-width="2.5" rx="10" fill="rgb(235,241,223)" tagnames="光伏车棚矩形" stroke-dasharray="5,5"></rect>
        <rect x="325" y="296" width="1100" height="392" id="rect973991945963181200" type="polygon" stroke="#08D0FE" stroke-width="2.5" rx="10" fill="rgb(219,238,243)" tagnames="储能箱子矩形" stroke-dasharray="5,5"></rect>
        <rect x="31" y="437" width="260" height="50" id="rect312316612093422000" type="polygon" stroke="black" stroke-width="1.5" fill="#fff" tagnames="光伏逆变器小矩形" stroke-dasharray="2,2"></rect>
        <rect x="635" y="312" width="764" height="140" id="rect793804491990309800" type="polygon" stroke="#08D0FE" stroke-width="2" fill="#fff" tagnames="储能-微网控制柜小矩形" stroke-dasharray="5,5"></rect>
        <svg class="icon" type="pv" id="svg586375040733746300" tagnames="组件1" aria-hidden="true" width="36" x="34" y="-16">
            <use xlink:href="#icon-guangfu" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="pv" id="svg269599099787911650" tagnames="组件2" aria-hidden="true" width="36" x="108" y="-16">
            <use xlink:href="#icon-guangfu" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="pv" id="svg750247368138853200" tagnames="组件3" aria-hidden="true" width="36" x="182" y="-16">
            <use xlink:href="#icon-guangfu" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="pv" id="svg182061394472083260" tagnames="组件4" aria-hidden="true" width="36" x="252" y="-16">
            <use xlink:href="#icon-guangfu" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg729255182596141000" tagnames="光伏逆变器1" aria-hidden="true" width="36" x="145" y="110">
            <use xlink:href="#icon-nibianqi1" color="#0088D2"></use>
        </svg>
        <line x1="52" x2="52" y1="419" y2="436" id="line803861644370201300" type="line" stroke="black" stroke-width="2" fill="none" tagnames="逆变器组件连接线1" transform="rotate(0 52 419)"></line>
        <line x1="126" x2="126" y1="418" y2="436" id="line951835336547157200" type="line" stroke="black" stroke-width="2" fill="none" tagnames="逆变器组件连接线2" transform="rotate(0 126 418)"></line>
        <line x1="200" x2="200" y1="419" y2="436" id="line697448200039527000" type="line" stroke="black" stroke-width="2" fill="none" tagnames="逆变器组件连接线3" transform="rotate(0 200 419)"></line>
        <line x1="271" x2="271" y1="419" y2="436" id="line877794102575889900" type="line" stroke="black" stroke-width="2" fill="none" tagnames="逆变器组件连接线4" transform="rotate(0 271 419)"></line>
        <svg class="icon" type="dq" id="svg936935274814899800" tagnames="光伏计量柜1" aria-hidden="true" width="40" x="445" y="31">
            <use xlink:href="#icon-jilianggui1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="dq" id="svg291104945310942900" tagnames="储能计量柜1" aria-hidden="true" width="40" x="542" y="31">
            <use xlink:href="#icon-jilianggui" color="#0088D2"></use>
        </svg>
        <line x1="467" x2="467" y1="400" y2="520" id="line590799235916926700" type="line" stroke="black" stroke-width="2" fill="none" tagnames="光伏计量柜连接车棚1"></line>
        <line x1="165" x2="165" y1="488" y2="520" id="line822428352755196300" type="line" stroke="black" stroke-width="2" fill="none" tagnames="光伏计量柜连接车棚2"></line>
        <line x1="467" x2="467" y1="520" y2="822" id="line746205208218010600" type="line" stroke="black" stroke-width="2" fill="none" tagnames="光伏计量柜连接车棚3" transform="rotate(90 467 520)"></line>
        <line x1="563" x2="563" y1="400" y2="520" id="line898799292428232800" type="line" stroke="black" stroke-width="2" fill="none" tagnames="储能计量柜连接线1" transform="rotate(0 563 400)"></line>
        <line x1="563" x2="563" y1="519" y2="649" id="line27489920221244412" type="line" stroke="black" stroke-width="2" fill="none" tagnames="储能计量柜连接线2" transform="rotate(270 563 519)"></line>
        <line x1="674" x2="674" y1="360" y2="1050" id="line238068087922035800" type="line" stroke="black" stroke-width="5" fill="none" tagnames="微网控制柜母线" transform="rotate(270 674 360)"></line>
        <line x1="692" x2="692" y1="362" y2="518" id="line33396578828690070" type="line" stroke="black" stroke-width="2" fill="none" tagnames="微网控制柜线1" transform="rotate(0 692 362)"></line>
        <line x1="787" x2="787" y1="360" y2="483" id="line56881724737746216" type="line" stroke="black" stroke-width="2" fill="none" tagnames="微网控制柜线2" transform="rotate(0 787 363)"></line>
        <line x1="904" x2="904" y1="362" y2="542" id="line879200327705175200" type="line" stroke="black" stroke-width="2" fill="none" tagnames="微网控制柜线3" transform="rotate(0 904 362)"></line>
        <line x1="978" x2="978" y1="362" y2="542" id="line681656629367255400" type="line" stroke="black" stroke-width="2" fill="none" tagnames="微网控制柜线4" transform="rotate(0 978 362)"></line>
        <line x1="1053" x2="1053" y1="362" y2="542" id="line955172625873045800" type="line" stroke="black" stroke-width="2" fill="none" tagnames="微网控制柜线5" transform="rotate(0 1053 362)"></line>
        <line x1="1127" x2="1127" y1="360" y2="542" id="line701447118810570900" type="line" stroke="black" stroke-width="2" fill="none" tagnames="微网控制柜线6" transform="rotate(0 1127 363)"></line>
        <line x1="1201" x2="1201" y1="360" y2="542" id="line274305105756461380" type="line" stroke="black" stroke-width="2" fill="none" tagnames="微网控制柜线7" transform="rotate(0 1201 363)"></line>
        <line x1="1273" x2="1273" y1="362" y2="542" id="line23612016640533810" type="line" stroke="black" stroke-width="2" fill="none" tagnames="微网控制柜线8" transform="rotate(0 1273 362)"></line>
        <line x1="1338" x2="1338" y1="362" y2="542" id="line75798431098671000" type="line" stroke="black" stroke-width="2" fill="none" tagnames="微网控制柜线9" transform="rotate(0 1338 362)"></line>
        <svg class="icon" type="dq" id="svg227931640673614720" tagnames="空调1" aria-hidden="true" width="40" x="885" y="214">
            <use xlink:href="#icon-bianzu1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="dq" id="svg918099016981855000" tagnames="空调2" aria-hidden="true" width="40" x="960" y="213">
            <use xlink:href="#icon-bianzu1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="dq" id="svg750719078580881700" tagnames="空调3" aria-hidden="true" width="40" x="1037" y="214">
            <use xlink:href="#icon-bianzu1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="dq" id="svg753799667521433100" tagnames="ups供电" aria-hidden="true" width="40" x="1107" y="210">
            <use xlink:href="#icon-wUPSgongdianzhuangzhi" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="dq" id="svg482176599896429100" tagnames="照明" aria-hidden="true" width="40" x="1182" y="211">
            <use xlink:href="#icon-deng1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="dq" id="svg883693856040624300" tagnames="插座" aria-hidden="true" width="40" x="1255" y="210">
            <use xlink:href="#icon-chazuo" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="dq" id="svg642113714115017200" tagnames="摄像头" aria-hidden="true" width="40" x="1320" y="212">
            <use xlink:href="#icon-shexiangtou" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg313250671332325760" tagnames="PCS隔离变" aria-hidden="true" width="40" x="768" y="146">
            <use xlink:href="#icon-nibianqi" color="#0088D2"></use>
        </svg>
        <line x1="787" x2="787" y1="508" y2="528" id="line120351185381066140" type="line" stroke="black" stroke-width="2" fill="none" tagnames="PCS隔离变连接PCS" transform="rotate(0 787 508)"></line>
        <svg class="icon" type="pv" id="svg325241341134221200" tagnames="PCS" aria-hidden="true" width="40" x="768" y="192">
            <use xlink:href="#icon-nibianqi" color="#0088D2"></use>
        </svg>
        <line x1="788" x2="788" y1="555" y2="574" id="line528416728037247600" type="line" stroke="black" stroke-width="2" fill="none" tagnames="PCS连汇流箱" transform="rotate(0 788 555)"></line>
        <svg class="icon" type="pv" id="svg710967347965914200" tagnames="直流汇流箱" aria-hidden="true" width="40" x="768" y="242">
            <use xlink:href="#icon-huiliuxiang" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="ep" id="svg604589065307468800" tagnames="电池簇1" aria-hidden="true" width="30" x="720" y="305">
            <use xlink:href="#icon-kefangdianliang" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="ep" id="svg495913186204357950" tagnames="电池簇5" aria-hidden="true" width="30" x="827" y="306">
            <use xlink:href="#icon-kefangdianliang" color="#0088D2"></use>
        </svg>
        <line x1="788" x2="788" y1="606" y2="626" id="line948658715426616400" type="line" stroke="black" stroke-width="2" fill="none" tagnames="汇流箱连电池簇1" transform="rotate(360 788 606)"></line>
        <line x1="849" x2="849" y1="628" y2="748" id="line97072432266241520" type="line" stroke="black" stroke-width="2" fill="none" tagnames="汇流箱连电池簇2" transform="rotate(90 849 628)"></line>
        <line x1="135" x2="135" y1="62" y2="911" id="line873630535190127900" type="line" stroke="rgba(13, 12, 12, 1)" stroke-width="2" fill="none" tagnames="母线1" transform="rotate(270 135 61)" y="-65" x="7"></line>
        <line x1="133" x2="133" y1="174" y2="334" id="line400162785629756300" type="line" stroke="rgba(17, 16, 16, 1)" stroke-width="2" fill="none" tagnames="母线2" transform="rotate(270 131 174)"></line>
        <line x1="434" x2="434" y1="199" y2="439" id="line751862105762521600" type="line" stroke="rgba(14, 13, 13, 1)" stroke-width="5" fill="none" tagnames="母线3" transform="rotate(270 434 199)"></line>
        <svg class="icon" type="pv" id="svg120181288947561740" tagnames="升压变1" aria-hidden="true" width="50" x="537" y="-185">
            <use xlink:href="#icon-shengyazhan" color="#0088D2"></use>
        </svg>
        <line x1="290" x2="290" y1="60" y2="171" id="line540468464761158400" type="line" stroke="black" stroke-width="2" fill="none" tagnames="母线联络线1" transform="rotate(0 290 63)"></line>
        <line x1="444" x2="444" y1="60" y2="134" id="line807919303108113800" type="line" stroke="rgba(13, 12, 12, 1)" stroke-width="2" fill="none" tagnames="箭头线1" transform="rotate(0 444 64)" marker-end="url(#Triangle)"></line>
        <line x1="561" x2="561" y1="60" y2="154" id="line291253573261790460" type="line" stroke="black" stroke-width="2" fill="none" tagnames="升压变线1" transform="rotate(0 561 64)"></line>
        <line x1="563" x2="563" y1="187" y2="203" id="line280293674959956930" type="line" stroke="black" stroke-width="2" fill="none" tagnames="升压变线2" transform="rotate(0 563 187)"></line>
        <line x1="665" x2="665" y1="60" y2="132" id="line905318965459109100" type="line" stroke="black" stroke-width="2" fill="none" tagnames="箭头线2" transform="rotate(0 665 62)" marker-end="url(#Triangle)"></line>
        <line x1="806" x2="806" y1="60" y2="133" id="line587155248177097600" type="line" stroke="black" stroke-width="2" fill="none" tagnames="箭头线3" transform="rotate(0 806 63)" marker-end="url(#Triangle)"></line>
        <line x1="947" x2="947" y1="60" y2="133" id="line92355894931980930" type="line" stroke="rgba(14, 13, 13, 1)" stroke-width="2" fill="none" tagnames="箭头线4" transform="rotate(0 947 63)" marker-end="url(#Triangle)"></line>
        <line x1="654" x2="654" y1="201" y2="258" id="line358558041104244800" type="line" stroke="rgba(14, 13, 13, 1)" stroke-width="2" fill="none" tagnames="箭头线5" transform="rotate(0 654 201)" marker-end="url(#Triangle)"></line>
        <line x1="467" x2="467" y1="200" y2="361" id="line693433760625670700" type="line" stroke="black" stroke-width="2" fill="none" tagnames="光伏线1" transform="rotate(0 467 202)"></line>
        <line x1="563" x2="563" y1="201" y2="361" id="line530950716527041700" type="line" stroke="black" stroke-width="2" fill="none" tagnames="储能线1" transform="rotate(0 563 201)"></line>
        <svg class="icon" type="wp" id="svg221400506221600000" tagnames="开关1" aria-hidden="true" width="40" x="270" y="-240">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg582741399497558800" tagnames="开关2" aria-hidden="true" width="40" x="541" y="-240">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg379993653281724100" tagnames="开关3" aria-hidden="true" width="40" x="446" y="-120">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg10720010307011530" tagnames="开关4" aria-hidden="true" width="40" x="543" y="-120">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg545293439357240200" tagnames="开关5" aria-hidden="true" width="40" x="634" y="-120">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg468239074701286140" tagnames="横向开关1" aria-hidden="true" width="40" x="206" y="-290">
            <use xlink:href="#icon-juxing2" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg772732589053783700" tagnames="横向开关2" aria-hidden="true" width="40" x="371" y="-290">
            <use xlink:href="#icon-juxing2" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg387586333424756900" tagnames="横向开关3" aria-hidden="true" width="40" x="710" y="-290">
            <use xlink:href="#icon-juxing2" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg509064572272642370" tagnames="横向开关4" aria-hidden="true" width="40" x="867" y="-290">
            <use xlink:href="#icon-juxing2" color="#0088D2"></use>
        </svg>
        <text x="0" y="0" fill="black" style="font-size:16px;" id="htmlFont">
            <tspan x="252" y="116" id="font947606515684340500" type="fontTag" fill="black" tagnames="12T1" style="font-size:12px;">12T1</tspan>
            <tspan x="522" y="119" id="font284468034898796900" type="fontTag" fill="black" tagnames="85T1" style="font-size:12px;">85T1</tspan>
            <tspan x="30" y="52" id="font359098408710903040" type="fontTag" fill="black" tagnames="鹅村站711开关">鹅村站711开关</tspan>
            <tspan x="26" y="159" id="font619071191766584000" type="fontTag" fill="black" tagnames="鹅村站701开关">鹅村站701开关</tspan>
            <tspan x="621" y="278" id="font703224592638950000" type="fontTag" fill="black" tagnames="台区低压负载">台区低压负载</tspan>
            <tspan x="426" y="165" id="font423164519556638460" type="fontTag" fill="black" tagnames="535 kVA" style="font-size:12px;">535 kVA</tspan>
            <tspan x="646" y="166" id="font20542486134544012" type="fontTag" fill="black" tagnames="965 kVA" style="font-size:12px;">965 kVA</tspan>
            <tspan x="786" y="166" id="font653794980742362400" type="fontTag" fill="black" tagnames="400 kVA" style="font-size:12px;">400 kVA</tspan>
            <tspan x="922" y="166" id="font267607319454148600" type="fontTag" fill="black" tagnames="630 kVA" style="font-size:12px;">630 kVA</tspan>
            <tspan x="216" y="50" id="font393562021510422500" type="fontTag" fill="black" tagnames="8T1" style="font-size:12px;">8T1</tspan>
            <tspan x="377" y="50" id="font636998685775996800" type="fontTag" fill="black" tagnames="75T1" style="font-size:12px;">75T1</tspan>
            <tspan x="714" y="50" id="font186544168775267600" type="fontTag" fill="black" tagnames="98T1" style="font-size:12px;">98T1</tspan>
            <tspan x="875" y="50" id="font29794996349438610" type="fontTag" fill="black" tagnames="2T1" style="font-size:12px;">2T1</tspan>
            <tspan x="771" y="658" id="font476480672121675200" type="fontTag" fill="black" tagnames="。。。">.........</tspan>
            <tspan x="890" y="230" id="font479845060013862850" type="fontTag" fill="black" tagnames="10kV版村线" style="font-size:20px;">10kV版村线</tspan>
            <tspan x="876" y="260" id="font533876960867328400" type="fontTag" fill="black" tagnames="微网供电范围" style="font-size:20px;">微网供电范围</tspan>
            <tspan x="20" y="670" id="font58671950126948140" type="fontTag" fill="black" tagnames="光伏车棚" style="font-size:20px;">光伏车棚</tspan>
            <tspan x="341" y="672" id="font565358887925250050" type="fontTag" fill="black" tagnames="储能集装箱" style="font-size:20px;">储能集装箱</tspan>
            <tspan x="990" y="330" id="font837297636232565800" type="fontTag" fill="black" tagnames="交流配电柜/微网控制柜">交流配电柜/微网控制柜</tspan>
            <tspan x="699" y="502" id="font723209680110194600" type="fontTag" fill="black" tagnames="PCS隔离变" style="font-size:12px;">PCS隔离变</tspan>
            <tspan x="724" y="545" id="font423115612553600640" type="fontTag" fill="black" tagnames="PCS" style="font-size:12px;">PCS</tspan>
            <tspan x="697" y="593" id="font948003191393979000" type="fontTag" fill="black" tagnames="直流汇流箱" style="font-size:12px;">直流汇流箱</tspan>
            <tspan x="680" y="660" id="font857390674581690900" type="fontTag" fill="black" tagnames="电池簇1" style="font-size:12px;">电池簇1</tspan>
            <tspan x="854" y="660" id="font799314128850595600" type="fontTag" fill="black" tagnames="电池簇5" style="font-size:12px;">电池簇65</tspan>
            <tspan x="889" y="610" id="font592875540323060400" type="fontTag" fill="black" tagnames="空调1" style="font-size:12px;">空调1</tspan>
            <tspan x="964" y="610" id="font701736201062420900" type="fontTag" fill="black" tagnames="空调2" style="font-size:12px;">空调2</tspan>
            <tspan x="1041" y="610" id="font974454744296092400" type="fontTag" fill="black" tagnames="空调3" style="font-size:12px;">空调3</tspan>
            <tspan x="1106" y="610" id="font362953911643778750" type="fontTag" fill="black" tagnames="ups供电" style="font-size:12px;">ups供电</tspan>
            <tspan x="1190" y="610" id="font186890308874412930" type="fontTag" fill="black" tagnames="照明" style="font-size:12px;">照明</tspan>
            <tspan x="1260" y="610" id="font471924906543199000" type="fontTag" fill="black" tagnames="插座" style="font-size:12px;">插座</tspan>
            <tspan x="1323" y="610" id="font398368024709732300" type="fontTag" fill="black" tagnames="摄像头" style="font-size:12px;">摄像头</tspan>
            <tspan x="50" y="465" id="font725671010526622800" type="fontTag" fill="black" tagnames="光伏逆变器">光伏逆变器</tspan>
            <tspan x="15" y="313" id="font383972614280597060" type="fontTag" fill="black" tagnames="组件1" style="font-size:12px;">组件1</tspan>
            <tspan x="12" y="383" id="font599128158256571900" type="fontTag" fill="black" tagnames="组件15" style="font-size:12px;">组件15</tspan>
        </text>
        <defs>
            <marker id="TriangleA" viewBox="0 0 20 20" refX="128.277" refY="10" markerWidth="5" markerHeight="5" orient="auto">
                <animate attributeName="refX" from="180" to="0" dur="2s" repeatCount="indefinite"></animate>
                <path d="M 0 0 L 20 10 L 0 20 z" fill="#08D0FE"></path>
            </marker>
            <marker id="Triangle" viewBox="0 0 20 20" refX="0" refY="10" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 0 0 L 20 10 L 0 20 z" fill="rgba(8, 8, 8, 1)"></path>
            </marker>
        </defs>
        <svg class="icon" type="wp" id="svg860346467935689300" tagnames="控制柜开关1" aria-hidden="true" width="40" x="672" y="50">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg863012142673241300" tagnames="控制柜开关2" aria-hidden="true" width="40" x="767" y="50">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg523977819340181400" tagnames="控制柜开关3" aria-hidden="true" width="40" x="884" y="50">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg739063132550915000" tagnames="控制柜开关4" aria-hidden="true" width="40" x="957" y="50">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg825859893338507900" tagnames="控制柜开关5" aria-hidden="true" width="40" x="1033" y="50">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg792691665100053100" tagnames="控制柜开关6" aria-hidden="true" width="40" x="1107" y="50">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg144594339891142900" tagnames="控制柜开关7" aria-hidden="true" width="40" x="1181" y="50">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg237103560639890560" tagnames="控制柜开关8" aria-hidden="true" width="40" x="1253" y="50">
            <use xlink:href="#icon-juxing1" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="wp" id="svg277988477895176000" tagnames="控制柜开关9" aria-hidden="true" width="40" x="1318" y="50">
            <use xlink:href="#icon-juxing1" color="red"></use>
        </svg>
        <svg class="icon" type="pv" id="svg111169326747781120" tagnames="组件5" aria-hidden="true" width="36" x="34" y="52">
            <use xlink:href="#icon-guangfu" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="pv" id="svg728801041621577700" tagnames="组件6" aria-hidden="true" width="36" x="107" y="52">
            <use xlink:href="#icon-guangfu" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="pv" id="svg110409823545762670" tagnames="组件7" aria-hidden="true" width="36" x="181" y="52">
            <use xlink:href="#icon-guangfu" color="#0088D2"></use>
        </svg>
        <svg class="icon" type="pv" id="svg879328129915324400" tagnames="组件8" aria-hidden="true" width="36" x="252" y="52">
            <use xlink:href="#icon-guangfu" color="#0088D2"></use>
        </svg>
        <line x1="53" x2="53" y1="355" y2="383" id="line843905672845959000" type="line" stroke="black" stroke-width="2" fill="none" tagnames="组件连接线1" transform="rotate(0 53 355)" stroke-dasharray="2,2"></line>
        <line x1="126" x2="126" y1="353" y2="383" id="line209781294989970430" type="line" stroke="black" stroke-width="2" fill="none" tagnames="组件连接线2" transform="rotate(0 126 353)" stroke-dasharray="2,2"></line>
        <line x1="200" x2="200" y1="352" y2="382" id="line407149019426611840" type="line" stroke="black" stroke-width="2" fill="none" tagnames="组件连接线3" stroke-dasharray="2,2"></line>
        <line x1="271" x2="271" y1="353" y2="383" id="line637503981003719300" type="line" stroke="black" stroke-width="2" fill="none" tagnames="组件连接线4" transform="rotate(0 271 353)" stroke-dasharray="2,2"></line>
    </g>
</svg>
   </svg>
    </SvgPanZoom>
  </div>
</template>

<script>
import SvgPanZoom from "vue-svg-pan-zoom";

export default {
    components:{
        SvgPanZoom
    },
  data() {
    return {
      zoom:'1'
    }
  },
  created() {

  },
  mounted() {
    
  },
  beforeDestroy() {
   
  },
  methods: {
    location(val) {
        this.zoom = val
        var el = document.getElementById('htmlx')
        el.setAttribute('transform', 'scale('+ val +')')
    },

  }

}
</script>

<style lang="scss">
.svg-pan-zoom_viewport{
  width:100%;
  height:100%;
}
  .svg-pan-zoom-control{
    display: none;
  }
</style>
