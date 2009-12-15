DashboardAssistant = Class.create({
	
	initialize: function(messageText, date, template) {
		this.messageText = messageText;
		this.template = template;
		this.when = date;
		this.count = 1;
		this.reverse = false;
	},

	setup: function() {
		this.updateDisplay();
	},
	
	update: function(messageText, date, template) {
		this.messageText = messageText;
		this.when = date;
		this.template = template;
		this.count += 1;
		this.updateDisplay();
	},
	
	updateDisplay: function() {
		Mojo.Log.info('updating' + this.template);
		var props = {
			title: window.name,
			text: this.messageText, 
			when: this.when, 
			times: this.count == 1 ? $L("time") : $L("times"),
			count: this.count,
			template: this.template
		};
		var messageText = Mojo.View.render({object: props, template: 'dashboard/'+props.template});
		var messageDiv = this.controller.get('dashboard-template-content');
		Element.update(messageDiv, messageText);
		if(this.template == 'dashboard-custom-message'){
			//Mojo.Log.info('gpong to anitmate')
			//this.doAnimation();
			this.setupCustomDashboardListeners();
		}
	},
	
	setupCustomDashboardListeners: function(){
		this.controller.listen('happy', Mojo.Event.tap, this.emoticonButtonPress.curry('happy').bindAsEventListener(this));
		this.controller.listen('sad', Mojo.Event.tap, this.emoticonButtonPress.curry('sad').bindAsEventListener(this));
		this.controller.listen('what', Mojo.Event.tap, this.emoticonButtonPress.curry('what').bindAsEventListener(this));
		this.controller.listen('puckered', Mojo.Event.tap, this.emoticonButtonPress.curry('puckered').bindAsEventListener(this));
	},
	
	emoticonButtonPress: function(button,event){
		//grab the div for the button we want later
		var pressedButton = this.controller.get(button);
		var returnButtonFunction = this.returnButtonTooDash.curry(pressedButton).bind(this);
		Mojo.Log.info($L('You pressed ' + button));
		var messageDiv = this.controller.get('reflected_message');
		messageDiv.update( $L('You pressed ' + button));
		var buttons = this.controller.get('buttons');
		buttons.absolutize();
		Mojo.Animation.animateStyle(buttons, 'left', 'bezier', {
				from:0,
					to: 330,
					duration: 1,
					curve:'over-easy',
					onComplete: returnButtonFunction.bind(this)
					}
		);
		messageDiv.innerHTML = $L('You pressed ' + button);
		Mojo.Log.info(messageDiv.innerHTML);
	},
	
	returnButtonTooDash: function(pressedButton){
		pressedButton.absolutize();
		pressedButton.setStyle({'width':'70px','top':'-7px'});
		Mojo.Animation.animateStyle(pressedButton, 'left', 'bezier', {
				from:0,
					to: -140,
					duration: .5,
					curve:'over-easy'
					}
		);
		this.controller.stopListening(pressedButton, Mojo.Event.tap, this.emoticonButtonPress.curry('happy').bindAsEventListener(this));
		
	}
	
	// doAnimation:function() {
	// 	var pic = this.controller.get('testPhoto');
	// 	Mojo.Animation.animateStyle(pic, 'left', 'bezier', {
	// 			from:0,
	// 				to: -1180,
	// 				duration: 10,
	// 				curve:'over-easy',
	// 				reverse:this.reverse,
	// 				onComplete: this.doAnimation.bind(this)
	// 				}
	// 	);
	// 	this.reverse = !this.reverse;
	// }

});

