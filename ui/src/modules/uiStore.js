//Store for variables that are common amongst multiple UI components. 


const uiStore = {
    state: () => ({

       remoteLabVersion: '',
       isDataRecorderOn: false,    //is the Data Recorder element active
       isDraggable: true,
       
       isAchievementsAvailable: false, // remove achievements from the UI
       usesLocalStorage: false,        //can only use localStorage if the browser allows it.
       colour_index: 0,

       }),
       mutations:{
         SET_REMOTE_LAB_VERSION(state, version){
            state.remoteLabVersion = version;
         },
         SET_DATA_RECORDER(state, set){
            state.isDataRecorderOn = set;
         },
         SET_DRAGGABLE(state, draggable){
            state.isDraggable = draggable;
         },
         SET_USES_LOCAL_STORAGE(state, set){
            state.usesLocalStorage = set;
         },
         SET_COLOUR_INDEX(state, index){
            state.colour_index = index
         },
         

       },
       actions:{
         setRemoteLabVersion(context, version){
            context.commit("SET_REMOTE_LAB_VERSION", version);
         },
         setDataRecorder(context, set){
            context.commit("SET_DATA_RECORDER", set);
         },
         setDraggable(context, draggable){
             context.commit('SET_DRAGGABLE', draggable);
         },
         setUsesLocalStorage(context, set){
            context.commit('SET_USES_LOCAL_STORAGE', set);
         },
         updateColourIndex(context){
            let index = (context.state.colour_index + 1) % 6
            context.commit('SET_COLOUR_INDEX', index);
         },

       },
       getters:{
         getRemoteLabVersion(state){
            return state.remoteLabVersion;
         },
         getIsDataRecorderOn(state){
            return state.isDataRecorderOn;
         },
         getDraggable(state){
             return state.isDraggable;
         },
         getIsAchievementsAvailable(state){
            return state.isAchievementsAvailable;
         },
         getUsesLocalStorage(state){
            return state.usesLocalStorage;
         },
         getColourIndex(state){
            return state.colour_index;
         },
         
       },  
  
  }

  export default uiStore;
