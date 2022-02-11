<template>
	<view>
		<!-- 充值提现 -->
		<el-dialog title="零钱管理" :visible.sync="show_chongzhi_confirm" width="25%">
			<el-form style="margin-left:15%;">
				<el-form-item label="余额">
					<view>{{balance}}</view>
				</el-form-item>
				<el-form-item label="充值" v-show="!show_tixian">
					<el-input v-model="chongzhi_input" style="width: 60%;"></el-input>
				</el-form-item>
				<el-form-item label="提现" v-show="show_tixian">
					<el-input v-model="tixian_input" style="width: 60%;"></el-input>
				</el-form-item>
			</el-form>
			<el-link :underline="false" style="margin-left: 70%;" v-show="!show_tixian" @click="show_tixian =true">点此提现
			</el-link>
			<el-link :underline="false" style="margin-left: 70%;" v-show="show_tixian" @click="show_tixian = false">点此充值
			</el-link>
			<el-dialog width="25%" title="请输入密码" :visible.sync="show_money_pwd_flag" append-to-body>
				<el-input placeholder="请输入密码" v-model="pwd" show-password style="width: 80%; margin-left: 8%;">
				</el-input>
				<div slot="footer" class="dialog-footer">
					<el-button @click="show_money_pwd_flag = false">取消</el-button>
					<el-button type="primary" @click="chongzhi_inner">确定</el-button>
				</div>
			</el-dialog>
			<div slot="footer" class="dialog-footer">
				<el-button @click="show_chongzhi_confirm = false">取消</el-button>
				<el-button type="primary" @click="chongzhi_outer">确定</el-button>
			</div>
		</el-dialog>

		<!-- 修改头像 -->
		<el-dialog title="更换头像" :visible.sync="show_mod_img" style="width: 50%; margin: 0 auto;">
			<div class="mod-pic-container">
				<div class="pic-style">
					<image :src="src" mode="aspectFill"></image>
				</div>
				<el-link :underline="false" @click="upload_img()" style="margin-top: 20px;margin-left: 35%;">更换头像
				</el-link>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="show_mod_img = false">取消</el-button>
				<el-button type="primary" @click="update_img()">确定</el-button>
			</div>
		</el-dialog>

		<div id="header">
			<div class="top-container">
				<div class="top-bar w">
					<a class="logo">
						<img src="../../static/logo.png" alt="">
					</a>
					<div class="user">
						<div class="user-info" @click="showUser">
							<div class="imgu">
								<image :src="user_img" mode="aspectFill"></image>
							</div>
							<div class="user-name">{{user_name}}</div>
						</div>
						<div class="money-info" @click="show_chongzhi_confirm = true">
							<i class="iconfont icon-zichan"></i>
							<span class="money">{{balance}}</span>
						</div>
						<i class="iconfont icon-Other-25 chat" @click="to_chat_page"></i>
						<i class="iconfont icon-tuichu1 tuichu" @click="quit"></i>
					</div>
				</div>
			</div>
		</div>
		<!-- 用户信息 -->
		<div class="user-detail-container" v-show="isShowUser">
			<div class="user-detail">
				<div class="user-detail-left">
					<div class="user-detail-img">
						<image :src="user_img" mode="aspectFill"></image>
					</div>
				</div>
				<div class="user-detail-right">
					<div class="inner-detail">
						<div class="q">用户名:</div>
						<div class="a">{{user_name}}</div>
					</div>
					<div class="inner-detail">
						<div class="q">E-mail:</div>
						<div class="a">{{user_id}}</div>
					</div>
					<div class="inner-detail">
						<div class="q">金&nbsp;&nbsp;&nbsp;币:</div>
						<div class="a">{{balance}}</div>
						<div class="chongzhi-link" @click="show_chongzhi_confirm = true">零钱管理</div>
					</div>
				</div>
				<div class="modify-img" @click="show_update_img()">更换头像</div>
				<div class="modify-msg" @click="showMod">修改个人信息</div>
				<div class="close"><i class="iconfont icon-guanbi" @click="closeUser"></i></div>
			</div>
		</div>

		<!-- 修改个人信息 -->
		<div class="modify-msg-detail-container" v-show="isShowMod">
			<div class="modify-msg-detail">
				<div class="modify-msg-detail-header">修改个人信息</div>
				<div class="msg-detail-content">
					<div>
						<div>用户名:</div>
						<input type="text" :value="name" @input="name_input" />
					</div>
					<div>
						<div>E-mail:</div>
						<input type="text" :value="user_id" disabled="disabled" class="disabled" />
					</div>
					<div class="pw-container">
						<div>原密码:</div>
						<input type="password" v-if="!showPWO" v-model="pwdo">
						<input type="text" v-else="showPWO" v-model="pwdo">
						<i class="iconfont icon-type" @click="changePwOType"
							:class="showPWO?'icon-hover':'icon-normal'"></i>
					</div>
					<div class="pw-container">
						<div>新密码:</div>
						<input type="password" v-if="!showPWN" v-model="pwdn">
						<input type="text" v-else="showPWN" v-model="pwdn">
						<i class="iconfont icon-type" @click="changePwNType"
							:class="showPWN?'icon-hover':'icon-normal'"></i>
					</div>
					<el-link :underline="false" type="info" style="margin-left: 70%;" @click="forget_pwd()">忘记密码?</el-link>
					<div>
						<button @click="mod_msg()">提交</button>
					</div>
				</div>
				<div class="close"><i class="iconfont icon-guanbi" @click="closeMod"></i></div>
			</div>
		</div>

		<!-- chat -->
		<div v-drag class="chat-wrapper" v-show="showChat">
			<view class="chat-top-bar">
				<view class="chat-left">
					<view class="search-person">
						<el-input placeholder="请输入内容" v-model="input4" size="mini">
							<i slot="prefix" class="el-input__icon el-icon-search"></i>
						</el-input>
					</view>
					<view class="add-person-button">
						<el-button icon="el-icon-plus" size="mini" style="padding:7px;"></el-button>
					</view>
				</view>
				<view class="chat-title">商城聊天</view>
				<view class="close-icon" @click="showChat=false">
					<el-button icon="el-icon-close" size="mini" style="padding:7px;"></el-button>
				</view>
			</view>
			<JwChat-index :config="config" :showRightBox='false' scrollType="noroll" :width="650" :taleList="taleList"
				@enter="bindEnter" @clickTalk="talkEvent" v-model="inputMsg" :toolConfig="tool"
				:winBarConfig="winBarConfig" style="box-shadow:none; margin-left:250px;">
			</JwChat-index>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShowUser: false,
				isShowMod: false,
				showPWO: false,
				showPWN: false,
				name: '',
				pwdo: '',
				pwdn: '',
				src: this.user_img,
				show_mod_img: false,
				show_tixian: false,
				show_chongzhi_confirm: false,
				show_money_pwd_flag: false,
				chongzhi_input: '',
				tixian_input: '',
				pwd: '',
				showChat: false,
				inputMsg: '',
				taleList: [{
						"date": "2020/04/25 21:19:07",
						"text": {
							"text": "起床不"
						},
						"mine": false,
						"name": "留恋人间不羡仙",
						"img": "../image/one.jpeg"
					},
					{
						"date": "2021/03/02 13:14:21",
						"mine": false,
						"name": "留恋人间不羡仙",
						"img": "../image/one.jpeg",
						"text": {
							system: {
								title: '在接入人工前，智能助手将为您首次应答。',
								subtitle: '猜您想问:',
								content: [{
										id: `system1`,
										text: '组件如何使用'
									},
									{
										id: `system2`,
										text: '组件参数在哪里查看'
									},
									{
										id: 'system',
										text: '我可不可把组件用在商业'
									}
								]
							}
						}
					}
				],
				tool: {
					// show: ['file', 'history', 'img', ['文件1', '', '美图']],
					// showEmoji: false,
					callback: this.toolEvent
				},
				config: {
					img: '../image/cover.png',
					name: 'JwChat',
					dept: '最简单、最便捷',
					callback: this.bindCover,
					historyConfig: {
						show: true,
						tip: '加载更多',
						callback: this.bindLoadHistory,
					},
				},
				winBarConfig: {
					active: 'win00',
					width: '250px',
					listHeight: '60px',
					list: [{
						id: 'win00',
						img: '..//image/cover.png',
						name: 'JwChat',
						dept: '最简单、最便捷',
						readNum: 99
					}],
					callback: this.bindWinBar,
				}
			}
		},
		props: {
			user_name: {
				type: String,
				default: ''
			},
			balance: {
				type: Number,
				default: 0
			},
			user_img: {
				type: String,
				default: ''
			},
			user_id: {
				type: String,
				default: ''
			},
			password: {
				type: String,
				default: ''
			}
		},
		methods: {
			to_chat_page(){
				uni.navigateTo({
					url: `/pages/chat/chat?user_id_login=${this.user_id}`
				});
			},
			name_input: function(e) {
				this.name = e.detail.value;
			},
			showUser() {
				this.isShowUser = true;
			},
			closeUser() {
				this.isShowUser = false;
			},
			showMod() {
				this.isShowMod = true;
			},
			closeMod() {
				this.isShowMod = false;
			},
			changePwOType: function() {
				this.showPWO = !this.showPWO;
			},
			changePwNType: function() {
				this.showPWN = !this.showPWN;
			},
			chongzhi_outer() {
				var val = this.chongzhi_input;
				var msg = '充值';
				if (this.show_tixian) {
					val = this.tixian_input;
					msg = '提现';
				}
				if (val.length == 0) {
					this.$message({
						message: `请填写${msg}金额!`,
						type: 'warning'
					});
					return;
				}
				if (isNaN(val)) {
					this.$message({
						message: `${msg}金额非数!`,
						type: 'warning'
					});
					return;
				}
				if (Number(val) < 0) {
					this.$message({
						message: `${msg}金额不能为负数!`,
						type: 'warning'
					});
					return;
				}
				this.show_money_pwd_flag = true;
			},
			chongzhi_inner() {
				if (this.pwd != this.password) {
					this.$message({
						message: '密码错误!',
						type: 'warning'
					});
					return;
				}
				var val = this.chongzhi_input;
				var msg = '充值';
				if (this.show_tixian) {
					val = String(-Number(this.tixian_input));
					console.log(val);
					msg = '提现';
				}
				uni.request({
					method: 'POST',
					url: `/api/users/${this.user_id}/recharge`,
					data: val,
					success: (res) => {
						if (res.statusCode == 200) {
							this.$message({
								message: `${msg}成功!`,
								type: 'success'
							});
						} else {
							this.$message.error(`${msg}失败!`);
						}
					}
				});
				this.show_chongzhi_confirm = false;
				this.show_money_pwd_flag = false;
			},
			mod_msg() {
				var mod_name = this.user_name;
				var mod_pwd = this.password;
				if (this.name.length != 0) {
					mod_name = this.name;
				}
				if (this.pwdn.length != 0) {
					if (this.pwdo != this.password) {
						this.$message({
							message: '原密码错误!',
							type: 'warning'
						});
						return;
					}
					mod_pwd = this.pwdn;
				}
				if (this.name.length == 0 && this.pwdn.length == 0) {
					this.$message({
						message: '用户信息未修改!',
						type: 'warning'
					});
					return;
				}
				uni.request({
					method: 'POST',
					url: `/api/users/${this.user_id}`,
					data: {
						"userName": mod_name,
						"password": mod_pwd
					},
					success: (res) => {
						if (res.statusCode == 200) {
							this.$message({
								message: "修改信息成功!",
								type: 'success'
							});
						} else {
							this.$message.error("修改信息失败!");
						}
					}
				});
				this.isShowMod = false;
			},
			forget_pwd(){
				this.send_email(this.user_id,this.password,'密码已成功发送至邮箱!','发送失败,请重新发送!');
			},
			quit() {
				this.val = [true, false],
					uni.reLaunch({
						url: "/pages/login/login"
					})
			},
			upload_img: function() {
				var that = this;
				// 从本地相册选择图片或使用相机拍照。
				uni.chooseImage({
					count: 1, //最多可以选择的图片张数，默认9
					//album 从相册选图，camera 使用相机，默认二者都有。
					sourceType: ['album'],
					success: function(res) {
						//获取图片信息。
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: function(image) {
								that.src = (res.tempFilePaths[0]);
								console.log(that.src); //打印出图片信息,在浏览器上打开就是你上传的图片
								//将本地资源上传到开发者服务器，客户端发起一个 POST 请求，其中 content-type 为 multipart/form-data
							}
						})
					}
				});
			},
			update_img() {
				uni.request({
					method: 'POST',
					url: `/api/users/${this.user_id}`,
					data: {
						"picUrl": this.src
					},
					success: (res) => {
						if (res.statusCode == 200) {
							console.log(res.data);
							this.$message({
								message: "更换头像成功!",
								type: 'success'
							});
						} else {
							this.$message.error("更换头像失败!");
						}
					}
				});
				this.show_mod_img = false;
			},
			show_update_img() {
				this.show_mod_img = true;
				this.src = this.user_img;
			},
			bindEnter() {
				const msg = this.inputMsg
				if (!msg) return;
				const msgObj = {
					"date": "2020/05/20 23:19:07",
					"text": {
						"text": msg
					},
					"mine": true,
					"name": "JwChat",
					"img": "../image/three.jpeg"
				}
				this.list.push(msgObj)
			},
			/**
			 * @description: 
			 * @param {*} type 当前点击的按钮
			 * @param {*} plyload 附加文件或者需要处理的数据
			 * @return {*}
			 */
			toolEvent(type, plyload) {
				console.log('tools', type, plyload)
			},
			/**
			 * @description: 点击加载更多的回调函数
			 * @param {*}
			 * @return {*}
			 */
			bindLoadHistory() {
				const history = new Array(3).fill().map((i, j) => {
					return {
						"date": "2020/05/20 23:19:07",
						"text": {
							"text": j + new Date()
						},
						"mine": false,
						"name": "JwChat",
						"img": "image/three.jpeg"
					}
				})
				let list = history.concat(this.list)
				this.list = list
				console.log('加载历史', list, history)
			},
			bindCover(type) {
				console.log('header', type)
			},
			bindWinBar(play = {}) {
				const {
					type,
					data = {}
				} = play
				console.log(data);
				if (type === 'winBar') {
					const {
						id,
						dept,
						name,
						img
					} = data
					this.winBarConfig.active = id
				}
			}
		}
	}
</script>

<style>
	@import url("../../style/nav/nav.css");

	.mod-pic-container {
		width: 200px;
		height: 220px;
		margin-left: 20%;
	}

	.pic-style {
		width: 200px;
		height: 200px;
	}

	.pic-style image {
		width: 100%;
		height: 100%;
	}
</style>
