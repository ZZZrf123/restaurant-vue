<template>
	<div id="cart">
		<div class="cart_content" >

			<div class="cart_info" v-if="totalNum">

				<h2>购物车</h2>

				<div class="p_number">
					<div class="p_number_left">
						<p>用餐人数:{{peopleList.peopleNum}}</p>
						<p>备注:<span v-if="!peopleList.peopleInfo">无</span><span v-if="peopleList.peopleInfo">{{peopleList.peopleInfo}}</span></p>
					</div>

					<div class="p_number_right">
						<router-link to="/editpeopleinfo">
							<img src="../assets/images/edit.png" />
							<p>修改</p>
						</router-link>
					</div>

				</div>

				<div class="cart_p_num">

					<p>购物车中总共有{{totalNum}}个菜</p>

					<p>合计：
						<span class="price">¥{{allPrice}}</span>
					</p>
				</div>
			</div>

			<div class="cart_list" v-if="totalNum">

				<ul>
					<li class="item" v-for="(item,key) in list">
						<div class="left_food">
							<img :src="api+item.imgUrl" />
							<div class="food_info">
								<p>{{item.name}}</p>
								<p class="price">¥{{item.price}}</p>
							</div>

						</div>

						<div class="right_cart">
							<div class="cart_num">
								<div class="input_left" @click="decNum(item,key)">-</div>
								<div class="input_center">
									<input type="text" readonly="readonly" v-model="item.num" name="num" id="num" />
								</div>
								<div class="input_right" @click="incNum(item,key)">+</div>
							</div>
						</div>

					</li>

				</ul>
			</div>

			<div class="hot_food">
				
				<h3>本店顾客最常点的菜</h3>
				
				<div class="item_list_outer">
					<ul class="item_list">
						<li>	
							<div class="inner">
								<img src="../assets/images/1.jpg" />
								<p class="title">大蒜腊肉</p>						
								<p class="price">¥26</p>
							</div>		
						</li>
						
						<li>
							<div class="inner">
								<img src="../assets/images/2.jpg" />
								
								<p class="title">家乡扣肉</p>
								
								<p class="price">¥26</p>	
							</div>					
							
						</li>
						
						<li>	
							<div class="inner">
								<img src="../assets/images/1.jpg" />
								<p class="title">大蒜腊肉</p>						
								<p class="price">¥26</p>
							</div>		
						</li>
						
						<li>
							<div class="inner">
								<img src="../assets/images/2.jpg" />
								
								<p class="title">家乡扣肉</p>
								
								<p class="price">¥26</p>	
							</div>					
							
						</li>
						
						<li>
							<div class="inner">
								<img src="../assets/images/2.jpg" />
								
								<p class="title">家乡扣肉</p>
								
								<p class="price">¥26</p>	
							</div>					
							
						</li>
						
						
					</ul>
					
				</div>
				
			</div>	

			<div class="cart_empty" v-if="!totalNum">
				<h3>购物车空空的 </h3>
					
				<p>您可以点击下面的菜单开始点菜</p>
			</div>
		

		</div>






		

		<v-navfooter></v-navfooter>

		<div id="footer_book" class="footer_book">
			<router-link to="/home">
				<img src="../assets/images/menu.png" />
				<p>菜单</p>
			</router-link>
		</div>

		<div @click="addOrder()" id="footer_cart" class="footer_cart">
			<img src="../assets/images/doorder.png" />
			<p>下单</p>
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
			list: [],
			allPrice: 0,
			totalNum:0,
			peopleList:[]
		}
	},
	sockets: {
		//接收服务器广播
		addCart: function () {
			//更新购物车数据
			this.getCartData();
		}
  	},
	components:{
		'v-navfooter' :NaVfooter
	},
	methods:{
		getCartData(){
			var api = this.api;

			var tableId = storage.get('tableId');

			this.$http.get(api + "api/cartList?tableId=" + tableId).then(
				response => {
					this.list = response.body.data;
					this.getTotalResult();
					console.log(this.list);
				},
				response => {
					console.log(response);
				}
			);
		},
		decNum(item,key){
			//请求远程服务器执行更新操作
			//桌子id  桌子号：是扫描二维码从url获取的
			var tableId = storage.get('tableId');
			var productId=item.productId;
			var num=item.num;
			var api=this.api+'api/decCart?tableId=' + tableId +'&productId='+productId+'&num='+num;

			this.$http.get(api).then((response)=>{
				if(response.body.code == 0){
					this.$socket.emit('addCart','add');
					this.getTotalResult();
				}
			},(error)=>{
				console.log(error);
			});

			if(item.num == 1){
				this.list.splice(key,1);
				return;
			}else{
				--item.num;
			}
			
		},
		incNum(item,key){
			// incCart?uid=a001&product_id=1241241255436246&num=2
			//请求远程服务器执行更新操作

			var tableId = storage.get('tableId');
			//桌子id  桌子号：是扫描二维码从url获取的
			var productId=item.productId;
			var num=item.num;
			var api=this.api+'api/incCart?tableId='+tableId+'&productId='+productId+'&num='+num;

			this.$http.get(api).then((response)=>{
				console.log(response.body);
				if(response.body.code == 0){
					this.$socket.emit('addCart','add');
					this.getTotalResult();
				}
			},(error)=>{
				console.log(error);
			});

			++item.num;
		},
		getTotalResult(){
			
			var allPrice = 0;
			var totalNum = 0;
			
			for(var i = 0;i<this.list.length;i++){
				allPrice += parseFloat(this.list[i].price * this.list[i].num);
				totalNum += this.list[i].num;
			}
			this.allPrice = allPrice;
			this.totalNum = totalNum;
		
		},
                //获取用餐人的信息

		getPeopleInfoList(){
			var tableId = storage.get('tableId');
			var api=this.api+'api/peopleInfoList?tableId=' +tableId;
			
			this.$http.get(api).then(response => {

				console.log(response);
				this.peopleList=response.body.data;

			}, response => {
				// error callback
			});

		},
		addOrder(){
			//提交订单的方法
			var api=this.api+'api/addOrder';

			console.log({
				tableId: storage.get('tableId'),
				peopleNum: this.peopleList.peopleNum,
				peopleInfo: this.peopleList.peopleInfo,
				allPrice: this.allPrice,
				totalNum: this.totalNum,
				order:this.list
			});


			this.$http.post(api,{
				tableId: storage.get('tableId'),
				peopleNum: this.peopleList.peopleNum,
				peopleInfo: this.peopleList.peopleInfo,
				totalPrice: this.allPrice,
				totalNum: this.totalNum,
				productList:this.list
			}).then(response => {
				console.log(response);
				if(response.body.code == 0){
						this.$router.push({ path: 'order' })
				}else{
					alert('提交数据有误');
				}				
			}, response => {
				// error callback
			});

		}
	},
	mounted(){
		this.getCartData();
		this.getPeopleInfoList();
	}
}
</script>

