(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "/XWD":
/*!********************************************************!*\
  !*** ./src/app/modules/map/mapdiv/mapdiv.component.ts ***!
  \********************************************************/
/*! exports provided: MapDivComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapDivComponent", function() { return MapDivComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! esri-loader */ "r6rm");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(esri_loader__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_services_map_map_custom_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/map/map-custom.service */ "z9WN");





const _c0 = ["viewContainerRef"];
const _c1 = ["mapViewNode"];
class MapDivComponent {
    constructor(mapCustomService, CFR, cdref) {
        this.mapCustomService = mapCustomService;
        this.CFR = CFR;
        this.cdref = cdref;
        this.index = 0;
        this.componentsReferences = [];
        this.events = [];
        this.georeferences = [];
        this.sub = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
        this.href = "";
        this.currentURL = "";
        this.loading = false;
        this.firstview = false;
        this.filtersactive = false;
        this.filterspoints = [];
    }
    ngAfterViewInit() {
        this.getDatafromGeoJson();
        this.cdref.detectChanges();
    }
    getDatafromGeoJson() {
        fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-locations")
            .then(res => res.json())
            .then((out) => {
            if (out.errorMessage == undefined) {
                this.loading = false;
                this.buildmap(out);
            }
            else {
                setTimeout(() => {
                    this.counterror = this.counterror + 1;
                    if (this.counterror < 10) {
                        this.getDatafromGeoJson();
                    }
                }, 100);
            }
        }).catch(err => console.error(err));
    }
    buildmap(json) {
        this.jsonmap = json;
        const blob = new Blob([JSON.stringify(json)], {
            type: "application/json"
        });
        const urljson = URL.createObjectURL(blob);
        return Object(esri_loader__WEBPACK_IMPORTED_MODULE_2__["loadModules"])([
            "esri/Map",
            "esri/views/MapView",
            "esri/Graphic",
            "esri/geometry/Point",
            "esri/rest/route",
            "esri/rest/support/RouteParameters",
            "esri/rest/support/FeatureSet",
            "esri/config",
            "esri/widgets/Expand"
        ])
            .then(([Map, MapView, Graphic, Point, route, RouteParameters, FeatureSet, esriConfig, Expand]) => {
            const map = new Map({
                basemap: "arcgis-navigation"
            });
            esriConfig.apiKey = "AAPK304c230c0e0e488dbe5b69b257f55ef0Eu9jOtbwGIvKFvH3fwYHPaa0qIEBQDop0q3Oym5x0ZKK7rsvqiH88X_UrIDiBit7";
            const center = new Point([-122.62, 45.526201]);
            const origin = new Point([-122.690176, 45.522054]);
            const stop = new Point([-122.614995, 45.526201]);
            const destination = new Point([-122.68782, 45.51238]);
            this.mapView = new MapView({
                container: this.mapViewEl.nativeElement,
                map: map,
                center: center,
                zoom: 12,
                constraints: {
                    snapToZoom: false
                }
            });
            this.mapView.when(() => {
                addGraphic("start", origin);
                addGraphic("stop", stop);
                addGraphic("finish", destination);
                getRoute();
            });
            this.mapView.on("click", (event) => {
                if (this.mapView.graphics.length === 0) {
                    addGraphic("start", event.mapPoint);
                }
                else if (this.mapView.graphics.length === 1) {
                    addGraphic("stop", event.mapPoint);
                }
                else if (this.mapView.graphics.length === 2) {
                    addGraphic("finish", event.mapPoint);
                    getRoute();
                }
                else {
                    this.mapView.graphics.removeAll();
                    this.mapView.ui.empty("top-right");
                    addGraphic("start", event.mapPoint);
                }
            });
            function addGraphic(type, point) {
                let color = "#ffffff";
                let outlineColor = "#000000";
                let size = "12px";
                if (type == "start") {
                    color = "#ffffff";
                }
                else if (type == "stop") {
                    color = "#000000";
                    outlineColor = "#ffffff";
                    size = "8px";
                }
                else {
                    color = "#000000";
                    outlineColor = "#ffffff";
                }
                const graphic = new Graphic({
                    symbol: {
                        type: "simple-marker",
                        color: color,
                        size: size,
                        outline: {
                            color: outlineColor,
                            width: "1px"
                        }
                    },
                    geometry: point
                });
                this.mapView.graphics.add(graphic);
            }
            function getRoute() {
                const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
                const routeParams = new RouteParameters({
                    stops: new FeatureSet({
                        features: this.mapView.graphics.toArray()
                    }),
                    returnDirections: true
                });
                route.solve(routeUrl, routeParams)
                    .then((data) => {
                    if (data.routeResults.length > 0) {
                        showRoute(data.routeResults[0].route);
                        showDirections(data.routeResults[0].directions.features);
                    }
                })
                    .catch((error) => {
                    console.log(error);
                });
            }
            function showRoute(routeResult) {
                routeResult.symbol = {
                    type: "simple-line",
                    color: [5, 150, 255],
                    width: 3
                };
                this.mapView.graphics.add(routeResult, 0);
            }
            function showDirections(directions) {
                function showRouteDirections(directions) {
                    const directionsList = document.createElement("ol");
                    directions.forEach(function (result, i) {
                        const direction = document.createElement("li");
                        direction.innerHTML = result.attributes.text + ((result.attributes.length > 0) ? " (" + result.attributes.length.toFixed(2) + " miles)" : "");
                        directionsList.appendChild(direction);
                    });
                    directionsElement.appendChild(directionsList);
                }
                const directionsElement = document.createElement("div");
                directionsElement.innerHTML = "<h3>Directions</h3>";
                //  directionsElement.classList = "esri-widget esri-widget--panel esri-directions__scroller directions";
                directionsElement.style.marginTop = "0";
                directionsElement.style.padding = "0 15px";
                directionsElement.style.minHeight = "365px";
                showRouteDirections(directions);
                this.mapView.ui.empty("top-right");
                this.mapView.ui.add(new Expand({
                    view: this.mapView,
                    content: directionsElement,
                    expanded: true,
                    mode: "floating"
                }), "top-right");
            }
        })
            .catch(err => {
            console.error(err);
        });
    }
    ngOnInit() {
    }
}
MapDivComponent.ɵfac = function MapDivComponent_Factory(t) { return new (t || MapDivComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_core_services_map_map_custom_service__WEBPACK_IMPORTED_MODULE_3__["MapCustomService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"])); };
MapDivComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: MapDivComponent, selectors: [["app-mapdiv"]], viewQuery: function MapDivComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c1, true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.VCR = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.mapViewEl = _t.first);
    } }, decls: 7, vars: 0, consts: [[1, "p-col-12"], ["id", "esri-view"], ["mapViewNode", ""], ["id", "infoDiv", 1, "esri-widget"], ["id", "cluster", 1, "esri-button"], ["id", "legendDiv"]], template: function MapDivComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 1, 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Disable Clustering");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["@import 'https://js.arcgis.com/4.10/esri/css/main.css';\r\n\r\n.esri-view[_ngcontent-%COMP%] {\r\n  height: 600px;\r\n}\r\n\r\n.container[_ngcontent-%COMP%]{\r\n \r\n\r\n}\r\n\r\n.container-principal[_ngcontent-%COMP%]{\r\n  max-width: 100%;\r\n  height:100%;\r\n  position: relative;\r\n\r\n}\r\n\r\n.container-map[_ngcontent-%COMP%]{\r\n  height:780px;\r\n  width:1200px;\r\n\r\n  position: relative;\r\n\r\n\r\n}\r\n\r\n.pi-search[_ngcontent-%COMP%]{\r\n  margin-left: -40px !important;\r\n}\r\n\r\n.map[_ngcontent-%COMP%]{\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n}\r\n\r\n.summary[_ngcontent-%COMP%]{\r\n    position: sticky;\r\n    margin-top: 0;\r\n    background-color: black;\r\n    height: 15vh;\r\n    bottom:0;\r\n\r\n\r\n\r\n}\r\n\r\n.mapboxgl-popup-content[_ngcontent-%COMP%] {\r\n    color: black !important;\r\n}\r\n\r\n.mapboxgl-ctrl-group[_ngcontent-%COMP%]{\r\n    color: black;\r\n}\r\n\r\n.p-tabmenuitem[_ngcontent-%COMP%] {\r\n  width: 33.33% !important;\r\n\r\n}\r\n\r\n.titleGeneral[_ngcontent-%COMP%]{\r\n  font-size: 24px;\r\n  color: #000 !important;\r\n  font-family: fuenteparatitulos;\r\n\r\n}\r\n\r\n@media screen and (max-width: 780px) {\r\n  .container-principal[_ngcontent-%COMP%]{\r\n    margin-top: 2%;\r\n    margin-left: 5%;\r\n    max-width: 90%;\r\n  }\r\n}\r\n\r\nbutton[_ngcontent-%COMP%]{\r\n  background: rgba(236, 234, 234, 0.712);\r\n  border: none;\r\n  border-radius: 12px;\r\n\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcGRpdi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNEQUFzRDs7QUFFdEQ7RUFDRSxhQUFhO0FBQ2Y7O0FBR0E7Q0FDQyxxQkFBcUI7O0FBRXRCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLFdBQVc7RUFDWCxrQkFBa0I7O0FBRXBCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLFlBQVk7O0VBRVosa0JBQWtCOzs7QUFHcEI7O0FBQ0E7RUFDRSw2QkFBNkI7QUFDL0I7O0FBSUE7O0lBRUksV0FBVztJQUNYLFlBQVk7O0FBRWhCOztBQUNBO0lBQ0ksZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYix1QkFBdUI7SUFDdkIsWUFBWTtJQUNaLFFBQVE7Ozs7QUFJWjs7QUFHQTtJQUNJLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLFlBQVk7QUFDaEI7O0FBRUE7RUFDRSx3QkFBd0I7O0FBRTFCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLHNCQUFzQjtFQUN0Qiw4QkFBOEI7O0FBRWhDOztBQUdBO0VBQ0U7SUFDRSxjQUFjO0lBQ2QsZUFBZTtJQUNmLGNBQWM7RUFDaEI7QUFDRjs7QUFFQTtFQUNFLHNDQUFzQztFQUN0QyxZQUFZO0VBQ1osbUJBQW1COztBQUVyQiIsImZpbGUiOiJtYXBkaXYuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJ2h0dHBzOi8vanMuYXJjZ2lzLmNvbS80LjEwL2VzcmkvY3NzL21haW4uY3NzJztcclxuXHJcbi5lc3JpLXZpZXcge1xyXG4gIGhlaWdodDogNjAwcHg7XHJcbn1cclxuXHJcblxyXG4uY29udGFpbmVye1xyXG4gLyogIG1hcmdpbi10b3A6IDIlOyAqL1xyXG5cclxufVxyXG5cclxuLmNvbnRhaW5lci1wcmluY2lwYWx7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDoxMDAlO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbn1cclxuXHJcbi5jb250YWluZXItbWFwe1xyXG4gIGhlaWdodDo3ODBweDtcclxuICB3aWR0aDoxMjAwcHg7XHJcblxyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcblxyXG59XHJcbi5waS1zZWFyY2h7XHJcbiAgbWFyZ2luLWxlZnQ6IC00MHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcblxyXG5cclxuLm1hcHtcclxuXHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuXHJcbn1cclxuLnN1bW1hcnl7XHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG4gICAgbWFyZ2luLXRvcDogMDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgaGVpZ2h0OiAxNXZoO1xyXG4gICAgYm90dG9tOjA7XHJcblxyXG5cclxuXHJcbn1cclxuXHJcblxyXG4ubWFwYm94Z2wtcG9wdXAtY29udGVudCB7XHJcbiAgICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hcGJveGdsLWN0cmwtZ3JvdXB7XHJcbiAgICBjb2xvcjogYmxhY2s7XHJcbn1cclxuXHJcbi5wLXRhYm1lbnVpdGVtIHtcclxuICB3aWR0aDogMzMuMzMlICFpbXBvcnRhbnQ7XHJcblxyXG59XHJcblxyXG4udGl0bGVHZW5lcmFse1xyXG4gIGZvbnQtc2l6ZTogMjRweDtcclxuICBjb2xvcjogIzAwMCAhaW1wb3J0YW50O1xyXG4gIGZvbnQtZmFtaWx5OiBmdWVudGVwYXJhdGl0dWxvcztcclxuXHJcbn1cclxuXHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3ODBweCkge1xyXG4gIC5jb250YWluZXItcHJpbmNpcGFse1xyXG4gICAgbWFyZ2luLXRvcDogMiU7XHJcbiAgICBtYXJnaW4tbGVmdDogNSU7XHJcbiAgICBtYXgtd2lkdGg6IDkwJTtcclxuICB9XHJcbn1cclxuXHJcbmJ1dHRvbntcclxuICBiYWNrZ3JvdW5kOiByZ2JhKDIzNiwgMjM0LCAyMzQsIDAuNzEyKTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuXHJcbn1cclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MapDivComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-mapdiv',
                templateUrl: './mapdiv.component.html',
                styleUrls: ['./mapdiv.component.css']
            }]
    }], function () { return [{ type: _core_services_map_map_custom_service__WEBPACK_IMPORTED_MODULE_3__["MapCustomService"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"] }]; }, { VCR: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['viewContainerRef', { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], static: false }]
        }], mapViewEl: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['mapViewNode']
        }] }); })();


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\train\version_estable\pacific-railway\src\main.ts */"zUnb");


/***/ }),

/***/ 1:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 3:
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "9vGm":
/*!******************************************************!*\
  !*** ./src/app/core/services/aws-cognito.service.ts ***!
  \******************************************************/
/*! exports provided: AwsCognitoService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AwsCognitoService", function() { return AwsCognitoService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ "AytR");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");





class AwsCognitoService {
    constructor(http) {
        this.http = http;
    }
    getTokenDetailsFromCognito(callbackCode) {
        const details = {
            grant_type: 'authorization_code',
            code: callbackCode,
            scope: 'openid+email',
            redirect_uri: src_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].redirectURL
        };
        const formBody = Object.keys(details)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(details[key])}`)
            .join('&');
        return this.http.post(src_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].cognitoTokenURL, formBody, {
            responseType: 'json',
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + btoa(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].sso_api_username}:${src_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].sso_api_pwd}`)
            })
        });
    }
    logoutUserFromCognito() {
        return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].logout);
    }
}
AwsCognitoService.ɵfac = function AwsCognitoService_Factory(t) { return new (t || AwsCognitoService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"])); };
AwsCognitoService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AwsCognitoService, factory: AwsCognitoService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AwsCognitoService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }]; }, null); })();


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false,
    API_URL_BASE: 'https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/',
    region: 'YOUR_REGION_ID',
    userPoolId: 'YOUR_USER_POOL_ID',
    clientId: 'YOUR_CLIENT_ID',
    sso_api_username: 'us-west-2_YKTiEMjtU',
    sso_api_pwd: 's7ch645u8voh00dridmn8kn19',
    loginURL: 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/authorize?client_id=s7ch645u8voh00dridmn8kn19&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d1klk34joigd80.amplifyapp.com%2Fcurrent-chassis-location',
    redirectURL: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',
    cognitoTokenURL: 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/token',
    logout: 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/logout?' +
        'client_id=s7ch645u8voh00dridmn8kn19&' +
        'logout_uri=https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "D7ye":
/*!********************************************************!*\
  !*** ./src/app/modules/esri-map/esri-map.component.ts ***!
  \********************************************************/
/*! exports provided: EsriMapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EsriMapComponent", function() { return EsriMapComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! esri-loader */ "r6rm");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(esri_loader__WEBPACK_IMPORTED_MODULE_2__);

/*
  Copyright 2019 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/



const _c0 = ["mapViewNode"];
class EsriMapComponent {
    constructor() {
        this.mapLoadedEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        /**
         * _zoom sets map zoom
         * _center sets map center
         * _basemap sets type of map
         * _loaded provides map loaded status
         */
        this._zoom = 10;
        this._center = [0.1278, 51.5074];
        this._basemap = "streets";
        this._loaded = false;
        this._view = null;
    }
    get mapLoaded() {
        return this._loaded;
    }
    set zoom(zoom) {
        this._zoom = zoom;
    }
    get zoom() {
        return this._zoom;
    }
    set center(center) {
        this._center = center;
    }
    get center() {
        return this._center;
    }
    set basemap(basemap) {
        this._basemap = basemap;
    }
    get basemap() {
        return this._basemap;
    }
    initializeMap() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            try {
                // Load the modules for the ArcGIS API for JavaScript
                const [EsriMap, EsriMapView] = yield Object(esri_loader__WEBPACK_IMPORTED_MODULE_2__["loadModules"])([
                    "esri/Map",
                    "esri/views/MapView"
                ]);
                // Configure the Map
                const mapProperties = {
                    basemap: this._basemap
                };
                const map = new EsriMap(mapProperties);
                // Initialize the MapView
                const mapViewProperties = {
                    container: this.mapViewEl.nativeElement,
                    center: this._center,
                    zoom: this._zoom,
                    map: map
                };
                this._view = new EsriMapView(mapViewProperties);
                yield this._view.when();
                return this._view;
            }
            catch (error) {
                console.log("EsriLoader: ", error);
            }
        });
    }
    ngOnInit() {
        // Initialize MapView and return an instance of MapView
        this.initializeMap().then(mapView => {
            // The map has been initialized
            this._loaded = this._view.ready;
            this.mapLoadedEvent.emit(true);
        });
    }
    ngOnDestroy() {
        if (this._view) {
            // destroy the map view
            this._view.container = null;
        }
    }
}
EsriMapComponent.ɵfac = function EsriMapComponent_Factory(t) { return new (t || EsriMapComponent)(); };
EsriMapComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: EsriMapComponent, selectors: [["app-esri-map"]], viewQuery: function EsriMapComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵstaticViewQuery"](_c0, true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.mapViewEl = _t.first);
    } }, inputs: { zoom: "zoom", center: "center", basemap: "basemap" }, outputs: { mapLoadedEvent: "mapLoadedEvent" }, decls: 10, vars: 0, consts: [[1, "container-principal"], [1, "row", "card"], [1, "p-col-10", "p-offset-1"], ["mapViewNode", ""]], template: function EsriMapComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "div", null, 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } }, styles: ["@import url(\"https://js.arcgis.com/4.12/esri/css/main.css\");\n\n.esri-view[_ngcontent-%COMP%] {\n  height: 500px;\n}\n.container[_ngcontent-%COMP%] {\n  margin-top: 2%;\n}\n.container-principal[_ngcontent-%COMP%] {\n  max-width: 100%;\n  height: 100%;\n  position: relative;\n}\n.container-map[_ngcontent-%COMP%] {\n  height: 780px;\n  width: 1200px;\n  position: relative;\n}\n.pi-search[_ngcontent-%COMP%] {\n  margin-left: -40px !important;\n}\n.map[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n}\n.summary[_ngcontent-%COMP%] {\n  position: sticky;\n  margin-top: 0;\n  background-color: black;\n  height: 15vh;\n  bottom: 0;\n}\n.mapboxgl-popup-content[_ngcontent-%COMP%] {\n  color: black !important;\n}\n.mapboxgl-ctrl-group[_ngcontent-%COMP%] {\n  color: black;\n}\n.p-tabmenuitem[_ngcontent-%COMP%] {\n  width: 33.33% !important;\n}\n.titleGeneral[_ngcontent-%COMP%] {\n  font-size: 24px;\n  color: #000 !important;\n  font-family: fuenteparatitulos;\n}\n@media screen and (max-width: 780px) {\n  .container-principal[_ngcontent-%COMP%] {\n    margin-top: 2%;\n    margin-left: 5%;\n    max-width: 90%;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxlc3JpLW1hcC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ1EsMkRBQUE7QUFEUixrQ0FBQTtBQUdBO0VBQ0UsYUFBQTtBQUFGO0FBSUE7RUFDRSxjQUFBO0FBREY7QUFLQTtFQUNFLGVBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7QUFGRjtBQU1BO0VBQ0UsYUFBQTtFQUNBLGFBQUE7RUFFQSxrQkFBQTtBQUpGO0FBUUE7RUFDRSw2QkFBQTtBQUxGO0FBVUE7RUFFSSxXQUFBO0VBQ0EsWUFBQTtBQVJKO0FBV0E7RUFDSSxnQkFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLFlBQUE7RUFDQSxTQUFBO0FBUko7QUFlQTtFQUNJLHVCQUFBO0FBWko7QUFlQTtFQUNJLFlBQUE7QUFaSjtBQWVBO0VBQ0Usd0JBQUE7QUFaRjtBQWdCQTtFQUNFLGVBQUE7RUFDQSxzQkFBQTtFQUNBLDhCQUFBO0FBYkY7QUFrQkE7RUFDRTtJQUNFLGNBQUE7SUFDQSxlQUFBO0lBQ0EsY0FBQTtFQWZGO0FBQ0YiLCJmaWxlIjoiZXNyaS1tYXAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpbXBvcnQgdGhlIHJlcXVpcmVkIEpTQVBJIGNzcyAqL1xyXG5AaW1wb3J0IHVybCgnaHR0cHM6Ly9qcy5hcmNnaXMuY29tLzQuMTIvZXNyaS9jc3MvbWFpbi5jc3MnKTtcclxuXHJcbi5lc3JpLXZpZXcge1xyXG4gIGhlaWdodDogNTAwcHg7XHJcbn1cclxuXHJcblxyXG4uY29udGFpbmVye1xyXG4gIG1hcmdpbi10b3A6IDIlO1xyXG5cclxufVxyXG5cclxuLmNvbnRhaW5lci1wcmluY2lwYWx7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDoxMDAlO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbn1cclxuXHJcbi5jb250YWluZXItbWFwe1xyXG4gIGhlaWdodDo3ODBweDtcclxuICB3aWR0aDoxMjAwcHg7XHJcblxyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcblxyXG59XHJcbi5waS1zZWFyY2h7XHJcbiAgbWFyZ2luLWxlZnQ6IC00MHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcblxyXG5cclxuLm1hcHtcclxuXHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuXHJcbn1cclxuLnN1bW1hcnl7XHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG4gICAgbWFyZ2luLXRvcDogMDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgaGVpZ2h0OiAxNXZoO1xyXG4gICAgYm90dG9tOjA7XHJcblxyXG5cclxuXHJcbn1cclxuXHJcblxyXG4ubWFwYm94Z2wtcG9wdXAtY29udGVudCB7XHJcbiAgICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hcGJveGdsLWN0cmwtZ3JvdXB7XHJcbiAgICBjb2xvcjogYmxhY2s7XHJcbn1cclxuXHJcbi5wLXRhYm1lbnVpdGVtIHtcclxuICB3aWR0aDogMzMuMzMlICFpbXBvcnRhbnQ7XHJcblxyXG59XHJcblxyXG4udGl0bGVHZW5lcmFse1xyXG4gIGZvbnQtc2l6ZTogMjRweDtcclxuICBjb2xvcjogIzAwMCAhaW1wb3J0YW50O1xyXG4gIGZvbnQtZmFtaWx5OiBmdWVudGVwYXJhdGl0dWxvcztcclxuXHJcbn1cclxuXHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3ODBweCkge1xyXG4gIC5jb250YWluZXItcHJpbmNpcGFse1xyXG4gICAgbWFyZ2luLXRvcDogMiU7XHJcbiAgICBtYXJnaW4tbGVmdDogNSU7XHJcbiAgICBtYXgtd2lkdGg6IDkwJTtcclxuICB9XHJcbn1cclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](EsriMapComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: "app-esri-map",
                templateUrl: "./esri-map.component.html",
                styleUrls: ["./esri-map.component.scss"]
            }]
    }], function () { return []; }, { mapLoadedEvent: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"]
        }], mapViewEl: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"],
            args: ["mapViewNode", { static: true }]
        }], zoom: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }], center: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }], basemap: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"]
        }] }); })();


/***/ }),

/***/ "E1Mj":
/*!************************************************************!*\
  !*** ./src/app/core/services/esri-map/esri-map.service.ts ***!
  \************************************************************/
/*! exports provided: EsriMapService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EsriMapService", function() { return EsriMapService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/*
  Copyright 2019 Esri
  Licensed under the Apache License, Version 2.0 (the 'License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/



class EsriMapService {
    constructor() {
        this.panRequest = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.panComplete = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
    }
    panToWonder(wonderCoordinates) {
        this.wonderCoordinates = wonderCoordinates;
        this.panRequest.next();
    }
    panToWonderComplete() {
        this.panComplete.next();
    }
}
EsriMapService.ɵfac = function EsriMapService_Factory(t) { return new (t || EsriMapService)(); };
EsriMapService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: EsriMapService, factory: EsriMapService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](EsriMapService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "G3c1":
/*!************************************************************!*\
  !*** ./src/app/modules/navigation/navigation.component.ts ***!
  \************************************************************/
/*! exports provided: NavigationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavigationComponent", function() { return NavigationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class NavigationComponent {
    constructor(router) {
        this.router = router;
        this.loged = false;
        this.display = false;
        this.mostramenu = false;
    }
    ngOnInit() {
        setTimeout(() => {
            $(".dropdown-trigger").dropdown('');
            $(document).ready(function () {
                $(".sidenav").sidenav();
            });
        }, 100);
    }
    mostrarmenuusuario() {
        let menu = document.getElementById("menuresponsivo");
    }
    goHome() {
        this.router.navigateByUrl('/map');
        $(document).ready(function () {
            $(".sidenav").printArea('close');
        });
    }
    logout() {
        localStorage.removeItem('amplify-redirected-from-hosted-ui');
    }
}
NavigationComponent.ɵfac = function NavigationComponent_Factory(t) { return new (t || NavigationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"])); };
NavigationComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NavigationComponent, selectors: [["app-navigation"]], decls: 6, vars: 0, consts: [[1, "nav-wrapper"], ["href", "", 1, "material-icons", "icon-user", "brand-logo"], [1, "linea"]], template: function NavigationComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "nav");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "account_circle ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " Chassis Management ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "div", 2);
    } }, styles: ["nav[_ngcontent-%COMP%]{\r\n  background-color: white;\r\n  color: black;\r\n  font-size: 25px;\r\n}\r\n\r\n.text-nav[_ngcontent-%COMP%]{\r\n  color: black;\r\n  font-size: 20px;\r\n}\r\n\r\n.icon-user[_ngcontent-%COMP%]{\r\n  color: black;\r\n  font-size: 3rem;\r\n  position: relative;\r\n  top: 10px;\r\n}\r\n\r\n.cp-style[_ngcontent-%COMP%]{\r\n  position: relative;\r\n  width: 8%;\r\n  top: 4px;\r\n}\r\n\r\n.icons-right[_ngcontent-%COMP%]{\r\n  color: black;\r\n  font-size: 2rem;\r\n  position: relative;\r\n  top: 10px;\r\n  right: 10px;\r\n}\r\n\r\n.linea[_ngcontent-%COMP%] {\r\n  border-top: 7px solid rgb(194, 22, 22);\r\n  height: 10px;\r\n  right: 0;\r\n  padding: 0,0,0,0;\r\n}\r\n\r\n.color-exit[_ngcontent-%COMP%]{\r\n  color: black !important;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5hdmlnYXRpb24uY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHVCQUF1QjtFQUN2QixZQUFZO0VBQ1osZUFBZTtBQUNqQjs7QUFFQTtFQUNFLFlBQVk7RUFDWixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLGVBQWU7RUFDZixrQkFBa0I7RUFDbEIsU0FBUztBQUNYOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLFNBQVM7RUFDVCxRQUFRO0FBQ1Y7O0FBRUE7RUFDRSxZQUFZO0VBQ1osZUFBZTtFQUNmLGtCQUFrQjtFQUNsQixTQUFTO0VBQ1QsV0FBVztBQUNiOztBQUNBO0VBQ0Usc0NBQXNDO0VBQ3RDLFlBQVk7RUFDWixRQUFRO0VBQ1IsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsdUJBQXVCO0FBQ3pCIiwiZmlsZSI6Im5hdmlnYXRpb24uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIm5hdntcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICBjb2xvcjogYmxhY2s7XHJcbiAgZm9udC1zaXplOiAyNXB4O1xyXG59XHJcblxyXG4udGV4dC1uYXZ7XHJcbiAgY29sb3I6IGJsYWNrO1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxufVxyXG5cclxuLmljb24tdXNlcntcclxuICBjb2xvcjogYmxhY2s7XHJcbiAgZm9udC1zaXplOiAzcmVtO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICB0b3A6IDEwcHg7XHJcbn1cclxuXHJcbi5jcC1zdHlsZXtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgd2lkdGg6IDglO1xyXG4gIHRvcDogNHB4O1xyXG59XHJcblxyXG4uaWNvbnMtcmlnaHR7XHJcbiAgY29sb3I6IGJsYWNrO1xyXG4gIGZvbnQtc2l6ZTogMnJlbTtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgdG9wOiAxMHB4O1xyXG4gIHJpZ2h0OiAxMHB4O1xyXG59XHJcbi5saW5lYSB7XHJcbiAgYm9yZGVyLXRvcDogN3B4IHNvbGlkIHJnYigxOTQsIDIyLCAyMik7XHJcbiAgaGVpZ2h0OiAxMHB4O1xyXG4gIHJpZ2h0OiAwO1xyXG4gIHBhZGRpbmc6IDAsMCwwLDA7XHJcbn1cclxuXHJcbi5jb2xvci1leGl0e1xyXG4gIGNvbG9yOiBibGFjayAhaW1wb3J0YW50O1xyXG59XHJcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NavigationComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-navigation',
                templateUrl: './navigation.component.html',
                styleUrls: ['./navigation.component.css']
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] }]; }, null); })();


/***/ }),

/***/ "I8qQ":
/*!**********************************************************!*\
  !*** ./src/app/modules/launchpad/launchpad.component.ts ***!
  \**********************************************************/
/*! exports provided: LaunchpadComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaunchpadComponent", function() { return LaunchpadComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _notification_notification_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notification/notification.component */ "XBc5");
/* harmony import */ var _navlauch_navlaunch_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navlauch/navlaunch.component */ "mXlp");
/* harmony import */ var primeng_scrollpanel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/scrollpanel */ "SSqW");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/button */ "jIHw");
/* harmony import */ var _boards_problem_resolution_shipment_management_problem_resolution_shipment_management_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./boards/problem-resolution-shipment-management/problem-resolution-shipment-management.component */ "XO03");








const _c0 = ["viewContainerRef"];
function LaunchpadComponent_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "app-problem-resolution-shipment-management");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function LaunchpadComponent_ng_template_9_Template(rf, ctx) { }
const _c1 = function () { return { width: "100%", height: "800px" }; };
class LaunchpadComponent {
    constructor(CFR, cdref) {
        this.CFR = CFR;
        this.cdref = cdref;
        this.index = 0;
        this.componentsReferences = [];
        this.indexoption = 0;
    }
    ngOnInit() {
    }
    addNotification() {
        let componentFactory = this.CFR.resolveComponentFactory(_notification_notification_component__WEBPACK_IMPORTED_MODULE_1__["NotificationComponent"]);
        let componentRef = this.VCR.createComponent(componentFactory);
        let currentComponent = componentRef.instance;
        currentComponent.selfRef = currentComponent;
        componentRef.instance.IModel = {};
        componentRef.instance.NameComponet = 'Notification' + this.componentsReferences.length;
        componentRef.instance.Delete = false;
        componentRef.instance.Index = this.componentsReferences.length;
        componentRef.instance.Ostatus.subscribe(val => this.remove(val['index'], val['nameComponet']));
        currentComponent.index = this.componentsReferences.length;
        currentComponent.compInteraction = this;
        this.componentsReferences.push(componentRef);
    }
    addNotificationCancel() {
        let componentFactory = this.CFR.resolveComponentFactory(_notification_notification_component__WEBPACK_IMPORTED_MODULE_1__["NotificationComponent"]);
        let componentRef = this.VCR.createComponent(componentFactory);
        let currentComponent = componentRef.instance;
        currentComponent.selfRef = currentComponent;
        componentRef.instance.IModel = {};
        componentRef.instance.NameComponet = 'Notification' + this.componentsReferences.length;
        componentRef.instance.Delete = true;
        componentRef.instance.Index = this.componentsReferences.length;
        componentRef.instance.Ostatus.subscribe(val => this.remove(val['index'], val['nameComponet']));
        currentComponent.index = this.componentsReferences.length;
        currentComponent.compInteraction = this;
        this.componentsReferences.push(componentRef);
    }
    remove(index, nameComponet) {
        if (this.VCR.length < 1)
            return;
        let componentRef = this.componentsReferences.filter(x => x.instance.NameComponet == nameComponet)[0];
        let vcrIndex = this.componentsReferences.indexOf(componentRef);
        this.VCR.remove(vcrIndex);
        this.componentsReferences = this.componentsReferences.filter(x => x.instance.NameComponet !== nameComponet);
    }
    changeOption($event) {
        this.indexoption = $event;
    }
}
LaunchpadComponent.ɵfac = function LaunchpadComponent_Factory(t) { return new (t || LaunchpadComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"])); };
LaunchpadComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: LaunchpadComponent, selectors: [["app-launchpad"]], viewQuery: function LaunchpadComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"]);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.VCR = _t.first);
    } }, decls: 11, vars: 4, consts: [[3, "SelectOption"], [1, "row"], [1, "col", "s9"], [1, "col-12", "md:col-4"], ["styleClass", "custombar2"], [4, "ngIf"], [1, "col", "s3"], ["pButton", "", "type", "button", "label", "Add", 1, "ui-button-raised", "ui-button-secondary", 3, "click"], ["viewContainerRef", ""]], template: function LaunchpadComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "app-navlaunch", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("SelectOption", function LaunchpadComponent_Template_app_navlaunch_SelectOption_0_listener($event) { return ctx.changeOption($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "p-scrollPanel", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, LaunchpadComponent_ng_container_5_Template, 2, 0, "ng-container", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function LaunchpadComponent_Template_button_click_7_listener() { return ctx.addNotification(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function LaunchpadComponent_Template_button_click_8_listener() { return ctx.addNotificationCancel(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, LaunchpadComponent_ng_template_9_Template, 0, 0, "ng-template", null, 8, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](3, _c1));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.indexoption == 3);
    } }, directives: [_navlauch_navlaunch_component__WEBPACK_IMPORTED_MODULE_2__["NavlaunchComponent"], primeng_scrollpanel__WEBPACK_IMPORTED_MODULE_3__["ScrollPanel"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"], primeng_button__WEBPACK_IMPORTED_MODULE_5__["ButtonDirective"], _boards_problem_resolution_shipment_management_problem_resolution_shipment_management_component__WEBPACK_IMPORTED_MODULE_6__["PRSMComponent"]], styles: [".position-icon[_ngcontent-%COMP%]{\r\n    position: absolute;\r\n    bottom: 20px;\r\n    right: 20px;\r\n}\r\n\r\n.position-icontext[_ngcontent-%COMP%]{\r\n    position: absolute;\r\n    bottom: 0;\r\n    font-size:18px\r\n}\r\n\r\n.format-cards[_ngcontent-%COMP%]{\r\n    background-color: rgb(192, 13, 13);\r\n    height: 250px;\r\n}\r\n\r\n.position-close[_ngcontent-%COMP%]{\r\n    background: grey;\r\n    background-color: grey;\r\n    color: black;\r\n    position: absolute;\r\n    right: 10px;\r\n    top: 10px;\r\n}\r\n\r\n.ui-button.black-button[_ngcontent-%COMP%] {\r\n    background-color: black;\r\n }\r\n\r\n.custombar2[_ngcontent-%COMP%] {\r\n         .p-scrollpanel-wrapper {\r\n             border-right: 9px solid var(--layer-1);\r\n             border-bottom: 9px solid var(--layer-1);\r\n         }\r\n\r\n         .p-scrollpanel-bar {\r\n           background: #3700fb;\r\n             border-radius: 0;\r\n             opacity: 1;\r\n             transition: background-color .2s;\r\n         }\r\n     }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxhdW5jaHBhZC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWixXQUFXO0FBQ2Y7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsU0FBUztJQUNUO0FBQ0o7O0FBRUE7SUFDSSxrQ0FBa0M7SUFDbEMsYUFBYTtBQUNqQjs7QUFFQTtJQUNJLGdCQUFnQjtJQUNoQixzQkFBc0I7SUFDdEIsWUFBWTtJQUNaLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsU0FBUztBQUNiOztBQUVBO0lBQ0ksdUJBQXVCO0NBQzFCOztBQUVBO1NBQ1E7YUFDSSxzQ0FBc0M7YUFDdEMsdUNBQXVDO1NBQzNDOztTQUVBO1dBQ0UsbUJBQW1CO2FBQ2pCLGdCQUFnQjthQUNoQixVQUFVO2FBQ1YsZ0NBQWdDO1NBQ3BDO0tBQ0oiLCJmaWxlIjoibGF1bmNocGFkLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucG9zaXRpb24taWNvbntcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGJvdHRvbTogMjBweDtcclxuICAgIHJpZ2h0OiAyMHB4O1xyXG59XHJcblxyXG4ucG9zaXRpb24taWNvbnRleHR7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBmb250LXNpemU6MThweFxyXG59XHJcblxyXG4uZm9ybWF0LWNhcmRze1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDE5MiwgMTMsIDEzKTtcclxuICAgIGhlaWdodDogMjUwcHg7XHJcbn1cclxuXHJcbi5wb3NpdGlvbi1jbG9zZXtcclxuICAgIGJhY2tncm91bmQ6IGdyZXk7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmV5O1xyXG4gICAgY29sb3I6IGJsYWNrO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgcmlnaHQ6IDEwcHg7XHJcbiAgICB0b3A6IDEwcHg7XHJcbn1cclxuXHJcbi51aS1idXR0b24uYmxhY2stYnV0dG9uIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gfVxyXG5cclxuIC5jdXN0b21iYXIyIHtcclxuICAgICAgICAgLnAtc2Nyb2xscGFuZWwtd3JhcHBlciB7XHJcbiAgICAgICAgICAgICBib3JkZXItcmlnaHQ6IDlweCBzb2xpZCB2YXIoLS1sYXllci0xKTtcclxuICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDlweCBzb2xpZCB2YXIoLS1sYXllci0xKTtcclxuICAgICAgICAgfVxyXG5cclxuICAgICAgICAgLnAtc2Nyb2xscGFuZWwtYmFyIHtcclxuICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMzcwMGZiO1xyXG4gICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcclxuICAgICAgICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICAgICAgICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIC4ycztcclxuICAgICAgICAgfVxyXG4gICAgIH1cclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LaunchpadComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-launchpad',
                templateUrl: './launchpad.component.html',
                styleUrls: ['./launchpad.component.css']
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"] }]; }, { VCR: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['viewContainerRef', { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], static: false }]
        }] }); })();


