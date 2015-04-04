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

    /**
     * @ngdoc directive
     * @name openDropdown
     * @restrict E
     * @description
     * This directive opens a dropdown on the click on some element.
     *
     * @param {string} for Id of the element that which dropdown will be opened when clicked on
     * @param {string} toggleClick If set to true then dropdown's open/close state will toggle - if dropdown is
     *                             opened then it will be close, if it is closed then it will be open
     * @param {boolean} isOpened Indicates if dropdown is opened or not. Component is watching this expression and
     *                           closes/opens dropdown when it changes
     * @param {boolean} fitWidthToAttachedContainer Indicates if dropdown width should fit attached container width
     * @param {boolean} hide If set to true then dropdown will be hidden (instead of destroy)
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

                setupDefaultDropdownStyles(element[0]);

                // check for required options to be set
                if (!attrs.for)
                    throw new Error('You must specify for what open dropdown component is attached (container id).');

                var toggleClick = (attrs.toggleClick === true || attrs.toggleClick === 'true');
                var attachedContainer;

                // lets give a time for angular to initialize attached container id, then find this element
                $timeout(function() {
                    attachedContainer = document.getElementById(attrs.for);
                    if (!attachedContainer)
                        throw new Error('Cant find a container to attach to.');

                    // attach listeners
                    attachedContainer.addEventListener('keydown', onAttachedContainerKeyDown);
                    attachedContainer.addEventListener('click', onAttachedContainerClick);
                    document.addEventListener('mousedown', onDocumentMouseDown);
                }, 100);

                // ---------------------------------------------------------------------
                // Watchers
                // ---------------------------------------------------------------------

                if (attrs.isOpened) {
                    scope.$watch(attrs.isOpened, function(opened) {
                        if (isDisabled()) return;
                        closeOpenDropdown(opened);
                    });
                }

                // ---------------------------------------------------------------------
                // Local functions
                // ---------------------------------------------------------------------

                /**
                 * Closes (or opens) a dropdown.
                 *
                 * @param {boolean} opened
                 */
                var closeOpenDropdown = function(opened) {
                    element[0].style.display = (opened === true) ? 'block' : 'none';

                    // fit dropdown width to the width of the container if this is set by options
                    if (attachedContainer &&
                        opened === true &&
                        attrs.fitWidthToAttachedContainer &&
                        attrs.fitWidthToAttachedContainer !== 'false' &&
                        attrs.fitWidthToAttachedContainer !== '0')
                        element[0].style.width = (attachedContainer.offsetWidth - 2) + 'px';
                };

                /**
                 * Checks if open dropdown is disabled or not.
                 *
                 * @returns {boolean}
                 */
                var isDisabled = function() {
                    return attrs.disabled ? $parse(attrs.disabled)(scope) : false;
                };

                /**
                 * Sets the opened status of the dropdown.
                 *
                 * @param {boolean} is
                 */
                var setIsOpened = function(is) {
                    if (isDisabled()) return;

                    if (attrs.isOpened) {
                        $parse(attrs.isOpened).assign(scope, is);
                        scope.$digest();
                    } else {
                        closeOpenDropdown(is);
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

    /**
     * Sets the styles of the dropdown that should be on the dropdown by deafult.
     *
     * @param {HtmlElement} element
     */
    function setupDefaultDropdownStyles(element) {
        element.style.display    = 'none';
        element.style.position   = 'absolute';

        if (!element.style.zIndex)     element.style.zIndex     = 1;
        if (!element.style.background) element.style.background = '#FFF';
        if (!element.style.border)     element.style.border     = '1px solid #cccccc';
    }

})();