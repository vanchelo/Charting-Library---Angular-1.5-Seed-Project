//function CqNgChart($element,quoteFeed){
function CqNgChart($element, quoteFeed){
	var ctrl=this; //use ctrl for this for the sole purpose of consistency both in and out of the functions

	// postLink is the angular lifecycle hook that gets called after the compile function of a component
	ctrl.$postLink=function(){
		if(ctrl.parent) ctrl.parent.cqNgChart=ctrl; //here we give the UI (the parent) access to ourself (the chart)
		ctrl.initChart();
	};

	ctrl.setPeriodicity=function(period, interval){
		ctrl.ciq.setPeriodicityV2(period,interval);
	};
	ctrl.setChartType=function(type){
		if((type.aggregationEdit && ctrl.ciq.layout.aggregationType != type.type) || type.type == 'heikinashi'){
			ctrl.ciq.setChartType('candle');
			ctrl.ciq.setAggregationType(type.type);
		} else {
			ctrl.ciq.setChartType(type.type);
			ctrl.ciq.setAggregationType('ohlc');
		}
	};
	ctrl.toggleCrosshairs=function(){
		var state=ctrl.ciq.layout.crosshair;
		ctrl.ciq.layout.crosshair=!state;
	};
	ctrl.changeSymbol=function(){
		ctrl.ciq.newChart(ctrl.symbolInput);
	};
	ctrl.addComparison=function(){
		// Note that this color generator has a bias toward darker colors. Just needed a quick solution here.
		function getRandomColor() {
			var letters = '0123456789ABCDEF';
			var color = '#';
			for (var i = 0; i < 6; i++ ) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		}
		ctrl.ciq.addSeries(ctrl.symbolComparison,{isComparison:true, color:getRandomColor(), data:{useDefaultQuoteFeed:true}});
	};
	ctrl.initChart=function(){
		ctrl.ciq=new CIQ.ChartEngine({container:$$$("#chartContainer")});
		ctrl.attachFeed();
		if(ctrl.symbolInput) {
			console.log('found a symbol');
			ctrl.ciq.newChart(ctrl.symbolInput);
		} else ctrl.ciq.newChart("AAPL"); //AAPL is our default symbol
	};
	ctrl.attachFeed=function(){
		var whichFeed=$element.attr("quotefeed");
		var qf=quoteFeed.makeFeed(whichFeed);
		ctrl.ciq.attachQuoteFeed(qf);
	};
}

// The chart component
angular.module('cqNgApp').component('cqNgChart', {
	require: {parent:'?^cqNgUi'}, //children can gain access to parent with angular
	controller:CqNgChart,
	templateUrl: 'templates/cq-ng-chart.html',
	controllerAs:'cqNgChart',
	bindings:{
		symbolInput:'@',
		symbolComparison:'@',
	}
});

