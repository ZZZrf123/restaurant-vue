<template>
    <div id="start">

        
        <v-loading v-show="showLoading">
        </v-loading>

        <div class="start_content" v-show="!showLoading">

            <header class="start_header">
                <img src="../assets/images/canju.png" /> 用餐人数
            </header>

            <p class="notice">请选择正确的用餐人数 ，小二马上给你送餐具</p>

            <div class="content">
                <ul class="user_list">
                    <li  v-for="(item,key) in userList" :class="{'active' : key == 0}">
                        <span >{{item}}</span>
                    </li>
                </ul>
            </div>

            <div class="mark_input">
                <input type="text" v-model='peopleInfo' placeholder="请输入您的口味要求，忌口等（可不填）"/>
            </div>

            
            <ul class="mark_list">
                <li>						
                    <span>打包带走</span>
                </li>
                <li>
                    <span>
                        不要放辣椒
                    </span>
                </li>
                <li>
                    <span>
                        微辣
                    </span>
                </li>
            </ul>            

        </div>

        <div id="start" class="start" @click="addPeopleInfo()" v-show="!showLoading">
            <span>开始点菜</span>
        </div>

    </div>
</template>


<script>

import  Config from '../model/config.js';
import storage from '../model/storage.js';
import Loading from './public/Loading.vue'; 


export default {

    data() {
        return {
            peopleInfo:'',
            peopleNum:'1人',
            api:Config.api,
            userList: [],
            showLoading: true
        }
    },
     components: {
        "v-loading": Loading
    },
    methods:{
        addChangeEnvet(){
            var that = this;

            var userLis=document.querySelectorAll('.user_list li');

            for(var i=0;i<userLis.length;i++){
                userLis[i].onclick=function(){

                    //去掉所有的li的class，让当前点击的li的class等于active

                    for(var j=0;j<userLis.length;j++){
                        userLis[j].className='';
                    }
                    this.className='active';   //this 就是li这个dom节点

                    //trim()表示去除空格

                    that.peopleNum=this.querySelector('span').innerHTML.trim();
                    // console.log(that.peopleNum);

                }

            }

            //口味的dom操作
            var markLis=document.querySelectorAll('.mark_list li');           

            for(var i=0;i<markLis.length;i++){
                markLis[i].onclick=function(){

                    for(var j=0;j<markLis.length;j++){
                        markLis[j].className='';
                    }
                    this.className='active';   //this 就是li这个dom节点

                    that.peopleInfo= that.peopleInfo+' '+this.querySelector('span').innerHTML.trim();
                }

            }

        },
        addPeopleInfo(){
            //桌子id  桌子号：是扫描二维码从url获取的
			var tableId = storage.get('tableId');
            var api=this.api+'api/addEatInfo'


            var data = {
                tableId:tableId,                 
                peopleNum:this.peopleNum,
                peopleInfo:this.peopleInfo  
            };
            
            this.$http.post(api,data).then((response)=>{
                console.log(response);
                if(response.body.code == 0){
                    
                    this.$router.push({ path: 'home' })
                }
                                    
            },(err)=>{
                console.log(err);
            })

        },
        getPeopleInfoList(){
            var tableId = storage.get('tableId');
            if(tableId == null){
                return;

            }
			var api=this.api+'api/peopleInfoList?tableId='+tableId;
			this.$http.get(api).then(response => {
                this.showLoading = false;
                //undefined
                //执行跳转操作
                if(response.body.data){
                    this.$router.push({ path: 'home' })
                }
			}, response => {
				// error callback
			});

		}

    },
    created(){
        //有没有用餐人数的信息
        this.getPeopleInfoList();
    },
    mounted(){
        

        for(var i = 1;i<=12; i++){
            this.userList.push( i +'人');
        }


        //如何加载dom后再去获取dom结点


        //数据渲染完成后再执行
        this.$nextTick(function(){
            this.addChangeEnvet();
        });
    }
}
</script>

<style lang="scss">
.start_content {


    .start_header {
        height: 3.2rem;
        line-height: 3.2rem;
        background: #1C86EE;
        color: #fff;
        width: 10rem;
        margin: 5rem auto 0rem auto;
        border-radius: .5rem;

        img {
            height: 2.2rem;
            line-height: 2.2rem;
            position: relative;
            top: .5rem;
            margin-left: 1.6rem;
        }
    }

    .notice {
        color: red;

        text-align: center;
        margin: 1rem 0rem;
    }

    .mark_input{
        padding: 1rem;

        input{

            height: 3rem;
            line-height:3rem;

            width:100%;
            border:1px solid #eee;
        }

    }

    .user_list,.mark_list {

        display: flex;

        flex-wrap: wrap;
        padding: .5rem;

        li {
            width: 25%;
            padding: .5rem;
            box-sizing: border-box;
            /*盒子的宽度=盒子本身宽度    默认 盒子的宽度=盒子的宽度+padding+border*/
            span {
                display: block;
                width: 100%;
                height: 3.2rem;
                text-align: center;
                line-height: 3.2rem;
                background: #fff;

                border-radius: .5rem;
                border: 1px solid #ccc;
            }
        }

        li.active{

              span{
                 
                
                 background: red;                 
                 border: 1px solid red;

                 color:#fff;
             }
        }

    }
}

.start{
    
    position: fixed;
    
    bottom: 5rem;
    
    left: 50%;
    margin-left: -3rem;
    
    width: 6rem;
    
    height: 6rem;
    
    border-radius: 50%;
    
    background: red;
    color: #fff;
    
    span{
        
        display: block;
        
        width: 2.5rem;
        
        margin: 0 auto;
        
        position: relative;
        
        top:1.5rem;
    }
    
  }
</style>