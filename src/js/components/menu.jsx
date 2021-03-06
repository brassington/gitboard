/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/

/*
Copyright (c) 2015 - Andreas Dewes

This file is part of Gitboard.

Gitboard is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

define(["react","js/utils",
        "js/api/github/user",
        "js/components/generic/flash_messages",
        "js/components/mixins/loader",
        "jquery"
        ],
        function (React,Utils,UserApi,FlashMessages,LoaderMixin,$) {
        'use strict';

        var Menu = React.createClass({

            mixins : [LoaderMixin],

            resources : function(props){

                var logout  = function(){
                    Utils.logout();
                    Utils.redirectTo(Utils.makeUrl('/login'));
                };
                
                if (Utils.isLoggedIn()){
                    return [
                    {
                        name : 'user',
                        endpoint : this.apis.user.getProfile,
                        nonBlocking : true,
                        nonCritical : true,
                        error : logout
                    }
                    ];
                }
                return [];
            },

            silentLoading : true,
            displayName: 'Menu',

            getInitialState: function () {
                return {user: {admin: false}, project: {roles: {admin: []}}};
            },

            getDefaultProps : function (){
                return {};
            },

            componentWillMount : function(){
                this.userApi = UserApi.getInstance();
            },

            render: function () {

                var projectMenu;
                var adminMenu;

                var FlashMessagesMenu = FlashMessages.FlashMessagesMenu;
                var flashMessagesMenu = <FlashMessagesMenu baseUrl={this.props.baseUrl} params={this.props.params} />;
                flashMessagesMenu = undefined;  /* quick switch to activate or deactivate */

                var menu;
                if (Utils.isLoggedIn()){
                    menu = [<ul className="nav navbar-nav" key={"navbar-loggedin"}>
                        <li><A href={Utils.makeUrl("/repositories")}>Your Repositories</A></li>
                        <li><A href={Utils.makeUrl("/organizations")}>Your Organizations</A></li>
                    </ul>,
                    <ul className="nav navbar-nav navbar-right" key={"navbar-loggedin-right"}>
                        {projectMenu}
                        <li><A href={Utils.makeUrl("/logout")}>Logout</A></li>
                    </ul>];
                }
                else{
                    menu = [<ul className="nav navbar-nav" key={"navbar-loggedout"}>
                    </ul>,
                    <ul className="nav navbar-nav navbar-right" key={"navbar-loggedout-right"}>
                        <li><A href={Utils.makeUrl("/login")}>Login</A></li>
                        {flashMessagesMenu}
                    </ul>];
                }
                return <div ref="navMain" id="nav-main" className="nav-collapse">
                        {menu}
                    </div>;
            }
        });

        return Menu;
});
