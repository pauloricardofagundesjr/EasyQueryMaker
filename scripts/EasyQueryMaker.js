(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.EasyQueryMaker = factory();
    }
})(this, function () {
    "use strict";


    const cssClass = function () {
        return {
            MAIN_CLASS: "easy-query-maker",
            GROUP_CONTAINER: "rules-group-container",
            GROUP_HEADER: "rules-group-header",
            GROUP_BODY: "rules-group-body",
            RECORD_LIST: "rules-list",
            WRAP_BUTTONS: "buttons-header",
            WRAP_RADIOS: "radio-group OSFillParent",
            WRAP_INPUTS: "rule",
            RADIO_CONTAINER: "ThemeGrid_Width2",
            THEMEGRID_6: "ThemeGrid_Width6"
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
            return inputs.selectElementGeneric(options, self, "setColumn");
        }
        return { get: _get }
    }
    inputs.SelectOperators = function () {
        let self = this;
        let _get = function () {
            let options = _operators.get()
            return inputs.selectElementGeneric(options, self, "setOperator");
        }
        return { get: _get }
    }
    //generic select - used by columns and Operators
    inputs.selectElementGeneric = function (options, context, method) {
        let $select = $('<select>', { class: "dropdown-display dropdown" });
        for (let option of options) {
            let element = $("<option>", { value: option.value, text: option.name });
            $select.append(element);
        }
        $select.change(() => {
            let value = $select[0].selectedOptions[0].value;
            context[method](value);
        });
        context[method]($select[0].selectedOptions[0].value);
        /* 
        if (self.operator !== undefined)
            $select.val(self.operator); */

        let $div = new DivElement("", "dropdown-container wrap-input");
        $div.setIntoDiv($select);
        $div.setAttr("data-dropdown");
        return $div.getDiv();

    }
    inputs.InputText = function () {
        let self = this;
        let _get = function () {
            let $inputText = $("<input>", { id: "", type: "text", class: "form-control", "data-input": "" });

            self.setValue($inputText[0].value);

            $inputText.change(() => {
                let value = $inputText[0].value;
                self.setValue(value)
            });
            /*             if (self.value !== undefined)
                            $inputText.val(sel.value); */

            let $div = new DivElement("", "wrap-input");
            $div.setIntoDiv($inputText);

            return $div.getDiv();
        }
        return { get: _get }
    }
    inputs.InputRadio = function () {
        let self = this;
        let _get = function () {
            let radioId1 = generateGuid();
            let radioId2 = generateGuid();

            let $labelAnd = $("<label>", { for: radioId1, text: "AND" });
            let $labelOr = $("<label>", { for: radioId2, text: "OR" });

            let $inputRadio1 = $("<input>", { type: "radio", class: "radio-button", value: "AND", name: self.id, id: radioId1 });
            let $inputRadio2 = $("<input>", { type: "radio", class: "radio-button", value: "OR", name: self.id, id: radioId2 });

            $inputRadio1.click((e) => {
                self.setCondition(e.currentTarget.value);
            });
            $inputRadio2.click((e) => {
                self.setCondition(e.currentTarget.value);
            });

            if (self.condition === "AND") {
                $($inputRadio1).attr('checked', true);
            } else {
                $($inputRadio2).attr('checked', true);
            }

            let $groupRadio = new DivElement("", cssClass().WRAP_RADIOS);
            let radio1 = new DivElement("", cssClass().RADIO_CONTAINER);
            radio1.setIntoDiv($inputRadio1, $labelAnd);
            radio1.setAttr("data-radio-button");

            let radio2 = new DivElement("", cssClass().RADIO_CONTAINER);
            radio2.setIntoDiv($inputRadio2, $labelOr);
            radio2.setAttr("data-radio-button");

            $groupRadio.setIntoDiv(
                radio1.getDiv(),
                radio2.getDiv()
            );
            $groupRadio.setAttr("data-radio-group");

            let $divWrapper = new DivElement("", cssClass().THEMEGRID_6);
            $divWrapper.setIntoDiv(
                $groupRadio.getDiv()
            );

            if (self.value !== undefined)
                $inputText.val(self.operator);

            return $divWrapper.getDiv();
        }
        return { get: _get }
    }
    //#endregion

    //#region ButtonsMethods
    let buttomMethods = [];
    buttomMethods.DeleteRule = function () {
        let $buttom = $("<button>", {
            class: "btn btn-delete ThemeGrid_MarginGutter",
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
            class: "btn btn-delete ThemeGrid_MarginGutter",
            type: "button",
            text: "Delete"
        });
        $buttom.click(() => {
            this.removeGroup();
        });

        return $buttom
    }
    buttomMethods.AddRule = function () {
        let $buttom = $("<button>", {
            class: "btn btn-success ThemeGrid_MarginGutter",
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
            class: "btn btn-success ThemeGrid_MarginGutter",
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
            let divBody = new DivElement(this.id, cssClass().WRAP_INPUTS);
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
        }
        setOperator(value) {
            this.operator = value;
        }
        setValue(value) {
            this.value = value;
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
        getHTML(isFirstTime) {
            let wrapButtons = new DivElement("", cssClass().WRAP_BUTTONS);
            wrapButtons.setIntoDiv(
                this.buttomAddGroup(),
                this.buttomAddRule(),
                (isFirstTime === undefined ? this.buttomDeleteGroup() : "")
            );

            wrapButtons.setStyle({ "text-align": "right", "margin-left": "0px" });
            this.divHeader.setIntoDiv(
                this.inputRadio().get(),
                wrapButtons.getDiv()

            );

            this.divWrapper.setIntoDiv(
                this.divHeader.getDiv(),
                this.divBody.getDiv())

            return this.divWrapper.getDiv();
        }
        getAllHTML(isFirstTime) {

            if (isFirstTime == true) {
                this.getHTML(isFirstTime);
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
        setAttr(value) {
            $(this.DIV).attr(value, "");
        }
        setStyle(style) {
            $(this.DIV).css(style);
        }
    }
    class Operator {
        constructor(name, value, expression) {
            this.name = name;
            this.value = value;
            this.expression = expression;
        }
        get() {
            return {
                name: this.name,
                value: this.value,
                expression: this.expression
            }
        }
    }
    class OperatorList {
        constructor() {
            this.operatorsList = [];
        }
        set(value) {
            if (!value instanceof Operator)
                throw "The obkect instance is not valid";
            this.operatorsList.push(value);
        }
        setList(list) {
            for (let item of list) {
                this.operatorsList.push(new Operator(item.name, item.value, item.expression));
            }
        }
        get() {
            if (this.operatorsList.length === 0) {
                this.operatorsList = defaultData.operators();
            }
            return this.operatorsList;
        }
        getById(Id) {
            return this.operatorsList.find(x => String(x.value) === Id);
        }
    }
    class Column {
        constructor(name, value, dataType) {
            this.name = name;
            this.value = value;
            this.dataType = dataType;
            if (DataType()[this.dataType] === undefined)
                throw "Datatype is not defined";
        }
        get() {
            return {
                name: this.name,
                value: this.value,
                dataType: this.dataType
            }
        }
    }
    class ColumnList {
        constructor() {
            this.fields = [];
        }
        set(value) {
            if (!value instanceof Column)
                throw "The obkect instance is not valid";
            this.fields.push(value);
        }
        setList(list) {
            for (let item of list) {
                this.fields.push(new Column(item.name, item.value, item.dataType));
            }
        }
        setJsonList(Json) {
            this.setList(JSON.parse(Json));
        }
        get() {
            if (this.fields.length === 0) {
                this.fields = defaultData.columns();
            }
            return this.fields;
        }
        getById(Id) {
            return this.fields.find(x => String(x.value) === Id);
        }
    }
    class Main {
        constructor() {
            this.ruleset = [];
        }
        init(containerId) {
            initializePrototypes();
            this.ruleset = new GroupRules("AND");
            //this.ruleset.addRule(new Rule());
            $("#" + containerId).addClass(cssClass().MAIN_CLASS)
            $("#" + containerId).append(this.ruleset.getAllHTML(true));
        }
        getFilters() {
            return read(this.ruleset);
        }
        getJson() {
            return buildJson(this.ruleset);
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
    const DataType = function () {
        return {
            string: "string",
            boolean: "boolean",
            number: "number"
        }
    }
    //#endregion

    //#region Private functions
    let read = function (ruleset) {
        return ruleset.rules.map((rule) => {
            if (rule.DELETE === true)
                return undefined;
            if (rule.rules) {
                var stringValue = "(" + read(rule) + ")";
                return stringValue;
            }
            if (rule.column === undefined || rule.value === undefined || rule.operator === undefined)
                return undefined;

            let columnObj = _fields.getById(rule.column);
            let operatorObj = _operators.getById(rule.operator);

            var column = rule.column;
            var operator = rule.operator;
            var value = rule.value;

            let operatorProperties = [];
            if (operatorObj != undefined) {
                operatorProperties = {
                    operator_Name: operatorObj.name,
                    operator_Value: operatorObj.value,
                    operator_expression: operatorObj.expression
                }
            }
            else {
                throw "Error to get operator values";
            }

            let dataTypeObj;
            //check if columnObj is not null
            if (columnObj != undefined) {
                dataTypeObj = columnObj.dataType;
            }

            //override value based on the expression
            if (operatorProperties.operator_expression != undefined) {
                let callBackReturn = operatorProperties.operator_expression(columnObj, operatorObj, value);
                return (typeof callBackReturn == DataType().string ? callBackReturn : "")
            }

            //override value based on the sql validation
            value = valueToSQL(rule.value, dataTypeObj);

            if (isDefined(column) && isDefined(value) && isDefined(operator)) {
                return "(" + (column + " " + operator + " " + value).trim() + ")";
            }
        }).filter(isDefined).join(" " + ruleset.condition + " ");
    };

    let buildJson = function(ruleset){
        return ruleset.rules.map((rule) => {
            if (rule.DELETE === true)
                return undefined;
            if (rule.rules) {
                var obj = buildJson(rule)
            }
            return {
                Column: rule.column,
                Operator: rule.operator,
                Value: rule.value
            }

        })
    }

    let valueToSQL = function (value, dataType) {
        switch (dataType) {
            case 'boolean':
                return value ? '1' : '0';
            case 'number':
                if (isFinite(value)) return value;
            default:
                return "'" + value + "'";
        }
    };

    let isDefined = function (value) {
        return value !== undefined;
    }   
    //#endregion

    //#region Global Variables
    let defaultData = [];
    defaultData.columns = function () {
        let list = new ColumnList();
        list.setList([{ name: "entity1", value: 1, dataType: DataType().string }, { name: "entity2", value: 2, dataType: DataType().number }, { name: "entity3", value: 3, dataType: DataType().boolean }]);
        return list.get();

    }
    defaultData.operators = function () {
        let operators = [{
            value: "=",
            name: "Equal"
        },
        {
            value: "<",
            name: "Less than"
        },
        {
            value: ">",
            name: "Greater than"
        },
        {
            value: ">=",
            name: "Greater than or equal to"
        },
        {
            value: "<=",
            name: "Less than or equal to"
        },
        {
            value: "<>",
            name: "Not equal to"
        },
        {
            value: "LIKE",
            name: "Like",
            expression: function (columnObj, operatorObj, inputValue) {      
                return columnObj.value+ " " +operatorObj.value + " " + "'%"+inputValue+"%'";
            }
        }];
      
        let list = new OperatorList();
        list.setList(operators);
        return list.get();
    }

    let _fields = new ColumnList();
    let _operators = new OperatorList();
    //#endregion

    return {
        main: new Main(),
        fields: _fields,
        operators: _operators
    };
});
