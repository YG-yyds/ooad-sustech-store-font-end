<template>
	<view class="body">
		<div class="outer-wrapper">
			<div class="pic"></div>
			<div class="log-reg">
				<div class="d">
					<h1 v-show="!isReg" class="welcome">Welcome to SUSTech STORE</h1>
					<h1 class="lr-title"><span @click="logShow">登录</span>/<span @click="regShow">注册</span></h1>
					<div v-show="!isReg">
						<input type="text" class="e" placeholder="E-MAIL" :value="user_id_login" @input="user_id_input">
						<div class="password-wrapper" v-show="isPW">
							<input type="password" name="user_password" placeholder="PASSWORD" v-if="!showPW"
								v-model="pwd" class="e">
							<input type="text" name="user_password" placeholder="PASSWORD" v-else="showPW" v-model="pwd"
								class="e">
							<i class="iconfont icon-type to-right" @click="changePwType"
								:class="showPW?'icon-hover':'icon-normal'"></i>
						</div>
						<div class="verify-wrapper" v-show="!isPW">
							<input type="text" name="verify" placeholder="CODE" class="verify-input e" @input="veriCode_input">
							<el-link disabled class="time to-right" v-show="show_timer_log">{{second_log}}s</el-link>
							<el-link class="to-right" :underline="false" @click="send_log_ver()" v-show="!show_timer_log">发送验证码</el-link>
						</div>
						<el-link :underline="false" id="vr-way" @click="emailShow" :style="emailActive" class="f"
							v-show="isPW">邮件验证码登录</el-link>
						<el-link :underline="false" id="pw-way" @click="pwShow" :style="pwActive" class="f"
							v-show="!isPW">账户密码登录</el-link>
						<button class="g" @click="log_pwd()">Login</button>
					</div>
					<div v-show="isReg">
						<input type="text" class="e" placeholder="USER NAME" :value="reg_name" @input="reg_name_input">
						<input type="text" class="e" placeholder="E-MAIL" :value="reg_email" @input="reg_email_input">
						<div class="password-wrapper">
							<input type="password" name="user_password" placeholder="PASSWORD" v-if="!showPWr"
								v-model="pwdr" class="e">
							<input type="text" name="user_password" placeholder="PASSWORD" v-else="showPWr"
								v-model="pwdr" class="e">
							<i class="iconfont icon-type to-right" @click="changePwrType"
								:class="showPWr?'icon-hover':'icon-normal'"></i>
						</div>
						<div class="verify-wrapper">
							<input type="text" name="verify" placeholder="CODE" class="verify-input e"
								v-model="veriCoder" @input="veriCoder_input">
							<el-link disabled class="time to-right" v-show="show_timer_reg">{{second_reg}}s</el-link>
							<el-link :underline="false" class="to-right" @click="send_reg_ver()"
								v-show="!show_timer_reg">发送验证码</el-link>
						</div>
						<button class="g" @click="reg_func()">Register</button>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isReg: false,
				isPW: true,
				showPW: false,
				pwd: '',
				showPWr: false,
				pwdr: '',
				second_reg: 60,
				second_log: 60,
				userr: '',
				emailr: '',
				veriCode:'',
				veriCode_send:'',
				veriCoder: '',
				veriCoder_send: '',
				sendr: false,
				user_id_login: '',
				reg_name: '',
				reg_email: '',
				show_timer_reg: false,
				show_timer_log: false
			}
		},
		methods: {
			to_home: function() {
				uni.navigateTo({
					url: `/pages/home/home?user_id_login=${this.user_id_login}`
				})
			},
			logShow: function() {
				this.isReg = false;
			},
			regShow: function() {
				this.isReg = true;
			},
			pwShow: function() {
				this.isPW = true;
			},
			emailShow: function() {
				this.isPW = false;
			},
			changePwType: function() {
				this.showPW = !this.showPW;
			},
			changePwrType: function() {
				this.showPWr = !this.showPWr;
			},
			user_id_input: function(e) {
				this.user_id_login = e.detail.value;
			},
			reg_name_input: function(e) {
				this.reg_name = e.detail.value;
			},
			reg_email_input: function(e) {
				this.reg_email = e.detail.value;
			},
			veriCoder_input: function(e) {
				this.veriCoder = e.detail.value;
			},
			veriCode_input: function(e) {
				this.veriCode = e.detail.value;
			},
			send_reg_ver() {
				if (this.reg_email.length == 0) {
					this.$message({
						message: '请输入邮箱!',
						type: 'warning'
					});
					return;
				}
				var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
				if (!reg.test(this.reg_email)) {
					this.$message({
						message: '邮箱格式不正确!',
						type: 'warning'
					});
					return;
				}
				var random_ver = this.randomNum(1000, 9999);
				this.veriCoder_send = String(random_ver);
				this.send_email(this.reg_email, this.veriCoder_send, '成功发送验证码!', '发送验证码失败!');
				this.show_timer_reg = true;
				var interval = setInterval(() => {
					let times = --this.second_reg;
					this.second_reg = times < 10 ? '0' + times : times; //小于10秒补 0
				}, 1000);
				setTimeout(() => {
					clearInterval(interval);
					this.second_reg = 60;
					this.show_timer_reg = false;
				}, 60000);
			},
			send_log_ver() {
				if (this.user_id_login.length == 0) {
					this.$message({
						message: '请输入邮箱!',
						type: 'warning'
					});
					return;
				}
				var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
				if (!reg.test(this.user_id_login)) {
					this.$message({
						message: '邮箱格式不正确!',
						type: 'warning'
					});
					return;
				}
				var random_ver = this.randomNum(1000, 9999);
				this.veriCode_send = String(random_ver);
				this.send_email(this.user_id_login, this.veriCode_send, '成功发送验证码!', '发送验证码失败!');
				this.show_timer_log = true;
				var interval = setInterval(() => {
					let times = --this.second_reg;
					this.second_log = times < 10 ? '0' + times : times; //小于10秒补 0
				}, 1000);
				setTimeout(() => {
					clearInterval(interval);
					this.second_log = 60;
					this.show_timer_log = false;
				}, 60000);
			},
			reg_func() {
				if (this.reg_name.length == 0) {
					this.$message({
						message: '请输入用户名!',
						type: 'warning'
					});
					return;
				}
				if (this.reg_email.length == 0) {
					this.$message({
						message: '请输入邮箱!',
						type: 'warning'
					});
					return;
				}
				var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
				if (!reg.test(this.reg_email)) {
					this.$message({
						message: '邮箱格式不正确!',
						type: 'warning'
					});
					return;
				}
				if (this.pwdr.length == 0) {
					this.$message({
						message: '请输入密码!',
						type: 'warning'
					});
					return;
				}
				if (this.veriCoder.length == 0) {
					this.$message({
						message: '请输入验证码!',
						type: 'warning'
					});
					return;
				}
				if (this.veriCoder != this.veriCoder_send){
					this.$message({
						message: '验证码错误!',
						type: 'warning'
					});
					return;
				}
				uni.request({
					method: 'POST',
					url: '/api/users',
					data: {
						"userId": this.reg_email,
						"userName": this.reg_name,
						"password": this.pwdr,
						"picUrl": "https://s2.loli.net/2021/12/13/DAXdiWKM9OpJhmG.png",
						"balance": 0
					},
					success: (res) => {
						if (res.statusCode == 200) {
							console.log(res.data);
							this.$message({
								message: '注册成功!',
								type: 'success'
							});
							this.reg_email ='';
							this.reg_name = '';
							this.pwdr = '';
							this.veriCoder = '';
							this.isReg = false;
						} else {
							this.$message.error('邮箱已被占用!注册失败!');
						}
					}
				});
			},
			log_pwd(){
				if(this.user_id_login.length == 0){
					this.$message({
						message: '请输入邮箱!',
						type: 'warning'
					});
					return;
				}
				var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
				if (!reg.test(this.user_id_login)) {
					this.$message({
						message: '邮箱格式不正确!',
						type: 'warning'
					});
					return;
				}
				if(this.isPW){
					if (this.pwd.length == 0) {
						this.$message({
							message: '请输入密码!',
							type: 'warning'
						});
						return;
					}
					uni.request({
						method: 'POST',
						url: `/api/users/${this.user_id_login}/login`,
						data: this.pwd,
						success: (res) => {
							if (res.statusCode == 204) {
								this.to_home();
								this.user_id_login = '';
								this.pwd = '';
							} else if (res.statusCode == 404) {
								this.$message.error('找不到邮箱!');
							} else{
								this.$message.error('登陆失败,请检查邮箱与密码是否正确!')
							}
						}
					});
				}else{
					if (this.veriCode.length == 0) {
						this.$message({
							message: '请输入验证码!',
							type: 'warning'
						});
						return;
					}
					if (this.veriCode != this.veriCode_send){
						this.$message({
							message: '验证码错误!',
							type: 'warning'
						});
						return;
					}
					uni.request({
						method: 'GET',
						url: `/api/users/${this.user_id_login}`,
						success: (res) => {
							if (res.statusCode == 200) {
								this.to_home();
								this.user_id_login = '';
								this.pwd = '';
							} else if (res.statusCode == 404) {
								this.$message.error('找不到邮箱!');
							} else{
								this.$message.error('登陆失败!')
							}
						}
					});
				}
			},
			randomNum(minNum, maxNum) {
				switch (arguments.length) {
					case 1:
						return parseInt(Math.random() * minNum + 1, 10);
						break;
					case 2:
						return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
						break;
					default:
						return 0;
						break;
				}
			}
		}
	}