<style lang="scss">
.cart_content {

	padding: 1rem;

	/*头部信息*/
	.cart_info {

		background: #fff;

		h2 {
			text-align: center;
			font-size: 1.8rem;
			padding: .8rem 0px;
			border-bottom: 1px solid #eee;
		}
		border-radius:.5rem;
		padding: .5rem;
		.p_number {


			display: flex;

			padding: .5rem 0;
			border-bottom: 1px solid #eee;

			.p_number_left {

				flex: 1;


				p {
					line-height: 2;

					&:first-child {

						color: red;
					}
				}
			}

			.p_number_right {
				width: 4rem;
				height: 4rem;
				text-align: center;
				
				a{
					color: #000;
				}

				img {

					width: 1.8rem;
					height: 1.8rem;
					margin: 0 auto;
				}
			}
		}

		/*购物车总数量*/
		.cart_p_num {
			border-bottom: 1px solid #eee;
			p {

				line-height: 2;

				.price {

					font-size: 2.4rem;
					color: red;
				}
			}
		}
	}
	/*购物车列表*/
	.cart_list {
		margin-top: 1rem;

		padding: .5rem;

		background: #fff;

		border-radius: .5rem;



		display: flex;

		ul {
			width: 100%;

			.item {
				display: flex;
				width: 100%;

				border-bottom: 1px solid #eee;

				padding: 1rem 0px;
				.left_food {
					flex: 1;

					display: flex;
					img {
						width: 4rem;
						height: 4rem;
						border-radius: 10%;
						margin-right: .8rem;
					}

					.food_info {

						flex: 1;
					}
				}

				.right_cart {

					width: 10rem;
				}
			}
		}
	}

	/*最长点的菜*/
	.hot_food {

		background: #fff;

		margin-top: 1rem;

		border-radius: .5rem;

		margin-bottom: 4rem;

		h3 {

			font-size: 1.4rem;

			padding: .5rem 0px;
		}

		.item_list_outer {

			width: 100%;

			overflow-x: auto;
			.item_list {


				padding: 0px .5rem;
				width: 50rem;

				li {

					width: 8rem;
					padding: .5rem;
					box-sizing: border-box;
					float: left;

					.inner {
						background: #fff;
						width: 100%;
						border-radius: .5rem;
						overflow: hidden;

						img {

							width: 100%;
						}
					}
				}
			}
		}
	}
}


/*购车加减*/

.cart_num {

	width: 10rem;

	display: flex;
	margin-top: .8rem;


	.input_left,
	.input_right {
		flex: 1;

		width: 2.8rem;
		height: 2.8rem;

		line-height: 2.8rem;

		text-align: center;

		color: red;

		border: 1px solid #eee;

		font-size: 2.4rem;
	}

	.input_center {

		flex: 1;

		input {

			width: 2rem;
			text-align: center;
			width: 100%;
			height: 2.8rem;
			border: none;

			border-top: 1px solid #eee;

			border-bottom: 1px solid #eee;

			float: left;
		}
	}
}




/*购车空*/

.cart_empty {

	text-align: center;
	line-height: 3;

	h3 {
		font-size: 1.8rem;
	}
}
</style>