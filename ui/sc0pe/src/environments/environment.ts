// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: "http://localhost:3001/",
  ws: "ws://localhost:3001/",
  scanTypes: [
    {name: "Normal", n: "normal"},
    {name: "Stealth", n: "stealth"},
    {name: "Discover", n: "discover"},
    {name: "Port", n: "port"},
    {name: "Fullport Only", n: "fp"},
    {name: "Web", n: "web"},
    {name: "HTTP web port", n: "webporthttp"},
    {name: "HTTPS web port", n: "webporthttps"},
    {name: "Webscan", n: "webscan"},
  ],
  schedule: [
    {name: "Daily", n: "daily"},
    {name: "Weekly", n: "weekly"},
    {name: "Monthly", n: "monthly"}
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
