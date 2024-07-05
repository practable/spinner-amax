<template>

<div class='container-fluid practable-component'>
	<div class="m-2">
		<!-- <div v-if='getCurrentMode != ""' class='panel-heading'><h3>Current mode: {{getModeName}}</h3></div> -->
		<div class='panel-body'>{{message}}</div>
		<div :class='getErrorClass'><h3>{{ error }}</h3></div>
	</div>

	<div class="d-flex flex-column-reverse flex-lg-row">
		<div class="col-lg-3">
			<div class="d-flex flex-column">
				<div class="mb-lg-2">
					<label for="hardware-select-dropdown">Select Hardware Mode</label>
					<div class="dropdown">
						<button class="button-sm button-primary dropdown-toggle" type="button" id="hardware-select-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
							{{ getModeName }}
						</button>
						<ul class="dropdown-menu" aria-labelledby="hardware-dropdown-menu">
							<li v-if="getCurrentMode != 'stopped'"><a class="dropdown-item" id="enter-stopped-mode-select" aria-label="stopped mode" @click="stop">stopped</a></li>
							<li v-if="getCurrentMode == 'stopped'"><a class="dropdown-item" id="enter-open-loop-mode-select" aria-label="voltage mode" @click="speedRaw">voltage (open loop)</a></li>
							<li v-if="getCurrentMode == 'stopped' && inputMode != 'free'"><a class="dropdown-item" id="enter-pid-position-mode-select" aria-label="position mode" @click="positionPid">position (PID)</a></li>
							<li v-if="getCurrentMode == 'stopped' && inputMode != 'free'"><a class="dropdown-item" id="enter-pid-speed-mode-select" aria-label="speed mode" @click="speedPid">velocity (PID)</a></li>
						</ul>
					</div>
				</div>

				<div class="mb-lg-2">
					<button id="stop-motor-button" v-if='getCurrentMode != "stopped"' class="button-sm button-danger" aria-label="exit mode" @click="stop">Exit mode</button>
				</div>
				
				<div class="mb-lg-2">
					<label for="input-select-dropdown">Select Input Mode</label>
					<div class="dropdown">
						<button class="button-sm button-primary dropdown-toggle" type="button" id="input-select-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
							{{ inputMode }}
						</button>
						<ul class="dropdown-menu" aria-labelledby="input-dropdown-menu">
							<li v-if='getCurrentMode == "speedRaw"'><a class="dropdown-item" id="free-input-select" aria-label="free input" @click="inputMode = 'free'">free</a></li>
							<li><a class="dropdown-item" id="step-input-select" aria-label="step input"  @click="inputMode = 'step'">step</a></li>
							<li><a class="dropdown-item" id="ramp-input-select" aria-label="ramp input"  @click="inputMode = 'ramp'">ramp</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<div class="col-lg-4" v-if='getCurrentMode != "speedRaw" && getCurrentMode != "stopped"' @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
			<div class='d-flex flex-column'>
					<div class="d-flex flex-row mb-2 align-items-center">
						<label v-if='getCurrentMode == "speedPid"' for="kp-input" class="me-2" id="kp-param-label">K<sub>p</sub></label>
						<label v-else class="me-2" for="kp-input" id="kp-param-label">K<sub>p</sub></label>
						<input type="number" step='0.1' :class="(parseFloat(kpParam) >= 0) ? 'form-control' : 'form-control is-invalid'" placeholder="Kp" aria-label="Kp" aria-describedby="basic-addon1" id="kp-input" v-model="kpParam" @change='setParameters' :disabled='getCurrentMode == "stopped" || getIsStepRunning == true || getIsRampRunning == true'>
						<label v-if='getCurrentMode == "speedPid"' for="kp-input" id="kp-param-label-2">[x10<sup>-2</sup>]</label>
					</div>
						
					<div class="d-flex flex-row flex-fill mb-2 align-items-center">
						<label v-if='getCurrentMode == "speedPid"' for="ki-input" class="me-2" id="ki-param-label">K<sub>i</sub></label>
						<label v-else for="ki-input" class="me-2" id="ki-param-label">K<sub>i</sub></label>
						<input type="number" step='0.1' :class="(parseFloat(kiParam) >= 0) ? 'form-control' : 'form-control is-invalid'" placeholder="Ki" aria-label="Ki" aria-describedby="basic-addon1" id="ki-input" v-model="kiParam" @change='setParameters' :disabled='getCurrentMode == "stopped" || getIsStepRunning == true || getIsRampRunning == true'>
						<label v-if='getCurrentMode == "speedPid"' for="ki-input" id="ki-param-label-2">[x10<sup>-2</sup>]</label>
					</div>

					<div class="d-flex flex-row flex-fill mb-2 align-items-center">
						<label v-if='getCurrentMode == "speedPid"' for="ki-input" class="me-2" id="kd-param-label">K<sub>d</sub></label>
						<label v-else class="me-2" for="ki-input" id="kd-param-label">K<sub>d</sub></label>
						<input type="number" step='0.1' :class="(parseFloat(kdParam) >= 0) ? 'form-control' : 'form-control is-invalid'" placeholder="Kd" aria-label="Kd" aria-describedby="basic-addon1" id="kd-input" v-model="kdParam" @change='setParameters' :disabled='getCurrentMode == "stopped" || getIsStepRunning == true || getIsRampRunning == true'>
						<label v-if='getCurrentMode == "speedPid"' for="kd-input" id="kd-param-label-2">[x10<sup>-2</sup>]</label>
					</div>
			</div>

			<div class='d-flex row justify-content-center m-2'>
				<div class='col-auto'>
					<button v-if='getCurrentMode != "stopped"' id="reset-pid-parameters-button" type='button' class="button-xsm button-danger" aria-label="reset pid parameters" @click="resetParameters">Reset PID params</button>
				</div>
			</div>
			
		</div>

		<div :class="getCurrentMode == 'speedRaw' ? 'col-lg-9' : 'col-lg-5'">
			<div class="me-lg-2" v-if='getCurrentMode != "stopped"'>
				<div v-if='inputMode == "free"'>
					<div v-if='getCurrentMode == "speedRaw"'>
						<DCMotorPanel v-bind:dataSocket="getDataSocket" :maxV="6" />
					</div>
				</div>

				<div v-else-if="inputMode == 'step'">
					<StepCommand v-bind:mode='getCurrentMode' @showinputtype="toggleInputType"/>
				</div>

				<div  v-else-if="inputMode == 'ramp'">
					<RampCommand v-bind:mode='getCurrentMode' @showinputtype="toggleInputType"/>
				</div>

			</div>
		</div>

		
	</div>


	
	

	<!-- <div class='row d-flex justify-content-center'>
			<div class='col-auto'>
				<div class='input-group' v-if='getCurrentMode != "stopped"'>
					<span class="input-group-text" for="inputSelect">Input type</span>
					<select class="form-select form-select-sm" name="inputSelect" id="inputSelect" v-model="inputMode" :disabled='!showInputType'>
						<option v-if='getCurrentMode == "speedRaw"' id="free-mode-select" value="free">Free</option>
						<option id="step-mode-select" value="step">Step</option>
						<option id="ramp-mode-select" value="ramp">Ramp</option>
					</select> 
				</div>
			</div>
		</div> -->

	<!-- <div id="buttons">
		<div class='row'>
			<div class='d-grid gap-1 d-md-block mb-1'>
				<button v-if='getCurrentMode == "stopped"' id="enter-open-loop-mode-button" class="button-lg button-primary me-1" aria-label="voltage mode" @click="speedRaw">Voltage (open loop)</button>
				<button v-if='getCurrentMode == "stopped"' id="enter-pid-position-mode-button" class="button-lg button-primary me-1" aria-label="position mode" @click="positionPid">Position (PID)</button>
				<button v-if='getCurrentMode == "stopped"' id="enter-pid-speed-mode-button" class="button-lg button-primary me-1" aria-label="speed mode" @click="speedPid">Velocity (PID)</button>
				<button id="stop-motor-button" v-if='getCurrentMode != "stopped"' class="button-lg button-danger" aria-label="exit mode" @click="stop">Exit mode</button>
			</div>
		</div>

		

	</div> -->


	

	

