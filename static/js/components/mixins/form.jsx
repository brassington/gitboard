/**
 * @jsx React.DOM
 */

define(["react",
        "js/utils","jquery"
        ],function (React,Utils,$) {

    'use strict';

    var FormMixin = {

        formatFieldError : function(field){
            if (this.state.fieldErrors !== undefined)
                if (field in this.state.fieldErrors)
                    return <p className="alert alert-warning">{this.state.fieldErrors[field]}</p>
            return undefined;
        },

        formatErrorMessage : function(){
            if (this.state.errorMessage !== undefined)
                return <p className="alert alert-warning">{this.state.errorMessage}</p>;
            return undefined;
        },

        clearFieldError : function(field){
            var newErrors = $.extend({},this.state.fieldErrors);
            delete newErrors[field];
            this.setState({fieldErrors:newErrors});
        },

        clearAllErrors : function(){
            this.setState({fieldErrors:{},errorMessage : undefined});
        },

        addFieldError : function(field, message){
            var newErrors = this.state.fieldErrors;
            newErrors[field] = message;
            this.setState({fieldErrors:newErrors});
        },

        setErrorMessage : function(message){
            this.setState({errorMessage : message});
        },

        clearErrorMessage : function(){
            this.setState({errorMessage : undefined});
        },

        hasErrors : function(){
            if (this.state.fieldErrors === undefined || Object.keys(this.state.fieldErrors).length > 0)
                return true;
            return false;
        },

        componentDidMount : function(){
            this.clearAllErrors();
        },

        parseApiErrorData : function(data){
            if (data === undefined)
                return this.clearAllErrors();
            var fieldErrors = {};
            this.setState({
                fieldErrors: data.errors || {},
                errorMessage: data.message || undefined,
            });
        },

        validate : function(data){
            this.clearAllErrors();
            var validated = true;
            var fieldErrors = {}
            for(var name in this.fields){
                var field = this.fields[name];
                if (!(name in data) || data[name] === undefined || data[name] == ''){
                    if (field.required){
                        validated = false;
                        fieldErrors[name] = "please enter a "+field.name;
                    }
                    continue;
                }
                else
                {
                    if ('regex' in field){
                        var regex = RegExp(field['regex']);
                        if(!regex.test(data[name])){
                            validated = false;
                            fieldErrors[name] = "invalid value for "+field.name;
                        }
                    }
                    if ('validator' in field){
                        try{
                            field.validator(data[name],name,data);
                        }
                        catch(e){
                            fieldErrors[name] = e.message;
                            validated = false;
                        }
                    }
                }

            }
            this.setState({fieldErrors : fieldErrors});
            return validated;
        },

    };

    return FormMixin;
});