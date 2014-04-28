angular
.module("formdemo")
.value('ComboBoxController', ($scope, $element, $attrs, $filter, $timeout) ->
  $scope.active ?= false
  $scope.search = null

  $scope.$watch 'search', (q)-> $scope.updateDropdown()

  $scope.selectItem = (item)->
    $scope.item = if typeof item == 'object' then item[$scope.searchAttr] else item
    $scope.search = null

  $scope.showDropdown = ->
    $scope.active = true
    $scope.search = ''
    $scope.updateDropdown()

  $scope.updateDropdown = () ->
    filterParmas = $scope.search

    if $scope.searchAttr
      filterParmas = {}
      filterParmas[$scope.searchAttr] = $scope.search

    $scope.dropdownItems = if $scope.search? then $filter('filter')($scope.items, filterParmas) else []

  $scope.onBlur = () ->
    $timeout(->
      $scope.active = false
      $scope.search = null
    , 0, true)

  $scope.move = (d) ->
    $scope.search ?= ''
    $scope.listInterface.move && $scope.listInterface.move(d)

  $scope.onEnter = (event) ->
    if $scope.dropdownItems.length > 0
      $scope.selectItem($scope.listInterface.selectedItem)

  $scope.listInterface =
    onSelect: (selectedItem) ->
      $scope.selectItem(selectedItem)
)
.directive "combobox", ['$compile', 'ComboBoxController', ($compile, ComboBoxController) ->
  restrict: "A"
  scope:
    items: '='
    disabled: '=ngDisabled'
    required: '=ngRequired'
    class: '@'
    name: '@'
    active: '@'
    searchAttr: '@'
  require: '?ngModel'
  replace: true
  template: (el)->
    itemTpl = el.html()
    template = """
<div class='f-combobox fs-widget-root'>
  <div class="open">
    <div class="input-group">
      <input class="form-control"
             f-input

             fs-focus-when='active'
             fs-blur-when='!active'
             fs-on-focus='active = true'
             fs-on-blur='onBlur()'
             fs-hold-focus
             fs-down='move(1)'
             fs-up='move(-1)'
             fs-pg-up='move(-11)'
             fs-pg-down='move(11)'
             fs-enter='onEnter($event)'
             fs-esc='active = false'
             type="text"

             ng-disabled="disabled"
             ng-required="required"

             name="name"

             ng-change="search = item"

             placeholder='Search'
             ng-model="item"
             />

      <span class="input-group-btn">
        <button type="button"
                class="btn btn-default combobox-select"
                ng-disabled="disabled"
                ng-click='showDropdown()'><span class="caret"></span></button>
      </span>
    </div>

    <div ng-if="active && dropdownItems.length > 0" ng-show="active">
      <div f-list items="dropdownItems">
       #{itemTpl}
      </div>
    </div>
  </div>
</div>
    """
  controller: ComboBoxController
  link: (scope, element, attrs, ngModelCtrl, transcludeFn) ->
    if ngModelCtrl
      scope.item = ngModelCtrl.$viewValue if ngModelCtrl.$viewValue?

      scope.$watch 'item', (newValue, oldValue) ->
        if newValue isnt oldValue
          ngModelCtrl.$setViewValue(scope.item)

      ngModelCtrl.$render = ->
        scope.item = ngModelCtrl.$viewValue
]
