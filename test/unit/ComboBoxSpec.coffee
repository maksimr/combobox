describe 'Combobox', ->
  $scope = null
  $compile = null

  beforeEach module('formdemo')

  beforeEach inject ($controller, $rootScope, _$compile_, ComboBoxController) ->
    $scope = $rootScope.$new()
    $scope.items = ['first', 'second', 'last']
    $compile = _$compile_

    fsComboBoxCtrl = $controller(ComboBoxController, {$scope: $scope, $element: null, $attrs: null})

  compile = (elem) ->
    elem ||= '<div combobox items="items" ng-model="value"></div>'
    element = $compile(elem)($scope)

    $scope.$digest()

    element

  it 'should expands', ->
    element = compile()
    expect(element.children().length).not.toBe 0

  it 'should disable input', ->
    element = compile('<div combobox items="items" ng-disabled="true"></div>')
    $scope.$apply()
    expect(element.find('input').prop('disabled')).toBeDefined()

  it 'should propagate classes to directive', ->
    element = compile('<div combobox items="items" class="someclass"></div>')
    $scope.$apply()
    expect(element.attr('class')).toMatch /someclass/

  it 'should update scope property', ->
    element = compile('<div combobox ng-model="value" items="items"></div>')

    element.find('input').val($scope.items[0]).triggerHandler('input')

    expect($scope.value).toBe $scope.items[0]

  it 'should be not active by default', ->
    expect($scope.active).toBe false

  it 'should take init value', ->
    $scope.value = 'test'

    element = compile('<div combobox items="items" ng-disabled="true" ng-value="value"></div>')

    expect($scope.value).toBe 'test'

  describe '#$watch', ->
    it 'should update dropdownItems on change search value', ->
      $scope.dropdownItems = $scope.items

      $scope.search = 'fi'
      $scope.$apply()

      expect($scope.dropdownItems).toEqual ['first']

  describe '#selectItem', ->
    it 'should select object', ->
      $scope.searchAttr = 'name'

      $scope.selectItem({name:"Alabama", id:"AL"})

      expect($scope.item).toBe "Alabama"

    it 'should select string', ->
      $scope.selectItem("Alabama")

      expect($scope.item).toBe "Alabama"

    it 'should reset search value to null', ->
      $scope.search = 'Al'

      $scope.selectItem("Alabama")

      expect($scope.search).toBe null

  describe '#updateDropdown', ->
    it 'should filter dropdownItems by searchAttr', ->
      $scope.items = [
        {name:"Alabama", id:"AL"},
        {name:"Alaska", id:"AK"},
        {name:"American Samoa", id:"AS"},
        {name:"Arizona", id:"AZ"},
        {name:"Arkansas", id:"AR"},
        {name:"Armed Forces Europe", id:"AE"},
        {name:"Armed Forces Pacific", id:"AP"},
        {name:"Armed Forces the Americas", id:"AA"},
        {name:"California", id:"CA"},
        {name:"Colorado", id:"CO"},
        {name:"Connecticut", id:"CT"},
        {name:"Delaware", id:"DE"}
      ]

      $scope.search = 'Co'

      $scope.updateDropdown()

      expect($scope.dropdownItems).toEqual [
        {name:"Colorado", id:"CO"},
        {name:"Connecticut", id:"CT"}
      ]

    it 'should filter array of simple strings without searchAttr', ->
      $scope.search = 'fi'

      $scope.updateDropdown()

      expect($scope.dropdownItems).toEqual ['first']

    it 'should return empty list if search is null', ->
      $scope.search = null

      $scope.updateDropdown()

      expect($scope.dropdownItems).toEqual []

  describe '#showDropdown', ->
    it 'should be active after show dropdown', ->
      $scope.showDropdown()

      expect($scope.active).toEqual true

  describe '#onEnter', ->
    it 'should take selected element from dropdown menu', ->
      $scope.dropdownItems = $scope.items
      $scope.listInterface.selectedItem = 'second'

      $scope.onEnter()

      expect($scope.item).toEqual 'second'
