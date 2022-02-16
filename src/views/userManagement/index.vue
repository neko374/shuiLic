<template>
  <div class="app-container userContainer">
    <div class="showScreen">
      <div class="filter-container">

        <el-form size="medium" :inline="true" @keyup.enter.native="handleFilter('1')">
          <div style="float:left">
            <el-form-item>
              <el-select
                v-model="countrySelectValue"
                filterable
                clearable
                :placeholder="$t('table.country')"
                @change="handleSelectChange"
              >
                <el-option
                  v-for="item in countrySelectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div style="float:left">
            <el-form-item>
              <el-select
                v-model="provinceSelectValue"
                filterable
                clearable
                :placeholder="$t('table.province')"
                @change="handleSelectChange"
              >
                <el-option
                  v-for="item in provinceSelectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div style="float:left">
            <el-form-item v-if="sessionStorageRoleId==1">
              <el-select
                v-model="affiliatedAgentSelectValue"
                filterable
                clearable
                :placeholder="$t('table.affiliatedAgent')"
                class="TablePageLastFormItem"
                @change="handleSelectChange"
              >
                <el-option
                  v-for="item in affiliatedAgentSelectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div style="float:left">
            <el-button type="success" round size="medium" icon="el-icon-search" @click="handleFilter('1')">
              {{ $t('table.search') }}
            </el-button>
            <el-button type="primary" round size="medium" icon="el-icon-edit" @click="handleCreate">
              新增
            </el-button>
          </div>
        </el-form>

      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        fit
        style="width: 98%;margin:0 10px;"
        size="mini"
        class="tableUser"
        :header-cell-style="{color:'#58ffff','font-size':'0.16rem'}"
        :cell-style="{'font-size':'0.14rem'}"
      >
        <el-table-column :label="$t('table.id')" width="60" type="index" :index="(currentPage-1)*pageSize+1" />
        <el-table-column :label="$t('table.userName')" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.contact')" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.contect }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.contactNum')" min-width="110">
          <template slot-scope="scope">
            <span>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.emailAddress')" min-width="130">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.address')" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.affiliatedAgent')" min-width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.registrationTime')" min-width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="sessionStorageRoleId==1" :label="$t('table.actions')" min-width="160">
          <template slot-scope="{row}">
            <!-- <el-button class="TableButtonDetail" size="mini">
            {{ $t('table.details') }}
          </el-button> -->
            <el-button round size="mini" icon="el-icon-info" type="success" @click="handleUpdate(row)">
              {{ $t('table.edit') }}
            </el-button>
            <el-button round size="mini" type="danger" @click="handleDelete(row)">
              {{ $t('table.delete') }}
            </el-button>
          <!-- <el-button size="mini" class="TableButtonDetail" @click="handleReset(row)">
            {{ $t('table.reset') }}
          </el-button> -->
          </template>
        </el-table-column>
        <el-table-column v-if="sessionStorageRoleId==2" :label="$t('table.actions')" min-width="160">
          <template slot-scope="{row}">
            <!-- <el-button class="TableButtonDetail" size="mini">
            {{ $t('table.details') }}
          </el-button> -->
            <el-button size="mini" class="TableButtonEdit" @click="handleUpdate(row)">
              {{ $t('table.edit') }}
            </el-button>
            <el-button size="mini" class="TableButtonDelete" @click="handleDelete(row)">
              {{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :total="total"
        background
        :page-sizes="[10]"
        layout="total, sizes, prev, pager, next, jumper"
        popper-class="PaginationPageSize"
        class="TablePagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <el-dialog v-if="'Create'==textMap[dialogStatus]" :title="$t('dialog.create')" :visible.sync="dialogFormVisible" custom-class="user-management-diaCr">
        <el-form ref="dataForm" status-icon :rules="rules" :model="temp" size="mini" label-position="left" label-width="140px">
          <el-form-item :label="$t('table.userName')" prop="username">
            <el-input v-model="temp.username" />
          </el-form-item>
          <el-form-item :label="$t('login.password')" prop="newPassword">
            <el-input v-model="temp.newPassword" type="password" show-password />
          </el-form-item>
          <el-form-item :label="$t('table.againPassword')" prop="checkPassword">
            <el-input v-model="temp.checkPassword" type="password" show-password />
          </el-form-item>
          <el-form-item :label="$t('table.nickname')" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <!-- <el-form-item v-if="sessionStorageRoleId==1" :label="$t('table.affiliatedAgent')" prop="createUserId">
          <el-select
            v-model.number="temp.createUserId"
            filterable
            :placeholder="$t('table.affiliatedAgent')"
          >
            <el-option
              v-for="item in affiliatedAgentSelectOptionsDia"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="sessionStorageRoleId==1" label="用户角色" prop="roleId">
          <el-select
            v-model="temp.roleId"
            filterable
            placeholder="用户角色"
          >
            <el-option
              v-for="item in [{value:1,label:'钧灏运维'},{value:2,label:'安装商'},{value:3,label:'用户'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
          <el-form-item :label="$t('table.contact')" prop="contect">
            <el-input v-model="temp.contect" />
          </el-form-item>
          <el-form-item :label="$t('table.contactNum')" prop="mobile">
            <el-input v-model="temp.mobile" />
          </el-form-item>
          <el-form-item :label="$t('table.emailAddress')" prop="email">
            <el-input v-model="temp.email" />
          </el-form-item>
          <el-form-item :label="$t('table.country')" prop="countryAreaid">
            <el-select
              v-model.number="temp.countryAreaid"
              filterable
              clearable
              :placeholder="$t('table.country')"
              @change="countrySelectChange"
            >
              <el-option
                v-for="item in countrySelectOptionsDia"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="(temp.countryAreaid!==''&&temp.countryAreaid!==undefined)" :label="$t('table.province')" prop="provinceAreaid">
            <el-select
              v-model.number="temp.provinceAreaid"
              filterable
              clearable
              :placeholder="$t('table.province')"
            >
              <el-option
                v-for="item in provinceSelectOptionsDia"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.contactAddress')" prop="address">
            <el-input v-model="temp.address" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createData()">
            {{ $t('table.confirm') }}
          </el-button>
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
        </div>
      </el-dialog>

      <el-dialog v-if="'Edit'==textMap[dialogStatus]" :title="$t('dialog.edit')" :visible.sync="dialogFormVisible" custom-class="user-management-diaEdit">
        <el-form ref="dataForm" status-icon :rules="rules" :model="temp" size="mini" label-position="left" label-width="140px">
          <el-form-item :label="$t('table.userName')">
            <span class="MiniDialogReadonlyText">{{ temp.username }}</span>
          </el-form-item>
          <el-form-item :label="$t('table.nickname')" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item v-if="sessionStorageRoleId==1" :label="$t('table.affiliatedAgent')" prop="createUserId">
            <el-select
              v-model.number="temp.createUserId"
              disabled
              filterable
              :placeholder="$t('table.affiliatedAgent')"
            >
              <el-option
                v-for="item in affiliatedAgentSelectOptionsDia"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.contact')" prop="contect">
            <el-input v-model="temp.contect" />
          </el-form-item>
          <el-form-item :label="$t('table.contactNum')" prop="mobile">
            <el-input v-model="temp.mobile" />
          </el-form-item>
          <el-form-item :label="$t('table.emailAddress')" prop="email">
            <el-input v-model="temp.email" />
          </el-form-item>
          <el-form-item :label="$t('table.country')" prop="countryAreaid">
            <el-select
              v-model.number="temp.countryAreaid"
              filterable
              :placeholder="$t('table.country')"
              @change="countrySelectChange"
            >
              <el-option
                v-for="item in countrySelectOptionsDia"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.province')" prop="provinceAreaid">
            <el-select
              v-model.number="temp.provinceAreaid"
              filterable
              :placeholder="$t('table.province')"
            >
              <el-option
                v-for="item in provinceSelectOptionsDia"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.contactAddress')" prop="address">
            <el-input v-model="temp.address" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateData()">
            {{ $t('table.confirm') }}
          </el-button>
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
        </div>
      </el-dialog>

      <el-dialog v-if="'Reset'==textMap[dialogStatus]&&sessionStorageRoleId==1" :title="$t('table.reset')" :visible.sync="dialogFormVisible" custom-class="user-management-diaReset">
        <el-form ref="dataForm" status-icon :rules="rules" :model="temp" size="mini" label-position="left" label-width="140px">
          <el-form-item :label="$t('table.resetAccount')">
            <span class="MiniDialogReadonlyText">{{ temp.username }}</span>
          </el-form-item>
          <el-form-item :label="$t('table.accountRole')">
            <span class="MiniDialogReadonlyText">{{ accountRoles[temp.roleIdList[0]] }}</span>
          </el-form-item>
          <el-form-item :label="$t('table.AIPower')" prop="AIpassword">
            <el-input v-model="temp.AIpassword" type="password" />
          </el-form-item>
          <el-form-item :label="$t('table.newPassword')" prop="newPassword">
            <el-input v-model="temp.newPassword" type="password" show-password autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('table.againNewPassword')" prop="checkPassword">
            <el-input v-model="temp.checkPassword" type="password" show-password autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="resetData()">
            {{ $t('table.confirm') }}
          </el-button>
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { UserManagementGetList, UserManagementAdd, UserManagementUpdate, UserManagementDelete, UserManagementPassword } from '@/api/UserManagement'
import { sysUserManagementInfo } from '@/api/login'
import { CountryInfo, CountryList } from '@/api/CountryManagement'
import { validatePhone } from '@/utils/validate'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.temp.checkPassword !== '') {
          this.$refs.dataForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      maxtotal: 0,
      listLoading: true,
      temp: {
        provinceAreaid: null
      },
      sessionStorageRoleId: this.$store.state.user.roleId,
      sessionStorageUserId: this.$store.state.user.userId,
      accountRoles: ['', '钧灏运维', '安装商', '普通用户'],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        reset: 'Reset'
      },
      rules: {
        username: [{ required: true, message: 'username is required', trigger: 'blur' }],
        name: [{ required: true, message: 'username is required', trigger: 'blur' }],
        createUserId: [{ required: true, message: 'affiliatedAgent is required', trigger: 'change' }],
        contect: [{ required: true, message: 'contact is required', trigger: 'blur' }],
        mobile: [{ required: true, validator: validatePhone, trigger: ['blur', 'change'] }],
        email: [{ required: true, message: 'email is required', trigger: 'blur' }, { type: 'email', message: 'email is not a valid email', trigger: ['blur', 'change'] }],
        address: [{ required: true, message: 'address is required', trigger: 'blur' }],
        countryAreaid: [{ required: true, message: 'country is required', trigger: ['blur', 'change'] }],
        provinceAreaid: [{ required: true, message: 'province is required', trigger: ['blur', 'change'] }],
        newPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
        checkPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        AIpassword: [{ required: true, message: 'please input password', trigger: 'blur' }],
        roleId: [{ required: true, message: 'roleId is required', trigger: 'blur' }]
      },
      // contactSelectValue: [],
      // contactSelectOptions: [],
      countrySelectValue: [],
      countrySelectOptions: [],
      countrySelectOptionsDia: [],
      provinceSelectValue: [],
      provinceSelectOptions: [],
      provinceSelectOptionsDia: [],
      citySelectValue: [],
      citySelectOptions: [],
      affiliatedAgentSelectValue: [],
      affiliatedAgentSelectOptions: [],
      affiliatedAgentSelectOptionsDia: []
    }
  },
  watch: {
    dialogFormVisible(val) {
      if (val) {
        this.provinceSelectOptionsDia = []
      }
    }
  },
  created() {
	  const data = {
      InitOptiList: true
      // roleId: '3'
    }
    this.getList(data)
    this.getOtherSelectOptions()
  },
  methods: {
    getList(data) {
      if (this.sessionStorageRoleId == 2) {
        data.createUserId = this.sessionStorageUserId
      }
      // console.log(data)
      this.listLoading = true
      UserManagementGetList(data).then(response => {
        // console.log("response",response)
        this.currentPage = response.page.currPage
        this.pageSize = response.page.pageSize
        this.total = response.page.totalCount
        this.maxtotal = this.maxtotal > this.total ? this.maxtotal : this.total
        this.totalPage = response.page.totalPage
        const list = response.page.list
        this.list = list
        this.listLoading = false

        var j = 0; var length = this.list.length
        this.TabAgentGetRecursion(j, length)
        if (data.InitOptiList === true) {
          data = {
            page: '1',
            limit: this.maxtotal.toString()
            // roleId: '3'
          }
          if (this.sessionStorageRoleId == 2) {
            data.createUserId = this.sessionStorageUserId
          }
          // console.log(data)
          UserManagementGetList(data).then(response => {
            // console.log(response)
            // this.contactSelectOptionsGet(response.page.list)
            this.countrySelectOptionsGet(response.page.list)
            this.provinceSelectOptionsGet(response.page.list)
            this.affiliatedAgentSelectOptionsGet(response.page.list)
          })
        }
      })
    },
    getOtherSelectOptions() {
      CountryList({}).then(response => {
        const countryLimit = { limit: response.page.totalCount.toString() }
        CountryList(countryLimit).then(response => {
          const dataArea = response.page.list
          this.countrySelectOptionsDia = []
          for (var j = 0; j < dataArea.length; j++) {
            if (dataArea[j].level == 0) {
              this.countrySelectOptionsDia.push({ value: dataArea[j].id, label: dataArea[j].value })
            }
          }
        })
      })
      if (this.sessionStorageRoleId == 2) {
        this.affiliatedAgentSelectOptionsDia.push({ value: this.sessionStorageUserId, label: sessionStorage.userName })
        // console.log(this.affiliatedAgentSelectOptionsDia)
        return
      }
      const dataAgent = {
        page: '1',
        limit: '1'
      }
      UserManagementGetList(dataAgent).then(response => {
        dataAgent.limit = response.page.totalCount.toString()
        UserManagementGetList(dataAgent).then(response => {
          // console.log(response)
          const data = response.page.list
          for (var j = 0; j < data.length; j++) {
            if (data[j].roleIdList[0] !== 3) { this.affiliatedAgentSelectOptionsDia.push({ value: data[j].userId, label: data[j].username }) }
          }
        })
      })
    },
    countrySelectOptionsGet(TempList) {
      var statesValue = []
      var states = []
      var j = 0; var length = TempList.length; var that = this
      countryGetRecursion(j, length)
      function countryGetRecursion(j, length) {
        CountryInfo(TempList[j].countryAreaid).then(response => {
          if (TempList[j].countryAreaid != null && TempList[j].countryAreaid != '' && statesValue.indexOf(TempList[j].countryAreaid) == -1) {
            statesValue.push(TempList[j].countryAreaid)
            states.push([TempList[j].countryAreaid, response.sysArea.value])
            that.countrySelectOptions = states.map(item => {
              return { value: item[0], label: item[1] }
            })
          }
          if (++j < length) {
            countryGetRecursion(j, length)
          }
        })
      }
    },
    provinceSelectOptionsGet(TempList) {
      var statesValue = []
      var states = []
      var j = 0; var length = TempList.length; var that = this
      provinceGetRecursion(j, length)
      function provinceGetRecursion(j, length) {
        CountryInfo(TempList[j].provinceAreaid).then(response => {
          if (TempList[j].provinceAreaid != null && TempList[j].provinceAreaid != '' && statesValue.indexOf(TempList[j].provinceAreaid) == -1) {
            statesValue.push(TempList[j].provinceAreaid)
            states.push([TempList[j].provinceAreaid, response.sysArea.value])
            that.provinceSelectOptions = states.map(item => {
              return { value: item[0], label: item[1] }
            })
          }
          if (++j < length) {
            provinceGetRecursion(j, length)
          }
        })
      }
    },
    affiliatedAgentSelectOptionsGet(TempList) {
      var statesValue = []
      var states = []
      var j = 0; var length = TempList.length; var that = this
      affiliatedAgentGetRecursion(j, length)
      function affiliatedAgentGetRecursion(j, length) {
        sysUserManagementInfo(TempList[j].createUserId).then(response => {
          if (TempList[j].createUserId != null && TempList[j].createUserId != '' && statesValue.indexOf(TempList[j].createUserId) == -1) {
            statesValue.push(TempList[j].createUserId)
            states.push([TempList[j].createUserId, response.user.username])
            that.affiliatedAgentSelectOptions = states.map(item => {
              return { value: item[0], label: item[1] }
            })
          }
          if (++j < length) {
            affiliatedAgentGetRecursion(j, length)
          }
        })
      }
    },
    handleSelectChange() {
      const data = {
        page: '1',
        limit: this.maxtotal.toString()
        // roleId: '3'
      }
      if (this.affiliatedAgentSelectValue != '') {
        data.createUserId = this.affiliatedAgentSelectValue.toString()
      }
      if (this.countrySelectValue != '') {
        data.countryAreaid = this.countrySelectValue.toString()
      }
      if (this.provinceSelectValue != '') {
        data.provinceAreaid = this.provinceSelectValue.toString()
      }
      // console.log(data)
      UserManagementGetList(data).then(response => {
        // console.log(response)
        this.countrySelectOptionsGet(response.page.list)
        this.provinceSelectOptionsGet(response.page.list)
        this.affiliatedAgentSelectOptionsGet(response.page.list)
      })
    },
    handleFilter(page) {
      const data = {
        page: page,
        limit: this.pageSize.toString()
        // roleId: '3'
      }
      if (this.affiliatedAgentSelectValue != '') {
        data.createUserId = this.affiliatedAgentSelectValue.toString()
      }
      if (this.countrySelectValue != '') {
        data.countryAreaid = this.countrySelectValue.toString()
      }
      if (this.provinceSelectValue != '') {
        data.provinceAreaid = this.provinceSelectValue.toString()
      }
      this.getList(data)
    },
    handleSizeChange() {
      this.handleFilter('1')
    },
    handleCurrentChange() {
      this.handleFilter(this.currentPage.toString())
    },
    resetTemp() {
      this.temp = {}
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // var roleID = []
          // roleID.push(3)
          // this.temp.roleIdList = roleID
          this.temp.roleIdList = [2]
          this.temp.status = 1
          this.temp.username = this.temp.username.trim()
          this.temp.password = this.temp.newPassword.trim()
          // if (this.sessionStorageRoleId == 2) {
          //   this.temp.createUserId = this.sessionStorageUserId
          // }
          this.temp.createUserId = this.sessionStorageUserId
          // console.log(this.temp)
          UserManagementAdd(this.temp).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Succeed',
                message: 'Created successfully!',
                type: 'success',
                duration: 2000
              })
              const data = {
                page: this.total % this.pageSize == 0 ? (this.totalPage + 1).toString() : this.totalPage.toString(),
                limit: this.pageSize.toString(),
                // roleId: '3',
                InitOptiList: true
              }
              this.getList(data)
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.$set(this.temp, 'roleId', row.roleIdList[0])
      CountryList({}).then(response => {
        const countryLimit = { limit: response.page.totalCount.toString() }
        CountryList(countryLimit).then(response => {
          const dataArea = response.page.list
          this.provinceSelectOptionsDia = []
          for (var j = 0; j < dataArea.length; j++) {
            if (dataArea[j].pid == this.temp.countryAreaid) {
              this.provinceSelectOptionsDia.push({ value: dataArea[j].id, label: dataArea[j].value })
            }
          }
        })
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.$delete(tempData, 'password')
          this.$delete(tempData, 'salt')
          // console.log(tempData) // for debug
          UserManagementUpdate(tempData).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Succeed',
                message: 'Updated successfully!',
                type: 'success',
                duration: 2000
              })
              this.handleFilter(this.currentPage.toString())
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
    handleDelete(row) {
      if (!confirm('Are you sure to DELETE this user?')) {
        return
      }
      var IDtemp = []
      IDtemp.push(row.userId)
      // console.log(IDtemp) // for debug
      UserManagementDelete(IDtemp).then(response => {
        if (response.code === 0) {
          this.$notify({
            title: 'Succeed',
            message: 'Deleted successfully!',
            type: 'success',
            duration: 2000
          })
          this.maxtotal = this.maxtotal - 1 >= 0 ? this.maxtotal - 1 : 0
          const page = this.currentPage == this.totalPage && this.total % this.pageSize == 1 ? (this.currentPage - 1).toString() : this.currentPage.toString()
          this.handleFilter(page)
        } else {
          this.$notify({
            title: 'Failed',
            message: response.msg,
            type: 'danger',
            duration: 2000
          })
        }
      })
    },
    handleReset(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'reset'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const ResetPassWord = {
            password: this.temp.AIpassword,
            newPassword: this.temp.newPassword
          }
          UserManagementPassword(ResetPassWord).then(response => {
            if (response.code === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Succeed',
                message: 'Deleted successfully!',
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
    TabAgentGetRecursion(j, length) {
      sysUserManagementInfo(this.list[j].createUserId).then(response => {
        this.$set(this.list[j], 'createUserName', response.user.username)
        if (++j < length) {
          this.TabAgentGetRecursion(j, length)
        }
      })
    },
    countrySelectChange() {
      if (this.temp.countryAreaid === '') {
        this.provinceSelectOptionsDia = []
        this.$set(this.temp, 'provinceAreaid', null)
        return
      }
      CountryList({}).then(response => {
        const countryLimit = { limit: response.page.totalCount.toString() }
        CountryList(countryLimit).then(response => {
          const dataArea = response.page.list
          this.provinceSelectOptionsDia = []
          this.$set(this.temp, 'provinceAreaid', null)
          for (var j = 0; j < dataArea.length; j++) {
            if (dataArea[j].pid == this.temp.countryAreaid) {
              this.provinceSelectOptionsDia.push({ value: dataArea[j].id, label: dataArea[j].value })
            }
          }
        })
      })
    }
  }
}
</script>
<style scoped>
  .userContainer{
    background: url("../../assets/bigbg2.png") no-repeat center;
    background-size: 100% 100%;
    height:100%;
  }
  .showScreen {
  height: 100%;
  background: url('../../assets/mainBox19.png') no-repeat center;
  background-size:100% 100%;
}
  .filter-container{
  padding-top:30px;margin-left:10px;
}
</style>
<style>
.tableUser {
  color:#fff;
  background-color:transparent
}
.tableUser tr,.tableUser th{
    background-color:transparent
  }
.userContainer .tableUser tbody tr:hover>td {
    background-color:rgb(76,177,214);
  }
</style>
