//Store for variables that are common amongst multiple UI components. 


const uiStore = {
    state: () => ({
       isDataRecorderOn: false,    //is the Data Recorder element active
       isDraggable: true,
       usesLocalStorage: false,        //can only use localStorage if the browser allows it.
       config_json: '', 
       windowWidth: window.innerWidth,
       darkTheme: document.body.classList.contains('dark-theme') ? true : false

       }),
       mutations:{
         SET_DATA_RECORDER(state, set){
            state.isDataRecorderOn = set;
         },
         SET_DRAGGABLE(state, draggable){
            state.isDraggable = draggable;
         },
         SET_USES_LOCAL_STORAGE(state, set){
            state.usesLocalStorage = set;
         },
         SET_CONFIG_JSON(state, json){
            state.config_json = json;
         },
         SET_DARK_THEME(state, set){
            state.darkTheme = set;
         },
         SET_WINDOW_WIDTH(state, val){
            state.windowWidth = val;
         }
       },
       actions:{
         setDataRecorder(context, set){
            context.commit("SET_DATA_RECORDER", set);
         },
         setDraggable(context, draggable){
             context.commit('SET_DRAGGABLE', draggable);
         },
         setUsesLocalStorage(context, set){
            context.commit('SET_USES_LOCAL_STORAGE', set);
         },
         setConfigJSON(context, json){
            context.commit('SET_CONFIG_JSON', json);
         },
         setDarkTheme(context, set){
            context.commit('SET_DARK_THEME', set);
         },
         setWindowWidth(context, val){
            context.commit('SET_WINDOW_WIDTH', val);
         }
       },
       getters:{
         getIsDataRecorderOn(state){
            return state.isDataRecorderOn;
         },
         getDraggable(state){
             return state.isDraggable;
         },
         getUsesLocalStorage(state){
            return state.usesLocalStorage;
         },
         getConfigJSON(state){
            return state.config_json;
         },
         getDarkTheme(state){
            return state.darkTheme;
         },
         getAppVersion(state){
            return import.meta.env.VITE_APP_VERSION;
         },
         getWindowWidth(state){
            return state.windowWidth;
         },
         isMobile(state){
            if(state.windowWidth < 992){
               return true;
            } else{
               return false;
            }
         },
         
       },  
  
  }

  export default uiStore;