/***/ }),

/***/ "JIba":
/*!******************************************************!*\
  !*** ./src/app/core/services/pdfmake/pdf.service.ts ***!
  \******************************************************/
/*! exports provided: PDFService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PDFService", function() { return PDFService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var pdfmake_build_pdfmake__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pdfmake/build/pdfmake */ "5JmO");
/* harmony import */ var pdfmake_build_pdfmake__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(pdfmake_build_pdfmake__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var pdfmake_build_vfs_fonts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pdfmake/build/vfs_fonts */ "TruH");
/* harmony import */ var pdfmake_build_vfs_fonts__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pdfmake_build_vfs_fonts__WEBPACK_IMPORTED_MODULE_2__);




pdfmake_build_pdfmake__WEBPACK_IMPORTED_MODULE_1___default.a.vfs = pdfmake_build_vfs_fonts__WEBPACK_IMPORTED_MODULE_2___default.a.pdfMake.vfs;
class PDFService {
    constructor() { }
    getTitle(chasis) {
        let content_array = [];
        content_array.push({ columns: [
                { width: 40, text: '', margin: [0, 0, 0, 3] },
            ]
        }, { columns: [
                { width: '100%', text: chasis, alignment: 'center', fontSize: 14, bold: true, margin: [0, 0, 0, 0] }
            ]
        }, { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] });
        return content_array;
    }
    getPPSDetails(lon, lat) {
        let content_array = [];
        content_array.push({ columns: [
                { width: 40, text: '', margin: [0, 0, 0, 3] },
            ]
        }, { columns: [
                { width: 40, text: '', margin: [0, 0, 0, 3] },
            ]
        }, { columns: [
                { width: 300, text: '    Last Reported Location ', fontSize: 12, bold: true, margin: [0, 0, 0, 0] }
            ]
        }, { canvas: [{ type: 'line', x1: 10, y1: 0, x2: 505, y2: 0, lineWidth: 1 }] }, { columns: [
                { width: 40, text: '', margin: [0, 0, 0, 3] },
            ]
        }, { columns: [
                { width: '25%', text: 'Lat:', alignment: 'right', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                { width: '25%', text: lat, fontSize: 11, margin: [0, 0, 0, 0] },
                { width: '25%', text: 'Lon:', alignment: 'right', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                { width: '25%', text: lon, fontSize: 11, margin: [0, 0, 0, 0] },
            ]
        }, { columns: [
                { width: 40, text: '', margin: [0, 20, 0, 2] },
            ]
        });
        return content_array;
    }
    getPPSDetailsAtributtes(date, event, properties, geofences) {
        let content_array = [];
        let content_sensors = [];
        let content_array_left = [];
        let content_array_right = [];
        content_array.push({ columns: [
                { width: 40, text: '', margin: [0, 20, 0, 3] },
            ]
        }, { columns: [
                { width: 300, text: '   Details ', fontSize: 12, bold: true, margin: [0, -17, 0, 0] }
            ]
        }, { canvas: [{ type: 'line', x1: 10, y1: 0, x2: 505, y2: 0, lineWidth: 2 }] });
        content_array_left.push({ columns: [
                { width: 40, text: '', margin: [0, 0, 0, 3] },
            ]
        }, { columns: [
                { width: '25%', text: 'Date:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                { width: '75%', text: date, fontSize: 9, margin: [0, 0, 0, 0] }
            ]
        }, { columns: [
                { width: 40, text: '', margin: [0, 0, 0, 3] },
            ]
        }, { columns: [
                { width: '25%', text: 'Last Event:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                { width: '75%', text: this.formatstring(event), fontSize: 9, margin: [0, 0, 0, 0] }
            ]
        });
        if (properties != undefined) {
            content_array_left.push({ columns: [
                    { width: 40, text: '', margin: [0, 0, 0, 3] },
                ]
            }, { columns: [
                    { width: '25%', text: 'Asset Class:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                    { width: '75%', text: this.formatstring(properties.asset_class), fontSize: 9, margin: [0, 0, 0, 0] }
                ]
            }, { columns: [
                    { width: 40, text: '', margin: [0, 0, 0, 3] },
                ]
            });
            if (properties.chassis_type != undefined) {
                content_array_left.push({ columns: [
                        { width: '25%', text: 'Chassis Type:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                        { width: '75%', text: properties.chassis_type, fontSize: 9, margin: [0, 0, 0, 0] }
                    ]
                }, { columns: [
                        { width: 40, text: '', margin: [0, 0, 0, 3] },
                    ]
                });
            }
            content_array_left.push({ columns: [
                    { width: '25%', text: 'Door Type:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                    { width: '75%', text: properties.door_type, fontSize: 9, margin: [0, 0, 0, 0] }
                ]
            }, { columns: [
                    { width: 40, text: '', margin: [0, 0, 0, 3] },
                ]
            }, { columns: [
                    { width: '25%', text: 'Height:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                    { width: '75%', text: properties.height, fontSize: 9, margin: [0, 0, 0, 0] }
                ]
            }, { columns: [
                    { width: 40, text: '', margin: [0, 0, 0, 3] },
                ]
            }, { columns: [
                    { width: '25%', text: 'Width:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                    { width: '75%', text: properties.width, fontSize: 9, margin: [0, 0, 0, 0] }
                ]
            }, { columns: [
                    { width: 40, text: '', margin: [0, 0, 0, 3] },
                ]
            }, { columns: [
                    { width: '25%', text: 'Initial Distance:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                    { width: '75%', text: properties.initial_distance, fontSize: 9, margin: [0, 0, 0, 0] }
                ]
            }, { columns: [
                    { width: 40, text: '', margin: [0, 0, 0, 3] },
                ]
            }, { columns: [
                    { width: '25%', text: 'Mounting Location:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] },
                    { width: '75%', text: this.formatstring(properties.mounting_location), fontSize: 9, margin: [0, 0, 0, 0] }
                ]
            }, { columns: [
                    { width: 40, text: '', margin: [0, 0, 0, 3] },
                ]
            }, { columns: [
                    { width: '25%', text: 'Sensors:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] }
                ]
            });
            for (var i = 0; i < properties.sensors.length; i++) {
                content_array_left.push({ columns: [
                        { width: '100%', text: ' - ' + this.formatstring(properties.sensors[i]), fontSize: 9, margin: [0, 0, 0, 0] }
                    ]
                });
            }
        }
        content_array_right.push({ columns: [
                { width: 40, text: '', margin: [0, 0, 0, 3] },
            ]
        }, { columns: [
                { width: '25%', text: 'Geofences:', fontSize: 10, bold: true, margin: [0, 0, 0, 0] }
            ]
        });
        for (var i = 0; i < geofences.length; i++) {
            content_array_right.push({ columns: [
                    { width: '100%', text: ' ' + geofences[i].name, fontSize: 9, margin: [0, 0, 0, 0] }
                ]
            });
        }
        let arrayParaTabla = [
            [
                content_array_left,
                content_array_right,
            ]
        ];
        let dateTableDay = {
            style: 'tableExample',
            table: {
                headerRows: 1,
                widths: ['50%', '50%'],
                body: arrayParaTabla,
            }, layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                    return (rowIndex === 0) ? '#FFFFFF' : null;
                },
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 'white' : 'white';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'white' : 'white';
                },
                paddingLeft: function (i, node) { return 10; },
            }
        };
        content_array.push(dateTableDay);
        /*

        if(properties!=undefined){
          content_array.push(

            { columns: [
                { width: 40, text: '', margin: [0, 0, 0, 3]},
               ]
            },

            { columns: [
                 {  width: '25%',  text: 'Asset Class:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                 {  width: '75%',  text: this.formatstring(properties.asset_class), fontSize: 9 , margin: [0, 0, 0, 0]}

              ]
            },

            { columns: [
                { width: 40, text: '', margin: [0, 0, 0, 3]},
               ]
            },
          );

          if(properties.chassis_type!=undefined){
            content_array.push(

              { columns: [
                   {  width: '25%',  text: 'Chassis Type:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                   {  width: '75%',  text: properties.chassis_type, fontSize: 9 , margin: [0, 0, 0, 0]}

                ]
              },
              { columns: [
                  { width: 40, text: '', margin: [0, 0, 0, 3]},
                 ]
              },
            );
          }
          content_array.push(



              { columns: [
                   {  width: '25%',  text: 'Door Type:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                   {  width: '75%',  text: properties.door_type, fontSize: 9 , margin: [0, 0, 0, 0]}

                ]
              },

                  { columns: [
                      { width: 40, text: '', margin: [0, 0, 0, 3]},
                     ]
                  },

                  { columns: [
                       {  width: '25%',  text: 'Height:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                       {  width: '75%',  text: properties.height, fontSize: 9 , margin: [0, 0, 0, 0]}

                    ]
                  },


                    { columns: [
                        { width: 40, text: '', margin: [0, 0, 0, 3]},
                       ]
                    },


                    { columns: [
                         {  width: '25%',  text: 'Width:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                         {  width: '75%',  text: properties.width, fontSize: 9 , margin: [0, 0, 0, 0]}

                      ]
                    },

                      { columns: [
                          { width: 40, text: '', margin: [0, 0, 0, 3]},
                         ]
                      },

                      { columns: [
                           {  width: '25%',  text: 'Initial Distance:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                           {  width: '75%',  text: properties.initial_distance, fontSize: 9 , margin: [0, 0, 0, 0]}

                        ]
                      },


                        { columns: [
                            { width: 40, text: '', margin: [0, 0, 0, 3]},
                           ]
                        },

                        { columns: [
                             {  width: '25%',  text: 'Mounting Location:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]},
                             {  width: '75%',  text: this.formatstring(properties.mounting_location), fontSize: 9 , margin: [0, 0, 0, 0]}

                          ]
                        },


                          { columns: [
                              { width: 40, text: '', margin: [0, 0, 0, 3]},
                             ]
                          },
                          { columns: [

                            {  width: '25%',  text: 'Sensors:' , fontSize: 10,bold: true, margin: [0, 0, 0, 0]}
                            ]
                          },
          );
          for(var i = 0; i < properties.sensors.length;i++){
            content_array.push(
              { columns: [

                {  width: '100%',  text: ' - ' + this.formatstring(properties.sensors[i]) , fontSize: 9 , margin: [0, 0, 0, 0]}
                ]
              }
            );


          }
        }

        */
        return content_array;
    }
    formatstring(content) {
        return content.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    formatdatehours(date) {
        let dateformat = date.split(' ');
        let hourformat = dateformat[1].split('.');
        return dateformat[0] + ' ' + hourformat[0];
    }
}
PDFService.ɵfac = function PDFService_Factory(t) { return new (t || PDFService)(); };
PDFService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: PDFService, factory: PDFService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PDFService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "N/25":
/*!***********************************************!*\
  !*** ./src/app/auth/services/auth.service.ts ***!
  \***********************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _cognito_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cognito-config */ "xHc3");
/* harmony import */ var amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! amazon-cognito-identity-js */ "TESy");




class AuthService {
    constructor() {
        this.userPool = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_2__["CognitoUserPool"]({
            UserPoolId: _cognito_config__WEBPACK_IMPORTED_MODULE_1__["CognitoConfig"].userPoolId,
            ClientId: _cognito_config__WEBPACK_IMPORTED_MODULE_1__["CognitoConfig"].clientId
        });
    }
    login(email, password) {
        const authenticationDetails = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_2__["AuthenticationDetails"]({
            Username: email,
            Password: password
        });
        const cognitoUser = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_2__["CognitoUser"]({
            Username: email,
            Pool: this.userPool
        });
        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    console.log(result);
                    const accessToken = result.getAccessToken().getJwtToken();
                    localStorage.setItem('accessToken', accessToken);
                    resolve(result);
                },
                onFailure: (error) => {
                    reject(error);
                }
            });
        });
    }
    changePassword(email, oldPassword, newPassword) {
        const cognitoUser = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_2__["CognitoUser"]({
            Username: email,
            Pool: this.userPool
        });
        return new Promise((resolve, reject) => {
            cognitoUser.changePassword(oldPassword, newPassword, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    logout() {
        localStorage.removeItem('accessToken');
    }
}
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(); };
AuthService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AuthService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "NgTF":
/*!*************************************************!*\
  !*** ./src/app/auth/guards/check-auth.guard.ts ***!
  \*************************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var aws_amplify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! aws-amplify */ "AL3R");
/* harmony import */ var jwt_decode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jwt-decode */ "EjJx");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");






class AuthGuard {
    constructor(router) {
        this.router = router;
    }
    canActivate() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            try {
                const user = yield aws_amplify__WEBPACK_IMPORTED_MODULE_2__["Auth"].currentAuthenticatedUser();
                const session = user.getSignInUserSession();
                if (session) {
                    const accessToken = session.getAccessToken().getJwtToken();
                    const idToken = session.getIdToken().getJwtToken();
                    const refreshToken = session.getRefreshToken().getToken();
                    const decodedToken = Object(jwt_decode__WEBPACK_IMPORTED_MODULE_3__["default"])(accessToken);
                    const userPoolId = 'us-west-2_YKTiEMjtU';
                    const userPoolWebClientId = 's7ch645u8voh00dridmn8kn19';
                    const iss = decodedToken.iss;
                    const parts = iss.split('/');
                    const lastPart = parts.pop();
                    if (lastPart == userPoolId && decodedToken.client_id == userPoolWebClientId) {
                        return true;
                    }
                    else {
                        this.router.navigate(['access-denied']);
                        return false;
                    }
                }
                else {
                    this.router.navigate(['access-denied']);
                    return false;
                }
            }
            catch (error) {
                console.error('Error:', error);
                this.router.navigate(['access-denied']);
                return false;
            }
        });
    }
}
AuthGuard.ɵfac = function AuthGuard_Factory(t) { return new (t || AuthGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"])); };
AuthGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: AuthGuard, factory: AuthGuard.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AuthGuard, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }]; }, null); })();


/***/ }),

/***/ "Nl3S":
/*!*********************************************************!*\
  !*** ./src/app/core/resolver/token-resolver.service.ts ***!
  \*********************************************************/
/*! exports provided: TokenResolverService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TokenResolverService", function() { return TokenResolverService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _services_aws_cognito_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/aws-cognito.service */ "9vGm");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");







class TokenResolverService {
    constructor(location, awsCognitoService, router) {
        this.location = location;
        this.awsCognitoService = awsCognitoService;
        this.router = router;
    }
    resolve() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (!code) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(null);
        }
        return this.getTokenDetailsFromCognito(code).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["finalize"])(() => {
            this.location.replaceState(window.location.pathname);
        }));
    }
    getTokenDetailsFromCognito(code) {
        return this.awsCognitoService.getTokenDetailsFromCognito(code).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])((response) => {
            console.log('Response: ', response);
            localStorage.setItem('token', response.access_token);
            if (response) {
                this.router.navigate(['dashboard']);
            }
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(response);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])((error) => {
            return error;
        }));
    }
}
TokenResolverService.ɵfac = function TokenResolverService_Factory(t) { return new (t || TokenResolverService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_services_aws_cognito_service__WEBPACK_IMPORTED_MODULE_4__["AwsCognitoService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"])); };
TokenResolverService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: TokenResolverService, factory: TokenResolverService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TokenResolverService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return [{ type: _angular_common__WEBPACK_IMPORTED_MODULE_3__["Location"] }, { type: _services_aws_cognito_service__WEBPACK_IMPORTED_MODULE_4__["AwsCognitoService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"] }]; }, null); })();


/***/ }),

/***/ "SLGV":
/*!**************************************************!*\
  !*** ./src/app/core/services/cognito.service.ts ***!
  \**************************************************/
/*! exports provided: CognitoService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CognitoService", function() { return CognitoService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var amazon_cognito_auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! amazon-cognito-auth-js */ "ColZ");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");




class CognitoService {
    constructor(router //, public authConfiguration: any
    ) {
        this.router = router;
        //this.getAuthInstance();
    }
    getAuthInstance(authConfiguration) {
        /*
        this.authData = {
          UserPoolId: 'us-east-2_C9pPbW4cf',
          ClientId: '4mlir4v2on4jjbeg79de6vasbf',
          AppWebDomain: 'demo-saguz.auth.us-east-2.amazoncognito.com',
          TokenScopesArray: [  'email','openid'],
          RedirectUriSignIn: 'http://localhost:4400/current-chassis-location',
           RedirectUriSignOut: 'https://localhost:4400',
          AdvancedSecurityDataCollectionFlag: false
    
        }
        */
        this.authData = authConfiguration;
        this.auth = new amazon_cognito_auth_js__WEBPACK_IMPORTED_MODULE_1__["CognitoAuth"](this.authData);
        this.auth.userhandler = {
            onSuccess: session => {
                console.log('Signin success');
                this.signedIn(session);
            },
            onFailure: error => {
                console.log('Error: ' + error);
                this.onFailureMethod();
            }
        };
        //alert(this.router.url);
        //this.auth.useCodeGrantFlow();
        this.auth.parseCognitoWebResponse(this.router.url);
    }
    signedIn(session) {
        this.session = session;
    }
    onFailureMethod() {
        this.session = undefined;
    }
    get accessToken() {
        return this.session && this.session.getAccessToken().getJwtToken();
    }
    get isAuthenticated() {
        return this.auth.isUserSignedIn();
    }
    login() {
        this.auth.getSession();
        this.auth.parseCognitoWebResponse(this.router.url);
        console.log(this.router.url);
    }
    signOut() {
        this.auth.signOut();
    }
}
CognitoService.ɵfac = function CognitoService_Factory(t) { return new (t || CognitoService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"])); };
CognitoService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: CognitoService, factory: CognitoService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](CognitoService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }]; }, null); })();


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auth.service */ "ccyI");
/* harmony import */ var _core_services_cognito_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/services/cognito.service */ "SLGV");
/* harmony import */ var _modules_navigation_navigation_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/navigation/navigation.component */ "G3c1");








class AppComponent {
    constructor(http, route, authService, 
    //  private sessionStorageService: SessionStorageService,
    router, cognitoService) {
        this.http = http;
        this.route = route;
        this.authService = authService;
        this.router = router;
        this.cognitoService = cognitoService;
        this.title = 'pacific-railway';
    }
    ngOnInit() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
        });
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_cognito_service__WEBPACK_IMPORTED_MODULE_5__["CognitoService"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 2, vars: 0, template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "app-navigation");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "router-outlet");
    } }, directives: [_modules_navigation_navigation_component__WEBPACK_IMPORTED_MODULE_6__["NavigationComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterOutlet"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LmNzcyJ9 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.css']
            }]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"] }, { type: _auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }, { type: _core_services_cognito_service__WEBPACK_IMPORTED_MODULE_5__["CognitoService"] }]; }, null); })();


/***/ }),

/***/ "Uq8t":
/*!****************************************************************!*\
  !*** ./src/app/modules/map/filter-map/filter-map.component.ts ***!
  \****************************************************************/
/*! exports provided: FilterMapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterMapComponent", function() { return FilterMapComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/button */ "jIHw");
/* harmony import */ var primeng_inputswitch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/inputswitch */ "rLzU");
/* harmony import */ var primeng_dropdown__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/dropdown */ "arFO");







const _c0 = function () { return { "width": "100%", "max-width": "100%" }; };
function FilterMapComponent_div_26_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "p-dropdown", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function FilterMapComponent_div_26_Template_p_dropdown_ngModelChange_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4); const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r3.event_select = $event; })("onChange", function FilterMapComponent_div_26_Template_p_dropdown_onChange_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r5.deletechasis(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](5, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", ctx_r0.Events)("ngModel", ctx_r0.event_select)("showClear", true);
} }
function FilterMapComponent_div_28_Template(rf, ctx) { if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "p-dropdown", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function FilterMapComponent_div_28_Template_p_dropdown_ngModelChange_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7); const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r6.georeference_select = $event; })("onChange", function FilterMapComponent_div_28_Template_p_dropdown_onChange_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r8.deletechasis(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](5, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", ctx_r1.Georeferences)("ngModel", ctx_r1.georeference_select)("showClear", true);
} }
function FilterMapComponent_ng_container_38_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" (", ctx_r2.Time, ") ");
} }
class FilterMapComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.SendFilters = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.Sendchecked = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ngOnInit() {
        /*
        this.form = this.formBuilder.group({
          company: this.formBuilder.control('',  []),
          load_empty: this.formBuilder.control('',  []),
          origin: this.formBuilder.control('',  []),
          stripper: this.formBuilder.control('',  []),
          destination: this.formBuilder.control('',  []),
          consignee: this.formBuilder.control('',  []),
          last_report_station: this.formBuilder.control('',  []),
          equipment_status: this.formBuilder.control('',  []),
          equipment_type: this.formBuilder.control('',  []),
          load_status: this.formBuilder.control('',  []),
          storage_guarantee: this.formBuilder.control('',  []),
          pickup_number: this.formBuilder.control('',  []),
        });
    
        */
        this.companies_options = [
            { name: 'A', value: 1 },
            { name: 'B', value: 2 }
        ];
        this.load_emptys_options = [
            { name: 'Load', value: 1 },
            { name: 'Empty', value: 2 },
        ];
        this.equipment_status_options = [
            { name: 'A', value: 1 },
            { name: 'B', value: 2 },
            { name: 'C', value: 2 },
        ];
        this.equipment_types_options = [
            { name: 'A', value: 1 },
            { name: 'B', value: 2 },
            { name: 'C', value: 2 },
        ];
        this.load_status_options = [
            { name: 'A', value: 1 },
            { name: 'B', value: 2 },
            { name: 'C', value: 2 },
        ];
    }
    ngAfterViewInit() {
    }
    submit(event) {
        console.log(event);
    }
    verForms() {
        let keys_form = Object.keys(this.form['value']);
        let count = 0;
        for (var i = 0; i < keys_form.length; i++) {
            if (!this.isEmpty(this.form['value'][keys_form[i]])) {
                count++;
            }
        }
        return count;
    }
    getFormsInitialized() {
        let keys_form = Object.keys(this.form['value']);
        let count = 0;
        for (var i = 0; i < keys_form.length; i++) {
            if (!this.isEmpty(this.form['value'][keys_form[i]])) {
                count++;
            }
        }
        return count;
    }
    isEmpty(str) {
        return (!str || 0 === str.length);
    }
    ocultar() {
        return (this.ocultarBarra = true);
    }
    mostrar() {
        return (this.ocultarBarra = false);
    }
    send_filter() {
        let objsend = {};
        if (this.event_select != null) {
            objsend['event'] = this.event_select.toUpperCase();
        }
        if (this.georeference_select != null) {
            objsend['georeference'] = this.georeference_select;
        }
        if (this.chasis != null && !this.isEmpty(this.chasis)) {
            objsend['chasis'] = this.chasis;
        }
        this.SendFilters.emit(objsend);
    }
    deleteoptions() {
        this.event_select = null;
        this.georeference_select = null;
    }
    deletechasis() {
        this.chasis = null;
    }
    resetFilters() {
        this.event_select = null;
        this.georeference_select = null;
        this.chasis = null;
        this.SendFilters.emit({});
    }
    send() {
        this.Sendchecked.emit(this.checked);
    }
}
FilterMapComponent.ɵfac = function FilterMapComponent_Factory(t) { return new (t || FilterMapComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"])); };
FilterMapComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FilterMapComponent, selectors: [["app-filter-map"]], inputs: { Events: "Events", Georeferences: "Georeferences", Time: "Time" }, outputs: { ocultarBarra: "ocultarBarra", SendFilters: "SendFilters", Sendchecked: "Sendchecked" }, decls: 41, vars: 5, consts: [[1, "row"], [1, "p-col-12"], [1, "col", "s12"], [1, "col", "s12", "m8", "l8"], [1, "col", "s12", "m2", "l2"], ["for", "groupname"], [1, "col", "s1", "m1", "l1"], [1, "p-inputgroup"], ["type", "text", "pInputText", "", 3, "ngModel", "ngModelChange", "onChange"], ["class", "p-inputgroup", 4, "ngIf"], [1, "col", "s2"], [1, "col", "s12", "m12", "l6"], ["pButton", "", "pRipple", "", "type", "button", "label", "Go", 1, "p-button-success", 3, "click"], ["pButton", "", "pRipple", "", "type", "button", "label", "Reset", 1, "p-button-danger", 3, "click"], [1, "col", "s12", "m4", "l4"], [4, "ngIf"], [1, "valign-wrapper"], [3, "ngModel", "ngModelChange"], ["optionLabel", "name", 3, "options", "ngModel", "showClear", "ngModelChange", "onChange"]], template: function FilterMapComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Search By: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "label", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Chassis ID");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "label", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, " Events");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "label", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " Geofences");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function FilterMapComponent_Template_input_ngModelChange_21_listener($event) { return ctx.chasis = $event; })("onChange", function FilterMapComponent_Template_input_onChange_21_listener() { return ctx.deleteoptions(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "label", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, " OR");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](26, FilterMapComponent_div_26_Template, 2, 6, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](28, FilterMapComponent_div_28_Template, 2, 6, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FilterMapComponent_Template_button_click_31_listener() { return ctx.send_filter(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FilterMapComponent_Template_button_click_33_listener() { return ctx.resetFilters(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](36);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, " Auto-Update ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](38, FilterMapComponent_ng_container_38_Template, 2, 1, "ng-container", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "p-inputSwitch", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function FilterMapComponent_Template_p_inputSwitch_ngModelChange_40_listener($event) { return ctx.checked = $event; })("ngModelChange", function FilterMapComponent_Template_p_inputSwitch_ngModelChange_40_listener() { return ctx.send(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.chasis);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.Events.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.Georeferences.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.checked);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.checked);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgModel"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], primeng_button__WEBPACK_IMPORTED_MODULE_3__["ButtonDirective"], primeng_inputswitch__WEBPACK_IMPORTED_MODULE_4__["InputSwitch"], primeng_dropdown__WEBPACK_IMPORTED_MODULE_5__["Dropdown"]], styles: [".container[_ngcontent-%COMP%]{\r\n \r\n\r\n}\r\n\r\n.container-principal[_ngcontent-%COMP%]{\r\n  width: 100%;\r\n  max-width: 100%;\r\n  height:100%;\r\n  position: relative;\r\n}\r\n\r\nlabel[_ngcontent-%COMP%]{\r\n  color: black !important;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1tYXAuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7Q0FDQyxxQkFBcUI7O0FBRXRCOztBQUVBO0VBQ0UsV0FBVztFQUNYLGVBQWU7RUFDZixXQUFXO0VBQ1gsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsdUJBQXVCO0FBQ3pCIiwiZmlsZSI6ImZpbHRlci1tYXAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4uY29udGFpbmVye1xyXG4gLyogIG1hcmdpbi10b3A6IDIlOyAqL1xyXG5cclxufVxyXG5cclxuLmNvbnRhaW5lci1wcmluY2lwYWx7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDoxMDAlO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG5cclxubGFiZWx7XHJcbiAgY29sb3I6IGJsYWNrICFpbXBvcnRhbnQ7XHJcbn1cclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FilterMapComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-filter-map',
                templateUrl: './filter-map.component.html',
                styleUrls: ['./filter-map.component.css']
            }]
    }], function () { return [{ type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] }]; }, { Events: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], Georeferences: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], Time: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], ocultarBarra: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], SendFilters: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], Sendchecked: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }] }); })();


/***/ }),

/***/ "W1ip":
/*!**********************************************!*\
  !*** ./src/app/modules/map/map.component.ts ***!
  \**********************************************/
/*! exports provided: MapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapComponent", function() { return MapComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! esri-loader */ "r6rm");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(esri_loader__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/api */ "7zfz");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _core_services_map_state_map_state_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../core/services/map-state/map-state.service */ "xLLE");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/toast */ "Gxio");
/* harmony import */ var primeng_divider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/divider */ "lUkA");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! primeng/button */ "jIHw");
/* harmony import */ var _filter_map_filter_map_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./filter-map/filter-map.component */ "Uq8t");
/* harmony import */ var primeng_progressbar__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! primeng/progressbar */ "+DzE");
/* harmony import */ var _table_map_table_map_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./table-map/table-map.component */ "mk+t");


















