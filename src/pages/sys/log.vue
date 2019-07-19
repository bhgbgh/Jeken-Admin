<template>

  <imp-panel>

    <div slot="body">
      <div class="handle-box">
        <el-form :inline="true" :model="condition" @keyup.enter.native="loadData($event)">
          <el-form-item>
            <el-input size="small" v-model="condition.module" title="模块" placeholder="输入模块" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select size="small" v-model="condition.opType" placeholder="请选择" class="handle-input mr10">
              <el-option
                v-for="item in $dicts('operationType')"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input size="small" v-model="condition.name" title="日志内容" placeholder="输入日志内容" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input size="small" v-model="condition.createUserName" title="操作用户" placeholder="输入操作用户" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              size="small"
              v-model="condition.createTime"
              type="datetimerange"
              unlink-panels
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <!-- <el-input v-model="condition.createTime" title="操作时间" placeholder="输入操作时间" class="handle-input mr10"></el-input> -->
          </el-form-item>
          <el-form-item>
            <el-button size="small"  type="success"  icon="el-icon-search" @click="loadData($event)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData.rows"
        stripe
        highlight-current-row
        size="mini"
        tooltip-effect="light"
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column prop="id" type="selection" width="50"></el-table-column>
        <el-table-column prop="module" label="模块"></el-table-column>
        <el-table-column prop="opType" label="操作类型">
          <template slot-scope="scope">
            <p v-html="$options.filters.dictFilter(scope.row.opType,'operationType')"/>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="操作ip"></el-table-column>
        <el-table-column prop="createUserName" label="操作用户"></el-table-column>
        <el-table-column prop="createTime" label="操作时间"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="日志内容" width="450"></el-table-column>
      </el-table>

      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
        :current-page="tableData.pagination.pageNo"
        :page-sizes="[10, 20, 50]"
        :page-size="tableData.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total">
      </el-pagination>

    </div>


    </imp-panel>
</template>

<script>
import { batchDeleteUtil } from "@/common/utils";

export default {
  name: "sysLog",
  data() {
    return {
      currentRow: {},
      selectedRows: [], //选中的行
      listLoading: false,
      condition: {
        module: "",
        opType: "",
        name: "",
        createUserName:"",
        createTime:"",
        beginTime:"",//查询时间开始时间
        endTime:""//查询时间结束时间
      },
      tableData: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      }
    };
  },
  methods: {
    //列表选择触发事件
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    pageSizeChange(val) {
      this.tableData.pagination.pageSize = val;
      this.loadData();
    },
    pageNoChange(val) {
      this.tableData.pagination.pageNo = val;
      this.loadData();
    },
    loadData() {
      this.listLoading = true;
      this.condition.pageSize = this.tableData.pagination.pageSize;
      this.condition.pageNumber = this.tableData.pagination.pageNo;
      //给查询条件开始时间、结束时间赋值
      if(this.condition.createTime && this.condition.createTime.length > 0){
        this.condition.beginTime = this.condition.createTime[0];
        this.condition.endTime = this.condition.createTime[1];
      }
      
      this.$http
        .get("/sys/log/pageQuery", { params: this.condition })
        .then(res => {
          this.tableData.rows = res.list;
          this.tableData.pagination.total = res.totalRow;
          this.listLoading = false;
        });
    }
  },
  //在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见
  created() {
    this.loadData();
  }
};
</script>
<style scoped>

</style>
