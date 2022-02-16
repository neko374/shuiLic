<template>
  <div class="app-container">
    <el-form :inline="true">
      <div>
        <el-button class="TablePageButtonAdd" size="medium" icon="el-icon-edit" @click="handleCreate">
          新增根节点
        </el-button>
      </div>
    </el-form>
    <el-tree
      :expand-on-click-node="false"
      :data="list"
      :props="defaultProps"
      @node-click="handleNodeClick">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            新增子节点
          </el-button>
          <!-- <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button> -->
        </span>
      </span>
    </el-tree>

    <el-dialog append-to-body v-if="dialogStatus==='create'||dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
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
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="140px">
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
import { mqttDeviceColumnList, mqttDeviceColumnDelete, mqttDeviceColumnSave, mqttDeviceColumnUpdate } from '@/api/mqtt/aipowerdevicecolumn'
import { mqttDeviceTypeList, mqttDeviceTypeDelete, mqttDeviceTypeSave, mqttDeviceTypeUpdate } from '@/api/mqtt/aipowerdevicetype'

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
    return {
      listLoading:false,
      defaultProps:{
        children:'aipowerDeviceColumnEntities',
        value:'ename',
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
        update: '新增',
        create: '创建',
        createOpt:'新增'
      },
      rules:{},
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
    handleCreate() {
      this.dialogStatus = 'createOpt'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.label === data.label);
      children.splice(index, 1);
    },
    createData(data) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!data.pidData[this.defaultProps.children]) {
            this.$set(data.pidData, this.defaultProps.children, []);
          }
          const newChild = {
            ename:'rootNode_'+data.pidData[this.defaultProps.children].length,
            name: data.name,
            state:1,
            refDeviceTypeId:data.pidData.id,
            createtime:new Date().format('yyyy-MM-dd HH:mm:ss')
          };
          // data.pidData[this.defaultProps.children].push(newChild);
          // console.log(newChild,data);return;
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
    createDataOpt(data) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const newChild = {
            // ename:'other_'+this.list.length,
            name: data.name,
            state:1,
            type:0,
            createtime:new Date().format('yyyy-MM-dd HH:mm:ss')
          };
          // this.list.push(newChild)
          // console.log(newChild)
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
