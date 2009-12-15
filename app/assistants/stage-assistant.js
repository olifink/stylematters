function StageAssistant(stageController) {	
	//store this stagecontroller into the app controller so that it can be used at relaunch
	var appControl = Mojo.Controller.getAppController();
	var appAssistant = appControl.assistant;
	appAssistant.mainstageController = stageController;
	
	var params = Mojo.getLaunchParameters();
	var sceneName = "list";
	if (!Mojo.Controller.appInfo.noWindow && !Mojo.Controller.isChildWindow(stageController.window)) {
		var appController = stageController.getAppController();
		
		
		stageController.pushScene({name: sceneName, id: 'list'});
		
		if(params && params.launchToScene){
			this.launchWithParams(params,stageController);
		}else{
			sceneName = new Mojo.Model.Cookie('sceneCookie').get();
			subSceneName = new Mojo.Model.Cookie('subSceneCookie').get();

			if (sceneName) {
				this.showScene(sceneName.name, stageController,sceneName.title,sceneName.description,sceneName.sceneTemplate);
			}
			if(subSceneName){
				this.showScene0(subSceneName.name, stageController, subSceneName.title, subSceneName.description, sceneName.name);
			}
		}

	}else if(params && params.launchToScene){
		stageController.popToScene(sceneName);
		this.launchWithParams(params,stageController);
		stageController.activate();
	}else{
		stageController.activate();
	}
}

StageAssistant.prototype.launchWithParams = function(params,stageController) {
	if(params.launchToScene.scene){
		this.showScene(params.launchToScene.scene.name, stageController,params.launchToScene.scene.title,params.launchToScene.scene.description,params.launchToScene.scene.sceneTemplate);
	}
	if(params.launchToScene.subScene){
		this.showScene0(params.launchToScene.subScene.name, stageController, params.launchToScene.subScene.title, params.launchToScene.subScene.description, params.launchToScene.subScene.name);
	}
};

//appcontroller launch,  use that too launch from another application

StageAssistant.prototype.setup = function() {
	Mojo.log("framework-library " + this.controller.window.name + " stage setup.");
};

StageAssistant.prototype.cleanup = function() {
	Mojo.log("framework-library " + this.controller.window.name + " stage closed.");
};

StageAssistant.prototype.showScene = function(sceneName, stageController, title, description, sceneTemplate) {
	stageController.pushScene({'name': sceneName, 'sceneTemplate': sceneTemplate }, $L(title), $L(description));  			
};

StageAssistant.prototype.showScene0 = function(sceneName, stageController, title, description) {
	stageController.pushScene({name: sceneName},$L(title), $L(description));
}



