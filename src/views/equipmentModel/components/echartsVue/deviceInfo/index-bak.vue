<template>
  <div>
    <el-dialog v-el-drag-dialog v-if="dialogStatus==='create'||dialogStatus==='update'||dialogStatus=='createChild'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="160px">
        <el-form-item label="场站名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="上级设备">
          <span >{{temp[dialogStatus].pidName}}</span>
        </el-form-item>
        <el-form-item label="采集器" prop="snid">
          <!-- <el-input v-model="temp[dialogStatus].snid" /> -->
          <el-select v-model="temp[dialogStatus].snid" placeholder="采集器">
            <el-option
              v-for="item in collectSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item  v-for="(item,index) in deviceField" :key="index+'field'" :label="item.name" >
          <el-input v-model="temp[dialogStatus].ext[item.fieldImd]" style="width:calc(100% - 60px)"/>
          <el-button size="mini" class="TableButtonDelete" @click="fieldDelete(index)">
            删除
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus=='update'?editData(temp[dialogStatus]):createData(temp[dialogStatus])">
          保存
        </el-button>
        <el-button type="primary" @click="addField">
          新增属性
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="设备属性新增" :visible.sync="dialogFormVisibleField" custom-class="user-management-diaCr">
      <el-form ref="dataFormField" status-icon :rules="rulesField" :model="tempField" size="mini" label-position="left" label-width="160px">
        <el-form-item label="设备属性名称" prop="name">
          <!-- <el-input v-model="tempField.name" /> -->
          <el-cascader
            ref='caster'
            v-model="tempField.name"
            filterable
            :show-all-levels="false"
            :options="fieldNameoptions"
            :props="casprops"
            style="width:100%"
            :key="casRefresh"
            ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createField(tempField)">
          确认
        </el-button>
        <el-button type="primary" @click="addFieldName">
          新增
        </el-button>
        <el-button @click="dialogFormVisibleField = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="属性新增" :visible.sync="dialogFormVisibleFieldTwo" custom-class="user-management-diaCr">
      <deviceModel-attribute :fieldNameoptions.sync="fieldNameoptions"/>
      <!-- <el-form ref="dataFormFieldtwo" status-icon :rules="rulesFieldCreate" :model="tempCreateField" size="mini" label-position="left" label-width="160px">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="tempCreateField.name" />
        </el-form-item>
        <el-form-item label="所属分类" prop="fieldFlei">
          <el-select
            v-model="tempCreateField.fieldFlei"
            default-first-option
            placeholder="所属分类">
            <el-option
              v-for="item in FiledFleiOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createCreateField(tempCreateField)">
          确认
        </el-button>
        <el-button @click="dialogFormVisibleFieldTwo = false">
          取消
        </el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { validateLon, validateLat, validatePhoneTwo } from '@/utils/validate'
import { CountryList } from '@/api/CountryManagement'
import { getFarmcfginfoList, getFarmcfginfoSave, getFarmcfginfoUpdate, getFarmcfginfoDelete } from '@/api/mqtt/dianzhan'
import { mqttprojectInfoList } from '@/api/mqtt/projectInfo'
import { mqttprojectCollectorList } from '@/api/mqtt/projectCollector'
import deviceModelAttribute from '../components/deviceModelAttribute'
import { mqttDeviceColumnList, mqttDeviceColumnDelete, mqttDeviceColumnSave, mqttDeviceColumnUpdate } from '@/api/mqtt/aipowerdevicecolumn'
import { mqttDeviceInfoList, mqttDeviceInfoDelete, mqttDeviceInfoSave, mqttDeviceInfoUpdate } from '@/api/mqtt/aipowerdeviceinfo'
import { mqttDeviceTypeList, mqttDeviceTypeDelete, mqttDeviceTypeSave, mqttDeviceTypeUpdate } from '@/api/mqtt/aipowerdevicetype'

