import { BufferGeometry } from '../../core/BufferGeometry';
import { Float32Attribute, Uint32Attribute } from '../../core/BufferAttribute';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function WireframeGeometry( geometry ) {

	BufferGeometry.call( this );

	var edge = [ 0, 0 ], hash = {};

	function sortFunction( a, b ) {

		return a - b;

	}

	var keys = [ 'a', 'b', 'c' ];

	if ( geometry && geometry.isGeometry ) {

		var vertices = geometry.vertices;
		var faces = geometry.faces;
		var numEdges = 0;

		// allocate maximal size
		var edges = new Uint32Array( 6 * faces.length );

		for ( var i = 0, l = faces.length; i < l; i ++ ) {

			var face = faces[ i ];

			for ( var j = 0; j < 3; j ++ ) {

				edge[ 0 ] = face[ keys[ j ] ];
				edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];
				edge.sort( sortFunction );

				var key = edge.toString();

				if ( hash[ key ] === undefined ) {

					edges[ 2 * numEdges ] = edge[ 0 ];
					edges[ 2 * numEdges + 1 ] = edge[ 1 ];
					hash[ key ] = true;
					numEdges ++;

				}

			}

		}


		var positionArray = new Float32Array( geometry.vertices.length * 3 );
		this.addAttribute( 'position', new Float32Attribute( positionArray, 3 ).copyVector3sArray( geometry.vertices ) );

		if ( geometry.skinIndices ) {

			var skinIndexArray = new Float32Array( geometry.skinIndices.length * 4 );
			this.addAttribute( 'skinIndex', new Float32Attribute( skinIndexArray, 4 ).copyVector4sArray( geometry.skinIndices ) );

		}

		if ( geometry.skinWeights ) {

			var skinWeightArray = new Float32Array( geometry.skinWeights.length * 4 );
			this.addAttribute( 'skinWeight', new Float32Attribute( skinWeightArray, 4 ).copyVector4sArray( geometry.skinWeights ) );

		}

		this.setIndex( new Uint32Attribute( edges.slice( 0, 2 * numEdges ), 1 ) );

	} else if ( geometry && geometry.isBufferGeometry ) {

		if ( geometry.index !== null ) {

			// Indexed BufferGeometry

			var indices = geometry.index.array;
			var vertices = geometry.attributes.position;
			var groups = geometry.groups;
			var numEdges = 0;

			if ( groups.length === 0 ) {

				geometry.addGroup( 0, indices.length );

			}

			// allocate maximal size
			var edges = new Uint32Array( 2 * indices.length );

			for ( var o = 0, ol = groups.length; o < ol; ++ o ) {

				var group = groups[ o ];

				var start = group.start;
				var count = group.count;

				for ( var i = start, il = start + count; i < il; i += 3 ) {

					for ( var j = 0; j < 3; j ++ ) {

						edge[ 0 ] = indices[ i + j ];
						edge[ 1 ] = indices[ i + ( j + 1 ) % 3 ];
						edge.sort( sortFunction );

						var key = edge.toString();

						if ( hash[ key ] === undefined ) {

							edges[ 2 * numEdges ] = edge[ 0 ];
							edges[ 2 * numEdges + 1 ] = edge[ 1 ];
							hash[ key ] = true;
							numEdges ++;

						}

					}

				}

			}

			this.setIndex( new Uint32Attribute( edges.slice( 0, 2 * numEdges ), 1 ) );

		} else {

			// non-indexed BufferGeometry

			var vertices = geometry.attributes.position.array;
			var numEdges = vertices.length / 3;
			var numTris = numEdges / 3;

			var edges = new Uint32Array( numEdges * 2 );

			for ( var i = 0, l = numTris; i < l; i ++ ) {

				for ( var j = 0; j < 3; j ++ ) {

					var index = 6 * i + 2 * j;
					var index1 = 3 * i + j;
					var index2 = 3 * i + ( ( j + 1 ) % 3 );
					edges[ index ] = index1;
					edges[ index + 1 ] = index2;

				}

			}

			this.setIndex( new Uint32Attribute( edges, 1 ) );

		}

		var attributes = [ 'position', 'skinIndex', 'skinWeight' ];

		for ( var a = 0, al = attributes.length; a < al; a ++ ) {

			var attributeName = attributes[ a ];
			var attribute = geometry.getAttribute( attributeName );

			if ( attribute ) {

				this.addAttribute( attributeName, attribute.clone() );

			}

		}

	}

}

WireframeGeometry.prototype = Object.create( BufferGeometry.prototype );
WireframeGeometry.prototype.constructor = WireframeGeometry;


export { WireframeGeometry };
