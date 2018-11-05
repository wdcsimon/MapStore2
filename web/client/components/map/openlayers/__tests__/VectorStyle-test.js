/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const expect = require('expect');
const VectorStyle = require('../VectorStyle');
const ol = require('openlayers');

describe('Test VectorStyle', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="map"></div><div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('simple point style', () => {
        const style = VectorStyle.getStyle({
            style: {
                type: 'Point',
                "Point": {
                    iconGlyph: "comment"
                }
            }
        }, true);
        expect(style).toExist();
        expect(style.getImage()).toExist();
    });

    it('style name', () => {
        const style = VectorStyle.getStyle({
            type: 'Point',
            iconUrl: 'myurl'
        });
        expect(style).toExist();
    });

    it('guess image point style', () => {
        const feature = {
              geometry: {
                  type: 'Point',
                  coordinates: [13.0, 43.0]
              },
              name: 'My Point'
        };
        const style = VectorStyle.getStyle({
            features: [feature],
            style: {
                radius: 10,
                color: 'blue'
            }
        });
        expect(style).toExist();
        expect(style.getImage()).toExist();
    });


    it('test styleFunction with LineString', () => {

        const lineString = new ol.Feature({
            geometry: new ol.geom.LineString([
                [100.0, 0.0], [101.0, 1.0]
            ])
        });

        let olStyle = VectorStyle.styleFunction(lineString);
        let olStroke = olStyle[0].getStroke();

        expect(olStroke.getColor()).toBe('blue');
        expect(olStroke.getWidth()).toBe(3);

        const options = {
            style: {
                color: '#3388ff',
                weight: 4
            }
        };

        olStyle = VectorStyle.styleFunction(lineString, options);
        olStroke = olStyle[0].getStroke();

        expect(olStroke.getColor()).toBe('#3388ff');
        expect(olStroke.getWidth()).toBe(4);

        const optionsWithFeatureType = {
            style: {
                color: '#3388ff',
                weight: 4,
                LineString: {
                    color: '#ffaa33',
                    weight: 10
                }
            }
        };

        olStyle = VectorStyle.styleFunction(lineString, optionsWithFeatureType);
        olStroke = olStyle[0].getStroke();

        expect(olStroke.getColor()).toBe('#ffaa33');
        expect(olStroke.getWidth()).toBe(10);

    });

    it('test styleFunction with MultiLineString', () => {

        const multiLineString = new ol.Feature({
            geometry: new ol.geom.MultiLineString([
                [ [100.0, 0.0], [101.0, 1.0] ],
                [ [102.0, 2.0], [103.0, 3.0] ]
            ])
        });

        let olStyle = VectorStyle.styleFunction(multiLineString);
        let olStroke = olStyle[0].getStroke();

        expect(olStroke.getColor()).toBe('blue');
        expect(olStroke.getWidth()).toBe(3);

        const options = {
            style: {
                color: '#3388ff',
                weight: 4
            }
        };

        olStyle = VectorStyle.styleFunction(multiLineString, options);
        olStroke = olStyle[0].getStroke();

        expect(olStroke.getColor()).toBe('#3388ff');
        expect(olStroke.getWidth()).toBe(4);

        const optionsWithFeatureType = {
            style: {
                color: '#3388ff',
                weight: 4,
                MultiLineString: {
                    color: '#ffaa33',
                    weight: 10
                }
            }
        };

        olStyle = VectorStyle.styleFunction(multiLineString, optionsWithFeatureType);
        olStroke = olStyle[0].getStroke();

        expect(olStroke.getColor()).toBe('#ffaa33');
        expect(olStroke.getWidth()).toBe(10);

    });

    it('test styleFunction with Polygon', () => {

        const polygon = new ol.Feature({
            geometry: new ol.geom.Polygon([
                [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ]
            ])
        });

        let olStyle = VectorStyle.styleFunction(polygon);
        let olFill = olStyle[0].getFill();
        let olStroke = olStyle[0].getStroke();

        expect(olFill.getColor()).toBe('rgba(0, 0, 255, 0.1)');
        expect(olStroke.getColor()).toBe('blue');
        expect(olStroke.getWidth()).toBe(3);
        expect(olStroke.getLineDash()).toEqual([6]);

        const options = {
            style: {
                color: '#3388ff',
                weight: 4,
                dashArray: '',
                fillColor: 'rgb(51, 136, 255)',
                fillOpacity: 0.2
            }
        };

        olStyle = VectorStyle.styleFunction(polygon, options);
        olFill = olStyle[0].getFill();
        olStroke = olStyle[0].getStroke();

        expect(olFill.getColor()).toBe('rgba(51, 136, 255, 0.2)');
        expect(olStroke.getColor()).toBe('#3388ff');
        expect(olStroke.getWidth()).toBe(4);
        expect(olStroke.getLineDash()).toEqual(['']);

        const optionsWithFeatureType = {
            style: {
                color: '#3388ff',
                weight: 4,
                dashArray: '',
                fillColor: '#3388ff',
                fillOpacity: 0.2,
                Polygon: {
                    color: '#ffaa33',
                    weight: 10,
                    dashArray: '10 5',
                    fillColor: '#333333'
                }
            }
        };

        olStyle = VectorStyle.styleFunction(polygon, optionsWithFeatureType);
        olFill = olStyle[0].getFill();
        olStroke = olStyle[0].getStroke();

        expect(olFill.getColor()).toBe('rgb(51, 51, 51)');
        expect(olStroke.getColor()).toBe('#ffaa33');
        expect(olStroke.getWidth()).toBe(10);
        expect(olStroke.getLineDash()).toEqual(['10', '5']);

    });

    it('test styleFunction with MultiPolygon', () => {

        const multiPolygon = new ol.Feature({
            geometry: new ol.geom.MultiPolygon([
                [
                    [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
                ],
                [
                    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
                    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
                ]
            ])
        });

        let olStyle = VectorStyle.styleFunction(multiPolygon);
        let olFill = olStyle[0].getFill();
        let olStroke = olStyle[0].getStroke();

        expect(olFill.getColor()).toBe('rgba(0, 0, 255, 0.1)');
        expect(olStroke.getColor()).toBe('blue');
        expect(olStroke.getWidth()).toBe(3);
        expect(olStroke.getLineDash()).toEqual([6]);

        const options = {
            style: {
                color: '#3388ff',
                weight: 4,
                dashArray: '',
                fillColor: '#3388ff',
                fillOpacity: 0.2
            }
        };

        olStyle = VectorStyle.styleFunction(multiPolygon, options);
        olFill = olStyle[0].getFill();
        olStroke = olStyle[0].getStroke();

        expect(olFill.getColor()).toBe('rgba(51, 136, 255, 0.2)');
        expect(olStroke.getColor()).toBe('#3388ff');
        expect(olStroke.getWidth()).toBe(4);
        expect(olStroke.getLineDash()).toEqual(['']);

        const optionsWithFeatureType = {
            style: {
                color: '#3388ff',
                weight: 4,
                dashArray: '',
                fillColor: '#3388ff',
                fillOpacity: 0.2,
                MultiPolygon: {
                    color: '#ffaa33',
                    weight: 10,
                    dashArray: '10 5',
                    fillColor: '#333333'
                }
            }
        };

        olStyle = VectorStyle.styleFunction(multiPolygon, optionsWithFeatureType);
        olFill = olStyle[0].getFill();
        olStroke = olStyle[0].getStroke();

        expect(olFill.getColor()).toBe('rgb(51, 51, 51)');
        expect(olStroke.getColor()).toBe('#ffaa33');
        expect(olStroke.getWidth()).toBe(10);
        expect(olStroke.getLineDash()).toEqual(['10', '5']);

    });

    it('test firstPointOfPolylineStyle defaults', () => {
        let olStyle = VectorStyle.firstPointOfPolylineStyle();
        expect(olStyle.getImage().getRadius()).toBe(5);
        expect(olStyle.getImage().getFill().getColor()).toBe("green");
    });

    it('test lastPointOfPolylineStyle defaults', () => {
        let olStyle = VectorStyle.lastPointOfPolylineStyle();
        expect(olStyle.getImage().getRadius()).toBe(5);
        expect(olStyle.getImage().getFill().getColor()).toBe("red");
    });

    it('test firstPointOfPolylineStyle {radius: 4}', () => {
        let olStyle = VectorStyle.firstPointOfPolylineStyle({radius: 4});
        expect(olStyle.getImage().getRadius()).toBe(4);
        expect(olStyle.getImage().getFill().getColor()).toBe("green");
    });

    it('test lastPointOfPolylineStyle {radius: 4}', () => {
        let olStyle = VectorStyle.lastPointOfPolylineStyle({radius: 4});
        expect(olStyle.getImage().getRadius()).toBe(4);
        expect(olStyle.getImage().getFill().getColor()).toBe("red");
    });

    it('test startEndPolylineStyle defaults', () => {
        let styles = VectorStyle.startEndPolylineStyle();
        expect(styles[0].getImage().getRadius()).toBe(5);
        expect(styles[0].getImage().getFill().getColor()).toBe("green");
        expect(styles[1].getImage().getRadius()).toBe(5);
        expect(styles[1].getImage().getFill().getColor()).toBe("red");

    it('test styleFunction with GeometryCollection', () => {

        const multiPolygon = new ol.geom.MultiPolygon([
            [
                [ [102.0, 2.0], [103.0, 2.0], [103.0, 3.0], [102.0, 3.0], [102.0, 2.0] ]
            ],
            [
                [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
                [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
            ]
        ]);

        const geometryCollection = new ol.Feature({
            geometry: new ol.geom.GeometryCollection([multiPolygon])
        });

        let olStyle = VectorStyle.styleFunction(geometryCollection);

        let olFill = olStyle[0].getFill();
        let olStroke = olStyle[0].getStroke();

        expect(olFill.getColor()).toBe('rgba(0, 0, 255, 0.1)');
        expect(olStroke.getColor()).toBe('blue');
        expect(olStroke.getWidth()).toBe(3);
        expect(olStroke.getLineDash()).toEqual([6]);

        const options = {
            style: {
                color: '#3388ff',
                weight: 4,
                dashArray: '',
                fillColor: '#3388ff',
                fillOpacity: 0.2
            }
        };

        olStyle = VectorStyle.styleFunction(geometryCollection, options);
        olFill = olStyle[0].getFill();
        olStroke = olStyle[0].getStroke();

        expect(olFill.getColor()).toBe('rgba(51, 136, 255, 0.2)');
        expect(olStroke.getColor()).toBe('#3388ff');
        expect(olStroke.getWidth()).toBe(4);
        expect(olStroke.getLineDash()).toEqual(['']);

        const optionsWithFeatureType = {
            style: {
                color: '#3388ff',
                weight: 4,
                dashArray: '',
                fillColor: '#3388ff',
                fillOpacity: 0.2,
                GeometryCollection: {
                    color: '#ffaa33',
                    weight: 10,
                    dashArray: '10 5',
                    fillColor: '#333333'
                }
            }
        };

        olStyle = VectorStyle.styleFunction(geometryCollection, optionsWithFeatureType);
        olFill = olStyle[0].getFill();
        olStroke = olStyle[0].getStroke();

        expect(olFill.getColor()).toBe('rgb(51, 51, 51)');
        expect(olStroke.getColor()).toBe('#ffaa33');
        expect(olStroke.getWidth()).toBe(10);
        expect(olStroke.getLineDash()).toEqual(['10', '5']);

    });

});
