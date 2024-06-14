//Vue3 updated
//Streamlined data to not include alternative units

<template>
<div class='m-2 p-2 practable-component'>
    <div class="d-grid gap-2 d-sm-block">
        <button type='button' class="button-xsm button-primary" aria-label="record" v-if="!getIsRecording && getInputMode == 'free'" id="recordButton" @click='$store.dispatch("setIsRecording", true)'>Record</button>
        <button type='button' class="button-xsm button-danger" aria-label="stop" v-if="getIsRecording" id="stopButton" @click='$store.dispatch("setIsRecording", false)'>Stop</button>
        <button type='button' class="button-xsm button-warning" aria-label="reset" id="clearButton" @click="toggleResetModal">Reset</button>
        <button type='button' class="button-xsm button-primary" aria-label="download csv" v-if="hasData" id="outputButton" @click="outputToCSV">Download CSV</button>
    </div>
    <div class='row m-2 justify-content-center'>
      <div v-if='getIsRecording' class='col-2'>
        <img id='red-light' src='/images/red-light.png' width='20' height='20' :hidden='!showRedLight'>
      </div>
      <div class='col-10'>  
        <p class='m-1'>Recorded: {{getNumData}}/{{getMaxDataPoints}} data points</p>
      </div>
    </div>

  <transition name='fade'>
    <div v-if='showResetConfirmModal' class="modal modal-show" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Reset Data</h5>
              <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close reset modal" @click='toggleResetModal'>
                
              </button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to Reset? This will clear all stored data.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-xsm button-danger" id='resetmodalclear' aria-label="reset" @click="clearData(); toggleResetModal();">Reset</button>
              <button type="button" class="button-xsm button-secondary" data-dismiss="modal" data-bs-dismiss="modal" aria-label="cancel reset" @click="toggleResetModal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {

  name: 'DataRecorder',
  props:{
	
	},
  data () {
    return {
        stopped_recording: false,
        showResetConfirmModal: false,
        //data_set_index: 0,      //moved to dataStore vuex
    }
  },
  components: {
    
  },
  created(){
    
	},
  computed:{
    ...mapGetters([
        'getIsRecording',
        'getCurrentTime',
        'getInputMode',
        'getNumData',
        //'getCurrentAngle',
        //'getCurrentAngularVelocity',
        'getMaxDataPoints',
        'getCurrentAngleArray',
        'getCurrentAngularVelocityArray',
        'getCurrentTimeArray',
        'getTimeArray',
        'getCommandArray',
        'getDriveArray',
        'getErrorArray',
        'getDatasetIndex'
        
    ]),
      hasData(){
          return this.getNumData !== 0;
      },
      showRedLight(){
        return this.getNumData % 100 > 50 ? true : false;
      }
  },
  watch:{
    getIsRecording(now, prev){
        if(prev && !now){
          this.stopRecording();
        } else if(now){
          this.record();
        }
    },
    getCurrentTime(){
      if(this.getIsRecording && this.getNumData < this.getMaxDataPoints){
        this.plot();
      } else if(this.getNumData == this.getMaxDataPoints && !this.stopped_recording){
          this.stopRecording();
          this.stopped_recording = true;
      }
    },
  },
  methods: {
    ...mapActions([
      'addToDatasetIndex',
      'setDatasetIndex'
    ]),
      record(){
          this.$store.dispatch('setStartTime', this.getCurrentTimeArray[0]);
      },
      stopRecording(){
        console.log('data recording stopped');
        this.addToDatasetIndex();
      },
      // plot(){
      //     let angle = parseFloat(this.getCurrentAngle); //rad
      //     let time = this.$store.getters.getTime;       //s
      //     let ang_vel = parseFloat(this.getCurrentAngularVelocity);  //rad/s
      //     let command = this.$store.getters.getCommand;
      //     let drive = this.$store.getters.getDrive;
      //     let error = this.$store.getters.getError;

      //     let data_object = {id: this.getNumData, t: parseFloat(time), theta: angle.toFixed(2), omega: ang_vel.toFixed(2), command: command, drive: drive, error: error, showDataPoint: true};
      //     this.$store.dispatch('addData', data_object);
          

      // },
      plot(){
          let angles = this.getCurrentAngleArray; //rad
          let times = this.getTimeArray;       //s
          let ang_vels = this.getCurrentAngularVelocityArray;  //rad/s
          let commands = this.getCommandArray;
          let drives = this.getDriveArray;
          let errors = this.getErrorArray;

          angles.forEach((angle, index) => {
              let data_object = {id: this.getNumData, t: parseFloat(times[index]), set: this.getDatasetIndex, theta: angle.toFixed(2), omega: ang_vels[index].toFixed(2), command: commands[index], drive: drives[index], error: errors[index]};
              this.$store.dispatch('addData', data_object);
          })
          

      },
      clearData(){
          this.$store.dispatch('clearAllData');
          this.setDatasetIndex(0);
      },
      toggleResetModal(){
          this.showResetConfirmModal = !this.showResetConfirmModal;
      },
      outputToCSV(){
        let data = this.$store.getters.getData;
        let current_dataset = 0;
        let csv = 'Time/s,Angle/rad,AngVel/rad/s,Command,Drive,Error\n';
        let date = new Date();

        data.forEach(function(d){
            if(d.set == current_dataset + 1){
                let hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
                hiddenElement.target = '_blank';
                hiddenElement.download = `spinner-${date.getHours()}-${date.getMinutes()}-run${current_dataset}.csv`;
                hiddenElement.click();

                csv = 'Time/s,Angle/rad,AngVel/rad/s,Command,Drive,Error\n';
                current_dataset += 1;
              }

              csv += d.t.toString();
              csv += ",";
              csv += d.theta.toString();
              csv += ',';
              csv += d.omega.toString();
              if(d.command != null){
                csv += ",";
                csv += d.command.toString();
              } else {
                csv += ",";
                csv += "";
              }
              if(d.drive != null){
                csv += ",";
                csv += d.drive.toString();
              } else{
                csv += ",";
                csv += "";
              }

              if(d.error != null){
                csv += ",";
                csv += d.error.toString();
              } else{
                csv += ",";
                csv += "";
              }    
              
              csv += "\n";
        });

        //output the final dataset
        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = `spinner-${date.getHours()}-${date.getMinutes()}-run${current_dataset}.csv`;
        hiddenElement.click();
    },
      
  }
}
</script>

<style scoped>

.error{
    border:thick solid red
}

.error:focus{
    border:thick solid red
}

.modal-show{
  display: block;
}

</style>