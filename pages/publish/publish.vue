<template>
	<body>
		<top-bar :user_id="user_list.userId" :user_img="user_list.picUrl" :user_name="user_list.userName"
			:password="user_list.password" :balance="user_list.balance"></top-bar>
		<left-bar cur_hover='2' :user_id="user_list.userId"></left-bar>

		<div id="header">
			<div class="nav-container">
				<div class="nav-bar w2">
					<div class="nav-left">
						<button @click="change_xiajia_flag(0)" v-show="!xiajia_flag">售货中</button>
						<button @click="change_xiajia_flag(1)" v-show="xiajia_flag">已下架</button>
						<button @click="show_publish_form">发布商品</button>
						<button @click="change_xiajia_btn">
							<div v-show="!is_xiajia_page">下架商品</div>
							<div v-show="is_xiajia_page">返回主页</div>
						</button>
					</div>
					<div class="nav-right">
						<div class="search">
							<input type="search" name="keyword" placeholder="Search..." autocomplete="off"
								@input="search_text_input" />
							<button type="submit" @click="search_by_goods_name">
								<i class="iconfont icon-hover1"></i>
							</button>
						</div>
						<div class="change-bsa" @click="change_bsa">
							<div v-show="bsa_val[0]">ALL</div>
							<div v-show="bsa_val[1]">SALE</div>
							<div v-show="bsa_val[2]">WANT</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="other">
			<div class="classify-container w2" v-show="!is_show_publish_form">
				<div class="classify">
					<div class="classify-title">商品分类</div>
					<div class="item-container">
						<radio-group name="item-list" class="radio-group-list" @change="check_box_change">
							<label style="width: 160px; margin-left: -50px;">
								<radio value="0" style="transform:scale(0.6);" checked="true" /><text>全部</text>
							</label>
							<label style="width: 130px;">
								<radio value="1" style="transform:scale(0.6)" /><text>电子产品</text>
							</label>
							<label style="width: 130px;">
								<radio value="2" style="transform:scale(0.6)" /><text>食品</text>
							</label>
							<label style="width: 130px;">
								<radio value="3" style="transform:scale(0.6)" /><text>学习用品</text>
							</label>
							<label style="width: 130px;">
								<radio value="4" style="transform:scale(0.6)" /><text>服装</text>
							</label>
							<label style="width: 130px;">
								<radio value="5" style="transform:scale(0.6)" /><text>运动器械</text>
							</label>
							<label style="width: 130px;">
								<radio value="6" style="transform:scale(0.6)" /><text>其他</text>
							</label>
						</radio-group>
					</div>
				</div>
			</div>
			<div class="body w2" v-show="!is_show_publish_form">
				<div v-show="show_empty()" class="empty">
					<el-empty description="暂无商品"></el-empty>
				</div>
				<div v-for="(item,id) in goods_list" class="product-container">
					<div class="product" :class="check_bs(item.type)[0]?'sale':'buy'"
						@click="to_goods_detail(item.display,item._links.self.href,user_list.userId)">
						<div class="img">
							<image :src="item.pic_url" mode="aspectFill"></image>
						</div>
						<div class="content">
							<div class="name">{{item.title}}</div>
							<div class="tag">
								<div class="class">{{item.category}}</div>
								<div v-for="(label,label_i) in item.tags" class="label">{{label}}</div>
							</div>
							<div class="price" v-show="check_bs(item.type)[0]">
								<i class="iconfont icon-YUAN"></i>
								<span>{{item.price}}</span>
							</div>
							<div class="text" v-show="!check_bs(item.type)[0]">
								{{item.description}}
							</div>
						</div>
						<div class="bs">{{check_bs(item.type)[1]}}</div>
					</div>
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
		data() {
			return {
				bsa_i: 0,
				is_show_publish_form: false,
				goods_name: '',
				type_items: ['求购商品', '出售商品'],
				type_value: '求购商品',
				type_bool: false,
				class_items: ['电子产品', '食品', '学习用品', '服装', '运动器械', '其他'],
				class_value: '电子产品',
				goods_price: '',
				goods_info: '',
				label_id: 0,
				label_arr: [],
				goods_label: '',
				is_xiajia_page: false,
				src: 'https://s2.loli.net/2021/12/13/grNIDKVi8xujJPB.png',
				goods_list: [],
				goods_list_copy: [],
				goods_list_select_copy: [],
				goods_list_bsa: [],
				check_all: true,
				current_check: 0,
				current_bsa: 0,
				bsa_val: [true, false, false],
				ca_val: ['全部', '电子产品', '食品', '学习用品', '服装', '运动器械', '其他'],
				search_text: '',
				user_list: [],
				xiajia_flag: false
			}
		},
		components: {
			topBar: topBar,
			leftBar: leftBar
		},
		onLoad(options) {
			var user_id_login = options.user_id_login;
			this.load_user(user_id_login);
			this.get_goods_data(user_id_login,0);
		},
		methods: {
			change_xiajia_btn: function() {
				this.is_xiajia_page = !this.is_xiajia_page;
			},
			change_xiajia_flag(type) {
				if(type == 0){
					this.get_goods_data(this.user_list.userId,1);
				}else{
					this.get_goods_data(this.user_list.userId,0);
				}
				this.xiajia_flag = !this.xiajia_flag;
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
				var arr = [];
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
					url: '/api/items',
					data: {
						"userId": this.user_list.userId,
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
				// 刷新
				this.src = 'https://s2.loli.net/2021/12/13/grNIDKVi8xujJPB.png';
				this.label_arr = [];
				this.label_id = 0;
				this.goods_price = '';
				this.goods_info = '';
				this.goods_name = '';
				this.type_value = '求购商品';
				this.type_bool = false;
				this.class_value = '电子产品';
				this.is_show_publish_form = false;
				this.$message({
					message: '成功发布商品!',
					type: 'success'
				});
			},
			get_goods_data: function(id,type) {
				uni.request({
					method: 'GET',
					url: `/api/items/user/${id}`,
					success: (res) => {
						if (res.statusCode == 200) {
							this.goods_list = [];
							var tmp_list = res.data._embedded.itemEntityList;
							console.log(tmp_list);
							for(var i=0;i<tmp_list.length;i++){
								//售货中
								if((type == 0) && tmp_list[i].display){
									this.goods_list.push(tmp_list[i]);
								}
								//已下架
								if((type == 1) && (!tmp_list[i].display)){
									this.goods_list.push(tmp_list[i]);
								}
							}
							this.goods_list_copy = this.goods_list;
							this.goods_list_bsa.push(this.goods_list_copy);
							this.goods_list_bsa.push(this.select_bs(0));
							this.goods_list_bsa.push(this.select_bs(1));
						} else {
							uni.showToast({
								title: res.statusCode,
								icon: "error",
								duration: 2000
							});
						}
					}
				});
			},
			to_goods_detail: function(cur_display, href, user_id_login) {
				var id = href.split('/')[4];
				if (this.is_xiajia_page) {
					if (cur_display == false) {
						this.$message({
							type: 'warning',
							message: '该商品已下架!'
						});
						return;
					}
					this.$confirm('是否下架该商品?', '确认信息', {
							distinguishCancelAndClose: true,
							confirmButtonText: '确定',
							cancelButtonText: '取消'
						})
						.then(() => {
							uni.request({
								method: 'POST',
								url: `/api/items/${id}/display`,
								data: "false",
								success: (res) => {
									if (res.statusCode == 204) {
										this.$message({
											type: 'success',
											message: '成功下架该商品!'
										});
									} else {
										this.$message.error('下架失败!');
									}
								}
							});
						});
					return;
				}
				uni.navigateTo({
					url: `/pages/goods/goods?item_id=${id}&user_id_login=${user_id_login}`
				})
			},
			check_bs: function(item_type) {
				if (item_type == "卖") {
					return [true, 'SALE'];
				} else {
					return [false, 'WANT'];
				}
			},
			check_box_change: function(e) {
				this.current_check = parseInt(e.detail.value);
				this.goods_list = this.select_ca(this.current_check);
			},
			change_bsa: function(x) {
				this.bsa_i += 1;
				const xi = this.bsa_i % 3;
				switch (xi) {
					case 0:
						this.current_bsa = 0;
						this.bsa_val = [true, false, false];
						this.goods_list = this.select_ca(this.current_check);
						break
					case 1:
						this.current_bsa = 1;
						this.bsa_val = [false, true, false];
						this.goods_list = this.select_ca(this.current_check);
						break
					case 2:
						this.current_bsa = 2;
						this.bsa_val = [false, false, true];
						this.goods_list = this.select_ca(this.current_check);
						break
					default:
						this.current_bsa = 0;
						this.bsa_val = [true, false, false];
						this.goods_list = this.goods_list_copy;
				}
			},
			select_bs: function(type) {
				var tmp_buy = [];
				var tmp_sale = [];
				for (var i = 0; i < this.goods_list_copy.length; i++) {
					if (this.goods_list_copy[i].type == '卖') {
						tmp_buy.push(this.goods_list_copy[i]);
					} else {
						tmp_sale.push(this.goods_list_copy[i]);
					}
				}
				if (type == 0) {
					return tmp_buy;
				} else {
					return tmp_sale;
				}
			},
			select_ca: function(ca) {
				var tmp = [];
				var copy = this.goods_list_bsa[this.current_bsa];
				var str = this.ca_val[this.current_check];
				if (this.current_check == 0) {
					return copy;
				}
				for (var i = 0; i < copy.length; i++) {
					if (copy[i].category == str) {
						tmp.push(copy[i]);
					}
				}
				return tmp;
			},
			search_text_input: function(e) {
				this.search_text = e.detail.value;
			},
			search_by_goods_name: function(e) {
				this.goods_list_select_copy = this.select_ca(this.current_check);
				this.goods_list = this.goods_list_select_copy;
				var tmp = []
				if (this.search_text == '') {
					this.goods_list = this.goods_list_select_copy;
					return;
				}
				for (var i = 0; i < this.goods_list.length; i++) {
					if (this.goods_list[i].title.indexOf(this.search_text) != -1) {
						tmp.push(this.goods_list[i]);
					} else {
						for (var j = 0; j < this.goods_list[i].tags.length; j++) {
							if (this.goods_list[i].tags[j].indexOf(this.search_text) != -1) {
								tmp.push(this.goods_list[i]);
							}
						}
					}
				}
				this.goods_list = tmp;
			},
			load_user: function(id) {
				uni.request({
					method: 'GET',
					url: `/api/users/${id}`,
					success: (res) => {
						if (res.statusCode == 200) {
							this.user_list = res.data;
						} else {
							uni.showToast({
								title: res.statusCode,
								icon: "error",
								duration: 2000
							});
						}
					}
				});
			},
			show_empty: function() {
				if (this.goods_list.length == 0) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
</script>

<style>
	@import url("../../style/home/classify.css");
	@import url("../../style/home/homeBody.css");
	@import url("../../style/nav/nav.css");
	@import url("../../style/publish/publish.css");
	@import url("../../style/menban/menban.css");
</style>
