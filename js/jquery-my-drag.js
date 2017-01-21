/**
 * 自定义 拖拽插件
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
;(function($){

	$.fn.mydrag = function(){

		var $dragClos = $(this).find('.drag-clo'),//获得所有列
			$dragModules = $(this).find('.drag-module'),//获得所有模块
			$body = $('body');
			sumGradNum = 0;//layout被分成的总份数
		var dragObj = {
			init : function(){

				this.layoutManagement();
				this.bindDrayEvent();
			},
			/** 布局管理，初始化页面布局 */
			layoutManagement : function(){ 

				//计算 sumGradNum
				$dragClos.each(function(){
					sumGradNum += $(this).data('grad-num');
				});
				//计算每列的宽度
				$dragClos.each(function(){
					var _width = $(this).data('grad-num') / sumGradNum * 100 + '%';
					$(this).css({width:_width});
				})
			},
			/** 绑定拖拽事件 */
			bindDrayEvent : function(){

				var _dragObj = this;
				/** 鼠标落下事件 */
				$dragModules.unbind('mousedown').bind('mousedown',function(event) {

					var _moveModule = this;
					var moveModuleOldPos = $(this).position();
					var pageX = event.pageX;
					var pageY = event.pageY;
					$(this).addClass('moving');

					$body.bind('mousemove',function(e) {

						$(_moveModule).css({left:e.pageX - pageX,top:e.pageY - pageY});
						var enterModule = _dragObj.checkCollision(_moveModule);
						$dragModules.removeClass('select-module');
						$(enterModule).addClass('select-module');
					}).bind('mouseup',function(event) {
						
						var enterModule = _dragObj.checkCollision(_moveModule);

						if(enterModule){
							/** 找到能移动的位置，替换两个模块的位置 */
							var enterModulePos = $(enterModule).position();
						
							$(enterModule).addClass('moved').animate({
								left: moveModuleOldPos.left - enterModulePos.left,
								top: moveModuleOldPos.top - enterModulePos.top},500);
							$(_moveModule).addClass('moved').animate({
								left: enterModulePos.left - moveModuleOldPos.left,
								top: enterModulePos.top - moveModuleOldPos.top},
								500, function() {
								$(this).removeClass('moving');
								// debugger	
								var enterModuleIndex = $(enterModule).index();
								var moveModuleIndex = $(_moveModule).index();
								var enterModuleHtml = $(enterModule).clone().removeClass('moving moved select-module').removeAttr('style'); 
								var moveModuleHtml = $(_moveModule).clone().removeClass('moving moved select-module').removeAttr('style');
								$(_moveModule).parent().find('.drag-module').eq(moveModuleIndex).after(enterModuleHtml);
								$(enterModule).parent().find('.drag-module').eq(enterModuleIndex).after(moveModuleHtml);
								$(_moveModule).remove();
								$(enterModule).remove();
								$dragModules = $dragClos.find('.drag-module');
								_dragObj.bindDrayEvent();//重新绑定事件
							});

						}else{

							/** 没有找到能移动的位置，当前模块返回原位 */
							$(_moveModule).animate({left: 0,top:0},500, function() {
								$(this).removeClass('moving');
							});	
						}

						
						$(this).unbind("mouseup mousemove");
					});;
				});
			},
			/** 碰撞检测 返回被碰撞的模块对象*/
			checkCollision : function(moveModule){

				var enterModule;
				$dragModules.not($(moveModule)).each(function(){

					var moveModulePos = $(moveModule).position();
					var currModulePos = $(this).position(); 
					// debugger
					/** 判断列的宽度是否相同，只有宽度相同的列才能互相替换位置 */
					if($(moveModule).parent().data('grad-num') == $(this).parent().data('grad-num') && moveModulePos.left > currModulePos.left && moveModulePos.left < (currModulePos.left + $(this).width()) && moveModulePos.top > currModulePos.top && moveModulePos.top < (currModulePos.top + $(this).height())){
						enterModule = this;

						return;
					}
				})

				return enterModule;
			}
		}

		dragObj.init();
	}
})(jQuery);