const _c0 = ["viewContainerRef"];
const _c1 = ["mapViewNode"];
function MapComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "app-filter-map", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("SendFilters", function MapComponent_div_6_Template_app_filter_map_SendFilters_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9); const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r8.getFilters($event); })("Sendchecked", function MapComponent_div_6_Template_app_filter_map_Sendchecked_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r10.getChecked($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("Events", ctx_r0.events)("Georeferences", ctx_r0.georeferences)("Time", ctx_r0.timestring);
} }
const _c2 = function () { return { "height": "6px" }; };
function MapComponent_ng_container_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "p-progressBar", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](2, _c2));
} }
function MapComponent_button_9_Template(rf, ctx) { if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MapComponent_button_9_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r12); const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r11.mostrar(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, " expand_more ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function MapComponent_button_10_Template(rf, ctx) { if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MapComponent_button_10_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r13.ocultar(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, " expand_less ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function MapComponent_button_28_Template(rf, ctx) { if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MapComponent_button_28_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r16); const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r15.mostrarTabla(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, " expand_less ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function MapComponent_button_29_Template(rf, ctx) { if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MapComponent_button_29_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18); const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r17.ocultarTab(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, " expand_more ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function MapComponent_div_31_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "p-progressBar", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](2, _c2));
} }
function MapComponent_div_31_Template(rf, ctx) { if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "app-table-map", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("SendCenter", function MapComponent_div_31_Template_app_table_map_SendCenter_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r21); const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r20.getCenter($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, MapComponent_div_31_ng_container_2_Template, 2, 3, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("Data", ctx_r7.data);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r7.loading);
} }
class MapComponent {
    constructor(messageService, router, cdRef, location, CFR, cdref, msService, http
    //private geojsonService?: GEOJsonService,
    ) {
        this.messageService = messageService;
        this.router = router;
        this.cdRef = cdRef;
        this.location = location;
        this.CFR = CFR;
        this.cdref = cdref;
        this.msService = msService;
        this.http = http;
        this.index = 0;
        this.componentsReferences = [];
        this.events = [];
        this.georeferences = [];
        this.puntosarray = [];
        this.sub = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subscription"]();
        this.href = "";
        this.currentURL = "";
        this.loading = false;
        this.firstview = false;
        this.filtersactive = false;
        this.reload = false;
        this.filterspoints = [];
    }
    ngOnInit() {
        return Object(esri_loader__WEBPACK_IMPORTED_MODULE_3__["loadModules"])([
            "esri/Map",
            "esri/layers/FeatureLayer",
            "esri/layers/GeoJSONLayer",
            "esri/views/MapView",
            "esri/widgets/Legend",
            "esri/widgets/Expand",
            "esri/widgets/Home",
            "esri/popup/content/CustomContent",
            "esri/layers/GraphicsLayer",
            "esri/widgets/Sketch",
            "esri/widgets/Sketch/SketchViewModel",
            "esri/geometry/geometryEngineAsync",
            "esri/geometry/support/webMercatorUtils"
        ])
            .then(([Map, FeatureLayer, GeoJSONLayer, MapView, Legend, Expand, Home, CustomContent, GraphicsLayer, Sketch, SketchViewModel, geometryEngineAsync, webMercatorUtils]) => {
            const map = new Map({
                basemap: 'streets'
            });
            let that = this;
            this.mapView = new MapView({
                container: this.mapViewEl.nativeElement,
                center: [-114.8574, 54.6542],
                zoom: 4,
                map: map,
                constraints: {
                    minZoom: 3,
                },
            });
        })
            .catch(err => {
            console.error(err);
        });
        this.contador_regresivo();
        this.events = [];
        this.counterror = 0;
        this.data = [];
        this.dataGeneral = [];
        this.filterspoints = [];
        this.href = this.router.url;
        this.currentURL = window.location.href.replace(this.href, '');
    }
    contador_regresivo() {
        let actual = new Date();
        let minactual = actual.getMinutes();
        let segundoactual = actual.getSeconds();
        let intervalo = 0;
        let intervalosegundos = 0;
        for (var i = 0; i < 60; i++) {
            if (minactual < ((i + 1) * 10)) {
                if (intervalo == 0) {
                    intervalo = (i + 1) * 10;
                }
            }
        }
        if (intervalo - minactual > 1) {
            this.minutos = (intervalo - minactual) - 1;
        }
        else {
            this.minutos = (intervalo - minactual);
        }
        this.segundos = 60 - segundoactual;
        if (this.contador2 == undefined) {
            this.contador2 = setInterval(() => {
                this.timestring = this.minutos;
                if (this.segundos < 10) {
                    this.timestring = this.timestring + ':0' + this.segundos;
                }
                else {
                    this.timestring = this.timestring + ':' + this.segundos;
                }
                if (this.minutos == 0 && this.segundos == 0) {
                    this.contador_regresivo();
                    if (this.reload) {
                        this.refreshdata();
                        this.contador2 = undefined;
                        //  Swal.fire('Updating information!')
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updating information!' });
                    }
                    else {
                        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'New data available!' });
                        //  Swal.fire('New information available!')
                    }
                    clearInterval(this.contador2);
                }
                else {
                    if (this.minutos == 1 && this.segundos == 0) {
                        if (this.reload) {
                            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'New data will be available in a minute!' });
                        }
                    }
                    if (this.segundos > 0 && this.segundos <= 60) {
                        this.segundos--;
                    }
                    else {
                        if (this.minutos > 0 && this.minutos <= 60) {
                            this.minutos--;
                            this.segundos = 59;
                        }
                    }
                }
            }, 1000);
        }
    }
    refreshdata() {
        this.loading = true;
        //    fetch(environment.API_URL_BASE + "get-cpr-geojson")
        fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson")
            .then(res => res.json())
            .then((out) => {
            // this.getHistorico(out.features);
            this.jsongeneral = out;
            if (out.errorMessage == undefined) {
                this.loading = false;
                this.buildmap(out, null);
                this.rehacerjson(out.features);
            }
            else {
                setTimeout(() => {
                    this.counterror = this.counterror + 1;
                    if (this.counterror < 10) {
                        this.getDatafromGeoJson();
                    }
                }, 100);
            }
        }).catch(err => console.error(err));
    }
    ngAfterViewInit() {
        this.loading = true;
        this.getDatafromGeoJson();
        this.cdRef.detectChanges();
    }
    getDatafromGeoJson() {
        //  fetch(environment.API_URL_BASE + "get-cpr-geojson")
        fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson")
            .then(res => res.json())
            .then((out) => {
            // this.getHistorico(out.features);
            this.jsongeneral = out;
            if (out.errorMessage == undefined) {
                this.loading = false;
                this.buildmap(out, null);
                this.rehacerjson(out.features);
            }
            else {
                setTimeout(() => {
                    this.counterror = this.counterror + 1;
                    if (this.counterror < 10) {
                        this.getDatafromGeoJson();
                    }
                }, 100);
            }
        }).catch(err => console.error(err));
    }
    getHistorico(features) {
        for (var i = 0; i < features.length; i++) {
            let indice = i;
            let datefrom = new Date(2022, 0, 1);
            let dateto = new Date(2022, 1, 28);
            let dateToSend = this.convertDatetoString(datefrom);
            let fromToSend = this.convertDatetoString(dateto);
            let obj_send = {
                id: features[indice]['id'],
            };
            //   this.http.post<any>(environment.API_URL_BASE + 'chassis-history', {body:{data:obj_send}}).subscribe(data => {
            this.http.post('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', { body: { data: obj_send } }).subscribe(data => {
                let results = JSON.parse(data.body);
            });
        }
    }
    convertDatetoString(date) {
        let day = "";
        let year = date.getFullYear().toString();
        let month = "";
        if ((date.getMonth() + 1) < 10) {
            month = "0" + (date.getMonth() + 1).toString();
        }
        else {
            month = (date.getMonth() + 1).toString();
        }
        if ((date.getDate() + 1) <= 10) {
            day = "0" + (date.getDate()).toString();
        }
        else {
            day = (date.getDate()).toString();
        }
        return year + "-" + month + "-" + day;
    }
    getData() {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["from"])(fetch(
        //environment.API_URL_BASE + 'get-cpr-geojson', // the url you are trying to access
        'https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson', // the url you are trying to access
        {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
            mode: 'no-cors' // the most important option
        }));
    }
    buildmap(json, coords) {
        this.jsonmap = json;
        const blob = new Blob([JSON.stringify(json)], {
            type: "application/json"
        });
        const urljson = URL.createObjectURL(blob);
        return Object(esri_loader__WEBPACK_IMPORTED_MODULE_3__["loadModules"])([
            "esri/Map",
            "esri/layers/FeatureLayer",
            "esri/layers/GeoJSONLayer",
            "esri/views/MapView",
            "esri/widgets/Legend",
            "esri/widgets/Expand",
            "esri/widgets/Home",
            "esri/popup/content/CustomContent",
            "esri/layers/GraphicsLayer",
            "esri/widgets/Sketch",
            "esri/widgets/Sketch/SketchViewModel",
            "esri/geometry/geometryEngineAsync",
            "esri/geometry/support/webMercatorUtils"
        ])
            .then(([Map, FeatureLayer, GeoJSONLayer, MapView, Legend, Expand, Home, CustomContent, GraphicsLayer, Sketch, SketchViewModel, geometryEngineAsync, webMercatorUtils]) => {
            const map = new Map({
                basemap: 'streets'
            });
            let that = this;
            let urldirect = window.location.href.replace('/map', '');
            this.layer = new GeoJSONLayer({
                title: "Chassis",
                url: urljson,
                outFields: ["*"],
                popupTemplate: {
                    title: 'Chassis  {id} ',
                    content: [
                        {
                            type: "custom",
                            creator: (graphic) => {
                                let divcontent = document.createElement("div");
                                let btn = document.createElement("button");
                                btn.innerText = "Chassis Details";
                                btn.addEventListener("click", function (event) {
                                    btnClick(graphic);
                                });
                                divcontent.appendChild(btn);
                                let btnroute = document.createElement("button");
                                btnroute.innerText = "Chassis History";
                                btnroute.addEventListener("click", function (event) {
                                    btnClickRoute(graphic);
                                });
                                divcontent.appendChild(btnroute);
                                return divcontent;
                            }
                        }
                    ],
                }
            });
            function btnClick(reference) {
                const url = that.router.createUrlTree([`chassis-details`, reference.graphic.attributes.id]).toString();
                window.open(url, '_blank');
            }
            function btnClickRoute(reference) {
                const url = that.router.createUrlTree([`chassis-history`, reference.graphic.attributes.id]).toString();
                window.open(url, '_blank');
            }
            /*
                    this.mapView = new MapView({
                      container: this.mapViewEl.nativeElement,
                      center: [-114.8574, 54.6542],
                      zoom: 4,
                      map: map,
                      constraints: {
                        minZoom : 3,
                      },
                    });
                    */
            this.mapView.container = this.mapViewEl.nativeElement;
            this.mapView.map = map;
            map.add(this.layer);
            this.mapView.popup.viewModel.includeDefaultActions = false;
            this.mapView.on("drag", function (evt) {
                var initialExtent = that.mapView.extent;
                const p1 = webMercatorUtils.xyToLngLat(initialExtent.xmin, initialExtent.ymin);
                const p2 = webMercatorUtils.xyToLngLat(initialExtent.xmax, initialExtent.ymax);
                if (that.mapView.zoom > 6) {
                    that.filtersfromzoommap(p1[0], p2[0], p1[1], p2[1]);
                }
                else {
                    that.getAllTable();
                }
            });
            this.mapView.watch('scale', function (evt) {
                var initialExtent = that.mapView.extent;
                const p1 = webMercatorUtils.xyToLngLat(initialExtent.xmin, initialExtent.ymin);
                const p2 = webMercatorUtils.xyToLngLat(initialExtent.xmax, initialExtent.ymax);
                if (that.mapView.zoom > 6) {
                    that.filtersfromzoommap(p1[0].toFixed(2), p2[0].toFixed(2), p1[1].toFixed(2), p2[1].toFixed(2));
                }
                else {
                    that.getAllTable();
                }
            });
            this.mapView.whenLayerView(this.layer).then(lv => {
                const layerView = lv;
                const customContentPromise = new CustomContent({
                    outFields: ["*"],
                    creator: (event) => {
                        const query = this.layer.createQuery();
                        query.aggregateIds = [event.graphic.getObjectId()];
                        return this.layer.queryFeatures(query).then(result => {
                            const contentDiv = document.createElement("div");
                            const tbl = document.createElement("table");
                            let headers = ['Chassis ID', 'Events', 'PPS Details'];
                            let headerslabel = ['id', 'move_type', 'url'];
                            const tblHeader = document.createElement("thead");
                            const rowheaders = document.createElement("tr");
                            for (let i = 0; i < headers.length; i++) {
                                const cellheader = document.createElement("th");
                                const cellTextHeader = document.createTextNode(headers[i]);
                                cellheader.appendChild(cellTextHeader);
                                rowheaders.appendChild(cellheader);
                            }
                            tblHeader.appendChild(rowheaders);
                            const tblBody = document.createElement("tbody");
                            for (const feature of result.features) {
                                const row = document.createElement("tr");
                                for (let j = 0; j < headerslabel.length; j++) {
                                    let data = "";
                                    const cell = document.createElement("td");
                                    if (headerslabel[j] == 'id' || headerslabel[j] == 'move_type' || headerslabel[j] == 'date') {
                                        data = feature.attributes[headerslabel[j]];
                                        const cellText = document.createTextNode(data);
                                        cell.appendChild(cellText);
                                    }
                                    if (headerslabel[j] == 'url') {
                                        var createA = document.createElement('a');
                                        var createAText = document.createTextNode(`Chassis Details`);
                                        createA.setAttribute('href', this.href + "/chassis-details/" + feature.attributes['id']);
                                        createA.appendChild(createAText);
                                        cell.appendChild(createA);
                                    }
                                    row.appendChild(cell);
                                }
                                tblBody.appendChild(row);
                            }
                            tbl.appendChild(tblHeader);
                            tbl.appendChild(tblBody);
                            document.body.appendChild(tbl);
                            contentDiv.appendChild(tbl);
                            return contentDiv;
                        });
                    }
                });
                const clusterConfig = {
                    type: "cluster",
                    clusterRadius: "100px",
                    popupTemplate: {
                        title: "Cluster summary",
                        // content: [customContentPromise],
                        content: "This cluster represents {cluster_count} chassis.",
                        outFields: ["*"],
                        fieldInfos: [{
                                fieldName: "cluster_count",
                                format: {
                                    places: 0,
                                    digitSeparator: true
                                }
                            }]
                    },
                    clusterMinSize: "14px",
                    clusterMaxSize: "60px",
                    labelingInfo: [
                        {
                            deconflictionStrategy: "none",
                            labelExpressionInfo: {
                                expression: "Text($feature.cluster_count, '#,###')"
                            },
                            symbol: {
                                type: "text",
                                color: "#004a5d",
                                font: {
                                    weight: "bold",
                                    size: "12px"
                                }
                            },
                            labelPlacement: "center-center"
                        }
                    ]
                };
                this.layer.featureReduction = clusterConfig;
                const toggleButton = document.getElementById("cluster");
                toggleButton.addEventListener("click", () => {
                    let fr = this.layer.featureReduction;
                    this.layer.featureReduction =
                        fr && fr.type === "cluster" ? null : clusterConfig;
                    toggleButton.innerText =
                        toggleButton.innerText === "Enable Clustering"
                            ? "Disable Clustering"
                            : "Enable Clustering";
                });
            });
            const legend = new Legend({
                view: this.mapView,
                container: "legendDiv"
            });
            const infoDiv = document.getElementById("infoDiv");
            this.mapView.ui.add(new Expand({
                view: this.mapView,
                content: infoDiv,
                expandIconClass: "esri-icon-layer-list",
                expanded: false
            }), "top-left");
            const polygonGraphicsLayer = new GraphicsLayer();
            map.add(polygonGraphicsLayer);
            const graphicsLayer = new GraphicsLayer();
            map.add(graphicsLayer);
            this.mapView.ui.add("select-by-rectangle", "top-left");
            const selectButton = document.getElementById("select-by-rectangle");
            // click event for the select by rectangle button
            selectButton.addEventListener("click", () => {
                this.mapView.popup.close();
                sketchViewModel.create("rectangle");
            });
            this.mapView.ui.add("select-by-circle", "top-left");
            const selectButtonCCircle = document.getElementById("select-by-circle");
            // click event for the select by rectangle button
            selectButtonCCircle.addEventListener("click", () => {
                this.mapView.popup.close();
                sketchViewModel.create("circle");
            });
            this.mapView.ui.add("clear-selection", "top-left");
            document.getElementById("clear-selection").addEventListener("click", () => {
                polygonGraphicsLayer.removeAll();
            });
            const sketchViewModel = new SketchViewModel({
                view: this.mapView,
                layer: polygonGraphicsLayer
            });
            sketchViewModel.on("create", (event) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                if (event.state === "complete") {
                    // this polygon will be used to query features that intersect it
                    const geometries = polygonGraphicsLayer.graphics.map(function (graphic) {
                        const p1rect = webMercatorUtils.xyToLngLat(graphic.geometry.extent.xmin, graphic.geometry.extent.ymin);
                        const p2rect = webMercatorUtils.xyToLngLat(graphic.geometry.extent.xmax, graphic.geometry.extent.ymax);
                        setTimeout(() => {
                            that.filtersfromzoommap(p1rect[0], p2rect[0], p1rect[1], p2rect[1]);
                        }, 500);
                        return graphic.geometry;
                    });
                }
            }));
            function selectFeatures(geometry) {
                const query = this.layer.createQuery();
                query.aggregateIds = [geometry.graphic.getObjectId()];
                this.layer.queryFeatures(query).then(result => {
                    const contentDiv = document.createElement("div");
                    return contentDiv;
                });
            }
            this.mapView.on("pointer-move", (event) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                //console.log(event);
                event.stopPropagation();
                var screenPoint = {
                    x: event.x,
                    y: event.y
                };
                this.mapView.hitTest(screenPoint)
                    .then(function (response) {
                    if (response.results.length > 0) {
                        const result = response.results[0];
                        if (result['graphic'] != undefined) {
                            if (result['graphic'].attributes['clusterId'] == undefined) {
                                that.mapView.popup.close();
                                let title = 'Chassis ' + result['graphic'].attributes.id + '';
                                let idChasis = result['graphic'].attributes.id;
                                that.mapView.popup.open({
                                    // Set the popup's title to the coordinates of the clicked location
                                    title: title,
                                    content: getButton(idChasis),
                                    location: result.mapPoint // Set the location of the popup to the clicked location
                                });
                            }
                            if (result['graphic'].attributes['clusterId'] != undefined) {
                            }
                        }
                    }
                });
            }));
            function getButton(reference) {
                let divcontent = document.createElement("div");
                let btn = document.createElement("button");
                btn.innerText = "Chassis Details";
                btn.addEventListener("click", function (event) {
                    btnClickMouvePointer(reference);
                });
                divcontent.appendChild(btn);
                let btnroute = document.createElement("button");
                btnroute.innerText = "Chassis History";
                btnroute.addEventListener("click", function (event) {
                    btnClickMouvePointerRoute(reference);
                });
                divcontent.appendChild(btnroute);
                return divcontent;
            }
            function btnClickMouvePointer(reference) {
                that.router.navigate([`chassis-details`, reference]);
            }
            function btnClickMouvePointerRoute(reference) {
                that.router.navigate([`chassis-history`, reference]);
            }
            setTimeout(() => {
                if (coords != null) {
                    this.mapView.goTo({
                        center: [coords[1], coords[0]], zoom: 9
                    })
                        .catch(function (error) {
                        if (error.name != "AbortError") {
                            console.error(error);
                        }
                    });
                }
            }, 100);
        })
            .catch(err => {
            console.error(err);
        });
    }
    rehacerjson(features) {
        this.data = [];
        this.dataGeneral = [];
        this.events = [
            { name: "No Filter", value: "No Filter" }
        ];
        this.georeferences = [
            { name: "No Filter", value: "No Filter" },
            { name: "Bensenville Intermodal Terminal", value: "e6468692-50cf-46a1-bac7-5c1baeb4749d" },
            { name: "Calgary Intermodal Terminal", value: "7f8d3475-8f79-4936-b4e3-efe71913d254" },
            { name: "Edmonton Intermodal Terminal", value: "3346e7dc-0e31-4d17-9805-380baf1d9772" },
            { name: "Lachine Intermodal Terminal", value: "9d23cf32-2fb1-4e39-a326-9c332fc12c58" },
            { name: "Regina Intermodal Terminal", value: "0a369dbc-d048-4bf8-91dd-92cd5a47e00b" },
            { name: "Schiller Park Intermodal Terminal", value: "87ca9217-cb63-410c-bd04-62318cdd56cf" },
            { name: "Saint John Intermodal Terminal", value: "0dafa1ee-b472-4cb0-a615-70dbcb9ded1c" },
            { name: "Vaughan Intermodal Terminal", value: "744883a4-2e52-4f7a-95e5-4f76bed45f2d" },
            { name: "Vancouver Intermodal Terminal", value: "445f7608-2c14-41e8-be80-0c4ad6dadffb" },
            { name: "Winnipeg Intermodal Terminal", value: "156c6c75-fdb1-45d2-94c0-8c0791bd2da6" },
        ];
        for (var i = 0; i < features.length; i++) {
            let arr = features[i].properties.move_type.replace('_', ' ').split(" ");
            for (var a = 0; a < arr.length; a++) {
                arr[a] = arr[a].charAt(0).toUpperCase() + arr[a].slice(1);
            }
            const str2 = arr.join(" ");
            const found = this.events.find(element => element.name == str2);
            if (!found) {
                this.events.push({ name: str2, value: features[i].properties.move_type });
                // this.georeferences.push({name: str2, value: features[i].properties.move_type});
            }
            let geofences_array = [];
            let georences_string = '';
            if (typeof features[i].geofences[0] == 'string') {
                let featurestring = features[i].geofences[0];
                // featurestring = this.replaceAll(featurestring,"'", '"');
                // featurestring = this.replaceAll(featurestring,"'", '"');
                //   featurestring = this.replaceAll(featurestring," ", '');
                featurestring = this.replaceAll(featurestring, "'", '');
                let arrayaux = [];
                let sentencias = featurestring.split(/[{}]/);
                const resultado = sentencias.filter(sentence => sentence.length > 2);
                for (var r = 0; r < resultado.length; r++) {
                    let objaux = { id: '', name: '' };
                    if (resultado[r].length > 2) {
                        var arraysplitcoma = resultado[r].split(',');
                        for (var v = 0; v < arraysplitcoma.length; v++) {
                            var arraysplitdospuntos = arraysplitcoma[v].split(':');
                            if (arraysplitdospuntos[1] != undefined) {
                                objaux[arraysplitdospuntos[0].trim()] = arraysplitdospuntos[1].trim();
                                if (!this.isEmpty(arraysplitdospuntos[1].trim())) {
                                    const found = geofences_array.find(element => element.name == arraysplitdospuntos[1].trim());
                                    if (!found) {
                                        geofences_array.push(objaux);
                                        /*
                                                                     const foundinteres = this.georeferences.find(element => element.value == arraysplitdospuntos[1].trim());
                                                                    if(foundinteres){
                                                                      geofences_array.push(objaux);
                                                                     }
                                                                     */
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (var e = 0; e < geofences_array.length; e++) {
                if (e == geofences_array.length - 1) {
                    georences_string = georences_string + this.getGeofencesPrimor(geofences_array[e]);
                }
                else {
                    georences_string = georences_string + this.getGeofencesPrimor(geofences_array[e]) + ',';
                }
            }
            /*
            if(features[i].geofences!=undefined){
              for(var a = 0; a < features[i].geofences.length;a++){

                let results = JSON.parse(features[i].geofences);

                if(a == features[i].geofences.length - 1){
                  georences_string = georences_string + features[i].geofences[a].name;

                 }else{
                   georences_string = georences_string + features[i].geofences[a].name + ',';
                }
                geofences_array.push(
                  {
                    name: features[i].geofences[a].name
                  }
                );

              }
            }
            */
            var createAText = document.createTextNode(`Chassis Details`);
            this.data.push({
                reference: features[i].id,
                device_id: features[i].properties.device_id,
                date: this.formatdate(features[i].properties.recorded_on),
                move_type: features[i].properties.move_type,
                geofences: geofences_array,
                coordinates: features[i].geometry.coordinates[0] + ',' + features[i].geometry.coordinates[1],
                lat: features[i].geometry.coordinates[0],
                lon: features[i].geometry.coordinates[1],
                georeference: georences_string,
                routemap: this.href + features[i].id,
                move_Type_format: this.formatstring(features[i].properties.move_type),
            });
            this.dataGeneral.push({
                reference: features[i].id,
                device_id: features[i].properties.device_id,
                date: this.formatdate(features[i].properties.recorded_on),
                move_type: features[i].properties.move_type,
                geofences: geofences_array,
                coordinates: features[i].geometry.coordinates[0] + ',' + features[i].geometry.coordinates[1],
                lat: features[i].geometry.coordinates[0],
                lon: features[i].geometry.coordinates[1],
                georeference: georences_string,
                routemap: this.href + features[i].id,
                move_Type_format: this.formatstring(features[i].properties.move_type),
            });
        }
    }
    replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }
    getGeofencesPrimor(geofence) {
        let name_geofence = geofence.name;
        const found = this.georeferences.find(element => element.value == geofence.id);
        if (found) {
            name_geofence = found.name;
        }
        return name_geofence;
    }
    formatdate(date) {
        let dateformat = date.split(' ');
        return dateformat[0];
    }
    ocultar() {
        const map = document.querySelector('.esri-view');
        map.setAttribute('style', 'height: 800px');
        return (this.ocultarFiltro = true);
    }
    mostrar() {
        const map = document.querySelector('.esri-view');
        map.setAttribute('style', 'height: 500px');
        return (this.ocultarFiltro = false);
    }
    ocultarTab() {
        const map = document.querySelector('.esri-view');
        map.setAttribute('style', 'height: 800px');
        return (this.ocultarTabla = true);
    }
    mostrarTabla() {
        const map = document.querySelector('.esri-view');
        map.setAttribute('style', 'height: 500px');
        return (this.ocultarTabla = false);
    }
    getFilters($event) {
        let coords = null;
        this.loading = true;
        this.data = this.dataGeneral;
        if ($event.chasis != null) {
            this.data = this.data.filter(element => String(element.reference) == String($event.chasis.trim().toUpperCase()));
            if (this.data.length > 0) {
                coords = [this.data[0].lon, this.data[0].lat];
            }
        }
        else {
            if ($event.event != null) {
                this.data = this.data.filter(element => element.move_type == $event.event.value);
            }
            if ($event.georeference != null) {
                this.data = this.data.filter(element => element.geofences.find(geofence => geofence.id == $event.georeference.value) != undefined);
                if (this.data.length > 0) {
                    coords = [this.data[0].lon, this.data[0].lat];
                }
            }
        }
        if (Object.entries($event).length === 0) {
            this.filtersactive = false;
        }
        else {
            this.filtersactive = true;
            this.filterspoints = this.data;
        }
        setTimeout(() => {
            this.rebuildmap($event, coords);
        }, 100);
    }
    rebuildmap($event, coords) {
        //fetch(environment.API_URL_BASE + "get-cpr-geojson")
        fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson")
            .then(res => res.json())
            .then((out) => {
            this.makefromjson(out, $event, coords);
        }).catch(err => console.error(err));
    }
    makefromjson(json, $event, coords) {
        let arrayfeacturesfilter = json.features;
        if ($event.event != null && ($event.event != null && $event.event.value != 'No Filter')) {
            arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.properties.move_type == $event.event.value);
        }
        if ($event.chasis != null) {
            arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.id == $event.chasis);
        }
        if ($event.georeference != null && ($event.georeference != null && $event.georeference.value != 'No Filter')) {
            this.convertfeactures(json, arrayfeacturesfilter, $event.georeference.value, coords);
            //arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.geofences.find(geofence => geofence.name == $event.georeference.value) !=undefined);
            //          this.data = this.data.filter(element => element.geofences.find(geofence => geofence.name == $event.georeference.value) !=undefined );
        }
        else {
            json.features = arrayfeacturesfilter;
            setTimeout(() => {
                this.loading = false;
                this.buildmap(json, coords);
            }, 100);
        }
    }
    convertfeactures(json, arrayfeacturesfilter, value, coords) {
        let geofences_array = [];
        for (var i = 0; i < arrayfeacturesfilter.length; i++) {
            if (typeof arrayfeacturesfilter[i].geofences[0] == 'string') {
                let featurestring = arrayfeacturesfilter[i].geofences[0];
                featurestring = this.replaceAll(featurestring, "'", '');
                let sentencias = featurestring.split(/[{}]/);
                const resultado = sentencias.filter(sentence => sentence.length > 2);
                for (var r = 0; r < resultado.length; r++) {
                    let objaux = { id: '', name: '' };
                    if (resultado[r].length > 2) {
                        var arraysplitcoma = resultado[r].split(',');
                        for (var v = 0; v < arraysplitcoma.length; v++) {
                            var arraysplitdospuntos = arraysplitcoma[v].split(':');
                            if (arraysplitdospuntos.length > 1) {
                                if (!this.isEmpty(arraysplitdospuntos[1].trim())) {
                                    objaux[arraysplitdospuntos[0].trim()] = arraysplitdospuntos[1].trim();
                                    if (arraysplitdospuntos[1].trim() == value) {
                                        geofences_array.push(arrayfeacturesfilter[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        json.features = geofences_array;
        setTimeout(() => {
            this.loading = false;
            this.buildmap(json, coords);
        }, 100);
    }
    getCenter(event) {
        let coordinates = event.coordinates.split(',');
        const longitude = parseFloat(coordinates[0]);
        const latitude = parseFloat(coordinates[1]);
        this.mapView.goTo({
            center: [longitude, latitude], zoom: 9
        })
            .catch(function (error) {
            if (error.name != "AbortError") {
                console.error(error);
            }
        });
    }
    getAllTable() {
        if (!this.filtersactive) {
            this.data = this.dataGeneral;
        }
        else {
            this.data = this.filterspoints;
        }
    }
    filtersfromzoommap(x1, x2, y1, y2) {
        setTimeout(() => {
            let datafilter = [];
            if (!this.filtersactive) {
                // this.data = this.dataGeneral;
                for (var i = 0; i < this.dataGeneral.length; i++) {
                    if (x1 < this.dataGeneral[i].lat && x2 > this.dataGeneral[i].lat && y1 < this.dataGeneral[i].lon && y2 > this.dataGeneral[i].lon) {
                        datafilter.push(this.dataGeneral[i]);
                    }
                }
                setTimeout(() => {
                    this.data = datafilter;
                }, 100);
            }
            else {
                for (var a = 0; a < this.filterspoints.length; a++) {
                    if (x1 < this.filterspoints[a].lat && x2 > this.filterspoints[a].lat && y1 < this.filterspoints[a].lon && y2 > this.filterspoints[a].lon) {
                        datafilter.push(this.filterspoints[a]);
                    }
                }
                setTimeout(() => {
                    this.data = datafilter;
                }, 100);
            }
        }, 100);
        //this.data = this.data.filter(element => x1 < element.lon && x2 > element.lon &&   y1 < element.lat && y2 > element.lat);
        //   console.log(this.data);
    }
    filtersfrompointermove(x1, x2, y1, y2) {
        let datafilter = [];
        for (var i = 0; i < this.dataGeneral.length; i++) {
            if (x1 < this.dataGeneral[i].lat && x2 > this.dataGeneral[i].lat && y1 < this.dataGeneral[i].lon && y2 > this.dataGeneral[i].lon) {
                datafilter.push(this.dataGeneral[i]);
            }
        }
    }
    formatstring(content) {
        return content.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    downloadFile( //data: any
    ) {
        let arraytable = [];
        for (var i = 0; i < this.data.length; i++) {
            arraytable.push({
                Reference: this.data[i].reference,
                Date: this.data[i].date,
                Move_Type: this.formatstring(this.data[i].move_type),
                Geofences: this.data[i].georeference,
                Coordinates: this.data[i].coordinates
            });
        }
        let data = arraytable;
        const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
        const header = ['Reference', 'Date', 'Move_Type', 'Geofences', 'Coordinates']; //Object.keys(data[0]);
        const csv = data.map((row) => header
            .map((fieldName) => JSON.stringify(row[fieldName], replacer))
            .join(','));
        csv.unshift(header.join(','));
        const csvArray = csv.join('\r\n');
        const a = document.createElement('a');
        const blob = new Blob([csvArray], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'Information.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
    isEmpty(str) {
        return (!str || 0 === str.length);
    }
    gotoroutemap(indice) {
        console.log(indice);
    }
    getChecked($event) {
        this.reload = $event;
    }
}
MapComponent.ɵfac = function MapComponent_Factory(t) { return new (t || MapComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](primeng_api__WEBPACK_IMPORTED_MODULE_4__["MessageService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_6__["Location"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_map_state_map_state_service__WEBPACK_IMPORTED_MODULE_7__["MapStateService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_8__["HttpClient"])); };
MapComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: MapComponent, selectors: [["app-map"]], viewQuery: function MapComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵviewQuery"](_c0, true, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵviewQuery"](_c1, true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.VCR = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.mapViewEl = _t.first);
    } }, outputs: { ocultarFiltro: "ocultarFiltro" }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵProvidersFeature"]([primeng_api__WEBPACK_IMPORTED_MODULE_4__["MessageService"]])], decls: 34, vars: 7, consts: [[1, "container-principal"], [1, "row", "card"], [1, "col", "s12", "center-align"], [4, "ngIf"], ["align", "center", "type", "dashed"], [3, "click", 4, "ngIf"], [1, "p-col-12"], ["id", "esri-view"], ["mapViewNode", ""], ["id", "viewDiv"], ["id", "select-by-rectangle", "title", "Select features by rectangle", 1, "esri-widget", "esri-widget--button", "esri-widget", "esri-interactive"], [1, "esri-icon-checkbox-unchecked"], ["id", "select-by-circle", "title", "Select features by circle", 1, "esri-widget", "esri-widget--button", "esri-widget", "esri-interactive"], [1, "esri-icon-radio-unchecked"], ["id", "clear-selection", "title", "Clear selection", 1, "esri-widget", "esri-widget--button", "esri-widget", "esri-interactive"], [1, "esri-icon-erase"], ["id", "infoDiv", 1, "esri-widget"], ["id", "cluster", 1, "esri-button"], [1, "container"], ["id", "tableDiv"], [1, "row"], [1, "col", "s12"], ["pButton", "", "pRipple", "", "type", "button", "label", "CSV", 1, "p-button-success", 3, "click"], [3, "Events", "Georeferences", "Time", "SendFilters", "Sendchecked"], ["mode", "indeterminate"], [3, "click"], [1, "material-icons"], [3, "Data", "SendCenter"]], template: function MapComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "p-toast");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "h6");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Current Chassis Location");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, MapComponent_div_6_Template, 2, 3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, MapComponent_ng_container_7_Template, 2, 3, "ng-container", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "p-divider", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, MapComponent_button_9_Template, 3, 0, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, MapComponent_button_10_Template, 3, 0, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](12, "div", 7, 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](16, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](18, "span", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](20, "span", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "button", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "Disable Clustering");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](25, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "p-divider", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](28, MapComponent_button_28_Template, 3, 0, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](29, MapComponent_button_29_Template, 3, 0, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](31, MapComponent_div_31_Template, 3, 2, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "button", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MapComponent_Template_button_click_33_listener() { return ctx.downloadFile(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.ocultarFiltro);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.ocultarFiltro);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.ocultarFiltro);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.ocultarTabla);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.ocultarTabla);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.ocultarTabla);
    } }, directives: [primeng_toast__WEBPACK_IMPORTED_MODULE_9__["Toast"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], primeng_divider__WEBPACK_IMPORTED_MODULE_10__["Divider"], primeng_button__WEBPACK_IMPORTED_MODULE_11__["ButtonDirective"], _filter_map_filter_map_component__WEBPACK_IMPORTED_MODULE_12__["FilterMapComponent"], primeng_progressbar__WEBPACK_IMPORTED_MODULE_13__["ProgressBar"], _table_map_table_map_component__WEBPACK_IMPORTED_MODULE_14__["TableMapComponent"]], styles: ["@import 'https://js.arcgis.com/4.10/esri/css/main.css';\r\n\r\n.esri-view[_ngcontent-%COMP%] {\r\n  height: 500px;\r\n}\r\n\r\n.container[_ngcontent-%COMP%]{\r\n \r\n\r\n}\r\n\r\n.container-principal[_ngcontent-%COMP%]{\r\n  max-width: 100%;\r\n  height:100%;\r\n  position: relative;\r\n\r\n}\r\n\r\n.container-map[_ngcontent-%COMP%]{\r\n  height:780px;\r\n  width:1200px;\r\n\r\n  position: relative;\r\n\r\n\r\n}\r\n\r\n.pi-search[_ngcontent-%COMP%]{\r\n  margin-left: -40px !important;\r\n}\r\n\r\n.map[_ngcontent-%COMP%]{\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n}\r\n\r\n.summary[_ngcontent-%COMP%]{\r\n    position: sticky;\r\n    margin-top: 0;\r\n    background-color: black;\r\n    height: 15vh;\r\n    bottom:0;\r\n\r\n\r\n\r\n}\r\n\r\n.mapboxgl-popup-content[_ngcontent-%COMP%] {\r\n    color: black !important;\r\n}\r\n\r\n.mapboxgl-ctrl-group[_ngcontent-%COMP%]{\r\n    color: black;\r\n}\r\n\r\n.p-tabmenuitem[_ngcontent-%COMP%] {\r\n  width: 33.33% !important;\r\n\r\n}\r\n\r\n.titleGeneral[_ngcontent-%COMP%]{\r\n  font-size: 24px;\r\n  color: #000 !important;\r\n  font-family: fuenteparatitulos;\r\n\r\n}\r\n\r\n.esri-button[_ngcontent-%COMP%] {\r\n  color: black !important;;\r\n  }\r\n\r\n@media screen and (max-width: 780px) {\r\n  .container-principal[_ngcontent-%COMP%]{\r\n    margin-top: 2%;\r\n    margin-left: 5%;\r\n    max-width: 90%;\r\n  }\r\n}\r\n\r\nbutton[_ngcontent-%COMP%]{\r\n  background: rgba(236, 234, 234, 0.712);\r\n  border: none;\r\n  border-radius: 12px;\r\n\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNEQUFzRDs7QUFFdEQ7RUFDRSxhQUFhO0FBQ2Y7O0FBR0E7Q0FDQyxxQkFBcUI7O0FBRXRCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLFdBQVc7RUFDWCxrQkFBa0I7O0FBRXBCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLFlBQVk7O0VBRVosa0JBQWtCOzs7QUFHcEI7O0FBQ0E7RUFDRSw2QkFBNkI7QUFDL0I7O0FBSUE7O0lBRUksV0FBVztJQUNYLFlBQVk7O0FBRWhCOztBQUNBO0lBQ0ksZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYix1QkFBdUI7SUFDdkIsWUFBWTtJQUNaLFFBQVE7Ozs7QUFJWjs7QUFHQTtJQUNJLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLFlBQVk7QUFDaEI7O0FBRUE7RUFDRSx3QkFBd0I7O0FBRTFCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLHNCQUFzQjtFQUN0Qiw4QkFBOEI7O0FBRWhDOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCOztBQUdGO0VBQ0U7SUFDRSxjQUFjO0lBQ2QsZUFBZTtJQUNmLGNBQWM7RUFDaEI7QUFDRjs7QUFFQTtFQUNFLHNDQUFzQztFQUN0QyxZQUFZO0VBQ1osbUJBQW1COztBQUVyQiIsImZpbGUiOiJtYXAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgJ2h0dHBzOi8vanMuYXJjZ2lzLmNvbS80LjEwL2VzcmkvY3NzL21haW4uY3NzJztcclxuXHJcbi5lc3JpLXZpZXcge1xyXG4gIGhlaWdodDogNTAwcHg7XHJcbn1cclxuXHJcblxyXG4uY29udGFpbmVye1xyXG4gLyogIG1hcmdpbi10b3A6IDIlOyAqL1xyXG5cclxufVxyXG5cclxuLmNvbnRhaW5lci1wcmluY2lwYWx7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDoxMDAlO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbn1cclxuXHJcbi5jb250YWluZXItbWFwe1xyXG4gIGhlaWdodDo3ODBweDtcclxuICB3aWR0aDoxMjAwcHg7XHJcblxyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcblxyXG59XHJcbi5waS1zZWFyY2h7XHJcbiAgbWFyZ2luLWxlZnQ6IC00MHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcblxyXG5cclxuLm1hcHtcclxuXHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuXHJcbn1cclxuLnN1bW1hcnl7XHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG4gICAgbWFyZ2luLXRvcDogMDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgaGVpZ2h0OiAxNXZoO1xyXG4gICAgYm90dG9tOjA7XHJcblxyXG5cclxuXHJcbn1cclxuXHJcblxyXG4ubWFwYm94Z2wtcG9wdXAtY29udGVudCB7XHJcbiAgICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hcGJveGdsLWN0cmwtZ3JvdXB7XHJcbiAgICBjb2xvcjogYmxhY2s7XHJcbn1cclxuXHJcbi5wLXRhYm1lbnVpdGVtIHtcclxuICB3aWR0aDogMzMuMzMlICFpbXBvcnRhbnQ7XHJcblxyXG59XHJcblxyXG4udGl0bGVHZW5lcmFse1xyXG4gIGZvbnQtc2l6ZTogMjRweDtcclxuICBjb2xvcjogIzAwMCAhaW1wb3J0YW50O1xyXG4gIGZvbnQtZmFtaWx5OiBmdWVudGVwYXJhdGl0dWxvcztcclxuXHJcbn1cclxuXHJcbi5lc3JpLWJ1dHRvbiB7XHJcbiAgY29sb3I6IGJsYWNrICFpbXBvcnRhbnQ7O1xyXG4gIH1cclxuXHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3ODBweCkge1xyXG4gIC5jb250YWluZXItcHJpbmNpcGFse1xyXG4gICAgbWFyZ2luLXRvcDogMiU7XHJcbiAgICBtYXJnaW4tbGVmdDogNSU7XHJcbiAgICBtYXgtd2lkdGg6IDkwJTtcclxuICB9XHJcbn1cclxuXHJcbmJ1dHRvbntcclxuICBiYWNrZ3JvdW5kOiByZ2JhKDIzNiwgMjM0LCAyMzQsIDAuNzEyKTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcclxuXHJcbn1cclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](MapComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-map',
                templateUrl: './map.component.html',
                styleUrls: ['./map.component.css'],
                providers: [primeng_api__WEBPACK_IMPORTED_MODULE_4__["MessageService"]]
            }]
    }], function () { return [{ type: primeng_api__WEBPACK_IMPORTED_MODULE_4__["MessageService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] }, { type: _angular_common__WEBPACK_IMPORTED_MODULE_6__["Location"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ComponentFactoryResolver"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] }, { type: _core_services_map_state_map_state_service__WEBPACK_IMPORTED_MODULE_7__["MapStateService"] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_8__["HttpClient"] }]; }, { VCR: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"],
            args: ['viewContainerRef', { read: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewContainerRef"], static: false }]
        }], mapViewEl: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"],
            args: ['mapViewNode']
        }], ocultarFiltro: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"]
        }] }); })();


