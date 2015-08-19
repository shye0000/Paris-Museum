starterControllers
.controller('introduceCtrl', function($scope, $rootScope, $ionicScrollDelegate, MediaSrv) {
	$scope.$on('$ionicView.beforeEnter', function() {
      	$rootScope.barColor = '#4A3852';
      	if (window.StatusBar) {
        	StatusBar.backgroundColorByHexString("#3A2D3E");
      	}
	});
	$scope.wordItems = [
		{
			french : 'Attention',
			chinese : '注意',
			sound : '[atɑ̃sjɔ̃]',
			chinesesound : '啊当熊',
			audio : 'audio/word/attention.mp3'
		},
		{
			french : 'Interdit',
			chinese : '禁止',
			sound : '[ɛ̃tεrdi]',
			chinesesound : '岸的河堤',
			audio : 'audio/word/interdit.mp3'
		},
		{
			french :'Au secours',
			chinese :'救命',
			sound : '[o] [səkur]',
			chinesesound : '噢色故呵',
			audio : 'audio/word/au-secours.mp3'
		},
		{
			french :'Bonjour',
			chinese :'你好',
			sound : '[bɔ̃ʒur]',
			chinesesound : '蹦入呵',
			audio : 'audio/word/bonjour.mp3'
		},
		{
			french :'Bonsoir',
			chinese :'晚上好',
			sound : '[bɔ̃swar]',
			chinesesound : '蹦丝袜和',
			audio : 'audio/word/bonsoir.mp3'
		},
		{
			french :'Au revoir',
			chinese :'再见',
			sound : '[o] [r(ə)vwar]',
			chinesesound : '噢和呜哇',
			audio : 'audio/word/au-revoir.mp3'
		},
		{
			french :'Merci',
			chinese :'谢谢',
			sound : '[mεrsi]',
			chinesesound : '卖河西',
			audio : 'audio/word/merci.mp3'
		},
		{
			french :'Merci beaucoup',
			chinese :'非常感谢',
			sound : '[mεrsi] [boku]',
			chinesesound : '卖河西 布谷',
			audio : 'audio/word/merci-beaucoup.mp3'
		},
		{
			french :'Excusez-moi',
			chinese :'打扰下',
			sound :'[εkskyze] [mwa]',
			chinesesound : 'XQZ 木啊',
			audio : 'audio/word/excusez-moi.mp3'
		},
		{
			french :'Désolé',
			chinese :'对不起',
			sound : '[dezɔle]',
			chinesesound : '得搜类',
			audio : 'audio/word/desole.mp3'
		},
		{
			french :'Chine',
			chinese :'中国',
			sound : '[∫in]',
			chinesesound : '西呢',
			audio : 'audio/word/chine.mp3'
		}
	];
	mymedia = null;
	$scope.setClickedRow = function(index, audio){
		$scope.selectedRow = index;
		$scope.play(audio);
	}
	$scope.buttonclick = function (strtype) {
		$scope.introduce = (strtype == 'introduce');
		$scope.language = (strtype == 'language');
		$scope.safety = (strtype == 'safety');
		$scope.telenb = (strtype == 'telenb');
		$ionicScrollDelegate.scrollTop();


	};
	$scope.play = function(src) { 
	  if (mymedia) {
	  	mymedia.stop();
	  	mymedia.release();
	  }
      MediaSrv.loadMedia(src, 'intern').then(function(media) {
        mymedia = media;
        mymedia.play();
      });
  	};
  	$scope.$on('$ionicView.afterEnter', function() {
  		$scope.buttonclick('language');
  		$scope.buttonclick('safety');
  		$scope.buttonclick('telenb');
  		$scope.buttonclick('introduce');
  		$scope.entered = true;
  	});
	
});