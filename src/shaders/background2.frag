#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

const float speed = 5.0;
const float density = 15.0;
const float size = 150.0;
const float colorness = 0.8;

float noi(vec2 xy) {
    return fract(tan(distance(xy * 1.618034, xy)) * xy.x) * 0.8 + 0.1;
}

vec3 sky(vec2 uve) {
    vec3 color = vec3(0.0);

    for (int i = 0; i < 4; i++) {
        float b = float(i) * 0.2;
        vec2 uv = mat2(cos(b), -sin(b), sin(b), cos(b)) * uve + u_time * speed * 0.001;

        float a = density * (1.0 + float(i) * 0.25);
        vec2 cell = floor(uv * a);
        vec2 offs = uv * a - cell;

        vec3 shift = vec3(
            noi(cell * 1.1234),
            noi(cell * 1.523 + vec2(0.37)),
            noi(cell * 1.923 + vec2(0.41))
        );

        vec2 center = cell + shift.xy;
        vec2 tocenter = uv * a - center;
        float dist = dot(tocenter, tocenter);
        float sz = shift.x * shift.y * shift.z * density * size * 0.000002;

        color += (vec3(1.0 - colorness) + shift * colorness) * min(sz / dist, 1.0);
    }

    return color;
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord / u_resolution; // Нормализованные координаты [0..1]
    vec3 col = sky(uv);
    gl_FragColor = vec4(col, 1.0);
}
