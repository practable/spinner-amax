// To add: scrolling event log?
// To add: open and close workspace - should work with practable-component mutation
// To add: downloaded data - get from click download button?

<template>
  <div></div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios';
import config from '../config/logging-config'

export default {

  name: 'Logging',
  data () {
    return {
      course: '',                  //come from query param
      hardware: 'spinner',             //from query param - not yet implemented

      //required - get from URL params
      //FOR DEVELOPMENT - hardcoded
      instance_path: 'https://app.practable.io/ed-log-dev/',
      //for storing the elements that already have listeners attached
      input_listener_ids: [],
      
    }
  },
  computed:{
    ...mapGetters([
      'getLogUUID',
      'getSessionExpired',
      'getIsChatOn',
      'getMessages',
      'getNumMessages'
    ]),
    
  },
  watch:{
      //likely to have to watch here for logging URL to be obtained and then can enable logging?
      //Update the base logging URL
      getSessionExpired(expired){
          if(expired){
            this.createSessionExpiredLog();
          }
      },
      //INCLUDE THIS ONCE THE CHAT COMPONENT IS BACK IN
      // getNumMessages(){
      //   let messages = this.getMessages;
      //   let latest_message_level = messages[messages.length - 1].level;
      //     if(latest_message_level == 'WARN' || latest_message_level == 'ERROR' || latest_message_level == 'FATAL'){
      //       let log = this.createExperimentLog(messages[messages.length - 1]);
      //       this.sendLog(log);
      //     }
      // },

  },
  created(){
      
  },
  mounted(){
    window.addEventListener("DOMContentLoaded", (event) => {

      try {
        
        let query = new URLSearchParams(window.location.search);

        //ADD THIS BACK IN WHEN THESE ARE ADDED TO THE URL PARAMS
        // let la_auth = query.get('la');
        // let decoded_la_auth = decodeURIComponent(la_auth);
        // console.log(decoded_la_auth)

        // let la_host = query.get('lh');
        // this.instance_path = decodeURIComponent(la_host);

        //get course query parameter
        let course = query.get('course');
        if(course != null){
          this.course = course;
        } else{
          this.course = 'none';
        }

        //get hardware query parameter
        let hardware = query.get('hardware');
        if(hardware != null){
          this.hardware = hardware;
        } else{
          this.hardware = 'none';
        }

      } catch (e) {
          console.log("query params not found");
      }

      this.createAndSendSessionStartLog();   //will run everytime the component mounts

      //all click events are logged
      if(config.click_logs_on){
        window.addEventListener("click", (event) => {
              let log = this.createClickLog(event);
              this.sendLog(log);
          });
      }

      if(config.mouse_enter_logs_on){
        this.AddMouseEnterListeners();
      }
        
      
      this.AddNewInputListeners();
      this.AddHotkeyListener();
      this.AddDragDropListeners();

      config.interval_logs.forEach(log => {
            this.AddIntervalLog(log);
      });

      //needs to listen for DOM mutations when a new component is added and refresh to listen for any added inputs
      // Select the node that will be observed for mutations
      const targetNode = document.getElementById("component-grid");

      // Options for the observer (which mutations to observe)
      const config_mutations = { attributes: false, childList: true, subtree: true };

      // Callback function to execute when mutations are observed
      const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              if(node.querySelectorAll('input').length > 0) {
                  this.AddNewInputListeners();
              }

              if(node.classList.contains('practable-component')){
                this.createAndSendComponentOpenedLog(node);
              }
            }
          });

          mutation.removedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              if(node.querySelectorAll('input').length > 0) {
                  this.removeAllInputListeners();
                  this.AddNewInputListeners();
              }

              if(node.classList.contains('practable-component')){
                this.createAndSendComponentClosedLog(node);
              }
            }
          });
        }
      };
      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(callback);
      // Start observing the target node for configured mutations
      observer.observe(targetNode, config_mutations);
      })
    
  },
  methods: {
    AddNewInputListeners(){
      //should check if new inputs exists that are not in the input_listener_ids array and add if not
      document.querySelectorAll('input').forEach(el => {
          if(el.id != '' && !this.input_listener_ids.includes(el.id)){
            console.log(el.id)
            this.input_listener_ids.push(el.id);
            this.AddInputChangeListener(el.id)
          }
        })
    },
    removeAllInputListeners(){
      this.input_listener_ids.forEach(id => {
        let el = document.getElementById(id);
        if(el != null){
          el.removeEventListener("change", this.createAndSendInputLog)
        }
      })
      this.input_listener_ids = []
    },
    AddButtonClickListener(id){
      const btn = document.getElementById(id);
      if(btn != null){
          btn.addEventListener("click", (event) => {
              let log = this.createClickLog(event);
              this.sendLog(log);
          });
      } else{
        console.log(`Button ${id} NOT MOUNTED`)
      }
  },
  createAndSendInputLog(event){
      let log = this.createInputLog(event);
      this.sendLog(log);
  },
  AddInputChangeListener(id){
      const btn = document.getElementById(id);
      if(btn != null){
          btn.addEventListener("change", this.createAndSendInputLog);
      } else{
        console.log(`Input ${id} NOT MOUNTED`)
      }
  },
  createAndSendMouseEnterLog(event){
    let log = this.createMouseEnterLog(event);
    this.sendLog(log);
  },
  AddMouseEnterListeners(){
    const drag_divs = document.querySelectorAll('[id^="drop_"]');
      drag_divs.forEach(div => {
          div.addEventListener("mouseenter", this.createAndSendMouseEnterLog);
      })
  },
  AddDragDropListeners(){
      const drag_divs = document.querySelectorAll('[id^="drop_"]');
      drag_divs.forEach(div => {
          div.addEventListener("dragstart", (event) => {
              let log = this.createDragEventLog(event);
              this.sendLog(log);
          });

          div.addEventListener("drop", (event) => {
              let log = this.createDropEventLog(event);
              this.sendLog(log);
          });
      })
  },
  AddHotkeyListener(){
      window.addEventListener("keydown", (event) => {
        if(config.hotkeys.includes(event.key)){
          let log = this.createHotkeyLog(event);
          this.sendLog(log);
        }
          
      });
  },
  AddIntervalLog(log){
      setInterval(() => {
        this.sendLog(log.payload);
      }, log.interval)
  },
  createAndSendSessionStartLog(){
    let log = this.createSessionStartLog();
    this.sendLog(log);
  },
  createAndSendComponentOpenedLog(element){
    let log = this.createComponentOpenLog(element);
    this.sendLog(log);
  },
  createAndSendComponentClosedLog(event){
    let log = this.createComponentClosedLog(event);
    this.sendLog(log);
  },
  createSessionStartLog(){
    let log = {
        "timestamp": new Date().getTime(), 
        "level": "INFO",
        "type": "analytics", 
        "actor":
          {
            "id": this.getLogUUID,
            "course": this.course
          },
        "verb": 
          {
            "name": "session-started", 
            "definition": `${this.instance_path}${config.definitions_path}/session-started`
          }, 
        "object": 
          {
            "ui": config.remote_lab_ui
          },
        "context": 
          {
            
          }
      }

      return log;
  },
    createClickLog(event){
      let log = {
        "timestamp": new Date().getTime(), 
        "level": "INFO",
        "type": "analytics", 
        "actor":
          {
            "id": this.getLogUUID,
            "course": this.course
          },
        "verb": 
          {
            "name": "clicked", 
            "definition": `${this.instance_path}${config.definitions_path}/clicked`
          }, 
        "object": 
          {
            "id": event.target.id,
            "parent": event.target.parentNode ? event.target.parentNode.id : 'none',
            "ui": config.remote_lab_ui
          },
        "context": 
          {
            "event_type": event.type,
            "event_timestamp": event.timeStamp,
            "x": event.clientX, 
            "y": event.clientY
          }
      }

      return log;
    },
    createMouseEnterLog(event){
      let log = {
        "timestamp": new Date().getTime(), 
        "level": "INFO",
        "type": "analytics", 
        "actor":
          {
            "id": this.getLogUUID,
            "course": this.course
          },
        "verb": 
          {
            "name": "mouse-entered", 
            "definition": `${this.instance_path}${config.definitions_path}/mouse-entered`
          }, 
        "object": 
          {
            "id": event.target.id,
            "parent": event.target.parentNode.id,
            "ui": config.remote_lab_ui
          },
        "context": 
          {
            "event_type": event.type,
            "event_timestamp": event.timeStamp,
            "mouse-left": event.relatedTarget != null ? event.relatedTarget.id : ''
          }
      }

      return log;
    },
    createInputLog(event){
      let log = {
        "timestamp": new Date().getTime(), 
        "level": "INFO",
        "type": "analytics", 
        "actor":
          {
            "id": this.getLogUUID,
            "course": this.course
          },
        "verb": 
          {
            "name": "changed", 
            "definition": `${this.instance_path}${config.definitions_path}/changed`,
          }, 
        "object": 
          {
            "id": event.target.id,
            "parent": event.target.parentNode.id,
            "ui": config.remote_lab_ui,
            "value": event.target.type == "checkbox" || event.target.type == "radio" ? event.target.checked : event.target.value
          },
        "context": 
          {
            "event_type": event.type,
            "event_timestamp": event.timeStamp
          }
      }

      return log;
    },
    createHotkeyLog(event){
      let log = {
        "timestamp": new Date().getTime(), 
        "level": "INFO",
        "type": "analytics", 
        "actor":
          {
            "id": this.getLogUUID,
            "course": this.course
          },
        "verb": 
          {
            "name": "pressed-hotkey", 
            "definition": `${this.instance_path}${config.definitions_path}/pressed-hotkey`
          }, 
        "object": 
          {
            "id": event.key,
            "ui": config.remote_lab_ui
          },
        "context": 
          {
            "event_type": event.type,
            "event_timestamp": event.timeStamp,
            "previous_click": event.originalTarget.id
          }
      }

      return log;
    },
    createDragEventLog(event){
      let log = {
        "timestamp": new Date().getTime(), 
        "level": "INFO",
        "type": "analytics", 
        "actor":
          {
            "id": this.getLogUUID,
            "course": this.course
          },
        "verb": 
          {
            "name": "dragged-component", 
            "definition": `${this.instance_path}${config.definitions_path}/dragged-component`
          }, 
        "object": 
          {
            "id": event.target.id,
            "ui": config.remote_lab_ui
          },
        "context": 
          {
            "event_type": event.type,
            "event_timestamp": event.timeStamp,
          }
      }

      return log;
    },
    createDropEventLog(event){
      let log = {
        "timestamp": new Date().getTime(), 
        "level": "INFO",
        "type": "analytics", 
        "actor":
          {
            "id": this.getLogUUID,
            "course": this.course
          },
        "verb": 
          {
            "name": "dropped-component", 
            "definition": `${this.instance_path}${config.definitions_path}/dropped-component`
          }, 
        "object": 
          {
            "id": event.target.id,
            "ui": config.remote_lab_ui
          },
        "context": 
          {
            "event_type": event.type,
            "event_timestamp": event.timeStamp,
          }
      }

      return log;
    },
    //check details of this log
    createSessionExpiredLog(){
      let log = {
        "timestamp": new Date().getTime(), 
        "level": "INFO",
        "type": "analytics", 
        "actor":
          {
            "id": "system",
            "course": this.course
          },
        "verb": 
          {
            "name": "session-expired", 
            "definition": `${this.instance_path}${config.definitions_path}/session-expired`
          }, 
        "object": 
          {
            "id": '',
            "ui": config.remote_lab_ui
          },
        "context": 
          {
            
          }
      }

      return log;
    },
    createExperimentLog(message){
      let log = {
        "timestamp": new Date().getTime(), 
        "level": message.level,
        "type": "experiment", 
        "actor":
          {
            "id": this.hardware,    //need to ensure that Logging knows about hardware, probably from config file
            "course": this.course
          },
        "verb": 
          {
            "name": "experiment-error", 
            "definition": `${this.instance_path}${config.definitions_path}/experiment-error`
          }, 
        "object": 
          {
            "id": '',
            "ui": config.remote_lab_ui
          },
        "context": 
          {
            "msg": message.text
          }
      }

      return log;
    },
    createComponentOpenLog(element){
      let log = {
        "timestamp": new Date().getTime(), 
        "level": "INFO",
        "type": "analytics", 
        "actor":
          {
            "id": this.getLogUUID,
            "course": this.course
          },
        "verb": 
          {
            "name": "opened-component", 
            "definition": `${this.instance_path}${config.definitions_path}/opened-component`
          }, 
        "object": 
          {
            "id": element.id,
            "ui": config.remote_lab_ui
          },
        "context": 
          {
            
          }
      }

      return log;
    },
    createComponentClosedLog(element){
      let log = {
        "timestamp": new Date().getTime(), 
        "level": "INFO",
        "type": "analytics", 
        "actor":
          {
            "id": this.getLogUUID,
            "course": this.course
          },
        "verb": 
          {
            "name": "closed-component", 
            "definition": `${this.instance_path}${config.definitions_path}/closed-component`
          }, 
        "object": 
          {
            "id": element.id,
            "ui": config.remote_lab_ui
          },
        "context": 
          {
            
          }
      }

      return log;
    },
    sendLog(log){
      console.log(log)
        var accessURL = `${this.instance_path}${config.logging_path}?username=${this.getLogUUID}&course=${this.course}&hardware=${this.hardware}`; 
        axios
        .post(accessURL, 
              log, 
              { headers: 
                { 
                  'Content-Type': 'application/json'
                } 
        }).then((response) => {
            //console.log(response)
        })
        .catch((err) => console.log(err));
    },
    printLog(log){
      console.log(log)
    }
      
      
  }
}
</script>

<style scoped>


</style>