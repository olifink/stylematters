DashboardPanelsExampleAssistant = Class.create( ExampleAssistantBase, {
	fwl : {'launchToScene':'notify'},
	setup : function($super){
		$super();

		this.message = $L('Style Matters');

		this.controller.listen('dashboard-message', Mojo.Event.tap, this.notify.curry('dashboard-message').bindAsEventListener(this));
		this.controller.listen('dashboard-custom-message', Mojo.Event.tap, this.notify.curry('dashboard-custom-message').bindAsEventListener(this));
	},
	
	notify: function(custom,event) {
		var target = custom;

		var appController = Mojo.Controller.getAppController();
		this.controller.commitChanges();
		var bannerParams = {
			soundClass: '', 
			soundFile: '', 
			icon: '',
			messageText: this.message
		}
		appController.showBanner(bannerParams, {banner: this.message});
		var stageController = Mojo.Controller.getAppController().getStageController(this.kDashboardStageName);
		if (stageController) {
			stageController.delegateToSceneAssistant("update", this.message, new Date(), target);
		} else {
			this.notificationCreatedHandler = this.notificationCreated.bind(this, this.message, target);
			Mojo.Controller.getAppController().createStageWithCallback({name: this.kDashboardStageName, lightweight: true},
				this.notificationCreatedHandler, "dashboard");
		}
	},
	
	notificationCreated: function(text, template, stageController) {
		stageController.pushScene('dashboard', text, new Date(), template);
	},

	closeNotifications: function(event) {
		Mojo.Controller.getAppController().removeAllBanners();
		Mojo.Controller.getAppController().closeStage(this.kDashboardStageName);
	},
	
	kDashboardStageName: "stylematters-dashboard"
});