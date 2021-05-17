<template>
  <div>
    <el-table :data="userList" style="width: 100%">
      <el-table-column
        prop="userName"
        label="用户名"
        width="180"
      ></el-table-column>
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <el-image
            fit="fill"
            :src="scope.row.avatar"
            style="width: 100px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label="用户简介"></el-table-column>
      <el-table-column label="是否冻结账户">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.approved"
            active-color="#13ce66"
            inactive-color="#CCC"
            @change="switchApproved(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否为管理员">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isAdmin"
            active-color="#13ce66"
            inactive-color="#CCC"
            @change="switchAdmin(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        layout="prev,pager,next"
        :total="usertotalNum"
        :page-size="serchUserparams.limit"
        @current-change="handleUsercrrentchange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import identifyService from "@/service/identifyService";
export default {
  data() {
    return {
      serchUserparams: {
        limit: 10,
        offset: 0,
      },
      usertotalNum: 0,
      userList: [],
      activeName: "article",
    };
  },
  created() {
    this.getUserList();
  },
  filters: {
    transformTime(time) {
      let blogcreateTime = new Date(time);
      let currentTime = new Date();
      let offsetTime = currentTime - blogcreateTime;
      let offsetST = offsetTime / 1000;
      let offsetMT = offsetST / 60;
      let offsetHT = offsetMT / 60;
      let offsetDT = offsetHT / 24;
      if (offsetDT >= 365) {
        return `发表于${Math.floor(offsetDT / 365)}年之前`;
      } else if (offsetDT >= 30 && offsetDT < 365) {
        return `发表于${Math.floor(offsetDT / 30)}月之前`;
      } else if (offsetDT >= 7 && offsetDT < 30) {
        return `发表于${Math.floor(offsetDT / 7)}周之前`;
      } else if (offsetDT >= 1 && offsetDT < 7) {
        return `发表于${Math.floor(offsetDT)}天之前`;
      } else if (offsetHT >= 1) {
        return `发表于${Math.floor(offsetHT)}小时之前`;
      } else if (offsetMT >= 1) {
        return `发表于${Math.floor(offsetMT)}分钟之前`;
      } else if (offsetST >= 1) {
        return `发表于${Math.floor(offsetST)}秒钟之前`;
      }
    },
  },
  methods: {
    getUserList() {
      identifyService.getUnapproveduser(this.serchUserparams).then((rs) => {
        this.userList = rs.data.data.rs;
        this.usertotalNum = rs.data.data.totalNum;
      });
    },
    rejectUser(user) {
      identifyService.deleteuser({ key: user.key }).then((rs) => {
        if (rs.data.status === 200) {
          this.$message.success("删除成功");
          this.getUserList();
        }
      });
    },
    handleUsercrrentchange(pager) {
      this.serchUserparams.offset = (pager - 1) * this.serchUserparams.limit;
      this.getUserList();
    },
    switchAdmin(userItem) {
      this.$confirm("此操作将改变用户权限", "警告", {
        confirmButtonText: "确定这么干",
        cancelButtonText: "不干了",
        type: "warning",
      })
        .then(() => {
          if (!userItem.approved) {
            this.$message({
              type: "warning",
              message: "该用户还没有通过审核",
            });
            userItem.isAdmin = !userItem.isAdmin;
          } else {
            identifyService
              .switchAdmin({
                userName: userItem.userName,
                isAdmin: userItem.isAdmin,
              })
              .then((rs) => {
                if (rs.status === 200) {
                  this.$message({
                    type: "success",
                    message: "更改权限成功",
                  });
                }
              });
          }
        })
        .catch(() => {
          userItem.isAdmin = !userItem.isAdmin;
          this.$message({
            type: "info",
            message: "取消操作",
          });
        });
    },
    switchApproved(userItem) {
      this.$confirm("此操作将冻结账户", "提示", {
        confirmButtonText: "确定这么干",
        cancelButtontext: "不干了",
        type: "warning",
      })
        .then(() => {
          identifyService
            .switchapproved({
              userName: userItem.userName,
              approved: userItem.approved,
            })
            .then((rs) => {
              if (rs.status === 200) {
                this.$message({
                  type: "success",
                  message: "冻结成功",
                });
              }
            });
        })
        .catch(() => {
           userItem.approved = !userItem.approved;
          this.$message({
            type: "info",
            message: "取消操作",
          });
        });
    },
  },
};
</script>

<style>
</style>