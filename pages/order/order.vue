<template>
	<body>
		<top-bar :user_id="user_list.userId" :user_img="user_list.picUrl" :user_name="user_list.userName"
			:password="user_list.password" :balance="user_list.balance"></top-bar>
		<left-bar cur_hover='1' :user_id="user_list.userId"></left-bar>

		<el-dialog title="请选择交易地点" :visible.sync="show_place_flag" style="width: 50%; margin: 0 auto;">
			<el-select v-model="location" placeholder="请选择" :popper-append-to-body="false" class="el-select"
				style="margin-left: 15%;">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<div slot="footer" class="dialog-footer">
				<el-button @click="show_place_flag = false">取消</el-button>
				<el-button type="primary" @click="update_place(location)">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="请填写商品备注" :visible.sync="show_remark_flag" style="width: 65%; margin: 0 auto;">
			<el-input type="textarea" v-model="remark" autocomplete="off" style="width: 80%; margin-left: 9%;"
				maxlength="50"></el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click="show_remark_flag = false">取消</el-button>
				<el-button type="primary" @click="update_remark(remark)">确定</el-button>
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
				<el-button type="primary" @click="update(form.location,form.remark)">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="确认支付" :visible.sync="show_pay_confirm" width="25%">
			<span style="font-size: 15px;">是否确认支付订单?</span>
			<el-dialog width="25%" title="请输入密码" :visible.sync="show_pwd_flag" append-to-body>
				<el-input placeholder="请输入密码" v-model="pwd" show-password style="width: 80%; margin-left: 8%;">
				</el-input>
				<div slot="footer" class="dialog-footer">
					<el-button @click="show_pwd_flag = false">取消</el-button>
					<el-button type="primary" @click="pay()">确定</el-button>
				</div>
			</el-dialog>
			<div slot="footer" class="dialog-footer">
				<el-button @click="show_pay_confirm = false">取消</el-button>
				<el-button type="primary" @click="show_pwd_flag = true">确定</el-button>
			</div>
		</el-dialog>

		<div id="header">
			<div class="nav-container">
				<div class="nav-bar w2">
					<ul class="nav-left ch">
						<li :class="order_items[0]?'highlight':'unhighlight'" @click="order_change(0)">购物订单</li>
						<li :class="order_items[1]?'highlight':'unhighlight'" @click="order_change(1)">售货订单</li>
					</ul>
					<div class="nav-right">
						<div class="search">
							<input type="search" name="keyword" placeholder="Search..." autocomplete="off"
								@input="goods_name_input" v-model="goods_name" />
							<button type="submit" @click="search_trade">
								<i class="iconfont icon-hover1"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="other">
			<div class="body w2">
				<el-table :data="tableData" style="width: 100%; margin-top: 24px; font-size: 15px;" max-height="620px"
					v-show="order_items[0]" :default-sort="{prop: 'date', order: 'descending'}">
					<el-table-column type="expand">
						<div slot-scope="props" class="expand-table-container">
							<div class="expand-table">
								<div class="pic-container">
									<image :src="props.row.pic_url" mode="aspectFill"></image>
								</div>
								<div class="right-container">
									<div class="inner-container">
										<div class="inner-label">商品ID</div>
										<div>{{ props.row.goods_id }}</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">商品名</div>
										<div>{{ props.row.goods }}</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">分类</div>
										<div>{{ props.row.class }}</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">标签</div>
										<div class="label-container">
											<div class="label-item" v-for="(item,i) in props.row.tags">{{item}}</div>
										</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">卖家</div>
										<div>{{ props.row.saler }}</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">价格</div>
										<div>{{ props.row.price }}</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">备注</div>
										<el-button @click.native.prevent="deleteRow(scope.$index, tableData)"
											type="text" size="base" style="line-height: 0;"
											v-show="show_remark_link(props.row.beizhu)"
											@click="show_update_remark_dialog(props.row.trade_id,props.row.order_status)">
											填写备注
										</el-button>
										<div v-show="!show_remark_link(props.row.beizhu)">{{ props.row.beizhu }}</div>
									</div>
								</div>
								<div class="order-edit">
									<el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text"
										size="base" style="line-height: 0;" icon="el-icon-edit"
										@click="show_update_dialog(props.row.trade_id,props.row.order_status)">
										修改订单信息
									</el-button>
								</div>
							</div>
						</div>
					</el-table-column>
					<el-table-column prop="date" label="时间" sortable width="105">
						<template slot-scope="scope">
							{{change_time(scope.row.date)}}
						</template>
					</el-table-column>
					<el-table-column prop="goods" label="商品名" width="220">
						<template slot-scope="scope">
							<el-link :underline="false" @click="to_goods_detail(scope.row.goods_id,user_list.userId)">
								{{scope.row.goods}}
							</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="saler" label="卖家" width="180">
						<template slot-scope="scope">
							<el-link :underline="false" @click="to_person_detail(scope.row.person_id)">
								{{scope.row.saler}}
							</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="price" label="价格" width="100" column-key="price" :filters="[
						{text: '0-100', value: '0-100'},
						{text: '100-500', value: '100-500'},
						{text: '500-1000', value: '500-1000'},
						{text: '1000+', value: '1000+'}]" :filter-method="filterHandler_price"></el-table-column>
					<el-table-column prop="place" label="交易地点" width="110" column-key="place" :filters="[
						{text: '待选择',value:'待选择'},
						{text: '已取消', value: '已取消'},
						{text: '七号门', value: '七号门'}, 
						{text: '一教', value: '一教'}, 
						{text: '湖畔', value: '湖畔'}, 
						{text: '欣园', value: '欣园'},
						{text: '慧园', value: '慧园'},
						{text: '荔园', value: '荔园'},
						{text: '新宿舍', value: '新宿舍'},
						{text: '工学院', value: '工学院'}]" :filter-method="filterHandler">
						<template slot-scope="scope">
							<el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text"
								size="base" v-show="show_place_link(scope.row.place)"
								@click="show_update_place_dialog(scope.row.trade_id)">
								选择地点
							</el-button>
							<view v-show="!show_place_link(scope.row.place)">{{scope.row.place}}</view>
						</template>
					</el-table-column>
					<el-table-column prop="pay" label="支付状态" width="110" column-key="pay" :filters="[
						{text: '未支付', value: '未支付'},
						{text: '已支付', value: '已支付'},
						{text: '已退款', value: '已退款'}]" :filter-method="filterHandler">
						<template slot-scope="scope">
							<el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text"
								size="base" v-show="show_pay_link(scope.row.pay)"
								@click="show_pay_dialog(scope.row.trade_id,scope.row.person_id)">
								支付
							</el-button>
							<view v-show="!show_pay_link(scope.row.pay)">{{scope.row.pay}}</view>
						</template>
					</el-table-column>
					<el-table-column prop="order_status" label="订单状态" width="110" column-key="order_status" :filters="[
						{text: '未支付',value:'未支付'},
						{text: '已支付', value: '已支付'}, 
						{text: '已送达', value: '已送达'}, 
						{text: '已取消', value: '已取消'}, 
						{text: '已完成', value: '已完成'}]" :filter-method="filterHandler"></el-table-column>
					<el-table-column prop="shouhuo" label="收货状态" width="110" column-key="shouhuo" :filters="[
						{text: '未收货',value:'未收货'},
						{text: '已收货', value: '已收货'}, 
						{text: '已取消', value: '已取消'}]" :filter-method="filterHandler">
						<template slot-scope="scope">
							<el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text"
								size="base" v-show="show_shouhuo_link(scope.row.shouhuo)"
								@click="show_wancheng_dialog(scope.row.trade_id,scope.row.order_status,scope.row.person_id)">
								确认收货
							</el-button>
							<view v-show="!show_shouhuo_link(scope.row.shouhuo)">{{scope.row.shouhuo}}</view>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="100">
						<template slot-scope="scope">
							<el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text"
								size="base"
								@click="show_cancel_dialog(scope.row.trade_id,scope.row.order_status,scope.row.person_id)">
								取消订单
							</el-button>
							<!-- <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text"
								size="base">
								删除记录
							</el-button> -->
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="tableDataSale" style="width: 100%; margin-top: 24px; font-size: 15px;"
					max-height="620px" v-show="order_items[1]" :default-sort="{prop: 'date', order: 'descending'}">
					<el-table-column type="expand">
						<div slot-scope="props" class="expand-table-container">
							<div class="expand-table">
								<div class="pic-container">
									<image :src="props.row.pic_url" mode="aspectFill"></image>
								</div>
								<div class="right-container">
									<div class="inner-container">
										<div class="inner-label">商品ID</div>
										<div>{{ props.row.goods_id }}</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">商品名</div>
										<div>{{ props.row.goods }}</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">分类</div>
										<div>{{ props.row.class }}</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">标签</div>
										<div class="label-container">
											<div class="label-item" v-for="(item,i) in props.row.tags">{{item}}</div>
										</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">买家</div>
										<div>{{ props.row.buyer }}</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">价格</div>
										<div>{{ props.row.price }}</div>
									</div>
									<div class="inner-container">
										<div class="inner-label">备注</div>
										<div>{{ props.row.beizhu }}</div>
									</div>
								</div>
							</div>
						</div>
					</el-table-column>
					<el-table-column prop="date" label="时间" sortable width="105">
						<template slot-scope="scope">
							{{change_time(scope.row.date)}}
						</template>
					</el-table-column>
					<el-table-column prop="goods" label="商品名" width="220">
						<template slot-scope="scope">
							<el-link :underline="false" @click="to_goods_detail(scope.row.goods_id,user_list.userId)">
								{{scope.row.goods}}
							</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="buyer" label="买家" width="180">
						<template slot-scope="scope">
							<el-link :underline="false" @click="to_person_detail(scope.row.person_id)">
								{{scope.row.buyer}}
							</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="price" label="价格" width="100" column-key="price" :filters="[
						{text: '0-100', value: '0-100'},
						{text: '100-500', value: '100-500'},
						{text: '500-1000', value: '500-1000'},
						{text: '1000+', value: '1000+'}]" :filter-method="filterHandler_price"></el-table-column>
					<el-table-column prop="place" label="交易地点" width="110" column-key="place" :filters="[
						{text: '待选择',value:'待选择'},
						{text: '已取消', value: '已取消'},
						{text: '七号门', value: '七号门'}, 
						{text: '一教', value: '一教'}, 
						{text: '湖畔', value: '湖畔'}, 
						{text: '欣园', value: '欣园'},
						{text: '慧园', value: '慧园'},
						{text: '荔园', value: '荔园'},
						{text: '新宿舍', value: '新宿舍'},
						{text: '工学院', value: '工学院'}]" :filter-method="filterHandler">
					</el-table-column>
					<el-table-column prop="pay" label="支付状态" width="110" column-key="pay" :filters="[
						{text: '未支付', value: '未支付'},
						{text: '已支付', value: '已支付'},
						{text: '已退款', value: '已退款'}]" :filter-method="filterHandler">
					</el-table-column>
					<el-table-column prop="order_status" label="订单状态" width="110" column-key="order_status" :filters="[
						{text: '未支付',value:'未支付'},
						{text: '已支付', value: '已支付'}, 
						{text: '已送达', value: '已送达'}, 
						{text: '已取消', value: '已取消'}, 
						{text: '已完成', value: '已完成'}]" :filter-method="filterHandler"></el-table-column>
					<el-table-column prop="songhuo" label="送货状态" width="110" column-key="songhuo" :filters="[
						{text: '未送货',value:'未送货'},
						{text: '已送达', value: '已送达'}, 
						{text: '已取消', value: '已取消'}]" :filter-method="filterHandler">
						<template slot-scope="scope">
							<el-button @click.native.prevent="deleteRow(scope.$index, tableDataSale)" type="text"
								size="base" v-show="show_songhuo_link(scope.row.songhuo)"
								@click="show_songda_dialog(scope.row.trade_id,scope.row.order_status,scope.row.person_id)">
								确认送达
							</el-button>
							<view v-show="!show_songhuo_link(scope.row.songhuo)">{{scope.row.songhuo}}</view>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="100">
						<template slot-scope="scope">
							<el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text"
								size="base"
								@click="show_cancel_dialog(scope.row.trade_id,scope.row.order_status,scope.row.person_id)">
								取消订单
							</el-button>
							<!-- <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text"
								size="base">
								删除记录
							</el-button> -->
						</template>
					</el-table-column>
				</el-table>
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
				order_items: [true, false],
				goods_name: '',
				tableData: [],
				tableDataSale: [],
				tableData_origin: [],
				tableDataSale_origin: [],
				user_list: [],
				show_place_flag: false,
				show_remark_flag: false,
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
				location: '',
				cur_trade_id: '',
				cur_trade_person: '',
				remark: '',
				dialogFormVisible: false,
				form: {
					remark: '',
					location: '',
				},
				formLabelWidth: '120px',
				pwd: '',
				show_pwd_flag: false,
				show_pay_confirm: false
			}
		},
		components: {
			topBar: topBar,
			leftBar: leftBar
		},
		onLoad(options) {
			var user_id_login = options.user_id_login;
			this.load_user(user_id_login);
			this.get_order(user_id_login, 'buyer');
			this.get_order(user_id_login, 'seller');
		},
		methods: {
			change_time(time) {
				var date_arr = time.split('T');
				var time_return = date_arr[1].split('.')[0];
				return date_arr[0] + " " + time_return;
			},
			goods_name_input: function(e) {
				this.goods_name = e.detail.value;
			},
			order_change: function(x) {
				switch (x) {
					case 0:
						this.order_items = [true, false];
						break;
					case 1:
						this.order_items = [false, true];
						break;
					default:
						this.order_items = [true, false];
				}
			},
			get_price_range: function(price) {
				var val = parseInt(price);
				if (0 <= val && val <= 100) {
					return '0-100';
				} else if (100 < val && val <= 500) {
					return '100-500';
				} else if (500 < val && val <= 1000) {
					return '500-1000';
				} else {
					return '1000+';
				}
			},
			filterHandler(value, row, column) {
				const property = column['property'];
				return row[property] === value;
			},
			filterHandler_price(value, row, column) {
				const property = column['property'];
				return this.get_price_range(row[property]) === value;
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
			get_order: function(id, type) {
				uni.request({
					method: 'GET',
					url: `/api/trades/${type}/${id}`,
					success: (res) => {
						if (res.statusCode == 200) {
							var trades = res.data._embedded.tradeEntityList;
							this.get_trade(0, trades.length, trades, type);
						}
					}
				});
			},
			get_pay_status: function(status) {
				if (status == '未支付') {
					return '未支付';
				} else if (status == '已取消') {
					return '已退款';
				} else {
					return '已支付';
				}
			},
			get_shouhuo_status: function(status) {
				if (status == '已完成') {
					return '已收货';
				} else if (status == '已取消') {
					return '已取消';
				} else {
					return '未收货';
				}
			},
			get_tags: function(arr) {
				var tags = [];
				for (var i = 0; i < arr.length; i++) {
					tags.push(arr[i]);
				}
				return tags;
			},
			get_place: function(place, status) {
				if (status == '已取消') {
					return '已取消';
				} else {
					if (place == null) {
						return '待选择';
					} else {
						return place;
					}
				}
			},
			get_songhuo_status: function(status) {
				if (status == '已取消') {
					return '已取消';
				} else if (status == '已送达' || status == '已完成') {
					return '已送达';
				} else {
					return '未送货';
				}
			},
			get_type: function(str) {
				if (str == 'buyer') {
					return true;
				} else {
					return false;
				}
			},
			show_place_link: function(str) {
				if (str == '待选择') {
					return true;
				} else {
					return false;
				}
			},
			show_pay_link: function(str) {
				if (str == '未支付') {
					return true;
				} else {
					return false;
				}
			},
			show_shouhuo_link: function(str) {
				if (str == '未收货') {
					return true;
				} else {
					return false;
				}
			},
			show_songhuo_link: function(str) {
				if (str == '未送货') {
					return true;
				} else {
					return false;
				}
			},
			to_person_detail: function(user_id) {
				uni.navigateTo({
					url: `/pages/person/person?user_id_login=${this.user_list.userId}&user_id=${user_id}`
				})
			},
			to_goods_detail: function(id, user_id_login) {
				uni.navigateTo({
					url: `/pages/goods/goods?item_id=${id}&user_id_login=${user_id_login}`
				})
			},
			show_remark_link: function(str) {
				if (str.length == 0) {
					return true;
				} else {
					return false;
				}
			},
			get_trade: function(i, length, trades, type) {
				if (i == length) {
					return;
				}
				var cur_trade = trades[i];
				var item_id = cur_trade._links.item.href.split('/')[4];
				uni.request({
					method: 'GET',
					url: cur_trade._links.item.href,
					success: (res1) => {
						if (res1.statusCode == 200) {
							var item = res1.data;
							var person_url = cur_trade._links.buyer.href;
							if (this.get_type(type)) {
								person_url = cur_trade._links.seller.href;
							}
							var cur_person_id = person_url.split('/')[4];
							var cur_trade_id = cur_trade._links.self.href.split('/')[4];
							uni.request({
								method: 'GET',
								url: person_url,
								success: (res2) => {
									if (res2.statusCode == 200) {
										var person = res2.data;
										var obj = {
											goods_id: item_id,
											goods: item.title,
											price: item.price,
											place: this.get_place(cur_trade.location,
												cur_trade.status),
											pay: this.get_pay_status(cur_trade.status),
											order_status: cur_trade.status,
											pic_url: item.pic_url,
											beizhu: cur_trade.remark,
											class: item.category,
											tags: this.get_tags(item.tags),
											person_id: cur_person_id,
											trade_id: cur_trade_id,
											date: cur_trade.createtime
										};
										if (this.get_type(type)) {
											obj.saler = person.userName;
											obj.shouhuo = this.get_shouhuo_status(cur_trade
												.status);
											this.tableData.push(obj);
											this.tableData_origin.push(obj);
										} else {
											obj.buyer = person.userName;
											obj.songhuo = this.get_songhuo_status(cur_trade
												.status);
											this.tableDataSale.push(obj);
											this.tableDataSale_origin.push(obj);
										}
									}
								}
							});
						}
					}
				});
				i++;
				this.get_trade(i, length, trades, type);
			},
			show_update_place_dialog(id) {
				this.cur_trade_id = id;
				this.show_place_flag = true;
			},
			update_place(place) {
				if (place.length == 0) {
					this.$message({
						message: '请选择交易地点!',
						type: 'warning'
					});
					return;
				}
				uni.request({
					method: 'POST',
					url: `/api/trades/${this.cur_trade_id}`,
					data: {
						"location": place
					},
					success: (res) => {
						if (res.statusCode == 200) {
							console.log(res.data);
						}
					}
				});
				this.show_place_flag = false;
				this.$message({
					message: '成功更新交易地点!',
					type: 'success'
				});
			},
			show_update_remark_dialog(id, status) {
				if (status == '已送达') {
					this.$message({
						message: '商品已送达，请及时收获!',
						type: 'warning'
					});
					return;
				}
				if (status == '已取消' || status == '已完成') {
					this.$message({
						message: `该订单${status}!`,
						type: 'warning'
					});
					return;
				}
				this.cur_trade_id = id;
				this.show_remark_flag = true;
			},
			update_remark(remark) {
				if (remark.length == 0) {
					this.$message({
						message: '请填写商品备注!',
						type: 'warning'
					});
					return;
				}
				uni.request({
					method: 'POST',
					url: `/api/trades/${this.cur_trade_id}`,
					data: {
						"remark": remark
					},
					success: (res) => {
						if (res.statusCode == 200) {
							console.log(res.data);
						}
					}
				});
				this.show_remark_flag = false;
				this.$message({
					message: '成功更新商品备注!',
					type: 'success'
				});
			},
			show_update_dialog(id, status) {
				if (status == '已送达') {
					this.$message({
						message: '商品已送达，请及时收获!',
						type: 'warning'
					});
					return;
				}
				if (status == '已取消' || status == '已完成') {
					this.$message({
						message: `该订单${status}!`,
						type: 'warning'
					});
					return;
				}
				this.cur_trade_id = id;
				this.dialogFormVisible = true;
			},
			update(place, remark) {
				if (place.length == 0) {
					this.$message({
						message: '请选择交易地点!',
						type: 'warning'
					});
					return;
				}
				if (remark.length == 0) {
					this.$message({
						message: '请填写商品备注!',
						type: 'warning'
					});
					return;
				}
				uni.request({
					method: 'POST',
					url: `/api/trades/${this.cur_trade_id}`,
					data: {
						"location": place,
						"remark": remark
					},
					success: (res) => {
						if (res.statusCode == 200) {
							console.log(res.data);
						}
					}
				});
				this.dialogFormVisible = false;
				this.$message({
					message: '成功修改订单信息!',
					type: 'success'
				});
			},
			pay() {
				if (this.pwd != this.user_list.password) {
					this.$message({
						message: '密码错误!',
						type: 'warning'
					});
					return;
				}
				uni.request({
					method: 'POST',
					url: `/api/trades/${this.cur_trade_id}/pay`,
					success: (res) => {
						if (res.statusCode == 204) {
							this.send_email(this.cur_trade_person, '买家已支付,请及时确认!', '支付成功!已成功通知卖家!',
								'支付成功!通知卖家失败,请及时与卖家联系!');
						} else if (res.statusCode == 400) {
							if (res.data.indexOf('insufficient')) {
								this.$message({
									message: '余额不足!',
									type: 'warning'
								});
							} else {
								this.$message.error('支付失败!');
							}
						} else {
							this.$message.error('支付失败!');
						}
					}
				});
				this.show_pwd_flag = false;
				this.show_pay_confirm = false;
			},
			show_pay_dialog(id, person) {
				this.cur_trade_id = id;
				this.cur_trade_person = person;
				this.show_pay_confirm = true;
			},
			show_songda_dialog(id, status, person) {
				if (status == '未支付') {
					this.$message({
						message: '订单未支付!',
						type: 'warning'
					});
					return;
				}
				this.cur_trade_id = id;
				this.$confirm('是否确认订单已送达?', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(() => {
						uni.request({
							method: 'POST',
							url: `/api/trades/${this.cur_trade_id}/notify`,
							success: (res) => {
								if (res.statusCode == 204) {
									this.send_email(person, '商品已送达,请及时收货!', '已确认商品送达,并邮件通知买家!',
										'邮件发送失败,请及时通知买家商品已送达!');
								} else {
									this.$message.error('确认失败，请重新确认!');
								}
							}
						});
					})
			},
			show_wancheng_dialog(id, status, person) {
				if (status == '未支付') {
					this.$message({
						message: '订单未支付!',
						type: 'warning'
					});
					return;
				}
				this.cur_trade_id = id;
				this.$confirm('是否确认商品已送达，订单已完成?', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(() => {
						uni.request({
							method: 'POST',
							url: `/api/trades/${this.cur_trade_id}/confirm`,
							success: (res) => {
								if (res.statusCode == 204) {
									this.send_email(person, '买家已收货,订单已完成!', '已成功通知卖家,确认订单完成!',
										'发送邮件失败,请及时联系卖家确认订单完成!');
								} else {
									this.$message.error('确认失败，请重新确认!');
								}
							}
						});
					})
			},
			show_cancel_dialog(id, status, person) {
				if (status == '已完成' || status == '已取消') {
					this.$message({
						message: `订单${status}!`,
						type: 'warning'
					});
					return;
				}
				this.cur_trade_id = id;
				this.$confirm('是否取消订单?', '确认信息', {
						distinguishCancelAndClose: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					})
					.then(() => {
						uni.request({
							method: 'POST',
							url: `/api/trades/${this.cur_trade_id}/cancel`,
							success: (res) => {
								if (res.statusCode == 204) {
									this.send_email(person, '订单取消!如已付款,金额已退还!', '已成功通知对方订单取消!',
										'订单已取消,发送邮件失败,请及时联系对方!');
								} else {
									this.$message.error('取消订单失败!');
								}
							}
						});
					})
			},
			search_trade() {
				this.tableData = this.tableData_origin;
				this.tableDataSale = this.tableDataSale_origin;
				if (this.goods_name != '') {
					if (this.order_items[0]) {
						var tmp = [];
						for (var i = 0; i < this.tableData.length; i++) {
							if(this.tableData[i].goods.indexOf(this.goods_name) != -1){
								tmp.push(this.tableData[i]);
							}
						}
						this.tableData = tmp;
					}
					if (this.order_items[1]){
						var tmp = [];
						for (var i = 0; i < this.tableDataSale.length; i++) {
							if(this.tableDataSale[i].goods.indexOf(this.goods_name) != -1){
								tmp.push(this.tableDataSale[i]);
							}
						}
						this.tableDataSale = tmp;
					}
				}
			}
		}
	}
</script>

<style>
	@import url("../../style/order/order.css");
	@import url("../../style/nav/nav.css");
	@import url("../../style/menban/menban.css");
	@import url("//unpkg.com/element-ui@2.15.7/lib/theme-chalk/index.css");
</style>
