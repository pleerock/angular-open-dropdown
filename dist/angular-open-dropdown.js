/**
 * @author Umed Khudoiberdiev <info@zar.tj>
 */
(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name openDropdown
     * @description
     * This module represents a special directive that allows us to open a dropdown / popover when user clicks on some
     * element.
     */
    angular.module('openDropdown', []);

})();
/**
 * @author Umed Khudoiberdiev <info@zar.tj>
 */
(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name openDropdown
     * @restrict E
     * @description
     * This directive opens a dropdown on the click on some element.
     */
    angular.module('openDropdown').directive('openDropdown', openDropdown);

    /**
     * @ngInject
     */
    function openDropdown($parse, $timeout) {
        return {
            replace: true,
            restrict: 'E',
            link: function (scope, element, attrs) {

                // ---------------------------------------------------------------------
                // Setup default dropdown style
                // ---------------------------------------------------------------------

                element[0].style.display    = 'none';
                element[0].style.position   = 'absolute';

                if (!element[0].style.zIndex)       element[0].style.zIndex     = 1;
                if (!element[0].style.background)   element[0].style.background = '#FFF';
                if (!element[0].style.border)       element[0].style.border     = '1px solid #cccccc';

                // ---------------------------------------------------------------------
                // Checks and local variables
                // ---------------------------------------------------------------------

                if (!attrs.for)
                    throw new Error('You must specify for what open dropdown component is attached (container id).');

                var toggleClick = (attrs.toggleClick === true || attrs.toggleClick === 'true');
                var attachedContainer;

                // ---------------------------------------------------------------------
                // Initialization
                // ---------------------------------------------------------------------

                // lets give a time for angular to initialize attached container id, then find this element
                $timeout(function() {
                    attachedContainer = document.getElementById(attrs.for);
                    if (!attachedContainer)
                        throw new Error('Cant find a container to attach to.');

                    element[0].style.width = (attachedContainer.offsetWidth - 2) + 'px';
                    attachedContainer.addEventListener('keydown', onAttachedContainerKeyDown);
                    attachedContainer.addEventListener('click', onAttachedContainerClick);
                    document.addEventListener('mousedown', onDocumentMouseDown);
                }, 100);

                // ---------------------------------------------------------------------
                // Watchers
                // ---------------------------------------------------------------------

                if (attrs.isOpened) {
                    scope.$watch(attrs.isOpened, function(opened) {
                        element[0].style.display = (opened === true) ? 'block' : 'none';
                    });
                }

                // ---------------------------------------------------------------------
                // Local functions
                // ---------------------------------------------------------------------

                /**
                 * Sets the opened status of the dropdown.
                 *
                 * @param {boolean} is
                 */
                var setIsOpened = function(is) {
                    if (attrs.isOpened) {
                        $parse(attrs.isOpened).assign(scope, is);
                        scope.$digest();
                    } else {
                        element[0].style.display = is ? 'block' : 'none';
                    }
                };

                /**
                 * Closes dropdown if user clicks outside of this directive.
                 */
                var onDocumentMouseDown = function() {
                    if (element[0].contains(event.target) || attachedContainer.contains(event.target)) return;
                    setIsOpened(false);
                };

                /**
                 * Listens to key downs on the attached container to make control open/close state of the dropdown.
                 *
                 * @param {KeyboardEvent} e
                 */
                var onAttachedContainerKeyDown = function(e) {
                    switch (e.keyCode) {

                        case 38: // KEY "UP"
                        case 40: // KEY "DOWN"
                            e.preventDefault();
                            setIsOpened(true);
                            return;

                        case 27: // KEY "ESC"
                        case 9: // KEY "TAB"
                            setIsOpened(false);
                            return;

                        default:
                            return;
                    }
                };

                /**
                 * Open select drop down menu automatically when user clicks on the attached container.
                 */
                var onAttachedContainerClick = function() {
                    var needToHide = toggleClick && element[0].style.display !== 'none';
                    setIsOpened(!needToHide);
                };

                // ---------------------------------------------------------------------
                // Event listeners
                // ---------------------------------------------------------------------

                scope.$on('$destroy', function() {
                    if (!attachedContainer) return;

                    document.removeEventListener('mousedown', onDocumentMouseDown);
                    attachedContainer.removeEventListener('keydown', onAttachedContainerKeyDown);
                    attachedContainer.removeEventListener('click', onAttachedContainerClick);
                });

            }
        };
    }


})();