/***/ }),

/***/ "WiLW":
/*!**********************************************************!*\
  !*** ./src/app/modules/route-map/route-map.component.ts ***!
  \**********************************************************/
/*! exports provided: RouteMapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RouteMapComponent", function() { return RouteMapComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! esri-loader */ "r6rm");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(esri_loader__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sweetalert2 */ "PSD3");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _core_services_map_state_map_state_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/services/map-state/map-state.service */ "xLLE");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! primeng/button */ "jIHw");
/* harmony import */ var primeng_panel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/panel */ "7CaW");
/* harmony import */ var primeng_calendar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/calendar */ "eO1q");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _filter_routemap_filter_routemap_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./filter-routemap/filter-routemap.component */ "y08f");
/* harmony import */ var _table_route_map_table_route_map_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./table-route-map/table-route-map.component */ "iACI");
/* harmony import */ var primeng_progressbar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! primeng/progressbar */ "+DzE");
















const _c0 = ["viewContainerRef"];
const _c1 = ["mapViewNode"];
const _c2 = function () { return { "height": "6px" }; };
function RouteMapComponent_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "p-progressBar", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](2, _c2));
} }
function RouteMapComponent_ng_container_55_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RouteMapComponent_ng_container_55_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8); const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r7.searchForDates(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function RouteMapComponent_ng_container_56_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function RouteMapComponent_ng_container_62_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "p-progressBar", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](2, _c2));
} }
function RouteMapComponent_div_66_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RouteMapComponent_div_66_ng_container_1_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r11); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r10.downloadcsv(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function RouteMapComponent_div_66_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, RouteMapComponent_div_66_ng_container_1_Template, 2, 0, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r5.historicalpoints.length > 0);
} }
function RouteMapComponent_div_67_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
const _c3 = function () { return { "width": "100%" }; };
const _c4 = function () { return { "border": "none" }; };
class RouteMapComponent {
    constructor(router, activatedRoute, CFR, cdref, msService, http) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.CFR = CFR;
        this.cdref = cdref;
        this.msService = msService;
        this.http = http;
        this.index = 0;
        this.componentsReferences = [];
        this.events = [];
        this.georeferences = [];
        this.dateto = new Date();
        this.timeto = new Date();
        this.historicalpoints = [];
        this.validatedDates = true;
        this.loading = false;
        this.sub = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
        this.href = "";
        this.currentURL = "";
    }
    ngOnInit() {
        this.loading = true;
        this.events = [
            { name: "No Filter", value: "No Filter" }
        ];
        this.historicalpoints = [];
        this.href = this.router.url;
        this.currentURL = window.location.href.replace(this.href, '');
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        this.chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        //   this.datefrom = new Date();
        //   this.timefrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), 0, 0, 0);
        let dateactual = new Date();
        this.datefrom = new Date();
        this.datefrom.setDate(dateactual.getDate() - 7);
        //this.datefrom.setDate(this.datefrom.getDate() - 7);
        this.timefrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), 0, 0, 0);
        this.dateto = new Date();
        //   this.dateto.setDate(this.datefrom.getDate() - 7);
        this.timeto = new Date(this.dateto.getFullYear(), this.dateto.getMonth(), this.dateto.getDate(), 0, 0, 0);
        let dateToSend = this.convertDatetoString(this.datefrom);
        let fromToSend = this.convertDatetoString(this.dateto);
        let obj_send = {
            id: chasis,
            initial_date: dateToSend,
            final_date: fromToSend
        };
        this.loading = true;
        this.http.post('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', { body: { data: obj_send } }).subscribe(data => {
            let responseBody;
            try {
                responseBody = JSON.parse(data.body);
            }
            catch (error) {
                responseBody = {};
            }
            if (responseBody.message === "No data history for id") {
                this.buildmap([]);
            }
            else {
                this.buildmap(data.body.features);
            }
        });
    }
    searchForDates() {
        this.loading = true;
        let timefromstring = '00:00:00';
        let timetostring = '00:00:00';
        if (typeof this.timefrom != 'object') {
            timefromstring = this.timefrom + ':00';
        }
        if (typeof this.timeto != 'object') {
            timetostring = this.timeto + ':00';
        }
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        let dateToSend = this.convertDatetoString(this.datefrom) + 'T' + timefromstring;
        let fromToSend = this.convertDatetoString(this.dateto) + 'T' + timetostring;
        let obj_send = {
            id: chasis,
            initial_date: dateToSend,
            final_date: fromToSend
        };
        //  this.http.post<any>(environment.API_URL_BASE + 'chassis-history', {body:{data:obj_send}}).subscribe(data => {
        this.http.post('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', { body: { data: obj_send } }).subscribe(data => {
            let responseBody;
            try {
                responseBody = JSON.parse(data.body);
            }
            catch (error) {
                responseBody = {};
            }
            if (responseBody.message === "No data history for id") {
                sweetalert2__WEBPACK_IMPORTED_MODULE_3___default.a.fire('No results found');
                this.buildmap([]);
            }
            else {
                this.buildmap(data.body.features);
            }
        });
    }
    buildmap(features) {
        if (features != undefined) {
            this.georeferences = [
                { name: "No Filter", value: "No Filter" },
                { name: "Bensenville Intermodal Terminal", value: "e6468692-50cf-46a1-bac7-5c1baeb4749d" },
                { name: "Calgary Intermodal Terminal", value: "7f8d3475-8f79-4936-b4e3-efe71913d254" },
                { name: "Edmonton Intermodal Terminal", value: "3346e7dc-0e31-4d17-9805-380baf1d9772" },
                { name: "Lachine Intermodal Terminal", value: "9d23cf32-2fb1-4e39-a326-9c332fc12c58" },
                { name: "Regina Intermodal Terminal", value: "0a369dbc-d048-4bf8-91dd-92cd5a47e00b" },
                { name: "Schiller Park Intermodal Terminal", value: "87ca9217-cb63-410c-bd04-62318cdd56cf" },
                { name: "Saint John Intermodal Terminal", value: "0dafa1ee-b472-4cb0-a615-70dbcb9ded1c" },
                { name: "Vaughan Intermodal Terminal", value: "744883a4-2e52-4f7a-95e5-4f76bed45f2d" },
                { name: "Vancouver Intermodal Terminal", value: "445f7608-2c14-41e8-be80-0c4ad6dadffb" },
                { name: "Winnipeg Intermodal Terminal", value: "156c6c75-fdb1-45d2-94c0-8c0791bd2da6" },
            ];
            this.historicalpoints = [];
            let reference_move_stop;
            for (var i = 0; i < features.length; i++) {
                let arr = features[i].properties.move_type.replace('_', ' ').split(" ");
                for (var a = 0; a < arr.length; a++) {
                    arr[a] = arr[a].charAt(0).toUpperCase() + arr[a].slice(1);
                }
                const str2 = arr.join(" ");
                const found = this.events.find(element => element.name == str2);
                if (!found) {
                    if (!this.isEmpty(str2)) {
                        this.events.push({ name: str2, value: features[i].properties.move_type });
                    }
                }
                let total_distance;
                let traveled_distance;
                let total_distance_km;
                if (features[i].properties.total_distance != 'nan') {
                    if (features[i].properties.total_distance != null) {
                        total_distance = parseFloat(features[i].properties.total_distance) * 0.621371;
                        total_distance_km = this.convertkm(total_distance);
                    }
                }
                if (features[i].properties.move_type == 'move_stop' && reference_move_stop == undefined) {
                    reference_move_stop = total_distance;
                }
                if (features[i].properties.move_type == 'move_stop' && reference_move_stop != undefined) {
                    if (total_distance != null) {
                        traveled_distance = (total_distance - reference_move_stop) * 0.621371;
                        traveled_distance = this.convertkm(traveled_distance);
                    }
                }
                let geofences_array = [];
                let georences_string = '';
                if (typeof features[i].properties.geofences == 'string') {
                    let featurestring = features[i].properties.geofences;
                    featurestring = this.replaceAll(featurestring, "'", '');
                    let arrayaux = [];
                    let sentencias = featurestring.split(/[{}]/);
                    const resultado = sentencias.filter(sentence => sentence.length > 2);
                    for (var r = 0; r < resultado.length; r++) {
                        let objaux = { id: '', name: '' };
                        if (resultado[r].length > 2) {
                            var arraysplitcoma = resultado[r].split(',');
                            for (var v = 0; v < arraysplitcoma.length; v++) {
                                var arraysplitdospuntos = arraysplitcoma[v].split(':');
                                if (arraysplitdospuntos[1] != undefined) {
                                    objaux[arraysplitdospuntos[0].trim()] = arraysplitdospuntos[1].trim();
                                    if (!this.isEmpty(arraysplitdospuntos[1].trim())) {
                                        const found = geofences_array.find(element => element.name == arraysplitdospuntos[1].trim());
                                        if (!found) {
                                            geofences_array.push(objaux);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (var e = 0; e < geofences_array.length; e++) {
                    if (e == geofences_array.length - 1) {
                        georences_string = georences_string + this.getGeofencesPrimor(geofences_array[e]);
                    }
                    else {
                        georences_string = georences_string + this.getGeofencesPrimor(geofences_array[e]) + ',';
                    }
                }
                this.historicalpoints.push({
                    num: (i + 1),
                    lat: features[i].geometry.coordinates[1],
                    lon: features[i].geometry.coordinates[0],
                    coordinates: this.trunc(features[i].geometry.coordinates[0], 3) + ' , ' + this.trunc(features[i].geometry.coordinates[1], 3),
                    date: this.formatdate(features[i].properties.recorded_on),
                    //id_geofence:  features[i].properties.move_type,
                    move_type: features[i].properties.move_type,
                    move_type_format: this.formatstring(features[i].properties.move_type),
                    total_distance: '' + total_distance_km,
                    traveled_distance: traveled_distance,
                    geofences: geofences_array,
                    georeference: georences_string
                });
            }
            this.loading = false;
            return Object(esri_loader__WEBPACK_IMPORTED_MODULE_2__["loadModules"])([
                "esri/layers/GeoJSONLayer",
                "esri/widgets/Sketch",
                'esri/Map',
                "esri/layers/GraphicsLayer",
                'esri/views/MapView',
                'esri/Graphic',
                'esri/symbols/TextSymbol'
            ])
                .then(([GeoJSONLayer, Sketch, Map, GraphicsLayer, MapView, Graphic, TextSymbol]) => {
                const map = new Map({
                    basemap: 'streets'
                });
                this.mapView = new MapView({
                    container: this.mapViewEl.nativeElement,
                    map: map,
                    center: [-114.8574, 54.6542],
                    zoom: 4,
                });
                const graphicsLayer = new GraphicsLayer();
                map.add(graphicsLayer);
                for (var i = 0; i < this.historicalpoints.length; i++) {
                    let equalspoint = this.historicalpoints.filter(element => element.lon == this.historicalpoints[i].lon && element.lat == this.historicalpoints[i].lat);
                    let pointtext = '';
                    if (equalspoint.length > 1) {
                        for (var a = 0; a < equalspoint.length; a++) {
                            if (a != equalspoint.length - 1) {
                                pointtext = pointtext + equalspoint[a].num;
                            }
                            else {
                                pointtext = pointtext + equalspoint[a].num + ',';
                            }
                        }
                    }
                    else {
                        pointtext = this.historicalpoints[i].num;
                    }
                    const point = {
                        type: "point",
                        longitude: this.historicalpoints[i].lon,
                        latitude: this.historicalpoints[i].lat
                    };
                    const simpleMarkerSymbol = {
                        type: "simple-marker",
                        size: "25px",
                        text: pointtext,
                        color: [226, 119, 40],
                        outline: {
                            color: [255, 255, 255],
                            width: 1
                        }
                    };
                    const pointGraphic = new Graphic({
                        geometry: point,
                        symbol: simpleMarkerSymbol
                    });
                    var textSymbol = new TextSymbol({
                        color: "black",
                        text: this.historicalpoints[i].num,
                        xoffset: 0,
                        yoffset: -4,
                        font: {
                            size: 8
                        }
                    });
                    const pointGraphicText = new Graphic({
                        geometry: point,
                        symbol: textSymbol
                    });
                    graphicsLayer.add(pointGraphic);
                    graphicsLayer.add(pointGraphicText);
                }
                let that = this;
                this.mapView.on("click", (event) => {
                    if (this.mapView.zoom > 8) {
                        event.stopPropagation();
                        this.mapView.hitTest(event).then(({ results }) => {
                            //  var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
                            //var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
                            if (results.length > 0) {
                                let result = results[0];
                                if (result['graphic']) {
                                    const found = this.historicalpoints.find(element => element.lon == result['graphic'].geometry.x && element.lat == result['graphic'].geometry.y);
                                    if (found) {
                                        that.mapView.popup.close();
                                        that.mapView.popup.open({
                                            title: found.num,
                                            content: getContent(found),
                                            location: results[0].mapPoint
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
                function getContent(found) {
                    let divcontent = document.createElement("div");
                    let divdate = document.createElement("div");
                    let labeldate = document.createElement("label");
                    labeldate.innerText = "Date:";
                    labeldate.className = 'title_popup';
                    let labeldatevalue = document.createElement("label");
                    labeldatevalue.innerText = found.date;
                    labeldatevalue.className = 'value_popup';
                    divdate.appendChild(labeldate);
                    divdate.appendChild(labeldatevalue);
                    divcontent.appendChild(divdate);
                    if (!that.isEmpty(found.move_type)) {
                        let divmove_type = document.createElement("div");
                        let labelmove_type = document.createElement("label");
                        labelmove_type.innerText = "Move Type:";
                        labelmove_type.className = 'title_popup';
                        let labelmove_typevalue = document.createElement("label");
                        labelmove_typevalue.innerText = found.move_type_format;
                        labelmove_typevalue.className = 'value_popup';
                        divmove_type.appendChild(labelmove_type);
                        divmove_type.appendChild(labelmove_typevalue);
                        divcontent.appendChild(divmove_type);
                    }
                    if (found.total_distance != 'undefined') {
                        let divtotal_distance = document.createElement("div");
                        let labeltotal_distance = document.createElement("label");
                        labeltotal_distance.innerText = "Total Distance:";
                        labeltotal_distance.className = 'title_popup';
                        let labeltotal_distancevalue = document.createElement("label");
                        labeltotal_distancevalue.innerText = found.total_distance;
                        labeltotal_distancevalue.className = 'value_popup';
                        divtotal_distance.appendChild(labeltotal_distance);
                        divtotal_distance.appendChild(labeltotal_distancevalue);
                        divcontent.appendChild(divtotal_distance);
                    }
                    if (found.traveled_distance != undefined) {
                        let divtraveled_distance = document.createElement("div");
                        let labeltraveled_distance = document.createElement("label");
                        labeltraveled_distance.innerText = "Traveled Distance:";
                        labeltraveled_distance.className = 'title_popup';
                        let labeltraveled_distancevalue = document.createElement("label");
                        labeltraveled_distancevalue.innerText = found.traveled_distance;
                        labeltraveled_distancevalue.className = 'value_popup';
                        divtraveled_distance.appendChild(labeltraveled_distance);
                        divtraveled_distance.appendChild(labeltraveled_distancevalue);
                        divcontent.appendChild(divtraveled_distance);
                    }
                    return divcontent;
                }
            })
                .catch(err => {
                console.error(err);
            });
        }
        else {
            this.loading = false;
        }
    }
    convertkm(meters) {
        let convertmeters = meters / 1000;
        let result = new Intl.NumberFormat("en-US").format(convertmeters);
        return result;
    }
    formatdate(date) {
        var MyTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var LocaleZone = Intl.DateTimeFormat().resolvedOptions().locale;
        let usDate = date.toLocaleString(LocaleZone, { timeZone: MyTimeZone });
        let dateformat = usDate.split(' ');
        let hourformat = dateformat[1].split('.');
        return dateformat[0] + ' ' + hourformat[0];
    }
    convertDatetoString(date) {
        let day = "";
        let year = date.getFullYear().toString();
        let month = "";
        if ((date.getMonth() + 1) < 10) {
            month = "0" + (date.getMonth() + 1).toString();
        }
        else {
            month = (date.getMonth() + 1).toString();
        }
        if ((date.getDate() + 1) <= 10) {
            day = "0" + (date.getDate()).toString();
        }
        else {
            day = (date.getDate()).toString();
        }
        return year + "-" + month + "-" + day;
    }
    formatstring(content) {
        return content.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    validate() {
        if (this.timefrom == undefined || this.timeto == undefined || this.datefrom == undefined || this.dateto == undefined) {
            return this.validatedDates = false;
        }
        let hourfrom = 0;
        let minutefrom = 0;
        let hourto = 0;
        let minuteto = 0;
        if (typeof this.timefrom == 'string') {
            let datefromstring = '';
            datefromstring = this.timefrom;
            var arraystring = datefromstring.split(':');
            hourfrom = parseInt(arraystring[0]);
            minutefrom = parseInt(arraystring[1]);
        }
        else {
            hourfrom = this.timefrom.getHours();
            minutefrom = this.timefrom.getMinutes();
        }
        if (typeof this.timeto == 'string') {
            let datetostring = '';
            datetostring = this.timeto;
            var arraystringto = datetostring.split(':');
            hourto = parseInt(arraystringto[0]);
            minuteto = parseInt(arraystringto[1]);
        }
        else {
            hourto = this.timeto.getHours();
            minuteto = this.timeto.getMinutes();
        }
        let dateauxfrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), hourfrom, minutefrom, 0);
        let dateauxto = new Date(this.dateto.getFullYear(), this.dateto.getMonth(), this.dateto.getDate(), hourto, minuteto, 0);
        if (dateauxfrom.getTime() < dateauxto.getTime()) {
            return this.validatedDates = true;
        }
        return this.validatedDates = false;
    }
    ngAfterViewInit() {
    }
    centermap($event) {
        document.getElementById("esri-view").focus();
        this.mapView.goTo({
            center: [$event.lon, $event.lat], zoom: 10
        })
            .catch(function (error) {
            if (error.name != "AbortError") {
                console.error(error);
            }
        });
    }
    getGeofencesPrimor(geofence) {
        let name_geofence = geofence.name;
        const found = this.georeferences.find(element => element.value == geofence.id);
        if (found) {
            name_geofence = found.name;
        }
        return name_geofence;
    }
    replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }
    downloadcsv() {
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        let title_csv = '';
        if (this.datefrom != undefined && this.dateto != undefined) {
            let timefromstring = '00:00:00';
            let timetostring = '00:00:00';
            if (typeof this.timefrom != 'object') {
                timefromstring = this.timefrom + ':00';
            }
            if (typeof this.timeto != 'object') {
                timetostring = this.timeto + ':00';
            }
            let dateToSend = this.convertDatetoString(this.datefrom) + ' ' + timefromstring;
            let fromToSend = this.convertDatetoString(this.dateto) + ' ' + timetostring;
            title_csv = chasis + '_' + dateToSend + '_' + fromToSend + '_' + 'Historical.csv';
        }
        else {
            title_csv = chasis + '_' + 'Historical.csv';
        }
        let arraytable = [];
        for (var i = 0; i < this.historicalpoints.length; i++) {
            let total_distance = '';
            if (this.historicalpoints[i].total_distance != 'undefined') {
                total_distance = '' + this.historicalpoints[i].total_distance + ' mi';
            }
            let traveled_distance = '';
            if (!this.isEmpty(this.historicalpoints[i].traveled_distance)) {
                traveled_distance = '' + this.historicalpoints[i].traveled_distance + ' mi';
            }
            arraytable.push({
                Order: this.historicalpoints[i].num,
                // Latitude: this.historicalpoints[i].lat,
                // Longitude: this.historicalpoints[i].lon ,
                Coordinates: this.historicalpoints[i].coordinates,
                Move_Type: this.historicalpoints[i].move_type_format,
                Date: this.historicalpoints[i].date,
                Total_Distance: total_distance,
                Traveled_Distance: traveled_distance,
                Geofences: this.historicalpoints[i].georeference,
            });
        }
        let data = arraytable;
        const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
        const header = ['Order', 'Coordinates', 'Move_Type', 'Date', 'Total_Distance', 'Traveled_Distance', 'Geofences']; //Object.keys(data[0]);
        const csv = data.map((row) => header
            .map((fieldName) => JSON.stringify(row[fieldName], replacer))
            .join(','));
        csv.unshift(header.join(','));
        const csvArray = csv.join('\r\n');
        const a = document.createElement('a');
        const blob = new Blob([csvArray], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = title_csv;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
    isEmpty(str) {
        return (!str || 0 === str.length);
    }
    trunc(x, posiciones) {
        var s = x.toString();
        var l = s.length;
        var decimalLength = s.indexOf('.') + 1;
        var numStr = s.substr(0, decimalLength + posiciones);
        return Number(numStr);
    }
    getFilters($event) {
        //this.loading = true;
        /*
           if($event.event!=null){
 
             this.historicalpoints = this.historicalpoints.filter(element => element.move_type == $event.event.value);
           }
           if($event.georeference!=null){
             // this.data = this.data.filter(element => element.geofences.find(geofence => geofence.name == $event.georeference.value) !=undefined );
           }
 
           */
        this.loading = true;
        setTimeout(() => {
            this.rebuildmap($event);
        }, 100);
    }
    rebuildmap($event) {
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        let obj_send = {
            id: chasis
        };
        if (this.datefrom != undefined && this.dateto != undefined) {
            let timefromstring = '00:00:00';
            let timetostring = '00:00:00';
            if (typeof this.timefrom != 'object') {
                timefromstring = this.timefrom + ':00';
            }
            if (typeof this.timeto != 'object') {
                timetostring = this.timeto + ':00';
            }
            obj_send['initial_date'] = this.convertDatetoString(this.datefrom) + 'T' + timefromstring;
            obj_send['final_date'] = this.convertDatetoString(this.dateto) + 'T' + timetostring;
        }
        //this.http.post<any>(environment.API_URL_BASE + 'chassis-history', {body:{data:obj_send}}).subscribe(data => {
        this.http.post('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', { body: { data: obj_send } }).subscribe(data => {
            //this.buildmap(data.body.features);
            this.makefromjson(data.body, $event);
        });
    }
    makefromjson(json, $event) {
        let arrayfeacturesfilter = json.features;
        if ($event.event != null && ($event.event != null && $event.event.value != 'No Filter')) {
            arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.properties.move_type == $event.event.value);
        }
        if ($event.georeference != null && ($event.georeference != null && $event.georeference.value != 'No Filter')) {
            this.convertfeactures(json, arrayfeacturesfilter, $event.georeference.value);
        }
        else {
            setTimeout(() => {
                this.loading = false;
                this.buildmap(arrayfeacturesfilter);
            }, 100);
        }
    }
    convertfeactures(json, arrayfeacturesfilter, value) {
        let geofences_array = [];
        for (var i = 0; i < arrayfeacturesfilter.length; i++) {
            if (typeof arrayfeacturesfilter[i].properties.geofences == 'string') {
                let featurestring = arrayfeacturesfilter[i].properties.geofences;
                featurestring = this.replaceAll(featurestring, "'", '');
                let sentencias = featurestring.split(/[{}]/);
                const resultado = sentencias.filter(sentence => sentence.length > 2);
                for (var r = 0; r < resultado.length; r++) {
                    let objaux = { id: '', name: '' };
                    if (resultado[r].length > 2) {
                        var arraysplitcoma = resultado[r].split(',');
                        for (var v = 0; v < arraysplitcoma.length; v++) {
                            var arraysplitdospuntos = arraysplitcoma[v].split(':');
                            if (arraysplitdospuntos.length > 1) {
                                if (!this.isEmpty(arraysplitdospuntos[1].trim())) {
                                    objaux[arraysplitdospuntos[0].trim()] = arraysplitdospuntos[1].trim();
                                    if (arraysplitdospuntos[1].trim() == value) {
                                        geofences_array.push(arrayfeacturesfilter[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        setTimeout(() => {
            this.loading = false;
            this.buildmap(geofences_array);
        }, 100);
    }
    gotomap() {
        this.router.navigate([`map`]);
    }
    gotoppsdetails() {
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        this.router.navigate([`chassis-details`, chasis]);
    }
}
RouteMapComponent.ɵfac = function RouteMapComponent_Factory(t) { return new (t || RouteMapComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_core_services_map_state_map_state_service__WEBPACK_IMPORTED_MODULE_5__["MapStateService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_6__["HttpClient"])); };
RouteMapComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: RouteMapComponent, selectors: [["app-route-map"]], viewQuery: function RouteMapComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c1, true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.VCR = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.mapViewEl = _t.first);
    } }, decls: 68, vars: 41, consts: [[1, "container-principal"], [1, "row", "card"], [4, "ngIf"], [1, "col", "s12"], [1, "row", "center-align"], [1, "col", "s4", "left-align"], ["label", "Map", "icon", "pi pi-chevron-left", "styleClass", "p-button-link", 3, "click"], [1, "col", "s4", "center-align"], [1, "col", "s4", "right-align"], ["label", "Chassis Details", "styleClass", "p-button-link", 3, "click"], [1, "col", "s2"], ["header", "Time Range"], [1, "row"], ["icon", "pi pi-calendar", 3, "ngModel", "showIcon", "inputStyle", "ngModelChange", "onSelect"], ["timeOnly", "true", "dataType", "string", "inputId", "timeonly", "icon", "pi pi-calendar", 3, "ngModel", "showTime", "showIcon", "inputStyle", "ngModelChange", "onSelect"], ["icon", "pi pi-calendar", "icon", "pi pi-calendar", 3, "ngModel", "showIcon", "inputStyle", "ngModelChange", "onSelect"], [1, "col", "s12", "right-align"], [1, "col", "s10"], ["id", "esri-view", 1, "container-map"], ["mapViewNode", ""], [3, "Events", "Georeferences", "SendFilters"], [3, "Data", "SendCenter"], ["class", "col s12", 4, "ngIf"], ["class", "col s12 center-align", 4, "ngIf"], ["mode", "indeterminate"], ["pButton", "", "pRipple", "", "type", "button", "label", "Update", "lass", "p-button-danger", 3, "click"], ["pButton", "", "pRipple", "", "type", "button", "label", "Update", "disabled", "", "lass", "p-button-danger"], ["pButton", "", "pRipple", "", "type", "button", "label", "CSV", "lass", "p-button-danger", 3, "click"], [1, "col", "s12", "center-align"]], template: function RouteMapComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, RouteMapComponent_ng_container_2_Template, 2, 3, "ng-container", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "p-button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RouteMapComponent_Template_p_button_click_9_listener() { return ctx.gotomap(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "h6");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Chassis History");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "p-button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RouteMapComponent_Template_p_button_click_14_listener() { return ctx.gotoppsdetails(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "p-panel", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, " From: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](26, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, " Date: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "p-calendar", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function RouteMapComponent_Template_p_calendar_ngModelChange_29_listener($event) { return ctx.datefrom = $event; })("onSelect", function RouteMapComponent_Template_p_calendar_onSelect_29_listener() { return ctx.validate(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, " Time: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "p-calendar", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function RouteMapComponent_Template_p_calendar_ngModelChange_34_listener($event) { return ctx.timefrom = $event; })("onSelect", function RouteMapComponent_Template_p_calendar_onSelect_34_listener() { return ctx.validate(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](36, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, " To: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](41, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, " Date: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "p-calendar", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function RouteMapComponent_Template_p_calendar_ngModelChange_46_listener($event) { return ctx.dateto = $event; })("onSelect", function RouteMapComponent_Template_p_calendar_onSelect_46_listener() { return ctx.validate(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, " Time: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "p-calendar", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function RouteMapComponent_Template_p_calendar_ngModelChange_51_listener($event) { return ctx.timeto = $event; })("onSelect", function RouteMapComponent_Template_p_calendar_onSelect_51_listener() { return ctx.validate(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](53, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](55, RouteMapComponent_ng_container_55_Template, 2, 0, "ng-container", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](56, RouteMapComponent_ng_container_56_Template, 2, 0, "ng-container", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](58, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](60, "div", 18, 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](62, RouteMapComponent_ng_container_62_Template, 2, 3, "ng-container", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "app-filterroute-map", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("SendFilters", function RouteMapComponent_Template_app_filterroute_map_SendFilters_64_listener($event) { return ctx.getFilters($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "app-table-route-map", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("SendCenter", function RouteMapComponent_Template_app_table_route_map_SendCenter_65_listener($event) { return ctx.centermap($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](66, RouteMapComponent_div_66_Template, 2, 1, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](67, RouteMapComponent_div_67_Template, 3, 0, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ID: ", ctx.chasis, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](33, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.datefrom)("showIcon", false)("inputStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](34, _c4));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](35, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.timefrom)("showTime", true)("showIcon", false)("inputStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](36, _c4));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](37, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.dateto)("showIcon", true)("showIcon", false)("inputStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](38, _c4));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](39, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.timeto)("showTime", true)("showIcon", false)("inputStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](40, _c4));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.validatedDates);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.validatedDates);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("Events", ctx.events)("Georeferences", ctx.georeferences);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("Data", ctx.historicalpoints);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.historicalpoints != undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.historicalpoints != undefined);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], primeng_button__WEBPACK_IMPORTED_MODULE_8__["Button"], primeng_panel__WEBPACK_IMPORTED_MODULE_9__["Panel"], primeng_calendar__WEBPACK_IMPORTED_MODULE_10__["Calendar"], _angular_forms__WEBPACK_IMPORTED_MODULE_11__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_11__["NgModel"], _filter_routemap_filter_routemap_component__WEBPACK_IMPORTED_MODULE_12__["FilterRouteMapComponent"], _table_route_map_table_route_map_component__WEBPACK_IMPORTED_MODULE_13__["TableRouteMapComponent"], primeng_progressbar__WEBPACK_IMPORTED_MODULE_14__["ProgressBar"], primeng_button__WEBPACK_IMPORTED_MODULE_8__["ButtonDirective"]], styles: ["@import 'https://js.arcgis.com/4.10/esri/css/main.css';\r\n\r\n.esri-view[_ngcontent-%COMP%] {\r\n  height: 300px;\r\n}\r\n\r\n.container[_ngcontent-%COMP%]{\r\n \r\n\r\n}\r\n\r\n.container-principal[_ngcontent-%COMP%]{\r\n  max-width: 100%;\r\n  height:100%;\r\n  position: relative;\r\n\r\n}\r\n\r\n.container-map[_ngcontent-%COMP%]{\r\n  height:560px;\r\n  width:100%;\r\n\r\n  position: relative;\r\n\r\n\r\n}\r\n\r\n.value_popup[_ngcontent-%COMP%]{\r\n  color: #000 !important;\r\n\r\n}\r\n\r\n.title_popup[_ngcontent-%COMP%]{\r\n  color: #000 !important;\r\n  font-weight: bold;\r\n\r\n}\r\n\r\n.pi-search[_ngcontent-%COMP%]{\r\n  margin-left: -40px !important;\r\n}\r\n\r\n.map[_ngcontent-%COMP%]{\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n}\r\n\r\n.summary[_ngcontent-%COMP%]{\r\n    position: sticky;\r\n    margin-top: 0;\r\n    background-color: black;\r\n    height: 15vh;\r\n    bottom:0;\r\n\r\n\r\n\r\n}\r\n\r\n.mapboxgl-popup-content[_ngcontent-%COMP%] {\r\n    color: black !important;\r\n}\r\n\r\n.mapboxgl-ctrl-group[_ngcontent-%COMP%]{\r\n    color: black;\r\n}\r\n\r\n.p-tabmenuitem[_ngcontent-%COMP%] {\r\n  width: 33.33% !important;\r\n\r\n}\r\n\r\n.titleGeneral[_ngcontent-%COMP%]{\r\n  font-size: 24px;\r\n  color: #000 !important;\r\n  font-family: fuenteparatitulos;\r\n\r\n}\r\n\r\n.options-labels[_ngcontent-%COMP%]{\r\n  font-size: 14px;\r\n  color: #000 !important;\r\n}\r\n\r\n@media screen and (max-width: 780px) {\r\n  .container-principal[_ngcontent-%COMP%]{\r\n    margin-top: 2%;\r\n    margin-left: 5%;\r\n    max-width: 90%;\r\n  }\r\n}\r\n\r\n[_nghost-%COMP%]     .p-calendar{\r\n  border: 1px solid rgb(0, 0, 0);\r\n  border-radius: 10px;\r\n}\r\n\r\n[_nghost-%COMP%]     .p-calendar\r\n  .p-datepicker table td.p-datepicker-today>span, [_nghost-%COMP%]     .p-calendar .p-datepicker\r\n  table td.p-datepicker-today>span:hover {\r\n  background-color: rgb(128, 0, 0);\r\n  color: white;\r\n  font-weight: bold;\r\n}\r\n\r\n[_nghost-%COMP%]     .p-button-danger{\r\n  background: grey;\r\n  background-color: grey;\r\n  border: none;\r\n\r\n}\r\n\r\n.p-button-danger[_ngcontent-%COMP%]:hover{\r\n  background: rgb(209, 8, 8) !important;\r\n  background-color: rgb(202, 10, 10) !important;\r\n  border: none;\r\n\r\n}\r\n\r\n#infoDiv[_ngcontent-%COMP%] {\r\n  padding: 10px;\r\n  width: 275px;\r\n}\r\n\r\n#sliderValue[_ngcontent-%COMP%]{\r\n  font-weight: bolder;\r\n}\r\n\r\n#legendDiv[_ngcontent-%COMP%]{\r\n  width: 260px;\r\n}\r\n\r\n#description[_ngcontent-%COMP%]{\r\n  padding: 10px 0 10px 0;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJvdXRlLW1hcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNEQUFzRDs7QUFFdEQ7RUFDRSxhQUFhO0FBQ2Y7O0FBR0E7Q0FDQyxxQkFBcUI7O0FBRXRCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLFdBQVc7RUFDWCxrQkFBa0I7O0FBRXBCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLFVBQVU7O0VBRVYsa0JBQWtCOzs7QUFHcEI7O0FBRUE7RUFDRSxzQkFBc0I7O0FBRXhCOztBQUVBO0VBQ0Usc0JBQXNCO0VBQ3RCLGlCQUFpQjs7QUFFbkI7O0FBQ0E7RUFDRSw2QkFBNkI7QUFDL0I7O0FBSUE7O0lBRUksV0FBVztJQUNYLFlBQVk7O0FBRWhCOztBQUNBO0lBQ0ksZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYix1QkFBdUI7SUFDdkIsWUFBWTtJQUNaLFFBQVE7Ozs7QUFJWjs7QUFHQTtJQUNJLHVCQUF1QjtBQUMzQjs7QUFFQTtJQUNJLFlBQVk7QUFDaEI7O0FBRUE7RUFDRSx3QkFBd0I7O0FBRTFCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLHNCQUFzQjtFQUN0Qiw4QkFBOEI7O0FBRWhDOztBQUVBO0VBQ0UsZUFBZTtFQUNmLHNCQUFzQjtBQUN4Qjs7QUFHQTtFQUNFO0lBQ0UsY0FBYztJQUNkLGVBQWU7SUFDZixjQUFjO0VBQ2hCO0FBQ0Y7O0FBRUE7RUFDRSw4QkFBOEI7RUFDOUIsbUJBQW1CO0FBQ3JCOztBQUVBOzs7O0VBSUUsZ0NBQWdDO0VBQ2hDLFlBQVk7RUFDWixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsc0JBQXNCO0VBQ3RCLFlBQVk7O0FBRWQ7O0FBRUE7RUFDRSxxQ0FBcUM7RUFDckMsNkNBQTZDO0VBQzdDLFlBQVk7O0FBRWQ7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsWUFBWTtBQUNkOztBQUNBO0VBQ0UsbUJBQW1CO0FBQ3JCOztBQUNBO0VBQ0UsWUFBWTtBQUNkOztBQUNBO0VBQ0Usc0JBQXNCO0FBQ3hCIiwiZmlsZSI6InJvdXRlLW1hcC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnaHR0cHM6Ly9qcy5hcmNnaXMuY29tLzQuMTAvZXNyaS9jc3MvbWFpbi5jc3MnO1xyXG5cclxuLmVzcmktdmlldyB7XHJcbiAgaGVpZ2h0OiAzMDBweDtcclxufVxyXG5cclxuXHJcbi5jb250YWluZXJ7XHJcbiAvKiAgbWFyZ2luLXRvcDogMiU7ICovXHJcblxyXG59XHJcblxyXG4uY29udGFpbmVyLXByaW5jaXBhbHtcclxuICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OjEwMCU7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG5cclxufVxyXG5cclxuLmNvbnRhaW5lci1tYXB7XHJcbiAgaGVpZ2h0OjU2MHB4O1xyXG4gIHdpZHRoOjEwMCU7XHJcblxyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcblxyXG59XHJcblxyXG4udmFsdWVfcG9wdXB7XHJcbiAgY29sb3I6ICMwMDAgIWltcG9ydGFudDtcclxuXHJcbn1cclxuXHJcbi50aXRsZV9wb3B1cHtcclxuICBjb2xvcjogIzAwMCAhaW1wb3J0YW50O1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG5cclxufVxyXG4ucGktc2VhcmNoe1xyXG4gIG1hcmdpbi1sZWZ0OiAtNDBweCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG5cclxuXHJcbi5tYXB7XHJcblxyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcblxyXG59XHJcbi5zdW1tYXJ5e1xyXG4gICAgcG9zaXRpb246IHN0aWNreTtcclxuICAgIG1hcmdpbi10b3A6IDA7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcclxuICAgIGhlaWdodDogMTV2aDtcclxuICAgIGJvdHRvbTowO1xyXG5cclxuXHJcblxyXG59XHJcblxyXG5cclxuLm1hcGJveGdsLXBvcHVwLWNvbnRlbnQge1xyXG4gICAgY29sb3I6IGJsYWNrICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5tYXBib3hnbC1jdHJsLWdyb3Vwe1xyXG4gICAgY29sb3I6IGJsYWNrO1xyXG59XHJcblxyXG4ucC10YWJtZW51aXRlbSB7XHJcbiAgd2lkdGg6IDMzLjMzJSAhaW1wb3J0YW50O1xyXG5cclxufVxyXG5cclxuLnRpdGxlR2VuZXJhbHtcclxuICBmb250LXNpemU6IDI0cHg7XHJcbiAgY29sb3I6ICMwMDAgIWltcG9ydGFudDtcclxuICBmb250LWZhbWlseTogZnVlbnRlcGFyYXRpdHVsb3M7XHJcblxyXG59XHJcblxyXG4ub3B0aW9ucy1sYWJlbHN7XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG4gIGNvbG9yOiAjMDAwICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3ODBweCkge1xyXG4gIC5jb250YWluZXItcHJpbmNpcGFse1xyXG4gICAgbWFyZ2luLXRvcDogMiU7XHJcbiAgICBtYXJnaW4tbGVmdDogNSU7XHJcbiAgICBtYXgtd2lkdGg6IDkwJTtcclxuICB9XHJcbn1cclxuXHJcbjpob3N0IDo6bmctZGVlcCAucC1jYWxlbmRhcntcclxuICBib3JkZXI6IDFweCBzb2xpZCByZ2IoMCwgMCwgMCk7XHJcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcclxufVxyXG5cclxuOmhvc3QgOjpuZy1kZWVwIC5wLWNhbGVuZGFyXHJcbiAgLnAtZGF0ZXBpY2tlciB0YWJsZSB0ZC5wLWRhdGVwaWNrZXItdG9kYXk+c3BhbixcclxuOmhvc3QgOjpuZy1kZWVwIC5wLWNhbGVuZGFyIC5wLWRhdGVwaWNrZXJcclxuICB0YWJsZSB0ZC5wLWRhdGVwaWNrZXItdG9kYXk+c3Bhbjpob3ZlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDEyOCwgMCwgMCk7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcblxyXG46aG9zdCA6Om5nLWRlZXAgLnAtYnV0dG9uLWRhbmdlcntcclxuICBiYWNrZ3JvdW5kOiBncmV5O1xyXG4gIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XHJcbiAgYm9yZGVyOiBub25lO1xyXG5cclxufVxyXG5cclxuLnAtYnV0dG9uLWRhbmdlcjpob3ZlcntcclxuICBiYWNrZ3JvdW5kOiByZ2IoMjA5LCA4LCA4KSAhaW1wb3J0YW50O1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigyMDIsIDEwLCAxMCkgIWltcG9ydGFudDtcclxuICBib3JkZXI6IG5vbmU7XHJcblxyXG59XHJcblxyXG4jaW5mb0RpdiB7XHJcbiAgcGFkZGluZzogMTBweDtcclxuICB3aWR0aDogMjc1cHg7XHJcbn1cclxuI3NsaWRlclZhbHVle1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcbn1cclxuI2xlZ2VuZERpdntcclxuICB3aWR0aDogMjYwcHg7XHJcbn1cclxuI2Rlc2NyaXB0aW9ue1xyXG4gIHBhZGRpbmc6IDEwcHggMCAxMHB4IDA7XHJcbn1cclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](RouteMapComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-route-map',
                templateUrl: './route-map.component.html',
                styleUrls: ['./route-map.component.css']
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"] }, { type: _core_services_map_state_map_state_service__WEBPACK_IMPORTED_MODULE_5__["MapStateService"] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_6__["HttpClient"] }]; }, { VCR: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['viewContainerRef', { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"], static: false }]
        }], mapViewEl: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['mapViewNode']
        }] }); })();


/***/ }),

/***/ "XBc5":
/*!**************************************************************************!*\
  !*** ./src/app/modules/launchpad/notification/notification.component.ts ***!
  \**************************************************************************/
/*! exports provided: NotificationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotificationComponent", function() { return NotificationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! primeng/button */ "jIHw");




function NotificationComponent_ng_container_6_Template(rf, ctx) { if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "p-button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function NotificationComponent_ng_container_6_Template_p_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2); const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r1.removeComponent(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
class NotificationComponent {
    constructor() {
        this.Ostatus = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ngOnInit() {
    }
    removeComponent() {
        this.Ostatus.emit({ index: this.Index, nameComponet: this.NameComponet });
    }
}
NotificationComponent.ɵfac = function NotificationComponent_Factory(t) { return new (t || NotificationComponent)(); };
NotificationComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NotificationComponent, selectors: [["app-notification"]], inputs: { IModel: "IModel", Delete: "Delete", Index: "Index", NameComponet: "NameComponet" }, outputs: { Ostatus: "Ostatus" }, decls: 13, vars: 2, consts: [[1, "row"], [1, "col", "l12"], [1, "card", "grey"], [1, "card-content", "white-text"], [2, "font-size", "17px"], [4, "ngIf"], ["icon", "pi pi-times", 1, "position-close", 3, "click"]], template: function NotificationComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "p", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, NotificationComponent_ng_container_6_Template, 2, 0, "ng-container", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "28 days ago");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Collapse Group");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("You have 4 notificacion(s) requiring your attention ", ctx.Index, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.Delete);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], primeng_button__WEBPACK_IMPORTED_MODULE_2__["Button"]], styles: [".position-icon[_ngcontent-%COMP%]{\n    position: absolute;\n    bottom: 20px;\n    right: 20px;\n}\n\n.position-icontext[_ngcontent-%COMP%]{\n    position: absolute;\n    bottom: 0;\n    font-size:18px\n}\n\n.format-cards[_ngcontent-%COMP%]{\n    background-color: rgb(192, 13, 13);\n    height: 250px;\n}\n\n.position-close[_ngcontent-%COMP%]{\n    background: grey;\n    background-color: grey;\n    color: black;\n    position: absolute;\n    right: 10px;\n    top: 10px;\n}\n\n.ui-button.black-button[_ngcontent-%COMP%] {\n    background-color: black;\n }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vdGlmaWNhdGlvbi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTtJQUNJLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osV0FBVztBQUNmOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFNBQVM7SUFDVDtBQUNKOztBQUVBO0lBQ0ksa0NBQWtDO0lBQ2xDLGFBQWE7QUFDakI7O0FBRUE7SUFDSSxnQkFBZ0I7SUFDaEIsc0JBQXNCO0lBQ3RCLFlBQVk7SUFDWixrQkFBa0I7SUFDbEIsV0FBVztJQUNYLFNBQVM7QUFDYjs7QUFFQTtJQUNJLHVCQUF1QjtDQUMxQiIsImZpbGUiOiJub3RpZmljYXRpb24uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLnBvc2l0aW9uLWljb257XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGJvdHRvbTogMjBweDtcbiAgICByaWdodDogMjBweDtcbn1cblxuLnBvc2l0aW9uLWljb250ZXh0e1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBib3R0b206IDA7XG4gICAgZm9udC1zaXplOjE4cHhcbn1cblxuLmZvcm1hdC1jYXJkc3tcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTkyLCAxMywgMTMpO1xuICAgIGhlaWdodDogMjUwcHg7XG59XG5cbi5wb3NpdGlvbi1jbG9zZXtcbiAgICBiYWNrZ3JvdW5kOiBncmV5O1xuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XG4gICAgY29sb3I6IGJsYWNrO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICByaWdodDogMTBweDtcbiAgICB0b3A6IDEwcHg7XG59XG5cbi51aS1idXR0b24uYmxhY2stYnV0dG9uIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiB9XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NotificationComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-notification',
                templateUrl: './notification.component.html',
                styleUrls: ['./notification.component.css']
            }]
    }], null, { IModel: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], Delete: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], Index: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], NameComponet: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], Ostatus: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }] }); })();


