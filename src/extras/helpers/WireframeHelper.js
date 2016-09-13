import { LineSegments } from '../../objects/LineSegments';
import { LineBasicMaterial } from '../../materials/LineBasicMaterial';
import { WireframeGeometry } from '../geometries/WireframeGeometry';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function WireframeHelper( object, hex ) {

	var color = ( hex !== undefined ) ? hex : 0xffffff;

	var skinned = object.skeleton !== undefined;

	LineSegments.call( this, new WireframeGeometry( object.geometry ), new LineBasicMaterial( { color: color, skinning: skinned } ) );

	if ( skinned ) {

		this.skeleton = object.skeleton;
		this.bindMatrix = object.bindMatrix;
		this.bindMatrixInverse = object.bindMatrixInverse;

	}

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

}

WireframeHelper.prototype = Object.create( LineSegments.prototype );
WireframeHelper.prototype.constructor = WireframeHelper;

WireframeHelper.prototype.isSkinnedMesh = function () {

	return this.skeleton !== undefined;

};


export { WireframeHelper };
