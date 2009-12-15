FormErrorsAssistant = Class.create( ExampleAssistantBase, {
	fwl : {'launchToScene':'form'},
	setup : function($super){
		$super();
		this.emailAttr = {
			textFieldName: 'email', 
			modelProperty: 'value', 
			multiline: false,
			focus: true, 
			modifierState: Mojo.Widget.capsLock,
			limitResize: false, 
			holdToEnable: false, 
			focusMode: Mojo.Widget.focusInsertMode,
			textReplacement: false,
			changeOnKeyPress: true,
			maxLength: 30
		};
		
		this.passwordAttr = {
			textFieldName: 'password', 
			modelProperty: 'value', 
			multiline: false,
			modifierState:Mojo.Widget.capsLock,
			enterSubmits: true,
			limitResize: false, 
			holdToEnable: false, 
			focusMode: Mojo.Widget.focusSelectMode,
			changeOnKeyPress: true,
			textReplacement: false,
			maxLength: 30,
			requiresEnterKey: true
		};
		
		this.emailAddress = {value:""};
		this.password = {value:""};
		this.controller.setupWidget('wizard-email-address', this.emailAttr, this.emailAddress);
		this.controller.setupWidget('wizard-password', this.passwordAttr, this.password);
		this.signInButtonModel = {buttonClass:'primary', buttonLabel:$L('Sign In'), disabled:true};
		this.controller.setupWidget('create-account-button', {type: Mojo.Widget.activityButton}, this.signInButtonModel);
		this.emailField = this.controller.get('wizard-email-address');
		this.passwordField = this.controller.get('wizard-password');
		this.signInButton = this.controller.get('create-account-button');
		this.controller.listen('create-account-button', Mojo.Event.tap, this.signInHandler.bind(this));
		Mojo.Event.listen(this.emailField, Mojo.Event.propertyChange, this.handlePropertyChange.bindAsEventListener(this));
		Mojo.Event.listen(this.passwordField, Mojo.Event.propertyChange, this.handlePropertyChange.bindAsEventListener(this));
	},
	activate: function(result) {
		// Set focus on the email address
		this.emailField.mojo.focus();
	},
	handlePropertyChange: function(event) {
		// A character was entered.  Enable or disable the "Sign In" button based on valid data
		if (this.signInButtonModel.disabled &&  this.password.value.length > 0) {
			this.signInButtonModel.disabled = false;
			this.controller.modelChanged(this.signInButtonModel);
		} 
		else if (!this.signInButtonModel.disabled && (this.password.value.length == 0)) {
			this.signInButtonModel.disabled = true;
			this.controller.modelChanged(this.signInButtonModel);
		} 
		
		// If the password field has focus and Enter is pressed then simulate tapping on "Sign In"
		if (event && Mojo.Char.isEnterKey(event.originalEvent.keyCode)) {
			// If the submit button is enabled then create the account
			if (this.signInButtonModel.disabled == false) {
				this.passwordField.blur();
				this.signInHandler();
				Event.stop(event);
			} else {
				this.emailField.mojo.focus();
			}
		}
	},
	signInHandler: function() {
		// if the error message is already displayed then just make it invisible to avoid jumpiness
		if (this.controller.get('error_message').getStyle('display') != 'none') {
			this.controller.get('error_message').setStyle({visibility:'hidden'});
		} else {
			this.controller.get('error_message').hide();
			this.controller.get('error_message').setStyle({visibility:'visible'});
		}
		this.signInButtonModel.buttonLabel = $L('Signing In...');
		this.controller.modelChanged(this.signInButtonModel);
		this.signInButton.mojo.activate();
		// adding manual delay 
		setTimeout(this.showErrorDialog.bind(this), 500);
	},
	showErrorDialog: function() {
		this.controller.get('error_message').show();
		this.controller.get('error_message').setStyle({visibility:'visible'});
		this.signInButtonModel.buttonLabel = $L('Sign In');
		this.controller.modelChanged(this.signInButtonModel);
		this.signInButton.mojo.deactivate();
		this.passwordField.mojo.focus();
	}
});