</script>

<style>
	/* @import url("login.css"); */
	.body {
		/* 设置背景渐变 */
		background-image: linear-gradient(to left,
				#9c88ff, #3cadeb);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100vh;
	}

	.outer-wrapper {
		position: relative;
		width: 1100px;
		height: 550px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, .8);
		display: flex;
	}

	.pic {
		width: 700px;
		height: 550px;
		background-image: url("../../static/chuyun.jpg");
		/* 让图片适应大小 */
		background-size: cover;
	}

	.lr-title {
		margin-top: 35px;
	}

	.log-reg {
		width: 400px;
		height: 550px;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.d {
		width: 270px;
		height: 500px;
	}

	.d h1 {
		font: 900 30px '';
	}

	h1 span {
		cursor: pointer;
	}

	.welcome {
		margin-top: 20px;
	}

	.e {
		width: 250px;
		margin: 20px 0;
		outline: none;
		border: 0;
		padding: 10px;
		border-bottom: 3px solid rgb(80, 80, 170);
		font: 900 16px '';
	}

	.password-wrapper,
	.verify-wrapper {
		position: relative;
	}

	.to-right {
		position: absolute;
		bottom: 11px;
		right: 1px;
	}

	.f {
		float: right;
		margin: 10px 0;
	}

	.g {
		position: absolute;
		margin: 35px;
		bottom: 30px;
		display: block;
		width: 200px;
		height: 60px;
		font: 900 30px '';
		text-decoration: none;
		line-height: 55px;
		border-radius: 30px;
		background-image: linear-gradient(to left,
				#9c88ff, #3cadeb);
		text-align: center;
		color: #FFFFFF;
	}

	.g:hover {
		color: rgb(40, 40, 170);
	}

	.body .msg-container {
		width: 250px;
		height: 150px;
		background-color: #fff;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.body .msg-container .guanbi-container {
		position: absolute;
		top: 0;
		right: 0;
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.body .msg-container .guanbi-container i {
		font-size: 25px;
	}

	.body .msg-container .guanbi-container:hover i {
		font-size: 28px;
		text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3);
	}

	.body .msg-container .msg {
		margin: 50px;
		font-size: 17px;
		line-height: 22px;
	}
</style>