/***/ }),

/***/ "XO03":
/*!*************************************************************************************************************************************!*\
  !*** ./src/app/modules/launchpad/boards/problem-resolution-shipment-management/problem-resolution-shipment-management.component.ts ***!
  \*************************************************************************************************************************************/
/*! exports provided: PRSMComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PRSMComponent", function() { return PRSMComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");


class PRSMComponent {
    constructor() {
    }
    ngOnInit() {
    }
}
PRSMComponent.ɵfac = function PRSMComponent_Factory(t) { return new (t || PRSMComponent)(); };
PRSMComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PRSMComponent, selectors: [["app-problem-resolution-shipment-management"]], decls: 93, vars: 0, consts: [[1, "row"], [1, "col", "l2"], [1, "card", "format-cards"], [1, "card-content", "white-text"], [1, "card-title"], [1, "card-content"], [1, "position-icon"], [1, "material-icons", 2, "font-size", "2rem"], [1, "pi", "pi-map-marker", 2, "font-size", "2rem"], [1, "card-content", "white-text", "position-icontext"], [1, "pi", "pi-exclamation-circle"], [1, "card-content", "yellow-text"]], template: function PRSMComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Problem Resolution & Shipment Management");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Log an Issue");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, " report_problem ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Map View");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, " public ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Track & Trace - Cardload");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](26, "i", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Track & Trace - Intermodal International");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](33, "i", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Edit or View Pickup Number");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "Add Storage Guarante");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](49, "i", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, " Cannot load tile");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](55, "i", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](56, " Cannot load tile");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](57, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, "Track & Trace - Intermodal International");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](63, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](64, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](67, "Problem Resolution & Shipment Management");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](69, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](71, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](72, "Equipment Summary");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](73, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](74, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](75, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](76, "factory");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](77, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](78, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](79, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](81, "Marine Booking Create");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](82, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](84, "directions_boat");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](85, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](86, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](87, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](88, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](89, "Marine Booking View");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](91, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](92, "directions_boat");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: [".position-icon[_ngcontent-%COMP%]{\r\n    position: absolute;\r\n    bottom: 20px;\r\n    right: 20px;\r\n}\r\n\r\n.position-icontext[_ngcontent-%COMP%]{\r\n    position: absolute;\r\n    bottom: 0;\r\n    font-size:18px\r\n}\r\n\r\n.format-cards[_ngcontent-%COMP%]{\r\n    background-color: rgb(192, 13, 13);\r\n    height: 250px;\r\n}\r\n\r\n.position-close[_ngcontent-%COMP%]{\r\n    background: grey;\r\n    background-color: grey;\r\n    color: black;\r\n    position: absolute;\r\n    right: 10px;\r\n    top: 10px;\r\n}\r\n\r\n.ui-button.black-button[_ngcontent-%COMP%] {\r\n    background-color: black;\r\n }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2JsZW0tcmVzb2x1dGlvbi1zaGlwbWVudC1tYW5hZ2VtZW50LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxrQkFBa0I7SUFDbEIsWUFBWTtJQUNaLFdBQVc7QUFDZjs7QUFFQTtJQUNJLGtCQUFrQjtJQUNsQixTQUFTO0lBQ1Q7QUFDSjs7QUFFQTtJQUNJLGtDQUFrQztJQUNsQyxhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksZ0JBQWdCO0lBQ2hCLHNCQUFzQjtJQUN0QixZQUFZO0lBQ1osa0JBQWtCO0lBQ2xCLFdBQVc7SUFDWCxTQUFTO0FBQ2I7O0FBRUE7SUFDSSx1QkFBdUI7Q0FDMUIiLCJmaWxlIjoicHJvYmxlbS1yZXNvbHV0aW9uLXNoaXBtZW50LW1hbmFnZW1lbnQuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5wb3NpdGlvbi1pY29ue1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgYm90dG9tOiAyMHB4O1xyXG4gICAgcmlnaHQ6IDIwcHg7XHJcbn1cclxuXHJcbi5wb3NpdGlvbi1pY29udGV4dHtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIGZvbnQtc2l6ZToxOHB4XHJcbn1cclxuXHJcbi5mb3JtYXQtY2FyZHN7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTkyLCAxMywgMTMpO1xyXG4gICAgaGVpZ2h0OiAyNTBweDtcclxufVxyXG5cclxuLnBvc2l0aW9uLWNsb3Nle1xyXG4gICAgYmFja2dyb3VuZDogZ3JleTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XHJcbiAgICBjb2xvcjogYmxhY2s7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICByaWdodDogMTBweDtcclxuICAgIHRvcDogMTBweDtcclxufVxyXG5cclxuLnVpLWJ1dHRvbi5ibGFjay1idXR0b24ge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XHJcbiB9XHJcbiAgXHJcblxyXG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PRSMComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-problem-resolution-shipment-management',
                templateUrl: './problem-resolution-shipment-management.component.html',
                styleUrls: ['./problem-resolution-shipment-management.component.css']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _auth_login_login_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auth/login/login.component */ "bsvf");
/* harmony import */ var _auth_password_rename_password_rename_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./auth/password-rename/password-rename.component */ "uOtL");
/* harmony import */ var _auth_access_denied_access_denied_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./auth/access-denied/access-denied.component */ "hSeH");
/* harmony import */ var _modules_navigation_navigation_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/navigation/navigation.component */ "G3c1");
/* harmony import */ var _modules_map_map_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/map/map.component */ "W1ip");
/* harmony import */ var _modules_route_map_table_route_map_table_route_map_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modules/route-map/table-route-map/table-route-map.component */ "iACI");
/* harmony import */ var _modules_route_map_route_map_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./modules/route-map/route-map.component */ "WiLW");
/* harmony import */ var _modules_route_map_filter_routemap_filter_routemap_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./modules/route-map/filter-routemap/filter-routemap.component */ "y08f");
/* harmony import */ var _modules_map_table_map_table_map_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modules/map/table-map/table-map.component */ "mk+t");
/* harmony import */ var _modules_map_filter_map_filter_map_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./modules/map/filter-map/filter-map.component */ "Uq8t");
/* harmony import */ var _modules_esri_map_esri_map_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./modules/esri-map/esri-map.component */ "D7ye");
/* harmony import */ var _modules_launchpad_launchpad_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./modules/launchpad/launchpad.component */ "I8qQ");
/* harmony import */ var _modules_launchpad_navlauch_navlaunch_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./modules/launchpad/navlauch/navlaunch.component */ "mXlp");
/* harmony import */ var _modules_launchpad_notification_notification_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./modules/launchpad/notification/notification.component */ "XBc5");
/* harmony import */ var _modules_launchpad_boards_problem_resolution_shipment_management_problem_resolution_shipment_management_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./modules/launchpad/boards/problem-resolution-shipment-management/problem-resolution-shipment-management.component */ "XO03");
/* harmony import */ var _modules_map_mapdiv_mapdiv_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./modules/map/mapdiv/mapdiv.component */ "/XWD");
/* harmony import */ var _modules_train_chasis_chasis_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./modules/train/chasis/chasis.component */ "dv1a");
/* harmony import */ var _modules_train_pps_details_pps_details_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./modules/train/pps-details/pps-details.component */ "muja");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/platform-browser/animations */ "R1ws");
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! primeng/password */ "+YxP");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! primeng/button */ "jIHw");
/* harmony import */ var primeng_menu__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! primeng/menu */ "1SLH");
/* harmony import */ var primeng_tieredmenu__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! primeng/tieredmenu */ "B16f");
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! primeng/table */ "rEr+");
/* harmony import */ var primeng_radiobutton__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! primeng/radiobutton */ "LuMj");
/* harmony import */ var primeng_dropdown__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! primeng/dropdown */ "arFO");
/* harmony import */ var primeng_calendar__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! primeng/calendar */ "eO1q");
/* harmony import */ var primeng_scrollpanel__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! primeng/scrollpanel */ "SSqW");
/* harmony import */ var primeng_chart__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! primeng/chart */ "I5S5");
/* harmony import */ var primeng_panel__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! primeng/panel */ "7CaW");
/* harmony import */ var primeng_progressbar__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! primeng/progressbar */ "+DzE");
/* harmony import */ var primeng_divider__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! primeng/divider */ "lUkA");
/* harmony import */ var primeng_toast__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! primeng/toast */ "Gxio");
/* harmony import */ var _core_services_esri_map_esri_map_service__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./core/services/esri-map/esri-map.service */ "E1Mj");
/* harmony import */ var primeng_inputswitch__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! primeng/inputswitch */ "rLzU");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _core_resolver_token_resolver_service__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./core/resolver/token-resolver.service */ "Nl3S");




//Components







































