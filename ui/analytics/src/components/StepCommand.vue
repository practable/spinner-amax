//vue3 update

<template>
        
    <div class="mt-4" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">  
        <div class="d-lg-flex align-items-center" v-if='mode == "speedRaw"'>
            <span class='input-group-text' for="step_raw">Step size ({{-max_voltage_step}} to {{max_voltage_step}}V)</span>
            <input type="number" :max='max_voltage_step' :min='-max_voltage_step' :class="(parseFloat(step_size) >= -max_voltage_step && parseFloat(step_size) <= max_voltage_step) ? 'form-control' : 'form-control is-invalid'" id="step_raw" v-model="step_size">
            <button class='button-lg button-primary' id="run" @click="runStep" :disabled='Math.abs(step_size) > max_voltage_step'>Run</button>
            <button class='button-lg button-danger' v-if='getIsStepRunning' id="wait" @click="stopStep">Stop</button>
        </div>
    

        <div class='d-lg-flex align-items-center' v-else-if='mode == "speedPid"'>
            <span class='input-group-text' for="step_speed">Step size (0 - {{max_speed_step}} rad/s)</span>
            <input type="number" :max='max_speed_step' :min='-max_speed_step' :class="(parseFloat(step_size) >= -max_speed_step && parseFloat(step_size) <= max_speed_step) ? 'form-control' : 'form-control is-invalid'" id="step_speed" v-model="step_size">
            <button class='button-lg button-primary' id="run" @click="runStep" :disabled='Math.abs(step_size) > max_speed_step'>Run</button>
            <button class='button-lg button-danger' v-if='getIsStepRunning' id="wait" @click="stopStep">Stop</button>
        </div>

        <div class='d-lg-flex align-items-center' v-else-if='mode == "positionPid"'>
            <span class='input-group-text' for="step_speed">Step size (0 - {{max_position_step.toFixed(2)}} rad)</span>
            <input type="number" step='0.01' :max='max_position_step.toFixed(2)' :min='-max_position_step.toFixed(2)' :class="(parseFloat(step_size) >= -max_position_step && parseFloat(step_size) <= max_position_step) ? 'form-control' : 'form-control is-invalid'" id="step_position" v-model="step_size" >
            <button class='button-lg button-primary' v-if='!getIsStepRunning' id="run" @click="runStep">Run</button>
            <button class='button-lg button-danger' v-else-if='getIsStepRunning' id="wait" @click="stopStep">Stop</button>
        </div>
    </div>
       
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {

  name: 'StepCommand',
  props:{
      mode: String,
  },
  emits:['showinputtype'],
  data () {
    return {
        step_size: 0.00,            
        max_position_step: 6, 
        max_speed_step: 100,
        max_voltage_step: 6,
    }
  },
  created(){
      
	},
    computed:{
    ...mapGetters([
        'getIsStepRunning'
        ])
    },
  methods: {
      ...mapActions([
          'setDraggable',
          'setIsStepRunning'
      ]),
     runStep(){
         if(this.$store.getters.getIsDataRecorderOn){
                 this.$store.dispatch('setIsRecording', true);
             }

         this.$emit('showinputtype', false);
         
        //  let step = {
        //      step_time: this.time_to_step,
        //      step_start: 0,
        //      step_size: this.step_size
        //  }
        //  this.$store.dispatch('setStep', step);
         
        this.sendCommand();
             
     },
     sendCommand(){
         if(this.mode == 'speedRaw'){
             
             //this.isStepRunning = true; 
             this.setIsStepRunning(true);
             let signal = parseFloat(this.step_size);
             this.$store.dispatch('setVoltage', signal);

         } else if(this.mode == 'positionPid'){

             //this.isStepRunning = true;                      //NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
             this.setIsStepRunning(true);
             let new_ang_rad = this.$store.getters.getCurrentAngle + parseFloat(this.step_size);
             this.$store.dispatch('setPosition', new_ang_rad);

         } else if(this.mode == 'speedPid'){

             //this.isStepRunning = true; 
             this.setIsStepRunning(true);
             let rad_s = this.$store.getters.getCurrentAngularVelocity + parseFloat(this.step_size);           //needs to be in rad/s
             this.$store.dispatch('setSpeed', rad_s);

         }
         
     },
     stopStep(){
            //this is an internal mode in the firmware and does not need to be reflected in the UI.
            //this.isStepRunning = false;				//NEW !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			this.setIsStepRunning(false);
            
            this.$emit('showinputtype', true);

            if(this.$store.getters.getIsRecording){
                 this.$store.dispatch('setIsRecording', false);
             }

            if(this.mode == 'positionPid'){
                this.$store.dispatch('wait');
            } else if(this.mode == 'speedRaw'){
                this.$store.dispatch('setVoltage', 0);
            } else {
                this.$store.dispatch('wait');
            }
             
		},
     
  }
}
</script>

<style scoped>
.error{
    /* border:thick solid red */
    border: auto;
}

.error:focus{
    /* border:thick solid red */
    border: auto;
}


</style>