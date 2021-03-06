/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/

define(["react","jquery","bootstrap"],function (React,$,Bootstrap) {
    'use strict';

    var BootstrapModal = React.createClass({
      // The following two methods are the only places we need to
      // integrate with Bootstrap or jQuery!
      displayName: 'BootstrapModal',

      close: function() {
        this.setState({hidden : true});
      },

      open: function() {
        this.setState({hidden : false});
      },

      getInitialState : function(){
        return {hidden : this.props.hidden !== undefined ? this.props.hidden : true}
      },

      getDefaultProps : function(){
        return {closable : true,disabled : false,raw : false};
      },

      componentWillReceiveProps : function(props){
        if (props.hidden && props.hidden != this.state.hidden)
            this.setState({hidden : props.hidden});
      },

      render: function() {
        if (this.state.hidden)
            return <div ref="modal"/>;

        var confirmButton;
        var cancelButton;

        if (this.props.confirm) {
          confirmButton = (
            <button
              onClick={this.handleConfirm}
              disabled={this.props.disabled}
              className="btn btn-primary">
              {this.props.confirm}
            </button>
          );
        }

        var closeButton;

        if (this.props.closable){
          closeButton = <button
            type="button"
            className="close pull-right"
            disabled={this.props.disabled}
            onClick={this.handleCancel}>
              <i className="fa fa-times" />
          </button>
        }

        if (this.props.cancel) {
          cancelButton = (
            <button className="btn" disabled={this.props.disabled} onClick={this.handleCancel}>
              {this.props.cancel}
            </button>
          );
        }

        var footer;

        if ((this.props.onCancel || this.props.onConfirm) && !this.props.raw){
          footer = <div className="modal-footer">
            {cancelButton}
            {confirmButton}
          </div>
        }
        var content;

        if (this.props.getContent)
            content = this.props.getContent();
        else
            content = this.props.children;

        if (!this.props.raw)
            content = [<div className="modal-body">{content}</div>,footer]

        return (
          <div className="modal show" ref="modal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  
                  <h3>{this.props.title}{closeButton}</h3>
                </div>
                {content}
              </div>
            </div>
            <div className="modal-backdrop in" onClick={this.props.closable ? this.handleCancel : function(e){e.preventDefault();}}></div>
          </div>
        );
      },

      handleCancel: function(e) {
        if (this.props.onCancel)
          this.props.onCancel(e);
        e.preventDefault();
        this.close();
      },

      handleConfirm: function(e) {
        if (this.props.onConfirm)
          this.props.onConfirm(e);
        e.preventDefault();
      }
    });

    return BootstrapModal;
});