class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [_core_services_esri_map_esri_map_service__WEBPACK_IMPORTED_MODULE_38__["EsriMapService"], _core_resolver_token_resolver_service__WEBPACK_IMPORTED_MODULE_41__["TokenResolverService"]], imports: [[
            _angular_forms__WEBPACK_IMPORTED_MODULE_22__["FormsModule"],
            primeng_password__WEBPACK_IMPORTED_MODULE_24__["PasswordModule"],
            primeng_button__WEBPACK_IMPORTED_MODULE_25__["ButtonModule"],
            primeng_menu__WEBPACK_IMPORTED_MODULE_26__["MenuModule"],
            primeng_table__WEBPACK_IMPORTED_MODULE_28__["TableModule"],
            primeng_radiobutton__WEBPACK_IMPORTED_MODULE_29__["RadioButtonModule"],
            primeng_dropdown__WEBPACK_IMPORTED_MODULE_30__["DropdownModule"],
            primeng_calendar__WEBPACK_IMPORTED_MODULE_31__["CalendarModule"],
            primeng_tieredmenu__WEBPACK_IMPORTED_MODULE_27__["TieredMenuModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_22__["ReactiveFormsModule"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
            primeng_scrollpanel__WEBPACK_IMPORTED_MODULE_32__["ScrollPanelModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_23__["BrowserAnimationsModule"],
            primeng_chart__WEBPACK_IMPORTED_MODULE_33__["ChartModule"],
            primeng_divider__WEBPACK_IMPORTED_MODULE_36__["DividerModule"],
            primeng_panel__WEBPACK_IMPORTED_MODULE_34__["PanelModule"],
            primeng_progressbar__WEBPACK_IMPORTED_MODULE_35__["ProgressBarModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_40__["HttpClientModule"],
            primeng_inputswitch__WEBPACK_IMPORTED_MODULE_39__["InputSwitchModule"],
            primeng_toast__WEBPACK_IMPORTED_MODULE_37__["ToastModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
        _auth_login_login_component__WEBPACK_IMPORTED_MODULE_4__["LoginComponent"],
        _auth_password_rename_password_rename_component__WEBPACK_IMPORTED_MODULE_5__["PasswordRenameComponent"],
        _modules_navigation_navigation_component__WEBPACK_IMPORTED_MODULE_7__["NavigationComponent"],
        _modules_map_map_component__WEBPACK_IMPORTED_MODULE_8__["MapComponent"],
        _modules_route_map_route_map_component__WEBPACK_IMPORTED_MODULE_10__["RouteMapComponent"],
        _modules_map_filter_map_filter_map_component__WEBPACK_IMPORTED_MODULE_13__["FilterMapComponent"],
        _modules_esri_map_esri_map_component__WEBPACK_IMPORTED_MODULE_14__["EsriMapComponent"],
        _modules_map_mapdiv_mapdiv_component__WEBPACK_IMPORTED_MODULE_19__["MapDivComponent"],
        _modules_train_chasis_chasis_component__WEBPACK_IMPORTED_MODULE_20__["ChasisComponent"],
        _modules_launchpad_launchpad_component__WEBPACK_IMPORTED_MODULE_15__["LaunchpadComponent"],
        _modules_map_table_map_table_map_component__WEBPACK_IMPORTED_MODULE_12__["TableMapComponent"],
        _modules_train_pps_details_pps_details_component__WEBPACK_IMPORTED_MODULE_21__["PpsDetailsComponent"],
        _modules_launchpad_navlauch_navlaunch_component__WEBPACK_IMPORTED_MODULE_16__["NavlaunchComponent"],
        _modules_launchpad_notification_notification_component__WEBPACK_IMPORTED_MODULE_17__["NotificationComponent"],
        _modules_launchpad_boards_problem_resolution_shipment_management_problem_resolution_shipment_management_component__WEBPACK_IMPORTED_MODULE_18__["PRSMComponent"],
        _modules_route_map_table_route_map_table_route_map_component__WEBPACK_IMPORTED_MODULE_9__["TableRouteMapComponent"],
        _modules_route_map_filter_routemap_filter_routemap_component__WEBPACK_IMPORTED_MODULE_11__["FilterRouteMapComponent"],
        _auth_access_denied_access_denied_component__WEBPACK_IMPORTED_MODULE_6__["AccessDeniedComponent"]], imports: [_angular_forms__WEBPACK_IMPORTED_MODULE_22__["FormsModule"],
        primeng_password__WEBPACK_IMPORTED_MODULE_24__["PasswordModule"],
        primeng_button__WEBPACK_IMPORTED_MODULE_25__["ButtonModule"],
        primeng_menu__WEBPACK_IMPORTED_MODULE_26__["MenuModule"],
        primeng_table__WEBPACK_IMPORTED_MODULE_28__["TableModule"],
        primeng_radiobutton__WEBPACK_IMPORTED_MODULE_29__["RadioButtonModule"],
        primeng_dropdown__WEBPACK_IMPORTED_MODULE_30__["DropdownModule"],
        primeng_calendar__WEBPACK_IMPORTED_MODULE_31__["CalendarModule"],
        primeng_tieredmenu__WEBPACK_IMPORTED_MODULE_27__["TieredMenuModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_22__["ReactiveFormsModule"],
        _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
        primeng_scrollpanel__WEBPACK_IMPORTED_MODULE_32__["ScrollPanelModule"],
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_23__["BrowserAnimationsModule"],
        primeng_chart__WEBPACK_IMPORTED_MODULE_33__["ChartModule"],
        primeng_divider__WEBPACK_IMPORTED_MODULE_36__["DividerModule"],
        primeng_panel__WEBPACK_IMPORTED_MODULE_34__["PanelModule"],
        primeng_progressbar__WEBPACK_IMPORTED_MODULE_35__["ProgressBarModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_40__["HttpClientModule"],
        primeng_inputswitch__WEBPACK_IMPORTED_MODULE_39__["InputSwitchModule"],
        primeng_toast__WEBPACK_IMPORTED_MODULE_37__["ToastModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [
                    _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                    _auth_login_login_component__WEBPACK_IMPORTED_MODULE_4__["LoginComponent"],
                    _auth_password_rename_password_rename_component__WEBPACK_IMPORTED_MODULE_5__["PasswordRenameComponent"],
                    _modules_navigation_navigation_component__WEBPACK_IMPORTED_MODULE_7__["NavigationComponent"],
                    _modules_map_map_component__WEBPACK_IMPORTED_MODULE_8__["MapComponent"],
                    _modules_route_map_route_map_component__WEBPACK_IMPORTED_MODULE_10__["RouteMapComponent"],
                    _modules_map_filter_map_filter_map_component__WEBPACK_IMPORTED_MODULE_13__["FilterMapComponent"],
                    _modules_esri_map_esri_map_component__WEBPACK_IMPORTED_MODULE_14__["EsriMapComponent"],
                    _modules_map_mapdiv_mapdiv_component__WEBPACK_IMPORTED_MODULE_19__["MapDivComponent"],
                    _modules_train_chasis_chasis_component__WEBPACK_IMPORTED_MODULE_20__["ChasisComponent"],
                    _modules_launchpad_launchpad_component__WEBPACK_IMPORTED_MODULE_15__["LaunchpadComponent"],
                    _modules_map_table_map_table_map_component__WEBPACK_IMPORTED_MODULE_12__["TableMapComponent"],
                    _modules_train_pps_details_pps_details_component__WEBPACK_IMPORTED_MODULE_21__["PpsDetailsComponent"],
                    _modules_launchpad_navlauch_navlaunch_component__WEBPACK_IMPORTED_MODULE_16__["NavlaunchComponent"],
                    _modules_launchpad_notification_notification_component__WEBPACK_IMPORTED_MODULE_17__["NotificationComponent"],
                    _modules_launchpad_boards_problem_resolution_shipment_management_problem_resolution_shipment_management_component__WEBPACK_IMPORTED_MODULE_18__["PRSMComponent"],
                    _modules_route_map_table_route_map_table_route_map_component__WEBPACK_IMPORTED_MODULE_9__["TableRouteMapComponent"],
                    _modules_route_map_filter_routemap_filter_routemap_component__WEBPACK_IMPORTED_MODULE_11__["FilterRouteMapComponent"],
                    _auth_access_denied_access_denied_component__WEBPACK_IMPORTED_MODULE_6__["AccessDeniedComponent"]
                ],
                imports: [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_22__["FormsModule"],
                    primeng_password__WEBPACK_IMPORTED_MODULE_24__["PasswordModule"],
                    primeng_button__WEBPACK_IMPORTED_MODULE_25__["ButtonModule"],
                    primeng_menu__WEBPACK_IMPORTED_MODULE_26__["MenuModule"],
                    primeng_table__WEBPACK_IMPORTED_MODULE_28__["TableModule"],
                    primeng_radiobutton__WEBPACK_IMPORTED_MODULE_29__["RadioButtonModule"],
                    primeng_dropdown__WEBPACK_IMPORTED_MODULE_30__["DropdownModule"],
                    primeng_calendar__WEBPACK_IMPORTED_MODULE_31__["CalendarModule"],
                    primeng_tieredmenu__WEBPACK_IMPORTED_MODULE_27__["TieredMenuModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_22__["ReactiveFormsModule"],
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                    _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
                    primeng_scrollpanel__WEBPACK_IMPORTED_MODULE_32__["ScrollPanelModule"],
                    _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_23__["BrowserAnimationsModule"],
                    primeng_chart__WEBPACK_IMPORTED_MODULE_33__["ChartModule"],
                    primeng_divider__WEBPACK_IMPORTED_MODULE_36__["DividerModule"],
                    primeng_panel__WEBPACK_IMPORTED_MODULE_34__["PanelModule"],
                    primeng_progressbar__WEBPACK_IMPORTED_MODULE_35__["ProgressBarModule"],
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_40__["HttpClientModule"],
                    primeng_inputswitch__WEBPACK_IMPORTED_MODULE_39__["InputSwitchModule"],
                    primeng_toast__WEBPACK_IMPORTED_MODULE_37__["ToastModule"]
                ],
                providers: [_core_services_esri_map_esri_map_service__WEBPACK_IMPORTED_MODULE_38__["EsriMapService"], _core_resolver_token_resolver_service__WEBPACK_IMPORTED_MODULE_41__["TokenResolverService"]],
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "bsvf":
/*!***********************************************!*\
  !*** ./src/app/auth/login/login.component.ts ***!
  \***********************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! amazon-cognito-identity-js */ "TESy");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/auth.service */ "N/25");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! primeng/password */ "+YxP");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! primeng/button */ "jIHw");











const _c0 = function () { return { "width": "100%" }; };
class LoginComponent {
    constructor(formBuilder, authService, http, 
    //  private sessionStorageService: SessionStorageService,
    router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.http = http;
        this.router = router;
        this.loading = false;
        this.form = this.formBuilder.group({
            email: this.formBuilder.control('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
            password: this.formBuilder.control('', {
                validators: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
            })
        });
    }
    ngOnInit() {
        this.verificarSesion();
    }
    verificarSesion() {
        const poolData = {
            UserPoolId: 'us-west-2_YKTiEMjtU',
            ClientId: '78fqe248a2ghet7oi0v94hbtnp'
        };
        const userPool = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_3__["CognitoUserPool"](poolData);
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession((error, session) => {
                if (error) {
                    console.log('No hay sesión activa en Cognito');
                }
                else {
                    console.log('Sesión activa en Cognito');
                    console.log('Token de acceso:', session.getAccessToken().getJwtToken());
                }
            });
        }
        else {
            console.log('No hay sesión activa en Cognito');
        }
    }
    serialize(obj) {
        const str = [];
        for (const p in obj) {
            if (obj.hasOwnProperty(p) && obj[p]) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    }
    submit(event) {
        const tokenEndpoint = 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/token';
        const clientId = '78fqe248a2ghet7oi0v94hbtnp';
        const code = '44374716-5a89-4095-8fd3-1ccb73e705e8';
        const requestBody = {
            grant_type: 'authorization_code',
            client_id: clientId,
            code: code,
            redirect_uri: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location'
        };
        const headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        this.http.post(tokenEndpoint, this.serialize(requestBody), { headers: headers })
            .subscribe((response) => {
            console.log(response);
            // Procesar los tokens de respuesta y establecer la sesión del usuario
        }, (error) => {
            console.error(error);
            // Manejar el error de solicitud de token
        });
        /*
      event.preventDefault();
    
      if (this.form.valid) {
        const email = this.form.value.email;
        const password = this.form.value.password;
    
        this.authService.login(email, password)
          .then(result => {
            // Autenticación exitosa, redirigir al usuario a la página principal o a otra página deseada
            this.router.navigate(['/dashboard']);
          })
          .catch(error => {
            // Error de autenticación, mostrar mensaje de error o tomar la acción adecuada
            console.error('Error de autenticación:', error);
          });
      }
    
      */
    }
    correctLogin() {
    }
    get getEmail() {
        return this.form.get('email');
    }
    get getPassword() {
        return this.form.get('password');
    }
}
LoginComponent.ɵfac = function LoginComponent_Factory(t) { return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"])); };
LoginComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: LoginComponent, selectors: [["app-login"]], decls: 73, vars: 7, consts: [[1, "login-body"], [1, "login-panel", "p-fluid", "card"], [1, "p-grid", "p-nogutter"], [1, "p-col-12", "border"], [1, "p-grid", "p-text-center"], [1, "p-col-10", "p-offset-1"], ["src", "../assets/logo.png", 1, "imagen-banner"], [1, "p-col-12"], [1, "titleproject"], [1, "versionado"], [1, "p-grid"], [1, "p-col-6", "p-offset-3"], ["autocomplete", "off", 1, "form-auth", 3, "formGroup", "ngSubmit"], [1, "input-wrapper"], [1, "ui-fluid"], [1, "p-col-8", "p-offset-2"], [1, "formLabel"], [1, "p-grid", "p-fluid"], [1, "p-col"], [1, "p-inputgroup"], [1, "p-inputgroup-addon"], [1, "pi", "pi-user"], ["formControlName", "email", "type", "text", "pInputText", "", 2, "background", "#e6e4e4"], [1, "pi", "pi-lock"], ["formControlName", "password", 3, "toggleMask", "feedback"], [1, "p-col-4", "p-offset-4"], ["pButton", "", "type", "submit", "label", "Login", 1, "boton-log", 3, "disabled"]], template: function LoginComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "img", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "label", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Pacific Railway");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "0.1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "form", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function LoginComponent_Template_form_ngSubmit_19_listener($event) { return ctx.submit($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "label", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Email (*)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "span", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](39, "i", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](40, "input", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "label", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Password (*)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "span", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](60, "i", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](61, "p-password", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](69, "button", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](71, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](72, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](42);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](6, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("toggleMask", true)("feedback", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.form.invalid);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"], primeng_password__WEBPACK_IMPORTED_MODULE_6__["Password"], primeng_button__WEBPACK_IMPORTED_MODULE_7__["ButtonDirective"]], styles: [".login-body[_ngcontent-%COMP%] {\r\n  background-size: auto;\r\n    background-size: cover;\r\n    height: auto;\r\n    min-height: 100vh;\r\n}\r\n\r\n.login-body[_ngcontent-%COMP%]   .login-panel[_ngcontent-%COMP%] {\r\n    width: 600px;\r\n    margin: 0 auto;\r\n    background-color: #e6e4e4;\r\n    padding-top: 70px !important;\r\n    margin-top: 60px !important;\r\n}\r\n\r\n.formLabel[_ngcontent-%COMP%]{\r\n  color: #000;\r\n  font: sans-serif;\r\n  font-size: 25px;\r\n\r\n}\r\n\r\nform[_ngcontent-%COMP%]{\r\n  width: 100% !important;\r\n\r\n}\r\n\r\np-password[_ngcontent-%COMP%]{\r\n  width: 100% !important;\r\n  background-color: #e6e4e4;\r\n}\r\n\r\n.imagen-banner[_ngcontent-%COMP%] {\r\n  width: 25%;\r\n}\r\n\r\n.titleproject[_ngcontent-%COMP%]{\r\n  font-size: 30px;\r\n  color: #000000 !important;\r\n    font-family: fuenteparatitulos;\r\n}\r\n\r\n.versionado[_ngcontent-%COMP%] {\r\n  margin-left: 10px;\r\n  text-transform: none;\r\n  font-size: 18px;\r\n  letter-spacing: 2px;\r\n  font-family: fuenteparacuerpo;\r\n  color: #71797a !important;\r\n\r\n}\r\n\r\n.card[_ngcontent-%COMP%] {\r\n  border-radius: 20px;\r\n  background-color: #580707;\r\n  box-shadow: 0px 0px 21px -7px rgba(0,0,0,0.74);\r\n}\r\n\r\n.input-wrapper[_ngcontent-%COMP%]{\r\n  width: 100% !important;\r\n}\r\n\r\n.border[_ngcontent-%COMP%]{\r\n  border-bottom: 8px solid #b91f1f;\r\n}\r\n\r\ninput[_ngcontent-%COMP%] {\r\n    width: 100%;\r\n}\r\n\r\n.p-inputgroup-addon[_ngcontent-%COMP%]{\r\n  background: #e6e4e4;\r\ncolor: #495057;\r\nborder-top: none;\r\nborder-left: none;\r\nborder-bottom: none;\r\n}\r\n\r\n.p-inputgroup[_ngcontent-%COMP%]{\r\n  -webkit-box-shadow: 0 0 0px 1000px #e6e4e4 inset;\r\n\r\n}\r\n\r\n.p-nogutter[_ngcontent-%COMP%] {\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n    margin-top: 0;\r\n}\r\n\r\n.layout-footer[_ngcontent-%COMP%] {\r\n  margin-top: 15px;\r\n padding:1rem;\r\n font-size:1rem;\r\n background-color:var(--surface-a);\r\n display:flex;\r\n align-items:center;\r\n justify-content:space-between\r\n}\r\n\r\n@media screen and (max-width: 780px) {\r\n  .login-body[_ngcontent-%COMP%] {\r\n    background-size: auto;\r\n      background-size: cover;\r\n      height: auto;\r\n      min-height: 100vh;\r\n      padding-top: 70px;\r\n      margin-top: -140px !important;\r\n      margin-left: -20% !important;\r\n  }\r\n\r\n  .login-body[_ngcontent-%COMP%]   .login-panel[_ngcontent-%COMP%] {\r\n      width: 100%;\r\n      margin: 0 auto;\r\n      background-color: #ffffff;\r\n  }\r\n\r\n}\r\n\r\n.boton-log[_ngcontent-%COMP%]{\r\n  background-color: #580707;\r\n  border: none;\r\n  box-shadow: #495057;\r\n  box-shadow: 0px 0px 21px -7px rgba(0,0,0,0.74);\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxxQkFBcUI7SUFDbkIsc0JBQXNCO0lBQ3RCLFlBQVk7SUFDWixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxZQUFZO0lBQ1osY0FBYztJQUNkLHlCQUF5QjtJQUN6Qiw0QkFBNEI7SUFDNUIsMkJBQTJCO0FBQy9COztBQUVBO0VBQ0UsV0FBVztFQUNYLGdCQUFnQjtFQUNoQixlQUFlOztBQUVqQjs7QUFFQTtFQUNFLHNCQUFzQjs7QUFFeEI7O0FBRUE7RUFDRSxzQkFBc0I7RUFDdEIseUJBQXlCO0FBQzNCOztBQUNBO0VBQ0UsVUFBVTtBQUNaOztBQUVBO0VBQ0UsZUFBZTtFQUNmLHlCQUF5QjtJQUN2Qiw4QkFBOEI7QUFDbEM7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsb0JBQW9CO0VBQ3BCLGVBQWU7RUFDZixtQkFBbUI7RUFDbkIsNkJBQTZCO0VBQzdCLHlCQUF5Qjs7QUFFM0I7O0FBQ0E7RUFDRSxtQkFBbUI7RUFDbkIseUJBQXlCO0VBR3pCLDhDQUE4QztBQUNoRDs7QUFFQTtFQUNFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLGdDQUFnQztBQUNsQzs7QUFFQztJQUNHLFdBQVc7QUFDZjs7QUFFQTtFQUNFLG1CQUFtQjtBQUNyQixjQUFjO0FBQ2QsZ0JBQWdCO0FBQ2hCLGlCQUFpQjtBQUNqQixtQkFBbUI7QUFDbkI7O0FBRUE7RUFDRSxnREFBZ0Q7O0FBRWxEOztBQUVBO0lBQ0ksZUFBZTtJQUNmLGNBQWM7SUFDZCxhQUFhO0FBQ2pCOztBQUVBO0VBQ0UsZ0JBQWdCO0NBQ2pCLFlBQVk7Q0FDWixjQUFjO0NBQ2QsaUNBQWlDO0NBQ2pDLFlBQVk7Q0FDWixrQkFBa0I7Q0FDbEI7QUFDRDs7QUFDQTtFQUNFO0lBQ0UscUJBQXFCO01BQ25CLHNCQUFzQjtNQUN0QixZQUFZO01BQ1osaUJBQWlCO01BQ2pCLGlCQUFpQjtNQUNqQiw2QkFBNkI7TUFDN0IsNEJBQTRCO0VBQ2hDOztFQUVBO01BQ0ksV0FBVztNQUNYLGNBQWM7TUFDZCx5QkFBeUI7RUFDN0I7O0FBRUY7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsWUFBWTtFQUNaLG1CQUFtQjtFQUNuQiw4Q0FBOEM7QUFDaEQiLCJmaWxlIjoibG9naW4uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5sb2dpbi1ib2R5IHtcclxuICBiYWNrZ3JvdW5kLXNpemU6IGF1dG87XHJcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xyXG4gICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgbWluLWhlaWdodDogMTAwdmg7XHJcbn1cclxuXHJcbi5sb2dpbi1ib2R5IC5sb2dpbi1wYW5lbCB7XHJcbiAgICB3aWR0aDogNjAwcHg7XHJcbiAgICBtYXJnaW46IDAgYXV0bztcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlNmU0ZTQ7XHJcbiAgICBwYWRkaW5nLXRvcDogNzBweCAhaW1wb3J0YW50O1xyXG4gICAgbWFyZ2luLXRvcDogNjBweCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uZm9ybUxhYmVse1xyXG4gIGNvbG9yOiAjMDAwO1xyXG4gIGZvbnQ6IHNhbnMtc2VyaWY7XHJcbiAgZm9udC1zaXplOiAyNXB4O1xyXG5cclxufVxyXG5cclxuZm9ybXtcclxuICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG5cclxufVxyXG5cclxucC1wYXNzd29yZHtcclxuICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNlNmU0ZTQ7XHJcbn1cclxuLmltYWdlbi1iYW5uZXIge1xyXG4gIHdpZHRoOiAyNSU7XHJcbn1cclxuXHJcbi50aXRsZXByb2plY3R7XHJcbiAgZm9udC1zaXplOiAzMHB4O1xyXG4gIGNvbG9yOiAjMDAwMDAwICFpbXBvcnRhbnQ7XHJcbiAgICBmb250LWZhbWlseTogZnVlbnRlcGFyYXRpdHVsb3M7XHJcbn1cclxuXHJcbi52ZXJzaW9uYWRvIHtcclxuICBtYXJnaW4tbGVmdDogMTBweDtcclxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcclxuICBmb250LXNpemU6IDE4cHg7XHJcbiAgbGV0dGVyLXNwYWNpbmc6IDJweDtcclxuICBmb250LWZhbWlseTogZnVlbnRlcGFyYWN1ZXJwbztcclxuICBjb2xvcjogIzcxNzk3YSAhaW1wb3J0YW50O1xyXG5cclxufVxyXG4uY2FyZCB7XHJcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTgwNzA3O1xyXG4gIC13ZWJraXQtYm94LXNoYWRvdzogMHB4IDBweCAyMXB4IC03cHggcmdiYSgwLDAsMCwwLjc0KTtcclxuICAtbW96LWJveC1zaGFkb3c6IDBweCAwcHggMjFweCAtN3B4IHJnYmEoMCwwLDAsMC43NCk7XHJcbiAgYm94LXNoYWRvdzogMHB4IDBweCAyMXB4IC03cHggcmdiYSgwLDAsMCwwLjc0KTtcclxufVxyXG5cclxuLmlucHV0LXdyYXBwZXJ7XHJcbiAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxufVxyXG5cclxuLmJvcmRlcntcclxuICBib3JkZXItYm90dG9tOiA4cHggc29saWQgI2I5MWYxZjtcclxufVxyXG5cclxuIGlucHV0IHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4ucC1pbnB1dGdyb3VwLWFkZG9ue1xyXG4gIGJhY2tncm91bmQ6ICNlNmU0ZTQ7XHJcbmNvbG9yOiAjNDk1MDU3O1xyXG5ib3JkZXItdG9wOiBub25lO1xyXG5ib3JkZXItbGVmdDogbm9uZTtcclxuYm9yZGVyLWJvdHRvbTogbm9uZTtcclxufVxyXG5cclxuLnAtaW5wdXRncm91cHtcclxuICAtd2Via2l0LWJveC1zaGFkb3c6IDAgMCAwcHggMTAwMHB4ICNlNmU0ZTQgaW5zZXQ7XHJcblxyXG59XHJcblxyXG4ucC1ub2d1dHRlciB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDA7XHJcbiAgICBtYXJnaW4tbGVmdDogMDtcclxuICAgIG1hcmdpbi10b3A6IDA7XHJcbn1cclxuXHJcbi5sYXlvdXQtZm9vdGVyIHtcclxuICBtYXJnaW4tdG9wOiAxNXB4O1xyXG4gcGFkZGluZzoxcmVtO1xyXG4gZm9udC1zaXplOjFyZW07XHJcbiBiYWNrZ3JvdW5kLWNvbG9yOnZhcigtLXN1cmZhY2UtYSk7XHJcbiBkaXNwbGF5OmZsZXg7XHJcbiBhbGlnbi1pdGVtczpjZW50ZXI7XHJcbiBqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlblxyXG59XHJcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc4MHB4KSB7XHJcbiAgLmxvZ2luLWJvZHkge1xyXG4gICAgYmFja2dyb3VuZC1zaXplOiBhdXRvO1xyXG4gICAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xyXG4gICAgICBoZWlnaHQ6IGF1dG87XHJcbiAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICBwYWRkaW5nLXRvcDogNzBweDtcclxuICAgICAgbWFyZ2luLXRvcDogLTE0MHB4ICFpbXBvcnRhbnQ7XHJcbiAgICAgIG1hcmdpbi1sZWZ0OiAtMjAlICFpbXBvcnRhbnQ7XHJcbiAgfVxyXG5cclxuICAubG9naW4tYm9keSAubG9naW4tcGFuZWwge1xyXG4gICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLmJvdG9uLWxvZ3tcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTgwNzA3O1xyXG4gIGJvcmRlcjogbm9uZTtcclxuICBib3gtc2hhZG93OiAjNDk1MDU3O1xyXG4gIGJveC1zaGFkb3c6IDBweCAwcHggMjFweCAtN3B4IHJnYmEoMCwwLDAsMC43NCk7XHJcbn1cclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LoginComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-login',
                templateUrl: './login.component.html',
                styleUrls: ['./login.component.css'],
            }]
    }], function () { return [{ type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] }, { type: _services_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"] }]; }, null); })();


/***/ }),

/***/ "ccyI":
/*!*********************************!*\
  !*** ./src/app/auth.service.ts ***!
  \*********************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! amazon-cognito-identity-js */ "TESy");



class AuthService {
    constructor() {
        const poolData = {
            UserPoolId: 'us-west-2_YKTiEMjtU',
            ClientId: 's7ch645u8voh00dridmn8kn19'
        };
        this.userPool = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_1__["CognitoUserPool"](poolData);
    }
    authenticate() {
        return new Promise((resolve, reject) => {
            const cognitoUser = this.userPool.getCurrentUser();
            if (cognitoUser) {
                cognitoUser.getSession((err, session) => {
                    if (err) {
                        reject(err);
                    }
                    else if (!session.isValid()) {
                        reject(new Error('Invalid session'));
                    }
                    else {
                        resolve(session);
                    }
                });
            }
            else {
                reject(new Error('No user found'));
            }
        });
    }
}
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(); };
AuthService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AuthService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "dv1a":
/*!**********************************************************!*\
  !*** ./src/app/modules/train/chasis/chasis.component.ts ***!
  \**********************************************************/
/*! exports provided: ChasisComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChasisComponent", function() { return ChasisComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");



function ChasisComponent_ng_container_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r0.Train.train.name, " ");
} }
class ChasisComponent {
    constructor() { }
    ngOnInit() {
    }
}
ChasisComponent.ɵfac = function ChasisComponent_Factory(t) { return new (t || ChasisComponent)(); };
ChasisComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ChasisComponent, selectors: [["app-chasis"]], inputs: { Train: "Train" }, decls: 12, vars: 1, consts: [["id", "modalchasis", 1, "modal"], [1, "modal-content"], [1, "row"], [1, "col", "s12"], [4, "ngIf"], ["id", "cambiodetamanio11", 1, "input-field", "col", "s12", "center-align"], ["id", "btncerrar", 1, "btn", "modal-close", "waves-effect", "waves-light", "close"]], template: function ChasisComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, ChasisComponent_ng_container_7_Template, 2, 1, "ng-container", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Salir");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.Train != undefined);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"]], styles: [".container[_ngcontent-%COMP%]{\r\n  margin-top: 2%;\r\n\r\n}\r\n\r\n.container-principal[_ngcontent-%COMP%]{\r\n  margin-top: 2%;\r\n  margin-left: 20%;\r\n  max-width: 75%;\r\n  height:100%;\r\n  position: relative;\r\n\r\n}\r\n\r\n.container-map[_ngcontent-%COMP%]{\r\n  height:780px;\r\n  width:1200px;\r\n\r\n  position: relative;\r\n\r\n\r\n}\r\n\r\n.pi-search[_ngcontent-%COMP%]{\r\n  margin-left: -40px !important;\r\n}\r\n\r\n.map[_ngcontent-%COMP%]{\r\n\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n}\r\n\r\n.summary[_ngcontent-%COMP%]{\r\n    position: sticky;\r\n    margin-top: 0;\r\n    background-color: black;\r\n    height: 15vh;\r\n    bottom:0;\r\n\r\n\r\n\r\n}\r\n\r\n.mapboxgl-popup-content[_ngcontent-%COMP%] {\r\n    color: black !important;\r\n}\r\n\r\n.mapboxgl-ctrl-group[_ngcontent-%COMP%]{\r\n    color: black;\r\n}\r\n\r\n.p-tabmenuitem[_ngcontent-%COMP%] {\r\n  width: 33.33% !important;\r\n\r\n}\r\n\r\n.titleGeneral[_ngcontent-%COMP%]{\r\n  font-size: 24px;\r\n  color: #000 !important;\r\n  font-family: fuenteparatitulos;\r\n\r\n}\r\n\r\n@media screen and (max-width: 780px) {\r\n  .container-principal[_ngcontent-%COMP%]{\r\n    margin-top: 2%;\r\n    margin-left: 5%;\r\n    max-width: 90%;\r\n  }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoYXNpcy5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTtFQUNFLGNBQWM7O0FBRWhCOztBQUVBO0VBQ0UsY0FBYztFQUNkLGdCQUFnQjtFQUNoQixjQUFjO0VBQ2QsV0FBVztFQUNYLGtCQUFrQjs7QUFFcEI7O0FBRUE7RUFDRSxZQUFZO0VBQ1osWUFBWTs7RUFFWixrQkFBa0I7OztBQUdwQjs7QUFDQTtFQUNFLDZCQUE2QjtBQUMvQjs7QUFJQTs7SUFFSSxXQUFXO0lBQ1gsWUFBWTs7QUFFaEI7O0FBQ0E7SUFDSSxnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLHVCQUF1QjtJQUN2QixZQUFZO0lBQ1osUUFBUTs7OztBQUlaOztBQUdBO0lBQ0ksdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksWUFBWTtBQUNoQjs7QUFFQTtFQUNFLHdCQUF3Qjs7QUFFMUI7O0FBRUE7RUFDRSxlQUFlO0VBQ2Ysc0JBQXNCO0VBQ3RCLDhCQUE4Qjs7QUFFaEM7O0FBR0E7RUFDRTtJQUNFLGNBQWM7SUFDZCxlQUFlO0lBQ2YsY0FBYztFQUNoQjtBQUNGIiwiZmlsZSI6ImNoYXNpcy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi5jb250YWluZXJ7XHJcbiAgbWFyZ2luLXRvcDogMiU7XHJcblxyXG59XHJcblxyXG4uY29udGFpbmVyLXByaW5jaXBhbHtcclxuICBtYXJnaW4tdG9wOiAyJTtcclxuICBtYXJnaW4tbGVmdDogMjAlO1xyXG4gIG1heC13aWR0aDogNzUlO1xyXG4gIGhlaWdodDoxMDAlO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcbn1cclxuXHJcbi5jb250YWluZXItbWFwe1xyXG4gIGhlaWdodDo3ODBweDtcclxuICB3aWR0aDoxMjAwcHg7XHJcblxyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcblxyXG59XHJcbi5waS1zZWFyY2h7XHJcbiAgbWFyZ2luLWxlZnQ6IC00MHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcblxyXG5cclxuLm1hcHtcclxuXHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGhlaWdodDogMTAwJTtcclxuXHJcbn1cclxuLnN1bW1hcnl7XHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG4gICAgbWFyZ2luLXRvcDogMDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgaGVpZ2h0OiAxNXZoO1xyXG4gICAgYm90dG9tOjA7XHJcblxyXG5cclxuXHJcbn1cclxuXHJcblxyXG4ubWFwYm94Z2wtcG9wdXAtY29udGVudCB7XHJcbiAgICBjb2xvcjogYmxhY2sgIWltcG9ydGFudDtcclxufVxyXG5cclxuLm1hcGJveGdsLWN0cmwtZ3JvdXB7XHJcbiAgICBjb2xvcjogYmxhY2s7XHJcbn1cclxuXHJcbi5wLXRhYm1lbnVpdGVtIHtcclxuICB3aWR0aDogMzMuMzMlICFpbXBvcnRhbnQ7XHJcblxyXG59XHJcblxyXG4udGl0bGVHZW5lcmFse1xyXG4gIGZvbnQtc2l6ZTogMjRweDtcclxuICBjb2xvcjogIzAwMCAhaW1wb3J0YW50O1xyXG4gIGZvbnQtZmFtaWx5OiBmdWVudGVwYXJhdGl0dWxvcztcclxuXHJcbn1cclxuXHJcblxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3ODBweCkge1xyXG4gIC5jb250YWluZXItcHJpbmNpcGFse1xyXG4gICAgbWFyZ2luLXRvcDogMiU7XHJcbiAgICBtYXJnaW4tbGVmdDogNSU7XHJcbiAgICBtYXgtd2lkdGg6IDkwJTtcclxuICB9XHJcbn1cclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ChasisComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-chasis',
                templateUrl: './chasis.component.html',
                styleUrls: ['./chasis.component.css']
            }]
    }], function () { return []; }, { Train: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "hSeH":
/*!***************************************************************!*\
  !*** ./src/app/auth/access-denied/access-denied.component.ts ***!
  \***************************************************************/
/*! exports provided: AccessDeniedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccessDeniedComponent", function() { return AccessDeniedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/auth.service */ "N/25");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");






class AccessDeniedComponent {
    constructor(formBuilder, authService, http, route, 
    //  private sessionStorageService: SessionStorageService,
    router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.http = http;
        this.route = route;
        this.router = router;
        this.loading = false;
    }
    ngOnInit() {
    }
    gotoLogin() {
        const externalUrl = 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/authorize?client_id=78fqe248a2ghet7oi0v94hbtnp&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d1klk34joigd80.amplifyapp.com%2Fcurrent-chassis-location';
        window.location.href = externalUrl;
    }
}
AccessDeniedComponent.ɵfac = function AccessDeniedComponent_Factory(t) { return new (t || AccessDeniedComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"])); };
AccessDeniedComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AccessDeniedComponent, selectors: [["app-access-denied"]], decls: 29, vars: 0, consts: [[1, "login-body"], [1, "login-panel", "p-fluid", "card"], [1, "p-grid", "p-nogutter"], [1, "p-col-12", "border"], [1, "p-grid", "p-text-center"], [1, "p-col-10", "p-offset-1"], ["src", "../assets/logo.png", 1, "imagen-banner"], [1, "p-col-12"], [1, "titleproject"], [1, "versionado"], [1, "p-grid"], [1, "p-col-6", "p-offset-3"], [1, "p-col-8", "p-offset-2", "p-text-center"], [1, "acessDenied"], [1, "p-col-8", "p-offset-2"], [1, "infoDenied"]], template: function AccessDeniedComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "img", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "label", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Pacific Railway");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "0.1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](20, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "label", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Acess Denied");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "span", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, " You do not have the necessary permissions to view the application. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](28, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
    } }, styles: [".login-body[_ngcontent-%COMP%] {\r\n  background-size: auto;\r\n    background-size: cover;\r\n    height: auto;\r\n    min-height: 100vh;\r\n}\r\n\r\n.login-body[_ngcontent-%COMP%]   .login-panel[_ngcontent-%COMP%] {\r\n    width: 600px;\r\n    margin: 0 auto;\r\n    background-color: #e6e4e4;\r\n    padding-top: 70px !important;\r\n    margin-top: 60px !important;\r\n}\r\n\r\n.formLabel[_ngcontent-%COMP%]{\r\n  color: #000;\r\n  font: sans-serif;\r\n  font-size: 25px;\r\n\r\n}\r\n\r\n.acessDenied[_ngcontent-%COMP%]{\r\n  color: red;\r\n  font-family: fuenteparatitulos;\r\n  font-size: 35px;\r\n}\r\n\r\n.infoDenied[_ngcontent-%COMP%]{\r\n  color: black;\r\n  font-family: fuenteparatitulos;\r\n  font-size: 20px;\r\n    text-align: justify;\r\n}\r\n\r\nform[_ngcontent-%COMP%]{\r\n  width: 100% !important;\r\n\r\n}\r\n\r\np-password[_ngcontent-%COMP%]{\r\n  width: 100% !important;\r\n  background-color: #e6e4e4;\r\n}\r\n\r\n.imagen-banner[_ngcontent-%COMP%] {\r\n  width: 25%;\r\n}\r\n\r\n.titleproject[_ngcontent-%COMP%]{\r\n  font-size: 30px;\r\n  color: #000000 !important;\r\n    font-family: fuenteparatitulos;\r\n}\r\n\r\n.versionado[_ngcontent-%COMP%] {\r\n  margin-left: 10px;\r\n  text-transform: none;\r\n  font-size: 18px;\r\n  letter-spacing: 2px;\r\n  font-family: fuenteparacuerpo;\r\n  color: #71797a !important;\r\n\r\n}\r\n\r\n.card[_ngcontent-%COMP%] {\r\n  border-radius: 20px;\r\n  background-color: #580707;\r\n  box-shadow: 0px 0px 21px -7px rgba(0,0,0,0.74);\r\n}\r\n\r\n.input-wrapper[_ngcontent-%COMP%]{\r\n  width: 100% !important;\r\n}\r\n\r\n.border[_ngcontent-%COMP%]{\r\n  border-bottom: 8px solid #b91f1f;\r\n}\r\n\r\ninput[_ngcontent-%COMP%] {\r\n    width: 100%;\r\n}\r\n\r\n.p-inputgroup-addon[_ngcontent-%COMP%]{\r\n  background: #e6e4e4;\r\ncolor: #495057;\r\nborder-top: none;\r\nborder-left: none;\r\nborder-bottom: none;\r\n}\r\n\r\n.p-inputgroup[_ngcontent-%COMP%]{\r\n  -webkit-box-shadow: 0 0 0px 1000px #e6e4e4 inset;\r\n\r\n}\r\n\r\n.p-nogutter[_ngcontent-%COMP%] {\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n    margin-top: 0;\r\n}\r\n\r\n.layout-footer[_ngcontent-%COMP%] {\r\n  margin-top: 15px;\r\n padding:1rem;\r\n font-size:1rem;\r\n background-color:var(--surface-a);\r\n display:flex;\r\n align-items:center;\r\n justify-content:space-between\r\n}\r\n\r\n@media screen and (max-width: 780px) {\r\n  .login-body[_ngcontent-%COMP%] {\r\n    background-size: auto;\r\n      background-size: cover;\r\n      height: auto;\r\n      min-height: 100vh;\r\n      padding-top: 70px;\r\n      margin-top: -140px !important;\r\n      margin-left: -20% !important;\r\n  }\r\n\r\n  .login-body[_ngcontent-%COMP%]   .login-panel[_ngcontent-%COMP%] {\r\n      width: 100%;\r\n      margin: 0 auto;\r\n      background-color: #ffffff;\r\n  }\r\n\r\n}\r\n\r\n.boton-log[_ngcontent-%COMP%]{\r\n  background-color: #580707;\r\n  border: none;\r\n  box-shadow: #495057;\r\n  box-shadow: 0px 0px 21px -7px rgba(0,0,0,0.74);\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY2Vzcy1kZW5pZWQuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFxQjtJQUNuQixzQkFBc0I7SUFDdEIsWUFBWTtJQUNaLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLFlBQVk7SUFDWixjQUFjO0lBQ2QseUJBQXlCO0lBQ3pCLDRCQUE0QjtJQUM1QiwyQkFBMkI7QUFDL0I7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsZ0JBQWdCO0VBQ2hCLGVBQWU7O0FBRWpCOztBQUVBO0VBQ0UsVUFBVTtFQUNWLDhCQUE4QjtFQUM5QixlQUFlO0FBQ2pCOztBQUdBO0VBQ0UsWUFBWTtFQUNaLDhCQUE4QjtFQUM5QixlQUFlO0lBQ2IsbUJBQW1CO0FBQ3ZCOztBQUVBO0VBQ0Usc0JBQXNCOztBQUV4Qjs7QUFFQTtFQUNFLHNCQUFzQjtFQUN0Qix5QkFBeUI7QUFDM0I7O0FBQ0E7RUFDRSxVQUFVO0FBQ1o7O0FBRUE7RUFDRSxlQUFlO0VBQ2YseUJBQXlCO0lBQ3ZCLDhCQUE4QjtBQUNsQzs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixvQkFBb0I7RUFDcEIsZUFBZTtFQUNmLG1CQUFtQjtFQUNuQiw2QkFBNkI7RUFDN0IseUJBQXlCOztBQUUzQjs7QUFDQTtFQUNFLG1CQUFtQjtFQUNuQix5QkFBeUI7RUFHekIsOENBQThDO0FBQ2hEOztBQUVBO0VBQ0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsZ0NBQWdDO0FBQ2xDOztBQUVDO0lBQ0csV0FBVztBQUNmOztBQUVBO0VBQ0UsbUJBQW1CO0FBQ3JCLGNBQWM7QUFDZCxnQkFBZ0I7QUFDaEIsaUJBQWlCO0FBQ2pCLG1CQUFtQjtBQUNuQjs7QUFFQTtFQUNFLGdEQUFnRDs7QUFFbEQ7O0FBRUE7SUFDSSxlQUFlO0lBQ2YsY0FBYztJQUNkLGFBQWE7QUFDakI7O0FBRUE7RUFDRSxnQkFBZ0I7Q0FDakIsWUFBWTtDQUNaLGNBQWM7Q0FDZCxpQ0FBaUM7Q0FDakMsWUFBWTtDQUNaLGtCQUFrQjtDQUNsQjtBQUNEOztBQUNBO0VBQ0U7SUFDRSxxQkFBcUI7TUFDbkIsc0JBQXNCO01BQ3RCLFlBQVk7TUFDWixpQkFBaUI7TUFDakIsaUJBQWlCO01BQ2pCLDZCQUE2QjtNQUM3Qiw0QkFBNEI7RUFDaEM7O0VBRUE7TUFDSSxXQUFXO01BQ1gsY0FBYztNQUNkLHlCQUF5QjtFQUM3Qjs7QUFFRjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixZQUFZO0VBQ1osbUJBQW1CO0VBQ25CLDhDQUE4QztBQUNoRCIsImZpbGUiOiJhY2Nlc3MtZGVuaWVkLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubG9naW4tYm9keSB7XHJcbiAgYmFja2dyb3VuZC1zaXplOiBhdXRvO1xyXG4gICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICAgIGhlaWdodDogYXV0bztcclxuICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xyXG59XHJcblxyXG4ubG9naW4tYm9keSAubG9naW4tcGFuZWwge1xyXG4gICAgd2lkdGg6IDYwMHB4O1xyXG4gICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTZlNGU0O1xyXG4gICAgcGFkZGluZy10b3A6IDcwcHggIWltcG9ydGFudDtcclxuICAgIG1hcmdpbi10b3A6IDYwcHggIWltcG9ydGFudDtcclxufVxyXG5cclxuLmZvcm1MYWJlbHtcclxuICBjb2xvcjogIzAwMDtcclxuICBmb250OiBzYW5zLXNlcmlmO1xyXG4gIGZvbnQtc2l6ZTogMjVweDtcclxuXHJcbn1cclxuXHJcbi5hY2Vzc0RlbmllZHtcclxuICBjb2xvcjogcmVkO1xyXG4gIGZvbnQtZmFtaWx5OiBmdWVudGVwYXJhdGl0dWxvcztcclxuICBmb250LXNpemU6IDM1cHg7XHJcbn1cclxuXHJcblxyXG4uaW5mb0RlbmllZHtcclxuICBjb2xvcjogYmxhY2s7XHJcbiAgZm9udC1mYW1pbHk6IGZ1ZW50ZXBhcmF0aXR1bG9zO1xyXG4gIGZvbnQtc2l6ZTogMjBweDtcclxuICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XHJcbn1cclxuXHJcbmZvcm17XHJcbiAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuXHJcbn1cclxuXHJcbnAtcGFzc3dvcmR7XHJcbiAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTZlNGU0O1xyXG59XHJcbi5pbWFnZW4tYmFubmVyIHtcclxuICB3aWR0aDogMjUlO1xyXG59XHJcblxyXG4udGl0bGVwcm9qZWN0e1xyXG4gIGZvbnQtc2l6ZTogMzBweDtcclxuICBjb2xvcjogIzAwMDAwMCAhaW1wb3J0YW50O1xyXG4gICAgZm9udC1mYW1pbHk6IGZ1ZW50ZXBhcmF0aXR1bG9zO1xyXG59XHJcblxyXG4udmVyc2lvbmFkbyB7XHJcbiAgbWFyZ2luLWxlZnQ6IDEwcHg7XHJcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XHJcbiAgZm9udC1zaXplOiAxOHB4O1xyXG4gIGxldHRlci1zcGFjaW5nOiAycHg7XHJcbiAgZm9udC1mYW1pbHk6IGZ1ZW50ZXBhcmFjdWVycG87XHJcbiAgY29sb3I6ICM3MTc5N2EgIWltcG9ydGFudDtcclxuXHJcbn1cclxuLmNhcmQge1xyXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzU4MDcwNztcclxuICAtd2Via2l0LWJveC1zaGFkb3c6IDBweCAwcHggMjFweCAtN3B4IHJnYmEoMCwwLDAsMC43NCk7XHJcbiAgLW1vei1ib3gtc2hhZG93OiAwcHggMHB4IDIxcHggLTdweCByZ2JhKDAsMCwwLDAuNzQpO1xyXG4gIGJveC1zaGFkb3c6IDBweCAwcHggMjFweCAtN3B4IHJnYmEoMCwwLDAsMC43NCk7XHJcbn1cclxuXHJcbi5pbnB1dC13cmFwcGVye1xyXG4gIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5ib3JkZXJ7XHJcbiAgYm9yZGVyLWJvdHRvbTogOHB4IHNvbGlkICNiOTFmMWY7XHJcbn1cclxuXHJcbiBpbnB1dCB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLnAtaW5wdXRncm91cC1hZGRvbntcclxuICBiYWNrZ3JvdW5kOiAjZTZlNGU0O1xyXG5jb2xvcjogIzQ5NTA1NztcclxuYm9yZGVyLXRvcDogbm9uZTtcclxuYm9yZGVyLWxlZnQ6IG5vbmU7XHJcbmJvcmRlci1ib3R0b206IG5vbmU7XHJcbn1cclxuXHJcbi5wLWlucHV0Z3JvdXB7XHJcbiAgLXdlYmtpdC1ib3gtc2hhZG93OiAwIDAgMHB4IDEwMDBweCAjZTZlNGU0IGluc2V0O1xyXG5cclxufVxyXG5cclxuLnAtbm9ndXR0ZXIge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAwO1xyXG4gICAgbWFyZ2luLWxlZnQ6IDA7XHJcbiAgICBtYXJnaW4tdG9wOiAwO1xyXG59XHJcblxyXG4ubGF5b3V0LWZvb3RlciB7XHJcbiAgbWFyZ2luLXRvcDogMTVweDtcclxuIHBhZGRpbmc6MXJlbTtcclxuIGZvbnQtc2l6ZToxcmVtO1xyXG4gYmFja2dyb3VuZC1jb2xvcjp2YXIoLS1zdXJmYWNlLWEpO1xyXG4gZGlzcGxheTpmbGV4O1xyXG4gYWxpZ24taXRlbXM6Y2VudGVyO1xyXG4ganVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW5cclxufVxyXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA3ODBweCkge1xyXG4gIC5sb2dpbi1ib2R5IHtcclxuICAgIGJhY2tncm91bmQtc2l6ZTogYXV0bztcclxuICAgICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcclxuICAgICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxuICAgICAgcGFkZGluZy10b3A6IDcwcHg7XHJcbiAgICAgIG1hcmdpbi10b3A6IC0xNDBweCAhaW1wb3J0YW50O1xyXG4gICAgICBtYXJnaW4tbGVmdDogLTIwJSAhaW1wb3J0YW50O1xyXG4gIH1cclxuXHJcbiAgLmxvZ2luLWJvZHkgLmxvZ2luLXBhbmVsIHtcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbi5ib3Rvbi1sb2d7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzU4MDcwNztcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgYm94LXNoYWRvdzogIzQ5NTA1NztcclxuICBib3gtc2hhZG93OiAwcHggMHB4IDIxcHggLTdweCByZ2JhKDAsMCwwLDAuNzQpO1xyXG59XHJcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AccessDeniedComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-access-denied',
                templateUrl: './access-denied.component.html',
                styleUrls: ['./access-denied.component.css'],
            }]
    }], function () { return [{ type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] }, { type: _services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["ActivatedRoute"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }]; }, null); })();


/***/ }),

/***/ "iACI":
/*!********************************************************************************!*\
  !*** ./src/app/modules/route-map/table-route-map/table-route-map.component.ts ***!
  \********************************************************************************/
/*! exports provided: TableRouteMapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableRouteMapComponent", function() { return TableRouteMapComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/table */ "rEr+");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/api */ "7zfz");






