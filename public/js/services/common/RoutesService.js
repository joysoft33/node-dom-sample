import angular from 'angular';

export default checkRouteService;

/**
 * The check route service
 * @param {*} AuthService
 * @param {*} $log
 * @param {*} $q
 * @param {*} $transitions
 * @return {*}
 */
function checkRouteService(AuthService, $log, $q, $transitions) {
  'ngInject';

  const service = {};

  service.initialize = function initialize() {
    // Check ui-router transitions
    $transitions.onBefore({}, service.check);
    $transitions.onError({}, service.error);
  };

  service.check = function check(transition) {

    // Get the requested route
    const to = transition.to();

    if (to.data && to.data.requiresLogin) {
      // Get the currently connected user
      const user = AuthService.getUser();
      if (user) {
        // A user is connected
        $log.info(`${to.url} authenticated`);
      } else {
        // User isn’t authenticated
        $log.info(`${to.url} need authentication`);
        // Redirect to login page
        return transition.router.stateService.target('main.login', {
          params: angular.toJson(transition.params()),
          redirect: to.name
        });
      }
    }
  };

  service.error = function error(transition) {

    // Get the rejection cause
    const rejection = transition.error();

    if (typeof rejection === 'string') {
      const states = transition.router.stateRegistry.states;
      // Try to redirect to the default page if any
      for (const name in states) {
        if (states.hasOwnProperty(name)) {
          if (states[name].data && states[name].data.defaultRoute) {
            $log.info(`Redirect to ${name}`);
            return transition.router.stateService.go(name);
          }
        }
      }
    } else if (rejection.type === 6) {
      $log.error('Transition rejected', rejection);
      // Redirect to the error page
      return transition.router.stateService.go('main.error', {
        status: rejection.detail ? rejection.detail.status : '',
        message: rejection.message
      });
    }
  };

  return service;
}