<template>
  <div class="app-container">
    <div>
      <el-input style="width:250px;"></el-input>
      <el-button type="primary">打开服务路径</el-button>
    </div>
    <div class="bottom-ser">
      <el-tabs tab-position="left" style="height: 100%;">
        <el-tab-pane label="conf">
          <el-table v-if="!isConf"
            :data="fileNameList"
            border
            size="mini"
            style="width: 100%">
            <el-table-column label="序号" width="70" type="index" :index="1" />
            <el-table-column
              prop="filename"
              label="文件名"
              min-width="180">
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template slot-scope="{row}">
                <el-button size="mini" class="TableButtonEdit" @click="handleUpdate(row)">
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="isConf">
            <el-button type="primary" @click="isConf=false">返回</el-button>
            <el-button type="primary" @click="xmlSave">保存</el-button>
            <div>
              <el-tree
                :data="treeData"
                :props="defaultProps"
                node-key="id"
                width="200px"
                @node-click="handleNodeClick">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span v-if="data.value!==undefined&&data.isEdit==false" style="margin-left:50px;">{{ data.value }}</span>
                  <el-input v-if="data.isEdit" style="margin-left:50px;" size="mini" v-model="data.value"></el-input>
                  <span style="margin-left:50px;">
                    <el-button
                      v-if="!data.isEdit"
                      type="text"
                      size="mini"
                      @click="() => editTree(data)">
                      编辑
                    </el-button>
                    <el-button
                      v-if="data.isEdit"
                      type="text"
                      size="mini"
                      @click="() => editTree(data)">
                      完成
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="lib">lib</el-tab-pane>
        <el-tab-pane label="bin">bin</el-tab-pane>
        <el-tab-pane label="All">All</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {mqttXmlNames, mqttXmlReader, mqttXmlWriter, mqttXmlRestart} from '@/api/hbvpp/mqtt/softwareinfo'

