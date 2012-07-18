
// step1 -> step2 -> terminate

var swf = require('../index'),
    swfClient = swf.createClient();

var dt = new swf.DecisionTask(swfClient, JSON.parse(process.argv[2]) );

if( dt.has_workflow_just_started() ) {
   
   dt.schedule({
      "activityId": "step1",
      "activityType":{ "name":"hello-activity", "version":"1.0" },
      "input": "hello-activity",
      "taskList":{ "name":"aws-swf-tasklist" }
   }, function(err, results) {
      if(err) { console.error(err, results); return; }
      console.log("Step 1 scheduled !");
   });
   
}
else if( dt.has_activity_completed('step1') && !dt.is_activity_scheduled('step2')  ) {
   
   dt.schedule({
      "activityId": "step2",
      "activityType":{ "name":"hello-activity", "version":"1.0" },
      "input": "hello-activity",
      "taskList":{ "name":"aws-swf-tasklist" }
   }, function(err, results) {
       if(err) { console.error(err, results); return; }
       console.log("Step 2 scheduled !");
   });
   
}
else if( dt.has_activity_completed('step2')  ) {
   
   dt.complete_workflow_execution("finished !", function(err, result) {
      if(err) { console.error(err); return; }
      console.log("Workflow marked as finished !");
   });
   
}
else {

   dt.fail_workflow_execution("Don't know what to do...", "more debug infos....", function(err) {
      if(err) { console.error(err); return; }
      console.log("Workflow marked as failed !");
   });

}