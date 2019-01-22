defineSuite([
        'Core/SimplePolylineGeometry',
        'Core/BoundingSphere',
        'Core/Cartesian3',
        'Core/Color',
        'Core/Ellipsoid',
        'Core/LineType',
        'Core/Math',
        'Core/PrimitiveType',
        'Specs/createPackableSpecs'
    ], function(
        SimplePolylineGeometry,
        BoundingSphere,
        Cartesian3,
        Color,
        Ellipsoid,
        LineType,
        CesiumMath,
        PrimitiveType,
        createPackableSpecs) {
    'use strict';

    it('constructor throws with no positions', function() {
        expect(function() {
            return new SimplePolylineGeometry();
        }).toThrowDeveloperError();
    });

    it('constructor throws with less than two positions', function() {
        expect(function() {
            return new SimplePolylineGeometry({
                positions : [Cartesian3.ZERO]
            });
        }).toThrowDeveloperError();
    });

    it('constructor throws with invalid number of colors', function() {
        expect(function() {
            return new SimplePolylineGeometry({
                positions : [Cartesian3.ZERO, Cartesian3.UNIT_X, Cartesian3.UNIT_Y],
                colors : []
            });
        }).toThrowDeveloperError();
    });

    it('constructor computes all vertex attributes', function() {
        var positions = [new Cartesian3(1.0, 0.0, 0.0), new Cartesian3(0.0, 1.0, 0.0), new Cartesian3(0.0, 0.0, 1.0)];
        var line = SimplePolylineGeometry.createGeometry(new SimplePolylineGeometry({
            positions : positions,
            granularity : Math.PI,
            ellipsoid: Ellipsoid.UNIT_SPHERE
        }));

        expect(line.attributes.position.values).toEqualEpsilon([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0], CesiumMath.EPSILON10);
        expect(line.indices).toEqual([0, 1, 1, 2]);
        expect(line.primitiveType).toEqual(PrimitiveType.LINES);
        expect(line.boundingSphere).toEqual(BoundingSphere.fromPoints(positions));
    });

    it('constructor computes all vertex attributes for rhumb lines', function() {
        var positions = Cartesian3.fromDegreesArray([
            30, 30,
            30, 60,
            60, 60
        ]);
        var line = SimplePolylineGeometry.createGeometry(new SimplePolylineGeometry({
            positions: positions,
            granularity: Math.PI,
            ellipsoid: Ellipsoid.UNIT_SPHERE,
            lineType: LineType.RHUMB
        }));

        var cartesian3Array = [];
        Cartesian3.packArray(positions, cartesian3Array);

        expect(line.attributes.position.values).toEqualEpsilon(cartesian3Array, CesiumMath.EPSILON8);
        expect(line.indices).toEqual([0, 1, 1, 2]);
        expect(line.primitiveType).toEqual(PrimitiveType.LINES);
        expect(line.boundingSphere).toEqual(BoundingSphere.fromPoints(positions));
    });

    it('constructor computes per segment colors', function() {
        var positions = [new Cartesian3(1.0, 0.0, 0.0), new Cartesian3(0.0, 1.0, 0.0), new Cartesian3(0.0, 0.0, 1.0)];
        var colors = [new Color(1.0, 0.0, 0.0, 1.0), new Color(0.0, 1.0, 0.0, 1.0), new Color(0.0, 0.0, 1.0, 1.0)];
        var line = SimplePolylineGeometry.createGeometry(new SimplePolylineGeometry({
            positions : positions,
            colors : colors,
            granularity : Math.PI,
            ellipsoid: Ellipsoid.UNIT_SPHERE
        }));

        expect(line.attributes.color).toBeDefined();

        var numVertices = (positions.length * 2 - 2);
        expect(line.attributes.color.values.length).toEqual(numVertices * 4);
    });

    it('constructor computes per vertex colors', function() {
        var positions = [new Cartesian3(1.0, 0.0, 0.0), new Cartesian3(0.0, 1.0, 0.0), new Cartesian3(0.0, 0.0, 1.0)];
        var colors = [new Color(1.0, 0.0, 0.0, 1.0), new Color(0.0, 1.0, 0.0, 1.0), new Color(0.0, 0.0, 1.0, 1.0)];
        var line = SimplePolylineGeometry.createGeometry(new SimplePolylineGeometry({
            positions : positions,
            colors : colors,
            colorsPerVertex : true,
            granularity : Math.PI,
            ellipsoid: Ellipsoid.UNIT_SPHERE
        }));

        expect(line.attributes.color).toBeDefined();

        var numVertices = positions.length;
        expect(line.attributes.color.values.length).toEqual(numVertices * 4);
    });

    it('constructor computes all vertex attributes, no subdivision', function() {
        var positions = [new Cartesian3(), new Cartesian3(1.0, 0.0, 0.0), new Cartesian3(2.0, 0.0, 0.0)];
        var line = SimplePolylineGeometry.createGeometry(new SimplePolylineGeometry({
            positions : positions,
            followSurface: false
        }));

        expect(line.attributes.position.values).toEqual([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 2.0, 0.0, 0.0]);
        expect(line.indices).toEqual([0, 1, 1, 2]);
        expect(line.primitiveType).toEqual(PrimitiveType.LINES);
        expect(line.boundingSphere).toEqual(BoundingSphere.fromPoints(positions));
    });

    it('constructor computes per segment colors, no subdivision', function() {
        var positions = [new Cartesian3(), new Cartesian3(1.0, 0.0, 0.0), new Cartesian3(2.0, 0.0, 0.0)];
        var colors = [new Color(1.0, 0.0, 0.0, 1.0), new Color(0.0, 1.0, 0.0, 1.0), new Color(0.0, 0.0, 1.0, 1.0)];
        var line = SimplePolylineGeometry.createGeometry(new SimplePolylineGeometry({
            positions : positions,
            colors : colors,
            followSurface: false
        }));

        expect(line.attributes.color).toBeDefined();

        var numVertices = (positions.length * 2 - 2);
        expect(line.attributes.color.values.length).toEqual(numVertices * 4);
    });

    it('constructor computes per vertex colors, no subdivision', function() {
        var positions = [new Cartesian3(), new Cartesian3(1.0, 0.0, 0.0), new Cartesian3(2.0, 0.0, 0.0)];
        var colors = [new Color(1.0, 0.0, 0.0, 1.0), new Color(0.0, 1.0, 0.0, 1.0), new Color(0.0, 0.0, 1.0, 1.0)];
        var line = SimplePolylineGeometry.createGeometry(new SimplePolylineGeometry({
            positions : positions,
            colors : colors,
            colorsPerVertex : true,
            followSurface: false
        }));

        expect(line.attributes.color).toBeDefined();

        var numVertices = positions.length;
        expect(line.attributes.color.values.length).toEqual(numVertices * 4);
    });

    var positions = [new Cartesian3(1, 2, 3), new Cartesian3(4, 5, 6), new Cartesian3(7, 8, 9)];
    var line = new SimplePolylineGeometry({
        positions : positions,
        colors : [Color.RED, Color.LIME, Color.BLUE],
        colorsPerVertex : true,
        followSurface : false,
        granularity : 11,
        ellipsoid : new Ellipsoid(12, 13, 14)
    });
    var packedInstance = [3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 3, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 12, 13, 14, 1, 2, 11];
    createPackableSpecs(SimplePolylineGeometry, line, packedInstance, 'per vertex colors');

    line = new SimplePolylineGeometry({
        positions : positions,
        colorsPerVertex : false,
        followSurface : false,
        granularity : 11,
        ellipsoid : new Ellipsoid(12, 13, 14)
    });
    packedInstance = [3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 12, 13, 14, 0, 2, 11];
    createPackableSpecs(SimplePolylineGeometry, line, packedInstance);

    line = new SimplePolylineGeometry({
        positions : positions,
        width : 10.0,
        colorsPerVertex : false,
        lineType : LineType.GEODESIC,
        granularity : 11,
        ellipsoid : new Ellipsoid(12, 13, 14)
    });
    packedInstance = [3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 12, 13, 14, 0, 0, 11];
    createPackableSpecs(SimplePolylineGeometry, line, packedInstance, 'geodesic line');

    line = new SimplePolylineGeometry({
        positions : positions,
        width : 10.0,
        colorsPerVertex : false,
        lineType : LineType.RHUMB,
        granularity : 11,
        ellipsoid : new Ellipsoid(12, 13, 14)
    });
    packedInstance = [3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 12, 13, 14, 0, 1, 11];
    createPackableSpecs(SimplePolylineGeometry, line, packedInstance, 'rhumb line');

    line = new SimplePolylineGeometry({
        positions : positions,
        width : 10.0,
        colorsPerVertex : false,
        lineType : LineType.STRAIGHT,
        granularity : 11,
        ellipsoid : new Ellipsoid(12, 13, 14)
    });
    packedInstance = [3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 12, 13, 14, 0, 2, 11];
    createPackableSpecs(SimplePolylineGeometry, line, packedInstance, 'straight line');
});
