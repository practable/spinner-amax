//Vue3 update

<template>
<div id='hardware-config-button'>
    <button type='button' class='button-toolbar button-secondary' id='config-toolbar-button' @blur="closeHelp" @click='openHelp' aria-label="hardware configuration popup button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wrench" viewBox="0 0 16 16">
            <path d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364zm13.37 9.019.528.026.287.445.445.287.026.529L15 13l-.242.471-.026.529-.445.287-.287.445-.529.026L13 15l-.471-.242-.529-.026-.287-.445-.445-.287-.026-.529L11 13l.242-.471.026-.529.445-.287.287-.445.529-.026L13 11z"/>
        </svg>
    </button>


    <transition name='fade'>
        <div v-if='popup_showing' class="modal" id='modal-show' tabindex="-1">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Hardware Configuration</h5>
                    <button type='button' :class="getDarkTheme ? 'btn-close' : 'btn-close btn-close-white'" id='close-button' aria-label="Close" @click='closeHelp'></button>
                </div>
                <div class="modal-body">
                    
                    <p>{{ getSpinnerID }}</p>
                    <p>{{ getSpinnerMass }}</p>
                    <p>{{ getSpinnerDiameter }}</p>
                    <p>{{ getSpinnerThickness }}</p>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="close-modal" @click="closeHelp">Close</button>
                </div>
            </div>
            </div>
        </div>
    </transition>

    
    
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {

  name: 'ShowHardwareConfigButton',
  props:{
      
  },
  data () {
    return {
        popup_showing: false,
    }
  },
  components: {
    
  },
  created(){
      
  },
  mounted(){
      

  },
  computed:{
    ...mapGetters([
        'getDarkTheme',
        'getConfigJSON'
      ]),
      getSpinnerID(){
        let config = this.getConfigJSON;
        if(config != '' && config.name != undefined){
          try{

            return `Spinner ID = ${config.name}`

          } catch(e){
            return 'Spinner ID unavailable'
          }
        } else{
          return 'Spinner ID unavailable';
        }
      },
      getSpinnerMass(){
        let config = this.getConfigJSON;
        if(config != '' && config.parameters != undefined){
          try{

            return `Disk mass = ${config.parameters.are[0].m}`

          } catch(e){
            return 'Disk mass unavailable'
          }
        } else{
          return 'Disk mass unavailable';
        }
      },
      getSpinnerDiameter(){
        let config = this.getConfigJSON;
        if(config != '' && config.parameters != undefined){
          try{

            return `Disk diameter = ${config.parameters.are[0].d}`

          } catch(e){
            return 'Disk diameter unavailable'
          }
        } else{
          return 'Disk diameter unavailable';
        }
      },
      getSpinnerThickness(){
        let config = this.getConfigJSON;
        if(config != '' && config.parameters != undefined){
          try{

            return `Disk thickness = ${config.parameters.are[0].t}`

          } catch(e){
            return 'Disk thickness unavailable'
          }
        } else{
          return 'Disk thickness unavailable';
        }
      }
  },
  watch:{
      
  },
  
  methods: {
      openHelp(){
          this.popup_showing = true;
      },
      closeHelp(){
        this.popup_showing = false;
      }
  }
}
</script>

<style>

#close-button{
    position:absolute;
    right:10px;
}

#popup-text{
    z-index: 999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>