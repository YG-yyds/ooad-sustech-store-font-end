<template>
	<body>
		<top-bar :user_id="user_list.userId" :user_img="user_list.picUrl" :user_name="user_list.userName"
			:password="user_list.password" :balance="user_list.balance"></top-bar>
		<left-bar :user_id="user_list.userId"></left-bar>

		<el-dialog title="修改商品价格" :visible.sync="show_mod_confirm" width="25%">
			<el-input v-model="price_mod" style="width: 80%; margin-left: 8%;"></el-input>
			<el-dialog width="25%" title="确认信息" :visible.sync="show_inner" append-to-body>
				<span style="font-size: 15px;">是否确认修改商品价格?</span>
				<div slot="footer" class="dialog-footer">
					<el-button @click="show_inner = false">取消</el-button>
					<el-button type="primary" @click="modify_price()">确定</el-button>
				</div>
			</el-dialog>
			<div slot="footer" class="dialog-footer">
				<el-button @click="show_mod_confirm = false">取消</el-button>
				<el-button type="primary" @click="show_inner_func()">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="请填写交易地点与备注" :visible.sync="dialogFormVisible" style="width: 85%; margin: 0 auto;">
			<el-form :model="form">
				<el-form-item label="交易地点" :label-width="formLabelWidth">
					<el-select v-model="form.location" placeholder="请选择" :popper-append-to-body="false"
						class="el-select">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品备注" :label-width="formLabelWidth">
					<el-input type="textarea" v-model="form.remark" autocomplete="off" style="width: 400px;"
						maxlength="50"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="create_trade(0)">确定</el-button>
			</div>
		</el-dialog>

		<!-- 顶部 -->
		<div id="header">
			<div class="nav-container">
				<div class="nav-bar w2">
					<div class="nav-left">
						<div class="item-id-style">商品ID: {{item_id}}</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 中部 -->
		<div class="other">
			<div class="publish-container w2" v-show="!is_show_publish_form">
				<div class="publish-detail">
					<div class="publish-detail-content">
						<div class="publish-left">
							<div class="img-container goods-img-container">
								<image :src="goods_detail.pic_url" mode="aspectFill" class="goods-image"></image>
							</div>
						</div>
						<div class="publish-right">
							<div class="goods-container">
								<div class="goods-title">{{goods_detail.title}}</div>
								<div class="person">
									<div class="person-img-container" @click="to_person_detail">
										<image :src="user_detail.picUrl" mode="aspectFill"></image>
									</div>
									<div class="person-right">
										<div class="person-dtl-container">
											<div>用户名:</div>
											<div class="a">{{user_detail.userName}}</div>
										</div>
										<div class="person-dtl-container">
											<div>E-mail:</div>
											<div class="a">{{user_detail.userId}}</div>
										</div>
									</div>
									<div class="add-person" v-show="!get_is_xiugai(0)" @click="add_friend()">
										<i class="iconfont icon-tianjiahaoyou"></i>
									</div>
								</div>
								<div class="price-container">
									<div class="price">
										<div v-show="is_sale">售价:</div>
										<div v-show="!is_sale">预期:</div>
										<div class="price-val">
											<i class="iconfont icon-YUAN"></i>
											<span>{{goods_detail.price}}</span>
										</div>
									</div>
									<div class="icon-edit" v-show="!get_is_xiugai(1)" @click="show_mod_confirm = true">
										<i class="iconfont icon-Other-7"></i>
									</div>
								</div>
								<div class="condition">
									<div class="condition-l">商品分类:</div>
									<div>{{goods_detail.category}}</div>
								</div>

								<div class="condition">
									<div class="condition-l">商品标签:</div>
									<div class="label-container">
										<div v-for="(label,label_i) in goods_detail.tags" class="label-item">{{label}}
										</div>
									</div>
								</div>

								<div class="goods-intro">
									<div class="wei-intro">商品介绍:</div>
									<div class="intro-detail">
										{{goods_detail.description}}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="button-list" v-show="button_show(0)">
						<button @click="like()" v-show="!cur_like">收藏</button>
						<button @click="unlike()" v-show="cur_like">移除</button>
						<button @click="show()" v-show="is_sale">购买</button>
						<button v-show="!is_sale" @click="show_youhuo()">有货</button>
						<button @click="back_to_prev_page()">返回</button>
					</div>
					<div class="button-list xiugai" v-show="button_show(1)">
						<button @click="show_publish_form()">修改</button>
						<button @click="back_to_prev_page()">返回</button>
					</div>
					<div class="button-list xiugai" v-show="button_show(2)">
						<button @click="shangjia">上架</button>
						<button @click="back_to_prev_page()">返回</button>
					</div>
				</div>
				<div class="sold-out" v-show="!goods_detail.display">
					<i class="iconfont icon-haofangtuo400iconfontyixiajia"></i>
				</div>
			</div>
			<div class="publish-container w2" v-show="is_show_publish_form">
				<div class="publish-detail">
					<div class="publish-detail-content">
						<div class="publish-left">
							<div class="img-container">
								<image :src="src" mode="aspectFill"></image>
							</div>
							<div class="upload-img" @click="upload_img">上传商品图片</div>
						</div>
						<div class="publish-right">
							<view class="condition-container">
								<view class="condition1">
									<label class="condition-name-task">商品名称:</label>
									<input class="goods-input" @input="goods_name_input" :value="goods_name" />
								</view>
								<view class="condition">
									<label class="condition-name">交易类型:</label>
									<picker :value="type_value" @change="type_change" :range="type_items"
										selector-type="select" class="picker-pick">
										<view class="item-pick">{{type_value}}</view>
									</picker>
								</view>
								<view class="condition">
									<label class="condition-name">商品分类:</label>
									<picker :value="class_value" @change="class_change" :range="class_items"
										selector-type="select" class="picker-pick">
										<view class="item-pick">{{class_value}}</view>
									</picker>
								</view>
								<view class="condition1">
									<view class="condition">
										<label class="condition-name">商品标签:</label>
										<view class="label-container">
											<view class="label-item" v-for="(item,i) in label_arr">{{item}}</view>
											<view class="label-item p" @click="add_goods_label">+</view>
											<view class="label-item p" @click="delete_goods_label">-</view>
										</view>
									</view>
									<input class="goods-input" @input="goods_label_input" :value="goods_label" />
								</view>
								<view class="condition1">
									<label class="condition-name-task" v-show="type_bool">商品价格:</label>
									<label class="condition-name-task" v-show="!type_bool">预期价格:</label>
									<input class="goods-input" @input="goods_price_input" :value="goods_price" />
								</view>
								<view class="condition2">
									<label class="condition-name-task">商品介绍:</label>
									<textarea class="goods-input" @input="goods_info_input" maxlength="-1"
										id="goods-info" :value="goods_info" />
								</view>
							</view>
						</div>
					</div>
					<div class="button-list xiugai">
						<button @click="close_publish_form">取消</button>
						<button @click="submit">提交</button>
					</div>
				</div>
			</div>
		</div>
	</body>
