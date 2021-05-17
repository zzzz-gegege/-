<template>
  <div>
    <div class="chat-wrapper">
      <el-page-header @back="goback"> </el-page-header>
      <div class="contentframe" ref="contentframe">
        <div v-for="(msgitem, index) of msgList" :key="index" class="msg-item">
          <div :style="{ float: msgitem.type === 'other' ? 'left' : 'right' }">
            <div
              :style="{ float: msgitem.type === 'other' ? 'left' : 'right' }"
            >
              <div :style="{textAlign:msgitem.type === 'other' ? 'left' : 'right' }">
                <el-avatar :size="40" :src="msgitem.avatar"></el-avatar>
              <span
                :style="{
                  fontSize: '12px',
                  display:'inline-block',

                  transform: msgitem.type === 'other' ? 'translate(10px,-30px)' : 'translate(-90px,-30px)'
                }"
                
                >{{ msgitem.userName }}</span
              >
              </div>
              <el-card
                :style="{
                  transform: msgitem.type === 'other' ? 'translateX(60px)' : 'translateX(-60px)',
                }"
              >
                <span v-if="msgitem.msg.type === 'text'">{{
                  msgitem.msg.content
                }}</span>
                <el-image v-else :src="msgitem.msg.content"></el-image>
              </el-card>
            </div>
          </div>
        </div>
      </div>
      <div class="tool-bar">
        <el-row style="padding: 6px 24px">
          <el-col :span="1">
            <div>
              <i
                class="el-icon-picture-outline"
                style="font-size: 20px; line-height: 40px; text-indent: 6px"
              ></i>
              <input
                type="file"
                ref="selectImg"
                @change="sendImg"
                style="
                  position: absolute;
                  z-index: 10;
                  top: 0;
                  left: 0;
                  opacity: 0;
                "
              />
            </div>
          </el-col>
          <el-col :span="22">
            <el-input
              v-model="msgText"
              @keypress.enter.native="sendText"
            ></el-input>
          </el-col>
          <el-col :span="1">
            <el-button
              type="text"
              icon="el-icon-s-promotion"
              style="font-size: 20px; line-height: 40px; text-indent: 6px"
              @click="sendText"
            ></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
async function cutImgBase64(files, width, quality) {
  return new Promise((resolve) => {
    const file = files[0];
    let URL = window.URL || window.webkitURL;
    const blog = URL.createObjectURL(file);
    console.log(blog);
    let base64;
    const img = new Image();
    img.src = blog;
    img.onload = function () {
      const that = this;
      let w = that.width;
      let h = that.height;
      let scale = w / h;
      h = w / scale;
      const canvas = document.createElement("canvas");
      const canCon = canvas.getContext("2d");
      canvas.width = w;
      canvas.height = h;
      canCon.drawImage(that, 0, 0, w, h);
      base64 = canvas.toDataURL("image/jpeg", quality || 0.8);
      resolve(base64);
    };
  });
}
export default {
  data() {
    return {
      socket: null,
      msgText: "",
      message: {
        userName: "",
        avatar: "",
        msg: {
          type: "",
          content: "",
        },
      },
      userData: JSON.parse(sessionStorage.getItem("userData")),
      msgList: [],
    };
  },
  watch: {
    userData: {
      handler() {
        this.message.userName = this.userData.userName;
        this.message.avatar = this.userData.avatar;
      },
      immediate: true,
    },
  },
  mounted() {
    this.socket = new WebSocket("ws://127.0.0.1:12778");
    let vm = this;
    this.socket.addEventListener("open", function () {
      vm.$message.success("加入聊天室");
    });
    this.socket.addEventListener("message", function (event) {
      vm.msgList.push({
        ...JSON.parse(event.data),
        type: "other",
      });
    });
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    sendText() {
      this.message.msg.type = "text";
      this.message.msg.content = this.msgText;
      this.socket.send(JSON.stringify(this.message));
      this.msgText = "";
      this.msgList.push({
        ...JSON.parse(JSON.stringify(this.message)),
        type: "me",
      });
      this.message.msg.type = "";
      this.message.msg.content = "";
    },
    sendImg() {
      cutImgBase64(this.$refs.selectImg.files, 400, 0.6).then((rs) => {
        this.message.msg.type = "img";
        this.message.msg.content = rs;
        this.socket.send(JSON.stringify(this.message));
        this.msgList.push({
        ...JSON.parse(JSON.stringify(this.message)),
        type: "me",
      });
      this.message.msg.type = "";
      this.message.msg.content = "";
      });
    },
  },
};
</script>

<style>
body {
  margin: 0;
}
.chat-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.contentframe {
  position: relative;
  height: calc(100vh - 84px);
  width: 100vw;
  background-color: rgba(31, 219, 219, 0.867);
   overflow-y: scroll;
}
.tool-bar {
  position: absolute;
  height: 60px;
  width: 100vw;
  bottom: 0;
  left: 0;
}
.msg-item {
  padding: 20px;
}
.msg-item::after{
  content: "";
  display: block;
  clear: both;
}
</style>