function TableRouteMapComponent_div_1_ng_container_3_ng_template_9_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "th", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate1"]("width:", col_r8.width, "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", col_r8.header, " ");
} }
function TableRouteMapComponent_div_1_ng_container_3_ng_template_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableRouteMapComponent_div_1_ng_container_3_ng_template_9_ng_container_1_Template, 3, 4, "ng-container", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const columns_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", columns_r6);
} }
function TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_3_Template_a_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r18); const object_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2).$implicit; const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3); return ctx_r16.gotomapcenter(object_r9); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const object_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", object_r9[col_r11.field], "");
} }
function TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_4_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2).$implicit;
    const object_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", object_r9[col_r11.field], " mi ");
} }
function TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_4_ng_container_1_Template, 2, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const object_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", object_r9[col_r11.field] != "undefined");
} }
function TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_5_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2).$implicit;
    const object_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", object_r9[col_r11.field], " mi ");
} }
function TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_5_ng_container_1_Template, 2, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const object_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r14.isEmpty(object_r9[col_r11.field]));
} }
function TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const object_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", object_r9[col_r11.field], " ");
} }
function TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_3_Template, 4, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_4_Template, 2, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_5_Template, 2, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_ng_container_6_Template, 2, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate1"]("width:", col_r11.width, "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r11.field == "num");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r11.field == "total_distance");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r11.field == "traveled_distance");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r11.field != "num" && col_r11.field != "total_distance" && col_r11.field != "traveled_distance");
} }
function TableRouteMapComponent_div_1_ng_container_3_ng_template_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableRouteMapComponent_div_1_ng_container_3_ng_template_10_ng_container_1_Template, 7, 7, "ng-container", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r5.cols);
} }
const _c0 = function () { return { "min-width": "50rem" }; };
function TableRouteMapComponent_div_1_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "p-table", 8, 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, TableRouteMapComponent_div_1_ng_container_3_ng_template_9_Template, 2, 1, "ng-template", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, TableRouteMapComponent_div_1_ng_container_3_ng_template_10_Template, 2, 1, "ng-template", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" Historical Points (", ctx_r1.Data.length, ") ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx_r1.Data)("columns", ctx_r1.cols)("reorderableColumns", true)("scrollable", true)("resizableColumns", true)("tableStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](7, _c0));
} }
function TableRouteMapComponent_div_1_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" Historical Points (", ctx_r2.Data.length, ") ");
} }
function TableRouteMapComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, TableRouteMapComponent_div_1_ng_container_3_Template, 11, 8, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, TableRouteMapComponent_div_1_ng_container_4_Template, 3, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.Data.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.Data.length == 0);
} }
class TableRouteMapComponent {
    constructor(router) {
        this.router = router;
        this.SendCenter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ngOnInit() {
        this.cols = [
            { width: '10', field: 'num', header: 'N°' },
            //{ width: '12',field: 'lat', header: 'Latitude' },
            //{ width: '12',field: 'lon', header: 'Longitude' },
            { width: '12', field: 'coordinates', header: 'Coordinates' },
            { width: '12', field: 'move_type_format', header: 'Move Type' },
            { width: '12', field: 'date', header: 'Date' },
            { width: '12', field: 'total_distance', header: 'Total Distance' },
            { width: '12', field: 'traveled_distance', header: 'Traveled Distance' },
            { width: '24', field: 'georeference', header: 'Geofence' }
        ];
    }
    ngAfterViewInit() {
    }
    isEmpty(str) {
        return (!str || 0 === str.length);
    }
    gotomapcenter(value) {
        this.SendCenter.emit(value);
    }
}
TableRouteMapComponent.ɵfac = function TableRouteMapComponent_Factory(t) { return new (t || TableRouteMapComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"])); };
TableRouteMapComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: TableRouteMapComponent, selectors: [["app-table-route-map"]], inputs: { Data: "Data" }, outputs: { SendCenter: "SendCenter" }, decls: 4, vars: 1, consts: [[1, "row"], ["class", "p-col-12", 4, "ngIf"], [1, "p-col-12"], [4, "ngIf"], [1, "col", "s12"], [1, "col", "s2"], [1, "col", "s8"], [1, "col", "s2", "right-align"], ["scrollHeight", "400px", "styleClass", "p-datatable-striped p-datatable-gridlines", 3, "value", "columns", "reorderableColumns", "scrollable", "resizableColumns", "tableStyle"], ["dt1", ""], ["pTemplate", "header"], ["pTemplate", "body"], [4, "ngFor", "ngForOf"], ["pReorderableColumn", ""], [1, "tdbreak"], [1, "center-align"], ["href", "javascript:void(0);", 3, "click"]], template: function TableRouteMapComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableRouteMapComponent_div_1_Template, 5, 2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.Data != undefined);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], primeng_table__WEBPACK_IMPORTED_MODULE_3__["Table"], primeng_api__WEBPACK_IMPORTED_MODULE_4__["PrimeTemplate"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], primeng_table__WEBPACK_IMPORTED_MODULE_3__["ReorderableColumn"]], styles: [".container[_ngcontent-%COMP%]{\r\n \r\n\r\n}\r\n\r\n.container-principal[_ngcontent-%COMP%]{\r\n  max-width: 100%;\r\n  height:100%;\r\n  position: relative;\r\n}\r\n\r\n.tdbreak[_ngcontent-%COMP%] {\r\n    white-space: initial;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYmxlLXJvdXRlLW1hcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTtDQUNDLHFCQUFxQjs7QUFFdEI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsV0FBVztFQUNYLGtCQUFrQjtBQUNwQjs7QUFJQTtJQUNJLG9CQUFvQjtBQUN4QiIsImZpbGUiOiJ0YWJsZS1yb3V0ZS1tYXAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4uY29udGFpbmVye1xyXG4gLyogIG1hcmdpbi10b3A6IDIlOyAqL1xyXG5cclxufVxyXG5cclxuLmNvbnRhaW5lci1wcmluY2lwYWx7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDoxMDAlO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG5cclxuXHJcblxyXG4udGRicmVhayB7XHJcbiAgICB3aGl0ZS1zcGFjZTogaW5pdGlhbDtcclxufVxyXG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TableRouteMapComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-table-route-map',
                templateUrl: './table-route-map.component.html',
                styleUrls: ['./table-route-map.component.css']
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] }]; }, { Data: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], SendCenter: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }] }); })();


/***/ }),

/***/ "k8Bf":
/*!**************************************************!*\
  !*** ./src/app/core/services/map-store.class.ts ***!
  \**************************************************/
/*! exports provided: MapStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapStore", function() { return MapStore; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");

class MapStore {
    constructor(initialState) {
        this.state$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](initialState);
    }
    getValue() {
        if (typeof this.state$ !== 'undefined') {
            return this.state$.getValue();
        }
    }
    getState() {
        if (typeof this.state$ !== 'undefined') {
            console.log('getState', this.state$);
            return this.state$.asObservable();
        }
        else {
            console.error('State is not set in map-store');
        }
    }
    setState(nextState) {
        if (typeof this.state$ === 'undefined') {
            this.state$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](nextState);
        }
        else {
            this.state$.next(nextState);
        }
    }
}


/***/ }),

/***/ "mXlp":
/*!*******************************************************************!*\
  !*** ./src/app/modules/launchpad/navlauch/navlaunch.component.ts ***!
  \*******************************************************************/
/*! exports provided: NavlaunchComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavlaunchComponent", function() { return NavlaunchComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");


class NavlaunchComponent {
    constructor() {
        this.SelectOption = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ngOnInit() {
    }
    selectOption(option) {
        this.SelectOption.emit(option);
    }
}
NavlaunchComponent.ɵfac = function NavlaunchComponent_Factory(t) { return new (t || NavlaunchComponent)(); };
NavlaunchComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NavlaunchComponent, selectors: [["app-navlaunch"]], outputs: { SelectOption: "SelectOption" }, decls: 35, vars: 0, consts: [[1, "nav"], ["href", "#", "data-target", "mobile-demo", 1, "sidenav-trigger"], [1, "material-icons"], ["id", "nav-mobile", 1, "center", "hide-on-med-and-down"], ["href", "javascript:void(0);", 1, "pi", "pi-angle-left", "text-nav"], ["href", "javascript:void(0);", 1, "text-nav", 3, "click"], ["href", "javascript:void(0);", 1, "text-nav", "active", 3, "click"], ["href", "javascript:void(0);", 1, "pi", "pi-angle-down", "text-nav", 3, "click"], ["id", "nav-mobile", 1, "right", "hide-on-med-and-down"], [1, "tab"], ["href", "", 1, "text-nav-right"], ["href", "", 1, "text-nav-right", "active"]], template: function NavlaunchComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "nav");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "i", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "menu");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "ul", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "a", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function NavlaunchComponent_Template_a_click_9_listener() { return ctx.selectOption(1); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, "pping Instructions");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function NavlaunchComponent_Template_a_click_12_listener() { return ctx.selectOption(2); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Empty Management");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function NavlaunchComponent_Template_a_click_15_listener() { return ctx.selectOption(3); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Problem Resolution & Shipment Management");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function NavlaunchComponent_Template_a_click_18_listener() { return ctx.selectOption(4); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Terminal Management");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function NavlaunchComponent_Template_a_click_21_listener() { return ctx.selectOption(5); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Admin");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function NavlaunchComponent_Template_a_click_24_listener() { return ctx.selectOption(6); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "ul", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "li", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "By Date");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "li", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "By Tipe");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "li", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "By Priority");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["nav[_ngcontent-%COMP%]{\r\n    background-color: white;\r\n}\r\n\r\n.text-nav[_ngcontent-%COMP%]{\r\n    color: black;\r\n    font-size: 20px;\r\n}\r\n\r\n.text-nav-right[_ngcontent-%COMP%]{\r\n    color: black;\r\n    font-size: 18px;\r\n    position: relative;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5hdmxhdW5jaC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksdUJBQXVCO0FBQzNCOztBQUVBO0lBQ0ksWUFBWTtJQUNaLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxZQUFZO0lBQ1osZUFBZTtJQUNmLGtCQUFrQjtBQUN0QiIsImZpbGUiOiJuYXZsYXVuY2guY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIm5hdntcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4udGV4dC1uYXZ7XHJcbiAgICBjb2xvcjogYmxhY2s7XHJcbiAgICBmb250LXNpemU6IDIwcHg7XHJcbn1cclxuXHJcbi50ZXh0LW5hdi1yaWdodHtcclxuICAgIGNvbG9yOiBibGFjaztcclxuICAgIGZvbnQtc2l6ZTogMThweDtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufSJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NavlaunchComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-navlaunch',
                templateUrl: './navlaunch.component.html',
                styleUrls: ['./navlaunch.component.css']
            }]
    }], null, { SelectOption: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }] }); })();


/***/ }),

/***/ "mk+t":
/*!**************************************************************!*\
  !*** ./src/app/modules/map/table-map/table-map.component.ts ***!
  \**************************************************************/
/*! exports provided: TableMapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableMapComponent", function() { return TableMapComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var primeng_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/table */ "rEr+");
/* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/api */ "7zfz");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/button */ "jIHw");







function TableMapComponent_div_1_ng_container_1_ng_template_9_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "input", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("input", function TableMapComponent_div_1_ng_container_1_ng_template_9_Template_input_input_2_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8); _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](8); return _r3.filterGlobal($event.target.value, "contains"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function TableMapComponent_div_1_ng_container_1_ng_template_10_th_1_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", col_r11.header, " ");
} }
function TableMapComponent_div_1_ng_container_1_ng_template_10_th_1_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", col_r11.header, " ");
} }
function TableMapComponent_div_1_ng_container_1_ng_template_10_th_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableMapComponent_div_1_ng_container_1_ng_template_10_th_1_ng_container_1_Template, 3, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, TableMapComponent_div_1_ng_container_1_ng_template_10_th_1_ng_container_2_Template, 2, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const col_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r11.header == "Chassis History");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r11.header != "Chassis History");
} }
function TableMapComponent_div_1_ng_container_1_ng_template_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableMapComponent_div_1_ng_container_1_ng_template_10_th_1_Template, 3, 2, "th", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const columns_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", columns_r9);
} }
function TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_1_Template_a_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r26); const col_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit; const object_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit; const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3); return ctx_r24.gotoppsdetails(object_r16[col_r18.field]); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const object_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", object_r16[col_r18.field], "");
} }
function TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_2_Template_a_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r32); const object_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2).$implicit; const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3); return ctx_r30.gotocentermap(object_r16); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const object_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", object_r16[col_r18.field], "");
} }
function TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "button", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_3_Template_button_click_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r37); const object_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2).$implicit; const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3); return ctx_r35.gotoroutemap(object_r16["reference"]); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} }
function TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const object_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r22.formatstring(object_r16[col_r18.field]), " ");
} }
function TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const col_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const object_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r23.formatstring(object_r16[col_r18.field]), " ");
} }
function TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_1_Template, 3, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_2_Template, 3, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_3_Template, 3, 0, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_4_Template, 3, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_ng_container_5_Template, 3, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const col_r18 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r18.field == "reference");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r18.field == "coordinates");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r18.field == "routemap");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r18.field == "move_type");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", col_r18.field != "reference" && col_r18.field != "coordinates" && col_r18.field != "routemap" && col_r18.field != "move_type");
} }
function TableMapComponent_div_1_ng_container_1_ng_template_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableMapComponent_div_1_ng_container_1_ng_template_11_td_1_Template, 6, 5, "td", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r6.cols);
} }
const _c0 = function () { return { "min-width": "50rem" }; };
const _c1 = function () { return ["reference", "date", "move_Type_format", "georeference", "coordinates"]; };
function TableMapComponent_div_1_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "p-table", 8, 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, TableMapComponent_div_1_ng_container_1_ng_template_9_Template, 3, 0, "ng-template", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, TableMapComponent_div_1_ng_container_1_ng_template_10_Template, 2, 1, "ng-template", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, TableMapComponent_div_1_ng_container_1_ng_template_11_Template, 2, 1, "ng-template", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" Equipment (", ctx_r1.Data.length, ") ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx_r1.Data)("columns", ctx_r1.cols)("reorderableColumns", true)("scrollable", true)("resizableColumns", true)("tableStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](8, _c0))("globalFilterFields", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](9, _c1));
} }
function TableMapComponent_div_1_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" Equipment (", ctx_r2.Data.length, ") ");
} }
function TableMapComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableMapComponent_div_1_ng_container_1_Template, 12, 10, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, TableMapComponent_div_1_ng_container_2_Template, 3, 1, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.Data.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.Data.length == 0);
} }
class TableMapComponent {
    constructor(router) {
        this.router = router;
        this.SendCenter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ngOnInit() {
        this.cols = [
            { field: 'reference', header: 'Reference' },
            { field: 'date', header: 'Date' },
            { field: 'move_type', header: 'Move Type' },
            { field: 'georeference', header: 'Geofences' },
            { field: 'coordinates', header: 'Coordinates' },
            { field: 'routemap', header: 'Chassis History' },
        ];
        /*
                this.cols = [
                    { field: 'load', header: 'Load' },
                    { field: 'equipment', header: 'Equipment' },
                    { field: 'equipment_type', header: 'Equipment_Type' },
                    { field: 'load_empty', header: 'Load_Empty' },
                    { field: 'billed_set_temp', header: 'Billed_Set_Temp' },
                    { field: 'pps_details', header: 'PPS_Details' },
                    { field: 'origin', header: 'Origin' },
                    { field: 'destination', header: 'Destination' },
                    { field: 'last_reported_station', header: 'Last_Reported_Station' },
                    { field: 'holds', header: 'Holds' },
                    { field: 'equipment_status', header: 'Equipment_Status' },
                    { field: 'load_status', header: 'Load_Status' },
                    { field: 'grounded', header: 'Grounded' },
                    { field: 'eta', header: 'Eta' }
        
                ];
        
                */
        /*
            this.data = [
              {
                Load: "-",
                Equipment: "-",
                Equipment_Type: "-",
                Load_Empty: "-",
                Billed_Set_Temp: "-",
                PPS_Details: "-",
                Origin:  "-",
                Destination: "-",
                Last_Reported_Station: "-",
                Holds: "-",
                Equipment_Status: "-",
                Load_Status: "-",
                Grounded: "-",
                Eta: "-"
              },
              {
                Load: "-",
                Equipment: "-",
                Equipment_Type: "-",
                Load_Empty: "-",
                Billed_Set_Temp: "-",
                PPS_Details: "-",
                Origin:  "-",
                Destination: "-",
                Last_Reported_Station: "-",
                Holds: "-",
                Equipment_Status: "-",
                Load_Status: "-",
                Grounded: "-",
                Eta: "-"
              },
              {
                Load: "-",
                Equipment: "-",
                Equipment_Type: "-",
                Load_Empty: "-",
                Billed_Set_Temp: "-",
                PPS_Details: "-",
                Origin:  "-",
                Destination: "-",
                Last_Reported_Station: "-",
                Holds: "-",
                Equipment_Status: "-",
                Load_Status: "-",
                Grounded: "-",
                Eta: "-"
              },
              {
                Load: "-",
                Equipment: "-",
                Equipment_Type: "-",
                Load_Empty: "-",
                Billed_Set_Temp: "-",
                PPS_Details: "-",
                Origin:  "-",
                Destination: "-",
                Last_Reported_Station: "-",
                Holds: "-",
                Equipment_Status: "-",
                Load_Status: "-",
                Grounded: "-",
                Eta: "-"
              },
              {
                Load: "-",
                Equipment: "-",
                Equipment_Type: "-",
                Load_Empty: "-",
                Billed_Set_Temp: "-",
                PPS_Details: "-",
                Origin:  "-",
                Destination: "-",
                Last_Reported_Station: "-",
                Holds: "-",
                Equipment_Status: "-",
                Load_Status: "-",
                Grounded: "-",
                Eta: "-"
              },
              {
                Load: "-",
                Equipment: "-",
                Equipment_Type: "-",
                Load_Empty: "-",
                Billed_Set_Temp: "-",
                PPS_Details: "-",
                Origin:  "-",
                Destination: "-",
                Last_Reported_Station: "-",
                Holds: "-",
                Equipment_Status: "-",
                Load_Status: "-",
                Grounded: "-",
                Eta: "-"
              },
              {
                Load: "-",
                Equipment: "-",
                Equipment_Type: "-",
                Load_Empty: "-",
                Billed_Set_Temp: "-",
                PPS_Details: "-",
                Origin:  "-",
                Destination: "-",
                Last_Reported_Station: "-",
                Holds: "-",
                Equipment_Status: "-",
                Load_Status: "-",
                Grounded: "-",
                Eta: "-"
              },
            ];
        
            */
    }
    ngAfterViewInit() {
    }
    formatstring(content) {
        return content.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    formatdate(date) {
        let dateformat = date.split(' ');
        return dateformat[0];
    }
    gotoppsdetails(reference) {
        //this.router.navigate([`chassis-details`,  reference ]);
        const url = this.router.createUrlTree([`chassis-details`, reference]).toString();
        window.open(url, '_blank');
    }
    gotoroutemap(reference) {
        //this.router.navigate([`chassis-history`,  reference ]);
        const url = this.router.createUrlTree([`chassis-history`, reference]).toString();
        window.open(url, '_blank');
    }
    gotocentermap(object) {
        this.SendCenter.emit(object);
    }
}
TableMapComponent.ɵfac = function TableMapComponent_Factory(t) { return new (t || TableMapComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"])); };
TableMapComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: TableMapComponent, selectors: [["app-table-map"]], inputs: { Data: "Data" }, outputs: { SendCenter: "SendCenter" }, decls: 4, vars: 1, consts: [[1, "row"], ["class", "p-col-12", 4, "ngIf"], [1, "p-col-12"], [4, "ngIf"], [1, "col", "s12"], [1, "col", "s2"], [1, "col", "s8"], [1, "col", "s2", "right-align"], ["scrollHeight", "400px", "styleClass", "p-datatable-striped p-datatable-gridline", 3, "value", "columns", "reorderableColumns", "scrollable", "resizableColumns", "tableStyle", "globalFilterFields"], ["dt1", ""], ["pTemplate", "caption"], ["pTemplate", "header"], ["pTemplate", "body"], [1, "flex"], [1, "p-input-icon-left", "ml-auto"], ["pInputText", "", "type", "text", "placeholder", " ", 3, "input"], ["pReorderableColumn", "", 4, "ngFor", "ngForOf"], ["pReorderableColumn", ""], [1, "center-align"], [4, "ngFor", "ngForOf"], ["href", "javascript:void(0);", 3, "click"], ["pButton", "", "pRipple", "", "type", "button", "icon", "pi pi-reply", 1, "p-button-rounded", "p-button-outlined", 3, "click"], [1, "tdbreak"]], template: function TableMapComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, TableMapComponent_div_1_Template, 3, 2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.Data != undefined);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], primeng_table__WEBPACK_IMPORTED_MODULE_3__["Table"], primeng_api__WEBPACK_IMPORTED_MODULE_4__["PrimeTemplate"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], primeng_table__WEBPACK_IMPORTED_MODULE_3__["ReorderableColumn"], primeng_button__WEBPACK_IMPORTED_MODULE_5__["ButtonDirective"]], styles: [".container[_ngcontent-%COMP%]{\r\n \r\n\r\n}\r\n\r\n.container-principal[_ngcontent-%COMP%]{\r\n  max-width: 100%;\r\n  height:100%;\r\n  position: relative;\r\n}\r\n\r\n.tdbreak[_ngcontent-%COMP%] {\r\n    white-space: initial;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYmxlLW1hcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTtDQUNDLHFCQUFxQjs7QUFFdEI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsV0FBVztFQUNYLGtCQUFrQjtBQUNwQjs7QUFJQTtJQUNJLG9CQUFvQjtBQUN4QiIsImZpbGUiOiJ0YWJsZS1tYXAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4uY29udGFpbmVye1xyXG4gLyogIG1hcmdpbi10b3A6IDIlOyAqL1xyXG5cclxufVxyXG5cclxuLmNvbnRhaW5lci1wcmluY2lwYWx7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDoxMDAlO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxufVxyXG5cclxuXHJcblxyXG4udGRicmVhayB7XHJcbiAgICB3aGl0ZS1zcGFjZTogaW5pdGlhbDtcclxufSBcclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TableMapComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-table-map',
                templateUrl: './table-map.component.html',
                styleUrls: ['./table-map.component.css']
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] }]; }, { Data: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], SendCenter: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }] }); })();


/***/ }),

/***/ "muja":
/*!********************************************************************!*\
  !*** ./src/app/modules/train/pps-details/pps-details.component.ts ***!
  \********************************************************************/
/*! exports provided: PpsDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PpsDetailsComponent", function() { return PpsDetailsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! esri-loader */ "r6rm");
/* harmony import */ var esri_loader__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(esri_loader__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var pdfmake_build_pdfmake__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! pdfmake/build/pdfmake */ "5JmO");
/* harmony import */ var pdfmake_build_pdfmake__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(pdfmake_build_pdfmake__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var pdfmake_build_vfs_fonts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pdfmake/build/vfs_fonts */ "TruH");
/* harmony import */ var pdfmake_build_vfs_fonts__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(pdfmake_build_vfs_fonts__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _core_services_pdfmake_pdf_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../core/services/pdfmake/pdf.service */ "JIba");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! primeng/button */ "jIHw");
/* harmony import */ var primeng_progressbar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! primeng/progressbar */ "+DzE");












const _c0 = ["mapViewNode"];
const _c1 = function () { return { "height": "6px" }; };
function PpsDetailsComponent_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "p-progressBar", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](2, _c1));
} }
function PpsDetailsComponent_div_46_ng_container_9_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Chassis Type:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r6.properties.chassis_type, " ");
} }
function PpsDetailsComponent_div_46_ng_container_9_ng_container_26_ng_container_4_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const sensor_r10 = ctx.$implicit;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" - ", ctx_r9.formatstring(sensor_r10), " ");
} }
function PpsDetailsComponent_div_46_ng_container_9_ng_container_26_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, PpsDetailsComponent_div_46_ng_container_9_ng_container_26_ng_container_4_ng_container_1_Template, 3, 1, "ng-container", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r8.properties.sensors);
} }
function PpsDetailsComponent_div_46_ng_container_9_ng_container_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Sensors:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, PpsDetailsComponent_div_46_ng_container_9_ng_container_26_ng_container_4_Template, 2, 1, "ng-container", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r7.properties.sensors.length > 0);
} }
function PpsDetailsComponent_div_46_ng_container_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Asset Class:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, PpsDetailsComponent_div_46_ng_container_9_ng_container_5_Template, 5, 1, "ng-container", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Door Type:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Height:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Width:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Initial Distance:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](21, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Mounting Location:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](26, PpsDetailsComponent_div_46_ng_container_9_ng_container_26_Template, 5, 1, "ng-container", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r5.formatstring(ctx_r5.properties.asset_class), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r5.properties.chassis_type != undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r5.properties.door_type, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r5.properties.height, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r5.properties.width, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r5.properties.initial_distance, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r5.formatstring(ctx_r5.properties.mounting_location), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r5.properties.sensors != undefined);
} }
function PpsDetailsComponent_div_46_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Date:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "label", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, " Last Event:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, PpsDetailsComponent_div_46_ng_container_9_Template, 27, 8, "ng-container", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r2.date, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r2.formatstring(ctx_r2.event), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r2.properties != undefined);
} }
function PpsDetailsComponent_ng_container_51_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const geofence_r12 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", geofence_r12.name, " ");
} }
pdfmake_build_pdfmake__WEBPACK_IMPORTED_MODULE_3___default.a.vfs = pdfmake_build_vfs_fonts__WEBPACK_IMPORTED_MODULE_4___default.a.pdfMake.vfs;
class PpsDetailsComponent {
    constructor(router, cdRef, activatedRoute, http, pdfService) {
        this.router = router;
        this.cdRef = cdRef;
        this.activatedRoute = activatedRoute;
        this.http = http;
        this.pdfService = pdfService;
        this.sub = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subscription"]();
        this.loading = false;
        this.georeferences = [];
        this.geofences_array = [];
    }
    ngOnInit() {
        this.counterror = 0;
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        this.georeferences = [
            { name: "No Filter", value: "No Filter" },
            { name: "Bensenville Intermodal Terminal", value: "e6468692-50cf-46a1-bac7-5c1baeb4749d" },
            { name: "Calgary Intermodal Terminal", value: "7f8d3475-8f79-4936-b4e3-efe71913d254" },
            { name: "Edmonton Intermodal Terminal", value: "3346e7dc-0e31-4d17-9805-380baf1d9772" },
            { name: "Lachine Intermodal Terminal", value: "9d23cf32-2fb1-4e39-a326-9c332fc12c58" },
            { name: "Regina Intermodal Terminal", value: "0a369dbc-d048-4bf8-91dd-92cd5a47e00b" },
            { name: "Schiller Park Intermodal Terminal", value: "87ca9217-cb63-410c-bd04-62318cdd56cf" },
            { name: "Saint John Intermodal Terminal", value: "0dafa1ee-b472-4cb0-a615-70dbcb9ded1c" },
            { name: "Vaughan Intermodal Terminal", value: "744883a4-2e52-4f7a-95e5-4f76bed45f2d" },
            { name: "Vancouver Intermodal Terminal", value: "445f7608-2c14-41e8-be80-0c4ad6dadffb" },
            { name: "Winnipeg Intermodal Terminal", value: "156c6c75-fdb1-45d2-94c0-8c0791bd2da6" },
        ];
    }
    ngAfterViewInit() {
        /*
                return loadModules([
                  "esri/layers/GeoJSONLayer",
                  "esri/widgets/Sketch",
                  'esri/Map',
                  "esri/layers/GraphicsLayer",
                  'esri/views/MapView',
                  'esri/Graphic'
                ])
                  .then(([GeoJSONLayer,Sketch,Map,GraphicsLayer, MapView, Graphic]) => {
                        //    esriConfig.apiKey = "50b,094799d25e425a0d8cab088adbe49960f20e1669d0f65f4366968aeee9bef";
                    const map: __esri.Map = new Map({
                      basemap: 'streets'
                    });
    
    
    
                    this.mapView = new MapView({
                      container: this.mapViewEl.nativeElement,
                      map: map,
                      center: [-114.8574, 54.6542],
                      zoom: 13,
                    });
    
                  })
                  .catch(err => {
                    console.error(err);
                  });
                    */
        this.loading = true;
        this.getDatafromGeoJson();
        /*
            fetch("https://d2gv90pkqj.execute-api.us-west-2.amazonaws.com/dev/get-locations")
                .then(res => res.json())
                .then((out) => {
                  this.makefromjson(out);
            }).catch(err => console.error(err));
        
            */
        this.cdRef.detectChanges();
    }
    getDatafromGeoJson() {
        //fetch(environment.API_URL_BASE + "get-cpr-geojson")
        fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson")
            .then(res => res.json())
            .then((out) => {
            if (out.errorMessage == undefined) {
                this.loading = false;
                this.makefromjson(out);
            }
            else {
                setTimeout(() => {
                    this.counterror = this.counterror + 1;
                    if (this.counterror < 10) {
                        this.getDatafromGeoJson();
                    }
                    else {
                    }
                }, 100);
            }
            // this.data = out.features;
        }).catch(err => console.error(err));
    }
    makefromjson(json) {
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        let arrayfeacturesfilter = json.features;
        arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.id == chasis);
        json.features = arrayfeacturesfilter;
        setTimeout(() => {
            this.getInfoChasis();
            this.buildmap(json);
        }, 100);
    }
    getInfoChasis() {
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        //   this.http.post<any>(environment.API_URL_BASE +'get-chassis', {body:{data:{id: chasis}}}).subscribe(data => {
        this.http.post('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-chassis', { body: { data: { id: chasis } } }).subscribe(data => {
            let array = JSON.parse(data.body);
            if (array.length > 0) {
                this.properties = array[0];
            }
        });
    }
    buildmap(json) {
        this.chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        if (json != undefined) {
            this.loading = false;
            if (json.features != undefined && (json.features != undefined && json.features.length > 0)) {
                this.lon = json.features[0].geometry.coordinates[1];
                this.lat = json.features[0].geometry.coordinates[0];
                let lat = json.features[0].geometry.coordinates[0];
                let lon = json.features[0].geometry.coordinates[1];
                this.date = this.formatdatehours(json.features[0].properties.recorded_on);
                this.event = json.features[0].properties.move_type;
                let geofences_array = [];
                let georences_string = '';
                if (typeof json.features[0].geofences[0] == 'string') {
                    let featurestring = json.features[0].geofences[0];
                    // featurestring = this.replaceAll(featurestring,"'", '"');
                    // featurestring = this.replaceAll(featurestring,"'", '"');
                    //   featurestring = this.replaceAll(featurestring," ", '');
                    featurestring = this.replaceAll(featurestring, "'", '');
                    let arrayaux = [];
                    let sentencias = featurestring.split(/[{}]/);
                    const resultado = sentencias.filter(sentence => sentence.length > 2);
                    for (var r = 0; r < resultado.length; r++) {
                        let objaux = { id: '', name: '' };
                        if (resultado[r].length > 2) {
                            var arraysplitcoma = resultado[r].split(',');
                            for (var v = 0; v < arraysplitcoma.length; v++) {
                                var arraysplitdospuntos = arraysplitcoma[v].split(':');
                                if (arraysplitdospuntos[1] != undefined) {
                                    objaux[arraysplitdospuntos[0].trim()] = arraysplitdospuntos[1].trim();
                                    if (!this.isEmpty(arraysplitdospuntos[1].trim())) {
                                        const found = geofences_array.find(element => element.name == arraysplitdospuntos[1].trim());
                                        if (!found) {
                                            geofences_array.push(objaux);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (var e = 0; e < geofences_array.length; e++) {
                    if (e == geofences_array.length - 1) {
                        georences_string = georences_string + this.getGeofencesPrimor(geofences_array[e]);
                    }
                    else {
                        georences_string = georences_string + this.getGeofencesPrimor(geofences_array[e]) + ',';
                    }
                }
                this.geofences_array = geofences_array;
                return Object(esri_loader__WEBPACK_IMPORTED_MODULE_2__["loadModules"])([
                    "esri/layers/GeoJSONLayer",
                    "esri/widgets/Sketch",
                    'esri/Map',
                    "esri/layers/GraphicsLayer",
                    'esri/views/MapView',
                    'esri/Graphic'
                ])
                    .then(([GeoJSONLayer, Sketch, Map, GraphicsLayer, MapView, Graphic]) => {
                    //    esriConfig.apiKey = "50b,094799d25e425a0d8cab088adbe49960f20e1669d0f65f4366968aeee9bef";
                    const map = new Map({
                        basemap: 'streets'
                    });
                    this.mapView = new MapView({
                        container: this.mapViewEl.nativeElement,
                        map: map,
                        center: [this.lat, this.lon],
                        zoom: 13,
                    });
                    const graphicsLayer = new GraphicsLayer();
                    map.add(graphicsLayer);
                    const point = {
                        type: "point",
                        longitude: this.lat,
                        latitude: this.lon
                    };
                    const simpleMarkerSymbol = {
                        type: "simple-marker",
                        color: [226, 119, 40],
                        outline: {
                            color: [255, 255, 255],
                            width: 1
                        }
                    };
                    const pointGraphic = new Graphic({
                        geometry: point,
                        symbol: simpleMarkerSymbol
                    });
                    graphicsLayer.add(pointGraphic);
                })
                    .catch(err => {
                    console.error(err);
                });
            }
        }
    }
    formatdatehours(date) {
        let dateformat = date.split(' ');
        let hourformat = dateformat[1].split('.');
        return dateformat[0] + ' ' + hourformat[0];
    }
    formatstring(content) {
        return content.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    downloadFile() {
        let that = this;
        this.mapView.takeScreenshot({
            format: 'png',
            quality: 100,
            width: 220,
            height: 160
        }).then(function (screenshot) {
            setTimeout(() => {
                const docDefinition = {
                    pageSize: 'LETTER',
                    pageMargins: [30, 30, 30, 60],
                    header: {
                        margin: 10,
                        columns: []
                    },
                    content: [
                        that.pdfService.getTitle(that.chasis),
                        that.pdfService.getPPSDetails(that.lat, that.lon),
                        {
                            image: screenshot.dataUrl, alignment: 'center'
                        },
                        that.pdfService.getPPSDetailsAtributtes(that.date, that.event, that.properties, that.geofences_array),
                    ]
                };
                pdfmake_build_pdfmake__WEBPACK_IMPORTED_MODULE_3___default.a.createPdf(docDefinition).download(that.chasis + '.pdf');
            }, 500);
        });
    }
    getGeofencesPrimor(geofence) {
        let name_geofence = geofence.name;
        const found = this.georeferences.find(element => element.value == geofence.id);
        if (found) {
            name_geofence = found.name;
        }
        return name_geofence;
    }
    isEmpty(str) {
        return (!str || 0 === str.length);
    }
    replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }
    gotomap() {
        this.router.navigate([`map`]);
    }
    gotoroutemap() {
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
        this.router.navigate(['chassis-history', chasis]);
    }
}
PpsDetailsComponent.ɵfac = function PpsDetailsComponent_Factory(t) { return new (t || PpsDetailsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_6__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_core_services_pdfmake_pdf_service__WEBPACK_IMPORTED_MODULE_7__["PDFService"])); };
PpsDetailsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PpsDetailsComponent, selectors: [["app-pps-details"]], viewQuery: function PpsDetailsComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.mapViewEl = _t.first);
    } }, decls: 64, vars: 6, consts: [[1, "container-principal"], [4, "ngIf"], [1, "row", "card"], [1, "row", "center-align"], [1, "col", "s4", "left-align"], ["label", "Map", "icon", "pi pi-chevron-left", "styleClass", "p-button-link", 3, "click"], [1, "col", "s4", "center-align"], [1, "col", "s4", "right-align"], ["label", "Chassis History", "styleClass", "p-button-link", 3, "click"], [1, "col", "s12"], [1, "col", "s12", "card-general"], [1, "col", "s6"], [1, "col", "s12", "card-content"], [1, "col", "s4"], [1, "title"], [1, "col", "s8"], [1, "row"], ["id", "map-view", 1, "container-map"], ["mapViewNode", ""], ["class", "col s6", 4, "ngIf"], [4, "ngFor", "ngForOf"], [1, "container-map"], [1, "col", "s12", "center-align"], ["pButton", "", "pRipple", "", "type", "button", "label", "PDF", 1, "p-button-success", 3, "click"], ["mode", "indeterminate"]], template: function PpsDetailsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, PpsDetailsComponent_ng_container_1_Template, 2, 3, "ng-container", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "p-button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PpsDetailsComponent_Template_p_button_click_6_listener() { return ctx.gotomap(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h6");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Chassis Details ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "p-button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PpsDetailsComponent_Template_p_button_click_11_listener() { return ctx.gotoroutemap(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, " Last Reported Location ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](23, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "label", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Lat:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](29, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "label", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Lon:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](33, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](36, "div", 17, 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, " Details ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](44, "hr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](46, PpsDetailsComponent_div_46_Template, 10, 3, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "label", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, "Geofences:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](50, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](51, PpsDetailsComponent_ng_container_51_Template, 3, 1, "ng-container", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](54, "div", 21, 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](57, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](58, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "button", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PpsDetailsComponent_Template_button_click_60_listener() { return ctx.downloadFile(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](62, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](63, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.chasis, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.lon, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.lat, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.date && ctx.event);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.geofences_array);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], primeng_button__WEBPACK_IMPORTED_MODULE_9__["Button"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgForOf"], primeng_button__WEBPACK_IMPORTED_MODULE_9__["ButtonDirective"], primeng_progressbar__WEBPACK_IMPORTED_MODULE_10__["ProgressBar"]], styles: ["@import 'https://js.arcgis.com/4.10/esri/css/main.css';\r\n\r\n.title[_ngcontent-%COMP%]{\r\n font-weight: bold;\r\n color: black;\r\n\r\n}\r\n\r\n.card-content[_ngcontent-%COMP%]{\r\n   height: 200px;\r\n }\r\n\r\nhr[_ngcontent-%COMP%]{\r\n   color: red;\r\n }\r\n\r\n.esri-view[_ngcontent-%COMP%] {\r\n   height:190px;\r\n }\r\n\r\n.container-map[_ngcontent-%COMP%]{\r\n   height:380px;\r\n   width:100%;\r\n\r\n   position: relative;\r\n\r\n\r\n }\r\n\r\n.card-general[_ngcontent-%COMP%]{\r\n   height:480px !important;\r\n\r\n }\r\n\r\n.map[_ngcontent-%COMP%]{\r\n\r\n     width: 100%;\r\n     height: 300%;\r\n\r\n }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBwcy1kZXRhaWxzLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsc0RBQXNEOztBQUV0RDtDQUNDLGlCQUFpQjtDQUNqQixZQUFZOztBQUViOztBQUVBO0dBQ0csYUFBYTtDQUNmOztBQUVBO0dBQ0UsVUFBVTtDQUNaOztBQUVBO0dBQ0UsWUFBWTtDQUNkOztBQUVBO0dBQ0UsWUFBWTtHQUNaLFVBQVU7O0dBRVYsa0JBQWtCOzs7Q0FHcEI7O0FBRUE7R0FDRSx1QkFBdUI7O0NBRXpCOztBQUVBOztLQUVJLFdBQVc7S0FDWCxZQUFZOztDQUVoQiIsImZpbGUiOiJwcHMtZGV0YWlscy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnaHR0cHM6Ly9qcy5hcmNnaXMuY29tLzQuMTAvZXNyaS9jc3MvbWFpbi5jc3MnO1xyXG5cclxuLnRpdGxle1xyXG4gZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiBjb2xvcjogYmxhY2s7XHJcblxyXG59XHJcblxyXG4uY2FyZC1jb250ZW50e1xyXG4gICBoZWlnaHQ6IDIwMHB4O1xyXG4gfVxyXG5cclxuIGhye1xyXG4gICBjb2xvcjogcmVkO1xyXG4gfVxyXG5cclxuIC5lc3JpLXZpZXcge1xyXG4gICBoZWlnaHQ6MTkwcHg7XHJcbiB9XHJcblxyXG4gLmNvbnRhaW5lci1tYXB7XHJcbiAgIGhlaWdodDozODBweDtcclxuICAgd2lkdGg6MTAwJTtcclxuXHJcbiAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHJcblxyXG4gfVxyXG5cclxuIC5jYXJkLWdlbmVyYWx7XHJcbiAgIGhlaWdodDo0ODBweCAhaW1wb3J0YW50O1xyXG5cclxuIH1cclxuXHJcbiAubWFwe1xyXG5cclxuICAgICB3aWR0aDogMTAwJTtcclxuICAgICBoZWlnaHQ6IDMwMCU7XHJcblxyXG4gfVxyXG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PpsDetailsComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-pps-details',
                templateUrl: './pps-details.component.html',
                styleUrls: ['./pps-details.component.css']
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_6__["HttpClient"] }, { type: _core_services_pdfmake_pdf_service__WEBPACK_IMPORTED_MODULE_7__["PDFService"] }]; }, { mapViewEl: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['mapViewNode']
        }] }); })();


