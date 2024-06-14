//vue3 update
//Firmware has been updated to include a ramp function
//This component now just needs to send a slightly different command to the firmware.

<template>
    <div class="mt-4" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">  

        <div class='d-lg-flex align-items-center' v-if='mode == "speedRaw"'>
            <span class='input-group-text' for="ramp_gradient">Ramp gradient [Vs<sup>-1</sup>]</span>
            <input type="number" :max='max_voltage_ramp' :min='-max_voltage_ramp' :class="(parseFloat(ramp_gradient) >= -max_voltage_ramp && parseFloat(ramp_gradient) <= max_voltage_ramp) ? 'form-control' : 'form-control is-invalid'" id="ramp_gradient" v-model="ramp_gradient">
            <button class='button-lg button-primary' id="run" v-if='!getIsRampRunning' @click="runRamp">Run</button>
            <button class='button-lg button-danger' v-else id="stop" @click="stopRamp">Stop</button>
        </div>

        <div class='d-lg-flex align-items-center' v-else-if='mode == "speedPid"'>
            <span class='input-group-text' for="ramp_gradient">Ramp gradient [rads<sup>-2</sup>]</span>
                <input type="number" :max='max_speed_ramp' :min='-max_speed_ramp' :class="(parseFloat(ramp_gradient) >= -max_speed_ramp && parseFloat(ramp_gradient) <= max_speed_ramp) ? 'form-control' : 'form-control is-invalid'" id="ramp_gradient" v-model="ramp_gradient">
                <button class='button-lg button-primary' id="run" v-if='!getIsRampRunning' @click="runRamp">Run</button>
                <button class='button-lg button-danger' v-else id="stop" @click="stopRamp">Stop</button>
        </div>

        <div class='d-lg-flex align-items-center' v-else-if='mode == "positionPid"'>
            <span class='input-group-text' for="ramp_gradient">Ramp gradient [rads<sup>-1</sup>]</span>
            <input type="number" :max='max_position_ramp' :min='-max_position_ramp' :class="(parseFloat(ramp_gradient) >= -max_position_ramp && parseFloat(ramp_gradient) <= max_position_ramp) ? 'form-control' : 'form-control is-invalid'" id="ramp_gradient" v-model="ramp_gradient">
            <button class='button-lg button-primary' id="run" v-if='!getIsRampRunning' @click="runRamp">Run</button>
            <button class='button-lg button-danger' v-else id="stop" @click="stopRamp">Stop</button>
        </div>

     </div>   
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {

  name: 'RampCommand',
  props:{
      mode: String,
  },
  emits:['showinputtype'],
  data () {
    return {
        ramp_gradient: 1.00,            
        max_position_ramp: 6.00,
        max_speed_ramp: 100,
        max_voltage_ramp: 10,
        //isRampRunning: false,         //moved to vuex instead
    }
  },
  computed:{
      ...mapGetters([
          'getCurrentMode',
          'getIsRampRunning'
      ])
  },
  watch:{
    
  },
  methods: {
      ...mapActions([
          'setDraggable',
          'setIsRampRunning'
      ]),
    runRamp(){

        this.$emit('showinputtype', false);

        if(this.$store.getters.getIsDataRecorderOn){
            this.$store.dispatch('setIsRecording', true);
        }

        if(this.mode == 'positionPid'){
            //this.isRampRunning = true;
            this.setIsRampRunning(true);
            this.$store.dispatch('setPositionRamp', this.ramp_gradient);
        } 
        else if(this.mode == 'speedPid'){
            //this.isRampRunning = true;
            this.setIsRampRunning(true);
            this.$store.dispatch('setSpeedRamp', this.ramp_gradient);
        } 
        else if(this.mode == 'speedRaw'){
            //this.isRampRunning = true;
            this.setIsRampRunning(true);
            this.$store.dispatch('setVoltageRamp', this.ramp_gradient);
        } else{
            //this.isRampRunning = false;
            this.setIsRampRunning(false);
            this.$store.dispatch('setIsRecording', false);
        }

    },
    stopRamp(){
        //this.isRampRunning = false;
        this.setIsRampRunning(false);

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
        
    }
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