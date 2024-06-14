//Should popup as a modal on App mount if no consent is stored in localStorage or if consent is false - giving students another chance to change their mind. 
// Updates the consent_given variable in logging.js store and saves to localStorage.
//When a choice is made a UUID is generated and stored in logging.js store
//This will make the App.vue component no longer render the consent modal.

<template>
<transition name='fade'>
    <div class="modal" id='consent-modal' tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content text-start">
            <div class="modal-header">
              <h5 class="modal-title">Data Collection</h5>
            </div>
            <div class="modal-body">
                <p> With your consent, we will collect anonymous data on your interaction with the remote laboratory for quality control and research purposes. </p>
                <p>The availability of automated support via learning dashboards relies on the collection of this data.</p>
                
                <p>We collect data on your interaction with the user interface that includes an anonymous ID, timestamp and details of the interaction (e.g. button clicked).
                  No personally identifiable data is collected e.g. no name, email address or IP address.
                </p>

                <div class='row'>
                  <div class='col-8'>
                    <p><h4>Are you happy for this anonymous data to be collected?</h4></p>
                  </div>
                  <div class="d-flex flex-column col-4">
                    <button type="button" class="button-sm button-primary mb-2" id='consent-yes-button' aria-label="consent" @click="consent(true)">Yes</button>
                    <button type="button" class="button-sm button-danger" id='consent-yes-button' aria-label="do not consent" @click="consent(false)">No</button>
                  </div>
                </div>

                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id='consent-yes-button' @click="consent">Confirm</button>
                </div> -->
            </div>
            
          </div>
        </div>
      </div>
</transition>
</template>

<script>
import { mapGetters } from 'vuex';
export default {

  name: 'Consent',
  emits:['consentset'],
  data () {
    return {
        
    }
  },
  components: {
    
  },
  computed:{
     ...mapGetters([
         'getUsesLocalStorage',
     ])
  },
  watch:{
      
  },
  created(){
      
  },
  mounted(){
      

  },
  methods: {
      consent(set){
          this.$store.dispatch('setLoggingConsent', set);
          if(this.getUsesLocalStorage){
            const item = 'practable-consent'
            window.localStorage.setItem(item, set);
          }
          

          this.$emit('consentset');
          
      }
      
  }
}
</script>

<style scoped>
#consent-modal{
  display: block;
  
}

/* Important part */
.modal-dialog{
    overflow-y: initial !important
}
.modal-body{
    max-height: 80vh;
    overflow-y: auto;
}

</style>