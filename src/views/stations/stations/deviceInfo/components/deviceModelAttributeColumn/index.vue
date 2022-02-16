<template>
  <div class="app-container">
    <!-- <el-form :inline="true">
      <div>
        <el-button class="TablePageButtonAdd" size="medium" icon="el-icon-edit" @click="handleCreate">
          新增根节点
        </el-button>
      </div>
    </el-form> -->
    <el-tree
      :expand-on-click-node="false"
      :data="list"
      :props="defaultProps"
      @node-click="handleNodeClick">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="!data.refDeviceTypeId"
            type="text"
            size="mini"
            @click="() => append(data)">
            新增子节点
          </el-button>
          <el-button
            v-if="data.refDeviceTypeId"
            type="text"
            size="mini"
            @click="() => edit(node,data)">
            修改
          </el-button>
          <el-button
            v-if="data.refDeviceTypeId"
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog append-to-body v-if="dialogStatus==='create'||dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
        <el-form-item label="节点英文名称" prop="ename">
          <el-input v-if="dialogStatus==='create'" v-model="temp[dialogStatus].ename" />
          <span v-else>{{temp[dialogStatus].ename}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData(temp.create):updateData(temp.update)">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog append-to-body v-if="dialogStatus==='createOpt'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rulesopt" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createDataOpt(temp.createOpt)">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mqttDeviceTypeList, mqttDeviceTypeDelete, mqttDeviceTypeSave, mqttDeviceTypeUpdate } from '@/api/mqtt/aipowerdevicetype'
import { mqttDeviceColumnList, mqttDeviceColumnDelete, mqttDeviceColumnSave, mqttDeviceColumnUpdate } from '@/api/mqtt/aipowerdevicecolumn'

export default {
  props:{
    fieldNameoptions:{
      type:Array,
      default:()=>[]
    }
  },
  watch:{
    fieldNameoptions:{
      handler(val) {
        this.list = val
      },
      deep:true
    },
    list:{
      handler(val) {
        this.$emit('update:fieldNameoptions',val)
      },
      deep:true
    }
  },
  data() {
    var valiTreeChildren = (rule, value, callback)=>{
      if(this.temp[this.dialogStatus].pidData.aipowerDeviceColumnEntities){
        let isCz = false
        if(this.dialogStatus=='update') {
          isCz = this.temp[this.dialogStatus]
          .pidData.aipowerDeviceColumnEntities.find(v=>v.name==value&&v.id!=this.temp[this.dialogStatus].id)
        } else{
          isCz = this.temp[this.dialogStatus]
          .pidData.aipowerDeviceColumnEntities.find(v=>v.name==value)
        }
        // console.log(isCz)
        if(isCz) {
          return callback(new Error('该设备属性已存在!'));
        }
      }
      callback()
    }
    return {
      listLoading:false,
      defaultProps:{
        children:'aipowerDeviceColumnEntities',
        value:'id',
        label:'name'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        create: {},
        update: {},
        createOpt:{}
      },
      textMap: {
        update: '修改',
        create: '新增',
        createOpt:'新增'
      },
      rules:{
        name: [{ required: true, message: 'Name is required', trigger: 'blur' },{ validator:valiTreeChildren, trigger: 'change' }],
      },
      rulesopt:{
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
      },
      list:this.fieldNameoptions
    }
  },
  methods:{
    getList() {
      const data = {}
      mqttDeviceTypeList(data).then(response=>{
        if(response.code===0) {
          data.limit = response.page.totalCount + ''
          mqttDeviceTypeList(data).then(response=>{
            if(response.code===0) {
              const res = response.page.list
              this.list = res
            }
          })
        }
      })
    },
    handleNodeClick() {},
    append(data) {
      this.temp.create = {
        pidData:data
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    edit(node,data) {
      this.temp.update = {...data,
      pidData:node.parent.data}
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.dialogStatus = 'createOpt'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    remove(node, data) {
      this.$confirm('此操作将永久删除该设备属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const dataa = [data.id]
        mqttDeviceColumnDelete(dataa).then(response => {
          if (response.code === 0) {
            this.getList()
            // const parent = node.parent;
            // const children = parent.data.children || parent.data;
            // const index = children.findIndex(d => d.label === data.label);
            // children.splice(index, 1);
            this.$notify({
              title: 'Succeed',
              message: '删除成功',
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
      }).catch(() => {
        this.$notify.info({
          title: '消息',
          message: '已取消删除',
          duration: 2000
        })
      })
    },
    createData(data) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // if (!data.pidData[this.defaultProps.children]) {
          //   this.$set(data.pidData, this.defaultProps.children, []);
          // }
          const newChild = {
            ename:data.ename || 'rootNode_'+(data.pidData[this.defaultProps.children]==null?0:data.pidData[this.defaultProps.children].length),
            name: data.name,
            state:1,
            refDeviceTypeId:data.pidData.id,
            createtime:new Date().format('yyyy-MM-dd HH:mm:ss'),
            sort:(data.pidData[this.defaultProps.children]==null?0:data.pidData[this.defaultProps.children].length)
          };
          // data.pidData[this.defaultProps.children].push(newChild);
          // console.log(newChild);return;
          mqttDeviceColumnSave(newChild).then(response=>{
            if(response.code===0) {
              this.dialogFormVisible = false
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
                message: '创建失败',
                type: 'danger',
                duration: 2000
              })
            }
          })
        }
      })
    },
    updateData(data) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const newChild = {
            ...data,
            updatetime:new Date().format('yyyy-MM-dd HH:mm:ss')
          };
          // data.pidData[this.defaultProps.children].push(newChild);
          // console.log(newChild);return;
          mqttDeviceColumnUpdate(newChild).then(response=>{
            if(response.code===0) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: 'Succeed',
                message: '修改成功!',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'Failed',
                message: '修改失败',
                type: 'danger',
                duration: 2000
              })
            }
          })
        }
      })
    },
    createDataOpt(data) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const newChild = {
            name: data.name,
            state:1,
            type:0,
            pid:0,
            createtime:new Date().format('yyyy-MM-dd HH:mm:ss')
          };
          // this.list.push(newChild)
          // console.log(newChild);return;
          mqttDeviceTypeSave(newChild).then(response=>{
            if(response.code===0) {
              this.dialogFormVisible = false
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
                message: '创建失败',
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
