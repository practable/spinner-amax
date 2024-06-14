const config = {
    //Most likely leave the below as is:
    logging_path: 'analytics/logging/api/v1/addLog',
    definitions_path: 'analytics/logging/api/v1/verbs',

    //UPDATE this with your remote lab version
    remote_lab_ui: 'spinner-3.0',
    
    //Add any hotkeys that you want to log
    hotkeys: [
      'a',
      'd',
      'e'
    ],
    // If you include an object below, it will be sent on an interval
    interval_logs: [
      //{"interval": 10000, "payload": {"msg": "10 second health check", 'state': 6}},
      // {"interval": 30000, "payload": {"msg": "30 second health check"}}
    ]
}

export default config;