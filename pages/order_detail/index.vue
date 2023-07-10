<template>
	<view>
		
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		getCurrentInstance
	} from "vue";
	
	import {
		onLoad
	} from "@dcloudio/uni-app";
	
	const {
		requests,
		baseUrl
	} = getCurrentInstance().appContext.config.globalProperties;
	
	//获取订单详情
	const getInfo = (id) =>{
		requests("/express/info",{id},"GET").then((response)=>{
			console.log("response",response);
		});
	};
	
	onLoad((options)=>{
		console.log("options",options);
		getInfo(options.id);
	});
</script>

<style>

</style>
