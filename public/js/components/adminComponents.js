import angular from 'angular';
import translate from 'angular-translate';

import paginator from './public/paginator/paginator';
import navbar from './admin/navbar/navbar';
import login from './common/login/login';
import error from './common/error/error';
import main from './common/main/main';

import usersList from './admin/users/usersList';
import userEdit from './admin/users/userEdit';

const components = angular.module('adminComponents', [
  translate
]);

components
  .component('paginator', paginator)
  .component('navbar', navbar)
  .component('login', login)
  .component('error', error)
  .component('main', main)
  .component('usersList', usersList)
  .component('userEdit', userEdit);

export default components.name;