/***/ }),

/***/ "uOtL":
/*!*******************************************************************!*\
  !*** ./src/app/auth/password-rename/password-rename.component.ts ***!
  \*******************************************************************/
/*! exports provided: PasswordRenameComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PasswordRenameComponent", function() { return PasswordRenameComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/auth.service */ "N/25");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var primeng_password__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/password */ "+YxP");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! primeng/button */ "jIHw");







const _c0 = function () { return { "width": "100%" }; };
class PasswordRenameComponent {
    constructor(formBuilder, authService, 
    //  private sessionStorageService: SessionStorageService,
    router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.loading = false;
        this.form = this.formBuilder.group({
            password_new: this.formBuilder.control(''),
            password: this.formBuilder.control('')
        });
    }
    ngOnInit() {
    }
    submit(event) {
        event.preventDefault();
        if (this.form.valid) {
            const password = this.form.value.password;
            const password_new = this.form.value.password_new;
            this.authService.changePassword('cesarsantiagoguzman@gmail.com', password, password_new)
                .then((result) => {
                console.log('Contraseña cambiada exitosamente');
                console.log(result);
                // Realizar cualquier acción adicional después de cambiar la contraseña
            })
                .catch((error) => {
                console.error('Error al cambiar la contraseña', error);
                // Manejar el error adecuadamente en tu aplicación
            });
            /*
                this.authService.login(email, password)
                  .then(result => {
                    // Autenticación exitosa, redirigir al usuario a la página principal o a otra página deseada
                    this.router.navigate(['/dashboard']);
                  })
                  .catch(error => {
                    // Error de autenticación, mostrar mensaje de error o tomar la acción adecuada
                    console.error('Error de autenticación:', error);
                  });
            
                  */
        }
    }
    correctLogin() {
    }
    get getPassword() {
        return this.form.get('password');
    }
}
PasswordRenameComponent.ɵfac = function PasswordRenameComponent_Factory(t) { return new (t || PasswordRenameComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"])); };
PasswordRenameComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PasswordRenameComponent, selectors: [["app-password-rename"]], decls: 73, vars: 12, consts: [[1, "login-body"], [1, "login-panel", "p-fluid", "card"], [1, "p-grid", "p-nogutter"], [1, "p-col-12", "border"], [1, "p-grid", "p-text-center"], [1, "p-col-10", "p-offset-1"], ["src", "../assets/logo.png", 1, "imagen-banner"], [1, "p-col-12"], [1, "titleproject"], [1, "versionado"], [1, "p-grid"], [1, "p-col-6", "p-offset-3"], ["autocomplete", "off", 1, "form-auth", 3, "formGroup", "ngSubmit"], [1, "input-wrapper"], [1, "ui-fluid"], [1, "p-col-8", "p-offset-2"], [1, "formLabel"], [1, "p-grid", "p-fluid"], [1, "p-col"], [1, "p-inputgroup"], [1, "p-inputgroup-addon"], [1, "pi", "pi-lock"], ["formControlName", "password", 3, "toggleMask", "feedback"], ["formControlName", "password_new", 3, "toggleMask", "feedback"], [1, "p-col-4", "p-offset-4"], ["pButton", "", "type", "submit", "label", "Login", 1, "boton-log", 3, "disabled"]], template: function PasswordRenameComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "img", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "label", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Pacific Railway");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "label", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "0.1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "form", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function PasswordRenameComponent_Template_form_ngSubmit_19_listener($event) { return ctx.submit($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "label", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Password Actual(*)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "span", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](39, "i", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](40, "p-password", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "label", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "Password New(*)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](57, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "span", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](60, "i", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](61, "p-password", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](67, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](69, "button", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](71, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](72, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](10, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("toggleMask", true)("feedback", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](11, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("toggleMask", true)("feedback", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.form.invalid);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormGroupDirective"], primeng_password__WEBPACK_IMPORTED_MODULE_4__["Password"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlName"], primeng_button__WEBPACK_IMPORTED_MODULE_5__["ButtonDirective"]], styles: [".login-body[_ngcontent-%COMP%] {\r\n  background-size: auto;\r\n    background-size: cover;\r\n    height: auto;\r\n    min-height: 100vh;\r\n}\r\n\r\n.login-body[_ngcontent-%COMP%]   .login-panel[_ngcontent-%COMP%] {\r\n    width: 600px;\r\n    margin: 0 auto;\r\n    background-color: #e6e4e4;\r\n    padding-top: 70px !important;\r\n    margin-top: 60px !important;\r\n}\r\n\r\n.formLabel[_ngcontent-%COMP%]{\r\n  color: #000;\r\n  font: sans-serif;\r\n  font-size: 25px;\r\n\r\n}\r\n\r\nform[_ngcontent-%COMP%]{\r\n  width: 100% !important;\r\n\r\n}\r\n\r\np-password[_ngcontent-%COMP%]{\r\n  width: 100% !important;\r\n  background-color: #e6e4e4;\r\n}\r\n\r\n.imagen-banner[_ngcontent-%COMP%] {\r\n  width: 25%;\r\n}\r\n\r\n.titleproject[_ngcontent-%COMP%]{\r\n  font-size: 30px;\r\n  color: #000000 !important;\r\n    font-family: fuenteparatitulos;\r\n}\r\n\r\n.versionado[_ngcontent-%COMP%] {\r\n  margin-left: 10px;\r\n  text-transform: none;\r\n  font-size: 18px;\r\n  letter-spacing: 2px;\r\n  font-family: fuenteparacuerpo;\r\n  color: #71797a !important;\r\n\r\n}\r\n\r\n.card[_ngcontent-%COMP%] {\r\n  border-radius: 20px;\r\n  background-color: #580707;\r\n  box-shadow: 0px 0px 21px -7px rgba(0,0,0,0.74);\r\n}\r\n\r\n.input-wrapper[_ngcontent-%COMP%]{\r\n  width: 100% !important;\r\n}\r\n\r\n.border[_ngcontent-%COMP%]{\r\n  border-bottom: 8px solid #b91f1f;\r\n}\r\n\r\ninput[_ngcontent-%COMP%] {\r\n    width: 100%;\r\n}\r\n\r\n.p-inputgroup-addon[_ngcontent-%COMP%]{\r\n  background: #e6e4e4;\r\ncolor: #495057;\r\nborder-top: none;\r\nborder-left: none;\r\nborder-bottom: none;\r\n}\r\n\r\n.p-inputgroup[_ngcontent-%COMP%]{\r\n  -webkit-box-shadow: 0 0 0px 1000px #e6e4e4 inset;\r\n\r\n}\r\n\r\n.p-nogutter[_ngcontent-%COMP%] {\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n    margin-top: 0;\r\n}\r\n\r\n.layout-footer[_ngcontent-%COMP%] {\r\n  margin-top: 15px;\r\n padding:1rem;\r\n font-size:1rem;\r\n background-color:var(--surface-a);\r\n display:flex;\r\n align-items:center;\r\n justify-content:space-between\r\n}\r\n\r\n@media screen and (max-width: 780px) {\r\n  .login-body[_ngcontent-%COMP%] {\r\n    background-size: auto;\r\n      background-size: cover;\r\n      height: auto;\r\n      min-height: 100vh;\r\n      padding-top: 70px;\r\n      margin-top: -140px !important;\r\n      margin-left: -20% !important;\r\n  }\r\n\r\n  .login-body[_ngcontent-%COMP%]   .login-panel[_ngcontent-%COMP%] {\r\n      width: 100%;\r\n      margin: 0 auto;\r\n      background-color: #ffffff;\r\n  }\r\n\r\n}\r\n\r\n.boton-log[_ngcontent-%COMP%]{\r\n  background-color: #580707;\r\n  border: none;\r\n  box-shadow: #495057;\r\n  box-shadow: 0px 0px 21px -7px rgba(0,0,0,0.74);\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhc3N3b3JkLXJlbmFtZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UscUJBQXFCO0lBQ25CLHNCQUFzQjtJQUN0QixZQUFZO0lBQ1osaUJBQWlCO0FBQ3JCOztBQUVBO0lBQ0ksWUFBWTtJQUNaLGNBQWM7SUFDZCx5QkFBeUI7SUFDekIsNEJBQTRCO0lBQzVCLDJCQUEyQjtBQUMvQjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsZUFBZTs7QUFFakI7O0FBRUE7RUFDRSxzQkFBc0I7O0FBRXhCOztBQUVBO0VBQ0Usc0JBQXNCO0VBQ3RCLHlCQUF5QjtBQUMzQjs7QUFDQTtFQUNFLFVBQVU7QUFDWjs7QUFFQTtFQUNFLGVBQWU7RUFDZix5QkFBeUI7SUFDdkIsOEJBQThCO0FBQ2xDOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLG9CQUFvQjtFQUNwQixlQUFlO0VBQ2YsbUJBQW1CO0VBQ25CLDZCQUE2QjtFQUM3Qix5QkFBeUI7O0FBRTNCOztBQUNBO0VBQ0UsbUJBQW1CO0VBQ25CLHlCQUF5QjtFQUd6Qiw4Q0FBOEM7QUFDaEQ7O0FBRUE7RUFDRSxzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxnQ0FBZ0M7QUFDbEM7O0FBRUM7SUFDRyxXQUFXO0FBQ2Y7O0FBRUE7RUFDRSxtQkFBbUI7QUFDckIsY0FBYztBQUNkLGdCQUFnQjtBQUNoQixpQkFBaUI7QUFDakIsbUJBQW1CO0FBQ25COztBQUVBO0VBQ0UsZ0RBQWdEOztBQUVsRDs7QUFFQTtJQUNJLGVBQWU7SUFDZixjQUFjO0lBQ2QsYUFBYTtBQUNqQjs7QUFFQTtFQUNFLGdCQUFnQjtDQUNqQixZQUFZO0NBQ1osY0FBYztDQUNkLGlDQUFpQztDQUNqQyxZQUFZO0NBQ1osa0JBQWtCO0NBQ2xCO0FBQ0Q7O0FBQ0E7RUFDRTtJQUNFLHFCQUFxQjtNQUNuQixzQkFBc0I7TUFDdEIsWUFBWTtNQUNaLGlCQUFpQjtNQUNqQixpQkFBaUI7TUFDakIsNkJBQTZCO01BQzdCLDRCQUE0QjtFQUNoQzs7RUFFQTtNQUNJLFdBQVc7TUFDWCxjQUFjO01BQ2QseUJBQXlCO0VBQzdCOztBQUVGOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLFlBQVk7RUFDWixtQkFBbUI7RUFDbkIsOENBQThDO0FBQ2hEIiwiZmlsZSI6InBhc3N3b3JkLXJlbmFtZS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmxvZ2luLWJvZHkge1xyXG4gIGJhY2tncm91bmQtc2l6ZTogYXV0bztcclxuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbiAgICBoZWlnaHQ6IGF1dG87XHJcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcclxufVxyXG5cclxuLmxvZ2luLWJvZHkgLmxvZ2luLXBhbmVsIHtcclxuICAgIHdpZHRoOiA2MDBweDtcclxuICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2U2ZTRlNDtcclxuICAgIHBhZGRpbmctdG9wOiA3MHB4ICFpbXBvcnRhbnQ7XHJcbiAgICBtYXJnaW4tdG9wOiA2MHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5mb3JtTGFiZWx7XHJcbiAgY29sb3I6ICMwMDA7XHJcbiAgZm9udDogc2Fucy1zZXJpZjtcclxuICBmb250LXNpemU6IDI1cHg7XHJcblxyXG59XHJcblxyXG5mb3Jte1xyXG4gIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcblxyXG59XHJcblxyXG5wLXBhc3N3b3Jke1xyXG4gIHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2U2ZTRlNDtcclxufVxyXG4uaW1hZ2VuLWJhbm5lciB7XHJcbiAgd2lkdGg6IDI1JTtcclxufVxyXG5cclxuLnRpdGxlcHJvamVjdHtcclxuICBmb250LXNpemU6IDMwcHg7XHJcbiAgY29sb3I6ICMwMDAwMDAgIWltcG9ydGFudDtcclxuICAgIGZvbnQtZmFtaWx5OiBmdWVudGVwYXJhdGl0dWxvcztcclxufVxyXG5cclxuLnZlcnNpb25hZG8ge1xyXG4gIG1hcmdpbi1sZWZ0OiAxMHB4O1xyXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xyXG4gIGZvbnQtc2l6ZTogMThweDtcclxuICBsZXR0ZXItc3BhY2luZzogMnB4O1xyXG4gIGZvbnQtZmFtaWx5OiBmdWVudGVwYXJhY3VlcnBvO1xyXG4gIGNvbG9yOiAjNzE3OTdhICFpbXBvcnRhbnQ7XHJcblxyXG59XHJcbi5jYXJkIHtcclxuICBib3JkZXItcmFkaXVzOiAyMHB4O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICM1ODA3MDc7XHJcbiAgLXdlYmtpdC1ib3gtc2hhZG93OiAwcHggMHB4IDIxcHggLTdweCByZ2JhKDAsMCwwLDAuNzQpO1xyXG4gIC1tb3otYm94LXNoYWRvdzogMHB4IDBweCAyMXB4IC03cHggcmdiYSgwLDAsMCwwLjc0KTtcclxuICBib3gtc2hhZG93OiAwcHggMHB4IDIxcHggLTdweCByZ2JhKDAsMCwwLDAuNzQpO1xyXG59XHJcblxyXG4uaW5wdXQtd3JhcHBlcntcclxuICB3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uYm9yZGVye1xyXG4gIGJvcmRlci1ib3R0b206IDhweCBzb2xpZCAjYjkxZjFmO1xyXG59XHJcblxyXG4gaW5wdXQge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5wLWlucHV0Z3JvdXAtYWRkb257XHJcbiAgYmFja2dyb3VuZDogI2U2ZTRlNDtcclxuY29sb3I6ICM0OTUwNTc7XHJcbmJvcmRlci10b3A6IG5vbmU7XHJcbmJvcmRlci1sZWZ0OiBub25lO1xyXG5ib3JkZXItYm90dG9tOiBub25lO1xyXG59XHJcblxyXG4ucC1pbnB1dGdyb3Vwe1xyXG4gIC13ZWJraXQtYm94LXNoYWRvdzogMCAwIDBweCAxMDAwcHggI2U2ZTRlNCBpbnNldDtcclxuXHJcbn1cclxuXHJcbi5wLW5vZ3V0dGVyIHtcclxuICAgIG1hcmdpbi1yaWdodDogMDtcclxuICAgIG1hcmdpbi1sZWZ0OiAwO1xyXG4gICAgbWFyZ2luLXRvcDogMDtcclxufVxyXG5cclxuLmxheW91dC1mb290ZXIge1xyXG4gIG1hcmdpbi10b3A6IDE1cHg7XHJcbiBwYWRkaW5nOjFyZW07XHJcbiBmb250LXNpemU6MXJlbTtcclxuIGJhY2tncm91bmQtY29sb3I6dmFyKC0tc3VyZmFjZS1hKTtcclxuIGRpc3BsYXk6ZmxleDtcclxuIGFsaWduLWl0ZW1zOmNlbnRlcjtcclxuIGp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuXHJcbn1cclxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzgwcHgpIHtcclxuICAubG9naW4tYm9keSB7XHJcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGF1dG87XHJcbiAgICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XHJcbiAgICAgIGhlaWdodDogYXV0bztcclxuICAgICAgbWluLWhlaWdodDogMTAwdmg7XHJcbiAgICAgIHBhZGRpbmctdG9wOiA3MHB4O1xyXG4gICAgICBtYXJnaW4tdG9wOiAtMTQwcHggIWltcG9ydGFudDtcclxuICAgICAgbWFyZ2luLWxlZnQ6IC0yMCUgIWltcG9ydGFudDtcclxuICB9XHJcblxyXG4gIC5sb2dpbi1ib2R5IC5sb2dpbi1wYW5lbCB7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBtYXJnaW46IDAgYXV0bztcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcclxuICB9XHJcblxyXG59XHJcblxyXG4uYm90b24tbG9ne1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICM1ODA3MDc7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGJveC1zaGFkb3c6ICM0OTUwNTc7XHJcbiAgYm94LXNoYWRvdzogMHB4IDBweCAyMXB4IC03cHggcmdiYSgwLDAsMCwwLjc0KTtcclxufVxyXG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PasswordRenameComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-password-rename',
                templateUrl: './password-rename.component.html',
                styleUrls: ['./password-rename.component.css'],
            }]
    }], function () { return [{ type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] }, { type: _services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }]; }, null); })();


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _auth_access_denied_access_denied_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth/access-denied/access-denied.component */ "hSeH");
/* harmony import */ var _modules_map_map_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/map/map.component */ "W1ip");
/* harmony import */ var _modules_route_map_route_map_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/route-map/route-map.component */ "WiLW");
/* harmony import */ var _modules_train_pps_details_pps_details_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/train/pps-details/pps-details.component */ "muja");
/* harmony import */ var _auth_guards_check_auth_guard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./auth/guards/check-auth.guard */ "NgTF");









const routes = [
    {
        path: 'current-chassis-location',
        component: _modules_map_map_component__WEBPACK_IMPORTED_MODULE_3__["MapComponent"],
        canActivate: [_auth_guards_check_auth_guard__WEBPACK_IMPORTED_MODULE_6__["AuthGuard"]]
    },
    {
        path: 'chassis-details/:chasis',
        component: _modules_train_pps_details_pps_details_component__WEBPACK_IMPORTED_MODULE_5__["PpsDetailsComponent"],
        canActivate: [_auth_guards_check_auth_guard__WEBPACK_IMPORTED_MODULE_6__["AuthGuard"]]
    },
    {
        path: 'chassis-history/:chasis',
        component: _modules_route_map_route_map_component__WEBPACK_IMPORTED_MODULE_4__["RouteMapComponent"],
        canActivate: [_auth_guards_check_auth_guard__WEBPACK_IMPORTED_MODULE_6__["AuthGuard"]]
    },
    { path: 'access-denied', component: _auth_access_denied_access_denied_component__WEBPACK_IMPORTED_MODULE_2__["AccessDeniedComponent"], pathMatch: 'full' },
    { path: '**', redirectTo: '/current-chassis-location' }
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "xHc3":
/*!*************************************************!*\
  !*** ./src/app/auth/services/cognito-config.ts ***!
  \*************************************************/
/*! exports provided: CognitoConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CognitoConfig", function() { return CognitoConfig; });
const CognitoConfig = {
    region: 'us-west-2',
    userPoolId: 'us-west-2_YKTiEMjtU',
    clientId: '78fqe248a2ghet7oi0v94hbtnp'
};


/***/ }),

/***/ "xLLE":
/*!**************************************************************!*\
  !*** ./src/app/core/services/map-state/map-state.service.ts ***!
  \**************************************************************/
/*! exports provided: MapStateService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapStateService", function() { return MapStateService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _map_store_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../map-store.class */ "k8Bf");
/*
  Copyright 2020 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/



class MapStateService extends _map_store_class__WEBPACK_IMPORTED_MODULE_1__["MapStore"] {
    constructor() {
        // Important ;-) MapStore needs an initial value of any empty []
        super([]);
    }
    getPoints() {
        return this.getState();
    }
    addPoint(point) {
        const c = this.getValue();
        if (typeof c !== 'undefined') {
            this.setState([...this.getValue(), point]);
        }
        else {
            this.setState([point]);
        }
    }
}
MapStateService.ɵfac = function MapStateService_Factory(t) { return new (t || MapStateService)(); };
MapStateService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: MapStateService, factory: MapStateService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MapStateService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "y08f":
/*!********************************************************************************!*\
  !*** ./src/app/modules/route-map/filter-routemap/filter-routemap.component.ts ***!
  \********************************************************************************/
/*! exports provided: FilterRouteMapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterRouteMapComponent", function() { return FilterRouteMapComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var primeng_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! primeng/button */ "jIHw");
/* harmony import */ var primeng_dropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! primeng/dropdown */ "arFO");






const _c0 = function () { return { "width": "100%", "max-width": "100%" }; };
function FilterRouteMapComponent_div_19_Template(rf, ctx) { if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "p-dropdown", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function FilterRouteMapComponent_div_19_Template_p_dropdown_ngModelChange_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r3); const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r2.event_select = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](5, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", ctx_r0.Events)("ngModel", ctx_r0.event_select)("showClear", true);
} }
function FilterRouteMapComponent_div_21_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "p-dropdown", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function FilterRouteMapComponent_div_21_Template_p_dropdown_ngModelChange_1_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r4.georeference_select = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](5, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("options", ctx_r1.Georeferences)("ngModel", ctx_r1.georeference_select)("showClear", true);
} }
class FilterRouteMapComponent {
    constructor(formBuilder) {
        this.formBuilder = formBuilder;
        this.SendFilters = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ngOnInit() {
        /*
        this.form = this.formBuilder.group({
          company: this.formBuilder.control('',  []),
          load_empty: this.formBuilder.control('',  []),
          origin: this.formBuilder.control('',  []),
          stripper: this.formBuilder.control('',  []),
          destination: this.formBuilder.control('',  []),
          consignee: this.formBuilder.control('',  []),
          last_report_station: this.formBuilder.control('',  []),
          equipment_status: this.formBuilder.control('',  []),
          equipment_type: this.formBuilder.control('',  []),
          load_status: this.formBuilder.control('',  []),
          storage_guarantee: this.formBuilder.control('',  []),
          pickup_number: this.formBuilder.control('',  []),
        });
    
        */
        this.companies_options = [
            { name: 'A', value: 1 },
            { name: 'B', value: 2 }
        ];
        this.load_emptys_options = [
            { name: 'Load', value: 1 },
            { name: 'Empty', value: 2 },
        ];
        this.equipment_status_options = [
            { name: 'A', value: 1 },
            { name: 'B', value: 2 },
            { name: 'C', value: 2 },
        ];
        this.equipment_types_options = [
            { name: 'A', value: 1 },
            { name: 'B', value: 2 },
            { name: 'C', value: 2 },
        ];
        this.load_status_options = [
            { name: 'A', value: 1 },
            { name: 'B', value: 2 },
            { name: 'C', value: 2 },
        ];
    }
    ngAfterViewInit() {
    }
    submit(event) {
        console.log(event);
    }
    verForms() {
        let keys_form = Object.keys(this.form['value']);
        let count = 0;
        for (var i = 0; i < keys_form.length; i++) {
            if (!this.isEmpty(this.form['value'][keys_form[i]])) {
                count++;
            }
        }
        return count;
    }
    getFormsInitialized() {
        let keys_form = Object.keys(this.form['value']);
        let count = 0;
        for (var i = 0; i < keys_form.length; i++) {
            if (!this.isEmpty(this.form['value'][keys_form[i]])) {
                count++;
            }
        }
        return count;
    }
    isEmpty(str) {
        return (!str || 0 === str.length);
    }
    ocultar() {
        return (this.ocultarBarra = true);
    }
    mostrar() {
        return (this.ocultarBarra = false);
    }
    send_filter() {
        let objsend = {};
        if (this.event_select != null) {
            objsend['event'] = this.event_select;
        }
        if (this.georeference_select != null) {
            objsend['georeference'] = this.georeference_select;
        }
        this.SendFilters.emit(objsend);
    }
    deleteoptions() {
        this.event_select = null;
        this.georeference_select = null;
    }
    resetFilters() {
        this.event_select = null;
        this.georeference_select = null;
        this.SendFilters.emit({});
    }
}
FilterRouteMapComponent.ɵfac = function FilterRouteMapComponent_Factory(t) { return new (t || FilterRouteMapComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"])); };
FilterRouteMapComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FilterRouteMapComponent, selectors: [["app-filterroute-map"]], inputs: { Events: "Events", Georeferences: "Georeferences" }, outputs: { ocultarBarra: "ocultarBarra", SendFilters: "SendFilters" }, decls: 30, vars: 2, consts: [[1, "row"], [1, "p-col-12"], [1, "col", "s12"], [1, "col", "s6"], [1, "col", "s3"], ["for", "groupname"], ["class", "p-inputgroup", 4, "ngIf"], ["pButton", "", "pRipple", "", "type", "button", "label", "Go", 1, "p-button-success", 3, "click"], ["pButton", "", "pRipple", "", "type", "button", "label", "Reset", 1, "p-button-danger", 3, "click"], [1, "col", "s4"], [1, "p-inputgroup"], ["optionLabel", "name", 3, "options", "ngModel", "showClear", "ngModelChange"]], template: function FilterRouteMapComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " Search By: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "label", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, " Events");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "label", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Geofences");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](19, FilterRouteMapComponent_div_19_Template, 2, 6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](21, FilterRouteMapComponent_div_21_Template, 2, 6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FilterRouteMapComponent_Template_button_click_24_listener() { return ctx.send_filter(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FilterRouteMapComponent_Template_button_click_26_listener() { return ctx.resetFilters(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](29, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.Events.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.Georeferences.length > 0);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], primeng_button__WEBPACK_IMPORTED_MODULE_3__["ButtonDirective"], primeng_dropdown__WEBPACK_IMPORTED_MODULE_4__["Dropdown"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgModel"]], styles: [".container[_ngcontent-%COMP%]{\r\n \r\n\r\n}\r\n\r\n.container-principal[_ngcontent-%COMP%]{\r\n  width: 100%;\r\n  max-width: 100%;\r\n  height:100%;\r\n  position: relative;\r\n}\r\n\r\nlabel[_ngcontent-%COMP%]{\r\n  color: black !important;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbHRlci1yb3V0ZW1hcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTtDQUNDLHFCQUFxQjs7QUFFdEI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsZUFBZTtFQUNmLFdBQVc7RUFDWCxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSx1QkFBdUI7QUFDekIiLCJmaWxlIjoiZmlsdGVyLXJvdXRlbWFwLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLmNvbnRhaW5lcntcclxuIC8qICBtYXJnaW4tdG9wOiAyJTsgKi9cclxuXHJcbn1cclxuXHJcbi5jb250YWluZXItcHJpbmNpcGFse1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIG1heC13aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6MTAwJTtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbn1cclxuXHJcbmxhYmVse1xyXG4gIGNvbG9yOiBibGFjayAhaW1wb3J0YW50O1xyXG59XHJcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FilterRouteMapComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-filterroute-map',
                templateUrl: './filter-routemap.component.html',
                styleUrls: ['./filter-routemap.component.css']
            }]
    }], function () { return [{ type: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"] }]; }, { Events: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], Georeferences: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], ocultarBarra: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], SendFilters: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }] }); })();


/***/ }),

/***/ "z9WN":
/*!*********************************************************!*\
  !*** ./src/app/core/services/map/map-custom.service.ts ***!
  \*********************************************************/
/*! exports provided: MapCustomService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapCustomService", function() { return MapCustomService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mapbox-gl */ "4ZJM");
/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mapbox_gl__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mapbox_mapbox_gl_draw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mapbox/mapbox-gl-draw */ "yugo");
/* harmony import */ var _mapbox_mapbox_gl_draw__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_mapbox_mapbox_gl_draw__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var mapbox_gl_draw_circle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mapbox-gl-draw-circle */ "4QW1");








const RadiusMode = _mapbox_mapbox_gl_draw__WEBPACK_IMPORTED_MODULE_2__["modes"].draw_line_string;
class MapCustomService {
    constructor() {
        this.mapbox = mapbox_gl__WEBPACK_IMPORTED_MODULE_1__;
        this.style = "mapbox://styles/mapbox/streets-v11";
        this.lat = 54.6542;
        this.lng = -114.8574;
        this.zoom = 5;
        this.activeTool = null;
        this.loading = false;
        this.maxLimitSearch = 10000;
        this.errorMaxSearch = false;
        this.mapbox.accessToken = 'pk.eyJ1Ijoic2FndXoiLCJhIjoiY2xjaWlkZDdpMDZvMDNycDhjcTdxd3RiMCJ9.dSledGmp6VrhJXuNzZBvCw';
    }
    buildMap() {
        return new Promise((resolve, reject) => {
            try {
                this.map = new mapbox_gl__WEBPACK_IMPORTED_MODULE_1__["Map"]({
                    container: "map",
                    style: this.style,
                    zoom: this.zoom,
                    center: [this.lng, this.lat],
                });
                const draw = new _mapbox_mapbox_gl_draw__WEBPACK_IMPORTED_MODULE_2__({
                    defaultMode: "draw_circle",
                    userProperties: true,
                    modes: Object.assign(Object.assign({}, _mapbox_mapbox_gl_draw__WEBPACK_IMPORTED_MODULE_2__["modes"]), { draw_circle: mapbox_gl_draw_circle__WEBPACK_IMPORTED_MODULE_3__, drag_circle: mapbox_gl_draw_circle__WEBPACK_IMPORTED_MODULE_3__, direct_select: mapbox_gl_draw_circle__WEBPACK_IMPORTED_MODULE_3__, simple_select: mapbox_gl_draw_circle__WEBPACK_IMPORTED_MODULE_3__ })
                });
                // Add this draw object to the map when map loads
                this.map.addControl(draw);
                /*
        
        
                this.map.on('load', () => {
                  // Add an image to use as a custom marker
                  this.map.loadImage(
                  'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                  (error, image) => {
                  if (error) throw error;
                  this.map.addImage('custom-marker', image);
                  // Add a GeoJSON source with 2 points
                  this.map.addSource('points', {
                  'type': 'geojson',
                  'data': {
                  'type': 'FeatureCollection',
                  'features': [
                  {
                  // feature for Mapbox DC
                  'type': 'Feature',
                  'geometry': {
                  'type': 'Point',
                  'coordinates': [
                  -114.857 , 54.6542
                  ]
                  },
                  'properties': {
                  'title': 'Mapbox DC'
                  }
                  },
                  {
                  // feature for Mapbox SF
                  'type': 'Feature',
                  'geometry': {
                  'type': 'Point',
                  'coordinates': [-120.857, 56.6542]
                  },
                  'properties': {
                  'title': 'Mapbox SF'
                  }
                  }
                  ]
                  }
                  });
        
                  // Add a symbol layer
                  this.map.addLayer({
                  'id': 'points',
                  'type': 'symbol',
                  'source': 'points',
                  'layout': {
                  'icon-image': 'custom-marker',
                  // get the title name from the source's "title" property
                  'text-field': ['get', 'title'],
                  'text-font': [
                  'Open Sans Semibold',
                  'Arial Unicode MS Bold'
                  ],
                  'text-offset': [0, 1.25],
                  'text-anchor': 'top'
                  }
                  });
                  }
                  );
                  });
        
                  */
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
MapCustomService.ɵfac = function MapCustomService_Factory(t) { return new (t || MapCustomService)(); };
MapCustomService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: MapCustomService, factory: MapCustomService.ɵfac, providedIn: "root" });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MapCustomService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: "root",
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var aws_amplify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! aws-amplify */ "AL3R");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./environments/environment */ "AytR");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");





let config = {
    Auth: {
        region: 'us-west-2',
        userPoolId: 'us-west-2_YKTiEMjtU',
        userPoolWebClientId: 's7ch645u8voh00dridmn8kn19',
        oauth: {
            domain: 'cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com',
            scope: ['email', 'openid'],
            redirectSignIn: window.location.href,
            redirectSignOut: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',
            responseType: 'token',
            identityProvider: 'CognitoF5',
            samlSignOut: true,
            attributesMapping: {
                email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
            }
        }
    }
};
aws_amplify__WEBPACK_IMPORTED_MODULE_1__["Amplify"].configure(config);
if (_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map