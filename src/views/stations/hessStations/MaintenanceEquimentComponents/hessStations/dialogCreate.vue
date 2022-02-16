<template>
  <div>
    <el-dialog v-if="dialogStatus==='create'||dialogStatus==='update'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
      <el-form ref="dataForm" status-icon :rules="rules" :model="temp[dialogStatus]" size="mini" label-position="left" label-width="160px">
        <el-form-item label="场站名称" prop="name">
          <el-input v-model="temp[dialogStatus].name" />
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
        <el-form-item label="装机容量(kW)" prop="rated">
          <el-input v-model="temp[dialogStatus].rated" />
        </el-form-item>
        <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="temp[dialogStatus].projectId" placeholder="所属项目">
            <el-option
              v-for="item in projectSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="countryCascaderValue" label="城市">
          <el-cascader
            v-model="temp[dialogStatus].countryCascaderValue"
            :options="countryCascaderOptions"
          />
        </el-form-item>
        <el-form-item label="业主" prop="uname">
          <el-input v-model="temp[dialogStatus].uname" />
        </el-form-item>
        <el-form-item label="联系人" prop="contectname">
          <el-input v-model="temp[dialogStatus].contectname" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contecttel">
          <el-input v-model="temp[dialogStatus].contecttel" />
        </el-form-item>
        <el-form-item label="联系地址" prop="contectaddr">
          <el-input v-model="temp[dialogStatus].contectaddr" />
        </el-form-item>
        <el-form-item label="并网电压等级(kV)" prop="voltage">
          <el-input v-model="temp[dialogStatus].voltage" />
        </el-form-item>
        <el-form-item label="并网名称" prop="bname">
          <el-input v-model="temp[dialogStatus].bname" />
        </el-form-item>
        <el-form-item label="经度" prop="x">
          <el-input v-model="temp[dialogStatus].x" />
        </el-form-item>
        <el-form-item label="纬度" prop="y">
          <el-input v-model="temp[dialogStatus].y" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dcreateData(temp[dialogStatus])">
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
export default {
  data() {
    return {
      dialogFormVisible: false,
      innerVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        snid: [{ required: true, message: 'Id is required', trigger: 'blur' }],
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
      temp: {
        create: {},
        update: {}
      }
    }
  },
  methods: {
    createData() {}
  }
}
</script>
