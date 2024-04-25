//vue3 update

<template>
  <div id="app" class='container-fluid-sm m-0'>

    <!-- Components that do not conform to draggable grid -->
    <navigation-bar @toggleconsent="showConsentModal = true" @togglelayout="toggleLayout" @togglegraph="toggleGraph" @toggledatarecorder="toggleDataRecorder" 
            @togglesnapshot="toggleSnapshot" @togglestopwatch="toggleStopwatch" @toggleworkspace="addWorkspace" @toggletable="toggleTable" 
                    @togglesystemdiagrams="toggleSystemDiagrams" @clearworkspace="clearWorkspace" @addruler="rulerAdded = true" @addprotractor="protractorAdded = true"
                    />

      <consent v-if='showConsentModal && getIsLoggingOn' @consentset="closeConsentModal"/>

    <transition name='fade'>
      <div v-if='showLoadDataModal && !showConsentModal' class="modal" id='modal-show' tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Load data</h5>
              <button type="button" class="btn btn-close" aria-label="Close" @click='showLoadDataModal = false'>
                
              </button>
            </div>
            <div class="modal-body">
              <p> Your last recorded run of data has been saved.</p>
              <p>Data was saved on {{ saved_date }}. Do you want to load this previous data?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click="load">Load</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal" data-bs-dismiss="modal" @click='showLoadDataModal = false'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
      </transition>

      <div v-if="isWorkspaceOn">
          <workspace :protractorAdded="protractorAdded" :rulerAdded="rulerAdded"/>
        </div>

        <streams id='streams' />

<!-- Beginning of grid layout -->

      <!-- <div class='row' id='fixed-row'>
        <div class='col drop-area' id='fixed_drop' draggable='true' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
      </div> -->
<!-- Have a layout for desktop -->

      <div v-if='!isMobile' class='row' id='component-grid'>

          <div :class='leftClass' id='left-screen'>
            <div class='col drop-area' id='drop_0_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><webcam-stream id='webcam-stream' /></div>
            <div class='col drop-area' id='drop_1_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><data-recorder v-if='isDataRecorderOn' id='data-recorder' /></div>
            <div class='col drop-area' id='drop_2_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><motor-snapshot v-if='isSnapshotOn' id='snapshot' :headings="['Time/s', 'Angle/rad', 'Ang. Vel./rad/s', 'Command', 'Drive', 'Error']"/></div>
            <div class='col drop-area' id='drop_3_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><table-output v-if='isTableOn' id='table' :selected_point="selected_graph_point"/></div>
            <div class='col drop-area' id='drop_4_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><stopwatch v-if='isStopwatchOn' id='stopwatch'/></div>
          </div>

          <div :class='rightClass' id='right-screen'>
            <div class='col drop-area' id='drop_0_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><data-stream id='data-stream' /></div>
            <div class='col drop-area' id='drop_1_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><graph-output v-if='isGraphOn' id='graph' @newselectedgraphpoint="selectedGraphPoint"/></div>
            <div class='col drop-area' id='drop_2_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><system-diagrams v-if='isSystemDiagramsOn' id='system-diagrams' /></div>
            <div class='col drop-area' id='drop_3_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><instructions v-if='isWorkspaceOn' id='instructions' :isWorkspaceOn="isWorkspaceOn"/></div>
            <div class='col drop-area' id='drop_4_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"></div>
          </div>

      </div>


<!-- and a layout for mobile -->

      <div v-else class='row' id='component-grid'>
        <div class='col-12' id='full-screen'>
          <div class='col drop-area' id='drop_0_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><webcam-stream id='webcam-stream' /></div>
            <div class='col drop-area' id='drop_1_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><data-stream id='data-stream' /></div>
            <div class='col drop-area' id='drop_2_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><data-recorder v-if='isDataRecorderOn' id='data-recorder' /></div>
            <div class='col drop-area' id='drop_3_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><motor-snapshot v-if='isSnapshotOn' id='snapshot' :headings="['Time/s', 'Angle/rad', 'Ang. Vel./rad/s', 'Command', 'Drive', 'Error']"/></div>
            <div class='col drop-area' id='drop_4_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><graph-output v-if='isGraphOn' id='graph' @newselectedgraphpoint="selectedGraphPoint"/></div>
            <div class='col drop-area' id='drop_5_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><table-output v-if='isTableOn' id='table' :tableHeadings="['id', 'Time/s', 'Angle/rad', 'Ang. Vel./rad/s', 'Command', 'Drive', 'Error']" :selected_point="selected_graph_point"/></div>
            <div class='col drop-area' id='drop_6_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><stopwatch v-if='isStopwatchOn' id='stopwatch'/></div>
            <div class='col drop-area' id='drop_7_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter='dragEnter' @dragleave="dragLeave"><system-diagrams v-if='isSystemDiagramsOn' id='system-diagrams' /></div>
        </div>
      </div>


        
      </div>
</template>

