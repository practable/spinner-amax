//v2 update - added commandStore commands

<template>
<div class='m-2'>
   <div class="row">
            <div class="col-lg-6" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <label for="voltage">Input voltage ({{getVoltageAsString}}V)</label>
                </div>

                <div class="d-flex flex-row align-items-center justify-content-center">
                    <input type="range" :min="-maxV" :max="maxV" step="0.01" v-model="voltage" list='tickmarks' id="voltage-slider" @change='setVoltage'>
                </div>
                
                <div class='d-flex flex-row'>
                    <div class='flex-fill'><button type='button' class='btn btn-outline-primary btn-sm' id="voltage-negative-0.1-increment" aria-label="increment voltage negative tenth" @click='incrementVoltage(-0.1)'>-</button></div>
                    <div class='flex-fill'><label type='label' class='col-form-label'>0.1V</label></div>
                    <div class='flex-fill'><button type='button' class='btn btn-outline-primary btn-sm' id="voltage-positive-0.1-increment" aria-label="increment voltage positive tenth" @click='incrementVoltage(+0.1)'>+</button></div>
                </div>
                <div class='d-flex flex-row'>
                    <div class='flex-fill'><button type='button' class='btn btn-outline-primary btn-sm' id="voltage-negative-0.01-increment" aria-label="increment voltage negative hundredth" @click='incrementVoltage(-0.01)'>-</button></div>
                    <div class='flex-fill'><label class='col-form-label'>0.01V</label></div>
                    <div class='flex-fill'><button type='button' class='btn btn-outline-primary btn-sm' id="voltage-positive-0.01-increment" aria-label="increment voltage positive hundredth" @click='incrementVoltage(+0.01)'>+</button></div>
                </div>
                
            </div>

            <div class="col-lg-6">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <label class="mb-2" for="ang_vel">Motor angular velocity (rad/s)</label>
                </div>
                
                <div v-if='isAnalogueOutput'>
                    <analogue-output :outputValue="getCurrentAngularVelocity" :minValue="0" :maxValue="400" :intervalValue="50" :minorIntervalValue="10"></analogue-output>
                </div>
                <div v-else>
                    <input type='text' class='form-control' id="ang_velocity" :value='avgAngVel' readonly>
                </div>
            </div>
    </div>
</div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AnalogueOutput from "./AnalogueOutput.vue";

export default {

  name: 'DCMotorPanel',
  props: {
      dataSocket: WebSocket,
      maxV: Number,
  },
  components: {
    AnalogueOutput
  },
  data () {
    return {
        voltage: 0,
        isAnalogueOutput: true,
    }
  },
  computed:{
      ...mapGetters([
          'getCurrentAngularVelocity',
          'calculateAverageVelocity',
      ]),
      getVoltageAsString(){
          let num = Number(this.voltage);
          return num.toFixed(2);
      },
      avgAngVel(){
          let average = this.calculateAverageVelocity;
          return average.toFixed(2);
      }
  },
  methods: {
      ...mapActions([
          'setDraggable'
      ]),
      setVoltage(){
          this.$store.dispatch('setVoltage', this.voltage);
      },
      incrementVoltage(delta){
          if(Number(this.voltage) + Number(delta) <= this.maxV){
              this.voltage = Number(this.voltage) + Number(delta);
              this.setVoltage();
          }
          
      }
      
      
  }
}
</script>

<style scoped>



</style>