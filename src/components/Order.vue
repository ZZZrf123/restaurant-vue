<template>
	<div id="order">
		<div class="order_content">

			<div class="order_info">

				<div class="order_top">
					<img src="../assets/images/timer.png" />
					<div class="order_info_right">
						<h2>{{list.tableId}}号桌待门店接单</h2>
						<p>请及时联系服务员确认点菜品信息!</p>
					</div>
				</div>

				<h3>已点菜品{{list.totalNum}}份,合计 :
					<span class="price">{{list.totalPrice}}元</span>
				</h3>
				
				<div style=" text-align:center;">
					<button @click="doPay()" class="order_button">
						立即支付
					</button>
				</div>

			</div>

			<!--订单列表-->

			<div class="order_list">

				<h3>菜品详情:</h3>
				<ul class="list" v-for="item in list.orderItemList">
					<li>
						<div class="title">
							{{item.name}}
						</div>

						<div class="num">

							{{item.num}}份
						</div>

						<div class="price">

							{{item.price}}元
						</div>

					</li>

				</ul>

			</div>

		</div>

			<v-navfooter></v-navfooter>

			<div id="footer_book" class="footer_book" style="left:auto;right:5px">
				<router-link to="/home">
					<img src="../assets/images/menu.png" />
					<p>菜单</p>
				</router-link>
			</div>

	</div>
</template>

<script>

import NaVfooter from './public/NavFooter.vue';
import storage from '../model/storage.js';
//引入配置文件
import Config from "../model/config.js";
export default {
	data() {
		return {
			api: Config.api,
			list:[]
		}
	},
	components:{
		'v-navfooter' :NaVfooter
	},
	methods:{
		getOrder(){
			var api = this.api;
			var tableId = storage.get('tableId');

			this.$http.get(api + "api/getOrder?tableId=" + tableId).then(
				response => {
					this.list=response.body.data;
				},(error)=>{
                        console.log(error);
                }
			);

		},
		doPay(){

			var ua = navigator.userAgent.toLowerCase();
			var isWeixin = ua.indexOf('micromessenger') != -1;
			if (isWeixin) {
				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc0d18d6771d9c568&redirect_uri=http%3A%2F%2Fzrf.natapp1.cc%2FmyRequest%2Fbackend%2Ftest.html&response_type=code&scope=snsapi_base&state=' + this.list.orderNo + '#wechat_redirect';
			}else{
				var api = this.api;
				var tableId = storage.get('tableId');
				window.location.href = api + 'api/doPay?tableId=' + tableId; 
			}			

		}
	},
	mounted(){
		this.getOrder();
	}
}
</script>

<style lang="scss">

.order_button {  
	width: 100px; /* 宽度 */
	height: 40px; /* 高度 */
	border-width: 0px; /* 边框宽度 */
	border-radius: 3px; /* 边框半径 */
	background: #1E90FF; /* 背景颜色 */
	cursor: pointer; /* 鼠标移入按钮范围时出现手势 */
	outline: none; /* 不显示轮廓线 */
	font-family: Microsoft YaHei; /* 设置字体 */
	color: white; /* 字体颜色 */
	font-size: 1.4rem; /* 字体大小 */
	

}  

.order_content {
	padding: 1rem;


	.order_info {

		background: #fff;

		border-radius: .5rem;

		.order_top {

			display: flex;

			img {
				width: 5.6rem;
				height: 5.6rem;
			}

			.order_info_right {
				flex: 1;
				padding-top: .5rem;
			}
		}

		h3 {

			line-height: 2;
			padding: .5rem;

			.price {
				font-size: 2rem;

				color: red;
			}
		}
	} //  订单列表
	.order_list {

		background: #FFFFFF;
		border-radius: .5rem;
		margin-top: 1rem;

		padding: .5rem;

		h3 {

			line-height: 2;
		}


		.list {


			li {

				display: flex;

				line-height: 2;
				padding: .5rem 0rem;

				.title {

					flex: 2;
				}

				.num {
					flex: 1;
					text-align: center;
				}

				.price {
					flex: 1;

					text-align: center;
				}
			}
		}
	}

	/*支付页面*/
	.order_pay {


		background: #fff;

		border-radius: .5rem;

		h3 {

			padding: 2rem 0rem .5rem 0rem;

			font-size: 2rem;
			text-align: center;
		}

		.order_pay_detail {
			display: flex;

			line-height: 2;

			border-bottom: 1px solid #eee;

			padding: .5rem;

			.d_num,
			.p_num,
			.order_time {

				flex: 1;
			}
		}

		.order_pay_info {

			line-height: 2;

			display: flex;

			margin: 1rem 0rem;
			padding: .5rem .5rem 1rem .5rem;


			.price_list {
				flex: 1;

				.price {

					font-size: 2rem;

					color: red;
				}
			}

			.pay_button {

				width: 10rem;
				border-radius: .5rem;
				background: red;
				color: #fff;
				text-align: center;
				height: 2.6rem;
				line-height: 2.6rem;
				position: relative;

				top: .5rem
			}
		}
	}
}
</style>