//Vue3 updated

<template>
<div class='container-fluid practable-component'>
	<div class='d-flex flex-column' id="video">

		<canvas class="mb-2" v-show="getCurrentMode == 'positionPid'" id="smoothie-chart_theta"></canvas>
		<canvas class="mb-2" v-show="getCurrentMode != 'positionPid'" id="smoothie-chart_omega"></canvas>
		
		<video-element :url="getVideoURL" />

		<toolbar parentCanvasID="video-canvas" parentComponentName="webcam" parentDivID='video-element' :showDownload='true' :showPopupHelp='false' :showOptions="false"></toolbar>

	</div>

</div>
</template>

<script>
import axios from "axios";
import VideoElement from "./VideoElement.vue";
import { mapGetters } from 'vuex';
import Toolbar from "./elements/Toolbar.vue";

export default {
	name: "WebcamStream",
	components:{
		VideoElement,
		Toolbar
	},
    data(){
        return{
			stream: Object,
        }
    },
    computed:{
		...mapGetters([
			'getVideoURL',
			'getVideoURLObtained',
			'getCurrentMode'
		]),
		streamOK(){			
			return this.$store.getters.getStream("video");
		},
		
		
	},
	mounted(){
		// var _this = this;
		// var reconnect = function () {
		// 	_this.accessVideo();
		// };
		//make second and subsequent connections
		document.addEventListener("streams:dropped", this.accessVideo);
	},
	methods:{
		accessVideo(){
			this.stream = this.$store.getters.getStream("video");
				var accessURL = this.stream.url;
				var token = this.stream.token;
				var store = this.$store;
				store.dispatch("deleteVideoURL");		////THIS HAS BEEN ADDED
				axios
				.post(accessURL, {}, { headers: { Authorization: token } })
				.then((response) => {
					store.dispatch("setVideoURL", response.data.uri);
				})
				.catch((err) => console.log(err));
		}
	},
	watch:{
		streamOK: function(is) {
			if (is) {
				this.accessVideo();
			} else{
				console.log("no stream");
			}
    },
		// urlOK(is) {
		// 	if (is) {
		// 		console.log("get videoURL", this.urlOK, this.url);
		// 	} 
		// },

	}
}


</script>

<style scoped>
#video-canvas{
	width:80%;
	height: 50%;
}

#smoothie-chart_omega{
	width:100%;
	height: 60px;
}

#smoothie-chart_theta{
	width:100%;
	height: 60px;
}
</style>