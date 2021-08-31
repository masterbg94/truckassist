// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // API_ENDPOINT: 'http://localhost:5000/api/v2/',
  API_ENDPOINT: 'https://api-test.truckassist.io/api/v2/',
  // API_ENDPOINT: 'https://api-stage.truckassist.io/api/v2/',
  // API: 'http://ta-back.local:8080/api/v1/',
  production: false,
  perPage: 1000,
  page: 1,
  dateFormat: {
    displayFormat: 'MM/dd/yy',
    inputFormat: 'MM/dd/yy',
  },
  baseSocketUrl: 'https://chat-test.truckassist.io',
  baseChatApiUrl: 'https://chat-test.truckassist.io/api/v1',
  messageLimit: 25
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
