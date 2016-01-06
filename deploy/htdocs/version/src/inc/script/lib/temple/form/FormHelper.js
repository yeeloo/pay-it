define(["require", "exports", "lib/temple/utils/Browser"], function (require, exports, Browser_1) {
    var ValidationRule = (function () {
        function ValidationRule(className, fn, message) {
            if (message === void 0) { message = ''; }
            this.message = message;
            this.className = className;
            this.fn = fn;
        }
        ValidationRule.prototype.validate = function (el, fn) {
            if ($(el).hasClass(this.className)) {
                this.fn.call(null, el, fn);
            }
            else {
                fn.call(null, null);
            }
        };
        return ValidationRule;
    })();
    exports.ValidationRule = ValidationRule;
    /**
     * @example
     *      var formhelper = new fm.FormHelper($('form')[0]);
     *      formhelper.validate(function(success){
     *
     *      });
     *
     *
     */
    var FormHelper = (function () {
        function FormHelper(element) {
            this.element = element;
            this.makeDefaultValueCompatible($(this.element).find('input[placeholder], textarea[placeholder]').toArray());
        }
        FormHelper.addValidationRule = function (rule) {
            FormHelper.rules.push(rule);
        };
        FormHelper.validate = function (el, fn) {
            var validated = true, counted = 0, failed = 0, total = FormHelper.rules.length, failedRules = [];
            for (var i = 0, l = FormHelper.rules.length; i < l; ++i) {
                FormHelper.rules[i].validate(el, function (success) {
                    counted++;
                    if (success !== null) {
                        if (!success) {
                            failed++;
                            failedRules.push(FormHelper.rules[i]);
                            validated = false;
                            $(el).parent().addClass('validation-failed').removeClass('validation-passed');
                        }
                        else {
                            $(el).parent().removeClass('validation-failed').addClass('validation-passed');
                        }
                    }
                    if (total == counted) {
                        fn.call(null, failed == 0, el, failedRules);
                    }
                });
            }
        };
        FormHelper.prototype.validate = function (fn) {
            var elements = $(this.element).find('input, textarea, select, div'), counted = 0, failed = 0, total = elements.length;
            var result = [];
            for (var i = 0, l = elements.length; i < l; ++i) {
                FormHelper.validate(elements[i], function (success, el, rules) {
                    result.push({
                        'success': success,
                        el: el,
                        rules: rules
                    });
                    counted++;
                    if (!success) {
                        failed++;
                    }
                    if (total == counted) {
                        fn(failed == 0, result);
                    }
                });
            }
        };
        FormHelper.prototype.getData = function () {
            var data = {};
            $(this.element).find('input, textarea, select').each(function (i, el) {
                switch ($(el).attr('type')) {
                    case 'radio':
                    case 'checkbox':
                        {
                            if (el.checked) {
                                data[$(el).attr('name')] = $(el).val();
                            }
                            break;
                        }
                    default:
                        {
                            data[$(el).attr('name')] = $(el).val();
                            break;
                        }
                }
            });
            return data;
        };
        FormHelper.prototype.setData = function (data) {
            var elements = {};
            $(this.element).find('input, textarea, select').each(function (i, el) {
                elements[$(el).attr('name')] = $(el);
            });
            var val;
            for (var i in data) {
                if (data.hasOwnProperty(i) && typeof (elements[i]) != 'undefined') {
                    val = data[i];
                    switch (elements[i].attr('type')) {
                        case 'radio':
                        case 'checkbox':
                            {
                                if (elements[i].val() == val) {
                                    elements[i][0].checked = true;
                                }
                                break;
                            }
                        default:
                            {
                                elements[i].val(val);
                                break;
                            }
                    }
                }
            }
        };
        /**
         * Only for IE8
         * @param elements
         */
        FormHelper.prototype.makeDefaultValueCompatible = function (elements) {
            if (Browser_1.default.name == 'ie' && Browser_1.default.version < 10) {
                $(elements).on('focus.remove', function () {
                    if ($(this).attr('placeholder') == $(this).val()) {
                        $(this).val('');
                    }
                }).on('blur.remove', function () {
                    if ('' == $(this).val()) {
                        $(this).val($(this).attr('placeholder'));
                    }
                });
                setTimeout(function () {
                    $(elements).each(function (i, el) {
                        if ('' == $(el).val()) {
                            $(el).val($(el).attr('placeholder'));
                        }
                    });
                }, 300);
            }
        };
        FormHelper.rules = [
            new ValidationRule('required', function (el, fn) {
                if (el.type.toLowerCase() == 'checkbox') {
                    if (el.checked) {
                        fn(true);
                    }
                    else {
                        fn(false);
                    }
                }
                else {
                    if ($(el).val() == '' || $(el).val() == $(el).attr('placeholder')) {
                        fn(false);
                    }
                    else {
                        fn(true);
                    }
                }
            }), new ValidationRule('range', function (el, fn) {
                if (isNaN(parseInt($(el).val(), 10)) || parseInt($(el).val(), 10) <= parseInt($(el).attr('data-min'), 10) || parseInt($(el).val(), 10) >= parseInt($(el).attr('data-max'), 10)) {
                    fn(false);
                }
                else {
                    fn(true);
                }
            }), new ValidationRule('email', function (el, fn) {
                if (!new RegExp('^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$', 'i').test($(el).val()) || $(el).val() == $(el).attr('placeholder')) {
                    fn(false);
                }
                else {
                    fn(true);
                }
            }), new ValidationRule('equal-to', function (el, fn) {
                if ($(el).val() == '' || $(el).val() == $(el).attr('placeholder') || $('#' + $(el).attr('data-equals')).val() != $(el).val()) {
                    fn(false);
                }
                else {
                    fn(true);
                }
            }), new ValidationRule('minimum-length', function (el, fn) {
                var value = $(el).val() || '', length = parseInt($(el).attr('data-length')) || 0;
                if ($(el).val() == '' || $(el).val() == $(el).attr('placeholder')) {
                    fn(false);
                }
                else {
                    if (value.length < length) {
                        fn(false);
                    }
                    else {
                        fn(true);
                    }
                }
            })
        ];
        return FormHelper;
    })();
    exports.FormHelper = FormHelper;
});
