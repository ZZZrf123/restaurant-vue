<template>
  <div>
    <v-loading v-if="showLoading"></v-loading>

    <div class="success" v-if="!showLoading">
      <img src="../assets/images/success.png">

      <div class="s_right">
        <h2>支付成功</h2>
        <p>期待您再次光临</p>
      </div>
    </div>

    <ul class="list" v-if="!showLoading">
      <li>
        <div class="left">订单状态</div>
        <div class="right">已完成</div>
      </li>
      <li>
        <div class="left">桌号</div>
        <div class="right">{{list.tableId}}</div>
      </li>
      <li>
        <div class="left">人数</div>
        <div class="right">{{list.peopleNum}}</div>
      </li>
      <li>
        <div class="left">订单号</div>
        <div class="right">{{list.orderNo}}</div>
      </li>

      <li>
        <div class="left">结账时间</div>
        <div class="right">{{list.updateTime}}</div>
      </li>

      <li>
        <div class="left">支付金额</div>
        <div class="right">¥{{list.totalPrice}}</div>
      </li>
    </ul>
  </div>
</template>


<script>
import Loading from "./public/Loading1.vue";
import Config from "../model/config.js";

export default {
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      showLoading: true,
      list:{},
      api: Config.api,
      showOrderNo: '',
      timmer:null
    };
  },
  components: {
    "v-loading": Loading
  },
  methods: {
    getUrlKey (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
    },
    getOrderByNo(orderNo){
        console.log("aaa");
        var api = this.api;
        this.$http.get(api + "api/getOrderByOrderNo?orderNo=" + orderNo).then(
        response => {
            console.log(response.body);
            if (response.body.code == 0) {
              if(response.body.data.payStatus == 1){
                this.showLoading = false;
                this.list = response.body.data;
                this.stopInt();
              }

            }
        },
        error => {
            console.log(error);
        }
        );

    },
    stopInt(){
         console.log("wolaile ");
        clearInterval(this.timmer);
    },
    startInt(orderNo){
        this.timmer=setInterval( () => {this.getOrderByNo(orderNo)},1000);
    }
  },
  mounted() {
    var orderNo = this.getUrlKey("out_trade_no");
    // this.getQueryVariable("out_trade_no");
    

    if(orderNo == null){
        this.list = {

        }
    }else{
      this.showOrderNo = orderNo;
    }
    this.startInt(orderNo);
    // console.log(this.$route.query);
  }
};
</script>

<style lang="scss">
.success {
  width: 15rem;
  margin: 4rem auto;
  display: flex;
  border: 1px solid #eee;
  border-radius: 20px;
  background: #fff;
  img {
    width: 6rem;
    height: 6rem;
  }
  .s_right {
    padding-left: 1rem;
    flex: 1;
    padding-top: 1rem;
  }
}

.list {
  background: #fff;
  padding: 10px;

  li {
    display: flex;
    line-height: 2;

    .left {
      width: 100px;
    }
    .right {
      flex: 1;
      text-align: right;
    }
  }
}
</style>