<script>
import WebcamStream from "./components/WebcamStream.vue";
import DataStream from "./components/DataStream.vue";
import GraphOutput from "./components/GraphOutput.vue";
import TableOutput from "./components/TableOutput.vue";
import Stopwatch from "./components/Stopwatch.vue";
import Workspace from "./components/Workspace.vue";
import DataRecorder from "./components/DataRecorder.vue";
import NavigationBar from "./components/NavigationBar.vue"; 
import SystemDiagrams from "./components/SystemDiagrams.vue";
import MotorSnapshot from "./components/MotorSnapshot.vue";
import Instructions from "./components/Instructions.vue";
import Streams from './components/Streams.vue';
import Consent from './components/Consent.vue';

import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    WebcamStream,
    DataStream,
    GraphOutput,
    TableOutput,
    Stopwatch,
    Workspace,
    DataRecorder,
    NavigationBar,
    SystemDiagrams,
    Streams,
    MotorSnapshot,
    Instructions,
    Consent,
  },
  data() {
   return {
      isTableOn: false,
      isGraphOn: false,
      isStopwatchOn: false,
      isWorkspaceOn: false,
      isAutoCommandOn: false,
      isDataRecorderOn: false,
      isSystemDiagramsOn: false,
      isSnapshotOn: false,
      protractorAdded: false,
      rulerAdded: false,
      disableTooltips: false,             //global tooltip setting
      showLoadDataModal: false,
      showConsentModal: true,
      saved_date: '',
      selected_graph_point: null,
      leftClass: 'col-lg-6',
      rightClass: 'col-lg-6' 
      
    }
  },
  created(){  
    this.$store.dispatch('setDataRecorder', this.isDataRecorderOn);    
    this.$store.dispatch('setUsesLocalStorage', this.hasStorage());
    this.updateUUID();
    this.checkConsent();
  },
  mounted(){
    if(this.getUsesLocalStorage && this.hasDataToLoad()){
      this.saved_date = JSON.parse(window.localStorage.getItem('dateSavedSpinningDisk'));
      this.showLoadDataModal = true;
    } else{
      this.showLoadDataModal = false;
    }
      window.addEventListener('pagehide', () => {this.saveDataToLocalStorage()});				//closing window
      window.addEventListener('beforeunload', () => {this.saveDataToLocalStorage()});			//refreshing page, changing URL

  },
  watch:{
    
  },
  computed:{
    ...mapGetters([
			'getDraggable',
      'getUsesLocalStorage',
      'getIsLoggingOn',
      'getLatestDatasetIndex'
		]),
    isMobile(){
      if(window.screen.width < 992){
        return true;
      } else{
        return false;
      }
    }
  },
  methods: {
    dragComponent(event){
        event.dataTransfer.effectAllowed = 'move';
         let element = event.target;
         if(element.classList.contains('drop-area')){
           if(element.childNodes[0] != null){
              event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
           } else{
              event.dataTransfer.setData("text/html", element.id + "|" + 'empty');
           }
            
         } else{
           while(element.parentNode){
              element = element.parentNode;
              if(element.classList.contains('drop-area')){
                if(element.childNodes[0] != null){
                  event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
              } else{
                  event.dataTransfer.setData("text/html", element.id + "|" + 'empty');
              }
                break;
              }
            }
         }
    },
    dropComponent(event){
      event.preventDefault();
      event.stopPropagation();
      let dropData = event.dataTransfer.getData('text/html');
      let dropItems = dropData.split("|");
      let draggedZone = document.getElementById(dropItems[0]);
      let droppedElement = document.getElementById(event.target.id);
      let draggedID = dropItems[1];
      
      // only try if the dragged element is not empty
      if(draggedID != 'empty' && document.getElementById(draggedID) != null){
          if(droppedElement != null && droppedElement.classList.contains('drop-area')){
            if(event.target.childNodes.length > 0){
              draggedZone.appendChild(event.target.childNodes[0]);
            }
            console.log(draggedID);
            droppedElement.appendChild(document.getElementById(draggedID));
            droppedElement.classList.remove('drop-area-highlighted');
        } 
        else if(droppedElement){
          let element = droppedElement;
          while(element.parentNode){
            element = element.parentNode;
            if(element.classList.contains('drop-area')){
              console.log(element.childNodes[0]);
              draggedZone.appendChild(element.childNodes[0]);
              element.appendChild(document.getElementById(draggedID));
              element.classList.remove('drop-area-highlighted');
              break;
            }
          }
        }
      }
      
      return false;
    },
    dragEnter(event){
      let dropData = event.dataTransfer.getData('text/html');
      let dropItems = dropData.split("|");
      let draggedID = dropItems[1];
      if(draggedID != 'empty' && document.getElementById(draggedID) != null){
        let element = document.getElementById(event.target.id);
        if(element != null && element.classList.contains('drop-area')){
          element.classList.add('drop-area-highlighted');
        }
      }
    },
    dragLeave(event){
      let element = document.getElementById(event.target.id);
      if(element != null){
        element.classList.remove('drop-area-highlighted');
      }
    },
    selectedGraphPoint(point){
      this.selected_graph_point = point;
    },
    addWorkspace(){
      this.isWorkspaceOn = true;
    },
    toggleGraph(){
      this.isGraphOn = !this.isGraphOn;
      //graph requires the data recorder in order to plot data so automatically add it when graph added - don't automatically remove it.
      if(this.isGraphOn){
        if(!this.isDataRecorderOn){
          this.toggleDataRecorder();
        }
      }
    },
    clearWorkspace(){
      this.isWorkspaceOn = false;
      this.rulerAdded = false;
      this.protractorAdded = false;
    },
    toggleDataRecorder(){
      this.isDataRecorderOn = !this.isDataRecorderOn;
      if(this.isDataRecorderOn){
        this.$store.dispatch('setDataRecorder', true);
      } else{
        this.$store.dispatch('setDataRecorder', false);
      }
      
    },
    toggleStopwatch(){
      this.isStopwatchOn = !this.isStopwatchOn;
    },
    toggleTable(){
      this.isTableOn = !this.isTableOn;
      if(this.isTableOn){
        if(!this.isDataRecorderOn){
            this.toggleDataRecorder();
        }
      }
    },
    toggleInputGraph(){
      this.isInputGraphOn = !this.isInputGraphOn;
    },
    toggleSystemDiagrams(){
      this.isSystemDiagramsOn = !this.isSystemDiagramsOn;
    },
    toggleSnapshot(){
      this.isSnapshotOn = !this.isSnapshotOn;
      if(this.isSnapshotOn){
        if(!this.isDataRecorderOn){
          this.toggleDataRecorder();
        }
      }
    },
    toggleLayout(ratio){
      if(ratio == 0.25){
        this.leftClass = 'col-lg-3';
        this.rightClass = 'col-lg-9';
      } else if(ratio == 0.5){
        this.leftClass = 'col-lg-6';
        this.rightClass = 'col-lg-6';
      } else if(ratio == 0.75){
         this.leftClass = 'col-lg-9';
        this.rightClass = 'col-lg-3';
      } else{
         this.leftClass = 'col-lg-12';
        this.rightClass = 'col-lg-12';
      }
    },
    // =================== LOCAL STORAGE LOADING AND SAVING DATA, CHECKLIST AND ACHIEVEMENTS =========================
    load(){
      this.loadFromLocalStorage();
      this.showLoadDataModal = false;
    },
    hasStorage(){
        try {
            window.localStorage.setItem('test', 'storage');
            window.localStorage.removeItem('test');
            return true;
        } catch (exception) {
            return false;
          }
      },
    hasDataToLoad(){
        if(window.localStorage.getItem('savedDataSpinningDisk')){

          return true;

        } else{

          return false;

        }
    },
     loadFromLocalStorage(){
        if(this.getUsesLocalStorage){
          this.loadData();

          return true;

        } else{
            console.log('no local storage');
            return false;
        }
          
      },
      loadData(){
        if(window.localStorage.getItem('savedDataSpinningDisk')){
          let data = window.localStorage.getItem('savedDataSpinningDisk');
          data = JSON.parse(data);
          this.$store.dispatch('clearAllData');
          for(let i=0; i<data.length;i++){
              this.$store.dispatch('addData', data[i]);
          }
          
          //ensure that the dataset index is updated since data has been loaded
          let latest_index = this.getLatestDatasetIndex;
          console.log(latest_index);
          this.$store.dispatch('setDatasetIndex', latest_index + 1);

        }
        
      },
      saveDataToLocalStorage(){
         if(this.getUsesLocalStorage){
            this.saveData();
            return true;
         } else{
            console.log('no localStorage allowed or uuid has been cleared');
            return false;
         }
      },
      saveData(){
        if(this.$store.getters.getNumData > 0){
          let data_json = JSON.stringify(this.$store.getters.getData);
          window.localStorage.setItem('savedDataSpinningDisk', data_json);
          let date = JSON.stringify(new Date());
          window.localStorage.setItem('dateSavedSpinningDisk', date);
        }
      },
      updateUUID(){
        let stored_uuid;
        if(this.getUsesLocalStorage){
          stored_uuid = window.localStorage.getItem('userName');    //userName is set by practable booking system
        } else {
          stored_uuid = null;
        }
        
        if(stored_uuid){
            this.$store.dispatch('setUUID', stored_uuid);
        } else{
          this.$store.dispatch('setUUID', 'null');
        }
      },
      checkConsent(){
        let logging_consent;
        if(this.getIsLoggingOn){
            if(this.getUsesLocalStorage){
                const item = 'practable-consent'
                logging_consent = window.localStorage.getItem(item);
            } else {
                logging_consent = null;
            }
            
            if(logging_consent == null || logging_consent == 'false'){
                this.showConsentModal = true;
            
            } else{
                this.showConsentModal = false;
                this.$store.dispatch('setLoggingConsent', (logging_consent === 'true'));
            }
        } else{
            this.$store.dispatch('setLoggingConsent', false);
            this.showConsentModal = false;

            if(this.getUsesLocalStorage){
                const item = 'practable-consent'
                window.localStorage.setItem(item, false);
            }
        }
      },
      closeConsentModal(){
        this.showConsentModal = false;
      }
  },
}


</script>

<style>


</style>
