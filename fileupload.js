//Last Updated: 2013-07-22
(function($){
	
	"use strict";

	function FileUpload(el, options) {
		//Defaults:
		this.defaults = {
			url: "",
			progressbar: false,
			stylize: false,
			maxFileSize: 10, //in MB,
			minFileSize: 0,
			allowedFileTypes: '*',
			previewImageBeforeUpload: false,
			useXhr2WhenSupported: true,
			error: false,
			callback: false,
			onSuccess: false,
			hiddencallback: false,
			hiddencallbackfield: 'PHP_UPLOAD_CALLBACK_FIELD',
			//Shows uploadSuccessMsg If no callback
			uploadSuccessMsg: '<span class="uploadSuccessMsg">Your file has been successfully uploaded. <a href="#" class="uploadAgainLink">Upload Again</a></span>',
			fileTooLargeMsg: 'Your file is too large. Please upload a file no larger than the specified size.',
			fileTooSmallMsg: 'Your file is too small. Please upload a file larger than the specified size.',
			fileTypeNotAllowedMsg: 'Your file is not in one of the accepted formats.',
			multipleFilesMsg: 'Please only choose one file to upload.',
			CE70Error: 'Your upload cannot be completed at this time. Please try again later or try using another browser to upload again.',
			deviceNotSupportedMsg: 'Sorry, but it looks like your device doesn’t support posting files to our site.',
			mobileDetect: false,
			onBeforeUpload: false,
			setGlobalFileUpload: false
			
		};

		//Extending options:
		this.opts = $.extend({}, this.defaults, options);

		//Privates:
		this.$el = $(el);
		this.started = false;
		this.randChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		this.randStringLength = 18;
		this.uploadFinished = [];
		this.initialized= [];
		this.disallowedElementInForm = 'label,span,p,em,strong,b,br,i,u,blockquote,textarea,center,dd,address,button,fieldset,object,sup,sub,big,code,font,img,input,map,q,s,samp,select,small,strike,tt,var,a,h1,h2,h3,h4,h5,caption';
		
	}

	// Separate functionality from object creation
	FileUpload.prototype = {

		settings: function(){
			return this.opts
			},
		//Initialize File Upload
		init: function() {
			var _this = this;
						
			if($.inArray(this.$el,this.initialized) !== -1){
				return;
				}
				
			if($("link[href*='fileupload_keyframes.css']").length == 0){
				$('<link rel="stylesheet" type="text/css" href="https://0da60bded15fd7273900-c3b572a873829e347e4db4dadf512257.ssl.cf1.rackcdn.com/ClassObjects/resources/fileupload/fileupload_keyframes.css" />').appendTo('head');
			
				}
			
			if(this.opts.mobileDetect !== false){
				
				var _mobileSupported = this.mobileSupportDetect();
				
					if(typeof this.opts.mobileDetect == 'function' && !/^function[^{]+\{\s*\}/m.test(this.opts.mobileDetect.toString())){
						
						this.opts.mobileDetect(_mobileSupported);
						
					}else if(!_mobileSupported){
						
						this.errorCallback(this.opts.deviceNotSupportedMsg);
						
						}
					
					if(_mobileSupported === false)return;
				
				}
			  
			if(this.objectSize(this.opts.stylize) > 0){
				this.stylize();
				}
			
			this.bindFileField();
			this.initialized.push(this.$el);

		},
		
		//Detects If Mobile Device Supports File Upload
		
		mobileSupportDetect: function(){
			
			return (function () {
				
			if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7.5|8.0)|(Skyfire)|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|Pre\/1.2|Kindle\/(1.0|2.0|2.5|3.0))/)) {
  					 return false;
				}
					 
				var el = document.createElement("input");
				el.type = "file";
			    return !el.disabled;
			})();
		},
		
		//Detects Mobile Browser
		
		onMobileDevice: function(){
			
			var _userAgent = navigator.userAgent||navigator.vendor||window.opera;
			
			return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(_userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(_userAgent.substr(0,4));
			
		},
		
		//Creates Hidden Form
		
		createUploadForm: function(_uploadId){
			
			var _fileId = 'UploadFile' + _uploadId;
		    var _formId = 'UploadForm' + _uploadId;
		    
			
			if(!this.$el.prop('name'))alert("File field requires name parameter.");
			
			var _newHiddenInput1 = '<input type="hidden" name="PHP_UPLOAD_FIELD" value="'+ this.$el.prop('name') +'" />';
			var _newHiddenInput2 = '<input type="hidden" name="PHP_SESSION_UPLOAD_PROGRESS" value="'+ _uploadId +'" />'
			
			if(this.$el.parents("form").length == 0){
				var _form = $('<form method="POST" id="' + _formId + '" enctype="multipart/form-data" encoding="multipart/form-data"></form>');	
				this.$el.parentsUntil(":not('"+this.disallowedElementInForm+"')").wrap(_form);
				this.$el.parents('form')
				.prepend(_newHiddenInput1)
				.prepend(_newHiddenInput2);
			}else{
					var _parentForm = this.$el.parents("form");
					this.$el.parents("form")
					.data('id',_parentForm.prop('id'))
					.data('enctype',_parentForm.prop('enctype'))
					.data('encoding',_parentForm.prop('encoding'))
					.data('action',_parentForm.prop('action'))
					.data('target',_parentForm.prop('target'))
					.data('method',_parentForm.prop('method'))
					.attr('id',_formId)
					.attr('enctype','multipart/form-data')
					.attr('encoding','multipart/form-data')
					.prepend(_newHiddenInput1)
					.prepend(_newHiddenInput2);
			}
			
			return $("#"+_formId);
			
		},
		
		//Creates iFrame
		
		createUploadIframe: function(_uploadId)
	{
		   var _frameId = 'UploadFrame' + _uploadId;
		   var _newIframe = $('<iframe name="'+_frameId+'" />'); 
		   _newIframe.prop("id",_frameId)
		   			 .prop("src", 'javascript'.concat(':false;'))
		   			 .css({"position": "absolute", "top":"-1000px", "left":"-1000px"});
           _newIframe.appendTo("body");
            return $("#"+_frameId);			
    },
		
		//Initialize Progress Bar
		
		createProgressBar: function(_uploadId,_xhr2,_iframe){
						
			var _ProgressBarId = 'progess-bar'+_uploadId;
				var _ProgressBarHTML = $('<div id="'+_ProgressBarId+'" class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar" style="width:0%;"></div></div>');
			
			if(this.opts.progressbar.width)_ProgressBarHTML.css("width",this.opts.progressbar.width+'px');
			if(this.opts.progressbar.height)_ProgressBarHTML.css("height",this.opts.progressbar.height+'px');
			
			if(this.$el.parents('label.stylize').length>0){
				this.$el.parents('label.stylize').after(_ProgressBarHTML);	
				}else{
					this.$el.after(_ProgressBarHTML);	
					}
			
			
			var _progressBar = $('#'+_ProgressBarId);
			
			if(this.$el.parents('label.stylize').length > 0){
				
				this.$el.parents('label.stylize').hide();
				
				}else{
				this.$el.hide();
				}
				
			if(this.opts.progressbar.stripSpeed){
				_progressBar.children().css("-webkit-animation", "progress-bar-stripes "+this.opts.progressbar.stripSpeed+"s linear infinite")
									.css("-moz-animation", "progress-bar-stripes "+this.opts.progressbar.stripSpeed+"s linear infinite")
									.css("-ms-animation", "progress-bar-stripes "+this.opts.progressbar.stripSpeed+"s linear infinite")
									.css("-o-animation", "progress-bar-stripes "+this.opts.progressbar.stripSpeed+"s linear infinite")
									.css("animation", "progress-bar-stripes "+this.opts.progressbar.stripSpeed+"s linear infinite");
			}
			
			if(this.opts.progressbar.moveSpeed){
				_progressBar.children().css("-webkit-transition", "width "+this.opts.progressbar.moveSpeed+"s ease")
									.css("-moz-transition", "width "+this.opts.progressbar.moveSpeed+"s ease")
									.css("-o-transition", "width "+this.opts.progressbar.moveSpeed+"s ease")
									.css("transition", "width "+this.opts.progressbar.moveSpeed+"s ease");
			}
			
			if(this.opts.progressbar.barImage){
				_progressBar.children().css("background-image", "-webkit-gradient(linear, 0 100%, 100% 0, color-stop(0.25, rgba(255, 255, 255, 0.15)), color-stop(0.25, transparent), color-stop(0.5, transparent), color-stop(0.5, rgba(255, 255, 255, 0.15)), color-stop(0.75, rgba(255, 255, 255, 0.15)), color-stop(0.75, transparent), to(transparent)), url("+this.opts.progressbar.barImage+")")
									.css("background-image", "-webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent), url("+this.opts.progressbar.barImage+")")
									.css("background-image", "-moz-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent), url("+this.opts.progressbar.barImage+")")
									.css("background-image", "-o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent), url("+this.opts.progressbar.barImage+")")
									.css("background-image", "linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent), url("+this.opts.progressbar.barImage+")");
			}
			
			if(this.opts.progressbar.barColor){
				
				_progressBar.children().css("background-color", this.opts.progressbar.barColor);
				
			}
			
	
		
			
			var _uploadProgressId = _uploadId;	
			var _uploadProgressBar = _progressBar;	
			var _uploadProgressiFrame = _iframe;
			var fileUploadFunction = this;
			
			if(_xhr2){
				
				return _progressBar;
				
			}else{
		 		setTimeout(function () {
         	 	   fileUploadFunction.updateProgress(_uploadProgressId,_uploadProgressBar, _uploadProgressiFrame);
     	  	   }, 1000);	
			}
			
			return _progressBar;	
	
		
		},
		
		//Updates Progress Until Finished

		updateProgress: function(_uploadId,_progressBar,_iframe){
						
			var _time = new Date().getTime();
           	var fileUploadFunction = this;
			var _uploadProgressId = _uploadId;	
			var _uploadProgressBar = _progressBar;
			var _uploadProgressiFrame = _iframe;
			if($.inArray(_uploadId, this.uploadFinished) !== -1){
				return;
				}
   			
			$.get(this.opts.progressbar.url, { uid: _uploadId, t: _time }, function (data) {
						 
        			var progress = parseInt(data, 10);
					var previousProgress = parseInt(_progressBar.attr('aria-valuenow'), 10);
					
					if(progress < previousProgress && $("body").find(_iframe).length>0)fileUploadFunction.removeUpload(_progressBar);
 
        			if (progress < 100) {
 			
		 				setTimeout(function () {
         	   				 fileUploadFunction.updateProgress(_uploadProgressId,_uploadProgressBar,_uploadProgressiFrame);
     	     			}, 1000);	
     	  		 	}
 
       			 if(_progressBar && _progressBar.length>0){
					 
						 _progressBar.attr("aria-valuenow",progress).children().css("width",progress+"%");

					 }
 
  			  });
			
		},
		
		
		
		//Handles Callback
		uploadCallback : function (_iframe,_form,_uploadId,_progressBar,_xhr2data){			
			
			 if(_uploadId)this.uploadFinished.push(_uploadId);	
			 if(_iframe)var _callbackData = $.trim(_iframe.contents().find("body").html());
			 if(_xhr2data)var _callbackData = $.trim(_xhr2data);
			 if(_progressBar)_progressBar.remove();
			 if(_iframe)_iframe.off("load");
		  	 if(_iframe)_iframe.remove();
			 			
			 if(_form){
				 _form
				 .attr('action',_form.data('action'))
				 .attr('method',_form.data('method'))
				 .attr('enctype',_form.data('enctype'))
				 .attr('encoding',_form.data('encoding'))
				 .attr('target',_form.data('target'))
				 .attr('id',_form.data('id'));
			 }
				
			$("input[type=hidden][name=PHP_UPLOAD_FIELD]").remove();
			$("input[type=hidden][name=PHP_SESSION_UPLOAD_PROGRESS]").remove();
			
			 try{
				 _callbackData = jQuery.parseJSON(_callbackData);
			  }catch(e){
				
			     try{
			        eval( "_callbackData = " + _callbackData );
						
					}catch(e){
						
					_callbackData = '';
			  	 }
		    	}
  
			if(_callbackData == '' || typeof(_callbackData) == 'undefined' || _callbackData == null){
				this.errorCallback(this.opts.CE70Error, _callbackData);
				return;
			}else if(typeof(_callbackData.error) != 'undefined' && _callbackData.error != ''){
				this.errorCallback(_callbackData.error, _callbackData);
				return;
			}
			
			if(this.opts.hiddencallback.length > 0){
				this.opts.hiddencallback.val(_callbackData.filename);
			}else{
					if(this.$el.parents('form').find("input[type=hidden][name="+this.opts.hiddencallbackfield+"]").length == 0){
						this.$el.parents('form').prepend($('<input type="hidden" name="'+this.opts.hiddencallbackfield+'" />').val(_callbackData.filename));
					}else{
						this.$el.parents('form').find("input[type=hidden][name="+this.opts.hiddencallbackfield+"]").val(_callbackData.filename);
					}
			}
			
  			if(this.opts.onSuccess && !/^function[^{]+\{\s*\}/m.test(this.opts.onSuccess.toString()) && typeof this.opts.onSuccess == 'function'){
				this.opts.onSuccess(this.$el);
			}
			
			this.$el.val('');
			this.$el.wrap('<form>').closest('form').get(0).reset();
			this.$el.unwrap();
  
  
  			if(this.opts.callback && !/^function[^{]+\{\s*\}/m.test(this.opts.callback.toString()) && typeof this.opts.callback == 'function'){
				
				this.opts.callback( _callbackData, this.$el, this.opts);
				
			}else{
				
				var _newUploadSuccessMsg = $(this.opts.uploadSuccessMsg);
				
				if(_newUploadSuccessMsg.prop('class')){
							
					var _newUploadSuccessMsgClass = _newUploadSuccessMsg.prop('class')+_uploadId;		
					
				}else{
					
					var _newUploadSuccessMsgClass = 'uploadSuccessMsg'+_uploadId;
					
					
					}
					
				_newUploadSuccessMsg.addClass(_newUploadSuccessMsgClass);
				
				if(_newUploadSuccessMsg.find('a:last').length>0){
					
					if(_newUploadSuccessMsg.find('a:last').prop('class')){
						
						var _newRemoveUploadClass = _newUploadSuccessMsg.find('a:last').prop('class')+_uploadId;
					
					}else{
						
						var _newRemoveUploadClass = 'uploadAgainLink'+_uploadId;
					
					}
				
					
					var fileUploadFunction = this;
					var _removeUploadId = _uploadId;
					
					_newUploadSuccessMsg.find('a:last')
					.addClass(_newRemoveUploadClass)
					.off("click.removeUpload")
					.on("click.removeUpload", function(e){
						
						e.preventDefault();
					
						fileUploadFunction.removeUpload(_progressBar,_newUploadSuccessMsgClass,_newRemoveUploadClass);
					
					})
				}
				
				
				if(this.$el.parents('label').length>0){
					
					this.$el.parents('label').after(_newUploadSuccessMsg);
					
				}else{
					
						this.$el.after(_newUploadSuccessMsg);
						
				}
				
				
			}

        },
		
		//Handles Upload Errors
		
		errorCallback: function(error,data){
			if(this.$el.parents('label.stylize').length>0){
					this.$el.parents('label.stylize').show();
				}else{
					this.$el.show();
			}
				this.$el.val('');
				this.$el.wrap('<form>').closest('form').get(0).reset();
				this.$el.unwrap();
				
			if(this.opts.error && !/^function[^{]+\{\s*\}/m.test(this.opts.error.toString()) && typeof this.opts.error == 'function'){
				this.opts.error(error,data,this.$el, this.opts);	
				return;
			}
			
			var errorMsg = error;
			
			window.setTimeout(function(){
				alert(errorMsg); //Alerts error by default
			},0);
		
		},
		
		//Removes Uploaded File
		
		removeUpload: function(_progressBar,_newUploadSuccessMsgClass,_newRemoveUploadClass){
			if(_progressBar)_progressBar.remove();
			if(_newUploadSuccessMsgClass)$("."+_newUploadSuccessMsgClass).remove();
			if(_newRemoveUploadClass)$("."+_newRemoveUploadClass).remove();
			this.$el.val('');
			this.$el.wrap('<form>').closest('form').get(0).reset();
			this.$el.unwrap();
			
			if(this.opts.hiddencallback.length > 0){
				this.opts.hiddencallback.val('');
				}else{
				$("input[type=hidden][name="+this.opts.hiddencallbackfield+"]").val('');
				}
			
			if(this.$el.parents('label.stylize').length>0){
				this.$el.parents('label.stylize').show();
				}else{
					this.$el.show();
				}
			
		},
		
		//Chains All Upload Events
		
		beginUpload: function(_files){
			
			
			var _progressBar, _file;
			var _uploadId = this.getRandomId();
			var fileUploadFunction = this;
			
			if(typeof this.opts.onBeforeUpload == 'function'){
				this.opts.onBeforeUpload(this.$el, this.opts);
				}
			
			if (typeof _files !== "undefined") {
				if(_files.length > 1){
					this.errorCallback(this.opts.multipleFilesMsg);
					return;
				}
				var _file = _files[0];
			}
						
			if (_file && parseFloat(this.opts.maxFileSize) > 0) {
					if(_file.size && _file.size > 0){
						if((_file.size * 100 / (1024 * 1024) / 100)>parseFloat(this.opts.maxFileSize)){
							this.errorCallback(this.opts.fileTooLargeMsg);
							return;
							}
					}
			}
			if (_file && parseFloat(this.opts.minFileSize) > 0) {
					if(_file.size){
						if((_file.size * 100 / (1024 * 1024) / 100)<parseFloat(this.opts.minFileSize)){
							this.errorCallback(this.opts.fileTooSmallMsg);
							return;
							}
					}
			}
			if (_file) {
					if(_file.name && this.opts.allowedFileTypes && this.opts.allowedFileTypes != '*'){
						var _allowedFileTypes = this.opts.allowedFileTypes.replace(/[^a-zA-Z0-9,]+/g,'').split(',').join('|');
						_allowedFileTypes = new RegExp('^.*\.('+_allowedFileTypes+')$','i');
						if(_allowedFileTypes instanceof RegExp){
							if(!_allowedFileTypes.test(_file.name)){
								this.errorCallback(this.opts.fileTypeNotAllowedMsg);
								return;
								}
							}
					}
			}

			if(_file && this.opts.previewImageBeforeUpload !== false && this.objectSize(this.opts.previewImageBeforeUpload) > 0){
				if(this.opts.previewImageBeforeUpload.container.length > 0){
					if (typeof FileReader !== "undefined" && (/image/i).test(_file.type)) {
				
						var _img = document.createElement("img");
						if(this.opts.previewImageBeforeUpload.maxWidth)_img.style.maxWidth = this.opts.previewImageBeforeUpload.maxWidth+'px';
						if(this.opts.previewImageBeforeUpload.maxHeight)_img.style.maxHeight = this.opts.previewImageBeforeUpload.maxHeight+'px';
						if(this.opts.previewImageBeforeUpload.width)_img.style.width = this.opts.previewImageBeforeUpload.width+'px';
						if(this.opts.previewImageBeforeUpload.height)_img.style.height = this.opts.previewImageBeforeUpload.height+'px';
						this.opts.previewImageBeforeUpload.container.html($(_img));
						var _reader = new FileReader();
						_reader.onload = (function (_img) {
							return function (evt) {
								$(_img).prop('src',evt.target.result);
								};
							}(_img));
						_reader.readAsDataURL(_file);
					}
				}
			}
			
			
			var xhr2 = (!!window.FileReader && new XMLHttpRequest().upload && !!window.FormData && ("upload" in ($.ajaxSettings.xhr())));
			
			if(xhr2 === true && _file === null)return;
			if(xhr2 === true  && _file && this.opts.useXhr2WhenSupported == true && !(this.onMobileDevice && (navigator.userAgent.indexOf('CriOS') !== -1 || (navigator.userAgent.indexOf('Android') !== -1 && navigator.userAgent.indexOf('Chrome') !== -1) || (navigator.userAgent.indexOf('Android') !== -1 && navigator.userAgent.indexOf('Safari') !== -1)))){
				
				var xhr = new XMLHttpRequest();
					
				if(this.objectSize(this.opts.progressbar) > 0) {
												
					
					if(this.opts.progressbar.url)var _progressBar = this.createProgressBar(_uploadId,true);
				
					if(_progressBar && _progressBar.length>0){
					 
						xhr.upload.addEventListener("progress", function (evt) {
							if (evt.lengthComputable) {
								var _progress = Math.round((evt.loaded / evt.total) * 100);	
								
									 _progressBar.attr("aria-valuenow",_progress).children().css("width",_progress+"%");
							
								}else {
								
								}
							}, false);
					}
				}
				
				var uploadCallbackOpt3 = _uploadId;
				var uploadCallbackOpt4 = _progressBar;		
					
							
				xhr.addEventListener("load", function () {

					fileUploadFunction.uploadCallback(null,null,uploadCallbackOpt3,uploadCallbackOpt4,this.responseText.replace(/^.*?<body[^>]*>(.*?)<\/body>.*?$/i,"$1"));
				
				}, false);
				
				
				xhr.addEventListener("error", function(){
					
					fileUploadFunction.removeUpload()
					
					}, false);
  				xhr.addEventListener("abort", function(){
					
					fileUploadFunction.removeUpload()
					
					}, false);
				xhr.open("POST", this.opts.url, true);
				var _params = new FormData();
				_params.append("PHP_UPLOAD_FIELD", this.$el.prop("name"));
				_params.append(this.$el.prop("name"), _file);
				xhr.send(_params);
				
				
			}else{
				
				var _form = this.createUploadForm(_uploadId);
				var _iframe = this.createUploadIframe(_uploadId);
			
				if(this.objectSize(this.opts.progressbar) > 0){
					if(this.opts.progressbar.url)var _progressBar = this.createProgressBar(_uploadId,false,_iframe);
				}
	
			
				var uploadCallbackOpt1 = _iframe;
				var uploadCallbackOpt2 = _form;
				var uploadCallbackOpt3 = _uploadId;
				var uploadCallbackOpt4 = _progressBar;
				var fileUploadFunction = this;
				_iframe.on("load", function(){fileUploadFunction.uploadCallback(uploadCallbackOpt1,uploadCallbackOpt2,uploadCallbackOpt3,uploadCallbackOpt4);});
				_form.attr("action", this.opts.url)
					 .attr('method', 'POST')
					 .attr('target', _iframe.prop('id'));
				_form[0].submit();
			}
			
		},
		
		//Binds File Upload Actions
		bindFileField: function(){
			
			var thisOpts = this.opts;
			var fileUploadFunction = this;
			
			this.$el.off("change.fileUpload").on("change.fileUpload", function(e){
										
				var _files;
				if(this.files)var _files = this.files;
				
				fileUploadFunction.beginUpload(_files);
					
			})
			
		},
		
		//Generates Random ID
		getRandomId: function(){
			
				var _randIdNew = '';
				for (var i=0; i< this.randStringLength; i++) {
					var _rnum = Math.floor(Math.random() * this.randChars.length);
					_randIdNew += this.randChars.substring(_rnum,_rnum+1);
				}
				return _randIdNew;
		},
		
		//Gets Object Size
		objectSize: function(obj){
			
  		  var size = 0, key;
   		 	for (key in obj) {
      		  if (obj.hasOwnProperty(key)) size++;
  			  }
 		   return size;

		},

		//Stylize File Upload Field
		stylize: function() {
			var _this = this;
			
			var ie = (function(){
    		var undef,
      		  v = 3,
       			 div = document.createElement('div'),
       			 all = div.getElementsByTagName('i');

   				 while (
       				 div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
       				 all[0]
   				 );

  				 return v > 4 ? v : undef;

			}());
			
		
		if ((ie === "undefined" && !$.support.boxModel.opacity) || (ie && parseFloat(ie) < 5.5) || !document.getElementsByTagName) { return; }
	
		if(this.$el.parents('label.stylize').length == 0 && this.opts.stylize.image){
			var wrapperLabel = $('<label class="stylize" style="display: block;overflow: hidden; cursor: pointer;" />');
			if(this.opts.stylize.image)wrapperLabel.css("background","url("+this.opts.stylize.image+") left top no-repeat");
			if(this.opts.stylize.width)wrapperLabel.css("width",this.opts.stylize.width+"px");
			if(this.opts.stylize.height)wrapperLabel.css("height",this.opts.stylize.height+"px");
			if((!this.opts.stylize.width || !this.opts.stylize.height) && this.opts.stylize.image){
				var img = new Image();
				var fileUploadFunction = this;
				img.onload = function() {
					if(!fileUploadFunction.opts.stylize.width)wrapperLabel.css("width",this.width+"px");
					if(!fileUploadFunction.opts.stylize.height){
						wrapperLabel.css("height",this.height+"px");
						fileUploadFunction.$el.css("font-size",this.height+"px");
					}
					fileUploadFunction.$el.wrap(wrapperLabel);
				}
				img.src = this.opts.stylize.image;
				
			}else{
				this.$el.wrap(wrapperLabel);
			}
		this.$el.css("position", "relative")
				.css("right", "0")
				.css("height", "100%")
				.css("width", "100%")
				.css("opacity", "0")
				.css("-moz-opacity", "0")
				.css("-khtml-opacity", "0")
				.css("-ms-filter","progid:DXImageTransform.Microsoft.Alpha(opacity=0)")
				.css("filter","alpha(opacity=0)");
		if(this.opts.stylize.height){
			this.$el.css("font-size",this.opts.stylize.height+"px")
					.css("line-height",this.opts.stylize.height+"px");
		}
		
		if(this.opts.mobileDetect !== false){
			if(this.onMobileDevice === true){
				return;
				}
			}
		
		this.$el.parents('label.stylize').on("mousemove",function(e)
		{
			if (typeof e == 'undefined') e = window.event;
			if (typeof e.pageY == 'undefined' &&  typeof e.clientX == 'number' && document.documentElement)
			{
				e.pageX = e.clientX + document.documentElement.scrollLeft;
				e.pageY = e.clientY + document.documentElement.scrollTop;
			};
			
			var ox = 0;
			var oy = 0;
			var elem = this;
			var file = $(elem).children("input[type=file]:first")[0];
			if (elem.offsetParent)
			{
				ox = elem.offsetLeft;
				oy = elem.offsetTop;
				while (elem = elem.offsetParent)
				{
					ox += elem.offsetLeft;
					oy += elem.offsetTop;
				};
			};

			var x = e.pageX - ox;
			var y = e.pageY - oy;
			var w = file.offsetWidth;
			var h = file.offsetHeight;
   			if (x < 0 || y < 0 || x > this.offsetWidth || y > this.offsetHeight) { 
      		  x = 0; y = 0; h = 0; w = 30;
   		    }
			

			
			$(file).css("top",  (y - (h / 2))  + 'px');
			$(file).css("left",	(x - (w - 30)) + 'px');
		})
	  }
   }
}
	
	$.fn.fileUpload = function(options) {
		if(this.length) {
			return this.each(function() {
				var rev = new FileUpload(this, options);
				rev.init();
				var opts = rev.settings();
				if(opts.setGlobalFileUpload !== false){
					window.FileUpload = rev;
					 if(typeof window.FileUploadID == 'undefined')window.FileUploadID = new Array();
					if(typeof window.FileUpload == 'undefined'){
						window.FileUpload = rev;
						if($(this).attr('id'))window.FileUploadID[$(this).attr('id')] = rev;
					}else{
						if($(this).attr('id'))window.FileUploadID[$(this).attr('id')] = rev;
						}
						
				}
				$(this).data('fileUpload', rev);
			});
		}
	};

	
})(jQuery);