</template>

<script>
	import topBar from '../../components/top-bar/top-bar.vue';
	import leftBar from '../../components/left-bar/left-bar.vue';
	export default {
		onLoad(options) {
			console.log(options);
			var user_id_login = options.user_id_login;
			this.load_user(user_id_login);
			var id = options.item_id;
			this.item_id = id;
			this.get_goods_data_by_id(id);
			this.check_in_like_list(user_id_login,id);
		},
		data() {
			return {
				is_sale: true,
				goods_detail: [],
				user_detail: [],
				user_list: [], //login
				item_id: '',
				pw_input: '',
				options: [{
					value: '七号门',
					label: '七号门'
				}, {
					value: '一教',
					label: '一教'
				}, {
					value: '湖畔',
					label: '湖畔'
				}, {
					value: '欣园',
					label: '欣园'
				}, {
					value: '慧园',
					label: '慧园'
				}, {
					value: '荔园',
					label: '荔园'
				}, {
					value: '新宿舍',
					label: '新宿舍'
				}, {
					value: '工学院',
					label: '工学院'
				}],
				dialogFormVisible: false,
				form: {
					remark: '',
					location: '',
				},
				formLabelWidth: '120px',
				goods_name: '',
				type_items: ['求购商品', '出售商品'],
				type_value: '',
				type_bool: false,
				class_items: ['电子产品', '食品', '学习用品', '服装', '运动器械', '其他'],
				class_value: '',
				goods_price: '',
				goods_info: '',
				label_id: 0,
				label_arr: [],
				goods_label: '',
				src: '',
				is_show_publish_form: false,
				show_mod_confirm: false,
				show_inner: false,
				price_mod: '',
				cur_like:false
			}
		},
		components: {
			topBar: topBar,
			leftBar: leftBar
		},
		methods: {
			password_input: function(e) {
				this.pw_input = e.detail.value;
			},
			get_goods_data_by_id: function(id) {
				uni.request({
					method: 'GET',
					url: `/api/items/${id}`,
					success: (res) => {
						if (res.statusCode == 200) {
							this.goods_detail = res.data;
							if (this.goods_detail.type == '卖') {
								this.is_sale = true;
							} else {
								this.is_sale = false;
							}
							uni.request({
								method: 'GET',
								url: this.goods_detail._links.user.href,
								success: (res1) => {
									if (res1.statusCode == 200) {
										this.user_detail = res1.data;
									} else {
										uni.showToast({
											title: res1.statusCode,
											icon: "error",
											duration: 2000
										});
									}
								}
							});
							this.goods_name = this.goods_detail.title;
							if (this.goods_detail.type == '买') {
								this.type_value = '求购商品';
								this.type_bool = false;
							} else {
								this.type_value = '出售商品';
								this.type_bool = true;
							}
							this.class_value = this.goods_detail.category;
							this.goods_price = this.goods_detail.price;
							this.goods_info = this.goods_detail.description;
							this.src = this.goods_detail.pic_url;
							this.label_arr = this.goods_detail.tags;
							this.label_id = this.label_arr.length;
						}
					}
				});
			},
			to_person_detail: function() {
				uni.navigateTo({
					url: `/pages/person/person?user_id_login=${this.user_list.userId}&user_id=${this.user_detail.userId}`
				})
			},
			beizhu_input: function(e) {
				this.beizhu_val = e.detail.value;
			},
			show() {
				this.dialogFormVisible = true;
			},
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
			get_is_xiugai: function(type) {
				if (type == 1) {
					if (!this.goods_detail.display) {
						return false;
					}
				}
				return this.user_list.userId == this.user_detail.userId;
			},
			button_show(type) {
				if (type == 0) { //购物
					if ((this.goods_detail.display == true) && (this.user_list.userId != this.user_detail.userId)) {
						return true;
					} else {
						return false;
					}
				} else if (type == 1) { //修改
					if ((this.goods_detail.display == true) && (this.user_list.userId == this.user_detail.userId)) {
						return true;
					} else {
						return false;
					}
				} else { //下架
					if (this.goods_detail.display == false) {
						return true;
					} else {
						return false;
					}
				}
			},
			create_trade: function(type) {
				if (type == 0) {
					//购买
					if (this.form.location.length == 0) {
						this.$message({
							message: '请选择交易地点!',
							type: 'warning'
						});
						return;
					}
					uni.request({
						method: 'POST',
						url: `/api/items/${this.item_id}/trade`,
						data: {
							"userId": this.user_list.userId,
							"location": this.form.location,
							"remark": this.form.remark
						},
						success: (res) => {
							if (res.statusCode == 200) {
								console.log(res.data);
							}
						}
					});
				} else {
					//有货
					uni.request({
						method: 'POST',
						url: `/api/items/${this.item_id}/trade`,
						data: {
							"userId": this.user_list.userId,
							"location": null,
							"remark": ''
						},
						success: (res) => {
							if (res.statusCode == 200) {
								console.log(res.data);
							}
						}
					});
				}
				this.dialogFormVisible = false;
				this.send_email(this.user_detail.userId,'您有新的订单,请及时处理!','成功生成订单,并通知对方!','成功生成订单,发送邮件失败,请及时联系对方!');
			},
			back_to_prev_page: function() {
				console.log(getCurrentPages(1));
				uni.navigateBack({
					delta: 1
				});
			},
			show_youhuo: function() {
				this.$confirm('是否创建订单，并通知对方有货?', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(() => {
						this.create_trade(1);
					})
			},
			show_publish_form: function() {
				this.is_show_publish_form = true;
			},
			close_publish_form: function() {
				this.is_show_publish_form = false;
			},
			goods_name_input: function(e) {
				this.goods_name = e.detail.value;
			},
			goods_price_input: function(e) {
				this.goods_price = e.detail.value;
			},
			goods_info_input: function(e) {
				this.goods_info = e.detail.value;
			},
			goods_label_input: function(e) {
				this.goods_label = e.detail.value;
			},
			add_goods_label: function() {
				if (this.label_id == 3) {
					this.$message({
						message: '标签个数不得超过3!',
						type: 'warning'
					});
					return;
				}
				if (this.goods_label.length == 0) {
					this.$message({
						message: '标签不可为空!',
						type: 'warning'
					});
					return;
				}
				if (this.goods_label.length > 3) {
					this.$message({
						message: '标签内字数不得超过3!',
						type: 'warning'
					});
					return;
				}
				this.label_arr[this.label_id] = this.goods_label;
				this.goods_label = '';
				this.label_id += 1;
				this.$forceUpdate(); //处理v-for不能刷新问题，这里强制刷新了，考虑是否替换这个
			},
			delete_goods_label: function() {
				if (this.label_id == 0) {
					this.$message({
						message: '请添加标签!',
						type: 'warning'
					});
					return;
				}
				this.label_id -= 1;
				this.label_arr.pop();
				this.$forceUpdate(); //处理v-for不能刷新问题，这里强制刷新了，考虑是否替换这个
			},
			type_change: function(e) {
				const val = e.detail.value;
				this.type_value = this.type_items[val];
				if (val == 1) {
					this.type_bool = true;
				} else {
					this.type_bool = false;
				}
			},
			class_change: function(e) {
				const val = e.detail.value;
				this.class_value = this.class_items[val];
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
				})
			},
			change_type: function(type) {
				if (type == '求购商品') {
					return '买';
				} else {
					return '卖';
				}
			},
			get_tags: function() {
				var arr = []
				for (var i = 0; i < this.label_arr.length; i++) {
					arr[i] = this.label_arr[i];
				}
				return arr;
			},
			submit: function() {
				if (this.goods_name.length == 0) {
					this.$message({
						message: '请填写商品名称!',
						type: 'warning'
					});
					return;
				}
				if (this.get_tags().length == 0) {
					this.$message({
						message: '请添加商品标签!',
						type: 'warning'
					});
					return;
				}
				if (this.goods_price.length == 0) {
					var text = '预期';
					if (this.type_bool) {
						text = '商品';
					}
					this.$message({
						message: `请填写${text}价格!`,
						type: 'warning'
					});
					return;
				}
				if (this.goods_info.length == 0) {
					this.$message({
						message: '请填写商品介绍!',
						type: 'warning'
					});
					return;
				}
				uni.request({
					method: 'POST',
					url: `/api/items/${this.item_id}`,
					data: {
						"price": this.goods_price,
						"title": this.goods_name,
						"type": this.change_type(this.type_value),
						"category": this.class_value,
						"tags": this.get_tags(),
						"description": this.goods_info,
						"picUrl": this.src,
						"display": true
					},
					success: (res) => {
						console.log(res.data);
					}
				});
				this.$confirm('是否确认修改商品信息并提交?', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(() => {
						this.is_show_publish_form = false;
						this.$message({
							message: '成功修改商品信息!',
							type: 'success'
						});
					})
			},
			modify_price() {
				uni.request({
					method: 'POST',
					url: `/api/items/${this.item_id}`,
					data: {
						"price": this.price_mod
					},
					success: (res) => {
						console.log(res.data);
					}
				});
				this.show_inner = false;
				this.show_mod_confirm = false;
				this.$message({
					message: '成功修改商品价格!',
					type: 'success'
				});
			},
			show_inner_func() {
				if (this.price_mod.length == 0) {
					this.$message({
						message: '请填写商品价格!',
						type: 'warning'
					});
					return;
				}
				if (isNaN(this.price_mod)) {
					this.$message({
						message: '商品价格非数!',
						type: 'warning'
					});
					return;
				}
				this.show_inner = true;
			},
			shangjia() {
				this.$confirm('是否上架该商品?', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(() => {
						uni.request({
							method: 'POST',
							url: `/api/items/${this.item_id}/display`,
							data: "true",
							success: (res) => {
								if (res.statusCode == 204) {
									this.$message({
										type: 'success',
										message: '成功上架该商品!'
									});
								} else {
									this.$message.error('上架失败!');
								}
							}
						});
					});
			},
			like() {
				this.$confirm('是否收藏该商品?', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(() => {
						uni.request({
							method: 'POST',
							url: `/api/users/${this.user_list.userId}/like/${this.item_id}`,
							success: (res) => {
								if (res.statusCode == 204) {
									this.$message({
										type: 'success',
										message: '该商品已成功添加收藏夹!'
									});
								} else {
									this.$message.error('收藏失败!');
								}
							}
						});
					});
			},
			check_in_like_list(id,item_id){
				uni.request({
					method: 'GET',
					url: `/api/users/${id}/list-likes`,
					success: (res) => {
						if (res.statusCode == 200) {
							this.cur_like = false;
							var like_list = res.data._embedded.itemEntityList;
							for(var i=0;i<like_list.length;i++){
								var cur = like_list[i]._links.self.href.split('/')[4];
								if(cur == item_id){
									this.cur_like = true;
									break;
								}
							}
						}
					}
				});
			},
			unlike(){
				this.$confirm('是否将该商品移出收藏夹?', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(() => {
						uni.request({
							method: 'POST',
							url: `/api/users/${this.user_list.userId}/unlike/${this.item_id}`,
							success: (res) => {
								if (res.statusCode == 204) {
									this.$message({
										type: 'success',
										message: '该商品已成功移除收藏夹!'
									});
								} else {
									this.$message.error('移除失败!');
								}
							}
						});
					});
			},
			add_friend(){
				this.$confirm('是否添加该用户为好友?', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(() => {
						uni.request({
							method: 'GET',
							url: `/api/users/${this.user_list.userId}/friends`,
							success: (res) => {
								if (res.statusCode == 200) {
									var friends = res.data;
									console.log(friends);
									for(var i=0;i<friends.length;i++){
										if(friends[i].userId == this.user_detail.userId){
											this.$message({
												type: 'warning',
												message: '已添加该用户为好友!'
											});
											return;
										}
									}
									uni.request({
										method: 'POST',
										url: `/api/users/${this.user_list.userId}/add-friend/${this.user_detail.userId}`,
										success: (res) => {
											if (res.statusCode == 204) {
												uni.request({
													method: 'POST',
													url: `/api/users/${this.user_detail.userId}/add-friend/${this.user_list.userId}`,
													success: (res) => {
														if (res.statusCode == 204) {
															var str = `用户${this.user_list.userName},邮箱为${this.user_list.userId},已添加您为好友,请及时查看!`;
															this.send_email(this.user_detail.userId,str,'已成功添加该用户为好友!','成功添加好友,但发送邮件失败!');
															// this.$message({
															// 	type: 'success',
															// 	message: '已成功添加该用户为好友!'
															// });
														}else{
															this.$message.error('添加好友失败!');
														}
													}
												});
											}else{
												this.$message.error('添加好友失败!');
											}
										}
									});
								} else {
									this.$message.error('添加好友失败!');
								}
							}
						});
						// uni.request({
						// 	method: 'GET',
						// 	url: `/api/users/search-by-name?name=${this.user_detail.userName}`,
						// 	success: (res) => {
						// 		if (res.statusCode == 200) {
						// 			console.log(res.data);
						// 		} else {
						// 			this.$message.error('添加好友失败!');
						// 		}
						// 	}
						// });
					});
			}
		}
	}
</script>

<style>
	@import url("../../style/nav/nav.css");
	@import url("../../style/publish/publish.css");
	@import url("../../style/menban/menban.css");
</style>
