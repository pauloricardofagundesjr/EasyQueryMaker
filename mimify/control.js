(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.Controls = factory();
    }
})(this, function ($) {
    "use strict";


    const cssClass = function () {
        return {
            GROUP_CONTAINER: "rules-group-container",
            GROUP_HEADER: "rules-group-header",
            GROUP_BODY: "rules-group-body",
            RECORD_LIST: "rules-list"
        }
    }


    //#region utilities

    let generateGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //#endregion

    //#region Inputs
    let inputs = [];
    inputs.SelectColumns = function () {
        let self = this;
        let _get = function () {
            let options = _fields.get()
            let $select = $('<select>', { class: "dropdown-display dropdown" });
            for (let option of options) {
                let element = $("<option>", { value: option.value, text: option.name });
                $select.append(element);
            }
            $select.change((e) => {
                let value = $select[0].selectedOptions[0].value;
                self.setColumn(value)
                console.log(e)
            });
            if (self.column !== undefined)
                $select.val(self.column);
            return $select;
        }
        return { get: _get }
    }
    inputs.SelectOperators = function () {
        let self = this;
        let _get = function () {
            let options = _operators.get()
            let $select = $('<select>', { class: "dropdown-display dropdown" });
            for (let option of options) {
                let element = $("<option>", { value: option.value, text: option.name });
                $select.append(element);
            }
            $select.change(() => {
                let value = $select[0].selectedOptions[0].value;
                self.setOperator(value)
            });
            if (self.operator !== undefined)
                $select.val(self.operator);
            return $select;
        }
        return { get: _get }
    }
    inputs.InputText = function () {
        let self = this;
        let _get = function () {
            let $inputText = $("<input>", { id: "", type: "text", class: "form-control", "data-input": "" });

            $inputText.change(() => {
                let value = $inputText[0].value;
                self.setValue(value)
            });
            if (self.value !== undefined)
                $inputText.val(self.operator);
            return $inputText;
        }
        return { get: _get }
    }
    inputs.InputRadio = function () {
        let self = this;
        let _get = function () {
            let $labelAnd = $("<label>", { for: "", text: "AND" });
            let $labelOr = $("<label>", { for: "", text: "OR" });

            let $inputRadio1 = $("<input>", { type: "radio", class: "radio-button", value: "AND", name: self.id });
            let $inputRadio2 = $("<input>", { type: "radio", class: "radio-button", value: "OR", name: self.id });

            $inputRadio1.click((e) => {
                self.setCondition(e.currentTarget.value);
            })
            $inputRadio2.click((e) => {
                self.setCondition(e.currentTarget.value);
            })



            let $div = new DivElement();
            $div.setIntoDiv(
                $labelAnd,
                $inputRadio1,
                $labelOr,
                $inputRadio2
            );

            if (self.value !== undefined)
                $inputText.val(self.operator);
            return $div.getDiv();
        }
        return { get: _get }
    }
    //#endregion

    //#region ButtonsMethods
    let buttomMethods = [];
    buttomMethods.DeleteRule = function () {
        let $buttom = $("<button>", {
            class: "btn btn-primary ThemeGrid_MarginGutter",
            type: "button",
            text: "Delete"
        });
        $buttom.click(() => {
            this.removeRule();
        });

        return $buttom
    }
    buttomMethods.DeleteGroup = function () {
        let $buttom = $("<button>", {
            class: "btn btn-primary ThemeGrid_MarginGutter",
            type: "button",
            text: "Delete Group"
        });
        $buttom.click(() => {
            this.removeGroup();
        });

        return $buttom
    }
    buttomMethods.AddRule = function () {
        let $buttom = $("<button>", {
            class: "btn btn-primary ThemeGrid_MarginGutter",
            type: "button",
            text: "Add Rule"
        });
        $buttom.click(() => {
            let newInstance = new Rule(generateGuid());
            this.addRuleToScreen(newInstance);
        });
        return $buttom
    }
    buttomMethods.AddGroup = function () {
        let $buttom = $("<button>", {
            class: "btn btn-primary ThemeGrid_MarginGutter",
            type: "button",
            text: "Add Group"
        });
        $buttom.click(() => {
            this.addRuleToScreen(new GroupRules("AND"));
        });
        return $buttom
    }
    //#endregion

    //#region classes
    class Rule {
        constructor(Field, Column, Operator, Value) {
            this.id = generateGuid();
            this.column = Column;
            this.operator = Operator;
            this.value = Value;
        }
        getHTML() {
            if (this.DELETE == true)
                return ""
            let divBody = new DivElement(this.id, cssClass().RECORD_ITEM);
            divBody.setIntoDiv(
                //this.selectElement().get(this.setInput),
                this.inputColumns().get(),
                this.inputOperators().get(),
                this.inputText().get(),
                this.buttomDeleteRule()
            );
            return divBody.getDiv();
        }
        removeRule() {
            $("#" + this.id).remove();
            Object.assign(this, new Rule());
            this.DELETE = true;
        }
        setColumn(value) {
            this.column = value;
            console.log(this.column);
        }
        setOperator(value) {
            this.operator = value;
            console.log(this.operator);
        }
        setValue(value) {
            this.value = value;
            console.log(this.value);
        }
    }
    class GroupRules {
        constructor(Condition) {
            this.id = generateGuid();
            this.condition = Condition;
            this.rules = [];
            //divs
            this.divWrapper = new DivElement(this.id, cssClass().GROUP_CONTAINER);
            this.divBody = new DivElement(this.id, cssClass().GROUP_BODY);
            this.divList = new DivElement(this.id, cssClass().RECORD_LIST);
            this.divHeader = new DivElement(this.id, cssClass().GROUP_HEADER);
            this.addRule(new Rule())
        }
        addRule(Rule) {
            this.rules.push(Rule);
        }
        addRuleToScreen(Rule) {
            this.addRule(Rule);
            let record = Rule.getHTML();

            this.divList.setIntoDiv(record);
            $(this.divList.getDiv()).append(record);

            this.divBody.setIntoDiv(this.divList.getDiv());

        }
        getHTML() {

            this.divHeader.setIntoDiv(
                this.inputRadio().get(),
                this.buttomAddGroup(),
                this.buttomAddRule(),
                this.buttomDeleteGroup()
            );
            this.divWrapper.setIntoDiv(
                this.divHeader.getDiv(),
                this.divBody.getDiv())

            return this.divWrapper.getDiv();
        }
        getAllHTML(isFirstTime) {

            if (isFirstTime == true) {
                this.getHTML();
            }

            let _rules = this.rules;
            for (let i = 0; i < _rules.length; i++) {
                let element = _rules[i];
                if (element instanceof Rule) {
                    this.divList.setIntoDiv(element.getHTML("", cssClass().GROUP_BODY))
                    this.divBody.setIntoDiv(this.divList.getDiv());
                } else {
                    var ret = new DivElement();

                    this.divList.setIntoDiv(element.getHTML());
                    this.divBody.setIntoDiv(this.divList.getDiv());
                }
            }
            this.divWrapper.setIntoDiv(this.divBody.getDiv());
            return this.divWrapper.getDiv();
        }
        removeGroup() {
            $(this.divWrapper.getDiv()).remove();
            Object.assign(this, new GroupRules());
            this.DELETE = true;
        }
        setCondition(value) {
            this.condition = value;
        }




        /*  getListRulesElements() {
    this.rules.map(x => 
       $(".content").append(x.buttomDelete())
    )
    } */
    }
    class DivElement {
        constructor(Id, Class) {
            this.DIV = $('<div>', { id: Id, class: Class });
        }
        setIntoDiv() {
            var args = Array.prototype.slice.call(arguments);
            args.forEach(element => {
                this.DIV.append(element);
            });
        }
        getDiv() {
            return this.DIV;
        }
    }
    class FieldData {
        constructor() {
            this.fields = [];
        }
        set(value) {
            this.fields = value;
        }
        get() {
            if (this.fields === undefined || this.fields.length == 0)
                this.fields = defaultData.columns();
            return this.fields;
        }
    }
    class OperatorsData {
        constructor() {
            this.operators = [];
        }
        set(value) {
            this.operators = value;
        }
        get() {
            if (this.operators === undefined || this.operators.length == 0)
                this.operators = defaultData.operators();
            return this.operators;
        }
    }
    let initializePrototypes = function () {
        GroupRules.prototype.buttomAddRule = buttomMethods.AddRule;
        GroupRules.prototype.buttomAddGroup = buttomMethods.AddGroup;
        GroupRules.prototype.buttomDeleteGroup = buttomMethods.DeleteGroup;
        GroupRules.prototype.inputRadio = inputs.InputRadio

        Rule.prototype.buttomDeleteRule = buttomMethods.DeleteRule;
        Rule.prototype.inputColumns = inputs.SelectColumns;
        Rule.prototype.inputOperators = inputs.SelectOperators;
        Rule.prototype.inputText = inputs.InputText;
    };
    //#endregion


    let defaultData = [];
    defaultData.columns = function () {
        let _data = [{ name: "entity1", value: 1 }, { name: "entity2", value: 2 }, { name: "entity3", value: 3 }];
        return _data;
    }
    defaultData.operators = function () {
        let operators = [{
            value: "<",
            name: "less than"
        },

        {
            value: ">",
            name: "greater than"
        },
        {
            value: "=",
            name: "Equal"
        },
        {
            value: "<",
            name: "less than"
        },
        {
            value: "±",
            name: "Plus-Minus"
        }
        ];

        return operators;
    }


    let main = function () {
        var _methods = [];
        _methods.init = function (containerId) {
            initializePrototypes();

            let newGroupRules = new GroupRules("AND");
            let rule = new Rule();
            newGroupRules.addRule(new Rule());

            $("#" + containerId).append(newGroupRules.getAllHTML(true));
            return newGroupRules
        };
        return {
            init: _methods.init,
        };
    }

    //#region Global Variables
    let _fields = new FieldData();
    let _operators = new OperatorsData();
    //#endregion

    return {
        init: main().init,
        fields: _fields,
        operators: _operators
    };
});


/* var property = Symbol();
class Something {
    constructor(){
        this[property] = "test";
    }
} */