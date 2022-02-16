<template>
  <div>
    <el-dialog v-el-drag-dialog v-if="dialogStatus==='create'||dialogStatus==='update'||dialogStatus=='createChild'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="160px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="temp[dialogStatus].deviceId" />
        </el-form-item>
        <el-form-item label="设备图片" prop="picurl">
          <el-upload
          style="float:left;"
            class="upload-demo"
            action="string"
            :show-file-list="false"
            :http-request="uploadImage"
            :on-preview="handlePreview"
            :file-list="temp[dialogStatus].fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-image
            style="height:32px;float:left;width:calc(100% - 85px);"
            :src="deviceImgUrl"
            fit="contain">
            <!-- <div slot="placeholder" class="image-slot">
              该设备暂无图片
            </div> -->
            <div slot="error" class="image-slot">
              
            </div>
          </el-image>
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
        <el-form-item label="设备类型" prop="refDeviceTypeId">
          <el-cascader
            ref='caster'
            v-model="temp[dialogStatus].refDeviceTypeId"
            filterable
            :show-all-levels="false"
            :options="deviceTypeSelectOptions"
            :props="casprops"
            :key="casRefresh"
            @change="deviceTypeChange"
            ></el-cascader>
            <el-button type="primary" @click="addFieldName">
              设备新增
            </el-button>
        </el-form-item>
        <el-form-item label="属性选择" prop="attributeSelection">
          <!-- <el-input v-model="temp[dialogStatus].snid" /> -->
          <el-select
            v-model="temp[dialogStatus].attributeSelection"
            multiple
            collapse-tags
            @change="attributeChange"
            placeholder="属性选择">
            <el-option
              v-for="item in attributeSelectionSelectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.ename"
            />
          </el-select>
          <el-button type="primary" @click="addFieldNameColumn">
            属性新增
          </el-button>
        </el-form-item>
        <el-form-item  v-for="(item,index) in deviceField" :key="index+'field'" :label="item.name" >
          <el-input v-model="temp[dialogStatus].ext[item.fieldImd]" style="width:calc(100% - 60px)"/>
          <el-button size="mini" class="TableButtonDelete" @click="fieldDelete(index,item)">
            删除
          </el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus=='update'?editData(temp[dialogStatus]):createData(temp[dialogStatus])">
          保存
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="设备新增" :visible.sync="dialogFormVisibleFieldTwo" custom-class="user-management-diaCr">
      <deviceModel-attribute :fieldNameoptions.sync="deviceTypeSelectOptions" :pidSelectOptions.sync="fieldNameoptions"/>
    </el-dialog>

    <el-dialog title="属性新增" :visible.sync="dialogFormVisibleFieldThree" custom-class="user-management-diaCr">
      <deviceModel-attribute-column :fieldNameoptions.sync="fieldNameoptions"/>
      <!-- <el-form ref="dataFormShux" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="160px">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="属性英文名称">
          <span >{{temp[dialogStatus].ename}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus=='update'?editData(temp[dialogStatus]):createData(temp[dialogStatus])">
          保存
        </el-button>
        <el-button @click="dialogFormVisible = false">
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
import deviceModelAttribute from './components/deviceModelAttribute'
import deviceModelAttributeColumn from './components/deviceModelAttributeColumn'
import { mqttDeviceColumnList, mqttDeviceColumnDelete, mqttDeviceColumnSave, mqttDeviceColumnUpdate } from '@/api/mqtt/aipowerdevicecolumn'
import { mqttDeviceInfoList, mqttDeviceInfoDelete, mqttDeviceInfoSave, mqttDeviceInfoUpdate, mqttDeviceInfoUpload } from '@/api/mqtt/aipowerdeviceinfo'
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
      default: ()=>{}
    },
    echtreeflag: {
      type: Boolean,
      default: false
    },
    projectId:{
      type:String|Number,
      default:''
    }
  },
  components:{
    deviceModelAttribute,
    deviceModelAttributeColumn
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
        deviceId: [{ required: true, message: '设备ID不能为空', trigger: 'blur' }],
        snid: [{ required: true, message: 'snId is required', trigger: 'blur' }],
        refDeviceTypeId: [{ required: true, message: '设备类型不能为空', trigger: 'blur' }]
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
      dialogFormVisibleFieldThree:false,
      tempCreateField:{},
      FiledFleiOptions:[],
      casprops:{
        // multiple: true,
        emitPath:false,
        checkStrictly:true,
        children:'children',
        value:'id',
        label:'name'
      },
      casRefresh:1,
      fieldNameoptions:[],
      deviceTypeSelectOptions:[],
      attributeSelectionSelectOptions:[]
    }
  },
  watch: {
    dialogStatusTree(val) {
      this.deviceField = []
      this.dialogStatus = val
    },
    dialogVisibleTree(val) {
      if (val) {
        this.getDialogList()
        if(this.collectSelectOptions.length==0) {
          this.getOtherSelectOptions()
        }
        if(this.deviceTypeSelectOptions.length==0) {
          this.getDeviceTypeOptions()
        }
      }
    },
    dialogFormVisible(val) {
      this.$emit('update:dialogVisibleTree', val)
    },
    deviceTypeSelectOptions:{
      handler(val) {
        this.casRefresh++
      },
      deep:true
    },
    fieldNameoptions:{
      handler(val) {
        if(this.dialogStatus in this.temp) {
          const datasdf = this.fieldNameoptions.filter(v=>v.id==this.temp.update.refDeviceTypeId)
          if(datasdf&&datasdf.length>0)
            this.attributeSelectionSelectOptions = datasdf[0].aipowerDeviceColumnEntities || []
          else
            this.attributeSelectionSelectOptions = []
          this.attributeChange(this.temp[this.dialogStatus].attributeSelection)
        }
      },
      deep:true
    },
    'temp.update.refDeviceTypeId'(val) {
      const datasdf = this.fieldNameoptions.filter(v=>v.id==this.temp.update.refDeviceTypeId)
      if(datasdf&&datasdf.length>0)
        this.attributeSelectionSelectOptions = datasdf[0].aipowerDeviceColumnEntities || []
      else
        this.attributeSelectionSelectOptions = []
    },
    projectId(val) {
      this.projectSelectValue = val
    }
  },
  computed: {
    deviceImgUrl() {
      if(this.temp[this.dialogStatus].picurl)
        return $_imgUrl + this.temp[this.dialogStatus].picurl
      else
        return ''
    }
  },
  async created() {
    // this.getDialogList()
    // this.getCountryCascader()
    // this.getOtherSelectOptions()
    // this.getDeviceTypeOptions()
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
              let seriesData = []
              if (res.length > 0) {
                res.forEach(val => {
                  if (val.pid == 0) {
                    const acd = {...val}
                    this.getListFilter(acd, res)
                    seriesData.push(acd)
                  }
                })
                this.deviceTypeSelectOptions = seriesData
                // console.log(seriesData)
              } else {
                this.deviceTypeSelectOptions = []
              }
            }
          })
        }
      })
    },
    getListFilter(data, res) {
      res.forEach(val => {
        if (data.id == val.pid) {
          const acd = {...val,pidName:data.name}
          if (!data.children) data.children = []
          data.children.push(acd)
          this.getListFilter(acd, res)
        }
      })
    },
    getDialogList() {
      if (this.dialogStatusTree == 'update') {
        const res = {
          ...this.deviceData,
          // countryCascaderValue: [this.deviceData.cityId, this.deviceData.countyId]
        }
        this.handleUpdate(res)
      } else if (this.dialogStatusTree == 'create') {
        this.handleCreate()
      } else if (this.dialogStatusTree == 'delete') {
        this.handleDelete(this.deviceData)
      } else if (this.dialogStatusTree == 'createChild') {
        this.handleCreateChild()
      }
    },
    deviceTypeChange(val) {
      const data = this.fieldNameoptions.filter(v=>v.id==val)
      if(data.length==0) this.attributeSelectionSelectOptions = []
      else
        this.attributeSelectionSelectOptions = data[0].aipowerDeviceColumnEntities || []
      this.temp[this.dialogStatus].attributeSelection = this.attributeSelectionSelectOptions.map(v=>v.ename)
      this.temp[this.dialogStatus].ext = {}
      this.attributeChange(this.temp[this.dialogStatus].attributeSelection)
    },
    attributeChange(val) {
      const opt = val.reduce((pre,v)=>{
        let hbg = this.attributeSelectionSelectOptions.filter(l=>l.ename==v)
        if(hbg&&hbg.length>0) {
          pre.push({
            name:hbg[0].name,
            fieldImd:v
          })
        }
        return pre
      },[])
      this.deviceField = opt
      for(let key in this.temp[this.dialogStatus].ext) {
        if(!this.deviceField.find(v=>v.fieldImd==key)) {
          delete this.temp[this.dialogStatus].ext[key]
        }
      }
    },
    fieldDelete(index,item) {
      delete this.temp[this.dialogStatus].ext[item.fieldImd]
      this.temp[this.dialogStatus].attributeSelection.splice(index,1)
      this.temp[this.dialogStatus].attributeSelection = [...this.temp[this.dialogStatus].attributeSelection]
      this.attributeChange(this.temp[this.dialogStatus].attributeSelection)
    },
    addFieldName() {
      this.dialogFormVisibleFieldTwo = true
    },
    addFieldNameColumn() {
      this.dialogFormVisibleFieldThree = true
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
      mqttprojectCollectorList({ limit: '1', projectId:this.projectSelectValue }).then(response => {
        mqttprojectCollectorList({
          limit: response.page.totalCount.toString(),
          projectId:this.projectSelectValue
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
        ...this.temp.create,
        pidName:this.deviceData.pidName,
        pid:this.deviceData.pid,
        refProjectId:this.projectSelectValue,
        ext:this.temp.create.ext || {}
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateChild() {
      this.temp.createChild = {
        ...this.temp.createChild,
        pidName:this.deviceData.name,
        pid:this.deviceData.id,
        refProjectId:this.projectSelectValue,
        ext:this.temp.createChild.ext || {}
      }
      this.dialogStatus = 'createChild'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      let dataList = { ...row }
      mqttDeviceInfoList({id:dataList.id}).then(response=>{
        let data = response.page.list[0] || {}
        data.pidName = row.pidName
        if(data.ext==null||data.ext==undefined) {
          data.ext = {}
        } else{
          data.ext = JSON.parse(data.ext)
          // console.log(data.ext)
          this.deviceField = []
          for(let key in data.ext) {
            const comkey = data.ext[key]
            let nhgj = []
            if(data.aipowerDeviceTypeEntity.aipowerDeviceColumnEntities)
              nhgj = data.aipowerDeviceTypeEntity.aipowerDeviceColumnEntities.filter(v=>v.ename==key)
            let name = ''
            if(nhgj.length>0) name = nhgj[0].name
            this.deviceField.push({
              fieldImd:key,
              name:name
            })
          }
        }
        this.temp.update = data
        this.temp.update.attributeSelection = this.deviceField.map(v=>v.fieldImd)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleDelete(row) {
      this.dialogFormVisible = true
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = [row.id]
        mqttDeviceInfoDelete(data).then(response => {
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
          const jsdata = {
            deviceId:data.deviceId
          }
          mqttDeviceInfoList(jsdata).then(response=>{
            if(response.code==0) {
              if(response.page.list.length==0) {
                // data.areaId = 0
                // data.provinceId = this.provinceId
                // data.cityId = data.countryCascaderValue[0]
                // data.countyId = data.countryCascaderValue[1]
                // delete data.countryCascaderValue
                delete data.attributeSelection
                delete data.pidName
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
                    this.temp.createChild = {
                      pidName:this.deviceData.name,
                      pid:this.deviceData.id,
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
              } else {
                this.$notify({
                  title: 'Failed',
                  message: '该设备ID已存在',
                  type: 'danger',
                  duration: 2000
                })
              }
            } else {
              this.$notify({
                title: 'Failed',
                message: '创建失败',
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
          const jsdata = {
            deviceId:data.deviceId
          }
          mqttDeviceInfoList(jsdata).then(response=>{
            // console.log(response)
            if(response.code===0) {
              const res = response.page.list
              if(res.length==0||res[0].id==data.id) {
                data.ext = JSON.stringify(data.ext)
                // data.cityId = data.countryCascaderValue[0]
                // data.countyId = data.countryCascaderValue[1]
                // delete data.countryCascaderValue
                delete data.attributeSelection
                delete data.pidName
                // console.log(data);return;
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
              } else {
                this.$notify({
                  title: 'Failed',
                  message: '该设备ID已存在',
                  type: 'danger',
                  duration: 2000
                })
              }
            } else {
              this.$notify({
                title: 'Failed',
                message: '更新失败',
                type: 'danger',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadImage(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      mqttDeviceInfoUpload(formData).then(response=>{
        const res = response['文件上传结果']
        this.temp[this.dialogStatus].picurl = res.filePath.match(/root\/www\/image(\S*)/)[1]
      })
    }
  }
}
</script>
