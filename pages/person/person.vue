<template>
	<body>
		<top-bar :user_id="user_list.userId" :user_img="user_list.picUrl" :user_name="user_list.userName"
			:password="user_list.password" :balance="user_list.balance"></top-bar>
		<left-bar cur_hover='0' :user_id="user_list.userId" :show_fanhui="true"></left-bar>
		<div id="header">
			<div class="nav-container">
				<div class="nav-bar w2">
					<ul class="nav-left">
						<li :class="bsa_val[0]?'highlight':'unhighlight'" @click="change_bsa(0)">ALL</li>
						<li :class="bsa_val[1]?'highlight':'unhighlight'" @click="change_bsa(1)">BUY</li>
						<li :class="bsa_val[2]?'highlight':'unhighlight'" @click="change_bsa(2)">SALE</li>
					</ul>
					<div class="nav-right">
						<div class="search">
							<input type="search" name="keyword" placeholder="Search..." autocomplete="off" @input="search_text_input"/>
							<button type="submit" @click="search_by_goods_name">
								<i class="iconfont icon-hover1"></i>
							</button>
						</div>
						<div class="change-bsa" @click="change_bsa">
							<div class="xiajia-tag"  @click="change_xiajia_flag(0)" v-show="!xiajia_flag">ON SHELVES</div>
							<div class="xiajia-tag"  @click="change_xiajia_flag(1)" v-show="xiajia_flag">OFF SHELVES</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="other">
			<div class="person-container w2">
				<div class="person person-check">
					<div class="person-img-container">
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
					<div class="add-person" @click="add_friend()">
						<i class="iconfont icon-tianjiahaoyou"></i>
					</div>
				</div>
			</div>
			<div class="classify-container w2">
				<div class="classify">
					<div class="classify-title">商品分类</div>
					<div class="item-container">
						<radio-group name="item-list" class="radio-group-list" @change="check_box_change">
							<label style="width: 160px; margin-left: -50px;">
								<radio value="0" style="transform:scale(0.6);" checked="true"/><text>全部</text>
							</label>
							<label style="width: 130px;">
								<radio value="1" style="transform:scale(0.6)"/><text>电子产品</text>
							</label>
							<label style="width: 130px;">
								<radio value="2" style="transform:scale(0.6)"/><text>食品</text>
							</label>
							<label style="width: 130px;">
								<radio value="3" style="transform:scale(0.6)"/><text>学习用品</text>
							</label>
							<label style="width: 130px;">
								<radio value="4" style="transform:scale(0.6)"/><text>服装</text>
							</label>
							<label style="width: 130px;">
								<radio value="5" style="transform:scale(0.6)"/><text>运动器械</text>
							</label>
							<label style="width: 130px;">
								<radio value="6" style="transform:scale(0.6)"/><text>其他</text>
							</label>
						</radio-group>
					</div>
				</div>
			</div>
			<div class="body w2">
				<div v-show="show_empty()" class="empty">
					<el-empty description="暂无商品"></el-empty>
				</div>
				<div v-for="(item,id) in goods_list" class="product-container">
					<div class="product" :class="check_bs(item.type)[0]?'sale':'buy'" @click="to_goods_detail(item._links.self.href,user_list.userId)">
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
		</div>
	</body>
</template>

<script>
	import topBar from '../../components/top-bar/top-bar.vue';
	import leftBar from '../../components/left-bar/left-bar.vue';
	export default {
		onLoad(options) {
			var user_id_login = options.user_id_login;
			this.load_user(user_id_login);
			var user_id = options.user_id;
			this.load_person_info(user_id);
		},
		data() {
			return {
				goods_list:[],
				goods_list_copy:[],
				goods_list_select_copy:[],
				goods_list_bsa:[],
				check_all:true,
				current_check:0,
				current_bsa:0,
				bsa_val:[true,false,false],
				ca_val:['全部','电子产品','食品','学习用品','服装','运动器械','其他'],
				search_text:'',
				user_detail:[],
				user_list:[],
				xiajia_flag: false
			}
		},
		components: {
			topBar: topBar,
			leftBar:leftBar
		},
		methods: {
			change_xiajia_flag(type) {
				if(type == 0){
					this.get_goods_data(this.user_detail.userId,1);
				}else{
					this.get_goods_data(this.user_detail.userId,0);
				}
				this.xiajia_flag = !this.xiajia_flag;
			},
			to_goods_detail:function(href,user_id_login){
				var id = href.split('/')[4];
				uni.navigateTo({
					url: `/pages/goods/goods?item_id=${id}&user_id_login=${user_id_login}`
				})
			},
			check_bs:function(item_type){
				if(item_type=="卖"){
					return [true,'SALE'];
				}else{
					return [false,'WANT'];
				}
			},
			check_box_change:function(e){
				this.current_check = parseInt(e.detail.value);
				this.goods_list = this.select_ca(this.current_check);
			},
			change_bsa:function(x){
				switch (x) {
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
			select_bs:function(type){
				var tmp_buy = [];
				var tmp_sale = [];
				for(var i=0;i<this.goods_list_copy.length;i++){
					if(this.goods_list_copy[i].type == '卖'){
						tmp_buy.push(this.goods_list_copy[i]);
					}else{
						tmp_sale.push(this.goods_list_copy[i]);
					}
				}
				if(type==0){
					return tmp_buy;
				}else{
					return tmp_sale;
				}
			},
			select_ca:function(ca){
				var tmp = [];
				var copy = this.goods_list_bsa[this.current_bsa];
				var str = this.ca_val[this.current_check];
				if(this.current_check==0){
					return copy;
				}
				for(var i = 0;i< copy.length;i++){
					if(copy[i].category==str){
						tmp.push(copy[i]);
					}
				}
				return tmp;
			},
			search_text_input:function(e){
				this.search_text = e.detail.value;
			},
			search_by_goods_name:function(e){
				this.goods_list_select_copy = this.select_ca(this.current_check);
				this.goods_list = this.goods_list_select_copy;
				var tmp = []
				if(this.search_text ==''){
					this.goods_list = this.goods_list_select_copy;
					return;
				}
				for(var i =0; i<this.goods_list.length;i++){
					if(this.goods_list[i].title.indexOf(this.search_text)!=-1){
						tmp.push(this.goods_list[i]);
					}else{
						for(var j = 0;j<this.goods_list[i].tags.length;j++){
							if(this.goods_list[i].tags[j].indexOf(this.search_text)!=-1){
								tmp.push(this.goods_list[i]);
							}
						}
					}
				}
				this.goods_list = tmp;
			},
			load_person_info:function(id){
				uni.request({
					method: 'GET',
					url: `/api/users/${id}`,
					success: (res) => {
						if (res.statusCode==200) {
							this.user_detail = res.data;
						}else{
							uni.showToast({
								title: res.statusCode,
								icon: "error",
								duration: 2000
							});
						}
					}
				});
				this.get_goods_data(id,0);
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
						}
					}
				});
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
			show_empty:function(){
				if(this.goods_list.length == 0){
					return true;
				}else{
					return false;
				}
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
															this.$message({
																type: 'success',
																message: '已成功添加该用户为好友!'
															});
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
	@import url("../../style/home/classify.css");
	@import url("../../style/home/homeBody.css");
	@import url("../../style/nav/nav.css");
	@import url("../../style/publish/publish.css");
</style>
