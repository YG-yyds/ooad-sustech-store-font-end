<template>
	<body>
		<top-bar :user_id="user_list.userId" :user_img="user_list.picUrl" :user_name="user_list.userName"
			:password="user_list.password" :balance="user_list.balance"></top-bar>
		<left-bar cur_hover='0' :user_id="user_list.userId"></left-bar>
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
					</div>
				</div>
			</div>
		</div>
		<div class="other">
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
				<div v-for="(item,id) in goods_list" class="product-container" v-show="item.display">
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
				user_list:[]
			}
		},
		components:{
			topBar:topBar,
			leftBar:leftBar
		},
		onLoad(options) {
			var user_id_login=options.user_id_login;
			this.load_user(user_id_login);
			this.get_goods_data();
		},
		methods: {
			get_goods_data: function() {
				uni.request({
					method: 'GET',
					url: '/api/items',
					success: (res) => {
						if (res.statusCode==200) {
							this.goods_list = res.data._embedded.itemEntityList;
							this.goods_list_copy = this.goods_list;
							this.goods_list_bsa.push(this.goods_list_copy);
							this.goods_list_bsa.push(this.select_bs(0));
							this.goods_list_bsa.push(this.select_bs(1));
						}else{
							uni.showToast({
								title: res.statusCode,
								icon: "error",
								duration: 2000
							});
						}
					}
				});
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
			load_user:function(id){
				uni.request({
					method: 'GET',
					url: `/api/users/${id}`,
					success: (res) => {
						if (res.statusCode==200) {
							this.user_list=res.data;
						}else{
							uni.showToast({
								title: res.statusCode,
								icon: "error",
								duration: 2000
							});
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
			}
		}
	}
</script>

<style>
	@import url("../../style/home/classify.css");
	@import url("../../style/home/homeBody.css");
	@import url("../../style/nav/nav.css");
</style>