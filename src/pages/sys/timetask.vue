<template>

  <imp-panel>

    <div slot="body">
      <div class="handle-box">
        <el-form :inline="true" :model="condition" @keyup.enter.native="loadData($event)">
          <el-form-item>
            <el-button v-has="'pages/sys/timetaskForm'" size="small" type="primary" icon="plus" @click="$router.push({ name: 'timetaskForm', params: { operation : 'operAdd' }})">创建任务</el-button>
          </el-form-item>
          <el-form-item>
            <el-input size="small" v-model="condition.jobName" title="任务名称" placeholder="任务名称" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input size="small" v-model="condition.description" title="	备注" placeholder="	备注" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" class="filter-item"  type="success"  icon="el-icon-search" @click="loadData($event)">查询</el-button>
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
        <!-- <el-table-column prop="id" type="selection" width="50"></el-table-column> -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
                :data="props.row.triggers"
                border
                highlight-current-row
                size="mini"
                tooltip-effect="light"
                style="width: 100%">
                <el-table-column prop="triggerName" label="触发器名称"></el-table-column>
                <el-table-column prop="startTime" label="开始时间">
                  <template slot-scope="scope">
                    {{scope.row.startTime | formatDateTimeFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="endTime" label="结束时间">
                  <template slot-scope="scope">
                    {{scope.row.endTime | formatDateTimeFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="prevFireTime" label="上一次执行时间">
                  <template slot-scope="scope">
                    {{scope.row.prevFireTime | formatDateTimeFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="nextFireTime" label="下一次执行时间">
                  <template slot-scope="scope">
                    {{scope.row.nextFireTime | formatDateTimeFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="triggerState" label="状态" width="50">
                  <template slot-scope="scope">
                    <p v-html="$options.filters.dictFilter(scope.row.triggerState,'triggerState')"/>
                  </template>
                </el-table-column>
                <el-table-column prop="repeatCount" label="次数" width="50"></el-table-column>
                <el-table-column prop="repeatInterval" label="间隔" width="50"></el-table-column>
                <el-table-column prop="cronExpression" label="cron表达式" width="100"></el-table-column>
                <el-table-column prop="description" label="备注"></el-table-column>
                <el-table-column label="操作" width="150">
                  <template slot-scope="scope">
                      <el-button-group>
                        <el-button size="mini" type="primary" @click="opTrigger(scope.row,'pauseTrigger','暂停')" v-if="scope.row.triggerState=='0'" >暂停</el-button>
                        <el-button size="mini" type="primary" @click="opTrigger(scope.row,'resumeTrigger','启动')" v-if="scope.row.triggerState=='1'" >启动</el-button>
                        <el-button size="mini" type="danger" @click="opTrigger(scope.row,'unscheduleJob','删除')">删除</el-button>
                      </el-button-group>
                  </template>
                </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="jobName" label="任务名称"></el-table-column>
        <el-table-column prop="description" label="备注"></el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" type="primary" @click="viewLog(scope.row)">执行日志</el-button>
              <el-button size="mini" type="primary" @click="implement(scope.row)">执行</el-button>
              <el-button v-has="'pages/sys/timetaskTriggerForm'" size="mini" type="primary" @click="$router.push({ name: 'timetaskTriggerForm', params: { operation : 'operAdd', jobName:scope.row.jobName }})">添加触发器</el-button>
              <el-button size="mini" type="danger" @click="deleteTask(scope.row)">删除</el-button> 
            </el-button-group>
          </template>
        </el-table-column>
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

      <el-dialog title="执行日志" :visible.sync="dialogVisible" width="80%">
        <div class="handle-box">
          <el-form :inline="true" :model="conditionLog" @keyup.enter.native="loadData($event)">
            <el-form-item>
              <el-date-picker
                v-model="conditionLog.execTime"
                type="datetimerange"
                unlink-panels
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button  type="success"  icon="el-icon-search" @click="viewLog()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="tableDataLog.rows"
          stripe
          highlight-current-row
          size="mini"
          tooltip-effect="light"
          style="width: 100%"
          v-loading="logListLoading">
          <el-table-column show-overflow-tooltip prop="taskName" label="任务名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="execTime" label="执行时间" width="150"></el-table-column>
          <el-table-column show-overflow-tooltip prop="transactor" label="执行对象" width="200"></el-table-column>
          <el-table-column prop="status" label="执行状态" width="100">
            <template slot-scope="scope">
              <p v-html="$options.filters.dictFilter(scope.row.status,'timeTaskExecStatus')"/>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="errorMsg" label="错误信息"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="pageSizeChangeLog"
          @current-change="pageNoChangeLog"
          :current-page="tableDataLog.pagination.pageNo"
          :page-sizes="[10, 20, 50]"
          :page-size="tableDataLog.pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableDataLog.pagination.total">
        </el-pagination>
      </el-dialog>

      <el-dialog title="执行" :visible.sync="execDialogVisible">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item
            v-for="(domain, index) in form.parameters"
            :label="(domain.desc?domain.desc:domain.name)+'('+domain.type+')'"
            :key="domain.name"
            :prop="'parameter.' + index + '.value'">
            <el-input v-model="domain.value"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="execDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="execTask('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>


    </imp-panel>
</template>

<script>
import { deleteRowUtil, submitFormUtilByUrl, confirmGet } from "@/common/utils";

export default {
  name: "sysTimeTask",
  data() {
    return {
      currentRow: {},
      selectedRows: [], //选中的行
      listLoading: false,
      logListLoading:false,
      dialogVisible:false,
      execDialogVisible:false,
      condition: {
        jobName: "",
        description: ""
      },
      conditionLog: {
        execTime:null,
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
        rows: [],
      },
      tableDataLog: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: [],
      },
      logList:[],
      form: {
          taskName: '',
          beanName:'',
          methodName:'',
          parameters: [],
        },
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
    pageSizeChangeLog(val) {
      this.tableDataLog.pagination.pageSize = val;
      this.viewLog();
    },
    pageNoChange(val) {
      this.tableData.pagination.pageNo = val;
      this.loadData();
    },
    pageNoChangeLog(val) {
      this.tableDataLog.pagination.pageNo = val;
      this.viewLog();
    },
    // 获取row的key值
    getRowKeys(row) {
        return row.id;
    },
    //删除任务
    deleteTask(row) {
      const _self = this;
      deleteRowUtil("/sys/timetask/deleteJob/" + row.jobName).then(function(result) {
        if(result){
          _self.loadData();
        }
      });
    },
    execTask(formName) {
      const _self = this;
      this.$refs[formName].validate((valid) => {
        submitFormUtilByUrl('/sys/timetask/implementTask', valid, this.form);
      });
    },
    implement(row) {
      console.log(row);
      this.execDialogVisible = true;
      this.form.parameters = row.taskObject.parameters;
      this.form.taskName = row.jobName;
      this.form.beanName = row.taskObject.beanName;
      this.form.methodName = row.taskObject.methodName;
    },
    //执行日志
    viewLog(row) {
      this.dialogVisible = true;
      this.logListLoading = true;
      if(row){
        this.conditionLog.taskName=row.jobName;
      }
      //给查询条件开始时间、结束时间赋值
      if(this.conditionLog.execTime && this.conditionLog.execTime.length > 0){
        this.conditionLog.beginTime = this.conditionLog.execTime[0];
        this.conditionLog.endTime = this.conditionLog.execTime[1];
      }
      
      this.conditionLog.pageSize = this.tableDataLog.pagination.pageSize;
      this.conditionLog.pageNumber = this.tableDataLog.pagination.pageNo;
      this.$http
        .get("/sys/timetask/pageQuery", { params: this.conditionLog })
        .then(res => {
          this.tableDataLog.rows = res.list;
          this.tableDataLog.pagination.total = res.totalRow;
          this.logListLoading = false;
        });
    },
    //触发器操作
    opTrigger(row, opTriggerType, opMsg) {
      const _self = this;
      confirmGet("/sys/timetask/"+opTriggerType+"/" + row.triggerName, opMsg).then(function(result) {
        if(result){
          _self.loadData();
        }
      });
    },
    loadData() {
      this.listLoading = true;
      this.condition.pageSize = this.tableData.pagination.pageSize;
      this.condition.pageNumber = this.tableData.pagination.pageNo;
      this.$http
        .get("/sys/timetask/getJobList", { params: this.condition })
        .then(res => {
          this.tableData.rows = res.list;
          this.tableData.pagination.total = res.totalRow;
          this.listLoading = false;
        });
    }
  },
  created() {
    this.loadData();
  },
  //keep-alive 组件激活时调用
  activated() {
    if (this.$route.params.isReload) {
      this.loadData();
    }
  }
};
</script>
<style scoped>
</style>
