describe('MdPopover Component', function() {
  var $compile, $rootScope, $material, $timeout, $mdPopover, $mdPopoverRegistry;
  var popoverRef;

  var injectLocals = function($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $material = $injector.get('$material');
    $timeout = $injector.get('$timeout');
    $window = $injector.get('$window');
    $mdPopover = $injector.get('$mdPopover');
    $mdPopoverRegistry = $injector.get('$mdPopoverRegistry');
  };

  beforeEach(function() {
    module(
      'material.components.popover',
      'material.components.button'
    );

    inject(injectLocals);
  });

  afterEach(function() {
    // Make sure to remove/cleanup after each test.
    popoverRef.remove();
    var scope = popoverRef && popoverRef.scope();
    scope && scope.$destroy;
    popoverRef = undefined;
  });

  it('should support custom zIndexes', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-z-index="200" md-visible="true">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    expect(findPopover().css('z-index')).toEqual(200);
  });

  it('should default zIndex if a custom is not present', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="true">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    expect(findPopover().css('z-index')).toEqual(100);
  });

  it('should support dynamic positions', function() {
    expect(function() {
      buildPopover(
        '<md-button>' +
          'Hello' +
          '<md-popover md-position="{{position}}">' +
            '<md-popover-title>Title</md-popover-title>' +
            '<md-popover-content>Content</md-popover-content>' +
          '</md-popover>' +
        '</md-button>'
      );
    }).not.toThrow();
  });

  it('should default position to "top" if it is a popover and a custom ' +
      'position is not present', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="true">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    expect(findPopover()).toHaveClass('md-position-top');
  });

  it('should default position to "bottom" if it is a tooltip and a custom ' +
      'position is not present', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="true">Tooltip</md-tooltip>' +
      '</md-button>'
    );

    expect(findPopover()).toHaveClass('md-position-bottom');
  });

  it('should support custom classes that are added to the popover',
        function() {
      buildPopover(
        '<md-button>' +
          'Hello' +
          '<md-popover md-popover-class="testClass" md-visible="true">' +
            '<md-popover-title>Title</md-popover-title>' +
            '<md-popover-content>Content</md-popover-content>' +
          '</md-popover>' +
        '</md-button>'
      );

      expect(findPopover()).toHaveClass('testClass');
    });

  it('should default mdOpenDelay to 0ms when a custom delay is not present',
      function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    triggerEvent('focus', true);
    expect($rootScope.testModel.isVisible).toBe(true);
  });

  it('should open popover after mdOpenDelay ms', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible" md-open-delay="99">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    triggerEvent('focus', true);
    expect($rootScope.testModel.isVisible).toBeFalsy();

    // Wait 1ms below delay, nothing should happen.
    $timeout.flush(98);
    expect($rootScope.testModel.isVisible).toBeFalsy();

    // Total 99ms delay.
    $timeout.flush(1);
    expect($rootScope.testModel.isVisible).toBe(true);
  });

  it('should default mdCloseDelay to 0ms when a custom delay is not present',
      function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    showPopover();

    triggerEvent('blur', true);
    expect($rootScope.testModel.isVisible).toBeFalsy();
  });

  it('should close popover after mdCloseDelay ms', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible" md-close-delay="99">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    showPopover();

    triggerEvent('blur', true);
    expect($rootScope.testModel.isVisible).toBe(true);

    // Wait 1ms below delay, nothing should happen.
    $timeout.flush(98);
    expect($rootScope.testModel.isVisible).toBe(true);

    // Total 99ms delay.
    $timeout.flush(1);
    expect($rootScope.testModel.isVisible).toBeFalsy();
  });

  it('should preserve parent text when building a tooltip', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-tooltip md-visible="testModel.isVisible">Tooltip</md-tooltip>' +
      '</md-button>'
    );

    expect(element.text()).toBe('Hello');
  });

  it('should preserve parent text when building a popover', function() {
    buildPopover(
      '<md-button>' +
        'Hello' +
        '<md-popover md-visible="testModel.isVisible">' +
          '<md-popover-title>Title</md-popover-title>' +
          '<md-popover-content>Content</md-popover-content>' +
        '</md-popover>' +
      '</md-button>'
    );

    expect(element.text()).toBe('Hello');
  });

  // ******************************************************
  // Internal Utility methods
  // ******************************************************

  function buildPopover(markup) {
    popoverRef = $compile(markup)($rootScope);
    $rootScope.textModel = {};

    $rootScope.$apply();
    $material.flushOutstandingAnimations();

    return popoverRef;
  }

  function showPopover(isVisible) {
    if (angular.isUndefined(isVisible)) {
      isVisible = true;
    }

    $rootScope.testModel.isVisible = !!isVisible;
    $rootScope.$apply();
    $material.flushOutstandingAnimations();
  }

  function findPopover() {
    return angular.popoverRef(document.querySelector('.md-panel'));
  }

  function triggerEvent(eventType, skipFlush) {
    angular.forEach(eventType.split(','), function(name) {
      popoverRef.triggerHandler(name);
    });
    !skipFlush && $timeout.flush();
  }
});