export default {
  props: {
    dialogStatusTree: {
      type: String,
      default: ''
    },
    dialogVisibleTree: {
      type: Boolean,
      default: false
    },
    deviceData: {
      type: Object,
      default: {}
    },
    echtreeflag: {
      type: Boolean,
      default: false
    }
  },
  components:{
    deviceModelAttribute
  },
  data() {
    // var validateFiledName=(rule, value, callback)=>{
    //   if(this.deviceField.find(v=>v.fieldImd==value[1])){
    //     return callback(new Error('该设备属性已存在!'));
    //   }else {
    //     callback()
    //   }
    // }
    var validateFiledFlAdd=(rule, value, callback)=>{
      for(let j in this.fieldNameoptions) {
        const com = this.fieldNameoptions[j][this.casprops.children]
        for(let i in com) {
          const comi = com[i]
          if(comi[this.casprops.label]==value) {
            return callback(new Error('该属性已存在!'));
          }
        }
      }
      callback()
    }
    return {
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        update: {},
        create: {},
        createChild:{}
      },
      textMap: {
        update: '编辑',
        create: '创建',
        createChild: '创建子级设备',
      },
      rules: {
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        snid: [{ required: true, message: 'snId is required', trigger: 'blur' }],
        rated: [{ required: true, message: 'Rated is required', trigger: 'blur' }],
        accessType: [{ required: true, message: 'AccessType is required', trigger: ['blur', 'change'] }],
        provinceId: [{ required: true, message: 'Province is required', trigger: ['blur', 'change'] }],
        countryCascaderValue: [{ required: true, message: 'Country is required', trigger: ['blur', 'change'] }],
        cityId: [{ required: true, message: 'City is required', trigger: ['blur', 'change'] }],
        countyId: [{ required: true, message: 'County is required', trigger: ['blur', 'change'] }],
        uname: [{ required: true, message: 'Username is required', trigger: 'blur' }],
        contectname: [{ required: true, message: 'Contact is required', trigger: 'blur' }],
        contecttel: [{ required: true, message: 'Phone Number is required', trigger: 'blur' }, { validator: validatePhoneTwo, trigger: 'blur' }],
        contectaddr: [{ required: true, message: 'Address is required', trigger: 'blur' }],
        voltage: [{ required: true, message: 'Grid Voltage Level is required', trigger: 'blur' }],
        bname: [{ required: true, message: 'Grid Voltage Name is required', trigger: 'blur' }]
        // x: [{ required: true, validator: validateLon, trigger: 'blur' }],
        // y: [{ required: true, validator: validateLat, trigger: 'blur' }]
      },
      rulesField: {
        name:[{ required: true, message: 'Name is required', trigger: 'blur' }
        // ,{validator:validateFiledName, trigger: ['blur','change']}
        ]
      },
      rulesFieldCreate: {
        name:[{ required: true, message: 'Name is required', trigger: 'blur' },{validator:validateFiledFlAdd, trigger: ['blur','change']}],
        fieldFlei:[{ required: true, message: '所属分类不能为空', trigger: 'blur' }]
      },
      countryCascaderOptions: [],
      stationSelectOptions: [],
      citySelectOptions: [],
      countyTableFilter: [],
      projectSelectValue: '',
      collectSelectOptions: [],
      projectSelectOptions: [],
      baseDataFilters: {
        type: 1,
        pid: 0,
        state: 1
      },
      dialogFormVisibleField:false,
      tempField:{},
      deviceField:[],
      deviceFieldLength:0,
      dialogFormVisibleFieldTwo:false,
      tempCreateField:{},
      FiledFleiOptions:[],
      casprops:{
        multiple: true,
        emitPath:false,
        children:'aipowerDeviceColumnEntities',
        value:'ename',
        label:'name'
      },
      casRefresh:1,
      fieldNameoptions:[{
        value:'base',
        label:'基础公共属性',
        children:[{
          value:'rated',
          label:'装机容量'
        },{
          value:'srated',
          label:'开机容量'
        },{
          value:'bname',
          label:'并网名称'
        },{
          value:'voltage',
          label:'电压等级'
        },{
          value:'installTime',
          label:'安装时间'
        },{
          value:'x',
          label:'经度'
        },{
          value:'y',
          label:'纬度'
        }]
      }, {
          value:'yzxx',
          label:'业主信息',
          children:[{
            value:'uname',
            label:'业主'
          },{
            value:'contectname',
            label:'业主联系人'
          },{
            value:'contecttel',
            label:'业主联系方式'
          },{
            value:'contectaddr',
            label:'业主联系地址'
          }]
        },{
          value:'cjxx',
          label:'厂家信息',
          children:[{
            value:'manufactorName',
            label:'厂商'
          },{
            value:'manufactorConcat',
            label:'厂商联系方式'
          },{
            value:'model',
            label:'型号'
          },{
            value:'pp',
            label:'品牌'
          }]
        },{
          value:'xzqy',
          label:'行政区域',
          children:[{
            value:'areaId',
            label:'国家'
          },{
            value:'provinceId',
            label:'省'
          },{
            value:'cityId',
            label:'市'
          },{
            value:'countyId',
            label:'县'
          }]
        }, {
        value:'pv',
        label:'光伏设备属性',
        children:[{
          value:'nbq',
          label:'光伏组件设备属性',
          children:[{
            value:'ns',
            label:'组件串联数'
          },{
            value:'np',
            label:'组件并联数'
          },{
            value:'dpgl',
            label:'单片功率'
          }]
        }]
      }, {
        value:'hess',
        label:'储能设备属性',
        children:[{
          value:'cjhess',
          label:'超级电容器储能'
        },{
          value:'hessnz',
          label:'电池内阻'
        },{
          value:'ratedCapacity',
          label:'额定容量'
        }]
      }, {
        value:'hydro',
        label:'水电设备属性',
        children:[]
      }]
    }
  },
  watch: {
    dialogStatusTree(val) {
      this.deviceField = []
      this.deviceFieldLength = 0
      this.dialogStatus = val
    },
    dialogVisibleTree(val) {
      if (val) {
        this.getDialogList()
      }
    },
    dialogFormVisible(val) {
      this.$emit('update:dialogVisibleTree', val)
    },
    fieldNameoptions:{
      handler(val) {
        this.casRefresh++
      },
      deep:true
    }
  },
  async created() {
    const projectId = (await this.$store.dispatch('project/defaultProjectSGet')).id
    if (projectId) this.projectSelectValue = projectId
    this.getDialogList()
    this.getCountryCascader()
    this.getOtherSelectOptions()
    this.getDeviceTypeOptions()
  },
  methods: {
    getList() {
      this.$emit('changeTree')
    },
    getDeviceTypeOptions() {
      const data = {}
      mqttDeviceTypeList(data).then(response=>{
        if(response.code===0) {
          data.limit = response.page.totalCount + ''
          mqttDeviceTypeList(data).then(response=>{
            if(response.code===0) {
              const res = response.page.list
              this.fieldNameoptions = res
            }
          })
        }
      })
    },
    getDialogList() {
      if (this.dialogStatusTree == 'update') {
        const res = { ...this.deviceData, countryCascaderValue: [this.deviceData.cityId, this.deviceData.countyId] }
        this.handleUpdate(res)
      } else if (this.dialogStatusTree == 'create') {
        this.handleCreate()
      } else if (this.dialogStatusTree == 'delete') {
        this.handleDelete(this.deviceData)
      } else if (this.dialogStatusTree == 'createChild') {
        this.handleCreateChild()
      }
    },
    addField() {
      this.fieldNameoptions.forEach(val=>{
        if(!val[this.casprops.children]) {
          val[this.casprops.children] = []
        }
      })
      const abc = (dataAbc,deviceField)=> {
        dataAbc.forEach(val=>{
          if(val[this.casprops.children]) {
            abc(val[this.casprops.children],deviceField)
            this.$set(val,'disabled',!val[this.casprops.children].find(v=>!v.disabled))
          } else {
            if(deviceField.find(v=>val[this.casprops.label]==v.name)) {
              this.$set(val,'disabled',true)
            } else {
              this.$set(val,'disabled',false)
            }
          }
        })
      }
      abc(this.fieldNameoptions,this.deviceField)
      // console.log(this.fieldNameoptions)
      this.dialogFormVisibleField = true
      this.$nextTick(() => {
        this.$refs['dataFormField'].clearValidate()
      })
    },
    createField(data) {
      // console.log(data,this.$refs['caster'].getCheckedNodes());return;
      this.$refs['dataFormField'].validate((valid) => {
        if (valid) {
          const filedName = this.$refs['caster'].getCheckedNodes().map(v=>({value:v.value,label:v.label}))
          const opt = data.name.map(v=>({
            name:filedName.filter(l=>l.value==v)[0].label,
            fieldImd:v
          }))
          this.deviceField.push.apply(this.deviceField,opt)
          this.casRefresh++
          this.tempField = {}
          this.dialogFormVisibleField = false
        }
      })
    },
    fieldDelete(index) {
      this.deviceField.splice(index,1)
    },
    addFieldName() {
      this.FiledFleiOptions = this.fieldNameoptions.map(v=>({value:v[this.casprops.value],label:v[this.casprops.label]}))
      this.tempCreateField = {
        fieldFlei:this.FiledFleiOptions[0][this.casprops.value]
      }
      this.dialogFormVisibleFieldTwo = true
      // this.$nextTick(() => {
      //   this.$refs['dataFormFieldtwo'].clearValidate()
      // })
    },
    createCreateField(data) {
      this.$refs['dataFormFieldtwo'].validate((valid) => {
        if (valid) {
          for(let j in this.fieldNameoptions) {
            const com = this.fieldNameoptions[j]
            if(com.value==data.fieldFlei) {
              com.children.push({
                value:com.value+com.children.length,
                label:data.name
              })
            }
          }
          this.tempCreateField = {}
          this.dialogFormVisibleFieldTwo = false
        }
      })
    },
    getCountryCascader() {
      CountryList({}).then(response => {
        if (response.code === 0) {
          CountryList({ limit: response.page.totalCount.toString() }).then(response => {
            const res = response.page.list
            let countryPid
            for (const j in res) {
              if (res[j].value === '河北') {
                countryPid = res[j].id
                this.provinceId = countryPid
                break
              }
            }
            function xunh(_pid, _res) {
              return _res.reduce((pre, cur, index, arr) => {
                if (cur.pid == _pid) {
                  pre.push({ value: cur.id, label: cur.value })
                  if (cur.level != 3) {
                    const child = xunh(cur.id, arr)
                    if (child.length !== 0) { pre[pre.length - 1].children = child }
                  }
                }
                return pre
              }, [])
            }
            this.countryCascaderOptions = xunh(countryPid, res)
          })
        }
      })
    },
    getOtherSelectOptions() {
      // mqttprojectInfoList({ limit: '1' }).then(response => {
      //   if (response.code === 0) {
      //     const data1 = { limit: response.page.totalCount.toString() }
      //     mqttprojectInfoList(data1).then(response => {
      //       if (response.code === 0) {
      //         const res = response.page.list
      //         this.projectSelectOptions = res.map(item => ({ value: item.id, label: item.name }))
      //       }
      //     })
      //   }
      // })
      mqttprojectCollectorList({ limit: '1' }).then(response => {
        mqttprojectCollectorList({
          limit: response.page.totalCount.toString()
        }).then(response => {
          const res = response.page.list
          this.collectSelectOptions = res.map(item => ({ value: item.snId, label: item.name }))
        })
      })
      // const dataFcg = {
      //   limit: '1',
      //   ...this.baseDataFilters,
      //   projectId: this.projectSelectValue
      // }
      // getFarmcfginfoList(dataFcg).then(response => {
      //   dataFcg.limit = response.page.totalCount.toString()
      //   getFarmcfginfoList(dataFcg).then(response => {
      //     const res = response.page.list
      //     this.stationSelectOptions = res.map(item => ({ value: item.id, label: item.name }))
      //     this.getSelectOptions(res, 'citySelectOptions', 'cityId', 'cityName')
      //     this.getSelectOptions(res, 'countyTableFilter', 'countyId', 'countyName')
      //   })
      // })
    },
    // 选择框选项
    getSelectOptions(data, options, valueName, labelName) {
      const values = []
      this[options] = data.reduce((pre, cur) => {
        if (values.indexOf(cur[valueName]) === -1) {
          values.push(cur[valueName])
          pre.push({ value: cur[valueName], label: cur[labelName], text: cur[labelName] })
        }
        return pre
      }, [])
    },
    handleCreate() {
      this.temp.create = {
        pidName:this.deviceData.pidName,
        pid:this.deviceData.pid,
        refProjectId:this.projectSelectValue,
        ext:{}
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateChild() {
      this.temp.createChild = {
        pidName:this.deviceData.name,
        pid:this.deviceData.id,
        refProjectId:this.projectSelectValue,
        ext:{}
      }
      this.dialogStatus = 'createChild'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      let data = { ...row }
      if(data.ext==null||data.ext==undefined) {
        data.ext = {}
      } else{
        data.ext = JSON.parse(data.ext)
        // console.log(data.ext)
        this.deviceField = []
        for(let key in data.ext) {
          const comkey = data.ext[key]
          const nhgj = data.aipowerDeviceTypeEntity.aipowerDeviceColumnEntities.filter(v=>v.ename==key)
          let name = ''
          if(nhgj.length>0) name = nhgj[0].name
          this.deviceField.push({
            fieldImd:key,
            name:name
          })
        }
      }
      this.temp.update = data
      console.log(this.temp.update)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.dialogFormVisible = true
      this.$confirm('此操作将永久删除该场站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return;
        const data = [row.id]
        getFarmcfginfoDelete(data).then(response => {
          if (response.code === 0) {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Succeed',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Failed',
              message: response.msg,
              type: 'danger',
              duration: 2000
            })
          }
        })
      }).catch(() => {
        this.dialogFormVisible = false
        this.$notify.info({
          title: '消息',
          message: '已取消删除',
          duration: 2000
        })
      })
    },
    createData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // data.areaId = 0
          // data.provinceId = this.provinceId
          // data.cityId = data.countryCascaderValue[0]
          // data.countyId = data.countryCascaderValue[1]
          // delete data.countryCascaderValue
          data.state = 1
          data.ext = JSON.stringify(data.ext)
          // console.log(data);return;
          mqttDeviceInfoSave(data).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.temp.create = {
                pidName:this.deviceData.pidName,
                pid:this.deviceData.pid,
                refProjectId:this.projectSelectValue,
                ext:{}
              }
              this.getList()
              this.$notify({
                title: 'Succeed',
                message: '创建成功!',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'Failed',
                message: response.msg,
                type: 'danger',
                duration: 2000
              })
            }
          })
        }
      })
    },
    editData({ ...data }) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          data.ext = JSON.stringify(data.ext)
          // data.cityId = data.countryCascaderValue[0]
          // data.countyId = data.countryCascaderValue[1]
          // delete data.countryCascaderValue
          mqttDeviceInfoUpdate(data).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: 'Succeed',
                message: '编辑成功!',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'Failed',
                message: response.msg,
                type: 'danger',
                duration: 2000
              })
            }
          })
        }
      })
    }
  }
}
</script>