</div>

</template>

<script>

import { SmoothieChart } from 'smoothie';
import { TimeSeries } from 'smoothie';
import DCMotorPanel from './DCMotorPanel.vue';
import StepCommand from './StepCommand.vue';
import RampCommand from './RampCommand.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
	name: "ControlPanelSpinningDisk",
	props:{
		url: String,
	},
	emits:['toggledraggable'],
	components:{
		DCMotorPanel,
		StepCommand,
		RampCommand,
	},
    data(){
        return{
			dataSocket: null,
			speedParam: 0,			//in rad/sec FOR NEW FIRMWARE
			angleParam: 0,			//in rads for new firmware
			kpParam: 1.00,
			kiParam: 0.00,
			kdParam: 0.00,
			kspeed_scale: 0.01,
			message: '',				//for sending user messages to screen
			error:'',					//for sending errors to screen
			showInputType: false,				//don't show input types until a mode has been selected
        }
    },
	created(){
		this.$store.dispatch('setCurrentMode',  'stopped');
		this.$store.dispatch('setInputMode',  'step');
	},
	mounted(){
		
	},
	computed: {
		...mapGetters([
			'getModeName',
			'getDataURLObtained',
			'getCurrentMode',
			'getSessionExpired',
			'getMaxReached',
            'getIsStepRunning',
            'getIsRampRunning',
			'getChartTheta',
			'getChartOmega',
			'getCanvasTheta',
			'getCanvasOmega',
			'getSpeedModeAbs',
			'getVoltModeAbs'
		]),
		inputMode: {
			get(){
				return this.$store.getters.getInputMode;
			},
			set(mode){
				this.$store.dispatch('setInputMode', mode);
			}
		},
		getDataSocket(){
			return this.dataSocket;
		},
		getErrorClass(){
			if(this.error == ''){
				return ""
			} else {
				return "error-message panel-body border border-danger";
			}
		},
		smoothie_y_max_vel: {
			get(){
				return this.$store.getters.getYMaxVel;
			},
			set(val){
				this.$store.dispatch('setYMaxVel', val);
			}
		},
		smoothie_y_max_pos: {
			get(){
				return this.$store.getters.getYMaxPos;
			},
			set(val){
				this.$store.dispatch('setYMaxPos', val);
			}
		},
		smoothie_y_min_vel: {
			get(){
				return this.$store.getters.getYMinVel;
			},
			set(val){
				this.$store.dispatch('setYMinVel', val);
			}
		},
		smoothie_y_min_pos: {
			get(){
				return this.$store.getters.getYMinPos;
			},
			set(val){
				this.$store.dispatch('setYMinPos', val);
			}
		},
		smoothie_millis_per_pixel: {
			get(){
				return this.$store.getters.getMillisPerPixel;
			},
			set(val){
				this.$store.dispatch('setMillisPerPixel', val);
			}
		}
		
	},
	watch:{
        url(){
			try{
				if(this.url != '' && this.getDataURLObtained){
					this.connectWithArrays();								//new method for arrays
					this.setGraphDataParameter('omega');
				} else{
					console.log('disconnecting: ' + this.url);
				}
				
			} catch(e){
				console.log(e);
			}
			
			
		},
		getSessionExpired(exp){
			if(exp){
				this.stop();
			}
		},
		getMaxReached(reached){
			if(reached){
				this.error = 'Max data points reached, recording automatically stopped'
			} else{
				this.error = '';
			}
		}
    },
	methods:{
		...mapActions([
			'setCurrentMode',
			'setGraphDataParameter',
			'setDraggable',
            'setIsRecording',
            'setIsStepRunning',
            'setIsRampRunning',
			'setChartTheta',
			'setChartOmega',
			'setCanvasTheta',
			'setCanvasOmega'
		]),
		stop(){
			//this.clearMessages();
			this.showInputType = false;	
			this.speedParam = 0;
			this.$store.dispatch('stop');
		},
		hasStopped(message){
			this.error = 'Automatic stop: ' + message + ". Select a mode to continue.";
            this.setIsRecording(false);     //stop recording data when a limit is reached
            this.setIsStepRunning(false);
            this.setIsRampRunning(false);
			this.stop();								
		},
		speedPid(){
			this.clearMessages();
			this.setGraphDataParameter('omega');
			this.smoothie_y_min_vel = -this.getSpeedModeAbs;
			this.smoothie_y_max_vel = this.getSpeedModeAbs;
			// this.updateSmoothieChart();
			this.showInputType = true;
			this.$store.dispatch('speedPid');
			setTimeout(this.setParameters, 100);					//when entering pid mode ensure parameters are set
		},
		positionPid(){
			this.clearMessages();
			this.setGraphDataParameter('theta');
			this.showInputType = true;
			this.$store.dispatch('positionPid');
			setTimeout(this.setParameters, 100);			//when entering pid mode ensure parameters are set
		},
		speedRaw(){
			this.clearMessages();
			this.setGraphDataParameter('omega');
			this.smoothie_y_min_vel = -this.getVoltModeAbs;
			this.smoothie_y_max_vel = this.getVoltModeAbs;
			// this.updateSmoothieChart();
			this.showInputType = true;
			this.$store.dispatch('speedRaw');
		},
		setSpeed(){
			this.clearMessages();
			this.showInputType = false;
			if(!isNaN(this.speedParam)){
				this.$store.dispatch('setSpeed', parseFloat(this.speedParam));
			} else {
				this.error = 'Speed parameter is NaN';
			}
		},
		setPosition(){
			this.clearMessages();
			this.showInputType = false;
			if(!isNaN(this.angleParam)){
				this.$store.dispatch('setPosition', this.angleParam);
			} else {
				this.error = 'Angle parameter is NaN';
			}
		},
		setParameters(){
			this.clearMessages();
			if(parseFloat(this.kpParam) >= 0 && parseFloat(this.kiParam) >= 0 && parseFloat(this.kdParam) >= 0){
				if(this.getCurrentMode == 'speedPid'){
					let params = {kp: parseFloat(this.kpParam*this.kspeed_scale), ki: parseFloat(this.kiParam*this.kspeed_scale), kd: parseFloat(this.kdParam*this.kspeed_scale)};
					this.$store.dispatch('setPidParameters', params);
				} else{
					let params = {kp: parseFloat(this.kpParam), ki: parseFloat(this.kiParam), kd: parseFloat(this.kdParam)};
					this.$store.dispatch('setPidParameters', params);
				}
				
			} else{
				this.error = 'Cannot parse PID parameters';
			}
			
		},
		hotkey(event){
			if(event.key == "s"){
				this.stop();
			} 
		},
		clearMessages(){
			this.message = '';
			this.error = '';
		},
		resetParameters(){
			this.kpParam = 1.0;
			this.kiParam = 0.0;
			this.kdParam = 0.0;
			this.setParameters();
		},
		toggleInputType(on){
			this.showInputType = on;
		},
		// updateSmoothieChart(){
		// 	if(this.getCurrentMode == 'positionPid'){
		// 		this.getChartTheta.options.maxValue = this.smoothie_y_max_pos;
		// 		this.getChartTheta.options.minValue = this.smoothie_y_min_pos;
		// 		this.getChartTheta.options.millisPerPixel = this.smoothie_millis_per_pixel;
		// 	} 
		// 	else{
		// 		this.getChartOmega.options.maxValue = this.smoothie_y_max_vel;
		// 		this.getChartOmega.options.minValue = this.smoothie_y_min_vel;
		// 		this.getChartOmega.options.millisPerPixel = this.smoothie_millis_per_pixel;	
		// 	}
		// },
		// connect(){

		// 	let _store = this.$store;
		// 	let _this = this;

		// 	this.dataSocket = new WebSocket(this.url);
			
		// 	var delay = 0
		// 	let delay_sum = 0;
		// 	var messageCount = 0
		// 	let a;
		// 	let b;
		// 	let debug = false;
		// 	var initialSamplingCount = 1200 // 2 mins at 10Hz, 1200
		// 	var delayWeightingFactor = 30  // 
		// 	let responsiveSmoothie = true;
		// 	let thisTime;
			
		// 	var chart_omega = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:_this.smoothie_millis_per_pixel,grid:{fillStyle:'#000000'},maxValue:_this.smoothie_y_max_vel,minValue:_this.smoothie_y_min_vel, interpolation:"linear",labels:{fillStyle:'#00ff00',precision:2}});
		// 	this.canvas_omega = document.getElementById("smoothie-chart_omega");
		// 	let series_omega = new TimeSeries();
		// 	chart_omega.addTimeSeries(series_omega, {lineWidth:2,strokeStyle:'#00ff00'});
		// 	chart_omega.streamTo(this.canvas_omega, 0);

		// 	//smoothie chart for displaying angle data
		// 	var chart_theta = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:_this.smoothie_millis_per_pixel,grid:{fillStyle:'#000000'}, maxValue:_this.smoothie_y_max_pos,minValue:_this.smoothie_y_min_pos, interpolation:"linear",labels:{fillStyle:'#00ff00',precision:2}});
		// 	this.canvas_theta = document.getElementById("smoothie-chart_theta");
		// 	let series_theta = new TimeSeries();
		// 	chart_theta.addTimeSeries(series_theta, {lineWidth:2,strokeStyle:'#00ff00'});
		// 	chart_theta.streamTo(this.canvas_theta, 0);

		// 	//in order to update the charts
		// 	_this.chart_omega = chart_omega;
		// 	_this.chart_theta = chart_theta;

		// 	this.dataSocket.onopen = () => {
		// 		console.log('data connection opened');
		// 	};

		// 	this.dataSocket.onmessage = (event) => {
		// 		try {
		// 			var obj = JSON.parse(event.data);
					
		// 			if(obj.error){
		// 				this.hasStopped(obj.error);
		// 			}
		// 			else if(obj.t){
		// 				//set values coming from hardware
		// 				_store.dispatch('setP', obj.p_sig);
		// 				_store.dispatch('setI', obj.i_sig);
		// 				_store.dispatch('setD', obj.d_sig);
		// 				_store.dispatch('setError', obj.e);
		// 				_store.dispatch('setDrive', obj.y);
		// 				_store.dispatch('setCommand', obj.c);

		// 				var msgTime = obj.t;
		// 				msgTime = parseFloat(msgTime);
		// 				var thisDelay = new Date().getTime() - msgTime;
					
		// 				var enc = obj.d;					//rad
		// 				var enc_ang_vel = obj.v;			//rad/s

		// 				if(messageCount == 0){
		// 					delay = thisDelay
		// 					delay_sum += thisDelay;
		// 				} else{
		// 					if(!isNaN(thisDelay)){
		// 						delay_sum += thisDelay;
		// 						delay = delay_sum / (messageCount + 1);
		// 					} else{
		// 						delay_sum += delay;
		// 						delay = delay_sum / (messageCount + 1);
								
		// 					}
							
		// 				}

		// 				a = 1 / delayWeightingFactor
		// 				b = 1 - a

		// 				if (messageCount < initialSamplingCount) {
		// 					thisDelay = ((delay * messageCount) + thisDelay) / (messageCount + 1)
		// 				} else {
		// 					thisDelay = (delay * b) + (thisDelay * a)
		// 				}
			
		// 				messageCount += 1
		// 				thisTime = msgTime + thisDelay;

		// 				if (!isNaN(thisTime)){
		// 					let data_received = false;
		// 					if(!isNaN(enc)){
		// 						_store.dispatch('setCurrentAngle', enc);			
		// 						series_theta.append(msgTime + thisDelay, enc);
		// 						data_received = true;
		// 					}
							
		// 					if(!isNaN(enc_ang_vel)){		
		// 						_store.dispatch('setCurrentAngularVelocity', enc_ang_vel);
		// 						series_omega.append(msgTime + thisDelay, enc_ang_vel);	
		// 						data_received = true;
		// 					}

		// 					if(data_received){
		// 						_store.dispatch('setCurrentTime', msgTime + thisDelay);	//testing
		// 					}
		// 				}
		// 			}
		// 		} catch (e) {
		// 			if(debug){
		// 				console.log(e)
		// 			}
					
		// 		}
		// 	}

		// _store.dispatch('setStartTime', new Date().getTime());
		// window.addEventListener('keydown', this.hotkey, false);
		// window.addEventListener('pagehide', this.stop);				//closing window
		// window.addEventListener('beforeunload', this.stop);			//refreshing page, changing URL
		
		
		// },
		connectWithArrays(){

			let _store = this.$store;
			let _this = this;

			this.dataSocket = new WebSocket(this.url);
			//this.dataSocket = new WebSocket('wss://video.practable.io:443/bi/dpr/pendulum0');		//testing
			_store.dispatch('setDataSocket', this.dataSocket);
			var delay = 0
			let delay_sum = 0;
			var messageCount = 0
			let a;
			let b;
			let debug = false;
			var initialSamplingCount = 1200 // 2 mins at 10Hz, 1200
			var delayWeightingFactor = 30  // 
			let responsiveSmoothie = true;
			//let thisTime;
			
			var chart_omega = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:_this.smoothie_millis_per_pixel,grid:{fillStyle:'#eeeeee'},maxValue:_this.smoothie_y_max_vel,minValue:_this.smoothie_y_min_vel, interpolation:"linear",labels:{fillStyle:'#000000',precision:2}});
			let canvas_omega = document.getElementById("smoothie-chart_omega");
			let series_omega = new TimeSeries();
			chart_omega.addTimeSeries(series_omega, {lineWidth:2,strokeStyle:'#000000'});
			chart_omega.streamTo(canvas_omega, 0);
			_this.setChartOmega(chart_omega);
			_this.setCanvasOmega(canvas_omega);

			//smoothie chart for displaying angle data
			var chart_theta = new SmoothieChart({responsive: responsiveSmoothie, millisPerPixel:_this.smoothie_millis_per_pixel,grid:{fillStyle:'#eeeeee'}, maxValue:_this.smoothie_y_max_pos,minValue:_this.smoothie_y_min_pos, interpolation:"linear",labels:{fillStyle:'#000000',precision:2}});
			let canvas_theta = document.getElementById("smoothie-chart_theta");
			let series_theta = new TimeSeries();
			chart_theta.addTimeSeries(series_theta, {lineWidth:2,strokeStyle:'#000000'});
			chart_theta.streamTo(canvas_theta, 0);
			_this.setChartTheta(chart_theta);
			_this.setCanvasTheta(canvas_theta);

			//in order to update the charts
			// _this.chart_omega = chart_omega;
			// _this.chart_theta = chart_theta;

			this.dataSocket.onopen = () => {
				console.log('data connection opened');
			};

			this.dataSocket.onmessage = (event) => {
				try {
					var obj = JSON.parse(event.data);
					//console.log(obj);
					
					if(obj.error){
						_this.hasStopped(obj.error);
					}
					else if(obj.t){

						_store.dispatch('setErrorArray', obj.e);
						_store.dispatch('setDriveArray', obj.y);
						_store.dispatch('setCommandArray', obj.c);
						
						//new array values
						let msgTimes = obj.t;
						let encs = obj.d;
						let enc_ang_vels = obj.v;

						let d_msgTime = parseFloat(msgTimes[3]);
						var thisDelay = new Date().getTime() - d_msgTime;

						if(messageCount == 0){
							delay = thisDelay
							delay_sum += thisDelay;
						} else{
							if(!isNaN(thisDelay)){
								delay_sum += thisDelay;
								delay = delay_sum / (messageCount + 1);
							} else{
								delay_sum += delay;
								delay = delay_sum / (messageCount + 1);
								
							}
							
						}

						a = 1 / delayWeightingFactor
						b = 1 - a

						if (messageCount < initialSamplingCount) {
							thisDelay = ((delay * messageCount) + thisDelay) / (messageCount + 1)
						} else {
							thisDelay = (delay * b) + (thisDelay * a)
						}
			
						messageCount += 1
						//thisTime = d_msgTime + thisDelay;

						if (!isNaN(d_msgTime)){
							let data_received = false;
							if(!isNaN(encs[3])){
								//_store.dispatch('setCurrentAngle', encs[3]);
								_store.dispatch('setCurrentAngleArray', encs);

								series_theta.append(msgTimes[0] + thisDelay, encs[0]);
								series_theta.append(msgTimes[1] + thisDelay, encs[1]);
								series_theta.append(msgTimes[2] + thisDelay, encs[2]);
								series_theta.append(msgTimes[3] + thisDelay, encs[3]);
								
								//series_theta.append(d_msgTime + thisDelay, encs[3]);
								data_received = true;
							}
							
							if(!isNaN(enc_ang_vels[3])){		
								//_store.dispatch('setCurrentAngularVelocity', enc_ang_vels[3]);
								_store.dispatch('setCurrentAngularVelocityArray', enc_ang_vels);

								series_omega.append(msgTimes[0] + thisDelay, enc_ang_vels[0]);
								series_omega.append(msgTimes[1] + thisDelay, enc_ang_vels[1]);
								series_omega.append(msgTimes[2] + thisDelay, enc_ang_vels[2]);
								series_omega.append(msgTimes[3] + thisDelay, enc_ang_vels[3]);
								//series_omega.append(d_msgTime + thisDelay, enc_ang_vels[3]);	
								data_received = true;
							}

							if(data_received){
								//_store.dispatch('setCurrentTime', msgTimes[3]);	//time should only be the time received from the arduino
								_store.dispatch('setCurrentTimeArray', msgTimes);
							}
						}
					}
				} catch (e) {
					if(debug){
						console.log(e)
					}
					
				}
			}

		_store.dispatch('setStartTime', new Date().getTime());
		window.addEventListener('keydown', this.hotkey, false);
		window.addEventListener('pagehide', this.stop);				//closing window
		window.addEventListener('beforeunload', this.stop);			//refreshing page, changing URL
		
		
		},

	},
}




</script>

<style scoped>

.error-message{
	color: red;
	text-decoration: bold;
	border: thin;
	box-shadow: 0px 0px;
}

.error{
    /* border:thick solid red */
	border: auto;
}

.error:focus{
    /* border:thick solid red */
	border: auto;
}

/* #smoothie-chart_omega{
	width:100%;
	height: 120px;
}

#smoothie-chart_theta{
	width:100%;
	height: 120px;
} */

.sliderlabel{ text-align: left;}

select{
    color: white;
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: #4490d8;
}

</style>