export default {
  data(){
    return {
      fileNameList:[],
      isConf:false,
      projectId:20,
      filename:'',
      xmlReader:'',

      treeData:[],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeId:0
    }
  },
  created() {
    this.getFileNameList()
  },
  methods:{
    getFileNameList() {
      const data =this.projectId
      mqttXmlNames(data).then(response=>{
        this.fileNameList = response.xmlNames.map(item=>({filename:item}))
      })
    },
    handleUpdate({...row}) {
      this.xmlReader = ''
      this.filename = row.filename
      const data={
        id:this.projectId,
        fileName:row.filename
      }
      mqttXmlReader(data).then(response=>{
        // console.log(response)
        this.xmlReader = JSON.parse(JSON.stringify(response.xmlReader))
        // console.log(this.xmlReader)
        // this.xmlReader = this.xmlReader.match(/<Root>(\S*)<\/Root>/)
        this.xmlReader = this.xmlReader.substring(this.xmlReader.indexOf('<Root>')-1,this.xmlReader.lastIndexOf('</Root>')+7)
        // this.xmlReader = ` <Root> <!-- 任务调度服务设置,TaskStartSecWait任务器等待时间后开始, TaskIntvSecWait循环等待时间, HisDBIntvMin数据库入库循环等待时间, CallDataIntvSec: Mqtt透传服务循环等待时间 --> <ServceTaskHisDB TaskStartSecWait="2" TaskIntvSecWait="30" HisDBIntvMin="5" ParseIntvSec="10" /> <!-- 线程池(HisDB数据库和Mqtt消息解析),CorePoolSize初始线程池大小(HisDB数据库和Mqtt消息解析),MaxPoolSizeHisDB(HisDB线程池大小),KeepAliveTimeHisDB&KeepAliveTimeClient线程存活时间,AllowCoreThreadTimeOutClient&AllowCoreThreadTimeOutHisDB线程超时 --> <ThreadPoolOption CorePoolSize="5" MaxPoolSizeHisDB="5" MaxPoolSizeClient="10" KeepAliveTimeHisDB="30" KeepAliveTimeClient="60" AllowCoreThreadTimeOutClient="0" AllowCoreThreadTimeOutHisDB="1"/> <!-- 韶关专项 入库开关 --> <ShaoGuanOld InsertHisDBSwitch="1" /> <!-- 是否启动Modbus Service RunableSwitch=1 启动, 0关闭 --> <ModbusService RunableSwitch="1" /> <!-- 基础配置信息 连接池信息 sqliteMicro protocolInfo --> <PoolSourceProtocol PoolName="protocolInfo" /> <!--hydroPower, microGrid , pv --> <!-- <HisDBPoolSource PoolName="protocolInfo" /> --> <!--MqttMsgSubRunSwitch:mqtt Ncyt订阅topic, MqttMsgToRedisSwitch:报文存入Redis MqttMsgToHisDBSwitch:报文直接存入HISDB MqttRedisToHisDBSwitch:Redis转存入HisDB Quality:1所有数据质量存入,0只存入好的 --> <MqttMsgRTNcytSubServ MqttMsgSubRunSwitch="0" MqttMsgToRedisSwitch="1" MqttMsgToHisDBSwitch="1" MqttRedisToHisDBSwitch="1" Quality="1"/> <!-- Mqtt报文本地化保存 --> <MqttMsgRTSaveFile MsgSaveSwitch="0" MsgSavePath="D:/SqlTxtSave" MsgMovePath="D:/SqlTextMove" MsgBackupPath="D:/SqlTextBackup" /> <!-- Mqtt报文解析后,存入HISDB数据库 MsgFileDeleteSwitch:入库后删除开关--> <MqttMsgFileToDB MsgFileToDBSwitch="1" MsgFileDeleteSwitch="1" MsgFileBackupSwitch="0" /> <!-- Mqtt报文解��后,发布到Topic上 ,MsgFilePublishSwitch:解析开关, MsgFileDeleteSwitch:解析后删除--> <MqttMsgFilePublish MsgFilePublishSwitch="0" MsgFileDeleteSwitch="0" /> <!-- Mqtt Server Broker Info HostIP="47.103.79.116" Port="1883" --> <Broker HostIP="47.103.79.116" Port="1883" ClientID="aipower_client" UserName="aipower" Password="emqx_2020" /> <!-- Mqtt Server-Client 连接配置信息 ConnectionTimeout连接超时(秒), KeepAliveInterval心跳时间(秒) --> <MqttConnectOption ConnectionTimeout="20" KeepAliveInterval="80" CleanSession="1"/> <!-- 规约接收主题订阅, ncyt_畅阳, modbus为modbus采集器透传 --> <MqttTopicSubscribeList> <!-- type=1 yxymyc , type=2 settime , type=3 ykyt ,State=1 enable, State=0 disable --> <SubTopicInfo ReceTopic="ncyt_pub_yc_ym_yx" Type="1" State="1" /> <SubTopicInfo ReceTopic="ncyt_sub_SetTime" Type="2" State="1" /> <SubTopicInfo ReceTopic="modbus_001_0013_0007_02" Type="1" State="1" /> </MqttTopicSubscribeList> <!-- 针对SNID TypeID(光伏、储能、微网、水电)对象验证, 规约名称NameID验证, AreaID规约地区验证 --> <GyTypeIDSwitch TypeID="001, 002 , 003, 004" /> <GyNameIDSwitch NameID="0002 , 0004 , 0005 , 0006 , 0007 , 0008 , 0009, 0012 " /> <GyAreaIDSwitch AreaID="0012 , 0013 , 0053 " /> <GuZhangSwitch GuZhangID="GZ, ZT, ERROR, WARN " /> </Root>`
        // console.log(this.xmlReader)
        const xml = this.$x2js.xml2js(this.xmlReader)  //解析
        // console.log(xml) //打印
        const sssdf = this.$x2js.js2xml(xml)
        // console.log(sssdf)
        const treeList = this.jsontotree(xml)
        // console.log(treeList)
        this.treeData = treeList
        // const json = this.$x2js.js2xml(xml)
        // console.log(json)
      })
      this.isConf = true
    },
    jsontotree(val) {
      let treeList = []
      let that = this
      treeList = abcf(val)
      return treeList
      function abcf(value) {
        const treeChildrenList = []
        for(let keyv in value) {
          if(Array.isArray(value[keyv])){
            for(let keyj in value[keyv]) {
              treeChildrenList.push({id:that.treeId++,label:keyv,labelIndex:keyj})
              if(typeof value[keyv][keyj]=='object') {
                treeChildrenList[treeChildrenList.length-1].children = abcf(value[keyv][keyj])
              } else {
                treeChildrenList[treeChildrenList.length-1].value = value[keyv][keyj]
                treeChildrenList[treeChildrenList.length-1].isEdit = false
              }
            }
          } else {
            treeChildrenList.push({id:that.treeId++,label:keyv})
            if(typeof value[keyv]=='object') {
              treeChildrenList[treeChildrenList.length-1].children = abcf(value[keyv])
            } else {
              treeChildrenList[treeChildrenList.length-1].value = value[keyv]
              treeChildrenList[treeChildrenList.length-1].isEdit = false
            }
          }
        }
        return treeChildrenList
      }
    },
    treetojson(val) {
      let json = {}
      json = abcf(val)
      return json
      function abcf(value) {
        const jsonchi = {}
        for(let keyv in value) {
          if('children' in value[keyv]) {
            if('labelIndex' in value[keyv]) {
              if(jsonchi[value[keyv].label]===undefined)
                jsonchi[value[keyv].label] = []
              jsonchi[value[keyv].label][value[keyv].labelIndex] = abcf(value[keyv].children)
            } else {
              jsonchi[value[keyv].label] = abcf(value[keyv].children)
            }
          } else {
            jsonchi[value[keyv].label] = value[keyv].value
          }
        }
        return jsonchi
      }
    },
    handleNodeClick(data) {
      // console.log(data);
    },
    editTree(data) {
      data.isEdit = !data.isEdit
    },
    xmlSave() {
      let jsondata = this.treetojson(this.treeData)
      let json = `<?xml version="1.0" encoding="UTF-8" ?>\r\n`+this.$x2js.js2xml(jsondata)
      json = this.formateXml(json)
      const data={
        id:this.projectId,
        // fileName:this.filename,
        fileName:undefined,
        content:json
      }
      // console.log(data)
      mqttXmlWriter(data).then(response=>{
        // console.log(response)
        if(response.xmlWriter) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
        }
      })
    },
    formateXml(xmlStr){
        let text = xmlStr;
        //使用replace去空格
        text = '\n' + text.replace(/(<\w+)(\s.*?>)/g,function($0, name, props){
            return name + ' ' + props.replace(/\s+(\w+=)/g," $1");
        }).replace(/>\s*?</g,">\n<");
        //处理注释
        text = text.replace(/\n/g,'\r').replace(/<!--(.+?)-->/g,function($0, text){
            var ret = '<!--' + escape(text) + '-->';
            return ret;
        }).replace(/\r/g,'\n');
        //调整格式  以压栈方式递归调整缩进
        var rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
        var nodeStack = [];
        var output = text.replace(rgx,function($0,all,name,isBegin,isCloseFull1,isCloseFull2 ,isFull1,isFull2){
            var isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/' ) || (isFull1 == '/') || (isFull2 == '/');
            var prefix = '';
            if(isBegin == '!'){//!开头
                prefix = setPrefix(nodeStack.length);
            }else {
                if(isBegin != '/'){///开头
                    prefix = setPrefix(nodeStack.length);
                    if(!isClosed){//非关闭标签
                        nodeStack.push(name);
                    }
                }else{
                    nodeStack.pop();//弹栈
                    prefix = setPrefix(nodeStack.length);
                }
            }
            var ret =  '\n' + prefix + all;
            return ret;
        });
        var prefixSpace = -1;
        var outputText = output.substring(1);
        //还原注释内容
        outputText = outputText.replace(/\n/g,'\r').replace(/(\s*)<!--(.+?)-->/g,function($0, prefix,  text){
            if(prefix.charAt(0) == '\r')
                prefix = prefix.substring(1);
            text = unescape(text).replace(/\r/g,'\n');
            var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix ) + '-->';
            return ret;
        });
        outputText= outputText.replace(/\s+$/g,'').replace(/\r/g,'\r\n');
        return outputText;
        //计算头函数 用来缩进
        function setPrefix(prefixIndex) {
            var result = '';
            var span = '    ';//缩进长度
            var output = [];
            for(var i = 0 ; i < prefixIndex; ++i){
                output.push(span);
            }
            result = output.join('');
            return result;
        }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container{
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: space-between;
    // color:rgb(0,188,255);
    font-size:16px;
    // /*! autoprefixer: off */
    //   background:-webkit-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
    // /*! autoprefixer: off */
    // background:-moz-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
    // background:-o-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
    // background:-ms-linear-gradient(left, rgba(232, 241, 151, 0.075) , rgba(129, 235, 185, 0.075), rgba(65, 165, 231, 0.075));
  }
  .bottom-ser{
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: space-between;
    height:calc(100% - 40px);
  }
</style>