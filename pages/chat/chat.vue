<template>
	<view>
		<top-bar :user_id="user_list.userId" :user_img="user_list.picUrl" :user_name="user_list.userName"
			:password="user_list.password" :balance="user_list.balance"></top-bar>
		<left-bar :user_id="user_list.userId"></left-bar>
		<div id="header">
			<div class="nav-container">
				<div class="nav-bar w2">
					<ul class="nav-left">
					</ul>
					<div class="nav-right">
						<!-- <div class="search">
							<input type="search" name="keyword" placeholder="Search..." autocomplete="off"
								@input="search_text_input" />
							<button type="submit" @click="search_by_goods_name">
								<i class="iconfont icon-hover1"></i>
							</button>
						</div> -->
					</div>
				</div>
			</div>
		</div>

		<div v-drag class='chat-wrapper1' v-show="showChat">
			<div class="title">
				{{person}}
			</div>
			<view class="context">
				<view v-for="(item,index) in chat_detail" :key="index" :class="item.mine?'msg1':'msg'">
					<div :class="item.mine?'per-info1':'per-info'">
						<div class="img-container">
							<image :src="item.img" mode="aspectFill"></image>
						</div>
						<div :class="item.mine?'name1':'name'">{{item.name}}</div>
					</div>
					<div :class="item.mine?'text1':'text'">{{item.text.text}}</div>
				</view>
			</view>
			<div class="bottom">
				<el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="inputMsg">
				</el-input>
				<el-button size='small' style="position: absolute; bottom: 10px; right: 80px;" @click="showChat = false">关闭</el-button>
				<el-button type="primary" size='small' style="position: absolute; bottom: 10px; right: 10px;" @click="send()">发送</el-button>
			</div>
		</div>


		<div v-drag class="friend-list-wrapper">
			<div class="friend-list-content">
				<div class="top">
					<div class="title">好友列表</div>
					<div>
						<el-input placeholder="请输入内容" v-model="friend_input" size="mini" style=" margin-top: 6px;">
							<i slot="prefix" class="el-input__icon el-icon-search" size="mini" @click="select_friend()"></i>
						</el-input>
					</div>
				</div>
				<div class="bottom">
					<view class="content" v-for="item in friends" @click="create(item)">
						<div class="img-container">
							<image :src="item.picUrl" mode="aspectFill"></image>
						</div>
						<div class="name">{{item.userName}}</div>
						<el-button type="text" icon="el-icon-close" style="position: absolute; right: 0;"
							@click="delete_friend(item.userId,item.userName)"></el-button>
					</view>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import topBar from '../../components/top-bar/top-bar.vue';
	import leftBar from '../../components/left-bar/left-bar.vue';
	export default {
		data() {
			return {
				user_list: [],
				friends: [],
				inputMsg: '',
				person:'',
				person_id:'',
				person_img:'',
				showChat:false,
				chat_detail:[],
				friend_input:'',
				friends_copy:[],
			}
		},
		onLoad(options) {
			var user_id_login = options.user_id_login;
			this.load_user(user_id_login);
			this.load_friends(user_id_login);
		},
		beforeDestroy() {

		},
		components: {
			topBar: topBar,
			leftBar: leftBar
		},
		methods: {
			load_user: function(id) {
				uni.request({
					method: 'GET',
					url: `/api/users/${id}`,
					success: (res) => {
						if (res.statusCode == 200) {
							this.user_list = res.data;
						}
					}
				});
			},
			load_friends: function(id) {
				uni.request({
					method: 'GET',
					url: `/api/users/${id}/friends`,
					success: (res) => {
						if (res.statusCode == 200) {
							this.friends = res.data;
							this.friends_copy = this.friends;
						}
					}
				});
			},
			delete_friend(id, name) {
				this.$confirm(`是否删除好友${name}?`, '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(() => {
						uni.request({
							method: 'POST',
							url: `/api/users/${this.user_list.userId}/delete-friend/${id}`,
							success: (res) => {
								if (res.statusCode == 204) {
									uni.request({
										method: 'POST',
										url: `/api/users/${id}/delete-friend/${this.user_list.userId}`,
										success: (res) => {
											if (res.statusCode == 204) {
												this.$message({
													type: 'success',
													message: '成功将该用户移出好友列表!'
												});
											} else {
												this.$message.error('删除好友失败!');
											}
										}
									});
								} else {
									this.$message.error('删除好友失败!');
								}
							}
						});
					});
			},
			select_friend(){
				this.friends = this.friends_copy;
				var tmp = []
				if(this.friend_input ==''){
					this.friends = this.friends_copy;
					return;
				}
				for(var i =0; i<this.friends.length;i++){
					if(this.friends[i].userName.indexOf(this.friend_input)!=-1){
						tmp.push(this.friends[i]);
					}
				}
				this.friends = tmp;
			},
			// close(){
			// 	uni.onSocketClose(function (res) {
			// 	  console.log('WebSocket 已关闭！');
			// 	});
			// 	this.showChat = false;
			// },
			send(){
				if(this.inputMsg.length == 0){
					this.$message({
						type: 'warning',
						message: '输入内容为空!'
					});
					return;
				}
				var msg_o={
					"toId": this.person_id,
					"date": "2020/05/20 23:19:07",
					"text": { "text": this.inputMsg },
					"mine": true,
					"name": this.user_list.userName,
					"img": this.user_list.picUrl
				}
				var msg1={
					"date": "2020/05/20 23:19:07",
					"text": { "text": this.inputMsg },
					"mine": true,
					"name": this.user_list.userName,
					"img": this.user_list.picUrl
				}
				var msg = JSON.stringify(msg_o);
				uni.sendSocketMessage({
					data: msg,
					success: function() {
						console.log("数据发送成功，数据为：" + msg);
						//-----------------------------------------    
						// console.log("数据发送结束，开始接收");
						// uni.onSocketMessage(function(res) {
						// 	isReceive = true;
						// 	console.log('收到服务器内容：' + res.data);
						// })
						//--------------------------------------   
					},
					fail: function() {
						console.log("数据发送失败");
					}
				});		
				this.chat_detail.push(msg1);
				this.inputMsg = '';
			},
			create(user){
				this.person = user.userName;
				this.showChat = true;
				this.person_id = user.userId;
				this.person_img = user.picUrl;
				var url = `ws://localhost:8080/websocket/${this.user_list.userId}`;
				console.log(url);
				uni.connectSocket({
					url: url,
					success: function(res) {
						console.log('WebSocket连接创建', res)
					},
					fail: function(err) {
						console.log(err)
					},
				});
				
				uni.onSocketMessage(function(res) {
					// var msg = JSON.parse(res.data);
					// msg.mine = false;
					// this.chat_detail.push(msg);
					console.log('get:'+res.data);
					var msg = eval('('+res.data+')');
					console.log(msg);
					// msg.mine = false;
					this.chat_detail.push(msg);
					console.log(this.chat_detail);
				});
			}
		}
	}
</script>

<style>
	@import url("../../style/nav/nav.css");
</style>
