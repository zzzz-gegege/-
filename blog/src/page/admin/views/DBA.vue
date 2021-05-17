<template>
  <div>
    <el-row :gutter="10" type="flex">
      <el-col :span="6">
        <el-card class="box-card" style="height: 100%">
          <div class="clearfix" slot="header">
            <span>用户注册总数</span>
          </div>
          <div style="font-size: 60px">{{userNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>用户注册趋势</span>
          </div>
          <div ref="userDataWrapper">
            <div
              ref="userData"
              :style="{ height: userDataChartsSize.height+'px',width: userDataChartsSize.width+'px', margin: 'auto' }"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" type="flex">
      <el-col :span="6">
        <el-card class="box-card" style="height: 100%">
          <div class="clearfix" slot="header">
            <span>博客总数</span>
          </div>
          <div style="font-size: 60px">{{blogNum}}</div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>博客注册趋势</span>
          </div>
          <div ref="blogDataWrapper">
            <div
              ref="blogData"
              :style="{ height: blogDataChartsSize.height+'px',width: blogDataChartsSize.width+'px', margin: 'auto' }"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户位置分布</span>
          </div>
          <div ref="visitorDataWrapper">
            <div ref="visitorData"
              :style="{
                height: visitorDataChartsSize.height+'px',
                width: visitorDataChartsSize.width+'px',
                margin:'auto'
              }"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 20px">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户访问数据表</span>
          </div>
          <div>
            <el-table :data="visitorData" stripe style="width: 100%">
              <el-table-column prop="ip" label="IP" width="180">
              </el-table-column>
              <el-table-column prop="province" label="省份" width="180">
              </el-table-column>
              <el-table-column prop="city" label="城市"> </el-table-column>
              <el-table-column prop="visitTime" label="访问时间">
              </el-table-column>
              <el-table-column prop="location" label="用户坐标">
                <template slot-scope="scope">
                  <span> {{ scope.row.location[0] }} </span> -
                  <span> {{ scope.row.location[1] }} </span>
                </template>
              </el-table-column>
            </el-table>
            <div
              style="display: flex; justify-content: center; margin-top: 20px"
            >
              <el-pagination
                layout="prev, pager, next"
                :total="totalNum"
                :page-size="searchParams.limit"
                @current-change="handleUserCurrentChange"
              >
              </el-pagination>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'echarts/extension/bmap/bmap';
import identifyService from "@/service/identifyService";
export default {
  name: "DBA",
  data() {
    let vm = this;
    return {
      userNum: 0,
      userDataChartsSize: {
        height: 300,
        width: 600,
      },
      userDataOptions: {
         dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            height: 10,
            bottom: 10,
          },
        ],
        xAxis: {
          type:"time",
          boundaryGap: true,
           position: {
            bottom: "10%",
          },
          axisLabel: {
          formatter: function(v) {
            return vm.$echarts.format.formatTime("MM-dd hh:mm",new Date(v))
          }
        },
        },
         yAxis: {
          type: "value",
        },
       series: [
          {
            type: "line",
            data: [],
            smooth: true,
          },
        ],
      },
      userDataCharts: null,
       blogDataChartsSize: {
        height: 300,
        width: 600,
      },
      blogDataOptions: {
         dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            height: 10,
            bottom: 10,
          },
        ],
        xAxis: {
          type:"time",
          boundaryGap: true,
           position: {
            bottom: "10%",
          },
          axisLabel: {
          formatter: function(v) {
            return vm.$echarts.format.formatTime("MM-dd hh:mm",new Date(v))
          }
        },
        },
         yAxis: {
          type: "value",
        },
       series: [
          {
            type: "line",
            data:[],
            smooth: true,
          },
        ],
      },
      blogDataCharts: null,
      blogNum:0,
      searchParams: {
        limit: 10,
        offset: 0,
      },
      totalNum: 0,
      visitorData: [],
      visitorDataChartsSize: {
        height: 300,
        width: 600,
      },
      visitorDataOptions: {
        // 第二步: 百度地图的参数配置
        bmap: {
          center: [114, 30],
          zoom: 5,
          roam: true,
        },
        series: [
          {
            type: "effectScatter",
            data: [[113, 27]],
            coordinateSystem: "bmap",
          },
        ],
      },
      visitorDataCharts: null,
    };
  },
  mounted() {
    this.userDataChartsSize.width = this.$refs.userDataWrapper.clientWidth;
    this.userDataChartsSize.height = this.$refs.userDataWrapper.clientWidth*0.3;
    identifyService.getUserInfo().then(rs =>{
      let timeData = [];
      this.userNum = rs.data.data.userInfo.length;
      for (let index = 0; index < rs.data.data.userInfo.length; index++) {
        timeData.push([rs.data.data.userInfo[index].createTiem,1]);
      }
        this.userDataOptions.series[0].data = timeData;
        this.userDataCharts = this.$echarts.init(this.$refs.userData);
        this.userDataCharts.setOption(this.userDataOptions);
    })

    this.blogDataChartsSize.width = this.$refs.blogDataWrapper.clientWidth;
    this.blogDataChartsSize.height = this.$refs.blogDataWrapper.clientWidth*0.3;
    identifyService.getblogInfo().then(rs =>{
      let timeData = [];
      this.blogNum = rs.data.data.blogInfo.length;
      for (let index = 0; index < rs.data.data.blogInfo.length; index++) {
        timeData.push([rs.data.data.blogInfo[index].lastModified,1]);
      }
        this.blogDataOptions.series[0].data = timeData;
        this.blogDataCharts = this.$echarts.init(this.$refs.blogData);
        this.blogDataCharts.setOption(this.blogDataOptions);
    })
     // 访客信息数据
    this.visitorDataChartsSize.width = this.$refs.visitorDataWrapper.clientWidth;
    this.visitorDataChartsSize.height = this.$refs.visitorDataWrapper.clientWidth * 0.3;
      this.$nextTick(function () {
        this.visitorDataCharts = this.$echarts.init(this.$refs.visitorData);
        this.visitorDataCharts.setOption(this.visitorDataOptions);
        let bmap = this.visitorDataCharts.getModel().getComponent('bmap').getBMap();
        bmap.setMapStyleV2({
          styleId:'ad65ea40a8a49496cfed65cd013c7aa5'
        })
      })
  },
  methods:{
    handleUserCurrentChange(){}
  }
};
</script>

<style>
</style>