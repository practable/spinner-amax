//Store for variables that are common amongst multiple UI components. 


const smoothieStore = {
    state: () => ({
        chart_omega: null,
        canvas_omega: null,
        chart_theta: null,
        canvas_theta: null,
        y_min_vel: -400,
        y_max_vel: 400,
        y_min_pos: -1,
        y_max_pos: 10.0,
        y_speedmode_abs: 100,
        y_voltmode_abs: 400,
        millis_per_pixel: 10,
       }),
       mutations:{
        SET_CHART_THETA(state, chart){
            state.chart_theta = chart;
         },
         SET_CHART_OMEGA(state, chart){
            state.chart_omega = chart;
         },
         SET_CANVAS_THETA(state, canvas){
            state.canvas_theta = canvas;
         },
         SET_CANVAS_OMEGA(state, canvas){
            state.canvas_omega = canvas;
         },
         SET_Y_MIN_VEL(state, value){
            state.y_min_vel = value;
         },
         SET_Y_MAX_VEL(state, value){
            state.y_max_vel = value;
         },
         SET_Y_MIN_POS(state, value){
            state.y_min_pos = value;
         },
         SET_Y_MAX_POS(state, value){
            state.y_max_pos = value;
         },
         SET_MILLIS_PER_PIXEL(state, value){
            state.millis_per_pixel = value;
         },
         SET_SPEED_MODE_ABS(state, value){
            state.y_speedmode_abs = value;
         },
         SET_VOLT_MODE_ABS(state, value){
            state.y_voltmode_abs = value;
         }
       },
       actions:{
         setChartTheta(context, chart){
            context.commit('SET_CHART_THETA', chart);
         },
         setChartOmega(context, chart){
            context.commit('SET_CHART_OMEGA', chart);
         },
         setCanvasTheta(context, canvas){
            context.commit('SET_CANVAS_THETA', canvas);
         },
         setCanvasOmega(context, canvas){
            context.commit('SET_CANVAS_OMEGA', canvas);
         },
         setYMinVel(context, value){
            context.commit('SET_Y_MIN_VEL', value)
         },
         setYMaxVel(context, value){
            context.commit('SET_Y_MAX_VEL', value)
         },
         setYMinPos(context, value){
            context.commit('SET_Y_MIN_POS', value)
         },
         setYMaxPos(context, value){
            context.commit('SET_Y_MAX_POS', value)
         },
         setMillisPerPixel(context, value){
            context.commit('SET_MILLIS_PER_PIXEL', value)
         },
         setSpeedModeAbs(context, value){
            context.commit('SET_SPEED_MODE_ABS', value)
         },
         setVoltModeAbs(context, value){
            context.commit('SET_VOLT_MODE_ABS', value)
         }
       },
       getters:{
        getChartTheta(state){
            return state.chart_theta;
         },
         getChartOmega(state){
            return state.chart_omega;
         },
         getCanvasTheta(state){
            return state.canvas_theta;
         },
         getCanvasOmega(state){
            return state.canvas_omega;
         },
         getYMinVel(state){
            return state.y_min_vel;
         },
         getYMaxVel(state){
            return state.y_max_vel;
         },
         getYMinPos(state){
            return state.y_min_pos;
         },
         getYMaxPos(state){
            return state.y_max_pos;
         },
         getMillisPerPixel(state){
            return state.millis_per_pixel;
         },
         getSpeedModeAbs(state){
            return state.y_speedmode_abs;
         },
         getVoltModeAbs(state){
            return state.y_voltmode_abs;
         }
         
       },  
  
  }

  export default smoothieStore;
