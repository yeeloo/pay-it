class PanoramaVideoFragment
{
    value = '#ifdef GL_ES\n\
        precision highp float;\n\
        #endif\n\
        uniform vec2 resolution;\
        uniform sampler2D texture;\
        const float M_PI=3.141592653589793238462643;\
        const float M_TWOPI=6.283185307179586476925286;\
        varying float vStz;\
        varying mat3 vRot;\
        vec3 toCartesian(vec2 st){\
            return normalize(vec3(st.x,st.y,vStz));\
        }\
        vec2 toSpherical(vec3 cartesianCoord){\
            vec2 st=vec2(atan(cartesianCoord.x,cartesianCoord.z),acos(cartesianCoord.y));\
            if(st.x<0.0){st.x+=M_TWOPI;}\
            return st;\
        }\
        void main(void){\
            vec2 sphericalCoord=gl_FragCoord.xy/resolution.x-vec2(0.5,0.5*resolution.y/resolution.x);\
            vec3 cartesianCoord=vRot*toCartesian(sphericalCoord);\
            gl_FragColor=texture2D(texture,toSpherical(cartesianCoord)/vec2(M_TWOPI,M_PI));\
        }';

    public toString()
    {
        return this.value;
    }
}

export default PanoramaVideoFragment;
