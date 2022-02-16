<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      size="mini"
    >
      <el-table-column label="序号" width="50" type="index" :index="(currentPage-1)*pageSize+1" />
      <el-table-column label="文件名" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.fileTimeStr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.fileSize | fileSizeFilters }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="文件路径" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.filePath }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="操作" width="60">
        <template slot-scope="{row}">
          <el-button size="mini" class="TableButtonView" @click="download(row)">
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :total="total"
      background
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      popper-class="PaginationPageSize"
      class="TablePagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mqttsoftwareInfoList, mqttDownloadFile, mqttGetDownloadFiles } from '@/api/mqtt/softwareInfo'
import { mqttprojectCollectorList } from '@/api/mqtt/projectCollector'
import { selectOptionFilter } from '@/filters'

export default {
  filters: {
    fileSizeFilters(val) {
      return Number(val / 1000).toFixed(2) + 'kb'
    }
  },
  props: ['xmId'],
  data() {
    return {
      list: null,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      total: 0,
      maxtotal: 0,
      listLoading: false,
      dialogFormVisible: false,
      InitOptiList: true,
      temp: {
        create: {},
        update: {},
        view: {}
      },

      countrySelectValue: '',
      countrySelectOptions: '',
      provinceSelectValue: '',
      provinceSelectOptions: ''
    }
  },
  watch: {
    xmId(val) {
      this.currentPage = 1
      this.getList()
    }
  },
  created() {
	  this.getList()
  },
  methods: {
    getList() {
      const data = Number(this.xmId)
      mqttGetDownloadFiles(data).then(response => {
        if (response.code === 0) {
          this.list = response.downloadFiles
        } else {
          this.list = []
        }
      })
    },
    handleSizeChange() {
      this.getList()
    },
    handleCurrentChange() {
      this.getList()
    },
    download(row) {
      // window.open("http://47.103.79.116:8759/protocol/sys/aipowersoftwareinfo/downloadFile?token=995f6b08b5411cf4b07afdefd4a14670&file="+row.filePath);
      window.location.href = 'http://47.103.79.116:8759/protocol/sys/aipowersoftwareinfo/downloadFile?filePath=' + row.filePath
      // mqttDownloadFile(row.filePath).then(response=>{
      //   console.log(response)
      // })
    }
  }
}
</script>

