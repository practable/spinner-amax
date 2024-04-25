//Updated to Vue3, removing eventBus implementation, instead nav bar emits up to App which then controls components and passes props to sibling components

<template>

<nav :class="getDarkTheme ? 'navbar navbar-light fixed-top navbar-expand-lg navbar-background' : 'navbar navbar-dark fixed-top navbar-expand-lg  navbar-background'" id='navbar'>
    <div class="container-fluid">
      <div class="navbar-brand">
        <img src="/images/practable-icon.png" width="30" height="30" alt="">
        {{labName}}
      </div>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="menudropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Menu
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" id='datarecordermenu' href="#" @click='toggleComponent("datarecorder")'>Data Recorder</a></li>
                    <li><a class="dropdown-item" id='graphmenu' href="#" @click='toggleComponent("graph")'>Graph</a></li>
                    <li><a class="dropdown-item" id='snapshotmenu' href="#" @click='toggleComponent("snapshot")'>Data Snapshot</a></li>
                    <li><a class="dropdown-item" id='tablemenu' href="#" @click='toggleComponent("table")'>Table</a></li>
                    <li><a class="dropdown-item" id='stopwatchmenu' href="#" @click='toggleComponent("stopwatch")'>Stopwatch</a></li>
                    <li><a class="dropdown-item" id='systemdiagramsmenu' href="#" @click='toggleComponent("systemdiagrams")'>System Diagrams</a></li>
                    
                  </ul>
              </li>

              <!-- <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="toolsdropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Tools
                  </a>
                  <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown2">
                    <li><a class="dropdown-item" id='rulermenu' href="#" @click='addTool("ruler")'>Ruler</a></li>
                    <li><a class="dropdown-item" id='protractormenu' href="#" @click='addTool("protractor")'>Protractor</a></li>
                  </ul>
              </li> -->

              <!-- <li class="nav-item">
                  <a class="nav-link" id='clearworkspacemenu' href="#" tabindex="-1" @click='clearWorkspace'>Clear Workspace</a>
              </li> -->

               <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="layoutdropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Layout
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown2">
                    <li><a class="dropdown-item" id='layoutsinglecolumn' href="#" @click='toggleLayout(1)'>Single Column</a></li>
                    <li><a class="dropdown-item" id='layout25:75' href="#" @click='toggleLayout(0.25)'>25%:75%</a></li>
                    <li><a class="dropdown-item" id='layout50:50' href="#" @click='toggleLayout(0.5)'>50%:50%</a></li>
                    <li><a class="dropdown-item" id= 'layout75:25' href="#" @click='toggleLayout(0.75)'>75%:25%</a></li>
                  </ul>
              </li>

              <li v-if='getIsLoggingOn' class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="settingsdropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Settings
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown2">
                    <li><a class="dropdown-item" id='toggleconsentbutton' href="#" @click='this.$emit("toggleconsent")'>Change consent</a></li>
                  </ul>
              </li>

              <li class="nav-item">
                  <a class="nav-link" >
                    UUID: {{ getLogUUID }}
                  </a>
                </li>

                <li class="nav-item">
                  <clock class='nav-link' />
                </li>

          </ul>

         
          <ul class="navbar-nav dropstart">
              
              <li class="nav-item me-1">
                  <toolbar parentCanvasID="" parentDivID="navbar" parentComponentName="navbar" :showDownload="false" :showOptions="false" :showPopupHelp="true">
                      <template v-slot:popup>
                        <h4>Customise the UI</h4>
                        <p>Dashed borders represent the slots for components. You can drag a component from one slot to another to switch their positions. You are best 
                            to click and drag just inside the border of the component you want to move and drop just inside the border of the slot you want to move to when the colour of the slot
                            changes.
                        </p>

                        <h4>Recording more than 5000 data points</h4>
                        <p>For smooth running of the web app there is a limit of 5000 recorded data points and 2000 data points on the Graph tool. Please download this dataset or perform the necessary analysis
                            and then reset the data and run again in order to collect more data. For collecting single data points over a long time you may be best to use the Snapshot tool which can continue to collect data beyond this limit.
                        </p>

                        <h4>Report issues</h4>
                        <p>If you have any problems with the remote laboratory then you can contact us at support@practable.io
                        </p>
                      </template>
                  </toolbar>
                </li>

              <li class="nav-item me-1">
                  <button type='button' class='button-toolbar button-secondary' id='download-button' @click='toggleTheme' :disabled="disableThemeButton" aria-label="dark theme toggle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-half" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 0 8 1zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16"/>
                    </svg>
                  </button>
              </li>

          </ul>

         

      </div>
    </div>
  </nav>

</template>

<script>

import Clock from "./Clock.vue";
import Toolbar from './elements/Toolbar.vue';
import { mapGetters } from 'vuex';


export default {

  name: 'NavigationBar',
  components: {
    Clock,
    Toolbar
  },
  props:{
      
  },
  emits:[
    'toggleconsent', 'togglelayout', 'togglegraph', 'toggledatarecorder', 'togglestopwatch', 'toggletable', 'togglesystemdiagrams', 'togglesnapshot', 'toggleworkspace', 'clearworkspace', 'addruler', 'addprotractor'
  ],
  data () {
    return {
      disableThemeButton: false,
    }
  },
  computed:{
    ...mapGetters([
      'getIsLoggingOn',
      'getLogUUID',
      'getDarkTheme',
      'getConfigJSON'
    ]),
      labName(){
        return this.getLabID == '' ? 'Spinner Lab': ('Spinner Lab: ' + this.getLabID);
      },
      getLabID(){
        let config = this.getConfigJSON;
        if(config.parameters != undefined){
          return config.name;
        } else{
          return '';
        }
      },
  },
  methods: {
      addTool(tool){
          this.toggleComponent('workspace');
          setTimeout(() => {this.$emit('add' + tool)}, 100);  //give the workspace time to initialise and then send tool event

      },
      toggleComponent(component){
          this.$emit('toggle' + component);

      },
      clearWorkspace(){
          this.$emit('clearworkspace');
      },
       toggleLayout(ratio){
        if(ratio == 0.25)
        {
          this.$emit('togglelayout', 0.25);
        }
        else if(ratio == 0.5)
        {
          this.$emit('togglelayout', 0.5);
        }
        else if(ratio == 0.75)
        {
          this.$emit('togglelayout', 0.75);
        }
        else 
        {
          this.$emit('togglelayout', 1);
        }
      },
      toggleTheme(){
          this.disableThemeButton = true;
          setTimeout(() => {
            this.disableThemeButton = false
          }, 1000);
          document.body.classList.toggle("dark-theme");
          this.$store.dispatch('setDarkTheme', document.body.classList.contains("dark-theme"));
      }
  }
}
</script>

<style scoped>


</style>