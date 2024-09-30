//vue3 update
//vastly streamlined

<template>
<div class="m-2 practable-component" id='motor-snapshot-div'>
    <div class="row justify-content-center align-items-center" >

        <table class="table">
            <tr>
                <th v-for='heading in headings' :key="heading" scope="col">{{heading}}</th>
            </tr>

            <tr v-for="row in snaps" :id="row.time" :key="row.time">
                <td v-for='key in Object.keys(row)' :key="key">{{row[key]}}</td>
            </tr>

            <tr>
                <td class='current'>{{getTime.toFixed(2)}}</td>
                <td class='current'>{{getCurrentAngle.toFixed(2)}}</td>
                <td class='current'>{{getCurrentAngularVelocity.toFixed(2)}}</td>
                <td class='current'>{{getCommand.toFixed(2)}}</td>
                <td class='current'>{{getDrive.toFixed(2)}}</td>
                <td class='current'>{{getError.toFixed(2)}}</td>
            </tr>
                            
        </table> 

	</div>


    <div class='d-grid gap-2 d-sm-block'>
        <button id="record-snapshot-button" type='button' class="button-xsm button-primary" @click="takeSnapshot">Record Snapshot</button>
        <button id="reset-snapshot-button" type='button' class="button-xsm button-warning" @click="toggleResetModal">Reset</button>
        <button id="download-snapshot-button" type='button' class="button-xsm button-secondary" @click="outputToCSV">Download Snapshots</button>
    </div>
    
    <div class="d-flex flex-row">
        <popup-help id="popup-help-snapshot">
            <template v-slot:header>
                <h5> Snapshot tool </h5>
            </template>
            <template v-slot:body>
                <div class='row mb-2'>
                    <div class='col'>
                        <p> Click 'Record Snapshot' to save the current state to the snapshot table. Every time you click a new data set will be added. Click 'Download Snapshots'
                            to download all the snapshots as a .csv file.
                        </p>
                    </div>
                </div>

            </template>
        </popup-help>
    </div>
    

    <div v-if='showResetConfirmModal' class="modal modal-show" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Reset Data</h5>
              <button type="button" class="btn btn-close" data-bs-dismiss="modal" aria-label="Close" @click='toggleResetModal'>
                
              </button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to Reset? This will clear all stored data.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="button-xsm button-danger" @click="resetSnaps(); toggleResetModal();">Reset</button>
              <button type="button" class="button-xsm button-secondary" data-dismiss="modal" data-bs-dismiss="modal" @click="toggleResetModal">Cancel</button>
            </div>
          </div>
        </div>
      </div>

</div>
</template>

<script>
import { mapGetters } from 'vuex';
import PopupHelp from './elements/PopupHelp.vue';

export default {
    name: 'MotorSnapshot',
    props:[
      'headings'
    ],
    components:{
        PopupHelp,
    },
    data(){
        return{
            snapshot_time: 0,
            snapshot_position: 0,
            snapshot_velocity: 0,
            snapshot_command: 0,
            snapshot_drive: 0,
            snapshot_error: 0,
            snaps: [],
            showResetConfirmModal: false
        }
    },
    computed:{
        ...mapGetters([
            'getTime',
            'getIsRecording',
            'getCurrentAngle',
            'getCurrentAngularVelocity',
            'getDarkTheme'
        ]),
        getError(){
            let error = this.$store.getters.getError;
            if(error == null){
                return 0;
            } else{
                return error;
            }
        },
        getDrive(){
            let drive = this.$store.getters.getDrive;
            if(drive == null){
                return 0;
            } else{
                return drive;
            }
        },
        getCommand(){
            let command = this.$store.getters.getCommand;
            if(command == null){
                return 0;
            } else{
                return command;
            }
        },


    },
    methods: {
        takeSnapshot(){
            this.snapshot_time = this.getTime;
            this.snapshot_position = this.getCurrentAngle;
            this.snapshot_velocity = this.getCurrentAngularVelocity;
            this.snapshot_command = this.getCommand;
            this.snapshot_drive = this.getDrive;
            this.snapshot_error = this.getError;
            
            let new_snap = {time: (this.snapshot_time).toFixed(2), position: (this.snapshot_position).toFixed(2), velocity: (this.snapshot_velocity).toFixed(2), command: (this.snapshot_command).toFixed(2), drive: (this.snapshot_drive).toFixed(2), error: (this.snapshot_error).toFixed(2)};
            this.snaps.push(new_snap);
            
            
        },
        resetSnaps(){
            this.snaps = [];
        },
        toggleResetModal(){
            this.showResetConfirmModal = !this.showResetConfirmModal;
        },
        outputToCSV(){
          let csv = '';
          let filename = '';
            let date = new Date();
            filename = 'SNAPSHOTs_' + date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString();
          
              csv = 'Time/s,Angle/rad,AngVel/rad/s,Command,Drive,Error\n';
            
            this.snaps.forEach(function(d){
                csv += d.time.toString();
                csv += ",";
                csv += d.position.toString();
                csv += ',';
                csv += d.velocity.toString();
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
            filename += '.csv';
          
          let hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = filename;
          hiddenElement.click();
      },
      },
      
}
</script>

<style scoped>

.current{
    border-top: 1px solid var(--background-color-inverted);
    border-bottom: 1px solid var(--background-color-inverted);
    color: green
}

.h-divider{
 margin-top:5px;
 margin-bottom:5px;
 height:1px;
 width:100%;
 border-top:1px solid gray;
}

.v-divider{
 margin-left:5px;
 margin-right:5px;
 padding: 0px;
 width:1px;
 height:100%;
 border-right:1px solid gray;
}

.modal-show{
    display: block;
}
</style>
