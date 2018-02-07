(function datePickerDirective() {
	'use strict';
	angular.module('myApp').directive('datePicker', datePicker);

	datePicker.$inject = ['$timeout'];

	function datePicker($timeout) {
		var directive = {
			restrict: 'EA',
			templateUrl: 'date-picker-template.html',
			scope: {
				minDate: '=',
				maxDate: '=',
				format: '@',
				displayDate: '=',
				onDateChange: '&',
				dateRangeChecked: '='
			},
			link: linkFunc,
			controller: Controller,
			controllerAs: 'vm',
			bindToController: true
		};

		return directive;

		function linkFunc(scope, el, attr, ctrl) {
			$timeout(function(){
				angular.element(document).ready(function () {
        			angular.element('body').click(function(event){
        				if ( angular.element(event.target).parents('date-picker').length > 0 ) {
        					event.preventDefault();
        					event.stopPropagation();
        				} else {
        					if ( scope.vm.show ) { 
        						scope.vm.togglePicker();
        					}
        				}
        			});
    			});
			});

			scope.$on('$destroy', function() {
        		angular.element('body').unbind('click');
      		});
		}
	}

	Controller.$inject = ['$scope'];

	function Controller($scope) {
		var vm = this;
		vm.show = false;
		vm.togglePicker = function () {
			vm.show = !vm.show && vm.dateRangeChecked;
		};
		if(!vm.displayDate){
			vm.displayDate = moment(moment(new Date(), 'DD-MMM-YYYY')).format(vm.format);;
		}else{
			vm.displayDate = moment(moment(vm.displayDate, 'DD-MMM-YYYY')).format(vm.format);
		}
		
		vm.maxDate = moment(moment(vm.maxDate, 'MM/DD/YYYY')).format('MM/DD/YYYY');
		vm.minDate = moment(moment(vm.minDate, 'MM/DD/YYYY')).format('MM/DD/YYYY');
		$scope.$watch('vm.date', function() {
			if(vm.date){
				vm.displayDate =  moment(moment(vm.date, 'MM/DD/YYYY')).format(vm.format);
			}
			vm.show = false;
		});

		vm.validateDate = function() {
			if (! moment( vm.displayDate, [ vm.format ] ).isValid() ) {
				vm.displayDate = null;
			}
		};
	}

})();
