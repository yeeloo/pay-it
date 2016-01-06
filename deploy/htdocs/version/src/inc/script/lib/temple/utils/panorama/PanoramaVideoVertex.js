define(["require", "exports"], function (require, exports) {
    var PanoramaVideoVertex = (function () {
        function PanoramaVideoVertex() {
            this.value = '\
    attribute vec3 position;\
    uniform float fov;\
    uniform float yaw;\
    uniform float pitch;\
    varying float vStz;\
    varying mat3 vRot;\
    mat3 rotationMatrix(vec2 euler){\
        vec2 se=sin(euler);\
        vec2 ce=cos(euler);\
    return mat3(ce.x,0,-se.x,0,1,0,se.x,0,ce.x)*mat3(1,0,0,0,ce.y,-se.y,0,se.y,ce.y);\
    }\
    void main(){\
        vStz=0.5/tan(0.5*radians(fov));\
        vRot=rotationMatrix(radians(vec2(yaw+180.,-pitch)));\
        gl_Position=vec4(position,1.0);\
    }';
        }
        PanoramaVideoVertex.prototype.toString = function () {
            return this.value;
        };
        return PanoramaVideoVertex;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PanoramaVideoVertex;
});
