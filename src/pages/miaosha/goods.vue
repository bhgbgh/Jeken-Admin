<template>

  <imp-panel>

    <div slot="body">
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
        <!-- <el-table-column prop="goodsName" label="商品名称"></el-table-column> -->
        <el-table-column prop="goodsName" label="商品名称">
          <template slot-scope="scope">
            <router-link :to="{ name: 'goodsDetail', params: { operation : 'operDetail',row:scope.row  }}">
              <el-button  size="mini" type="text" icon="plus">{{scope.row.goodsName}}</el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="商品原价"></el-table-column>
        <el-table-column prop="miaoshaPrice" label="商品秒杀价格"></el-table-column>
        <el-table-column prop="goodsStock" label="商品数量"></el-table-column>
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
  name: "goods",
  data() {
    return {
      currentRow: {},
      selectedRows: [], //选中的行
      listLoading: false,
      tableData: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
      condition: {
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
      
      this.$http
        .get("/goods/pageQuery", { params: this.condition })
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
