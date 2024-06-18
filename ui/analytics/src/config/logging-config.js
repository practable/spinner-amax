const config = {
    //Most likely leave the below as is:
    logging_path: 'analytics/logging/api/v1/addLog',
    definitions_path: 'analytics/logging/api/v1/verbs',

    //UPDATE this with your remote lab version
    remote_lab_ui: 'spinner-3.0',

    click_logs_on: true,
    mouse_enter_logs_on: false,
    
    //For generating graphs in the analytics system, you need to map the appropriate buttons (that send hardware commands to the lab) with the 
    // names of the nodes that will appear on the graph (or a coded name)
    graph_nodes: {
        "run-voltage-step": 'voltage_step',
        "run-voltage-ramp": 'voltage_ramp',
        "run-position-step": 'position_step',
        "run-position-ramp": 'position_ramp',
        "run-speed-step": 'speed_step',
        "run-speed-ramp": 'speed_ramp',
    },
    
    //Add any hotkeys that you want to log
    hotkeys: [
      'a',
      'd',
      'e'
    ],
    // If you include an object below, it will be sent on an interval
    interval_logs: [
      //{"interval": 5000, "payload": {"msg": "5 second health check", 'state': 6}},
      // {"interval": 30000, "payload": {"msg": "30 second health check"}}
    ]
}

export default config;