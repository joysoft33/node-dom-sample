import angular from 'angular';
import resources from 'angular-resource';
import localStorage from 'angular-local-storage';

import categories from './CategoriesService';
import recipes from './RecipesService';
import routes from './RoutesService';
import users from './UsersService';
import auth from './AuthService';

const services = angular.module('publicServices', [
  localStorage,
  resources
]);

services
  .factory('CategoriesService', categories)
  .factory('RecipesService', recipes)
  .factory('RoutesService', routes)
  .factory('UsersService', users)
  .factory('AuthService', auth);

export default services.name;