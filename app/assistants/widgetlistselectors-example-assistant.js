WidgetlistselectorsExampleAssistant = Class.create( ExampleAssistantBase, {
	fwl : {'launchToScene':'listselector'},
	statuses: [               
		{label:$L('Away'), value:"away", secondaryIcon:'status-away'},
		{label:$L('Available'), value:"available" , secondaryIcon:'status-available'}, 
		{label:$L('Offline'), value:"offline", secondaryIcon:'status-offline'} ],
  	testChoices: 	[	
        {label:$L('SMS')},
		{label:$L('Send Message to...'), value:"Send Message to...", disabled:true },                                                                                        
		{label:$L('PHONE')},  
		{label:$L('408-555-1212 (m)'), value:"510-321-3123 (m)'), value" , disabled:true},
		{label:$L('AIM')},  
		{label:$L('Angie.Sparks'), value:"AIM - Angie.Sparks", secondaryIcon:'status-available' },   
		{label:$L('GTALK')},
		{label:$L('Sparks McGee'), value:"GTALK - Sparks McGee", secondaryIcon:'status-available' },
		{label:$L('WORK')},  
		{label:$L('angie@work.com'), value:"angie@work.com", icon:'gtalk' },   
		{label:$L('PERSONAL')},  
		{label:$L('angie@personal.com'), value:"angie@personal.com", icon:'exchange' },
		{label:$L('OTHER')},  
		{label:$L('angie@other.com'), value:"angie@other.com", icon:'palm' }],
	selectorsModel: {currentStatus: 'away', currentTransport: "Angie.Sparks"},
  setup : function($super) {
	$super();
	this.controller.setupWidget('exampleSelector1', {label: $L('Status'), choices: this.statuses, modelProperty:'currentStatus'}, this.selectorsModel);
	this.controller.setupWidget('exampleSelector2', {label: $L('Identity'), choices: this.testChoices, modelProperty:'currentTransport'}, this.selectorsModel);
  },
  selectorChanged: function(event) {
	
  }
});
