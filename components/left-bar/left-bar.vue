<template>
	<view class="left-window-container">
		<view class="tools">
			<div class="wrapper fanhui" @click="back()" v-show="show_fanhui">
				<i class="iconfont icon-fanhui3"></i>
				<div>返回上页</div>
			</div>
			<div class="wrapper" @click="to(0)" :class="get_val(0)?'highlight':'unhighlight'" v-show="!show_fanhui">
				<i class="iconfont icon-shangcheng1"></i>
				<div>南科商城</div>
			</div>
			<div class="wrapper" @click="to(1)" :class="get_val(1)?'highlight':'unhighlight'" v-show="!show_fanhui">
				<i class="iconfont icon-dingdan"></i>
				<div>我的订单</div>
			</div>
			<div class="wrapper" @click="to(2)" :class="get_val(2)?'highlight':'unhighlight'" v-show="!show_fanhui">
				<i class="iconfont icon-icon_fabu"></i>
				<div>我的发布</div>
			</div>
			<div class="wrapper" @click="to(3)" :class="get_val(3)?'highlight':'unhighlight'" v-show="!show_fanhui">
				<i class="iconfont icon-shoucang"></i>
				<div>我的收藏</div>
			</div>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pages: [
					"/pages/home/home", //0
					"/pages/order/order", //1
					"/pages/publish/publish", //2
					"/pages/shoucang/shoucang", //3
					"/pages/goods/goods" //4
				]
			}
		},
		props: {
			cur_page: {
				type: Number,
				default: 0
			},
			user_id: {
				type: String,
				default: ''
			},
			cur_hover: {
				type: Number,
				default: -1
			},
			show_fanhui: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			to(x) {
				uni.navigateTo({
					url: `${this.pages[x]}?user_id_login=${this.user_id}`
				})
			},
			get_val(x) {
				return this.cur_hover == x;
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>
<style>
	.left-window-container {
		position: absolute;
		height: 450px;
		width: 100px;
		bottom: 80px;
	}

	.wrapper {
		width: 80px;
		height: 100px;
		border: 1px solid #e2e2e2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #999999;
		cursor: pointer;
	}

	.wrapper:hover {
		color: #CE0F30;
	}

	i {
		font-size: 30px;
	}

	.highlight {
		color: #CE0F30;
	}

	.unhighlight {
		color: #999999;
	}

	.fanhui {
		position: absolute;
		bottom: 20px;
	}
</style>
