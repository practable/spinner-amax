// 17/09/24 Updated for use with new analytics server

const loggingStore = {
    state: () => ({
        uuid: '',
        isLoggingOn: false,                  //set for difference UI versions
        logging_consent_given: false,
        hardware: '',           //will be set from the LoggingStream.vue component 
        exp: 'spinner',         //hardcoded for this UI
        course: '',      //set from Streams.vue from a url query param
       }),
       mutations:{
            SET_LOGGING_CONSENT(state, consent){
                state.logging_consent_given = consent;
            },
            SET_UUID(state, uuid){
                state.uuid = uuid;
            },
            SET_EXPERIMENT(state, exp){
                state.exp = exp;
            },
            SET_HARDWARE(state, hardware){
                state.hardware = hardware;
            },
            SET_COURSE(state, course){
                state.course = course;
            }
       },
       actions:{
            setLoggingConsent(context, consent){
                context.commit('SET_LOGGING_CONSENT', consent);
            },
            setUUID(context, uuid){
                context.commit('SET_UUID', uuid);
            },
            setExperiment(context, exp){
                context.commit('SET_EXPERIMENT', exp)
            },
            setHardware(context, hardware){
                context.commit('SET_HARDWARE', hardware)
            },
            setCourse(context, course){
                context.commit('SET_COURSE', course)
            },
       },
       getters:{
           getLogConsent(state){
            return state.logging_consent_given;
            },
            getLogUUID(state){
                return state.uuid;
            },
            getExperiment(state){
                return state.exp;
            },
            getHardware(state){
                return state.hardware;
            },
            getCourse(state){
                return state.course;
            },
            getIsLoggingOn(state){
                return state.isLoggingOn;
            }
       },  
  
  }

  export default loggingStore;
